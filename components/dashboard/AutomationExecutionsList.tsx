"use client";

import { useEffect, useState } from "react";
import styles from "./AutomationExecutionsList.module.css";
import { fetchLatestAutomationExecutions } from "@/lib/automations.api";
import type { AutomationExecution } from "@/lib/automations.types";

export function AutomationExecutionsList() {
  const [items, setItems] = useState<AutomationExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestAutomationExecutions(10)
      .then(setItems)
      .catch(() => setError("Erro ao carregar execuções"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>A carregar execuções…</p>;
  if (error) return <p>{error}</p>;
  if (items.length === 0) return <p>Sem execuções recentes.</p>;

  return (
    <div className={styles.card}>
      <h3>Execuções recentes</h3>

      <ul className={styles.list}>
        {items.map((e) => (
          <li key={e.id} className={styles.item}>
            <div>
              <strong>#{e.id}</strong> — regra {e.ruleId}
            </div>

            <div className={styles.meta}>
              <span>Status: {e.status}</span>
              <span>
                {new Date(e.executedAt).toLocaleString()}
              </span>
            </div>

            {e.error && (
              <div className={styles.error}>
                {e.error}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
