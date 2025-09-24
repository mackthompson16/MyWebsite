// App.jsx
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import contentsData from "./Contents.json";
import Content from "./Content";
import Title from "./title";
import contactData from "./Contact.json";
import BackgroundGodHands from "./backgroundGodHands.js";
import "./styles/tabs.css";
import "./styles/title.css";
import "./styles/main.css";
import "./styles/header.css";
import"./styles/content.css";
import "./styles/godHands.css";

const slugify = s =>
  (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function App() {
  const sections = Array.isArray(contentsData) ? contentsData : [];
  const [activeSection, setActiveSection] = useState(0);
  const groupId = useMemo(() => slugify("root-sections"), []);
  const sectionRefs = useRef([]);             
  const onSelect = useCallback((i) => {
    const el = sectionRefs.current[i];
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

  }, []);

  // keep tabs highlighted while scrolling
  useEffect(() => {
    if (!sectionRefs.current.length) return;

    // rootMargin centers the "observation window" to pick the middle-ish section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index") || "0");
            setActiveSection(idx);
          }
        });
      },
      {
        root: null,
        threshold: 0.5,                 // ~50% of section visible to count as active
      }
    );

    sectionRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, [sections.length]);

  // assumes `contactData` is exactly the array you showed
const leftList  = (Array.isArray(contactData) ? contactData : []).find(x => x.left)?.left ?? [];
const rightList = (Array.isArray(contactData) ? contactData : []).find(x => x.right)?.right ?? [];

// helper: build proper hrefs for left/right entries
const buildHref = (item) => {
  // left side uses { title, link }
  if ("link" in item) return item.link;

  // right side uses { title, ref }
  if ("ref" in item) {
    // email draft (accepts bare email like "name@domain")
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.ref)) {
      const to = item.ref;
      const subject = encodeURIComponent("Hello from your website");
      const body    = encodeURIComponent("Hi Mack,\n\nI saw your portfolio and wanted to reach out.\n");
      return `mailto:${to}?subject=${subject}&body=${body}`;
    }
    // otherwise treat as file/url (e.g., "files/resume.pdf" or "https://...")
    return item.ref;
  }

  // fallback
  return "#";
};


  return (
    <div className="App">
       <BackgroundGodHands rangePx={1400} />
      <Title />

      <section className="main">
      <div className="site-header">
        <nav className="header-tabs" aria-label="Sections">
          {sections.map((c, i) => (
            <button
              key={i}
              className={`retro-tab header-tab ${i === activeSection ? "is-active" : ""}`}
              aria-controls={`section-${groupId}-${i}`}
              id={`left-tab-${groupId}-${i}`}
              onClick={() => onSelect(i)}
              type="button"
            >
              {"[ " + c.title + " ]"}
            </button>
          ))}
        </nav>
</div>
        {/* Inline content: render all sections one after another */}
        <div className="main-panel">
          {sections.map((section, i) => {
            const secId = `section-${groupId}-${i}`;
            return (
              <section
                key={secId}
                id={secId}
                className={`content-section index-${i}`}
                ref={(el) => (sectionRefs.current[i] = el)}
                data-index={i}
                aria-labelledby={`left-tab-${groupId}-${i}`}
              >
                <Content title={section.title} tabs={section.tabs} id={groupId}/>
              </section>
            );
          })}
        </div>
      </section>
      
<nav className="left-tabs retro-tab" aria-label="Social links">
  {leftList.map((item, i) => (
    <a
      key={`left-${i}`}
      className="left-tab"
      id={`left-tab-${groupId}-${i}`}
      href={buildHref(item)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {`[ ${item.title} ]`}
    </a>
  ))}
</nav>

<nav className="right-tabs retro-tab" aria-label="Contact links">
  {rightList.map((item, i) => {
    const href = buildHref(item);
    const isPdf = typeof item.ref === "string" && /\.pdf(\?|$)/i.test(item.ref);
    const isMailto = href.startsWith("mailto:");

    return (
      <a
        key={`right-${i}`}
        className="right-tab"
        id={`right-tab-${groupId}-${i}`}
        href={href}
        // open PDFs/external in a new tab; mailto opens the mail client
        target={isMailto ? undefined : "_blank"}
        rel={isMailto ? undefined : "noopener noreferrer"}
        // optional: trigger download if you prefer (remove if you want in-browser preview)
        {...(isPdf ? { /* download: "Mack_Thompson_Resume.pdf" */ } : {})}
      >
        {`[ ${item.title} ]`}
      </a>
    );
  })}
</nav>
    </div>
  );
}
