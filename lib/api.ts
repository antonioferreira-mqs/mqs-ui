import { AlertsDashboardResponse } from "./types";

export async function fetchAlertsDashboard(): Promise<AlertsDashboardResponse> {
  const res = await fetch("/api/analytics/alerts/dashboard", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch alerts dashboard");
  }

  const json = await res.json();
  return json.data;
}
