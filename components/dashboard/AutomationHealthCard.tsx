"use client";

import { useState } from "react";
import styles from "./AutomationHealthCard.module.css";
import { AutomationOverview } from "@/lib/automations.types";
import { runAutomationsNow } from "@/lib/automations.api";

interface Props {
  data: AutomationOverview;
  onRefresh?: () => void;
}

export function AutomationHealthCard({ data, onRefresh }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRun() {
    setLoading(true);
    setError(null);

    try {
      await runAutomationsNow();
      onRefresh?.();
    } catch (e) {
      setError("Não foi possível executar as automações.");
    } finally {
      setLoading(false);
    }
  }

  const disabled = !data.canExecute || loading;

  return (
    <div className={`${styles.card} ${styles[data.uiHealth]}`}>
      <div className={styles.header}>
        <h2>Automações</h2>
        <span className={styles.badge}>{data.uiHealth.toUpperCase()}</span>
      </div>

      {data.systemHealth.reason && (
        <p className={styles.reason}>{data.systemHealth.reason}</p>
      )}

      {error && <p className={styles.reason}>{error}</p>}

      <button
        className={styles.action}
        onClick={handleRun}
        disabled={disabled}
      >
        {loading ? "A executar…" : "Executar agora"}
      </button>
    </div>
  );
}
