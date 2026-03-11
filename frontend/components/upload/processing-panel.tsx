"use client";

import { motion } from "framer-motion";
import { BrainCircuit, DatabaseZap, FileStack, Radar, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useInvoiceStore } from "@/store/use-invoice-store";
import { PipelineStage } from "@/types/invoice";

const stageMeta: Record<PipelineStage, { icon: typeof FileStack; label: string; description: string; progress: number }> = {
  ingest: { icon: FileStack, label: "Document intake", description: "PDF pages normalized and buffered.", progress: 20 },
  chunk: { icon: DatabaseZap, label: "Semantic chunking", description: "Regions split for retriever precision.", progress: 40 },
  retrieve: { icon: Radar, label: "Retriever scoring", description: "Top support chunks ranked by relevance.", progress: 65 },
  extract: { icon: BrainCircuit, label: "Field extraction", description: "Schema-first AI output generated.", progress: 85 },
  verify: { icon: ShieldCheck, label: "Validation", description: "Totals and dates cross-checked.", progress: 100 }
};

const stageOrder: PipelineStage[] = ["ingest", "chunk", "retrieve", "extract", "verify"];

export function ProcessingPanel() {
  const { isProcessing, processingStage } = useInvoiceStore((state) => ({
    isProcessing: state.isProcessing,
    processingStage: state.processingStage
  }));

  const activeIndex = stageOrder.indexOf(processingStage);
  const progress = stageMeta[processingStage].progress;

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <CardTitle>AI processing state</CardTitle>
          <CardDescription>Live pipeline visualization with retriever and verification checkpoints.</CardDescription>
        </div>
        <Badge variant={isProcessing ? "default" : "neutral"}>{isProcessing ? "Processing live" : "Ready"}</Badge>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.75rem] border border-border bg-background/40 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pipeline completion</p>
              <p className="font-display text-3xl">{progress}%</p>
            </div>
            <motion.div
              className="rounded-full border border-sky-400/30 bg-sky-500/10 p-4 text-sky-300"
              animate={{ scale: isProcessing ? [1, 1.08, 1] : 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BrainCircuit className="h-6 w-6" />
            </motion.div>
          </div>
          <Progress className="mt-4" value={progress} />
          <div className="mt-6 space-y-3">
            {stageOrder.map((stage, index) => {
              const meta = stageMeta[stage];
              const Icon = meta.icon;
              const state =
                index < activeIndex ? "completed" : index === activeIndex ? (isProcessing ? "active" : "completed") : "queued";

              return (
                <div key={stage} className="flex items-center gap-3 rounded-2xl border border-border bg-background/70 p-3">
                  <div
                    className={`rounded-2xl p-3 ${
                      state === "completed"
                        ? "bg-emerald-500/10 text-emerald-300"
                        : state === "active"
                          ? "bg-sky-500/10 text-sky-300"
                          : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{meta.label}</p>
                      <Badge variant={state === "completed" ? "success" : state === "active" ? "default" : "neutral"}>
                        {state}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{meta.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-border bg-background/40 p-5">
          <p className="text-sm text-muted-foreground">RAG activity mesh</p>
          <div className="mt-4 grid h-[280px] place-items-center overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/80">
            <div className="relative h-full w-full">
              <motion.div
                className="absolute left-1/2 top-8 h-16 w-16 -translate-x-1/2 rounded-full bg-sky-400/20 blur-2xl"
                animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.85, 1.15, 0.85] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              {[22, 44, 66].map((top, index) => (
                <motion.div
                  key={top}
                  className="absolute left-10 right-10 h-px bg-gradient-to-r from-transparent via-sky-400/70 to-transparent"
                  style={{ top: `${top}%` }}
                  animate={{ opacity: [0.15, 0.9, 0.15], scaleX: [0.96, 1, 0.96] }}
                  transition={{ duration: 3 + index, repeat: Infinity }}
                />
              ))}
              {[
                ["Header", "18%", "22%"],
                ["Line items", "70%", "35%"],
                ["Totals", "25%", "72%"],
                ["Terms", "78%", "78%"]
              ].map(([label, left, top]) => (
                <motion.div
                  key={label}
                  className="absolute rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs text-sky-200"
                  style={{ left, top }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  {label}
                </motion.div>
              ))}
              <div className="absolute inset-x-10 bottom-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                Neural retrieval lanes surface the highest-signal chunks before extraction and finance-rule verification.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
