import { Card, CardContent } from "@/components/ui/card";

interface LayerItem {
  title: string;
  body: string;
}

export function ArtifactLayerDiagram({ layers }: { layers: LayerItem[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="rounded-[2rem] border-border/60 bg-primary text-primary-foreground shadow-xl shadow-primary/10">
        <CardContent className="flex h-full flex-col justify-between gap-6 p-6 md:p-8">
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.22em] text-primary-foreground/65">Design principle</div>
            <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">Memory is a system, not one bucket.</h3>
            <p className="text-sm leading-6 text-primary-foreground/85 md:text-base">
              Each layer solves a different problem: immediate reasoning, continuity, durable storage, scoped privacy, and retrieval.
            </p>
          </div>
          <div className="grid gap-3 text-sm text-primary-foreground/85">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Intelligence without continuity is shallow.</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Stored memory without retrieval is dead weight.</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Memory without boundaries becomes leakage.</div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {layers.map((layer, index) => (
          <Card key={layer.title} className="rounded-3xl border-border/60 bg-card/80 shadow-sm">
            <CardContent className="flex gap-4 p-5 md:p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-sm font-semibold text-foreground">
                {index + 1}
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-semibold tracking-tight md:text-lg">{layer.title}</h4>
                <p className="text-sm leading-6 text-muted-foreground">{layer.body}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
