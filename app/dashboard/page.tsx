"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./dashboard.module.css";

import { fetchAlertsDashboard } from "@/lib/api";
import { fetchAutomationOverview } from "@/lib/automations.api";

import { HealthCard } from "@/components/dashboard/HealthCard";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { AutomationHealthCard } from "@/components/dashboard/AutomationHealthCard";
import { AutomationRunPanel } from "@/components/dashboard/AutomationRunPanel";

import { AlertsDashboardResponse } from "@/lib/types";
import { AutomationOverview } from "@/lib/automations.types";

import { RequireAuth } from "@/components/auth/RequireAuth";

function DashboardContent() {
  const [data, setData] = useState<AlertsDashboardResponse | null>(null);
  const [automation, setAutomation] =
    useState<AutomationOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 📊 Analytics (alertas)
  useEffect(() => {
    fetchAlertsDashboard()
      .then(setData)
      .catch(() => setError("Erro ao carregar dashboard"));
  }, []);

  // 🤖 Automations overview
  const loadAutomation = useCallback(() => {
    fetchAutomationOverview()
      .then(setAutomation)
      .catch(() => setAutomation(null));
  }, []);

  useEffect(() => {
    loadAutomation();
  }, [loadAutomation]);

  if (error) {
    return <p className={styles.empty}>{error}</p>;
  }

  if (!data) {
    return <p className={styles.empty}>A carregar…</p>;
  }

  const isEmpty =
    data.kpis.mttrMinutes === 0 && data.kpis.alertsPerDay === 0;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
      </header>

      {/* 🤖 Estado das automações */}
      {automation && (
        <section className={styles.grid}>
          <AutomationHealthCard
            data={automation}
            onRefresh={loadAutomation}
          />
          <AutomationRunPanel onAfterRun={loadAutomation} />
        </section>
      )}

      {/* 📭 Sem dados analíticos */}
      {isEmpty && (
        <p className={styles.empty}>
          Sem dados suficientes para análise.
        </p>
      )}

      {/* 📊 KPIs de alertas */}
      {!isEmpty && (
        <section className={styles.grid}>
          <HealthCard health={data.kpis.health} />

          <div className={styles.kpis}>
            <KpiCard
              title="MTTR (min)"
              value={data.kpis.mttrMinutes}
              trend={data.trends.mttr}
            />
            <KpiCard
              title="Alertas / dia"
              value={data.kpis.alertsPerDay}
              trend={data.trends.alertsPerDay}
            />
          </div>
        </section>
      )}
    </main>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
