// Content.jsx
import { useEffect, useRef, useState, useMemo } from "react";
import PropTypes from "prop-types";
import "./styles/tabs.css";
const slugify = (s = "") =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const Content = ({ title, tabs }) => {
  const containerRef = useRef(null);
  const [active, setActive] = useState(0);
  const groupId = useMemo(() => slugify(title || "section"), [title]);

  // keep your fade-in behavior
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

     <div
      className="folder-tabs"
      role="tablist"
      aria-label={`${title} tabs`}
    >
      {Array.isArray(tabs) &&
        tabs.map((tab, i) => (
          <button
            key={i}
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

   <div className="folder-content">
        <div className="title">{title}</div>
    {/* Active panel */}
    {activeTab && (
      <div
        className="folder-panel"
        role="tabpanel"
        id={`panel-${groupId}-${active}`}
        aria-labelledby={`tab-${groupId}-${active}`}
      >
   
        <ul className="paragraphs-list">
  {activeTab.paragraphs?.map((b, j) => (
    <li key={j} className="paragraph-item">
      {b.header && <h4 className="paragraph-header">{b.header}</h4>}
      {b.paragraph && <p className="paragraph-text">{b.paragraph}</p>}

      {/* Sublist */}
      {Array.isArray(b.list) && (
        <ol className="paragraph-sublist">
          {b.list.map((item, k) => (
            <li key={k} className="sublist-item">
              {item}
            </li>
          ))}
        </ol>
      )}

      {/* Link (url or doc) */}
      {b.link && (
        <a
          href={b.link.link}
          target={b.link.type === "url" ? "_blank" : "_self"}
          rel={b.link.type === "url" ? "noopener noreferrer" : undefined}
          className="link retro-tab"
        >
          {"[" + b.link.text + "]"}
        </a>
      )}
    </li>
  ))}
</ul>


        {/* Media */}
        {activeTab.media && (
          <div className="media-block">
            <img
              src={activeTab.media.name}
              alt={activeTab.media.caption || "media"}
              className="media-img"
            />
            {activeTab.media.caption && (
              <p className="media-caption">{activeTab.media.caption}</p>
            )}
          </div>
        )}
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