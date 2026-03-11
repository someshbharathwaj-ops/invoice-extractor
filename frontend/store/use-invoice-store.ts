"use client";

import { create } from "zustand";

import { sampleInvoices } from "@/lib/sample-data";
import { InvoiceRecord, PipelineStage } from "@/types/invoice";

const stageOrder: PipelineStage[] = ["ingest", "chunk", "retrieve", "extract", "verify"];

interface UploadFileState {
  id: string;
  name: string;
  size: number;
  progress: number;
}

interface InvoiceStore {
  invoices: InvoiceRecord[];
  selectedInvoiceId: string;
  compareIds: string[];
  uploadQueue: UploadFileState[];
  processingStage: PipelineStage;
  isProcessing: boolean;
  search: string;
  statusFilter: "all" | InvoiceRecord["status"];
  setSearch: (search: string) => void;
  setStatusFilter: (status: "all" | InvoiceRecord["status"]) => void;
  selectInvoice: (id: string) => void;
  toggleCompare: (id: string) => void;
  simulateUpload: (files: File[]) => Promise<void>;
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoices: sampleInvoices,
  selectedInvoiceId: sampleInvoices[0].id,
  compareIds: [sampleInvoices[0].id, sampleInvoices[1].id],
  uploadQueue: [],
  processingStage: "ingest",
  isProcessing: false,
  search: "",
  statusFilter: "all",
  setSearch: (search) => set({ search }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  selectInvoice: (id) => set({ selectedInvoiceId: id }),
  toggleCompare: (id) =>
    set((state) => {
      const exists = state.compareIds.includes(id);
      if (exists) {
        return { compareIds: state.compareIds.filter((item) => item !== id) };
      }

      return { compareIds: [...state.compareIds.slice(-1), id] };
    }),
  simulateUpload: async (files) => {
    const queue = files.map((file, index) => ({
      id: `${file.name}-${index}`,
      name: file.name,
      size: file.size,
      progress: 0
    }));

    set({ uploadQueue: queue, isProcessing: true, processingStage: "ingest" });

    for (let i = 0; i < queue.length; i += 1) {
      for (let progress = 10; progress <= 100; progress += 15) {
        await new Promise((resolve) => setTimeout(resolve, 120));
        set((state) => ({
          uploadQueue: state.uploadQueue.map((item, itemIndex) =>
            itemIndex === i ? { ...item, progress: Math.min(progress, 100) } : item
          )
        }));
      }
    }

    for (const stage of stageOrder) {
      set({ processingStage: stage });
      await new Promise((resolve) => setTimeout(resolve, 700));
    }

    const latest = get().invoices[0];
    set({
      selectedInvoiceId: latest.id,
      isProcessing: false
    });
  }
}));
