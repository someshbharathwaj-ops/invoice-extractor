"use client";

import { Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvoiceStore } from "@/store/use-invoice-store";

export function HistoryTimeline() {
  const { invoices, selectInvoice } = useInvoiceStore((state) => ({
    invoices: state.invoices,
    selectInvoice: state.selectInvoice
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>History timeline</CardTitle>
        <CardDescription>Recent invoice runs across the workspace with status-aware surfacing.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {invoices.map((invoice) => (
          <button
            key={invoice.id}
            className="flex w-full items-start gap-4 rounded-2xl border border-border bg-background/50 p-4 text-left transition hover:bg-secondary/40"
            onClick={() => selectInvoice(invoice.id)}
          >
            <div className="rounded-full bg-secondary p-3">
              <Clock3 className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{invoice.fileName}</p>
                <Badge variant={invoice.status === "processed" ? "success" : invoice.status === "review" ? "warning" : "danger"}>
                  {invoice.status}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{invoice.summary}</p>
              <p className="mt-2 text-xs text-muted-foreground">{new Date(invoice.extractedAt).toLocaleString()}</p>
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
