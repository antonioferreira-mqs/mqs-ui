export type AlertActionPermission = {
  allowed: boolean;
  bulkAllowed: boolean;
};

export type WorkspaceAlert = {
  id: number;
  workspaceId: number;
  type: string;
  severity: string;
  status: string;
  snapshot: unknown;

  acknowledgedBy: number | null;
  acknowledgedAt: string | null;

  firstDetectedAt: string;
  lastDetectedAt: string;
  occurrencesCount: number;

  resolvedAt: string | null;
  resolutionTimeMs: number | null;

  createdAt: string;

  actions: {
    acknowledge: AlertActionPermission;
    archive: AlertActionPermission;
  };
};

export type AlertsListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  sortBy: string;
  sortDir: "asc" | "desc";
  filters: {
    status: string | null;
    severity: string | null;
    type: string | null;
  };
};

export type AlertsListResponse = {
  status: "ok";
  data: WorkspaceAlert[];
  meta: AlertsListMeta;
};
