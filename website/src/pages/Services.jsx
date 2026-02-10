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
            {/* Fresh Services Header */}
            <div className="services-header">
              <h2>Why Choose Our Services</h2>
              <p>At The Patil Photography & Film's, we craft timeless stories filled with emotion, elegance, and authenticity</p>
            </div>

            {/* Modern Service Cards Grid */}
            <div className="row g-4 mb-5">
              {servicesList.map((s, idx) => (
                <div key={s.id} className={`col-lg-4 col-md-6 ${idx === 0 ? 'featured-service' : ''}`} data-aos="fade-up" data-aos-delay={100 + idx * 100}>
                  <div className={`service-card-modern ${idx === 0 ? 'featured' : ''}`}>
                    <div className="service-number">0{s.id}</div>
                    <div className="service-icon">
                      {s.id === 1 && <i className="bi bi-building" />}
                      {s.id === 2 && <i className="bi bi-heart" />}
                      {s.id === 3 && <i className="bi bi-person-circle" />}
                      {s.id === 4 && <i className="bi bi-box" />}
                      {s.id === 5 && <i className="bi bi-film" />}
                      {s.id === 6 && <i className="bi bi-magic" />}
                    </div>
                    <h3>{s.title}</h3>
                    <p>{s.description}</p>
                    <a href={s.cta} className="service-link">
                      Explore Service
                      <i className="bi bi-arrow-right" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="row mt-5" data-aos="fade-up" data-aos-delay="400">
              <div className="col-lg-12 text-center">
                <div className="">
                  <h4>Ready to book a shoot?</h4>
                  <p>Contact our team to discuss your requirements and get a custom quote.</p>
                  <a href="/quote" className="cta-link">
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
