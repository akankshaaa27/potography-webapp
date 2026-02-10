import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Skeleton from "../components/Skeleton";

// Extract YouTube ID
const getYouTubeId = (url) => {
  if (!url) return "";
  const regExp =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : "";
};

const Films = () => {
  const [films, setFilms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.className = "portfolio-page";

    const fetchData = async () => {
      try {
        const [filmsRes, typesRes] = await Promise.all([
          fetch("/api/films"),
          fetch("/api/event-types")
        ]);

        const filmsData = await filmsRes.json();
        const typesData = await typesRes.json();

        const activeFilms = filmsData.filter(f => f.status === "Active");
        setFilms(activeFilms);

        // Filter types to only show those that have films
        const usedCategories = new Set(activeFilms.map(f => f.category));
        setCategories(typesData.filter(t => t.isActive && usedCategories.has(t.name)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    return () => {
      document.body.className = "";
    };
  }, []);

  const filteredFilms = activeCategory === "All"
    ? films
    : films.filter(film => film.category === activeCategory);

  // Initialize GLightbox
  useEffect(() => {
    if (!loading && window.GLightbox) {
      const lightbox = window.GLightbox({
        selector: ".glightbox",
        touchNavigation: true,
        loop: true,
      });
    }
  }, [loading, filteredFilms]);

  return (
    <>
      <Header />

      <main className="main">
        {/* Page Title */}
        <div
          className="page-title dark-background"
          style={{ backgroundImage: "url('/assets/img/HomePage/84.webp')" }}
        >
          <div className="container position-relative text-center">
            <h1>Our Films</h1>
            <p>
              Capturing life’s most precious moments through cinematic
              storytelling
            </p>
            <nav className="breadcrumbs">
              <ol>
                <li><a href="/">Home</a></li>
                <li className="current">Films</li>
              </ol>
            </nav>
          </div>

        </div>

        {/* Films Section */}
        <section className="section py-5">
          <div className="container">
            <div className="section-title text-center portfolioHeader" data-aos="fade-up">
              <h2>A Cinematic Journey of Love</h2>
              <p className="text-muted mt-2">
                Cinematic love stories crafted to capture the emotion, joy, and beauty of your wedding day—preserving every precious moment for a lifetime.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="row mb-5">
              <div className="col-12 d-flex justify-content-center">
                {loading ? (
                  <div className="d-flex flex-wrap justify-content-center gap-3 mb-0">
                    {[1, 2, 3, 4].map((_, index) => (
                      <Skeleton key={index} width="120px" height="40px" borderRadius="25px" />
                    ))}
                  </div>
                ) : (
                  <ul className="portfolio-filters list-unstyled d-flex flex-wrap justify-content-center gap-3 mb-0">
                    <li
                      className={`portfolio-tab ${activeCategory === "All" ? "tab-active" : ""}`}
                      onClick={() => setActiveCategory("All")}
                      style={{
                        cursor: 'pointer',
                        padding: '10px 24px',
                        borderRadius: '25px',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease',
                        backgroundColor: activeCategory === 'All' ? '#daa520' : 'transparent',
                        color: activeCategory === 'All' ? '#fff' : '#666',
                        border: activeCategory === 'All' ? 'none' : '2px solid #e0e0e0',
                        textTransform: 'capitalize',
                      }}
                      onMouseEnter={(e) => {
                        if (activeCategory !== 'All') {
                          e.target.style.borderColor = '#daa520';
                          e.target.style.color = '#daa520';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeCategory !== 'All') {
                          e.target.style.borderColor = '#e0e0e0';
                          e.target.style.color = '#666';
                        }
                      }}
                    >
                      All
                    </li>
                    {categories.map((cat) => (
                      <li
                        key={cat._id}
                        className={`portfolio-tab ${activeCategory === cat.name ? "tab-active" : ""}`}
                        onClick={() => setActiveCategory(cat.name)}
                        style={{
                          cursor: 'pointer',
                          padding: '10px 24px',
                          borderRadius: '25px',
                          fontWeight: '600',
                          fontSize: '0.95rem',
                          transition: 'all 0.3s ease',
                          backgroundColor: activeCategory === cat.name ? '#daa520' : 'transparent',
                          color: activeCategory === cat.name ? '#fff' : '#666',
                          border: activeCategory === cat.name ? 'none' : '2px solid #e0e0e0',
                          textTransform: 'capitalize',
                        }}
                        onMouseEnter={(e) => {
                          if (activeCategory !== cat.name) {
                            e.target.style.borderColor = '#daa520';
                            e.target.style.color = '#daa520';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeCategory !== cat.name) {
                            e.target.style.borderColor = '#e0e0e0';
                            e.target.style.color = '#666';
                          }
                        }}
                      >
                        {cat.label || cat.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {loading ? (
              <div className="films-grid">
                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                  <div key={index} className="film-card">
                    <Skeleton width="100%" height="250px" borderRadius="8px" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="films-grid">
                {filteredFilms.length > 0 ? filteredFilms.map((film) => {
                  const videoId = getYouTubeId(film.youtubeUrl);
                  if (!videoId) return null;
                  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

                  return (
                    <a
                      key={film._id}
                      href={film.youtubeUrl}
                      className="glightbox film-card shadow-sm"
                      data-gallery="films"
                      data-title={film.title}
                      data-description={film.category}
                    >
                      <div className="film-thumb">
                        <img src={thumbnail} alt={film.title} />

                        <div className="film-overlay">
                          <div className="play-btn">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="26"
                              height="26"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <polygon points="6 3 20 12 6 21 6 3" />
                            </svg>
                          </div>
                          <div className="film-info">
                            <h5 className="film-title">{film.title}</h5>
                            <p className="film-category">{film.category}</p>
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                }) : (
                  <div className="col-12 text-center">
                    <p>No films found {activeCategory !== "All" && `for ${activeCategory}`}.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Films;
