import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SlideCanvas } from "@/components/deck/SlideCanvas";
import { SlideRenderer } from "@/components/deck/SlideRenderer";
import { SlideEditorPanel } from "@/components/deck/SlideEditorPanel";
import { Deck, DeckSlide, SlideType, SLIDE_TYPES, getSlideTypeDefaults } from "@/lib/slide-types";
import { ArrowLeft, Save, Play, Plus, Copy, Trash2, ChevronUp, ChevronDown, Eye, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DeckEditor() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [slides, setSlides] = useState<DeckSlide[]>([]);
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [deckTitle, setDeckTitle] = useState("");

  const selectedSlide = slides.find((s) => s.id === selectedSlideId) || null;

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (id && user) fetchDeck();
  }, [id, user]);

  const fetchDeck = async () => {
    const { data: deckData } = await (supabase as any).from("decks").select("*").eq("id", id!).single();
    if (!deckData) { navigate("/"); return; }
    setDeck(deckData as Deck);
    setDeckTitle((deckData as any).title);

    const { data: slidesData } = await (supabase as any)
      .from("deck_slides").select("*").eq("deck_id", id!).order("order_index");
    setSlides((slidesData as DeckSlide[]) || []);
    if (slidesData && slidesData.length > 0) setSelectedSlideId((slidesData[0] as any).id);
    setLoading(false);
  };

  const save = async () => {
    setSaving(true);
    // Save deck title
    await (supabase as any).from("decks").update({ title: deckTitle, updated_at: new Date().toISOString() }).eq("id", id!);
    // Save all slides
    for (const slide of slides) {
      await (supabase as any).from("deck_slides")
        .update({ title: slide.title, content: slide.content, order_index: slide.order_index, section_label: slide.section_label, notes: slide.notes, updated_at: new Date().toISOString() })
        .eq("id", slide.id);
    }
    setSaving(false);
    toast({ title: "Tallennettu!" });
  };

  const addSlide = async (type: SlideType) => {
    const meta = SLIDE_TYPES.find((t) => t.type === type)!;
    const orderIndex = slides.length;
    const { data, error } = await (supabase as any).from("deck_slides")
      .insert({ deck_id: id!, title: meta.label, slide_type: type, order_index: orderIndex, content: getSlideTypeDefaults(type) })
      .select().single();
    if (error) { toast({ title: "Virhe", variant: "destructive" }); return; }
    const newSlide = data as DeckSlide;
    setSlides([...slides, newSlide]);
    setSelectedSlideId(newSlide.id);
    setShowTypeSelector(false);
  };

  const duplicateSlide = async (slide: DeckSlide) => {
    const orderIndex = slide.order_index + 1;
    // Shift subsequent slides
    const updated = slides.map((s) => s.order_index >= orderIndex ? { ...s, order_index: s.order_index + 1 } : s);
    const { data } = await (supabase as any).from("deck_slides")
      .insert({ deck_id: id!, title: `${slide.title} (kopio)`, slide_type: slide.slide_type, order_index: orderIndex, content: slide.content, section_label: slide.section_label, notes: slide.notes })
      .select().single();
    if (data) {
      const newSlides = [...updated, data as DeckSlide].sort((a, b) => a.order_index - b.order_index);
      setSlides(newSlides);
      setSelectedSlideId((data as any).id);
      // Update order in DB
      for (const s of newSlides) {
        await (supabase as any).from("deck_slides").update({ order_index: s.order_index }).eq("id", s.id);
      }
    }
  };

  const deleteSlide = async (slideId: string) => {
    await (supabase as any).from("deck_slides").delete().eq("id", slideId);
    const remaining = slides.filter((s) => s.id !== slideId);
    setSlides(remaining);
    if (selectedSlideId === slideId) setSelectedSlideId(remaining[0]?.id || null);
  };

  const moveSlide = async (slideId: string, direction: "up" | "down") => {
    const idx = slides.findIndex((s) => s.id === slideId);
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === slides.length - 1)) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const updated = [...slides];
    const tempOrder = updated[idx].order_index;
    updated[idx] = { ...updated[idx], order_index: updated[swapIdx].order_index };
    updated[swapIdx] = { ...updated[swapIdx], order_index: tempOrder };
    updated.sort((a, b) => a.order_index - b.order_index);
    setSlides(updated);
    for (const s of updated) {
      await (supabase as any).from("deck_slides").update({ order_index: s.order_index }).eq("id", s.id);
    }
  };

  const updateSlideContent = useCallback((content: Record<string, any>) => {
    setSlides((prev) => prev.map((s) => s.id === selectedSlideId ? { ...s, content } : s));
  }, [selectedSlideId]);

  const updateSlideTitle = useCallback((title: string) => {
    setSlides((prev) => prev.map((s) => s.id === selectedSlideId ? { ...s, title } : s));
  }, [selectedSlideId]);

  if (authLoading || loading || !user || !deck) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/30 bg-card/30 backdrop-blur-sm sticky top-0 z-50 shrink-0">
        <div className="flex items-center justify-between h-12 px-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Input value={deckTitle} onChange={(e) => setDeckTitle(e.target.value)}
              className="border-none bg-transparent font-semibold text-sm h-8 p-0 focus-visible:ring-0 w-48" />
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant={mode === "edit" ? "secondary" : "ghost"} size="sm" className="h-8 text-xs gap-1"
              onClick={() => setMode("edit")}><Pencil className="h-3 w-3" />Muokkaa</Button>
            <Button variant={mode === "preview" ? "secondary" : "ghost"} size="sm" className="h-8 text-xs gap-1"
              onClick={() => setMode("preview")}><Eye className="h-3 w-3" />Esikatselu</Button>
            <div className="w-px h-5 bg-border/50 mx-1" />
            <Button variant="ghost" size="sm" className="h-8 text-xs gap-1"
              onClick={() => navigate(`/decks/${id}/present`)}><Play className="h-3 w-3" />Esitä</Button>
            <Button onClick={save} disabled={saving} size="sm" className="h-8 text-xs gap-1">
              <Save className="h-3 w-3" />{saving ? "..." : "Tallenna"}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Slide sidebar */}
        <div className="w-56 border-r border-border/30 bg-card/20 flex flex-col shrink-0">
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {slides.map((slide, i) => (
                <div key={slide.id}
                  className={`group rounded-lg border transition-all cursor-pointer ${
                    selectedSlideId === slide.id ? "border-primary/40 bg-primary/5 shadow-sm" : "border-transparent hover:border-border/40 hover:bg-muted/30"
                  }`}
                  onClick={() => setSelectedSlideId(slide.id)}
                >
                  <div className="p-1.5">
                    <SlideCanvas className="rounded">
                      <SlideRenderer slideType={slide.slide_type} content={slide.content} />
                    </SlideCanvas>
                  </div>
                  <div className="px-2 pb-2 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground truncate">{i + 1}. {slide.title}</span>
                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={(e) => { e.stopPropagation(); moveSlide(slide.id, "up"); }}>
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={(e) => { e.stopPropagation(); moveSlide(slide.id, "down"); }}>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={(e) => { e.stopPropagation(); duplicateSlide(slide); }}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive" onClick={(e) => { e.stopPropagation(); deleteSlide(slide.id); }}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-3 border-t border-border/30">
            <Button variant="outline" size="sm" className="w-full text-xs gap-1" onClick={() => setShowTypeSelector(true)}>
              <Plus className="h-3 w-3" />Lisää slide
            </Button>
          </div>
        </div>

        {/* Main area */}
        <div className="flex-1 flex overflow-hidden">
          {selectedSlide ? (
            mode === "preview" ? (
              <div className="flex-1 flex items-center justify-center p-8 bg-muted/10">
                <div className="w-full max-w-5xl">
                  <SlideCanvas className="rounded-xl shadow-2xl border border-border/20">
                    <SlideRenderer slideType={selectedSlide.slide_type} content={selectedSlide.content} />
                  </SlideCanvas>
                </div>
              </div>
            ) : (
              <>
                {/* Preview */}
                <div className="flex-1 flex items-center justify-center p-6 bg-muted/10">
                  <div className="w-full max-w-4xl">
                    <SlideCanvas className="rounded-xl shadow-2xl border border-border/20">
                      <SlideRenderer slideType={selectedSlide.slide_type} content={selectedSlide.content} />
                    </SlideCanvas>
                  </div>
                </div>
                {/* Editor panel */}
                <div className="w-80 border-l border-border/30 bg-card/20 flex flex-col shrink-0">
                  <div className="p-4 border-b border-border/30">
                    <Input value={selectedSlide.title} onChange={(e) => updateSlideTitle(e.target.value)}
                      className="font-semibold text-sm h-8 bg-transparent border-none p-0 focus-visible:ring-0" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {SLIDE_TYPES.find((t) => t.type === selectedSlide.slide_type)?.label}
                    </span>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-4">
                      <SlideEditorPanel
                        slideType={selectedSlide.slide_type}
                        content={selectedSlide.content}
                        onChange={updateSlideContent}
                      />
                    </div>
                  </ScrollArea>
                </div>
              </>
            )
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="text-sm mb-4">Ei vielä slideja</p>
                <Button onClick={() => setShowTypeSelector(true)} className="gap-2">
                  <Plus className="h-4 w-4" />Lisää ensimmäinen slide
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slide type selector */}
      <Dialog open={showTypeSelector} onOpenChange={setShowTypeSelector}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Valitse slide-tyyppi</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            {SLIDE_TYPES.map((type) => (
              <button key={type.type}
                className="flex items-start gap-3 p-4 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all text-left group"
                onClick={() => addSlide(type.type)}
              >
                <span className="text-2xl shrink-0 mt-0.5">{type.icon}</span>
                <div>
                  <div className="text-sm font-semibold group-hover:text-primary transition-colors">{type.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{type.description}</div>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
