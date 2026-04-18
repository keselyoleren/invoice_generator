import React, { useEffect, useRef, useState } from 'react';

interface PreviewScalerProps {
  children: React.ReactNode;
  className?: string;
}

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 293;
const MM_TO_PX = 3.7795275591;
const A4_WIDTH_PX = A4_WIDTH_MM * MM_TO_PX;
const A4_HEIGHT_PX = A4_HEIGHT_MM * MM_TO_PX;

const PreviewScaler: React.FC<PreviewScalerProps> = ({ children, className = '' }) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const update = () => {
      const width = el.clientWidth;
      if (width > 0) setScale(Math.min(1, width / A4_WIDTH_PX));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={outerRef}
      className={className}
      style={{ width: '100%', height: `${scale * A4_HEIGHT_PX}px`, overflow: 'hidden' }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${A4_WIDTH_PX}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PreviewScaler;
