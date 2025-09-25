import { useEffect, useRef, useState, useMemo } from "react";
import PropTypes from "prop-types";
import "./styles/tabs.css";
import FolderTabs from "./FolderTabs.js";

const slugify = (s = "") =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/* ===== Inline markup helpers ========================================== */
const INLINE_TOKENS = {
  b: (key, children) => <strong key={key}>{children}</strong>,
  i: (key, children) => <em key={key}>{children}</em>,
};

function parseInline(text = "") {
  let keySeed = 0;
  function walk(s, startIdx = 0) {
    const out = [];
    let i = startIdx;
    let buffer = "";
    const flush = () => { if (buffer) { out.push(buffer); buffer = ""; } };

    while (i < s.length) {
      const ch = s[i];
      if (ch === "}") { flush(); return { nodes: out, next: i + 1, closed: true }; }

      if (ch === "\\") {
        const t = s[i + 1];
        if (INLINE_TOKENS[t] && s[i + 2] === "{") {
          flush();
          const inner = walk(s, i + 3);
          if (!inner.closed) { buffer += s.slice(i, inner.next); i = inner.next; continue; }
          const nodeKey = `mk-${keySeed++}`;
          out.push(INLINE_TOKENS[t](nodeKey, inner.nodes));
          i = inner.next;
          continue;
        }
        buffer += "\\"; i += 1; continue;
      }

      buffer += ch; i += 1;
    }
    flush();
    return { nodes: out, next: i, closed: false };
  }
  return walk(text, 0).nodes;
}
/* ===================================================================== */

const Content = ({ title, tabs, id }) => {
  const containerRef = useRef(null);
  const [active, setActive] = useState(0);
  const groupId = useMemo(() => slugify(title || "section"), [title]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const els = root.querySelectorAll(".fade-in");
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const activeTab = tabs?.[active];

  return (
    <section ref={containerRef} className="folder">
      <FolderTabs
        title={title}
        tabs={tabs}
        active={active}
        setActive={setActive}
        groupId={groupId}
      />
      <div className="folder-content">
        <div className="title">{title}</div>

        {activeTab && (
          <div
            className="folder-panel"
            role="tabpanel"
            id={`panel-${groupId}-${active}`}
            aria-labelledby={`tab-${groupId}-${active}`}
          >
            <ul className="paragraphs-list" key={`plist-${active}`}>
              {activeTab.paragraphs?.map((b, j) => (
                <li key={j} className="paragraph-item">
                  {b.header && (
                    <h4 className="paragraph-header">{parseInline(b.header)}</h4>
                  )}

                  {b.paragraph && (
                    <p className="paragraph-text">{parseInline(b.paragraph)}</p>
                  )}

                  {Array.isArray(b.list) && (
                    <ol className="paragraph-sublist">
                      {b.list.map((item, k) => (
                        <li key={k} className="sublist-item">
                          {parseInline(item)}
                        </li>
                      ))}
                    </ol>
                  )}

                  {b.link && (
                    <a
                      href={b.link.link}
                      target={b.link.type === "url" ? "_blank" : "_self"}
                      rel={b.link.type === "url" ? "noopener noreferrer" : undefined}
                      className="link retro-tab"
                    >
                      {">[" + b.link.text + "]"}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

Content.propTypes = {
  title: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      paragraphs: PropTypes.arrayOf(
        PropTypes.shape({
          header: PropTypes.string,
          paragraph: PropTypes.string,
          list: PropTypes.arrayOf(PropTypes.string),
          link: PropTypes.shape({
            type: PropTypes.oneOf(["url", "doc"]).isRequired,
            text: PropTypes.string.isRequired,
            link: PropTypes.string.isRequired,
          }),
        })
      ),
      media: PropTypes.shape({
        name: PropTypes.string.isRequired,
        caption: PropTypes.string,
      }),
    })
  ).isRequired,
};

export default Content;
