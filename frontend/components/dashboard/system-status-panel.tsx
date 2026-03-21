import { CheckCircle2, HardDrive, Radio, ServerCrash } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBackendStatusSnapshot } from "@/lib/system-status";

export async function SystemStatusPanel() {
  const snapshot = await getBackendStatusSnapshot();
  const data = snapshot.data;
  const statusEntries = Object.entries(data?.invoices.by_status ?? {});

  return (
    <Card>
      <CardHeader className="gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <CardTitle>System status</CardTitle>
          <CardDescription>Live backend connectivity and storage snapshot for the FastAPI service.</CardDescription>
        </div>
        <Badge variant={snapshot.ok ? "success" : "warning"} className="w-fit">
          {snapshot.ok ? "Backend connected" : "Backend offline"}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-background/60 p-4">
            <div className="flex items-start gap-3">
              <div className={`rounded-2xl p-3 ${snapshot.ok ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                {snapshot.ok ? <CheckCircle2 className="h-5 w-5" /> : <ServerCrash className="h-5 w-5" />}
              </div>
              <div className="space-y-1">
                <p className="font-medium">{snapshot.message}</p>
                <p className="text-sm text-muted-foreground">Backend URL: {snapshot.backendBaseUrl}</p>
                <p className="text-sm text-muted-foreground">Checked at: {new Date(snapshot.checkedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-background/50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Invoices</p>
              <p className="mt-2 font-display text-3xl">{data?.invoices.total ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Queue</p>
              <p className="mt-2 font-display text-3xl">{data?.queue.backend ?? "n/a"}</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Environment</p>
              <p className="mt-2 font-display text-3xl">{data?.environment ?? "offline"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-border bg-background/50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <HardDrive className="h-4 w-4" />
              Storage
            </div>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p>Root: {data?.storage.root ?? "Unavailable"}</p>
              <p>Uploads: {data?.storage.uploads ?? "Unavailable"}</p>
              <p>Results: {data?.storage.results ?? "Unavailable"}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background/50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Radio className="h-4 w-4" />
              Status mix
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {statusEntries.length ? (
                statusEntries.map(([status, count]) => (
                  <Badge key={status} variant="neutral" className="bg-background/80">
                    {status}: {count}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No processed invoices reported yet.</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

