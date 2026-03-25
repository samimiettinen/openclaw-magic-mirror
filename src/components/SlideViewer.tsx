import { useRef, useEffect, useState } from "react";

interface SlideViewerProps {
  htmlContent: string;
  className?: string;
}

export function SlideViewer({ htmlContent, className = "" }: SlideViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const parent = containerRef.current.parentElement;
      if (!parent) return;
      const scaleX = parent.clientWidth / 1920;
      const scaleY = parent.clientHeight / 1080;
      setScale(Math.min(scaleX, scaleY));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current?.parentElement) {
      observer.observe(containerRef.current.parentElement);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: "16/9" }}>
      <div
        ref={containerRef}
        className="absolute slide-content"
        style={{
          width: 1920,
          height: 1080,
          left: "50%",
          top: "50%",
          marginLeft: -960,
          marginTop: -540,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
