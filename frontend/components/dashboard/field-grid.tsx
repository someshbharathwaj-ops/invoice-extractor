"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvoiceStore } from "@/store/use-invoice-store";

export function FieldGrid() {
  const invoice = useInvoiceStore((state) =>
    state.invoices.find((item) => item.id === state.selectedInvoiceId) || state.invoices[0]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Structured extraction fields</CardTitle>
        <CardDescription>Field-level confidence for downstream finance review and approval.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {invoice.fields.map((field) => (
          <div key={field.label} className="rounded-[1.5rem] border border-border bg-background/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{field.label}</p>
            <p className="mt-3 font-display text-xl">{field.value}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-sky-300">
              <div className="h-1.5 flex-1 rounded-full bg-secondary">
                <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300" style={{ width: `${field.confidence}%` }} />
              </div>
              <span>{field.confidence}%</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
