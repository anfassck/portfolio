import React, { useEffect, useState } from 'react';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Verified CV Default Projects
    const fallbackProjects = [
        {
            _id: '1',
            title: 'Pixora – Social Media Platform',
            description: 'Developed a full-stack MERN-based social media platform supporting secure authentication, responsive feed UI, image uploads, real-time likes, and instant comment interactions.',
            technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Cloudinary', 'Socket.io', 'Tailwind CSS'],
            category: 'MERN Stack',
            badge: '⭐ Flagship Project',
            projectUrl: 'https://pixlora.anfassck.online',
            githubUrl: 'https://github.com/anfassck'
        },
        {
            _id: '2',
            title: 'MeloFlow – Music Streaming Platform',
            description: 'Built a contemporary music streaming platform featuring smooth audio track discovery, custom audio player controls, and optimized asset rendering for seamless playback.',
            technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Axios'],
            category: 'Full Stack',
            badge: '🎵 Music Streaming',
            projectUrl: 'https://anfassck.online',
            githubUrl: 'https://github.com/anfassck'
        },
        {
            _id: '3',
            title: 'MediCare – Online Hospital Booking Platform',
            description: 'Architected a secure hospital consulting platform featuring real-time doctor availability scheduling and patient database management, fully deployed on AWS EC2.',
            technologies: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'Bootstrap', 'AWS EC2'],
            category: 'MERN Stack',
            badge: '🏥 Healthcare Portal',
            projectUrl: 'https://hospital.anfassck.online',
            githubUrl: 'https://github.com/anfassck'
        },
        {
            _id: '4',
            title: 'Ceekey Online Shope – E-Commerce Platform',
            description: 'Developed a comprehensive e-commerce platform with dynamic product filtering, real-time shopping cart calculations, checkout flow, and administrative management portals.',
            technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Redux Toolkit', 'Tailwind CSS'],
            category: 'Full Stack',
            badge: '🛒 E-Commerce System',
            projectUrl: 'https://ceekey.anfassck.online',
            githubUrl: 'https://github.com/anfassck'
        }
    ];

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const API_BASE = 'https://portfolioapi.anfassck.online';
                const res = await fetch(`${API_BASE}/api/projects`);
                const data = await res.json();
                if (data.success && data.data && data.data.length > 0) {
                    setProjects(data.data);
                } else {
                    setProjects(fallbackProjects);
                }
            } catch (err) {
                setProjects(fallbackProjects);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const API_BASE = 'https://portfolioapi.anfassck.online';

    const categories = ['All', 'MERN Stack', 'Full Stack', 'Web Apps'];

    const displayedProjects = (projects.length > 0 ? projects : fallbackProjects).filter(p => {
        if (selectedCategory === 'All') return true;
        if (p.category === selectedCategory) return true;
        if (p.technologies && p.technologies.some(t => t.toLowerCase().includes(selectedCategory.toLowerCase()))) return true;
        return false;
    });

    return (
        <section id="projects" className="section">
            <h2 className="section-title" data-aos="fade-up"><span className="gradient-text">Featured Work</span></h2>
            <p className="section-subtitle" data-aos="fade-up">Production-level full-stack applications built with modern architectural design.</p>
            
            {/* Category Filter Tabs */}
            <div className="project-filters" data-aos="fade-up" data-aos-delay="100">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>Loading projects...</div>
            ) : (
                <div className="projects-grid">
                    {displayedProjects.map((p, index) => (
                        <div key={p._id || index} className="project-card glass-card" data-aos="fade-up" data-aos-delay={150 + (index % 3) * 150} data-cursor="VIEW">
                            {p.badge && (
                                <div className={`project-badge ${index === 0 ? 'featured' : ''}`}>
                                    {p.badge}
                                </div>
                            )}
                            <div className="project-image project-image-container">
                                {p.imageUrl ? (
                                    <img src={p.imageUrl.startsWith('http') ? p.imageUrl : `${API_BASE}${p.imageUrl}`} alt={p.title} />
                                ) : (
                                    <div style={{ height: '100%', minHeight: '190px', background: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,41,59,0.9))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                        <i className='bx bx-code-alt' style={{ fontSize: '3.5rem', color: 'var(--primary)' }}></i>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'Space Grotesk' }}>Live MERN Application</span>
                                    </div>
                                )}
                                <div className="project-overlay project-links">
                                    <div className="overlay-buttons">
                                        {p.projectUrl && (
                                            <a href={p.projectUrl} target="_blank" rel="noreferrer" className="live-link"><i className='bx bx-link-external'></i> Live Demo</a>
                                        )}
                                        {p.githubUrl && (
                                            <a href={p.githubUrl} target="_blank" rel="noreferrer" className="github-link"><i className='bx bxl-github'></i> Code Repo</a>
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
