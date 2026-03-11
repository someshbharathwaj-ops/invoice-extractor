"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInvoiceStore } from "@/store/use-invoice-store";

export function JsonViewer() {
  const invoice = useInvoiceStore((state) =>
    state.invoices.find((item) => item.id === state.selectedInvoiceId) || state.invoices[0]
  );

  const payload = JSON.stringify(invoice, null, 2);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Structured JSON</CardTitle>
          <CardDescription>Canonical machine-readable output prepared for export and downstream workflows.</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await navigator.clipboard.writeText(payload);
              toast.success("JSON copied.");
            }}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={invoice.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <ScrollArea className="h-[480px] rounded-[1.75rem] border border-border bg-slate-950/90 p-5">
              <pre className="text-sm text-slate-200">{payload}</pre>
            </ScrollArea>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
