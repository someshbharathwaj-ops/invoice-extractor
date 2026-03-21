export interface BackendSystemStatus {
  status: string;
  service: string;
  environment: string;
  timestamp: string;
  storage: {
    root: string;
    uploads: string;
    results: string;
  };
  queue: {
    backend: string;
  };
  invoices: {
    total: number;
    by_status: Record<string, number>;
  };
  metrics: Record<string, unknown>;
}

export interface BackendStatusSnapshot {
  ok: boolean;
  backendBaseUrl: string;
  checkedAt: string;
  data: BackendSystemStatus | null;
  message: string;
}

