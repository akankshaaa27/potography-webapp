import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LuxGallery from "../components/LuxGallery";

const Portfolio = () => {
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      document.body.className = "services-page";

      // Fetch portfolio images from API
      fetch("/api/gallery")
        .then(res => res.json())
        .then(data => {
          // Filter active items and extract image URLs
          const activeItems = data.filter(item => item.status === "Active");
          const imageUrls = activeItems.map(item => item.image);
          setPortfolioImages(imageUrls);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching portfolio images:", err);
          setLoading(false);
        });

      if (window.GLightbox) {
        window.GLightbox({
          selector: ".glightbox",
          loop: true,
          touchNavigation: true,
          keyboardNavigation: true,
          zoomable: true,
        });
      }
    } catch (error) {
      console.error("Error in Portfolio useEffect:", error);
    }

    return () => {
      document.body.className = "";
    };
  }, []);

  return (
    <>
      <Header />

      {/* Page Title */}
      <div
        className="page-title portfolio-hero dark-background"
        style={{ backgroundImage: "url('/assets/img/HomePage/11.webp')" }}
      >
        <div className="portfolio-hero-overlay" />
        <div className="container position-relative portfolio-hero-content">
          <h1 className="portfolio-hero-title">Portfolio</h1>
          <p className="portfolio-hero-subtitle text-center">
            Explore our collection of timeless frames and cinematic stories.
          </p>

          <nav className="breadcrumbs portfolio-breadcrumbs">
            <ol>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li className="current">Portfolio</li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="main portfolio-lux">
        {/* Intro Section */}
        <section className="portfolio-intro pb-0">
          <div className="container section-title portfolioHeader" data-aos="fade-up">
            <h2 className="portfolio-title">Experience Our Art</h2>
            <p className="portfolio-desc">
              With an unwavering passion for storytelling and a keen eye for detail,
              we’ve curated a portfolio that beautifully embodies our creative vision.
              Our work spans diverse cultures, stunning destinations, and unique traditions—
              each moment preserved with elegance and soul.
            </p>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="portfolio-gallery pt-3" id="Portfolio-gallery">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-accent-color" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : portfolioImages.length > 0 ? (
              <LuxGallery images={portfolioImages} galleryId="portfolio" />
            ) : (
              <div className="text-center py-5">
                <p>No portfolio images found.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Scroll to Top */}
      <a
        href="#"
        id="scroll-top"
        className="scroll-top d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </>
  );
};

export default Portfolio;
