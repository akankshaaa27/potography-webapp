import React, { useEffect, useState } from 'react';
// import { X } from 'lucide-react'; // Removing to avoid build error


const TributeModal = ({ isOpen, onClose }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setShow(true), 100);
        } else {
            setShow(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const styles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            opacity: show ? 1 : 0,
            transition: 'opacity 0.5s ease',
        },
        container: {
            position: 'relative',
            width: '90%',
            maxWidth: '550px',
            backgroundColor: '#fff',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            transform: show ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
            transition: 'all 0.5s ease',
            fontFamily: "'Playfair Display', serif",
        },
        closeBtn: {
            position: 'absolute',
            right: '16px',
            top: '16px',
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '50%',
            padding: '8px',
            cursor: 'pointer',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerBg: {
            height: '140px',
            background: 'linear-gradient(to right, #0f172a, #334155)',
        },
        imageWrapper: {
            marginTop: '-70px',
            display: 'flex',
            justifyContent: 'center',
        },
        imageContainer: {
            width: '180px', // Slightly larger for better impact
            height: '180px',
            borderRadius: '50%',
            border: '5px solid white',
            overflow: 'hidden',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            backgroundColor: '#e2e8f0',
        },
        image: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
        },
        content: {
            padding: '24px 32px 32px',
            textAlign: 'center',
        },
        badge: {
            display: 'inline-block',
            backgroundColor: '#f1f5f9',
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#475569',
            marginBottom: '16px',
            fontFamily: 'sans-serif',
        },
        title: {
            margin: '0 0 4px',
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#0f172a',
        },
        dates: {
            margin: '0 0 20px',
            fontSize: '15px',
            fontWeight: '500',
            color: '#64748b',
            fontFamily: 'sans-serif',
        },
        message: {
            margin: '0 0 20px',
            fontSize: '17px',
            lineHeight: '1.6',
            color: '#334155',
            fontStyle: 'italic',
        },
        subMessage: {
            margin: '0 0 28px',
            fontSize: '15px',
            lineHeight: '1.5',
            color: '#64748b',
            fontFamily: 'sans-serif',
        },
        divider: {
            width: '64px',
            height: '4px',
            backgroundColor: '#cbd5e1',
            borderRadius: '9999px',
            margin: '0 auto',
        },
        footer: {
            marginTop: '24px',
            fontSize: '12px',
            color: '#94a3b8',
            fontFamily: 'sans-serif',
        },
        footerStrong: {
            fontWeight: '600',
            color: '#475569',
        },
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.container}>
                <button onClick={onClose} style={styles.closeBtn}>
                    {/* Inline SVG replacement for Lucide X */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ccc"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>

                <div>
                    <div style={styles.headerBg}></div>

                    <div style={styles.imageWrapper}>
                        <div style={styles.imageContainer}>
                            <img
                                src="/ajit-dada-tribute.png"
                                alt="Ajit Dada Pawar"
                                style={styles.image}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://placehold.co/400x400?text=Ajit+Dada";
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div style={styles.content}>
                    <div style={styles.badge}>
                        Lokneta & Guardian
                    </div>

                    <h2 style={styles.title}>
                        Ajit Dada Pawar
                    </h2>
                    <p style={styles.dates}>1959 - 2026</p>

                    <p style={styles.message}>
                        "A true 'Jan Nayak' and ground-level leader who tirelessly championed the development of Pune and Pimpri-Chinchwad. His vision transformed our cities and touched countless lives."
                    </p>

                    <p style={styles.subMessage}>
                        He was a pillar of strength for the common man and a driving force behind modern infrastructure. We deeply mourn the loss of a leader who was always there for the people.
                    </p>

                    <div style={styles.divider}></div>

                    <div style={styles.footer}>
                        <p style={{ marginBottom: '4px' }}>Tribute by</p>
                        <p style={styles.footerStrong}>Pixel Pro IT Solutions</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TributeModal;
