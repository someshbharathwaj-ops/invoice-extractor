import { AnalyticsPoint, InvoiceRecord, VendorVolume } from "@/types/invoice";

export const sampleInvoices: InvoiceRecord[] = [
  {
    id: "inv-ax-1024",
    fileName: "aether-labs-march.pdf",
    vendorName: "Aether Labs",
    invoiceNumber: "AX-1024",
    invoiceDate: "2026-03-04",
    dueDate: "2026-03-18",
    subtotal: 94200,
    tax: 16956,
    totalAmount: 111156,
    currency: "INR",
    paymentTerms: "Net 14",
    gstNumber: "29AABCU9603R1ZM",
    status: "processed",
    confidence: 97,
    summary: "Cloud infrastructure invoice with compute, storage, and managed support line items.",
    extractedAt: "2026-03-10T14:35:00Z",
    fields: [
      { label: "Invoice Number", value: "AX-1024", confidence: 99 },
      { label: "Invoice Date", value: "04 Mar 2026", confidence: 98 },
      { label: "Vendor", value: "Aether Labs", confidence: 99 },
      { label: "GST", value: "29AABCU9603R1ZM", confidence: 93 },
      { label: "Subtotal", value: "94,200", confidence: 97 },
      { label: "Tax", value: "16,956", confidence: 94 },
      { label: "Total", value: "111,156", confidence: 99 },
      { label: "Payment Terms", value: "Net 14", confidence: 95 }
    ],
    retrievedChunks: [
      {
        id: "chunk-1",
        title: "Supplier Header",
        excerpt: "Aether Labs Pvt Ltd... GSTIN 29AABCU9603R1ZM... Invoice No AX-1024 dated 04/03/2026.",
        score: 0.97,
        page: 1
      },
      {
        id: "chunk-2",
        title: "Totals Section",
        excerpt: "Subtotal 94,200.00 ... GST 18% 16,956.00 ... Grand Total INR 111,156.00.",
        score: 0.95,
        page: 1
      },
      {
        id: "chunk-3",
        title: "Terms Footer",
        excerpt: "Payment terms: Net 14 from invoice date. Remit to registered business account.",
        score: 0.88,
        page: 2
      }
    ],
    reasoning: [
      { id: "ingest", title: "Document intake", detail: "PDF decoded and normalized into a text layer.", status: "completed" },
      { id: "chunk", title: "Semantic chunking", detail: "Header, totals, and footer regions split for retrieval accuracy.", status: "completed" },
      { id: "retrieve", title: "Retriever ranking", detail: "Top three chunks selected with supplier, total, and payment context.", status: "completed" },
      { id: "extract", title: "Structured extraction", detail: "Invoice fields generated into a canonical finance schema.", status: "completed" },
      { id: "verify", title: "Consistency verification", detail: "Subtotal + tax reconciled against grand total.", status: "completed" }
    ]
  },
  {
    id: "inv-qn-884",
    fileName: "quanta-networks-feb.pdf",
    vendorName: "Quanta Networks",
    invoiceNumber: "QN-884",
    invoiceDate: "2026-02-21",
    dueDate: "2026-03-22",
    subtotal: 64800,
    tax: 11664,
    totalAmount: 76464,
    currency: "INR",
    paymentTerms: "Net 30",
    gstNumber: "27AAACQ1234K1Z6",
    status: "review",
    confidence: 89,
    summary: "Network operations support and monitoring services requiring minor manual review.",
    extractedAt: "2026-03-08T09:10:00Z",
    fields: [
      { label: "Invoice Number", value: "QN-884", confidence: 96 },
      { label: "Invoice Date", value: "21 Feb 2026", confidence: 92 },
      { label: "Vendor", value: "Quanta Networks", confidence: 95 },
      { label: "GST", value: "27AAACQ1234K1Z6", confidence: 82 },
      { label: "Subtotal", value: "64,800", confidence: 86 },
      { label: "Tax", value: "11,664", confidence: 84 },
      { label: "Total", value: "76,464", confidence: 90 },
      { label: "Payment Terms", value: "Net 30", confidence: 87 }
    ],
    retrievedChunks: [
      {
        id: "chunk-4",
        title: "Billing Table",
        excerpt: "Monitoring retainer... incident response credits... subtotal INR 64,800.",
        score: 0.91,
        page: 1
      },
      {
        id: "chunk-5",
        title: "Tax Summary",
        excerpt: "Integrated GST 18% applied to services for total tax 11,664.",
        score: 0.86,
        page: 1
      }
    ],
    reasoning: [
      { id: "ingest", title: "Document intake", detail: "Document normalized with embedded text layer.", status: "completed" },
      { id: "chunk", title: "Semantic chunking", detail: "Service rows and total footer isolated for retrieval.", status: "completed" },
      { id: "retrieve", title: "Retriever ranking", detail: "Tax section scored lower due to repeated line items.", status: "completed" },
      { id: "extract", title: "Structured extraction", detail: "Primary fields extracted with low certainty on GST formatting.", status: "completed" },
      { id: "verify", title: "Consistency verification", detail: "Invoice flagged for review because GST token spacing varied.", status: "completed" }
    ]
  },
  {
    id: "inv-or-552",
    fileName: "orbit-systems-jan.pdf",
    vendorName: "Orbit Systems",
    invoiceNumber: "OR-552",
    invoiceDate: "2026-01-30",
    dueDate: "2026-02-14",
    subtotal: 128000,
    tax: 23040,
    totalAmount: 151040,
    currency: "INR",
    paymentTerms: "Net 15",
    gstNumber: "07AABCO7781P1ZH",
    status: "flagged",
    confidence: 74,
    summary: "Layout-heavy facilities invoice with OCR noise around amount fields and mixed tabular content.",
    extractedAt: "2026-03-05T19:45:00Z",
    fields: [
      { label: "Invoice Number", value: "OR-552", confidence: 81 },
      { label: "Invoice Date", value: "30 Jan 2026", confidence: 79 },
      { label: "Vendor", value: "Orbit Systems", confidence: 88 },
      { label: "GST", value: "07AABCO7781P1ZH", confidence: 71 },
      { label: "Subtotal", value: "128,000", confidence: 69 },
      { label: "Tax", value: "23,040", confidence: 65 },
      { label: "Total", value: "151,040", confidence: 73 },
      { label: "Payment Terms", value: "Net 15", confidence: 76 }
    ],
    retrievedChunks: [
      {
        id: "chunk-6",
        title: "OCR Header",
        excerpt: "Orbit Systems Facility Services... invoice no OR-552... faded scan and skew correction applied.",
        score: 0.74,
        page: 1
      },
      {
        id: "chunk-7",
        title: "Amount Block",
        excerpt: "Subtotal 128000 ... CGST/SGST combined 23040 ... total 151040 pending validation.",
        score: 0.72,
        page: 2
      }
    ],
    reasoning: [
      { id: "ingest", title: "Document intake", detail: "Scanned document required OCR normalization before parsing.", status: "completed" },
      { id: "chunk", title: "Semantic chunking", detail: "Skewed table rows produced fragmented chunks around totals.", status: "completed" },
      { id: "retrieve", title: "Retriever ranking", detail: "Low retrieval density reduced confidence for tax-related fields.", status: "completed" },
      { id: "extract", title: "Structured extraction", detail: "Fields were assembled with inferred delimiters from OCR output.", status: "completed" },
      { id: "verify", title: "Consistency verification", detail: "Record flagged due to low OCR clarity and table ambiguity.", status: "completed" }
    ]
  }
];

export const monthlyInvoiceStats: AnalyticsPoint[] = [
  { label: "Oct", value: 14 },
  { label: "Nov", value: 19 },
  { label: "Dec", value: 23 },
  { label: "Jan", value: 21 },
  { label: "Feb", value: 27 },
  { label: "Mar", value: 31 }
];

export const confidenceDistribution: AnalyticsPoint[] = [
  { label: "High", value: 62 },
  { label: "Review", value: 24 },
  { label: "Flagged", value: 14 }
];

export const vendorVolume: VendorVolume[] = [
  { vendor: "Aether Labs", invoices: 18 },
  { vendor: "Orbit Systems", invoices: 11 },
  { vendor: "Quanta Networks", invoices: 9 },
  { vendor: "Helix Commerce", invoices: 7 }
];
