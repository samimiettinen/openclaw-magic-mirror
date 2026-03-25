import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface ArtifactHeroProps {
  kicker: string;
  title: string;
  thesis: string;
  summary: string;
  children?: ReactNode;
}

export function ArtifactHero({ kicker, title, thesis, summary, children }: ArtifactHeroProps) {
  return (
    <section className="mx-auto flex min-h-[88vh] w-full max-w-7xl flex-col justify-center gap-10 px-6 py-20 md:px-10 lg:px-12">
      <div className="space-y-6">
        <Badge variant="secondary" className="rounded-full px-4 py-1 text-xs uppercase tracking-[0.18em]">
          {kicker}
        </Badge>
        <div className="max-w-5xl space-y-6">
          <h1 className="max-w-5xl text-balance text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl lg:text-[5.5rem]">
            {title}
          </h1>
          <p className="max-w-4xl text-xl font-medium leading-8 text-foreground/90 md:text-2xl">
            {thesis}
          </p>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
            {summary}
          </p>
        </div>
      </div>
      {children ? <div>{children}</div> : null}
    </section>
  );
}
