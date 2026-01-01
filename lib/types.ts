// lib/types.ts

export type Health = "excellent" | "good" | "warning" | "critical";
export type Trend = "up" | "down" | "stable";

export interface AlertsDashboardResponse {
  windows: {
    primary: string;
    compare: string;
  };
  kpis: {
    mttrMinutes: number;
    alertsPerDay: number;
    health: Health;
  };
  trends: {
    mttr: Trend;
    alertsPerDay: Trend;
  };
}
