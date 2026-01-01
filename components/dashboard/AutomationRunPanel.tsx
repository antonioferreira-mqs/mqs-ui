"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./AutomationRunPanel.module.css";

import {
  fetchAutomationRules,
  previewAutomationRule,
  runAutomationRule,
} from "@/lib/automations.api";

import type {
  AlertAutomationRuleListItem,
  AutomationPreviewResult,
} from "@/lib/automations.types";

import { AutomationConfirmModal } from "./AutomationConfirmModal";

type Props = {
  onAfterRun?: () => void; // refresh overview / health
};

export function AutomationRunPanel({ onAfterRun }: Props) {
  const [rules, setRules] = useState<AlertAutomationRuleListItem[]>([]);
  const [selectedRuleId, setSelectedRuleId] = useState<number | null>(null);

  const [preview, setPreview] = useState<AutomationPreviewResult | null>(null);
  const [loadingRules, setLoadingRules] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🆕 confirmação
  const [confirming, setConfirming] = useState(false);

  const selectedRule = useMemo(
    () => rules.find((r) => r.id === selectedRuleId) ?? null,
    [rules, selectedRuleId]
  );

  async function loadRules() {
    setLoadingRules(true);
    setError(null);

    try {
      const data = await fetchAutomationRules();
      setRules(data);

      if (data.length > 0 && selectedRuleId === null) {
        setSelectedRuleId(data[0].id);
      }
    } catch {
      setError("Não foi possível carregar regras de automação.");
    } finally {
      setLoadingRules(false);
    }
  }

  useEffect(() => {
    loadRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handlePreview() {
    if (!selectedRule) return;

    setLoadingPreview(true);
    setError(null);
    setPreview(null);

    try {
      const data = await previewAutomationRule({
        preset: selectedRule.preset,
        action: selectedRule.action,
        limit: selectedRule.limit ?? 10,
      });
      setPreview(data);
    } catch {
      setError("Falha no preview da regra.");
    } finally {
      setLoadingPreview(false);
    }
  }

  /**
   * 👉 Clique em "Executar regra"
   * Apenas abre o modal
   */
  function handleRun() {
    if (!selectedRule) return;
    setConfirming(true);
  }

  /**
   * ✅ Confirmação no modal
   * Aqui sim executa a regra
   */
  async function handleConfirmedRun() {
    if (!selectedRule) return;

    setRunning(true);
    setError(null);

    try {
      await runAutomationRule(selectedRule.id);
      await loadRules();      // refresh estado das regras
      onAfterRun?.();         // refresh overview / health
      setPreview(null);       // evita preview desatualizado
    } catch {
      setError("Falha ao executar a regra.");
    } finally {
      setRunning(false);
      setConfirming(false);
    }
  }

  return (
    <>
      {/* 🧠 Modal de confirmação */}
      {confirming && selectedRule && (
        <AutomationConfirmModal
          rule={selectedRule}
          loading={running}
          onCancel={() => setConfirming(false)}
          onConfirm={handleConfirmedRun}
        />
      )}

      <div className={styles.card}>
        <div className={styles.header}>
          <h2>Execução seletiva</h2>
          <button
            className={styles.small}
            onClick={loadRules}
            disabled={loadingRules}
          >
            {loadingRules ? "A atualizar…" : "Atualizar"}
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.row}>
          <label className={styles.label}>Regra</label>
          <select
            className={styles.select}
            value={selectedRuleId ?? ""}
            onChange={(e) => setSelectedRuleId(Number(e.target.value))}
            disabled={loadingRules || rules.length === 0}
          >
            {rules.map((r) => (
              <option key={r.id} value={r.id}>
                #{r.id} — {r.preset} / {r.action}{" "}
                {!r.enabled ? "(disabled)" : ""}
              </option>
            ))}
          </select>
        </div>

        {selectedRule && (
          <div className={styles.meta}>
            <span>dryRun: {String(selectedRule.dryRun)}</span>
            <span>limit: {String(selectedRule.limit ?? 10)}</span>
            <span>enabled: {String(selectedRule.enabled)}</span>
            {selectedRule.lastStatus && (
              <span>last: {selectedRule.lastStatus}</span>
            )}
          </div>
        )}

        <div className={styles.actions}>
          <button
            className={styles.button}
            onClick={handlePreview}
            disabled={!selectedRule || loadingPreview || running}
          >
            {loadingPreview ? "A gerar preview…" : "Preview"}
          </button>

          <button
            className={styles.primary}
            onClick={handleRun}
            disabled={!selectedRule || running || !selectedRule.enabled}
            title={
              !selectedRule?.enabled
                ? "Regra está desativada"
                : "Executar regra"
            }
          >
            {running ? "A executar…" : "Executar regra"}
          </button>
        </div>

        {preview && (
          <div className={styles.preview}>
            <div className={styles.previewRow}>
              <strong>Matched:</strong> {preview.totalMatched}
            </div>
            <div className={styles.previewRow}>
              <strong>Would affect:</strong> {preview.wouldAffect}
            </div>
            <div className={styles.previewRow}>
              <strong>Limited:</strong> {String(preview.limited)}
            </div>

            {preview.sample?.length > 0 && (
              <>
                <div className={styles.previewTitle}>Sample</div>
                <ul className={styles.sample}>
                  {preview.sample.map((a) => (
                    <li key={a.id}>
                      #{a.id} — {a.type} — {a.severity} — {a.status}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
