"use client";

import { AlertTriangle, Building2, CalendarRange, ReceiptText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useInvoiceStore } from "@/store/use-invoice-store";

export function InsightCards() {
  const invoice = useInvoiceStore((state) =>
    state.invoices.find((item) => item.id === state.selectedInvoiceId) || state.invoices[0]
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {[
        {
          title: "Vendor",
          value: invoice.vendorName,
          icon: Building2,
          meta: invoice.gstNumber
        },
        {
          title: "Invoice",
          value: invoice.invoiceNumber,
          icon: ReceiptText,
          meta: invoice.paymentTerms
        },
        {
          title: "Invoice date",
          value: invoice.invoiceDate,
          icon: CalendarRange,
          meta: `Due ${invoice.dueDate}`
        },
        {
          title: "Total amount",
          value: formatCurrency(invoice.totalAmount),
          icon: AlertTriangle,
          meta: `${invoice.confidence}% confidence`
        }
      ].map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">{card.title}</CardTitle>
                <div className="rounded-full bg-secondary p-2">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-display text-2xl">{card.value}</p>
              <Badge variant="neutral" className="mt-3">
                {card.meta}
              </Badge>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
