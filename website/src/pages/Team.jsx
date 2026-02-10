import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";

const Team = () => {
    const [team, setTeam] = useState([]);
    const [teamLoading, setTeamLoading] = useState(true);

    useEffect(() => {
        // Fetch Team
        fetch("/api/team?publicOnly=true")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setTeam(data);
            })
            .catch(err => console.error("Error fetching team", err))
            .finally(() => setTeamLoading(false));

        document.body.className = "index-page";

        return () => {
            document.body.className = "";
        };
    }, []);

    return (
        <>
            <Header />

            {/* Page Title */}
            <div className="page-title dark-background" style={{ backgroundImage: "url('/assets/img/HomePage/16.webp')" }}>
                <div className="container position-relative">
                    <h1>Our Team</h1>
                    <p>The Creative Souls Capturing Your Story</p>
                    <nav className="breadcrumbs">
                        <ol>
                            <li><a href="/">Home</a></li>
                            <li className="current">Team</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <main className="main">
                {/* Meet Our Team Section */}
                <section id="team" className="team section">
                    <div className="container" data-aos="fade-up">
                                <div className="section-title text-center pb-3 mb-5">
                                    <h2 style={{ fontSize: '2.4rem', fontWeight: 800, background: 'linear-gradient(90deg,#f7e7c8,#d4af37)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Meet The Atelier</h2>
                                    <p style={{ color: '#666' }}>A collective of storytellers, each handpicked for craft, discretion, and an eye for cinematic romance.</p>
                                </div>

                                <div style={{ marginTop: '12px' }}>
                                    {teamLoading ? (
                                        <div className="text-center p-5">Loading team...</div>
                                    ) : team?.length > 0 ? (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '26px', alignItems: 'stretch' }}>
                                            {team.map((member, idx) => (
                                                <div key={member._id || idx} data-aos="fade-up" data-aos-delay={idx * 60} style={{ background: '#fff', borderRadius: '12px', padding: '14px', boxShadow: '0 6px 18px rgba(24,24,24,0.06)', border: '1px solid #eee', transition: 'transform .22s ease', display: 'flex', flexDirection: 'column', gap: '12px' }} onMouseEnter={(e)=> e.currentTarget.style.transform='translateY(-4px)'} onMouseLeave={(e)=> e.currentTarget.style.transform='translateY(0)'}>
                                                    <div style={{ borderRadius: '10px', overflow: 'hidden', background: '#f5f5f5' }}>
                                                        <div style={{ width: '100%', height: '320px', overflow: 'hidden' }}>
                                                            <img src={member.image || '/assets/img/logo.PNG'} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                                        </div>
                                                    </div>

                                                    <div style={{ textAlign: 'center', paddingTop: '6px' }}>
                                                        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111' }}>{member.name}</div>
                                                        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '6px' }}>{member.role}</div>
                                                    </div>

                                                    <p style={{ color: '#444', lineHeight: 1.6, margin: 0 }}>{member.bio}</p>

                                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '8px' }}>
                                                        {member.socialLinks?.instagram && <a href={member.socialLinks.instagram} target="_blank" rel="noreferrer" style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#1a1a1a', border: '1px solid #eee' }}><i className="bi bi-instagram"></i></a>}
                                                        {member.socialLinks?.facebook && <a href={member.socialLinks.facebook} target="_blank" rel="noreferrer" style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#1a1a1a', border: '1px solid #eee' }}><i className="bi bi-facebook"></i></a>}
                                                        {member.socialLinks?.website && <a href={member.socialLinks.website} target="_blank" rel="noreferrer" style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#1a1a1a', border: '1px solid #eee' }}><i className="bi bi-globe"></i></a>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center p-5">
                                            <p>Our team is growing! Check back soon.</p>
                                        </div>
                                    )}
                                </div>
                    </div>
                </section>

            </main>

            <Footer />
            {/* Scroll Top Button */}
            <a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center">
                <i className="bi bi-arrow-up-short"></i>
            </a>
        </>
    );
};

export default Team;
