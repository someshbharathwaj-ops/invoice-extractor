"use client";

import { BarChart3, GitCompareArrows } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useInvoiceStore } from "@/store/use-invoice-store";

export function CompareDialog() {
  const { invoices, compareIds, toggleCompare } = useInvoiceStore((state) => ({
    invoices: state.invoices,
    compareIds: state.compareIds,
    toggleCompare: state.toggleCompare
  }));
  const compareItems = invoices.filter((invoice) => compareIds.includes(invoice.id));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <GitCompareArrows className="mr-2 h-4 w-4" />
          Compare invoices
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex items-center justify-between gap-4">
          <div>
            <DialogTitle className="font-display text-2xl">Invoice compare</DialogTitle>
            <DialogDescription className="mt-2 text-sm text-muted-foreground">
              Review totals, confidence, and vendor metadata side-by-side.
            </DialogDescription>
          </div>
          <div className="rounded-full bg-secondary p-3">
            <BarChart3 className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {invoices.map((invoice) => (
            <button
              key={invoice.id}
              className={`rounded-2xl border p-4 text-left transition ${
                compareIds.includes(invoice.id) ? "border-sky-400 bg-sky-500/10" : "border-border bg-background/50"
              }`}
              onClick={() => toggleCompare(invoice.id)}
            >
              <p className="font-medium">{invoice.vendorName}</p>
              <p className="mt-1 text-sm text-muted-foreground">{invoice.invoiceNumber}</p>
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {compareItems.map((invoice) => (
            <Card key={invoice.id}>
              <CardContent className="space-y-4 p-6">
                <div>
                  <p className="font-display text-xl">{invoice.vendorName}</p>
                  <p className="text-sm text-muted-foreground">{invoice.invoiceNumber}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-background/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total</p>
                    <p className="mt-2 font-display text-2xl">{formatCurrency(invoice.totalAmount)}</p>
                  </div>
                  <div className="rounded-2xl bg-background/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Confidence</p>
                    <p className="mt-2 font-display text-2xl">{invoice.confidence}%</p>
                  </div>
                  <div className="rounded-2xl bg-background/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">GST</p>
                    <p className="mt-2 text-sm">{invoice.gstNumber}</p>
                  </div>
                  <div className="rounded-2xl bg-background/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Terms</p>
                    <p className="mt-2 text-sm">{invoice.paymentTerms}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
