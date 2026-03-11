export default function Loading() {
  return (
    <main className="container space-y-6 py-6 md:space-y-8 md:py-8">
      <div className="glass-panel h-[420px] animate-pulse rounded-[2rem]" />
      <div className="glass-panel h-[320px] animate-pulse rounded-[2rem]" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel h-[360px] animate-pulse rounded-[2rem]" />
        <div className="glass-panel h-[360px] animate-pulse rounded-[2rem]" />
      </div>
    </main>
  );
}
