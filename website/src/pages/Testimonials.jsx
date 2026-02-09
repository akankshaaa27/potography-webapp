import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [formData, setFormData] = useState({
    coupleName: "",
    location: "",
    shortDescription: "",
    rating: 5,
    thumbnail: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    try {
      document.body.className = "reviews-feedback-page";
    } catch (error) {
      console.error("Error in Reviews useEffect:", error);
    }

    // Fetch Reviews & Feedback
    fetch("/api/testimonials?type=active")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTestimonials(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setLoading(false);
      });

    return () => (document.body.className = "");
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const truncateText = (text, wordLimit = 50) => {
    if (!text) return text;
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const toggleExpandReview = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          status: "Pending",
        }),
      });

      if (response.ok) {
        setSuccessMessage(
          "Thank you for your testimonial! It will be reviewed and published soon."
        );
        setFormData({
          coupleName: "",
          location: "",
          shortDescription: "",
          rating: 5,
          thumbnail: "",
        });
        setTimeout(() => {
          setShowForm(false);
          setSuccessMessage("");
        }, 3000);
      } else {
        setErrorMessage("Failed to submit testimonial. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      setErrorMessage("An error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <main className="main">
        {/* Page Header */}
        <div className="page-title dark-background" style={{ backgroundImage: "url('/assets/img/HomePage/16.webp')" }}>
          <div className="container position-relative">
            <h1>Reviews & Feedback</h1>
            <p>Words from the heart of our beloved couples</p>
            <nav className="breadcrumbs">
              <ol>
                <li><a href="/">Home</a></li>
                <li className="current">Reviews & Feedback</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Reviews & Feedback Section */}
        <section className="reviews-feedback-section section" style={{ backgroundColor: '#fafaf8', paddingTop: '80px', paddingBottom: '80px' }}>
          <div className="container">
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '80px', maxWidth: '700px', margin: '0 auto 80px' }} data-aos="fade-up">
              <div style={{ fontSize: '0.85rem', color: '#d4af37', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
                From Our Couples
              </div>
              <h2 style={{ fontSize: '3.2rem', fontWeight: '700', lineHeight: '1.2', marginBottom: '24px', color: '#1a1a1a' }}>
                From the Hearts of Our Couples
              </h2>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#666', marginBottom: '40px' }}>
                Every love story is unique, and we're honored to be a part of it. Read what our couples have to say about their experience with us.
              </p>
              <button
                className="cta-link"
                onClick={() => setShowForm(!showForm)}
                data-aos="fade-up"
                data-aos-delay="100"
                style={{ padding: '14px 32px', borderRadius: '8px', fontWeight: '600', fontSize: '0.95rem', display: 'inline-block', backgroundColor: '#d4af37', color: '#FFF', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#c49a2f';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#d4af37';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <i className="bi bi-pencil-square me-2"></i>
                Share Your Review
              </button>
            </div>

            {/* Review Form */}
            {showForm && (
              <div
                className="review-form-container mb-5"
                data-aos="fade-up"
                style={{ 
                  backgroundColor: '#ffffff', 
                  padding: '40px', 
                  borderRadius: '12px', 
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  maxWidth: '700px',
                  margin: '0 auto 40px'
                }}
              >
                <h3 className="form-title" style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '24px', color: '#1a1a1a' }}>Share Your Experience</h3>
                <form onSubmit={handleSubmit} className="review-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label htmlFor="coupleName" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a1a1a' }}>Couple Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="coupleName"
                        name="coupleName"
                        value={formData.coupleName}
                        onChange={handleInputChange}
                        placeholder="Your couple name"
                        required
                        style={{ 
                          width: '100%', 
                          padding: '10px 12px', 
                          border: '1px solid #ddd', 
                          borderRadius: '6px',
                          fontSize: '0.95rem'
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="location" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a1a1a' }}>Location *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Your location"
                        required
                        style={{ 
                          width: '100%', 
                          padding: '10px 12px', 
                          border: '1px solid #ddd', 
                          borderRadius: '6px',
                          fontSize: '0.95rem'
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="shortDescription" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a1a1a' }}>Your Review *</label>
                    <textarea
                      className="form-control"
                      id="shortDescription"
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      placeholder="Share your experience with us..."
                      rows="5"
                      required
                      style={{ 
                        width: '100%', 
                        padding: '10px 12px', 
                        border: '1px solid #ddd', 
                        borderRadius: '6px',
                        fontSize: '0.95rem',
                        fontFamily: 'inherit'
                      }}
                    ></textarea>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label htmlFor="rating" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a1a1a' }}>Rating *</label>
                      <select
                        className="form-control"
                        id="rating"
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                        style={{ 
                          width: '100%', 
                          padding: '10px 12px', 
                          border: '1px solid #ddd', 
                          borderRadius: '6px',
                          fontSize: '0.95rem'
                        }}
                      >
                        <option value="5">5 Stars - Excellent</option>
                        <option value="4">4 Stars - Very Good</option>
                        <option value="3">3 Stars - Good</option>
                        <option value="2">2 Stars - Fair</option>
                        <option value="1">1 Star - Poor</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="thumbnail" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a1a1a' }}>Photo URL (Optional)</label>
                      <input
                        type="url"
                        className="form-control"
                        id="thumbnail"
                        name="thumbnail"
                        value={formData.thumbnail}
                        onChange={handleInputChange}
                        placeholder="https://example.com/photo.jpg"
                        style={{ 
                          width: '100%', 
                          padding: '10px 12px', 
                          border: '1px solid #ddd', 
                          borderRadius: '6px',
                          fontSize: '0.95rem'
                        }}
                      />
                    </div>
                  </div>

                  {successMessage && (
                    <div
                      className="alert alert-success alert-dismissible fade show"
                      role="alert"
                      style={{ 
                        padding: '12px 16px', 
                        borderRadius: '6px',
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        border: '1px solid #c3e6cb'
                      }}
                    >
                      {successMessage}
                    </div>
                  )}

                  {errorMessage && (
                    <div
                      className="alert alert-danger alert-dismissible fade show"
                      role="alert"
                      style={{ 
                        padding: '12px 16px', 
                        borderRadius: '6px',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        border: '1px solid #f5c6cb'
                      }}
                    >
                      {errorMessage}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <button
                      type="submit"
                      disabled={submitting}
                      style={{ 
                        padding: '12px 28px', 
                        backgroundColor: '#d4af37', 
                        color: '#1a1a1a', 
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        opacity: submitting ? 0.7 : 1,
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => !submitting && (e.target.style.backgroundColor = '#c49a2f')}
                      onMouseLeave={(e) => !submitting && (e.target.style.backgroundColor = '#d4af37')}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Submitting...
                        </>
                      ) : (
                        "Submit Review"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      disabled={submitting}
                      style={{ 
                        padding: '12px 28px', 
                        backgroundColor: '#f0f0f0', 
                        color: '#1a1a1a', 
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#e0e0e0')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Reviews Grid */}
            {!showForm && (
              loading ? (
                <div className="text-center py-5">
                  <p>Loading reviews...</p>
                </div>
              ) : testimonials.length > 0 ? (
                <div className="reviews-grid">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
                    {testimonials.map((review, index) => (
                      <div
                        key={review._id}
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                        style={{
                          background: 'white',
                          borderRadius: '12px',
                          padding: '2.5rem',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                          e.currentTarget.style.transform = 'translateY(-5px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {/* Quote Icon */}
                        <div style={{ marginBottom: '16px' }}>
                          <i className="bi bi-quote" style={{ fontSize: '2rem', color: '#d4af37', opacity: 0.5 }}></i>
                        </div>

                        {/* Review Text */}
                        <p style={{ 
                          fontSize: '1rem', 
                          lineHeight: '1.8', 
                          color: '#666', 
                          marginBottom: '20px',
                          flexGrow: 1,
                          fontStyle: 'italic'
                        }}>
                          "{expandedReviews[review._id] ? review.shortDescription : truncateText(review.shortDescription)} "
                   

                        {/* View More Button */}
                        {review.shortDescription && review.shortDescription.split(' ').length > 50 && (
                          <button
                            onClick={() => toggleExpandReview(review._id)}
                            style={{
                              display: 'Block',
                              background: 'none',
                              border: 'none',
                              color: '#d4af37',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '0.9rem',
                              padding: '0 0 12px 0',
                              textDecoration: 'none',
                              transition: 'all 0.3s ease',
                              marginBottom: '12px'
                            }}
                            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                          >
                            {expandedReviews[review._id] ? ' View Less' : ' View More'}
                          </button>
                        )}
     </p>
                        {/* Star Rating */}
                        <div style={{ marginBottom: '20px', color: '#ffc107' }}>
                          {[...Array(review.rating || 5)].map((_, i) => (
                            <i key={i} className="bi bi-star-fill" style={{ marginRight: '4px' }}></i>
                          ))}
                        </div>

                        {/* Divider */}
                        <div style={{ borderTop: '1px solid #eee', marginBottom: '16px' }}></div>

                        {/* Author Info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {review.thumbnail && (
                            <img
                              src={review.thumbnail}
                              alt={review.coupleName}
                              style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }}
                            />
                          )}
                          <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px 0' }}>
                              {review.coupleName}
                            </h4>
                            <p style={{ fontSize: '0.85rem', color: '#999', margin: 0 }}>
                              {review.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-5">
                  <p style={{ fontSize: '1.05rem', color: '#666' }}>No reviews yet. Be the first to share your experience!</p>
                </div>
              )
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-banner" style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '80px 0', textAlign: 'center' }} data-aos="fade-up">
          <div className="container">
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '16px', color: '#fff' }}>Ready to Create Your Love Story?</h2>
            <p style={{ fontSize: '1.1rem', color: '#ccc', marginBottom: '32px' }}>Let us capture your special moments with the elegance they deserve.</p>
            <a href="/quote" style={{ 
              display: 'inline-block',
              padding: '14px 32px',
              backgroundColor: '#d4af37',
              color: '#1a1a1a',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#c49a2f';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#d4af37';
              e.target.style.transform = 'translateY(0)';
            }}
            >
              Get Your Quote
              <i className="bi bi-arrow-right ms-2"></i>
            </a>
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

    </>
  );
};

export default Testimonials;
