import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeckCard } from "@/components/deck/DeckCard";
import { Deck } from "@/lib/slide-types";
import { Plus, LogOut, Search, LayoutGrid, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function DeckLibrary() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("Uusi esitys");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchDecks();
  }, [user]);

  const fetchDecks = async () => {
    const { data, error } = await (supabase as any)
      .from("decks").select("*").order("updated_at", { ascending: false });
    if (error) { console.error(error); setDecks([]); }
    else setDecks((data as Deck[]) || []);
    setLoading(false);
  };

  const createDeck = async () => {
    const { data, error } = await (supabase as any)
      .from("decks").insert({ title: newTitle, subtitle: newSubtitle, description: newDesc, user_id: user!.id }).select().single();
    if (error) { toast({ title: "Virhe", description: error.message, variant: "destructive" }); return; }
    setShowCreate(false);
    setNewTitle("Uusi esitys"); setNewSubtitle(""); setNewDesc("");
    navigate(`/decks/${(data as any).id}`);
  };

  const duplicateDeck = async (deck: Deck) => {
    const { data: newDeck, error } = await (supabase as any)
      .from("decks").insert({ title: `${deck.title} (kopio)`, subtitle: deck.subtitle, description: deck.description, theme: deck.theme, tags: deck.tags, user_id: user!.id }).select().single();
    if (error || !newDeck) { toast({ title: "Kopiointi epäonnistui", variant: "destructive" }); return; }
    // Copy slides
    const { data: slides } = await (supabase as any).from("deck_slides").select("*").eq("deck_id", deck.id).order("order_index");
    if (slides && slides.length > 0) {
      const newSlides = slides.map((s: any) => ({ deck_id: (newDeck as any).id, title: s.title, section_label: s.section_label, slide_type: s.slide_type, order_index: s.order_index, content: s.content, notes: s.notes }));
      await (supabase as any).from("deck_slides").insert(newSlides);
    }
    toast({ title: "Esitys kopioitu!" });
    fetchDecks();
  };

  const archiveDeck = async (deck: Deck) => {
    const newStatus = deck.status === "archived" ? "draft" : "archived";
    await (supabase as any).from("decks").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", deck.id);
    fetchDecks();
  };

  const deleteDeck = async (deck: Deck) => {
    if (!confirm(`Poista "${deck.title}"?`)) return;
    await (supabase as any).from("decks").delete().eq("id", deck.id);
    fetchDecks();
  };

  const filtered = decks.filter((d) => {
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    if (search && !d.title.toLowerCase().includes(search.toLowerCase()) && !d.subtitle?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/30 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-xs font-black text-primary-foreground tracking-tighter">OC</span>
            </div>
            <span className="text-base font-semibold tracking-tight">OpenClaw Samantha</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut} className="text-xs">
              <LogOut className="h-3.5 w-3.5 mr-1.5" />Kirjaudu ulos
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-6xl">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Esityskirjasto</h1>
            <p className="text-muted-foreground mt-1 text-sm">Hallinnoi ja luo esityksiä</p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />Uusi esitys
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Hae esityksiä..." className="pl-9 bg-card/50 border-border/40 h-9" />
          </div>
          <div className="flex gap-1">
            {["all", "draft", "ready", "archived"].map((s) => (
              <Button key={s} variant={statusFilter === s ? "secondary" : "ghost"} size="sm" className="text-xs h-9"
                onClick={() => setStatusFilter(s)}>
                {s === "all" ? "Kaikki" : s === "draft" ? "Luonnos" : s === "ready" ? "Valmis" : "Arkisto"}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-xl bg-muted/30 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
              <LayoutGrid className="h-7 w-7 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {search || statusFilter !== "all" ? "Ei tuloksia" : "Ei vielä esityksiä"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {search || statusFilter !== "all" ? "Kokeile eri hakuehtoja" : "Luo ensimmäinen esityksesi aloittaaksesi"}
            </p>
            {!search && statusFilter === "all" && (
              <Button onClick={() => setShowCreate(true)} className="gap-2"><Plus className="h-4 w-4" />Luo esitys</Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                onClick={() => navigate(`/decks/${deck.id}`)}
                onDuplicate={() => duplicateDeck(deck)}
                onArchive={() => archiveDeck(deck)}
                onDelete={() => deleteDeck(deck)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Uusi esitys</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Otsikko</Label>
              <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Alaotsikko</Label>
              <Input value={newSubtitle} onChange={(e) => setNewSubtitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Kuvaus</Label>
              <Textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="resize-none min-h-[60px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowCreate(false)}>Peruuta</Button>
            <Button onClick={createDeck}>Luo esitys</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
