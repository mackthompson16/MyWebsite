import { useEffect, useMemo, useRef, useState } from "react";
import "./styles/title.css";

export default function Header() {
  // Desktop art
  const SRC = useMemo(
    () =>
      String.raw`
Hello, I'm

ooo        ooooo                     oooo             ooooooooooooo oooo
 88.       .888                      888              8'   888    8  888
 888b     d'888   .oooo.    .ooooo.   888  oooo            888       888 .oo.    .ooooo.  ooo. .oo.  .oo.   oo.ooooo.   .oooo.o  .ooooo.  ooo. .oo.
 8 Y88. .P  888   P  )88b  d88'  "Y8  888 .8P'             888       888P Y88b  d88'  88b  888P Y88bP Y88b   888'  88b d88(   8 d88'  88b  888P Y88b
 8   888'   888   .oP"888  888        888888.              888       888   888  888   888  888   888   888   888   888  "Y88b.  888   888  888   888
 8    Y     888  d8(  888  888   .o8  888  88b.            888       888   888  888   888  888   888   888   888   888 o.  )88b 888   888  888   888  .o. 
o8o        o888o  Y888""8o  Y8bod8P' o888o o888o          o888o     o888o o888o  Y8bod8P' o888o o888o o888o  888bod8P' 8""888P'  Y8bod8P' o888o o888o Y8P 
                                                                                                             888                                       '  
                                                                                                            o888o

                                                                                                                                        Here's my shpeel.
`.replace(/^\n|\n$/g, ""),
    []
  );

  // Mobile art
  const Mobile_SRC = useMemo(
    () =>
      String.raw`
Hello, I'm

ooo        ooooo                     oooo
 88.       .888'                      888
 888b     d'888   .oooo.    .ooooo.   888  oooo
 8 Y88. .P  888   P  )88b  d88'  "Y8  888 .8P
 8   888'   888   .oP"888  888        888888
 8    Y     888  d8(  888  888   .o8  888  88b.  .o. 
o8o        o888o  Y888""8o  Y8bod8P' o888o o888o Y8P 
                                                  ' 
                                    Here's my shpeel.
`.replace(/^\n|\n$/g, ""),
    []
  );

  // Pick source based on viewport
  const [isMobile, setIsMobile] = useState(false);
  const [src, setSrc] = useState(SRC);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 1230px)");

    const apply = (matches) => {
      setIsMobile(matches);
      setSrc(matches ? Mobile_SRC : SRC);
    };

    // Initial
    apply(mq.matches);

    // Listen for viewport changes
    const handler = (e) => apply(e.matches);
    mq.addEventListener ? mq.addEventListener("change", handler)
                        : mq.addListener(handler); // Safari < 14

    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", handler)
                              : mq.removeListener(handler);
    };
  }, [SRC, Mobile_SRC]);

  // Build grid from the chosen source
  const grid = useMemo(() => src.split("\n").map(line => Array.from(line)), [src]);

  // Distances (use a slightly different xScale on mobile if you like)
  const distances = useMemo(() => {
    const rows = grid.length;
    const cols = Math.max(...grid.map(r => r.length));
    const xScale = isMobile ? 0.65 : 0.75;
    const dist = Array.from({ length: rows }, () => new Array(cols).fill(0));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        dist[r][c] = Math.hypot(r, c * xScale);
      }
    }
    return dist;
  }, [grid, isMobile]);

  // Animation config
  const SPEED = 22;
  const RING_THICKNESS = 2.8;
  const GLITCH_MS = 140;
  const PERSIST = false;

  // Helpers
  const encode = (ch) =>
    ch === " " ? "&nbsp;" :
    ch === "<" ? "&lt;" :
    ch === ">" ? "&gt;" :
    ch === "&" ? "&amp;" : ch;

  const asciiSwap = {
    ".": "*", "-": "=", "_": "-", '"': "'", "'": "`", "`": "'",
    "~": "^", "!": "1", "?": "7", ":": ";", ";": ":",
    "(": "[", ")": "]", "[": "(", "]": ")", "{": "(", "}": ")",
    "/": "\\", "\\": "/", "|": "!", "+": "*", "*": "+", "=": "-",
    "<": ">", ">": "<", "#": "%", "$": "S", "%": "#", "&": "@", "@": "&",
    ",": ".", "^": "~"
  };

  const bitFlip = (ch) => {
    if (ch === " ") return ".";
    const code = ch.charCodeAt(0);
    if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
      return String.fromCharCode(code ^ 0x20);
    }
    if (code >= 48 && code <= 57) {
      return String.fromCharCode(48 + ((code - 48 + 5) % 10));
    }
    if (asciiSwap[ch]) return asciiSwap[ch];
    return "#";
  };

  // Build DOM as BLANK first
  const hostRef = useRef(null);

  useEffect(() => {
    if (!hostRef.current) return;
    const rows = grid.length;
    const html = [];
    const BLANK = "&nbsp;";
    for (let r = 0; r < rows; r++) {
      const row = grid[r];
      for (let c = 0; c < row.length; c++) {
        const ch = row[c];
        html.push(
          `<span class="px"
            data-r="${r}" data-c="${c}"
            data-blank="${BLANK}"
            data-orig="${encode(ch)}"
            data-flip="${encode(bitFlip(ch))}">${BLANK}</span>`
        );
      }
      html.push("\n");
    }
    hostRef.current.innerHTML = html.join("");
  }, [grid]);

  // Animate ripple
  useEffect(() => {
    if (!hostRef.current) return;

    const spanGrid = grid.map((row, r) =>
      row.map((_, c) => hostRef.current.querySelector(`.px[data-r="${r}"][data-c="${c}"]`))
    );

    const lastFlipAt = new WeakMap();
    const start = performance.now();
    let raf = 0;

    const tick = (now) => {
      const t = (now - start) / 1000;
      const radius = t * SPEED;
      const inner = radius;
      const outer = radius + RING_THICKNESS;

      for (let r = 0; r < spanGrid.length; r++) {
        const row = spanGrid[r];
        for (let c = 0; c < row.length; c++) {
          const span = row[c];
          const d = distances[r][c];

          if (d < inner) {
            if (!span.classList.contains("flip") && span.innerHTML !== span.dataset.orig) {
              span.classList.remove("settled");
              span.innerHTML = span.dataset.orig;
              span.style.opacity = "";
            }
          } else if (d >= inner && d < outer) {
            const last = lastFlipAt.get(span) || 0;
            if (now - last > GLITCH_MS) {
              span.classList.add("flip");
              span.innerHTML = span.dataset.flip;
              span.style.opacity = "";
              lastFlipAt.set(span, now);
              setTimeout(() => {
                span.classList.remove("flip");
                const curRadius = ((performance.now() - start) / 1000) * SPEED;
                if (distances[r][c] < curRadius) {
                  span.innerHTML = span.dataset.orig;
                } else {
                  span.innerHTML = span.dataset.blank;
                  span.style.opacity = "0.0";
                }
              }, GLITCH_MS);
            }
          } else {
            if (!span.classList.contains("flip") && span.innerHTML !== span.dataset.blank) {
              span.classList.remove("settled");
              span.innerHTML = span.dataset.blank;
              span.style.opacity = "0.0";
            }
          }
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [grid, distances]);

  return (
    <header className="App-title">
      <div className="title-inner">
        <pre className="ascii-logo" ref={hostRef} aria-hidden="true" />
      </div>
    </header>
  );
}