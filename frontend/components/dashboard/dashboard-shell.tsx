"use client";

import { CompareDialog } from "@/components/dashboard/compare-dialog";
import { ExplainabilityPanel } from "@/components/dashboard/explainability-panel";
import { FieldGrid } from "@/components/dashboard/field-grid";
import { HistoryTimeline } from "@/components/dashboard/history-timeline";
import { InsightCards } from "@/components/dashboard/insight-cards";
import { JsonViewer } from "@/components/dashboard/json-viewer";
import { ResultsTable } from "@/components/dashboard/results-table";
import { AnalyticsOverview } from "@/components/analytics/analytics-overview";
import { Button } from "@/components/ui/button";

export function DashboardShell() {
  return (
    <div id="results" className="space-y-6 scroll-mt-24">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Results workspace</p>
          <h2 className="font-display text-3xl">AI extraction control center</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <CompareDialog />
          <Button variant="outline">Export CSV</Button>
          <Button>Ship to ERP</Button>
        </div>
      </div>
      <InsightCards />
      <AnalyticsOverview />
      <ResultsTable />
      <FieldGrid />
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <JsonViewer />
        <ExplainabilityPanel />
      </div>
      <HistoryTimeline />
    </div>
  );
}
