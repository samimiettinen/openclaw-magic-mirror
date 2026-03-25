import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Brain, Layers3, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { ArtifactHero } from "@/components/artifact/ArtifactHero";
import { ArtifactSection } from "@/components/artifact/ArtifactSection";
import { ArtifactCard } from "@/components/artifact/ArtifactCard";
import { ArtifactLayerDiagram } from "@/components/artifact/ArtifactLayerDiagram";

const layers = [
  {
    title: "Active context",
    body: "The live conversation window where the current task, user intent, and recent exchange are handled in real time.",
  },
  {
    title: "Session continuity",
    body: "Summarised trace of what has already happened so work can continue without starting from zero each time.",
  },
  {
    title: "Persistent file memory",
    body: "Workspace memory files, notes, trackers, and skills that give the agent durable continuity beyond a single session.",
  },
  {
    title: "Private / shared / group boundaries",
    body: "Different people and contexts need different memory scopes. Samantha separates them deliberately instead of blending everything together.",
  },
  {
    title: "Retrieval logic",
    body: "Useful memory is not just stored. It must also be found, filtered, and used at the right time with the right boundary.",
  },
];

export default function SamanthaArtifact() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.08)_0%,_transparent_35%),linear-gradient(180deg,#ffffff_0%,#f6f8fb_100%)] text-foreground">
      <ArtifactHero
        kicker="OpenClaw artifact"
        title="Samantha is not just chat."
        thesis="Samantha is a remembering AI work partner: model plus memory plus tools plus boundaries."
        summary="This artifact explains why a serious agent layer needs continuity, retrieval, workflow structure, and safety boundaries — not only a strong model."
      >
        <div className="flex flex-wrap gap-3">
          <Button size="lg" className="gap-2 rounded-full px-6">
            View memory architecture <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-6">
            OpenClaw artifact prototype
          </Button>
        </div>
      </ArtifactHero>

      <ArtifactSection
        id="why"
        eyebrow="Why this matters"
        title="A useful AI partner needs continuity."
        description="The difference between a chatbot and a serious work layer is not just intelligence. It is whether the system can remember, retrieve, operate, and stay inside the right boundaries."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ArtifactCard icon={Brain} title="Thinking is not enough" body="A strong model can answer well once. Real work needs continuity across tasks, people, channels, and time." />
          <ArtifactCard icon={Layers3} title="Memory must be layered" body="Current context, session continuity, persistent files, and explicit retrieval each solve a different problem." />
          <ArtifactCard icon={Wrench} title="Execution matters" body="Useful systems do not only explain. They draft, compare, structure, summarize, and help move work forward." />
          <ArtifactCard icon={ShieldCheck} title="Boundaries create trust" body="Private, shared, and group contexts must stay separate. Good governance is part of product quality." />
        </div>
      </ArtifactSection>

      <ArtifactSection
        id="architecture"
        eyebrow="Memory architecture"
        title="Layered memory is the core design choice."
        description="Samantha’s value comes from combining immediate intelligence with continuity, retrieval, and scoped memory."
      >
        <ArtifactLayerDiagram layers={layers} />
      </ArtifactSection>

      <ArtifactSection
        id="capabilities"
        eyebrow="Capabilities"
        title="What Samantha actually does"
        description="The system becomes useful when memory, tools, and workflows combine into repeatable operator behaviour."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="rounded-3xl border-border/60 bg-card/80 shadow-sm">
            <CardContent className="space-y-3 p-6">
              <Badge variant="secondary" className="rounded-full">Memory</Badge>
              <h3 className="text-xl font-semibold tracking-tight">Remembers what matters</h3>
              <p className="text-sm leading-6 text-muted-foreground">Decisions, trackers, recurring workflows, personal preferences, and durable notes can persist beyond one conversation.</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-border/60 bg-card/80 shadow-sm">
            <CardContent className="space-y-3 p-6">
              <Badge variant="secondary" className="rounded-full">Workflow</Badge>
              <h3 className="text-xl font-semibold tracking-tight">Turns messy input into structure</h3>
              <p className="text-sm leading-6 text-muted-foreground">Videos, articles, notes, tasks, and fragmented ideas can be turned into briefs, trackers, artifact pages, and action logic.</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-border/60 bg-card/80 shadow-sm">
            <CardContent className="space-y-3 p-6">
              <Badge variant="secondary" className="rounded-full">Boundaries</Badge>
              <h3 className="text-xl font-semibold tracking-tight">Operates with explicit safety rules</h3>
              <p className="text-sm leading-6 text-muted-foreground">The system can be helpful without becoming reckless because permissions, context separation, and approval rules are part of the design.</p>
            </CardContent>
          </Card>
        </div>
      </ArtifactSection>

      <ArtifactSection
        id="use-cases"
        eyebrow="Use cases"
        title="Where this becomes strategically valuable"
        description="A memory-rich agent layer is useful when work depends on continuity, prioritisation, and repeated execution quality."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <ArtifactCard icon={Sparkles} title="Executive briefing" body="Turn videos, articles, meetings, and raw material into concise, decision-useful artifacts instead of one-off summaries." />
          <ArtifactCard icon={Sparkles} title="Content operations" body="Run transcript-first briefing workflows, episode summaries, briefing notes, and reusable publishing structures." />
          <ArtifactCard icon={Sparkles} title="Relationship memory" body="Keep context on people, groups, permissions, and communication style without mixing private and shared contexts." />
          <ArtifactCard icon={Sparkles} title="AI work layer" body="Use multiple tools and models through one governing structure instead of relying on whichever single chat happens to be open." />
        </div>
      </ArtifactSection>

      <ArtifactSection
        id="safety"
        eyebrow="Safety and limits"
        title="This is valuable only if it stays trustworthy."
        description="Strong agent systems need explicit limits. Otherwise memory becomes leakage, tools become risk, and autonomy becomes noise."
      >
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-3xl border-border/60 bg-card/80 shadow-sm">
            <CardContent className="p-6 md:p-8">
              <ul className="space-y-4 text-sm leading-6 text-muted-foreground">
                <li><span className="font-semibold text-foreground">Private, shared, and group contexts stay separate.</span> The system should not silently mix one person’s memory into another context.</li>
                <li><span className="font-semibold text-foreground">Approvals remain visible.</span> Impactful actions need clear authority and boundaries.</li>
                <li><span className="font-semibold text-foreground">Memory is curated, not automatic sludge.</span> Good systems distinguish durable notes from temporary chatter.</li>
                <li><span className="font-semibold text-foreground">Retrieval matters as much as storage.</span> The real quality test is whether the right memory is used at the right time.</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-border/60 bg-primary text-primary-foreground shadow-xl shadow-primary/10">
            <CardContent className="flex h-full flex-col justify-between gap-6 p-6 md:p-8">
              <div className="space-y-3">
                <Badge className="w-fit rounded-full bg-white/15 text-white hover:bg-white/15">Bottom line</Badge>
                <h3 className="text-2xl font-semibold tracking-tight">The future is not just better chat.</h3>
                <p className="text-sm leading-6 text-primary-foreground/85">The winning systems will combine intelligence, memory, workflow structure, retrieval, and safety into one practical operating layer.</p>
              </div>
              <div className="text-xs uppercase tracking-[0.22em] text-primary-foreground/65">Samantha / OpenClaw artifact prototype</div>
            </CardContent>
          </Card>
        </div>
      </ArtifactSection>
    </main>
  );
}
