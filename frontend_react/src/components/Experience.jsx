import React from 'react';

const Experience = () => {
    return (
        <section id="experience" className="section">
            <h2 className="section-title" data-aos="fade-up"><span className="gradient-text">Experience & Education</span></h2>
            
            <div className="resume-grid">
                <div className="timeline-container">
                    <h3 className="resume-subheading" data-aos="fade-right"><i className='bx bx-briefcase'></i> Internship Experience</h3>
                    <div className="timeline" data-aos="fade-up" data-aos-delay="200">
                        <div className="timeline-item glass-card">
                            <div className="timeline-content">
                                <h3>Web Developer Intern</h3>
                                <h4>GTEC, Kannur</h4>
                                <span className="timeline-date">Sep 2025 – Mar 2026</span>
                                <div className="timeline-desc">
                                    <ul>
                                        <li>Developed responsive web layouts using HTML5, CSS3, JavaScript, and Tailwind CSS.</li>
                                        <li>Built and implemented modular, reusable UI components using React.js.</li>
                                        <li>Integrated components with backend RESTful APIs for real-time data flow.</li>
                                        <li>Debugged and optimized code to improve performance and overall user experience.</li>
                                        <li>Used Git and GitHub for structural version control and agile team collaboration.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 className="resume-subheading" data-aos="fade-right"><i className='bx bxs-graduation'></i> Education & Certifications</h3>
                    <div className="timeline" data-aos="fade-up" data-aos-delay="300">
                        <div className="timeline-item glass-card">
                            <div className="timeline-content">
                                <h3>MERN Stack Development Certification</h3>
                                <h4>GTEC Institute, Kannur</h4>
                                <span className="timeline-date">Sep 2025 – Mar 2026</span>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>Comprehensive hands-on training in React.js, Node.js, Express, MongoDB, and AWS cloud deployment.</p>
                            </div>
                        </div>
                        <div className="timeline-item glass-card">
                            <div className="timeline-content">
                                <h3>Bachelor of Arts (BA)</h3>
                                <h4>Kannur University</h4>
                                <span className="timeline-date">2021 – 2024</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="soft-skills-container" data-aos="fade-left" data-aos-delay="400">
                    <h3 className="resume-subheading"><i className='bx bx-star'></i> Soft Skills</h3>
                    <div className="soft-skills-grid">
                        <div className="soft-skill glass-card"><i className='bx bx-brain'></i> Analytical Problem Solving</div>
                        <div className="soft-skill glass-card"><i className='bx bx-code-curly'></i> Logic Building</div>
                        <div className="soft-skill glass-card"><i className='bx bx-group'></i> Team Collaboration</div>
                        <div className="soft-skill glass-card"><i className='bx bx-time-five'></i> Critical Task Prioritization</div>
                        <div className="soft-skill glass-card"><i className='bx bx-layer'></i> Clean Architecture</div>
                        <div className="soft-skill glass-card"><i className='bx bx-analyse'></i> Code Optimization</div>
                    </div>

                    <h3 className="resume-subheading" style={{ marginTop: '2.5rem' }}><i className='bx bx-globe'></i> Languages</h3>
                    <div className="soft-skills-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
                        <div className="soft-skill glass-card" style={{ justifyContent: 'center' }}>English</div>
                        <div className="soft-skill glass-card" style={{ justifyContent: 'center' }}>Malayalam</div>
                        <div className="soft-skill glass-card" style={{ justifyContent: 'center' }}>Hindi</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;
