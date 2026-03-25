import { Deck } from "@/lib/slide-types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Copy, Archive, Trash2, Presentation } from "lucide-react";

interface Props {
  deck: Deck;
  slideCount?: number;
  onClick: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  ready: "bg-primary/10 text-primary border-primary/20",
  archived: "bg-muted/50 text-muted-foreground/60",
};

export function DeckCard({ deck, slideCount, onClick, onDuplicate, onArchive, onDelete }: Props) {
  return (
    <Card
      className="group cursor-pointer border-border/40 bg-card/80 hover:border-border hover:shadow-md transition-all duration-300 overflow-hidden"
      onClick={onClick}
    >
      {/* Thumbnail area */}
      <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center relative">
        <Presentation className="h-10 w-10 text-muted-foreground/20" />
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-7 w-7 shadow-sm">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDuplicate}><Copy className="h-3.5 w-3.5 mr-2" />Kopioi</DropdownMenuItem>
              <DropdownMenuItem onClick={onArchive}><Archive className="h-3.5 w-3.5 mr-2" />{deck.status === "archived" ? "Palauta" : "Arkistoi"}</DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive"><Trash2 className="h-3.5 w-3.5 mr-2" />Poista</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{deck.title}</h3>
            {deck.subtitle && <p className="text-xs text-muted-foreground truncate mt-0.5">{deck.subtitle}</p>}
          </div>
          <Badge variant="outline" className={`text-[10px] shrink-0 ${STATUS_STYLES[deck.status] || ""}`}>
            {deck.status}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground/70">
          <span>{slideCount !== undefined ? `${slideCount} slidiä` : ""}</span>
          <span>{new Date(deck.updated_at).toLocaleDateString("fi-FI")}</span>
        </div>
        {deck.tags && deck.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {deck.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{tag}</span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
