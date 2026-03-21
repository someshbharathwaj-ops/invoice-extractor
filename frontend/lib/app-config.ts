const defaultBackendUrl = "http://127.0.0.1:8000";

function normalizeBaseUrl(rawValue: string | undefined): string {
  const candidate = (rawValue ?? defaultBackendUrl).trim();
  return candidate.replace(/\/+$/, "");
}

export const appConfig = {
  backendBaseUrl: normalizeBaseUrl(process.env.NEXT_PUBLIC_BACKEND_URL),
  maxUploadSizeMb: 20
} as const;

