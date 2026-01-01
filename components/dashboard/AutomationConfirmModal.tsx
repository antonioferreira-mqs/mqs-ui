"use client";

import styles from "./AutomationConfirmModal.module.css";
import type { AlertAutomationRuleListItem } from "@/lib/automations.types";

type Props = {
  rule: AlertAutomationRuleListItem;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

export function AutomationConfirmModal({
  rule,
  onConfirm,
  onCancel,
  loading = false,
}: Props) {
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>Confirmar execução</h3>

        <p>
          Estás prestes a executar a regra:
        </p>

        <ul className={styles.meta}>
          <li>
            <strong>Preset:</strong> {rule.preset}
          </li>
          <li>
            <strong>Ação:</strong> {rule.action}
          </li>
          <li>
            <strong>dryRun:</strong>{" "}
            {rule.dryRun ? "Sim (simulação)" : "Não (execução real)"}
          </li>
          {rule.limit != null && (
            <li>
              <strong>Limite:</strong> {rule.limit}
            </li>
          )}
        </ul>

        {!rule.dryRun && (
          <p className={styles.warning}>
            ⚠️ Esta ação pode alterar o estado dos alertas.
          </p>
        )}

        <div className={styles.actions}>
          <button onClick={onCancel} disabled={loading}>
            Cancelar
          </button>

          <button
            className={styles.primary}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "A executar…" : "Confirmar execução"}
          </button>
        </div>
      </div>
    </div>
  );
}
