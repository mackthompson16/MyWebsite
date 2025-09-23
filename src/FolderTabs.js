import { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function FolderTabs({ title, tabs = [], active, setActive, groupId}) {
  const containerRef = useRef(null);
  const arrowRef = useRef(null);
  const btnRefs = useRef([]);     // each entry will be a DOM node
  const [arrowY, setArrowY] = useState(0);
  const recalc = () => {
    const c = containerRef.current;
    const b = btnRefs.current[active];
    if (!c || !b) return;
    // position arrow vertically centered to the active button
    const newY = b.offsetTop + (b.offsetHeight - (arrowRef.current?.offsetHeight ?? 0)) / 2;
    setArrowY(newY);
  };

  // on mount + whenever active or tab count changes
  useLayoutEffect(() => {
    recalc();
    const ro = new ResizeObserver(recalc);
    if (containerRef.current) ro.observe(containerRef.current);
    btnRefs.current.forEach(el => el && ro.observe(el));
    window.addEventListener("resize", recalc);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recalc);
    };
  }, [active, tabs.length]);

  // nudge after paint (fonts/layout)
  useEffect(() => {
    const t = setTimeout(recalc, 0);
    return () => clearTimeout(t);
  }, [active]);

  return (

    <div
      ref={containerRef}
      className="folder-tabs"
      role="tablist"
      aria-label={`${title} tabs`}
    >
     
    
    <div
        ref={arrowRef}
        className="tab-arrow"
        aria-hidden="true"
        style={{ transform: `translateY(${arrowY}px)` }}
      >
        &gt;
      </div>

      {tabs.map((tab, i) => (
        <button
          key={i}
          ref={el => (btnRefs.current[i] = el)}
          className={`folder-tab retro-tab ${i === active ? "is-active" : ""}`}
          role="tab"
          aria-selected={i === active}
          aria-controls={`panel-${groupId}-${i}`}
          id={`tab-${groupId}-${i}`}
          onClick={() => setActive(i)}
          type="button"
        >
          {"[ " + tab.title + " ]"}
        </button>
      ))}
    </div>
  );
}
