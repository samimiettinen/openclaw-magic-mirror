import { SlideType } from "@/lib/slide-types";

interface Props {
  slideType: SlideType;
  content: Record<string, any>;
}

const BASE: React.CSSProperties = {
  width: 1920, height: 1080, fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  color: "white", display: "flex", position: "relative", overflow: "hidden",
};
const BG = "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)";
const ACCENT = "#38bdf8";
const ACCENT2 = "#818cf8";

function HeroSlide({ accent_text, headline, subheadline }: any) {
  return (
    <div style={{ ...BASE, background: BG, alignItems: "center", justifyContent: "center", padding: 120 }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 600, height: 600, background: `radial-gradient(circle, ${ACCENT}10 0%, transparent 70%)` }} />
      <div style={{ textAlign: "center", zIndex: 1, maxWidth: 1400 }}>
        {accent_text && (
          <div style={{ fontSize: 22, letterSpacing: 8, textTransform: "uppercase", color: ACCENT, marginBottom: 40, fontWeight: 600 }}>
            {accent_text}
          </div>
        )}
        <h1 style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.1, margin: "0 0 32px" }}>
          {(headline || "").split("\n").map((line: string, i: number) => (
            <span key={i}>{i > 0 && <br />}{line}</span>
          ))}
        </h1>
        {subheadline && <p style={{ fontSize: 32, color: "#94a3b8", maxWidth: 900, margin: "0 auto" }}>{subheadline}</p>}
      </div>
    </div>
  );
}

function TextCardsSlide({ heading, description, cards }: any) {
  const items = cards || [];
  return (
    <div style={{ ...BASE, background: BG, flexDirection: "column", padding: 120 }}>
      <div style={{ marginBottom: 60 }}>
        <h2 style={{ fontSize: 64, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>{heading}</h2>
        {description && <p style={{ fontSize: 24, color: "#94a3b8", marginTop: 16 }}>{description}</p>}
      </div>
      <div style={{ display: "flex", gap: 32, flex: 1 }}>
        {items.map((card: any, i: number) => (
          <div key={i} style={{
            flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.08)", padding: 48,
            display: "flex", flexDirection: "column",
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: `${ACCENT}20`, marginBottom: 24,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: ACCENT }}>
              {i + 1}
            </div>
            <h3 style={{ fontSize: 28, fontWeight: 600, margin: "0 0 16px" }}>{card.title}</h3>
            <p style={{ fontSize: 20, color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>{card.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuoteSlide({ quote, author, role }: any) {
  return (
    <div style={{ ...BASE, background: BG, alignItems: "center", justifyContent: "center", padding: 160 }}>
      <div style={{ maxWidth: 1200, textAlign: "center" }}>
        <div style={{ fontSize: 120, color: ACCENT, opacity: 0.3, lineHeight: 0.8, marginBottom: 24 }}>"</div>
        <blockquote style={{ fontSize: 48, fontWeight: 500, lineHeight: 1.4, margin: "0 0 48px", fontStyle: "italic" }}>
          {quote}
        </blockquote>
        <div style={{ fontSize: 24, color: ACCENT, fontWeight: 600 }}>{author}</div>
        {role && <div style={{ fontSize: 20, color: "#64748b", marginTop: 8 }}>{role}</div>}
      </div>
    </div>
  );
}

function DiagramSlide({ title, description, layers }: any) {
  const items = layers || [];
  return (
    <div style={{ ...BASE, background: BG, flexDirection: "column", padding: 120 }}>
      <div style={{ marginBottom: 60 }}>
        <h2 style={{ fontSize: 56, fontWeight: 700, margin: 0 }}>{title}</h2>
        {description && <p style={{ fontSize: 22, color: "#94a3b8", marginTop: 12 }}>{description}</p>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1, justifyContent: "center" }}>
        {items.map((layer: any, i: number) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 32,
            background: `${layer.color || ACCENT}12`, borderRadius: 20,
            border: `1px solid ${layer.color || ACCENT}30`, padding: "32px 48px",
          }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: layer.color || ACCENT, minWidth: 180 }}>
              {layer.label}
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const }}>
              {(layer.items || []).map((item: string, j: number) => (
                <span key={j} style={{
                  fontSize: 18, padding: "8px 20px", borderRadius: 12,
                  background: "rgba(255,255,255,0.06)", color: "#cbd5e1",
                }}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricsSlide({ heading, description, metrics }: any) {
  const items = metrics || [];
  return (
    <div style={{ ...BASE, background: BG, flexDirection: "column", padding: 120, justifyContent: "center" }}>
      <div style={{ marginBottom: 80, textAlign: "center" }}>
        <h2 style={{ fontSize: 56, fontWeight: 700, margin: 0 }}>{heading}</h2>
        {description && <p style={{ fontSize: 22, color: "#94a3b8", marginTop: 12 }}>{description}</p>}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 64 }}>
        {items.map((m: any, i: number) => (
          <div key={i} style={{ textAlign: "center", minWidth: 240 }}>
            <div style={{ fontSize: 72, fontWeight: 800, background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {m.value}
            </div>
            <div style={{ fontSize: 22, color: "#94a3b8", marginTop: 12 }}>{m.label}</div>
            {m.change && (
              <div style={{ fontSize: 18, color: m.change.startsWith("-") ? "#f87171" : "#4ade80", marginTop: 8 }}>
                {m.change}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineSlide({ heading, events }: any) {
  const items = events || [];
  return (
    <div style={{ ...BASE, background: BG, flexDirection: "column", padding: 120 }}>
      <h2 style={{ fontSize: 56, fontWeight: 700, margin: "0 0 60px" }}>{heading}</h2>
      <div style={{ display: "flex", gap: 0, flex: 1, alignItems: "flex-start", position: "relative" }}>
        <div style={{ position: "absolute", top: 24, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT2})` }} />
        {items.map((e: any, i: number) => (
          <div key={i} style={{ flex: 1, paddingTop: 56, position: "relative", paddingRight: 32 }}>
            <div style={{
              position: "absolute", top: 14, left: 0, width: 20, height: 20, borderRadius: "50%",
              background: ACCENT, border: "4px solid #0f172a",
            }} />
            <div style={{ fontSize: 18, color: ACCENT, fontWeight: 600, marginBottom: 12 }}>{e.date}</div>
            <div style={{ fontSize: 26, fontWeight: 600, marginBottom: 8 }}>{e.title}</div>
            <div style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.5 }}>{e.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TwoColumnSlide({ heading, left, right }: any) {
  return (
    <div style={{ ...BASE, background: BG, flexDirection: "column", padding: 120 }}>
      <h2 style={{ fontSize: 56, fontWeight: 700, margin: "0 0 60px" }}>{heading}</h2>
      <div style={{ display: "flex", gap: 64, flex: 1 }}>
        {[left, right].map((col: any, i: number) => (
          <div key={i} style={{
            flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 24,
            border: `1px solid ${i === 0 ? ACCENT : ACCENT2}20`, padding: 56,
          }}>
            <div style={{ fontSize: 18, color: i === 0 ? ACCENT : ACCENT2, fontWeight: 600, textTransform: "uppercase", letterSpacing: 4, marginBottom: 24 }}>
              {col?.title}
            </div>
            <p style={{ fontSize: 24, color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>{col?.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClosingSlide({ headline, subtext, cta_text }: any) {
  return (
    <div style={{ ...BASE, background: BG, alignItems: "center", justifyContent: "center", padding: 160 }}>
      <div style={{ position: "absolute", bottom: -200, left: "50%", marginLeft: -400, width: 800, height: 800, background: `radial-gradient(circle, ${ACCENT2}15 0%, transparent 60%)` }} />
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <h1 style={{ fontSize: 96, fontWeight: 800, margin: "0 0 32px" }}>{headline}</h1>
        {subtext && <p style={{ fontSize: 28, color: "#94a3b8", margin: "0 0 48px" }}>{subtext}</p>}
        {cta_text && (
          <div style={{
            display: "inline-block", padding: "20px 48px", borderRadius: 16,
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
            fontSize: 24, fontWeight: 600, color: "white",
          }}>
            {cta_text}
          </div>
        )}
      </div>
    </div>
  );
}

export function SlideRenderer({ slideType, content }: Props) {
  switch (slideType) {
    case "hero": return <HeroSlide {...content} />;
    case "text-cards": return <TextCardsSlide {...content} />;
    case "quote": return <QuoteSlide {...content} />;
    case "diagram": return <DiagramSlide {...content} />;
    case "metrics": return <MetricsSlide {...content} />;
    case "timeline": return <TimelineSlide {...content} />;
    case "two-column": return <TwoColumnSlide {...content} />;
    case "closing": return <ClosingSlide {...content} />;
    default: return <HeroSlide headline="Unknown slide type" subheadline="" accent_text="" />;
  }
}
