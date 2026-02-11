import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StoryModal from "../components/StoryModal";
import "../styles/home.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Skeleton from "../components/Skeleton";
import TributeModal from "../components/TributeModal";
import LuxGallery from "../components/LuxGallery";
// import HomeFeature from "../components/HomeFeature";

// Simple CountUp Component
const Counter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return <span ref={countRef}>{count}{suffix}</span>;
};

const Home = () => {
  console.log("Home component rendering");
  const [slides, setSlides] = useState([]);
  const [loadingSlider, setLoadingSlider] = useState(true);
  const [loadingStories, setLoadingStories] = useState(true);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [loadingInstagram, setLoadingInstagram] = useState(true);
  const [loveStories, setLoveStories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [showTribute, setShowTribute] = useState(false);
  const [portfolioPreview, setPortfolioPreview] = useState([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);

  // Refs for testimonial navigation (to avoid duplicate nav buttons)
  const testimonialsPrevRef = useRef(null);
  const testimonialsNextRef = useRef(null);

  // Pop up
  useEffect(() => {
    // Show tribute popup automatically on home page load (ALWAYS for now)
    const timer = setTimeout(() => {
      setShowTribute(true);
      // sessionStorage.setItem("hasSeenTributeWeb", "true"); // Disabled for testing
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  // Pop up end 
  useEffect(() => {
    // Fetch Slider
    fetch("/api/slider")
      .then((res) => res.json())
      .then((data) => {
        const activeSlides = data.filter((s) => s.status === "Active");
        if (activeSlides.length > 0) {
          setSlides(
            activeSlides.map((s) => ({
              image: s.image,
              title: s.title,
              subtitle: s.subtitle || "Capturing moments...",
            })),
          );
        }
      })
      .catch((err) => console.error("Error fetching slider:", err))
      .finally(() => setLoadingSlider(false));

    // Fetch Love Stories
    fetch("/api/love-stories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLoveStories(data.filter((s) => s.status === "Active"));
        }
      })
      .catch((err) => console.error("Error fetching love stories:", err))
      .finally(() => setLoadingStories(false));

    // Fetch Testimonials
    fetch("/api/testimonials?type=active")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTestimonials(data); // Controller already filters active
        }
      })
      .catch((err) => console.error("Error fetching testimonials:", err))
      .finally(() => setLoadingTestimonials(false));

    // Fetch Portfolio preview (first 12 active images)
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data.filter(i => i.status === "Active") : [];
        setPortfolioPreview(items.slice(0, 12));
      })
      .catch((err) => console.error("Error fetching portfolio:", err))
      .finally(() => setLoadingPortfolio(false));
  }, []);
  useEffect(() => {
    let preloaderTimeout;
    let aosTimeout;
    try {
      // Set body class
      document.body.className = "index-page";

      // Hide preloader after component mounts
      const preloader = document.getElementById("preloader");
      if (preloader) {
        preloaderTimeout = setTimeout(() => {
          if (preloader && preloader.parentNode) {
            preloader.style.display = "none";
          }
        }, 500);
      }

      // Initialize AOS if available
      if (typeof window !== "undefined" && window.AOS) {
        window.AOS.init({
          duration: 600,
          easing: "ease-in-out",
          once: true,
          mirror: false,
        });

        // Refresh AOS after a short delay to ensure all elements are rendered
        aosTimeout = setTimeout(() => {
          if (window.AOS) {
            window.AOS.refresh();
          }
        }, 100);
      }

      // Fetch Instagram posts
      const fetchInstagramPosts = async () => {
        const accessToken =
          import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN ||
          import.meta.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN ||
          "YOUR_INSTAGRAM_ACCESS_TOKEN";
        const accountId =
          import.meta.env.VITE_INSTAGRAM_ACCOUNT_ID ||
          import.meta.env.REACT_APP_INSTAGRAM_ACCOUNT_ID ||
          "YOUR_INSTAGRAM_ACCOUNT_ID";
        if (
          accessToken === "YOUR_INSTAGRAM_ACCESS_TOKEN" ||
          accountId === "YOUR_INSTAGRAM_ACCOUNT_ID"
        ) {
          console.log(
            "Please set your Instagram access token and account ID in environment variables",
          );
          setLoadingInstagram(false);
          return;
        }
        try {
          const response = await fetch(
            `https://graph.facebook.com/v18.0/${accountId}/media?fields=id,media_type,media_url,permalink,caption&access_token=${accessToken}`,
          );
          const data = await response.json();
          if (data.data) {
            setInstagramPosts(
              data.data
                .filter((post) => post.media_type === "IMAGE")
                .slice(0, 6),
            );
          }
        } catch (error) {
          console.error("Error fetching Instagram posts:", error);
        } finally {
          setLoadingInstagram(false);
        }
      };
      fetchInstagramPosts();

      // Initialize other vendor libraries
      if (typeof window !== "undefined") {
        // Initialize GLightbox
        if (window.GLightbox) {
          const lightbox = window.GLightbox({
            selector: ".glightbox",
          });
        }
      }
    } catch (error) {
      console.error("Error in Home useEffect:", error);
    }

    return () => {
      if (preloaderTimeout) clearTimeout(preloaderTimeout);
      if (aosTimeout) clearTimeout(aosTimeout);
      document.body.className = "";
    };
  }, []);

  return (
    <>
      <Header />
      {/* Pop up */}
      <TributeModal isOpen={showTribute} onClose={() => setShowTribute(false)} />
      {/* Pop up end */}
      <main className="main">
        {/* Hero Section */}
        <section id="hero" className="hero dark-background">
          {loadingSlider || slides.length === 0 ? (
            <div className="hero-video-container hero-fullheight">
              <img src="/assets/img/slider/hero6.jpg" className="img-fluid hero-bg-image" alt="Beauty of Photography" />
              <div className="container hfull d-flex align-items-center justify-content-center hero-content-wrapper" data-aos="fade-up" data-aos-delay="100">
                <div className="row justify-content-center text-center">
                  <div className="col-lg-8">
                    <div className="hero-content">
                      <h1 data-aos="fade-up" data-aos-delay="200" className="gold-text-gradient">
                        Capture the Moment
                      </h1>
                      <p data-aos="fade-up" data-aos-delay="300">
                        Preserving memories that last a lifetime
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Swiper
              key={slides.length}
              modules={[Autoplay, Navigation]}
              autoplay={{ delay: 5000, disableOnInteraction: true }}
              loop={slides.length > 1}
              navigation={slides.length > 1}
              allowTouchMove={slides.length > 1}
              className="hero-slider"
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <div className="hero-video-container hero-fullheight">
                    <img src={slide.image} className="img-fluid ken-burns hero-bg-image" alt="" />
                  </div>

                  <div className="container hfull hero-content-wrapper" data-aos="fade-up" data-aos-delay="100">
                    <div className="row justify-content-center text-center">
                      <div className="col-lg-8">
                        <div className="hero-content">
                          <h1 className="gold-text-gradient animate-reveal">
                            {slide.title}
                          </h1>
                          <p className="animate-reveal">
                            {slide.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </section>

        {/* About Section - Clean & Meaningful */}
        <section id="about" className="about section about-section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            {/* Section Header */}
            <div className="about-header">
              <div className="about-sub">About Us</div>
              <h2 className="about-title">Your Story, Our Passion</h2>
              <p className="about-lead">We believe every love story deserves to be celebrated with artistry, authenticity, and elegance. That's why we're here.</p>
            </div>

            {/* Main Content - Two Column */}
            <div className="row align-items-center g-5 about-main">
              {/* Image - LEFT */}
              <div className="col-lg-5" data-aos="fade-right" data-aos-delay="150">
                <img src="/assets/img/HomePage/7.webp" alt="Our Photography Studio" className="img-fluid about-image" />
              </div>

              {/* Content - RIGHT */}
              <div className="col-lg-7" data-aos="fade-left" data-aos-delay="200">
                <div className="about-content-inner">
                  <h3 className="about-h3">We Create Timeless Memories</h3>

                  <p className="about-p">
                    At <strong>The Patil Photography &amp; Films</strong>, we don't just capture moments — we tell your unique love story through stunning visuals and cinematic excellence.
                  </p>

                  <p className="about-p">
                    With over a decade of experience, our team has perfected the art of preserving authentic emotions, genuine connections, and beautiful details that make your wedding day truly unforgettable.
                  </p>

                  {/* Three Key Points */}
                  <div className="about-points">
                    <div className="about-point">
                      <div className="about-icon"><i className="bi bi-heart"></i></div>
                      <div>
                        <h4>Authentic Storytelling</h4>
                        <p>We blend candid moments with artistic direction to tell your unique love story naturally and beautifully.</p>
                      </div>
                    </div>

                    <div className="about-point">
                      <div className="about-icon"><i className="bi bi-camera"></i></div>
                      <div>
                        <h4>Premium Quality</h4>
                        <p>State-of-the-art equipment, professional editing, and a cinematic approach ensure perfection in every frame.</p>
                      </div>
                    </div>

                    <div className="about-point">
                      <div className="about-icon"><i className="bi bi-person-heart"></i></div>
                      <div>
                        <h4>Personal Connection</h4>
                        <p>We work closely with you to understand your vision, style, and dreams to create something truly personal.</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link to="/quote" className="cta-link about-cta">Start Your Journey</Link>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="stats-grid">
              <div className="stats-card" data-aos="fade-up" data-aos-delay="100">
                <h3 className="stats-number"><Counter end={500} suffix="+" /></h3>
                <p className="stats-title">Happy Couples</p>
                <p className="stats-sub">Worldwide</p>
              </div>

              <div className="stats-card" data-aos="fade-up" data-aos-delay="150">
                <h3 className="stats-number"><Counter end={10} suffix="+" /></h3>
                <p className="stats-title">Years Experience</p>
                <p className="stats-sub">Industry Expert</p>
              </div>

              <div className="stats-card" data-aos="fade-up" data-aos-delay="200">
                <h3 className="stats-number"><Counter end={15} suffix="+" /></h3>
                <p className="stats-title">Team Members</p>
                <p className="stats-sub">Certified Professionals</p>
              </div>

              <div className="stats-card" data-aos="fade-up" data-aos-delay="250">
                <h3 className="stats-number">24/7</h3>
                <p className="stats-title">Support</p>
                <p className="stats-sub">Always Available</p>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Preview Section */}
        <section id="portfolio-preview" className="portfolio-preview section">
          <div className="container pb-5  section-title text-center" data-aos="fade-up" data-aos-delay="100">
            <h2>Our Portfolio</h2>
            <p>
              A curated selection of recent works — a glimpse into our craft. Click through to view the full gallery.
            </p>
          </div>

          <div className="container OurPortfolio" data-aos="fade-up" data-aos-delay="200">
            {loadingPortfolio ? (
              <div className="row g-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="col-6 col-md-3">
                    <Skeleton width="100%" style={{ paddingBottom: '70%', borderRadius: '14px' }} />
                  </div>
                ))}
              </div>
            ) : portfolioPreview.length ? (
              <>
                <LuxGallery images={portfolioPreview.slice(0, 12).map((p) => p.image)} galleryId="home-portfolio" />

                <div className="text-center mt-4">
                  <Link to="/portfolio" className="btn btn-outline-secondary" style={{ borderRadius: 30, padding: '10px 28px', borderWidth: 2 }}>
                    See More Projects
                  </Link>
                </div>
              </>
            ) : (
              <div className="col-12 text-center py-5">
                <p>No portfolio images available.</p>
              </div>
            )}

            <div className="Gradientbackground"></div>
          </div> 
        </section>
        
        {/* <HomeFeature loveStories={loveStories} loading={loadingStories} /> */}

        {/* Quote Section */}
        <section
          className="container px-5 pt-4"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h2 className="text-center Quite py-2">
            "Love's journey is written in small moments — the smiles, the
            glances, the warmth — each deserving to be held forever."
          </h2>
        </section>
        {/* Services Section */}
        <section id="services" className="py-5" style={{ background: "#f9f7f4" }}>
          <div className="container">
            {/* Section Header */}
            <div className="text-center mb-5" data-aos="fade-up">
              <h2 className="gold-text-gradient mb-3" style={{ fontSize: "2.5rem", fontWeight: "700" }}>
                Our Signature Services
              </h2>
              <p style={{ fontSize: "1.1rem", color: "#666", maxWidth: "600px", margin: "0 auto" }}>
                Premium photography and videography experiences crafted to capture your unique story
              </p>
            </div>

            {/* Services Grid */}
            <div className="row g-4">
              {/* Service Card 1 */}
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                <div style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "2.5rem",
                  textAlign: "center",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  height: "100%"
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{
                    width: "70px",
                    height: "70px",
                    background: "linear-gradient(135deg, #d4a574 0%, #b8860b 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    fontSize: "2rem",
                    color: "white"
                  }}>
                    <i className="bi bi-heart-fill"></i>
                  </div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "1rem", color: "#222" }}>
                    Wedding Photography
                  </h3>
                  <p style={{ color: "#666", lineHeight: "1.6", marginBottom: "1rem" }}>
                    Capture your entire day from pre-wedding to reception with professional coverage of all cherished moments
                  </p>
                  <a href="#" className="cta-link">
                    Learn More →
                  </a>
                </div>
              </div>

              {/* Service Card 2 */}
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                <div style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "2.5rem",
                  textAlign: "center",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  height: "100%"
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{
                    width: "70px",
                    height: "70px",
                    background: "linear-gradient(135deg, #d4a574 0%, #b8860b 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    fontSize: "2rem",
                    color: "white"
                  }}>
                    <i className="bi bi-film"></i>
                  </div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "1rem", color: "#222" }}>
                    Cinematic Films
                  </h3>
                  <p style={{ color: "#666", lineHeight: "1.6", marginBottom: "1rem" }}>
                    Premium videography with drone footage, creative editing, and cinematic storytelling that brings emotions to life
                  </p>
                  <a href="#" className="cta-link">
                    Learn More →
                  </a>
                </div>
              </div>

              {/* Service Card 3 */}
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                <div style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "2.5rem",
                  textAlign: "center",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  height: "100%"
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{
                    width: "70px",
                    height: "70px",
                    background: "linear-gradient(135deg, #d4a574 0%, #b8860b 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    fontSize: "2rem",
                    color: "white"
                  }}>
                    <i className="bi bi-camera"></i>
                  </div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "1rem", color: "#222" }}>
                    Portrait Sessions
                  </h3>
                  <p style={{ color: "#666", lineHeight: "1.6", marginBottom: "1rem" }}>
                    Elegant and timeless portraits capturing your essence with professional styling and beautiful locations
                  </p>
                  <a href="#" className="cta-link">
                    Learn More →
                  </a>
                </div>
              </div>

              {/* Service Card 4 */}
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
                <div style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "2.5rem",
                  textAlign: "center",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  height: "100%"
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{
                    width: "70px",
                    height: "70px",
                    background: "linear-gradient(135deg, #d4a574 0%, #b8860b 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    fontSize: "2rem",
                    color: "white"
                  }}>
                    <i className="bi bi-calendar-heart"></i>
                  </div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "1rem", color: "#222" }}>
                    Engagement Shoots
                  </h3>
                  <p style={{ color: "#666", lineHeight: "1.6", marginBottom: "1rem" }}>
                    Celebrate your engagement with beautiful pre-wedding sessions in stunning locations capturing pure joy
                  </p>
                  <a href="#" className="cta-link">
                    Learn More →
                  </a>
                </div>
              </div>

              {/* Service Card 5 */}
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="500">
                <div style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "2.5rem",
                  textAlign: "center",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  height: "100%"
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{
                    width: "70px",
                    height: "70px",
                    background: "linear-gradient(135deg, #d4a574 0%, #b8860b 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    fontSize: "2rem",
                    color: "white"
                  }}>
                    <i className="bi bi-book"></i>
                  </div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "1rem", color: "#222" }}>
                    Albums & Prints
                  </h3>
                  <p style={{ color: "#666", lineHeight: "1.6", marginBottom: "1rem" }}>
                    Premium albums, prints, and canvas artwork that transform your moments into stunning home décor
                  </p>
                  <a href="#" className="cta-link">
                    Learn More →
                  </a>
                </div>
              </div>

              {/* Service Card 6 */}
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="600">
                <div style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "2.5rem",
                  textAlign: "center",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  height: "100%"
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{
                    width: "70px",
                    height: "70px",
                    background: "linear-gradient(135deg, #d4a574 0%, #b8860b 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    fontSize: "2rem",
                    color: "white"
                  }}>
                    <i className="bi bi-airplane"></i>
                  </div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "1rem", color: "#222" }}>
                    Drone & Aerial
                  </h3>
                  <p style={{ color: "#666", lineHeight: "1.6", marginBottom: "1rem" }}>
                    Breathtaking aerial perspectives using drone technology to capture stunning venue and celebration views
                  </p>
                  <a href="#" className="cta-link">
                    Learn More →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="testimonials section">
          <div className="container section-title" data-aos="fade-up">
            <h2>From the Hearts of Our Couples</h2>
          </div>

          <div className="container" data-aos="fade-up" data-aos-delay="100">
            {loadingTestimonials ? (
              <div className="row">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="col-lg-4">
                    <div className="testimonial-item" style={{ height: "100%", padding: "30px" }}>
                      <div className="d-flex align-items-center mb-3">
                        <Skeleton borderRadius="50%" width="50px" height="50px" />
                        <div className="ms-3 flex gap-4 align-middle">
                          <Skeleton width="120px" height="20px"/>
                          <Skeleton width="80px" height="20px" />
                        </div>
                      </div>
                      <Skeleton width="100%" height="15px" style={{ marginBottom: "10px" }} />
                      <Skeleton width="100%" height="15px" style={{ marginBottom: "10px" }} />
                      <Skeleton width="80%" height="15px" />
                    </div>
                  </div>
                ))}
              </div>
            ) : testimonials.length > 0 ? (
              <div className="testimonial-slider-wrapper position-relative">
                <div className="testimonial-nav">
                  <div ref={testimonialsPrevRef} className="swiper-button-prev" aria-label="Previous testimonial"></div>
                  <div ref={testimonialsNextRef} className="swiper-button-next" aria-label="Next testimonial"></div>
                </div>

                <Swiper
                  modules={[Autoplay, Navigation]}
                  slidesPerView={1}
                  spaceBetween={30}
                  autoplay={{ delay: 5000, disableOnInteraction: true }}
                  navigation={{
                    prevEl: testimonialsPrevRef?.current,
                    nextEl: testimonialsNextRef?.current,
                  }}
                  onBeforeInit={(swiper) => {
                    try {
                      swiper.params.navigation.prevEl = testimonialsPrevRef.current;
                      swiper.params.navigation.nextEl = testimonialsNextRef.current;
                    } catch (e) {
                      // ignore
                    }
                  }}
                  loop={testimonials.length > 1}
                  breakpoints={{
                    640: {
                      slidesPerView: 1,
                    },
                    768: {
                      slidesPerView: 2,
                    },
                    1024: {
                      slidesPerView: 3,
                    },
                  }}
                  className="testimonial-slider"
                >
                {testimonials.map((t, index) => (
                  <SwiperSlide key={t._id}>
                    <div
                      className={`testimonial-item ${index % 2 === 0 ? "" : "highlight"}`}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                      style={{ height: "100%" }}
                    >
                      <div className="testimonial-content">
                        <div className="quote-pattern">
                          <i className="bi bi-quote"></i>
                        </div>
                        <p className="shortDescriptionLenth">
                          "{t.shortDescription}"
                        </p>

                        {/* Star Rating */}
                        <div
                          className="stars"
                          style={{ color: "#ffc107", marginBottom: "10px" }}
                        >
                          {[...Array(t.rating || 5)].map((_, i) => (
                            <i key={i} className="bi bi-star-fill"></i>
                          ))}
                        </div>

                        <div className="client-info">
                          <div className="client-image">
                            <img
                              src={
                                t.thumbnail ||
                                "https://placehold.co/250x250?text=Couple"
                              }
                              alt={t.coupleName}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "50%",
                              }}
                            />
                          </div>
                          <div className="client-details">
                            <h3 className="coupleNameLenth">{t.coupleName}</h3>
                            <span className="position">{t.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              </div>
            ) : (
              <div className="text-center p-5">
                <p>Currently updating our wall of love. Check back soon!</p>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-center mt-5">
            <Link to="/testimonials" className="submit-btn mt-3" style={{ textDecoration: "none" }}>
              <span>View All Reviews</span>
              <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="projects section pt-3">
          <div
            className="container section-title text-center"
            data-aos="fade-up"
          >
            <h2>Our Latest Love Stories</h2>
            <div className="d-flex justify-content-center">
              <p className="w-50 d-block text-center">
                Every couple carries a beautiful story of their own, and it's
                our privilege to capture those timeless moments meant to be
                cherished for generations.
              </p>
            </div>
          </div>

          <div className="container" data-aos="fade-up" data-aos-delay="100">
            {/* Love Stories Slider */}
            {loadingStories ? (
              <div className="row">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="col-md-4 mb-4">
                    <div className="project-card" style={{ height: "100%" }}>
                      <Skeleton width="100%" height="300px" style={{ marginBottom: "15px" }} />
                      <div className="d-flex flex-column gap-2 p-4 pt-0">
                        <Skeleton width="80%" height="25px" />
                        <Skeleton width="100%" height="15px" />
                        <Skeleton width="90%" height="15px" style={{ paddingBottom: "15px" }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : loveStories.length === 0 ? (
              <div className="col-12 text-center p-5">
                <p>No love stories to share yet.</p>
              </div>
            ) : (
              <Swiper
                modules={[Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                navigation={false}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="projects-slider"
                style={{ paddingBottom: "40px" }}
              >
                {loveStories.map((story) => (
                  <SwiperSlide key={story._id}>
                    <div className="project-card" style={{ height: "100%" }}>
                      <div className="project-image">
                        <img
                          src={story.thumbnail}
                          alt={story.title}
                          className="img-fluid"
                          style={{
                            width: "100%",
                            height: "300px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div className="project-info">
                        <h4 className="project-title">{story.title}</h4>
                        <p className="project-description">
                          {story.description.length > 100
                            ? story.description.substring(0, 100) + "..."
                            : story.description}
                        </p>
                        <div className="cta-section text-md-start">
                          <a
                            href="#"
                            className=""
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedStory(story);
                              setShowModal(true);
                            }}
                          >
                            View Story
                            <i className="bi bi-arrow-right ms-2"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}

            <div className="d-flex justify-content-center mt-0">
              <Link
                to="/stories"
                className="cta-link"
              >
                <span>View All Stories</span>
                <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section id="experience" className="section" style={{ backgroundColor: '#f9f8f6', padding: '80px 0' }}>
          <div className="container" data-aos="fade-up">
            {/* Section Header */}
            <div className="section-title text-center" style={{ marginBottom: '60px' }}>
              <h2 style={{ fontSize: '2.8rem', fontWeight: '700', marginBottom: '16px', color: '#1a1a1a' }}>Top Values for You</h2>
              <p style={{ fontSize: '1.05rem', color: '#888', fontWeight: '500' }}>Experience the difference with our premium photography services</p>
            </div>

            {/* Values Grid */}
            <div className="row g-4">
              {[
                { 
                  icon: "bi-chat-dots", 
                  title: "Personalized Consultation", 
                  desc: "We listen to your vision and craft a customized photography plan that reflects your unique love story and style." 
                },
                { 
                  icon: "bi-star-fill", 
                  title: "Professional Direction", 
                  desc: "Our expert team guides you through every moment, ensuring natural poses, authentic emotions, and stunning compositions." 
                },
                { 
                  icon: "bi-brush", 
                  title: "Premium Editing", 
                  desc: "Each image is meticulously edited with our signature cinematic style to enhance colors and emotions perfectly." 
                },
                { 
                  icon: "bi-gift", 
                  title: "Timeless Delivery", 
                  desc: "Receive your cherished memories in a beautiful online gallery, albums, and premium prints designed to last forever." 
                }
              ].map((value, idx) => (
                <div key={idx} className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay={idx * 100}>
                  <div style={{ textAlign: 'center', padding: '32px 24px', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Icon */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: '64px',
                        height: '64px',
                        backgroundColor: '#f0e8d8',
                        borderRadius: '12px',
                        fontSize: '32px',
                        color: '#d4af37'
                      }}>
                        <i className={`bi ${value.icon}`}></i>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px', lineHeight: '1.3' }}>
                      {value.title}
                    </h3>

                    {/* Description */}
                    <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.6', margin: 0 }}>
                      {value.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>



   
        {/* Call to Action Banner */}
        <section className="cta-banner">
          <div className="container" data-aos="zoom-in">
            <h2>Ready to Create Magic?</h2>
            <p className="mb-4" style={{ fontSize: '1.2rem', opacity: 0.9 }}>Let's turn your fleeting moments into timeless memories.</p>
            <Link to="/quote" className="cta-link">
              Book Your Date
            </Link>
          </div>
        </section>

        {/* Instagram  */}
        <section id="instagram" className="about section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="container section-title" data-aos="fade-up">
              <h2>As Seen on Instagram</h2>
              <p>
                <a
                  href="https://www.instagram.com/thepatilphotography"
                  target="_blank"
                  rel="noreferrer"
                  className="text-secondary"
                >
                  @thepatilphotography
                </a>
              </p>
            </div>
            <div className="container">
              <div className="row g-2 justify-content-center">
                {/* Static Grid to simulate Instagram Feed using existing portfolio images */}
                {/* This avoids 404s from invalid widget IDs and requires no API tokens */}
                {loadingInstagram ? (
                  [1, 2, 3, 4, 5, 6].map((_, index) => (
                    <div key={index} className="col-4 col-md-2">
                      <Skeleton width="100%" style={{ paddingBottom: "100%" }} />
                    </div>
                  ))
                ) : (
                  [
                    "/assets/img/HomePage/7.webp",
                    "/assets/img/HomePage/11.webp",
                    "/assets/img/HomePage/16.webp",
                    "/assets/img/HomePage/18.webp",
                    "/assets/img/HomePage/128.webp",
                    "/assets/img/HomePage/7.webp",
                  ].map((imgSrc, index) => (
                    <div key={index} className="col-4 col-md-2">
                      <a
                        href="https://www.instagram.com/thepatilphotography"
                        target="_blank"
                        rel="noreferrer"
                        className="d-block overflow-hidden position-relative group"
                        style={{ paddingBottom: "100%", position: "relative" }}
                      >
                        <img
                          src={imgSrc}
                          alt="Instagram view"
                          className="img-fluid position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                          style={{ transition: "transform 0.3s ease" }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.transform = "scale(1.05)")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        />
                      </a>
                    </div>
                  ))
                )}
              </div>

              <div className="text-center mt-4">
                <a
                  href="https://www.instagram.com/thepatilphotography?igsh=MWQwMGFkcDVwbmpxYQ=="
                  target="_blank"
                  className="cta-link"
                  rel="noreferrer"
                >
                  Follow us on Instagram{" "}
                  <i className="bi bi-instagram ms-2"></i>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <StoryModal
        show={showModal}
        onHide={() => setShowModal(false)}
        story={
          selectedStory
            ? {
              ...selectedStory,
              subtitle: selectedStory.location,
              images: selectedStory.gallery || [],
            }
            : null
        }
      />

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

export default Home;
