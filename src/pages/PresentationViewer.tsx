import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { SlideCanvas } from "@/components/deck/SlideCanvas";
import { SlideRenderer } from "@/components/deck/SlideRenderer";
import { DeckSlide } from "@/lib/slide-types";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PresentationViewer() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [slides, setSlides] = useState<DeckSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (id && user) {
      (async () => {
        const { data } = await (supabase as any).from("deck_slides").select("*").eq("deck_id", id).order("order_index");
        setSlides((data as DeckSlide[]) || []);
        setLoading(false);
      })();
    }
  }, [id, user]);

  const go = useCallback((dir: number) => {
    setCurrent((c) => Math.max(0, Math.min(slides.length - 1, c + dir)));
  }, [slides.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Escape") navigate(`/decks/${id}`);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go, navigate, id]);

  // Auto-hide controls
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const show = () => { setShowControls(true); clearTimeout(timer); timer = setTimeout(() => setShowControls(false), 3000); };
    window.addEventListener("mousemove", show);
    timer = setTimeout(() => setShowControls(false), 3000);
    return () => { window.removeEventListener("mousemove", show); clearTimeout(timer); };
  }, []);

  if (authLoading || loading || !user) return null;
  if (slides.length === 0) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
      <div className="text-center">
        <p className="text-lg mb-4">Ei slideja esitettäväksi</p>
        <Button variant="outline" onClick={() => navigate(`/decks/${id}`)}>Takaisin</Button>
      </div>
    </div>
  );

  const slide = slides[current];

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center relative" style={{ cursor: showControls ? "default" : "none" }}>
      <div className="w-full h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-[95vw] max-h-[95vh]" style={{ aspectRatio: "16/9" }}>
          <SlideCanvas className="w-full h-full rounded-lg">
            <SlideRenderer slideType={slide.slide_type} content={slide.content} />
          </SlideCanvas>
        </div>
      </div>

      {/* Controls overlay */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0"}`}>
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between pointer-events-auto">
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 gap-1 text-xs"
            onClick={() => navigate(`/decks/${id}`)}>
            <ArrowLeft className="h-3.5 w-3.5" />Takaisin
          </Button>
          <span className="text-white/50 text-xs">{current + 1} / {slides.length}</span>
        </div>

        {/* Nav buttons */}
        <button className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all pointer-events-auto"
          onClick={() => go(-1)} disabled={current === 0}>
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all pointer-events-auto"
          onClick={() => go(1)} disabled={current === slides.length - 1}>
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
