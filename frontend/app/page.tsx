import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { HeroSection } from "@/components/landing/hero-section";
import { ProcessingPanel } from "@/components/upload/processing-panel";
import { UploadZone } from "@/components/upload/upload-zone";

export default function Page() {
  return (
    <main className="container space-y-6 py-6 md:space-y-8 md:py-8">
      <HeroSection />
      <UploadZone />
      <ProcessingPanel />
      <DashboardShell />
    </main>
  );
}
