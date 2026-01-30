import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StoryModal from '../components/StoryModal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home = () => {
  console.log('Home component rendering');
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    fetch('/api/slider')
      .then(res => res.json())
      .then(data => {
        const activeSlides = data.filter(s => s.status === 'Active');
        if (activeSlides.length > 0) {
          setSlides(activeSlides.map(s => ({
            image: s.image, // Base64 or URL
            title: s.title,
            subtitle: s.subtitle || 'Capturing moments...' // Fallback
          })));
        }
      })
      .catch(err => console.error("Error fetching slider:", err));
  }, []);
  const [loveStories, setLoveStories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [instagramPosts, setInstagramPosts] = useState([]);

  useEffect(() => {
    // ... Existing slider fetch ...
    fetch('/api/slider')
      .then(res => res.json())
      .then(data => {
        const activeSlides = data.filter(s => s.status === 'Active');
        if (activeSlides.length > 0) {
          setSlides(activeSlides.map(s => ({
            image: s.image,
            title: s.title,
            subtitle: s.subtitle || 'Capturing moments...'
          })));
        }
      })
      .catch(err => console.error("Error fetching slider:", err));

    // Fetch Love Stories
    fetch('/api/love-stories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLoveStories(data.filter(s => s.status === 'Active'));
        }
      })
      .catch(err => console.error("Error fetching love stories:", err));

    // Fetch Testimonials
    fetch('/api/testimonials?type=active')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTestimonials(data); // Controller already filters active
        }
      })
      .catch(err => console.error("Error fetching testimonials:", err));

  }, []);
  useEffect(() => {
    let preloaderTimeout;
    let aosTimeout;
    try {
      // Set body class
      document.body.className = 'index-page';

      // Hide preloader after component mounts
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloaderTimeout = setTimeout(() => {
          if (preloader && preloader.parentNode) {
            preloader.style.display = 'none';
          }
        }, 500);
      }

      // Initialize AOS if available
      if (typeof window !== 'undefined' && window.AOS) {
        window.AOS.init({
          duration: 600,
          easing: 'ease-in-out',
          once: true,
          mirror: false
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
        const accessToken = process.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN || 'YOUR_INSTAGRAM_ACCESS_TOKEN';
        const accountId = process.env.REACT_APP_INSTAGRAM_ACCOUNT_ID || 'YOUR_INSTAGRAM_ACCOUNT_ID';
        if (accessToken === 'YOUR_INSTAGRAM_ACCESS_TOKEN' || accountId === 'YOUR_INSTAGRAM_ACCOUNT_ID') {
          console.log('Please set your Instagram access token and account ID in environment variables');
          return;
        }
        try {
          const response = await fetch(`https://graph.facebook.com/v18.0/${accountId}/media?fields=id,media_type,media_url,permalink,caption&access_token=${accessToken}`);
          const data = await response.json();
          if (data.data) {
            setInstagramPosts(data.data.filter(post => post.media_type === 'IMAGE').slice(0, 6));
          }
        } catch (error) {
          console.error('Error fetching Instagram posts:', error);
        }
      };
      fetchInstagramPosts();

      // Initialize other vendor libraries
      if (typeof window !== 'undefined') {
        // Initialize GLightbox
        if (window.GLightbox) {
          const lightbox = window.GLightbox({
            selector: '.glightbox'
          });
        }
      }
    } catch (error) {
      console.error('Error in Home useEffect:', error);
    }

    return () => {
      if (preloaderTimeout) clearTimeout(preloaderTimeout);
      if (aosTimeout) clearTimeout(aosTimeout);
      document.body.className = '';
    };
  }, []);

  return (
    <>
      <Header />

      <main className="main">
        {/* Hero Section */}
        <section id="hero" className="hero dark-background">
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
                <div className="hero-video-container">
                  <img src={slide.image} className="img-fluid " alt="" />
                  <div className="hero-overlay"></div>
                </div>

                <div className="container hfull" data-aos="fade-up" data-aos-delay="100">
                  <div className="row justify-content-center text-center">
                    <div className="col-lg-8">
                      <div className="hero-content">
                        <h1 data-aos="fade-up" data-aos-delay="200">{slide.title}</h1>
                        <p data-aos="fade-up" data-aos-delay="300">
                          {slide.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* About Section */}
        <section id="about" className="about section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row align-items-center">
              <div className="col-lg-6 order-2 order-lg-1" data-aos="fade-right" data-aos-delay="200">
                <div className="content">
                  <span className="accent-color fw-bold text-uppercase mb-2 d-block">Established Since 2015</span>
                  <h2 className="section-heading mb-4">
                    Preserving Pure Emotion <br /> in Every Frame
                  </h2>
                  <p className="description-text mb-4">
                    At <strong>The Patil Photography & Film's</strong>, we transform love stories into elegant visual masterpieces.
                    We capture the unspoken moments, heartfelt smiles, and gentle glances that define your journey.
                  </p>

                  <div className="row g-4 mb-5">
                    <div className="col-6">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-camera accent-color fs-3"></i>
                        <div>
                          <h5 className="mb-0">Artistic Vision</h5>
                          <small className="text-muted">Creative Storytelling</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-heart accent-color fs-3"></i>
                        <div>
                          <h5 className="mb-0">Real Emotions</h5>
                          <small className="text-muted">Authentic Moments</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="cta-section">
                    <Link to="/portfolio" className="submit-btn" style={{ textDecoration: 'none', marginTop: '0' }}>
                      <span>View Our Work</span>
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 order-1 order-lg-2" data-aos="fade-left" data-aos-delay="200">
                <div className="image-section position-relative ps-lg-5">
                  <img src="/assets/img/HomePage/7.webp" alt="showcase" className="img-fluid rounded-4 shadow-xl" />
                  <div className="position-absolute bottom-0 start-0 bg-white p-4 m-3 rounded-3 shadow-sm d-none d-md-block">
                    <h4 className="mb-0 accent-color">10+ Years</h4>
                    <p className="mb-0 text-muted small">Experience in Photography</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats section py-5 dark-background">
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-3 col-6" data-aos="fade-up" data-aos-delay="100">
                <div className="stats-item">
                  <i className="bi bi-emoji-smile"></i>
                  <span className="count">500+</span>
                  <span>Happy Couples</span>
                </div>
              </div>
              <div className="col-lg-3 col-6" data-aos="fade-up" data-aos-delay="200">
                <div className="stats-item">
                  <i className="bi bi-journal-richtext"></i>
                  <span className="count">1200+</span>
                  <span>Moments Captured</span>
                </div>
              </div>
              <div className="col-lg-3 col-6" data-aos="fade-up" data-aos-delay="300">
                <div className="stats-item">
                  <i className="bi bi-camera-reels"></i>
                  <span className="count">300+</span>
                  <span>Cinematic Films</span>
                </div>
              </div>
              <div className="col-lg-3 col-6" data-aos="fade-up" data-aos-delay="400">
                <div className="stats-item">
                  <i className="bi bi-award"></i>
                  <span className="count">25+</span>
                  <span>Photography Awards</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Specialties Section */}
        <section id="specialties" className="specialties section pb-0">
          <div className="container section-title text-center" data-aos="fade-up">
            <h2>Our Specialties</h2>
            <p>Crafting timeless memories across diverse genres</p>
          </div>

          <div className="container">
            <div className="row g-4">
              <div className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="100">
                <div className="specialties-card">
                  <img src="/assets/img/HomePage/11.webp" alt="Wedding" />
                  <div className="specialties-overlay">
                    <h3>Wedding</h3>
                    <p>Grand celebrations captured with elegance</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="200">
                <div className="specialties-card">
                  <img src="/assets/img/HomePage/16.webp" alt="Pre-Wedding" />
                  <div className="specialties-overlay">
                    <h3>Pre-Wedding</h3>
                    <p>Candid chemistry in romantic settings</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="300">
                <div className="specialties-card">
                  <img src="/assets/img/HomePage/18.webp" alt="Cinematography" />
                  <div className="specialties-overlay">
                    <h3>Films</h3>
                    <p>Cinematic storytelling of your love</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="400">
                <div className="specialties-card">
                  <img src="/assets/img/HomePage/128.webp" alt="Maternity" />
                  <div className="specialties-overlay">
                    <h3>Maternity</h3>
                    <p>Celebrating new beginnings with soul</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="process section py-5">
          <div className="container section-title text-center" data-aos="fade-up">
            <h2>Our Creative Journey</h2>
            <p>How we bring your vision to life</p>
          </div>

          <div className="container">
            <div className="row g-4">
              <div className="col-lg-4" data-aos="zoom-in" data-aos-delay="100">
                <div className="process-step">
                  <div className="process-icon">
                    <i className="bi bi-chat-quote"></i>
                  </div>
                  <h4>Consultation</h4>
                  <p>We sit down to understand your vision, theme, and priorities for the big day.</p>
                </div>
              </div>
              <div className="col-lg-4" data-aos="zoom-in" data-aos-delay="200">
                <div className="process-step">
                  <div className="process-icon">
                    <i className="bi bi-camera"></i>
                  </div>
                  <h4>The Session</h4>
                  <p>Our experts capture your moments using state-of-the-art gear and creative techniques.</p>
                </div>
              </div>
              <div className="col-lg-4" data-aos="zoom-in" data-aos-delay="300">
                <div className="process-step">
                  <div className="process-icon">
                    <i className="bi bi-magic"></i>
                  </div>
                  <h4>Curation</h4>
                  <p>Professional editing and retouching to ensure every frame is a masterpiece.</p>
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

          <div className="container">
            {testimonials.length === 0 ? (
              <div className="col-12 text-center p-5">
                <p>Currently updating our wall of love. Check back soon!</p>
              </div>
            ) : (
              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                loop={testimonials.length >= 3}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="testimonials-slider"
                style={{ paddingBottom: '40px' }}
              >
                {testimonials.map((t, index) => (
                  <SwiperSlide key={t._id}>
                    <div className="testimonial-item" style={{ height: '100%' }}>
                      <div className="testimonial-content">
                        <div className="quote-pattern">
                          <i className="bi bi-quote"></i>
                        </div>
                        <p>"{t.shortDescription}"</p>

                        {/* Star Rating */}
                        <div className="stars" style={{ color: '#ffc107', marginBottom: '10px' }}>
                          {[...Array(t.rating || 5)].map((_, i) => (
                            <i key={i} className="bi bi-star-fill"></i>
                          ))}
                        </div>

                        <div className="client-info">
                          <div className="client-image">
                            <img
                              src={t.thumbnail || "https://placehold.co/250x250?text=Couple"}
                              alt={t.coupleName}
                              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }}
                            />
                          </div>
                          <div className="client-details">
                            <h3>{t.coupleName}</h3>
                            <span className="position">{t.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="projects section pt-3">
          <div className="container section-title text-center" data-aos="fade-up">
            <h2>Our Latest Love Stories</h2>
            <div className="d-flex justify-content-center">
              <p className="w-50 d-block text-center">
                Every couple carries a beautiful story of their own, and it's our privilege to capture those
                timeless moments meant to be cherished for generations.
              </p>
            </div>
          </div>

          <div className="container" data-aos="fade-up" data-aos-delay="100">
            {/* Love Stories Slider */}
            {loveStories.length === 0 ? (
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
                style={{ paddingBottom: '40px' }}
              >
                {loveStories.map((story) => (
                  <SwiperSlide key={story._id}>
                    <div className="project-card" style={{ height: '100%' }}>
                      <div className="project-image">
                        <img
                          src={story.thumbnail}
                          alt={story.title}
                          className="img-fluid"
                          style={{ width: '100%', height: '300px', objectFit: 'cover' }}
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
                            className="cta-link"
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

            <div className="d-flex justify-content-center mt-4">
              <Link to="/stories" className="submit-btn" style={{ textDecoration: 'none' }}>
                <span>View All Stories</span>
                <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        </section>

        {/* Instagram  */}
        <section id="instagram" className="about section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="container section-title" data-aos="fade-up">
              <h2>As Seen on Instagram</h2>
              <p><a href="https://www.instagram.com/thepatilphotography" target="_blank" rel="noreferrer" className="text-secondary">@thepatilphotography</a></p>
            </div>
            <div className="container">
              <div className="row g-2 justify-content-center">
                {/* Static Grid to simulate Instagram Feed using existing portfolio images */}
                {/* This avoids 404s from invalid widget IDs and requires no API tokens */}
                {[
                  "/assets/img/HomePage/7.webp",
                  "/assets/img/HomePage/11.webp",
                  "/assets/img/HomePage/16.webp",
                  "/assets/img/HomePage/18.webp",
                  "/assets/img/HomePage/128.webp",
                  "/assets/img/HomePage/7.webp"
                ].map((imgSrc, index) => (
                  <div key={index} className="col-4 col-md-2">
                    <a href="https://www.instagram.com/thepatilphotography" target="_blank" rel="noreferrer" className="d-block overflow-hidden position-relative group" style={{ paddingBottom: '100%', position: 'relative' }}>
                      <img
                        src={imgSrc}
                        alt="Instagram view"
                        className="img-fluid position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                        style={{ transition: 'transform 0.3s ease' }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </a>
                  </div>
                ))}
              </div>

              <div className="text-center mt-4">
                <a href="https://www.instagram.com/thepatilphotography?igsh=MWQwMGFkcDVwbmpxYQ==" target="_blank" className="cta-link" rel="noreferrer">
                  Follow us on Instagram <i className="bi bi-instagram ms-2"></i>
                </a>
              </div>
            </div>
          </div>
        </section>

      </main >

      <StoryModal
        show={showModal}
        onHide={() => setShowModal(false)}
        story={selectedStory ? {
          ...selectedStory,
          subtitle: selectedStory.location,
          images: selectedStory.gallery || []
        } : null}
      />

      <Footer />

      {/* Scroll Top Button */}
      <a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center">
        <i className="bi bi-arrow-up-short"></i>
      </a>

      {/* Preloader */}
      <div id="preloader"></div>
    </>
  );
};

export default Home;