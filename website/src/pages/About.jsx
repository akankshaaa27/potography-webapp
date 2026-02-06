import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import "../App.css";

const About = () => {
  useEffect(() => {
    document.body.className = "index-page";

    // Initialize AOS
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });

    // Remove preloader after a short delay
    const preloader = document.querySelector("#preloader");
    if (preloader) {
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }

    return () => {
      document.body.className = "";
    };
  }, []);

  return (
    <>
      <Header />

      {/* Page Title */}
      <div className="page-title dark-background" style={{backgroundImage: "url('/assets/img/HomePage/16.webp')"}}>
        <div className="container position-relative">
          <h1>About Us</h1>
          <p>Discover our story and passion for capturing life's beautiful moments</p>
          <nav className="breadcrumbs">
            <ol>
              <li><a href="/">Home</a></li>
              <li className="current">About Us</li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="main ">
        {/* Meet Our Founder Section */}
        <section id="founder" className="founder section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row align-items-center">
              <div
                className="col-lg-6 order-2 order-lg-1"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                <div className="founder-content">
                  <div
                    className="container mb-4 innerpage-title text-start p-0"
                    data-aos="fade-up"
                  >
                    <p className="Subhead">The Artist Behind The Lens</p>
                    <h2>Meet Our Founder</h2>
                  </div>

                  <p className="lead-text mb-4">
                    At the heart of our venture is a visionary with a keen eye
                    for detail and an unwavering passion for storytelling
                    through the lens. With every click, the aim is not just to
                    capture an image, but to freeze a moment in time — a moment
                    filled with emotion, love, joy, or quiet beauty.
                  </p>

                  <p className="description-text mb-4">
                    Founded with a simple yet powerful vision: to create
                    timeless, artistic memories that last a lifetime. We are
                    passionate about turning life's most meaningful moments into
                    beautifully captured stories, stories that evoke emotion,
                    preserve beauty, and exceed expectations.
                  </p>

                  <p className="description-text">
                    From our beginning, we've worked so hard and passionately,
                    pouring our heart and soul into every photoshoot. As
                    artists, we've always admired the pursuit of excellence, and
                    the desire to create award-worthy work has been a strong
                    driving force for us.
                  </p>
                </div>
              </div>

              <div
                className="col-lg-6 order-1 order-lg-2"
                data-aos="fade-left"
                data-aos-delay="200"
              >
                <div className="founder-image m-auto">
                  <img
                    src="/assets/img/person/founder.jpg"
                    alt="Founder - The Patil Photography"
                    className="rounded founder-photo img-fluid"
                  />
                  <div className="founder-section">
                  <div className="founder-title">Aakask Darme-Patil</div>
                  <div className="founder-subtitle ">Founder & <br /> & Lead Photographer</div>
                  <div className="Lead-subtitle ">The Patil Photography</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="why-choose-us py-5" style={{ background: "#fff" }}>
          <div className="container">
            {/* Section Header */}
            <div className="text-center mb-5" data-aos="fade-up">
              <h2 className="gold-text-gradient mb-3" style={{ fontSize: "2.5rem", fontWeight: "700" }}>
                Why Choose Us
              </h2>
              <p style={{ fontSize: "1.1rem", color: "#666", maxWidth: "700px", margin: "0 auto" }}>
                At The Patil Photography & Film's, we craft timeless stories filled with emotion, elegance, and authenticity
              </p>
            </div>

            {/* Features Grid */}
            <div className="row g-4 mt-3">
              {/* Feature 1 */}
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                <div style={{
                  background: "#f9f7f4",
                  borderRadius: "12px",
                  padding: "2.5rem",
                  textAlign: "center",
                  height: "100%",
                  transition: "all 0.3s ease",
                  border: "1px solid #ede8e0"
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f9f7f4";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    width: "60px",
                    height: "60px",
                    background: "linear-gradient(135deg, #d4a574 0%, #b8860b 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    fontSize: "1.8rem",
                    color: "white"
                  }}>
                    <i className="bi bi-camera"></i>
                  </div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "1rem", color: "#222" }}>
                    Timeless Storytelling
                  </h3>
                  <p style={{ color: "#666", lineHeight: "1.6", margin: "0" }}>
                    We believe your wedding is a once-in-a-lifetime story. Our approach blends cinematic vision with genuine emotions.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                <div style={{
                  background: "#f9f7f4",
                  borderRadius: "12px",
                  padding: "2.5rem",
                  textAlign: "center",
                  height: "100%",
                  transition: "all 0.3s ease",
                  border: "1px solid #ede8e0"
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f9f7f4";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    width: "60px",
                    height: "60px",
                    background: "linear-gradient(135deg, #d4a574 0%, #b8860b 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    fontSize: "1.8rem",
                    color: "white"
                  }}>
                    <i className="bi bi-gem"></i>
                  </div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "1rem", color: "#222" }}>
                    Luxury Aesthetic
                  </h3>
                  <p style={{ color: "#666", lineHeight: "1.6", margin: "0" }}>
                    From soft lighting to refined compositions, our style is elegant, graceful, and cinematic.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                <div style={{
                  background: "#f9f7f4",
                  borderRadius: "12px",
                  padding: "2.5rem",
                  textAlign: "center",
                  height: "100%",
                  transition: "all 0.3s ease",
                  border: "1px solid #ede8e0"
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f9f7f4";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    width: "60px",
                    height: "60px",
                    background: "linear-gradient(135deg, #d4a574 0%, #b8860b 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    fontSize: "1.8rem",
                    color: "white"
                  }}>
                    <i className="bi bi-heart"></i>
                  </div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "1rem", color: "#222" }}>
                    Emotion-Driven Expertise
                  </h3>
                  <p style={{ color: "#666", lineHeight: "1.6", margin: "0" }}>
                    The most beautiful moments are unspoken. We capture genuine emotions naturally and authentically.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
                <div style={{
                  background: "#f9f7f4",
                  borderRadius: "12px",
                  padding: "2.5rem",
                  textAlign: "center",
                  height: "100%",
                  transition: "all 0.3s ease",
                  border: "1px solid #ede8e0"
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f9f7f4";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    width: "60px",
                    height: "60px",
                    background: "linear-gradient(135deg, #d4a574 0%, #b8860b 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    fontSize: "1.8rem",
                    color: "white"
                  }}>
                    <i className="bi bi-stars"></i>
                  </div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "1rem", color: "#222" }}>
                    Stress-Free Experience
                  </h3>
                  <p style={{ color: "#666", lineHeight: "1.6", margin: "0" }}>
                    From consultation to delivery, we ensure a smooth, professional journey you can trust.
                  </p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="500">
                <div style={{
                  background: "#f9f7f4",
                  borderRadius: "12px",
                  padding: "2.5rem",
                  textAlign: "center",
                  height: "100%",
                  transition: "all 0.3s ease",
                  border: "1px solid #ede8e0"
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f9f7f4";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    width: "60px",
                    height: "60px",
                    background: "linear-gradient(135deg, #d4a574 0%, #b8860b 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    fontSize: "1.8rem",
                    color: "white"
                  }}>
                    <i className="bi bi-people"></i>
                  </div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "1rem", color: "#222" }}>
                    Tailored Stories
                  </h3>
                  <p style={{ color: "#666", lineHeight: "1.6", margin: "0" }}>
                    No two love stories are the same. Every wedding is customized to reflect your unique vision.
                  </p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="600">
                <div style={{
                  background: "#f9f7f4",
                  borderRadius: "12px",
                  padding: "2.5rem",
                  textAlign: "center",
                  height: "100%",
                  transition: "all 0.3s ease",
                  border: "1px solid #ede8e0"
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f9f7f4";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    width: "60px",
                    height: "60px",
                    background: "linear-gradient(135deg, #d4a574 0%, #b8860b 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    fontSize: "1.8rem",
                    color: "white"
                  }}>
                    <i className="bi bi-infinity"></i>
                  </div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "1rem", color: "#222" }}>
                    Lasting Memories
                  </h3>
                  <p style={{ color: "#666", lineHeight: "1.6", margin: "0" }}>
                    Your wedding visuals are heirlooms—timeless, emotional, and crafted to last forever.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      {/* Scroll Top Button */}
      <a
        href="#"
        id="scroll-top"
        className="scroll-top d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-arrow-up-short"></i>
      </a>

      {/* Preloader */}
      <div id="preloader"></div>
    </>
  );
};

export default About;
