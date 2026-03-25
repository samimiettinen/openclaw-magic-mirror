import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

// Type for slides table until auto-generated types catch up
type SlideRow = {
  id: string;
  user_id: string;
  title: string;
  html_content: string;
  created_at: string;
  updated_at: string;
};
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SlideViewer } from "@/components/SlideViewer";
import { Plus, LogOut, Presentation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Slide = SlideRow;

const SAMPLE_SLIDE = `
<div style="width:1920px;height:1080px;background:linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);display:flex;align-items:center;justify-content:center;font-family:'Inter',system-ui,sans-serif;color:white;padding:120px;">
  <div style="text-align:center;">
    <div style="font-size:24px;letter-spacing:8px;text-transform:uppercase;color:#38bdf8;margin-bottom:40px;font-weight:600;">OpenClaw Samantha</div>
    <h1 style="font-size:96px;font-weight:800;line-height:1.1;margin:0 0 32px;">Tervetuloa<br/><span style="background:linear-gradient(90deg,#38bdf8,#818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">esityksiin</span></h1>
    <p style="font-size:32px;color:#94a3b8;max-width:900px;margin:0 auto;">Luo ja hallinnoi HTML-esityksiä Claude-slides -tyylillä</p>
  </div>
</div>`;

export default function Dashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchSlides();
  }, [user]);

  const fetchSlides = async () => {
    const { data, error } = await (supabase as any)
      .from("slides")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching slides:", error);
      setSlides([]);
    } else {
      setSlides((data as Slide[]) || []);
    }
    setLoading(false);
  };

  const createSlide = async () => {
    const { data, error } = await (supabase as any)
      .from("slides")
      .insert({
        title: "Uusi esitys",
        html_content: SAMPLE_SLIDE,
        user_id: user!.id,
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Virhe", description: error.message, variant: "destructive" });
      return;
    }
    if (data) {
      navigate(`/slides/${(data as any).id}`);
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-sm font-black text-primary-foreground tracking-tighter">OC</span>
            </div>
            <span className="text-lg font-bold tracking-tight">OpenClaw Samantha</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Kirjaudu ulos
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Esitykset</h1>
            <p className="text-muted-foreground mt-1">HTML-esitykset Claude-slides -tyylillä</p>
          </div>
          <Button onClick={createSlide} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Uusi esitys
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-muted rounded-t-lg" />
                <CardHeader><div className="h-5 bg-muted rounded w-2/3" /></CardHeader>
              </Card>
            ))}
          </div>
        ) : slides.length === 0 ? (
          <Card className="border-dashed border-2 border-border">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Presentation className="h-16 w-16 text-muted-foreground/40 mb-4" />
              <CardTitle className="text-xl mb-2">Ei vielä esityksiä</CardTitle>
              <CardDescription className="mb-6">Luo ensimmäinen HTML-esityksesi</CardDescription>
              <Button onClick={createSlide} className="gap-2">
                <Plus className="h-4 w-4" />
                Luo esitys
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((slide) => (
              <Card
                key={slide.id}
                className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/30 group overflow-hidden"
                onClick={() => navigate(`/slides/${slide.id}`)}
              >
                <div className="bg-muted/30 rounded-t-lg overflow-hidden">
                  <SlideViewer htmlContent={slide.html_content} />
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base group-hover:text-primary transition-colors">
                    {slide.title}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {new Date(slide.updated_at).toLocaleDateString("fi-FI")}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
