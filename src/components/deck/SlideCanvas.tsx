import { useRef, useEffect, useState, ReactNode } from "react";

interface SlideCanvasProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}

export function SlideCanvas({ children, className = "", interactive = false }: SlideCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const parent = containerRef.current.parentElement;
      if (!parent) return;
      setScale(Math.min(parent.clientWidth / 1920, parent.clientHeight / 1080));
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current?.parentElement) observer.observe(containerRef.current.parentElement);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: "16/9" }}>
      <div
        ref={containerRef}
        className="absolute"
        style={{
          width: 1920,
          height: 1080,
          left: "50%",
          top: "50%",
          marginLeft: -960,
          marginTop: -540,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          pointerEvents: interactive ? "auto" : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
