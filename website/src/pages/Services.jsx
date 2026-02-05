import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const servicesList = [
  {
    id: 1,
    title: 'Commercial Photography',
    description: 'High-quality photography for businesses, products and marketing.',
    cta: '/service-details'
  },
  {
    id: 2,
    title: 'Wedding & Events',
    description: 'Capture memorable wedding and event moments with storytelling approach.',
    cta: '/service-details'
  },
  {
    id: 3,
    title: 'Editorial & Portraits',
    description: 'Portraits and editorial shoots tailored to your brand or personal style.',
    cta: '/service-details'
  },
  {
    id: 4,
    title: 'Product Photography',
    description: 'Clean, consistent product images ideal for e-commerce and catalogs.',
    cta: '/service-details'
  },
  {
    id: 5,
    title: 'Cinematography & Films',
    description: 'Short films and promotional videos to showcase your story.',
    cta: '/films'
  },
  {
    id: 6,
    title: 'Retouching & Post-Production',
    description: 'Professional retouching and color grading services.',
    cta: '/service-details'
  }
];

const Services = () => {
  useEffect(() => {
    document.body.className = 'services-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <>
      <Header />

      <div className="page-title dark-background" style={{ backgroundImage: "url('/assets/img/HomePage/7.webp')" }}>
        <div className="container position-relative">
          <h1>Services</h1>
          <p>Explore the range of photography & filmmaking services we offer.</p>
          <nav className="breadcrumbs">
            <ol>
              <li><a href="/">Home</a></li>
              <li className="current">Services</li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="main">
        <section id="services" className="services section light-background">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="services-grid">
              {servicesList.map((s, idx) => (
                <div className={`service-item ${s.id === 3 ? 'featured' : ''}`} key={s.id} data-aos="fade-up" data-aos-delay={150 + idx * 50}>
                  {s.id === 3 && <div className="featured-badge">Premium</div>}
                  <div className="service-number">{String(s.id).padStart(2, '0')}</div>
                  <div className="service-icon">
                    <i className="bi bi-camera" />
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                  <a href={s.cta} className="service-cta">
                    <span>Explore Service</span>
                    <i className="bi bi-arrow-right" />
                  </a>
                </div>
              ))}
            </div>

            <div className="row mt-5" data-aos="fade-up" data-aos-delay="400">
              <div className="col-lg-12 text-center">
                <div className="cta-section">
                  <h4>Ready to book a shoot?</h4>
                  <p>Contact our team to discuss your requirements and get a custom quote.</p>
                  <a href="/quote" className="btn-primary">
                    <span>Get Free Quote</span>
                    <i className="bi bi-arrow-right" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Services;
