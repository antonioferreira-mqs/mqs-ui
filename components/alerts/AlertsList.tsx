"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAlerts, acknowledgeAlert } from "@/lib/alerts.api";
import { useRouter, useSearchParams } from "next/navigation";

import type { WorkspaceAlert } from "@/lib/alerts.types";

/* =====================
   Tipos auxiliares
===================== */

type Severity = "critical" | "high" | "warning" | "info";
type Status = "open" | "acknowledged" | "resolved";

/* =====================
   Helpers
===================== */

function severityColor(severity: Severity) {
  switch (severity) {
    case "critical":
      return "red";
    case "high":
      return "orange";
    case "warning":
      return "gold";
    default:
      return "gray";
  }
}

function statusLabel(status: Status) {
  switch (status) {
    case "open":
      return "Aberto";
    case "acknowledged":
      return "Confirmado";
    case "resolved":
      return "Resolvido";
    default:
      return status;
  }
}

/* =====================
   Component
===================== */

export function AlertsList() {
  const [alerts, setAlerts] = useState<WorkspaceAlert[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runningBulk, setRunningBulk] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [filters, setFilters] = useState<{    status?: Status;    severity?: Severity;    type?: string;  }>({});
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
} | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();


  useEffect(() => {
  const status = searchParams.get("status") as Status | null;
  const pageParam = searchParams.get("page");

  if (status) {
    setFilters((f) => ({ ...f, status }));
  }

  if (pageParam) {
    const p = Number(pageParam);
    if (!Number.isNaN(p) && p > 0) {
      setPage(p);
    }
  }
}, []);

useEffect(() => {
  const params = new URLSearchParams();

  if (filters.status) params.set("status", filters.status);
  if (page > 1) params.set("page", String(page));

  router.replace(`?${params.toString()}`, { scroll: false });
}, [filters.status, page, router]);

  /* =====================
     Load
  ===================== */

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      setError(null);
      if (!silent) setLoading(true);


      try {
        const res = await fetchAlerts({
          page,
          limit: 20,
          status: filters.status,
          severity: filters.severity,
          type: filters.type,
        });

        setAlerts(res.data);
        setMeta(res.meta);
        setSelected([]);
        setLastUpdatedAt(new Date());
      } catch {
        if (!silent) setError("Erro ao carregar alertas");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [filters, page]
  );

  // Primeiro load
  useEffect(() => {
    load();
  }, [load]);

  // 🔄 Auto-refresh a cada 30s (pausa durante bulk ACK)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!runningBulk) {
        load(true);
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, [load, runningBulk]);


  /* =====================
     Actions
  ===================== */

  async function handleAck(alertId: number) {
    try {
      await acknowledgeAlert(alertId);
      await load();
    } catch {
      alert("Falha ao confirmar alerta");
    }
  }

  function toggle(id: number) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  }

  const selectableAlerts = alerts.filter(
    (a) => a.actions.acknowledge.allowed
  );

  const selectableIds = new Set(selectableAlerts.map(a => a.id));
const bulkAllowed =
  selected.length > 0 &&
  selected.every(id => selectableIds.has(id));


  async function handleBulkAck() {
    if (!bulkAllowed) return;

    setRunningBulk(true);
    try {
      for (const id of selected) {
        await acknowledgeAlert(id);
      }
      await load();
    } catch {
      alert("Falha ao confirmar alertas selecionados");
    } finally {
      setRunningBulk(false);
    }
  }

  /* =====================
     Render guards
  ===================== */

  if (loading) return <p>A carregar alertas…</p>;
  if (error) return <p>{error}</p>;
  if (alerts.length === 0) return <p>Sem alertas.</p>;

  /* =====================
     Render
  ===================== */

  return (
    <div>
      <h3>Alertas</h3>

      {bulkAllowed && (
        <button onClick={handleBulkAck} disabled={runningBulk}>
          {runningBulk
            ? "A confirmar…"
            : `Confirmar ${selected.length} selecionados`}
        </button>
      )}

      {/* Filtro por estado */}
      <div style={{ marginBottom: 12 }}>
        <select
          value={filters.status ?? ""}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              status: (e.target.value as Status) || undefined,
            }))
          }
        >
          <option value="">Todos os estados</option>
          <option value="open">Open</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="resolved">Resolved</option>
        </select>

        {lastUpdatedAt && (
          <small
            style={{
              opacity: 0.6,
              display: "block",
              marginTop: 4,
            }}
          >
            Atualizado há{" "}
            {Math.floor(
              (Date.now() - lastUpdatedAt.getTime()) / 1000
            )}
            s
          </small>
        )}
      </div>

      {/* Paginação */}
      {meta && (
        <div style={{ marginBottom: 12, display: "flex", gap: 8 }}>
          <button
            disabled={!meta.hasPrev || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Anterior
          </button>

          <span>
            Página {page} de {meta.totalPages}
          </span>

          <button
            disabled={!meta.hasNext || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Seguinte →
          </button>
        </div>
      )}

      <ul>
        {alerts.map((a) => {
          const canAck = a.actions.acknowledge.allowed;

          return (
            <li key={a.id}>
              <label>
                {canAck && (
                  <input
                    type="checkbox"
                    disabled={runningBulk}
                    checked={selected.includes(a.id)}
                    onChange={() => toggle(a.id)}
                  />
                )}

                <strong>{a.type}</strong>{" "}
                <span
                  style={{
                    color: severityColor(a.severity as Severity),
                    fontWeight: 600,
                  }}
                >
                  {a.severity}
                </span>{" "}
                — {statusLabel(a.status as Status)}
              </label>

              {canAck && (
                <button
                  onClick={() => handleAck(a.id)}
                  disabled={runningBulk}
                  style={{ marginLeft: 8 }}
                >
                  Confirmar
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
