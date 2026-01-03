import type { AlertsListResponse } from "./alerts.types";

export async function fetchAlerts(params?: {
  page?: number;
  limit?: number;
  status?: string;
  severity?: string;
  type?: string;
}) {
  const search = new URLSearchParams();

  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.status) search.set("status", params.status);
  if (params?.severity) search.set("severity", params.severity);
  if (params?.type) search.set("type", params.type);

  const res = await fetch(`/api/alerts?${search.toString()}`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Falha ao carregar alertas");
  }

  const json: AlertsListResponse = await res.json();
  return json;
}

export async function acknowledgeAlert(alertId: number) {
  const res = await fetch(`/api/alerts/${alertId}/ack`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Falha ao fazer ACK do alerta");
  }

  return res.json();
}
