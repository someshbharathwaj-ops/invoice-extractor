"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { ThemeToggle } from "@/components/landing/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { featureCards, productStats } from "@/lib/constants";

const pipelineSteps = [
  { label: "Ingestion", icon: ShieldCheck },
  { label: "Semantic chunking", icon: Sparkles },
  { label: "Retriever scoring", icon: Zap },
  { label: "Schema extraction", icon: ShieldCheck }
] as const;

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 hero-mesh px-6 py-8 md:px-10 md:py-10">
      <div className="absolute inset-0 bg-grid bg-[size:48px_48px] opacity-25" />
      <motion.div
        className="absolute -left-24 top-20 h-52 w-52 rounded-full bg-sky-500/20 blur-3xl"
        animate={{ y: [0, -12, 0], opacity: [0.45, 0.8, 0.45] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute right-0 top-0 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl"
        animate={{ y: [0, 18, 0], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <div className="relative z-10 flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <Badge variant="neutral" className="bg-white/10 text-foreground dark:bg-white/5">
            Invoice Intelligence Platform
          </Badge>
          <ThemeToggle />
        </div>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="max-w-3xl space-y-6">
            <motion.h1
              className="font-display text-4xl font-semibold leading-tight md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              AI-native invoice extraction with a finance-grade{" "}
              <span className="text-gradient">operations dashboard.</span>
            </motion.h1>
            <motion.p
              className="max-w-2xl text-base text-muted-foreground md:text-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Upload PDFs, trace retrieval, verify structured totals, and export machine-ready invoice data from a
              polished SaaS workflow built for modern finance teams.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Button asChild size="lg">
                <a href="#workspace">
                  Launch workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#results">See extraction trace</a>
              </Button>
            </motion.div>
            <div className="grid gap-3 pt-4 sm:grid-cols-3">
              {productStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-xl dark:bg-white/5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 font-display text-2xl font-semibold">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <Card className="border-white/10 bg-slate-950/60 text-white shadow-lift">
            <CardContent className="space-y-6 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">AI pipeline</p>
                  <p className="font-display text-2xl">Retrieval-first orchestration</p>
                </div>
                <Badge>Live trace</Badge>
              </div>
              <div className="space-y-3">
                {pipelineSteps.map((step) => {
                  const Icon = step.icon;

                  return (
                  <div key={step.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="rounded-full bg-sky-400/10 p-2 text-sky-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{step.label}</p>
                      <div className="mt-2 h-1.5 rounded-full bg-white/10">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-300"
                          initial={{ width: "25%" }}
                          animate={{ width: ["25%", "92%", "64%", "98%"] }}
                          transition={{ duration: 6, repeat: Infinity }}
                        />
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featureCards.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className="h-full border-white/10 bg-white/10 dark:bg-white/5">
                <CardContent className="p-6">
                  <p className="font-display text-lg">{feature.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.body}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
