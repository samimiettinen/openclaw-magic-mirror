import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SlideViewer } from "@/components/SlideViewer";
import { ArrowLeft, Save, Eye, Code, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SlideEditor() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (id && user) fetchSlide();
  }, [id, user]);

  const fetchSlide = async () => {
    const { data, error } = await supabase
      .from("slides")
      .select("*")
      .eq("id", id!)
      .single();

    if (error || !data) {
      toast({ title: "Esitystä ei löytynyt", variant: "destructive" });
      navigate("/");
      return;
    }
    setTitle(data.title);
    setHtmlContent(data.html_content);
    setLoading(false);
  };

  const saveSlide = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("slides")
      .update({ title, html_content: htmlContent, updated_at: new Date().toISOString() })
      .eq("id", id!);

    if (error) {
      toast({ title: "Tallennus epäonnistui", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Tallennettu!" });
    }
    setSaving(false);
  };

  const deleteSlide = async () => {
    if (!confirm("Haluatko varmasti poistaa tämän esityksen?")) return;
    await supabase.from("slides").delete().eq("id", id!);
    navigate("/");
  };

  if (authLoading || loading || !user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-none bg-transparent font-semibold text-lg h-auto p-0 focus-visible:ring-0 w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={view === "preview" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("preview")}
            >
              <Eye className="h-4 w-4 mr-1" />
              Esikatselu
            </Button>
            <Button
              variant={view === "code" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("code")}
            >
              <Code className="h-4 w-4 mr-1" />
              Koodi
            </Button>
            <Button variant="ghost" size="icon" onClick={deleteSlide} className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button onClick={saveSlide} disabled={saving} size="sm" className="gap-1">
              <Save className="h-4 w-4" />
              {saving ? "Tallennetaan..." : "Tallenna"}
            </Button>
          </div>
        </div>
      </header>

      {/* Editor area */}
      <div className="flex-1">
        {view === "preview" ? (
          <div className="h-full flex items-center justify-center p-8 bg-muted/30">
            <div className="w-full max-w-5xl">
              <SlideViewer htmlContent={htmlContent} className="rounded-lg shadow-2xl border border-border/30" />
            </div>
          </div>
        ) : (
          <Textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            className="w-full h-[calc(100vh-3.5rem)] resize-none rounded-none border-none font-mono text-sm bg-card focus-visible:ring-0"
            placeholder="Kirjoita HTML-sisältö tähän..."
          />
        )}
      </div>
    </div>
  );
}
