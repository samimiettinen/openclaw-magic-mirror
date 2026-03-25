import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { SlideType } from "@/lib/slide-types";

interface Props {
  slideType: SlideType;
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
}

function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</Label>
      {multiline ? (
        <Textarea value={value || ""} onChange={(e) => onChange(e.target.value)} className="resize-none min-h-[80px] bg-background/50" />
      ) : (
        <Input value={value || ""} onChange={(e) => onChange(e.target.value)} className="bg-background/50" />
      )}
    </div>
  );
}

function HeroEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const set = (k: string, v: string) => onChange({ ...content, [k]: v });
  return (
    <div className="space-y-4">
      <Field label="Accent Text" value={content.accent_text} onChange={(v) => set("accent_text", v)} />
      <Field label="Headline" value={content.headline} onChange={(v) => set("headline", v)} multiline />
      <Field label="Subheadline" value={content.subheadline} onChange={(v) => set("subheadline", v)} multiline />
    </div>
  );
}

function TextCardsEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const set = (k: string, v: any) => onChange({ ...content, [k]: v });
  const cards = content.cards || [];
  const updateCard = (i: number, k: string, v: string) => {
    const updated = [...cards];
    updated[i] = { ...updated[i], [k]: v };
    set("cards", updated);
  };
  const addCard = () => set("cards", [...cards, { title: "New Card", body: "Description" }]);
  const removeCard = (i: number) => set("cards", cards.filter((_: any, j: number) => j !== i));

  return (
    <div className="space-y-4">
      <Field label="Heading" value={content.heading} onChange={(v) => set("heading", v)} />
      <Field label="Description" value={content.description} onChange={(v) => set("description", v)} multiline />
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cards</Label>
        {cards.map((card: any, i: number) => (
          <div key={i} className="p-3 rounded-lg border border-border/50 bg-background/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Card {i + 1}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeCard(i)}><Trash2 className="h-3 w-3" /></Button>
            </div>
            <Input value={card.title} onChange={(e) => updateCard(i, "title", e.target.value)} placeholder="Title" className="bg-background/50 h-8 text-sm" />
            <Textarea value={card.body} onChange={(e) => updateCard(i, "body", e.target.value)} placeholder="Body" className="bg-background/50 min-h-[50px] text-sm resize-none" />
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addCard} className="w-full gap-1"><Plus className="h-3 w-3" />Add Card</Button>
      </div>
    </div>
  );
}

function QuoteEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const set = (k: string, v: string) => onChange({ ...content, [k]: v });
  return (
    <div className="space-y-4">
      <Field label="Quote" value={content.quote} onChange={(v) => set("quote", v)} multiline />
      <Field label="Author" value={content.author} onChange={(v) => set("author", v)} />
      <Field label="Role / Title" value={content.role} onChange={(v) => set("role", v)} />
    </div>
  );
}

function DiagramEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const set = (k: string, v: any) => onChange({ ...content, [k]: v });
  const layers = content.layers || [];
  const updateLayer = (i: number, k: string, v: any) => {
    const updated = [...layers];
    updated[i] = { ...updated[i], [k]: v };
    set("layers", updated);
  };
  const addLayer = () => set("layers", [...layers, { label: "New Layer", color: "#38bdf8", items: ["Item"] }]);
  const removeLayer = (i: number) => set("layers", layers.filter((_: any, j: number) => j !== i));

  return (
    <div className="space-y-4">
      <Field label="Title" value={content.title} onChange={(v) => set("title", v)} />
      <Field label="Description" value={content.description} onChange={(v) => set("description", v)} multiline />
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Layers</Label>
        {layers.map((layer: any, i: number) => (
          <div key={i} className="p-3 rounded-lg border border-border/50 bg-background/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Layer {i + 1}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeLayer(i)}><Trash2 className="h-3 w-3" /></Button>
            </div>
            <div className="flex gap-2">
              <Input value={layer.label} onChange={(e) => updateLayer(i, "label", e.target.value)} placeholder="Label" className="bg-background/50 h-8 text-sm" />
              <Input value={layer.color} onChange={(e) => updateLayer(i, "color", e.target.value)} placeholder="#hex" className="bg-background/50 h-8 text-sm w-24" type="color" />
            </div>
            <Input value={(layer.items || []).join(", ")} onChange={(e) => updateLayer(i, "items", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} placeholder="Items (comma separated)" className="bg-background/50 h-8 text-sm" />
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addLayer} className="w-full gap-1"><Plus className="h-3 w-3" />Add Layer</Button>
      </div>
    </div>
  );
}

function MetricsEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const set = (k: string, v: any) => onChange({ ...content, [k]: v });
  const metrics = content.metrics || [];
  const updateMetric = (i: number, k: string, v: string) => {
    const updated = [...metrics];
    updated[i] = { ...updated[i], [k]: v };
    set("metrics", updated);
  };
  const addMetric = () => set("metrics", [...metrics, { value: "0", label: "Metric", change: "" }]);
  const removeMetric = (i: number) => set("metrics", metrics.filter((_: any, j: number) => j !== i));

  return (
    <div className="space-y-4">
      <Field label="Heading" value={content.heading} onChange={(v) => set("heading", v)} />
      <Field label="Description" value={content.description} onChange={(v) => set("description", v)} multiline />
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Metrics</Label>
        {metrics.map((m: any, i: number) => (
          <div key={i} className="p-3 rounded-lg border border-border/50 bg-background/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Metric {i + 1}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeMetric(i)}><Trash2 className="h-3 w-3" /></Button>
            </div>
            <div className="flex gap-2">
              <Input value={m.value} onChange={(e) => updateMetric(i, "value", e.target.value)} placeholder="Value" className="bg-background/50 h-8 text-sm" />
              <Input value={m.label} onChange={(e) => updateMetric(i, "label", e.target.value)} placeholder="Label" className="bg-background/50 h-8 text-sm" />
              <Input value={m.change || ""} onChange={(e) => updateMetric(i, "change", e.target.value)} placeholder="Change" className="bg-background/50 h-8 text-sm w-24" />
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addMetric} className="w-full gap-1"><Plus className="h-3 w-3" />Add Metric</Button>
      </div>
    </div>
  );
}

function TimelineEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const set = (k: string, v: any) => onChange({ ...content, [k]: v });
  const events = content.events || [];
  const updateEvent = (i: number, k: string, v: string) => {
    const updated = [...events];
    updated[i] = { ...updated[i], [k]: v };
    set("events", updated);
  };
  const addEvent = () => set("events", [...events, { date: "Q1", title: "Event", description: "Description" }]);
  const removeEvent = (i: number) => set("events", events.filter((_: any, j: number) => j !== i));

  return (
    <div className="space-y-4">
      <Field label="Heading" value={content.heading} onChange={(v) => set("heading", v)} />
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Events</Label>
        {events.map((e: any, i: number) => (
          <div key={i} className="p-3 rounded-lg border border-border/50 bg-background/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Event {i + 1}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeEvent(i)}><Trash2 className="h-3 w-3" /></Button>
            </div>
            <div className="flex gap-2">
              <Input value={e.date} onChange={(ev) => updateEvent(i, "date", ev.target.value)} placeholder="Date" className="bg-background/50 h-8 text-sm w-28" />
              <Input value={e.title} onChange={(ev) => updateEvent(i, "title", ev.target.value)} placeholder="Title" className="bg-background/50 h-8 text-sm" />
            </div>
            <Textarea value={e.description} onChange={(ev) => updateEvent(i, "description", ev.target.value)} placeholder="Description" className="bg-background/50 min-h-[40px] text-sm resize-none" />
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addEvent} className="w-full gap-1"><Plus className="h-3 w-3" />Add Event</Button>
      </div>
    </div>
  );
}

function TwoColumnEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const set = (k: string, v: any) => onChange({ ...content, [k]: v });
  const setCol = (side: "left" | "right", k: string, v: string) => set(side, { ...content[side], [k]: v });
  return (
    <div className="space-y-4">
      <Field label="Heading" value={content.heading} onChange={(v) => set("heading", v)} />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Left Column</Label>
          <Input value={content.left?.title || ""} onChange={(e) => setCol("left", "title", e.target.value)} placeholder="Title" className="bg-background/50 h-8 text-sm" />
          <Textarea value={content.left?.body || ""} onChange={(e) => setCol("left", "body", e.target.value)} placeholder="Body" className="bg-background/50 min-h-[80px] text-sm resize-none" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Right Column</Label>
          <Input value={content.right?.title || ""} onChange={(e) => setCol("right", "title", e.target.value)} placeholder="Title" className="bg-background/50 h-8 text-sm" />
          <Textarea value={content.right?.body || ""} onChange={(e) => setCol("right", "body", e.target.value)} placeholder="Body" className="bg-background/50 min-h-[80px] text-sm resize-none" />
        </div>
      </div>
    </div>
  );
}

function ClosingEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const set = (k: string, v: string) => onChange({ ...content, [k]: v });
  return (
    <div className="space-y-4">
      <Field label="Headline" value={content.headline} onChange={(v) => set("headline", v)} />
      <Field label="Subtext" value={content.subtext} onChange={(v) => set("subtext", v)} multiline />
      <Field label="CTA Text" value={content.cta_text} onChange={(v) => set("cta_text", v)} />
    </div>
  );
}

export function SlideEditorPanel({ slideType, content, onChange }: Props) {
  switch (slideType) {
    case "hero": return <HeroEditor content={content} onChange={onChange} />;
    case "text-cards": return <TextCardsEditor content={content} onChange={onChange} />;
    case "quote": return <QuoteEditor content={content} onChange={onChange} />;
    case "diagram": return <DiagramEditor content={content} onChange={onChange} />;
    case "metrics": return <MetricsEditor content={content} onChange={onChange} />;
    case "timeline": return <TimelineEditor content={content} onChange={onChange} />;
    case "two-column": return <TwoColumnEditor content={content} onChange={onChange} />;
    case "closing": return <ClosingEditor content={content} onChange={onChange} />;
    default: return <div className="text-muted-foreground text-sm">Unknown slide type</div>;
  }
}
