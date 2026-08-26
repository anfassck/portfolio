import React, { useEffect, useState } from 'react';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const API_BASE = 'https://portfolioapi.anfassck.online';
                const res = await fetch(`${API_BASE}/api/projects`);
                const data = await res.json();
                if (data.success) {
                    setProjects(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch projects:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const API_BASE = 'https://portfolioapi.anfassck.online';

    return (
        <section id="projects" className="section">
            <h2 className="section-title" data-aos="fade-up"><span className="gradient-text">Featured Work</span></h2>
            <p className="section-subtitle" data-aos="fade-up">Exploring the intersection of design and functionality through code.</p>
            
            {loading ? (
                <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>Loading projects...</div>
            ) : projects.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>No projects found.</div>
            ) : (
                <div className="projects-grid">
                    {projects.map((p, index) => (
                        <div key={p._id || index} className="project-card glass-card" data-aos="fade-up" data-aos-delay={200 + (index % 3) * 200} data-cursor="VIEW">
                            <div className="project-image project-image-container">
                                {p.imageUrl ? (
                                    <img src={p.imageUrl.startsWith('http') ? p.imageUrl : `${API_BASE}${p.imageUrl}`} alt={p.title} />
                                ) : (
                                    <div style={{ height: '100%', background: 'rgba(30,41,59,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <i className='bx bx-image' style={{ fontSize: '4rem', color: 'var(--text-muted)' }}></i>
                                    </div>
                                )}
                                <div className="project-overlay project-links">
                                    <div className="overlay-buttons">
                                        {p.projectUrl && (
                                            <a href={p.projectUrl} target="_blank" rel="noreferrer" className="live-link"><i className='bx bx-link-external'></i> View Live</a>
                                        )}
                                        {p.githubUrl && (
                                            <a href={p.githubUrl} target="_blank" rel="noreferrer" className="github-link"><i className='bx bxl-github'></i> View Code</a>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="project-info">
                                <h3 className="project-title">{p.title}</h3>
                                <p className="project-desc">{p.description}</p>
                                {p.technologies && p.technologies.length > 0 && (
                                    <div className="tech-stack project-tags">
                                        {p.technologies.map((tech, i) => (
                                            <span key={i}>{tech}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Projects;

