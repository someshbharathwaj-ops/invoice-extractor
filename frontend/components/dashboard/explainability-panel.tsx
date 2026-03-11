"use client";

import { ChevronRight, FileSearch2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useInvoiceStore } from "@/store/use-invoice-store";

export function ExplainabilityPanel() {
  const invoice = useInvoiceStore((state) =>
    state.invoices.find((item) => item.id === state.selectedInvoiceId) || state.invoices[0]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI explainability</CardTitle>
        <CardDescription>Retrieved chunks, reasoning flow, and verification trace for the selected invoice.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-[1.75rem] border border-border bg-background/50 p-5">
          <div className="flex items-center gap-2 text-sm text-sky-300">
            <FileSearch2 className="h-4 w-4" />
            Retrieved context
          </div>
          <div className="mt-4 space-y-3">
            {invoice.retrievedChunks.map((chunk) => (
              <div key={chunk.id} className="rounded-2xl border border-border bg-background/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{chunk.title}</p>
                  <Badge variant="neutral">Page {chunk.page}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{chunk.excerpt}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-sky-300">
                  <span>Retriever score</span>
                  <div className="h-1.5 flex-1 rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300" style={{ width: `${chunk.score * 100}%` }} />
                  </div>
                  <span>{Math.round(chunk.score * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Reasoning flow</p>
          {invoice.reasoning.map((step) => (
            <div key={step.id} className="flex gap-4 rounded-2xl border border-border bg-background/50 p-4">
              <div className="mt-1 rounded-full bg-sky-500/10 p-2 text-sky-300">
                <ChevronRight className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-medium">{step.title}</p>
                  <Badge variant="success">{step.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
