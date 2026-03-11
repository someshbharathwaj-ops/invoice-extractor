"use client";

import { useMemo } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { useInvoiceStore } from "@/store/use-invoice-store";
import { InvoiceRecord } from "@/types/invoice";

const columns: ColumnDef<InvoiceRecord>[] = [
  {
    accessorKey: "vendorName",
    header: "Vendor",
    cell: ({ row }) => row.original.vendorName
  },
  {
    accessorKey: "invoiceNumber",
    header: "Invoice #",
    cell: ({ row }) => row.original.invoiceNumber
  },
  {
    accessorKey: "invoiceDate",
    header: "Date",
    cell: ({ row }) => row.original.invoiceDate
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => formatCurrency(row.original.totalAmount)
  },
  {
    accessorKey: "confidence",
    header: "Confidence",
    cell: ({ row }) => `${row.original.confidence}%`
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variant = status === "processed" ? "success" : status === "review" ? "warning" : "danger";
      return <Badge variant={variant}>{status}</Badge>;
    }
  }
];

export function ResultsTable() {
  const { invoices, search, statusFilter, setSearch, setStatusFilter, selectInvoice, selectedInvoiceId } = useInvoiceStore(
    (state) => ({
      invoices: state.invoices,
      search: state.search,
      statusFilter: state.statusFilter,
      setSearch: state.setSearch,
      setStatusFilter: state.setStatusFilter,
      selectInvoice: state.selectInvoice,
      selectedInvoiceId: state.selectedInvoiceId
    })
  );

  const filtered = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesStatus = statusFilter === "all" ? true : invoice.status === statusFilter;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        [invoice.vendorName, invoice.invoiceNumber, invoice.fileName, invoice.gstNumber].some((value) =>
          value.toLowerCase().includes(query)
        );
      return matchesStatus && matchesSearch;
    });
  }, [invoices, search, statusFilter]);

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <Card id="results">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <CardTitle>Invoice results dashboard</CardTitle>
          <CardDescription>Search, filter, and inspect structured invoice records with confidence cues.</CardDescription>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search invoice, vendor, GST..." />
          <div className="flex rounded-full border border-border bg-background/50 p-1">
            {["all", "processed", "review", "flagged"].map((status) => (
              <button
                key={status}
                className={`rounded-full px-4 py-2 text-sm capitalize transition ${
                  statusFilter === status ? "bg-secondary text-foreground" : "text-muted-foreground"
                }`}
                onClick={() => setStatusFilter(status as typeof statusFilter)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-hidden">
        <div className="overflow-x-auto rounded-[1.75rem] border border-border bg-background/50">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-secondary/60 text-muted-foreground">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-4 font-medium">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, index) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className={`cursor-pointer border-t border-border transition hover:bg-secondary/40 ${
                    row.original.id === selectedInvoiceId ? "bg-sky-500/10" : ""
                  }`}
                  onClick={() => selectInvoice(row.original.id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
