export type UiHealth = "ok" | "warning" | "critical";

export interface AutomationOverview {
  uiHealth: UiHealth;
  systemHealth: {
    status: "healthy" | "degraded" | "limited";
    reason: string | null;
  };
  metrics: {
    total: number;
    success: number;
    failed: number;
    skipped: number;
  };
  lastExecution: {
    id: number;
    ruleId: number;
    status: string;
    executedAt: string;
    affectedCount: number;
    durationMs: number | null;
    error: string | null;
  } | null;
  canExecute: boolean;
}

export interface AlertAutomationRuleListItem {
  id: number;
  preset: string;
  action: string;
  enabled: boolean;
  dryRun: boolean;
  limit?: number | null;
  allowUnsafe?: boolean | null;
  lastRunAt?: string | null;
  lastStatus?: string | null;
  lastError?: string | null;
}

export interface AutomationPreviewResult {
  preset: string;
  action: string;
  limit: number;
  totalMatched: number;
  wouldAffect: number;
  limited: boolean;
  sample: Array<{
    id: number;
    status: string;
    severity: string;
    type: string;
  }>;
}
