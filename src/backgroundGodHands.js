// BackgroundGodHands.jsx
import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function BackgroundGodHands({ rangePx = 1400 }) {
  useEffect(() => {
    const onScroll = () => {
      const p = Math.max(0, Math.min(1, window.scrollY / rangePx));
      document.documentElement.style.setProperty("--gh-progress", String(p));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [rangePx]);

  return createPortal(
    <div className="godhands-fixed" aria-hidden="true">
      <img className="godhand godhand-left" src="/LeftGodHand.jpg" alt="" draggable="false" />
      <img className="godhand godhand-right" src="/RightGodHand.jpg" alt="" draggable="false" />
    </div>,
    document.body
  );
}
  