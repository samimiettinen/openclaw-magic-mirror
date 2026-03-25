import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ArtifactCardProps {
  icon: LucideIcon;
  title: string;
  body: string;
}

export function ArtifactCard({ icon: Icon, title, body }: ArtifactCardProps) {
  return (
    <Card className="rounded-3xl border-border/60 bg-card/80 shadow-sm transition-transform duration-300 hover:-translate-y-0.5">
      <CardContent className="space-y-4 p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/8 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <p className="text-sm leading-6 text-muted-foreground">{body}</p>
        </div>
      </CardContent>
    </Card>
  );
}
