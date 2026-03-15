"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Sparkles, UploadCloud } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useInvoiceStore } from "@/store/use-invoice-store";

const formSchema = z.object({
  files: z
    .array(z.custom<File>((value) => typeof File !== "undefined" && value instanceof File))
    .min(1, "Add at least one invoice PDF.")
    .refine((files) => files.every((file) => file.type === "application/pdf"), "Only PDF files are supported.")
});

type FormValues = z.infer<typeof formSchema>;

export function UploadZone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { uploadQueue, simulateUpload, isProcessing } = useInvoiceStore((state) => ({
    uploadQueue: state.uploadQueue,
    simulateUpload: state.simulateUpload,
    isProcessing: state.isProcessing
  }));

  const { setValue, handleSubmit, formState, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: []
    }
  });

  const files = watch("files");

  const onSubmit = async (values: FormValues) => {
    await simulateUpload(values.files);
    toast.success("Invoices processed in demo workspace.");
  };

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    setValue("files", Array.from(incoming), { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  return (
    <Card id="workspace" className="overflow-hidden">
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <CardTitle>Upload workspace</CardTitle>
          <CardDescription>Drag PDFs into the pipeline and monitor extraction from ingest to verification.</CardDescription>
        </div>
        <Button variant="outline" onClick={() => inputRef.current?.click()}>
          Add PDFs
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className={`rounded-[1.75rem] border border-dashed p-8 transition-all ${
            isDragging ? "border-sky-400 bg-sky-500/10" : "border-border bg-background/40"
          }`}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            handleFiles(event.dataTransfer.files);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            multiple
            hidden
            onChange={(event) => handleFiles(event.target.files)}
          />
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full border border-white/10 bg-gradient-to-b from-sky-500/20 to-transparent p-4 text-sky-300">
              <UploadCloud className="h-7 w-7" />
            </div>
            <div>
              <p className="font-display text-2xl">Drop invoice PDFs to start extraction</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Smart drag-and-drop, upload preview, and retrieval-ready processing trace.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button type="submit" size="lg" disabled={isProcessing}>
                {isProcessing ? "Processing..." : files.length ? "Run AI extraction" : "Add PDFs to begin"}
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={() => inputRef.current?.click()}>
                Select files
              </Button>
            </div>
            {formState.errors.files ? <p className="text-sm text-rose-400">{formState.errors.files.message}</p> : null}
          </div>
        </motion.form>

        <div className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
          <div className="space-y-3">
            {(files.length ? files : []).map((file) => {
              const upload = uploadQueue.find((item) => item.name === file.name);
              return (
                <motion.div
                  key={file.name}
                  layout
                  className="rounded-2xl border border-border bg-background/60 p-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-secondary p-3">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{Math.round(file.size / 1024)} KB</p>
                        </div>
                        <span className="text-sm text-muted-foreground">{upload?.progress ?? 0}%</span>
                      </div>
                      <Progress className="mt-3" value={upload?.progress ?? 0} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {!files.length ? (
              <div className="rounded-2xl border border-border bg-background/50 p-6 text-sm text-muted-foreground">
                No files queued yet. Add one or more invoice PDFs to populate the workspace.
              </div>
            ) : null}
          </div>

          <div className="rounded-[1.75rem] border border-border bg-background/50 p-5">
            <div className="flex items-center gap-2 text-sm text-sky-300">
              <Sparkles className="h-4 w-4" />
              Extraction quality controls
            </div>
            <div className="mt-4 space-y-4">
              {[
                ["Schema normalization", "Canonical fields for finance systems"],
                ["Confidence scoring", "Surface low-trust values for review"],
                ["Explainable retrieval", "Show supporting chunks per extraction"],
                ["Export readiness", "Prepared for JSON and CSV handoff"]
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4 dark:bg-white/[0.03]">
                  <p className="font-medium">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
