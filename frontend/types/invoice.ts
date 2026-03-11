export type PipelineStage = "ingest" | "chunk" | "retrieve" | "extract" | "verify";

export interface InvoiceField {
  label: string;
  value: string;
  confidence: number;
}

export interface RetrievedChunk {
  id: string;
  title: string;
  excerpt: string;
  score: number;
  page: number;
}

export interface ExplainabilityStep {
  id: PipelineStage;
  title: string;
  detail: string;
  status: "completed" | "active" | "queued";
}

export interface InvoiceRecord {
  id: string;
  fileName: string;
  vendorName: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  totalAmount: number;
  currency: string;
  paymentTerms: string;
  gstNumber: string;
  status: "processed" | "review" | "flagged";
  confidence: number;
  summary: string;
  extractedAt: string;
  fields: InvoiceField[];
  retrievedChunks: RetrievedChunk[];
  reasoning: ExplainabilityStep[];
}

export interface AnalyticsPoint {
  label: string;
  value: number;
}

export interface VendorVolume {
  vendor: string;
  invoices: number;
}
