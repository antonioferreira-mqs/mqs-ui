import {
  AutomationOverview,
  AlertAutomationRuleListItem,
  AutomationPreviewResult,
} from "./automations.types";

// 🔎 Overview geral (health + métricas)
export async function fetchAutomationOverview(): Promise<AutomationOverview> {
  const res = await fetch("/api/automations/overview", {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch automation overview");
  }

  const json = await res.json();
  return json.data;
}

// ▶️ Executar todas as automações (runner global)
export async function runAutomationsNow() {
  const res = await fetch("/api/alerts/automations/run", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Falha ao executar automações");
  }

  const json = await res.json();
  return json.data;
}

// 📋 Listar regras de automação
export async function fetchAutomationRules(): Promise<
  AlertAutomationRuleListItem[]
> {
  const res = await fetch("/api/alerts/automations", {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Falha ao carregar regras de automação");
  }

  const json = await res.json();
  return json.data;
}

// 👁️ Preview seguro de uma regra
export async function previewAutomationRule(payload: {
  preset: string;
  action: string;
  limit?: number;
}): Promise<AutomationPreviewResult> {
  const res = await fetch("/api/alerts/automations/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Falha ao fazer preview da regra");
  }

  const json = await res.json();
  return json.data;
}

// ▶️ Executar uma regra específica
export async function runAutomationRule(ruleId: number) {
  const res = await fetch("/api/alerts/automations/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ ruleId }),
  });

  if (!res.ok) {
    throw new Error("Falha ao executar regra");
  }

  const json = await res.json();
  return json.data;
}
