import { ReactNode } from "react";

interface ArtifactSectionProps {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function ArtifactSection({ id, eyebrow, title, description, children }: ArtifactSectionProps) {
  return (
    <section id={id} className="mx-auto w-full max-w-7xl px-6 py-14 md:px-10 md:py-20 lg:px-12">
      <div className="mb-10 max-w-3xl space-y-4">
        <div className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">{eyebrow}</div>
        <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">{title}</h2>
        {description ? <p className="text-base leading-7 text-muted-foreground md:text-lg">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
