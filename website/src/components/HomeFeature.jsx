import React, { useMemo, useState } from "react";
import StoryModal from "./StoryModal";
import Skeleton from "./Skeleton";
import "../styles/home-feature.css";

const HomeFeature = ({ loveStories = [], loading = false }) => {
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState(null);
  const [show, setShow] = useState(false);

  const stories = useMemo(() => {
    if (!Array.isArray(loveStories)) return [];
    const copy = [...loveStories];
    if (sort === "newest") copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === "oldest") copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sort === "alpha") copy.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    return copy;
  }, [loveStories, sort]);

  const open = (item) => {
    setSelected(item);
    setShow(true);
  };

  return (
    <section id="home-feature" className="home-feature section" data-aos="fade-up" data-aos-delay="150">
      <div className="container">
        <div className="feature-header">
          <div>
            <h2>Featured Moments</h2>
            <p className="muted">Handpicked stories from our recent shoots — tap to view details.</p>
          </div>

          <div className="feature-controls">
            <label className="sr-only">Sort</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="alpha">Title A → Z</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="feature-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="feature-card">
                <Skeleton style={{ paddingBottom: '70%', borderRadius: 12 }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="feature-grid">
            {stories && stories.length ? (
              stories.slice(0, 8).map((s) => {
                const img = s.image || s.coverImage || (s.images && s.images[0]) || "/assets/img/placeholder.png";
                return (
                  <button key={s._id || s.id || img} className="feature-card" onClick={() => open(s)}>
                    <div className="feature-image" style={{ backgroundImage: `url(${img})` }} />
                    <div className="feature-body">
                      <h4 className="feature-title">{s.title || s.name || "Untitled"}</h4>
                      <p className="feature-sub">{s.subtitle || s.excerpt || "View story"}</p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="no-items">No featured moments available.</div>
            )}
          </div>
        )}
      </div>

      <StoryModal show={show} onHide={() => setShow(false)} story={selected} />
    </section>
  );
};

export default HomeFeature;
