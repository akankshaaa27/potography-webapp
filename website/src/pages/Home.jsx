import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StoryModal from '../components/StoryModal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const Home = () => {
  console.log('Home component rendering');
  const [slides, setSlides] = useState([]);
  const [loveStories, setLoveStories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [instagramPosts, setInstagramPosts] = useState([]);

  useEffect(() => {
    // Fetch Slider
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
                <div className="content section-title">
                  <h2 className="section-heading mb-4 text-center section-title" data-aos="fade-up">
                    Preserving Pure Emotion in Every Frame
                  </h2>

                  <p className="description-text my-3 text-left">
                    Welcome to <span>The Patil Photography & Film's,</span> where every love story is transformed
                    into an elegant visual masterpiece. We believe that every couple shares a unique bond, and our
                    passion lies in capturing the emotions, details, and unspoken moments that define your journey.
                  </p>

                  <p className="description-text mb-3 text-left">
                    With a refined blend of creativity and authenticity, we preserve heartfelt smiles, gentle glances,
                    and the timeless charm that unfolds throughout your special day. From grand celebrations to intimate
                    memories, our craft is dedicated to telling stories that reflect your love, connection, and personality.
                  </p>

                  <p className="description-text mb-3 text-left">
                    Explore our curated gallery — a world of emotions, artistry, and real moments captured with soul
                    and sincerity. Let us narrate your story through our lens, where every frame becomes a cherished
                    memory, preserved forever with elegance.
                  </p>

                  <div className="cta-section text-lg-start" data-aos="fade-up" data-aos-delay="450">
                    <Link to="/portfolio" className="cta-link">
                      Explore Our Services
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 order-1 order-lg-2" data-aos="fade-left" data-aos-delay="200">
                <div className="image-section mx-5 my-5">
                  <div className="main-image">
                    <img src="/assets/img/HomePage/7.webp" alt="showcase" />
                  </div>
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
            {testimonials.length > 0 ? (
              <Swiper
                modules={[Autoplay, Navigation]}
                slidesPerView={1}
                spaceBetween={30}
                autoplay={{ delay: 5000, disableOnInteraction: true }}
                navigation={testimonials.length > 1}
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
                      className={`testimonial-item ${index % 2 === 0 ? '' : 'highlight'}`}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                      style={{ height: '100%' }}
                    >
                      <div className="testimonial-content">
                        <div className="quote-pattern">
                          <i className="bi bi-quote"></i>
                        </div>
                        <p className='shortDescriptionLenth'>"{t.shortDescription}"</p>

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
                            <h3 className='coupleNameLenth'>{t.coupleName}</h3>
                            <span className="position">{t.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="text-center p-5">
                <p>Currently updating our wall of love. Check back soon!</p>
              </div>
            )}
          </div>
        </section>

        {/* Quote Section */}
        <section className="container px-5 pt-4" data-aos="fade-up" data-aos-delay="200">
          <h2 className="text-center Quite py-2">
            "Love's journey is written in small moments — the smiles, the glances, the warmth —
            each deserving to be held forever."
          </h2>
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