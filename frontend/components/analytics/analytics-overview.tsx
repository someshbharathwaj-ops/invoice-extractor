"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertOctagon, ChartColumn, TrendingUp } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { confidenceDistribution, monthlyInvoiceStats, vendorVolume } from "@/lib/sample-data";

export function AnalyticsOverview() {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-secondary p-3">
              <ChartColumn className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Monthly invoice volume</CardTitle>
              <CardDescription>Monitor processing throughput and pipeline growth over time.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyInvoiceStats}>
                <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.16)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
                <Tooltip cursor={{ fill: "rgba(148,163,184,0.08)" }} />
                <Bar dataKey="value" radius={[16, 16, 6, 6]} fill="url(#volumeGradient)" />
                <defs>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-secondary p-3">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Confidence profile</CardTitle>
                <CardDescription>High-confidence vs review-required extraction distribution.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={confidenceDistribution} dataKey="value" nameKey="label" innerRadius={58} outerRadius={86}>
                    {confidenceDistribution.map((entry, index) => (
                      <Cell
                        key={entry.label}
                        fill={["#38bdf8", "#f59e0b", "#f43f5e"][index]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-secondary p-3">
                <AlertOctagon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Anomaly signals</CardTitle>
                <CardDescription>Vendors with irregular totals or repeated low-confidence patterns.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {vendorVolume.map((vendor, index) => (
              <div key={vendor.vendor} className="rounded-2xl border border-border bg-background/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{vendor.vendor}</p>
                  <span className="text-sm text-muted-foreground">{vendor.invoices} invoices</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300"
                    style={{ width: `${Math.max(25, 100 - index * 18)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
