import React from 'react';

const Experience = () => {
    return (
        <section id="experience" className="section">
            <h2 className="section-title" data-aos="fade-up"><span className="gradient-text">Experience & Education</span></h2>
            
            <div className="resume-grid">
                <div className="timeline-container">
                    <h3 className="resume-subheading" data-aos="fade-right"><i className='bx bx-briefcase'></i> Practical Exposure</h3>
                    <div className="timeline" data-aos="fade-up" data-aos-delay="200">
                        <div className="timeline-item glass-card">
                            <div className="timeline-content">
                                <h3>Web Developer</h3>
                                <h4>MERN Stack</h4>
                                <span className="timeline-date">1 Year Experience</span>
                                <div className="timeline-desc">
                                    <ul>
                                        <li>Developed responsive web pages using modern HTML, CSS, and JavaScript.</li>
                                        <li>Integrated frontend applications with backend REST APIs seamlessly.</li>
                                        <li>Optimized application performance and improved overall user experience.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 className="resume-subheading" data-aos="fade-right"><i className='bx bxs-graduation'></i> Education</h3>
                    <div className="timeline" data-aos="fade-up" data-aos-delay="300">
                        <div className="timeline-item glass-card">
                            <div className="timeline-content">
                                <h3>MERN Stack Course</h3>
                                <h4>GTEC Institute, Kannur</h4>
                                <span className="timeline-date">Aug 2025 - Mar 2026</span>
                            </div>
                        </div>
                        <div className="timeline-item glass-card">
                            <div className="timeline-content">
                                <h3>Bachelor of Arts (BA) History</h3>
                                <h4>Kannur University</h4>
                                <span className="timeline-date">2021 - 2024</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="soft-skills-container" data-aos="fade-left" data-aos-delay="400">
                    <h3 className="resume-subheading"><i className='bx bx-star'></i> Soft Skills</h3>
                    <div className="soft-skills-grid">
                        <div className="soft-skill glass-card"><i className='bx bx-brain'></i> Problem Solving</div>
                        <div className="soft-skill glass-card"><i className='bx bx-group'></i> Team Collaboration</div>
                        <div className="soft-skill glass-card"><i className='bx bx-time-five'></i> Time Management</div>
                        <div className="soft-skill glass-card"><i className='bx bx-message-square-detail'></i> Strong Communication</div>
                        <div className="soft-skill glass-card"><i className='bx bx-layer'></i> UI Design</div>
                        <div className="soft-skill glass-card"><i className='bx bx-analyse'></i> Critical Thinking</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;
