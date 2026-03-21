import { appConfig } from "@/lib/app-config";
import { BackendStatusSnapshot, BackendSystemStatus } from "@/types/system";

const statusPath = "/api/v1/system/status";

export async function getBackendStatusSnapshot(): Promise<BackendStatusSnapshot> {
  const checkedAt = new Date().toISOString();

  try {
    const response = await fetch(`${appConfig.backendBaseUrl}${statusPath}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(2500)
    });

    if (!response.ok) {
      return {
        ok: false,
        backendBaseUrl: appConfig.backendBaseUrl,
        checkedAt,
        data: null,
        message: `Backend returned ${response.status}.`
      };
    }

    const data = (await response.json()) as BackendSystemStatus;
    return {
      ok: true,
      backendBaseUrl: appConfig.backendBaseUrl,
      checkedAt,
      data,
      message: "Backend connection healthy."
    };
  } catch {
    return {
      ok: false,
      backendBaseUrl: appConfig.backendBaseUrl,
      checkedAt,
      data: null,
      message: "Backend unavailable. Start the FastAPI service to enable live status."
    };
  }
}

