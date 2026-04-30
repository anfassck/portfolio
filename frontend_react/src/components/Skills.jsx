import React from 'react';

const Skills = () => {
    return (
        <section id="skills" className="section">
            <h2 className="section-title" data-aos="fade-up"><span className="gradient-text">My Toolkit</span></h2>
            <p className="section-subtitle" data-aos="fade-up">Mastering the technologies that power the modern web.</p>
            <div className="toolkit-grid">
                <div className="skill-card glass-card" data-aos="zoom-in" data-aos-delay="100">
                    <div className="skill-header">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" className="skill-dp" alt="Lang" />
                        <div style={{ flex: 1 }}>
                            <h3>Languages</h3><span className="skill-count">3 Technologies</span>
                        </div>
                    </div>
                    <div className="skill-tags">
                        <span>HTML5</span><span>CSS3</span><span>JavaScript (ES6+)</span>
                    </div>
                    <div className="skill-progress"><div className="progress-bar" style={{ width: '90%' }}><span>90% Proficiency</span></div></div>
                </div>
                
                <div className="skill-card glass-card" data-aos="zoom-in" data-aos-delay="200">
                    <div className="skill-header">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" className="skill-dp" alt="Front" />
                        <div style={{ flex: 1 }}>
                            <h3>Frontend</h3><span className="skill-count">4 Technologies</span>
                        </div>
                    </div>
                    <div className="skill-tags">
                        <span>React.js</span><span>React Native</span><span>Bootstrap</span><span>Tailwind CSS</span>
                    </div>
                    <div className="skill-progress"><div className="progress-bar" style={{ width: '95%' }}><span>95% Proficiency</span></div></div>
                </div>

                <div className="skill-card glass-card" data-aos="zoom-in" data-aos-delay="300">
                    <div className="skill-header">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" className="skill-dp" alt="Back" />
                        <div style={{ flex: 1 }}>
                            <h3>Backend</h3><span className="skill-count">2 Technologies</span>
                        </div>
                    </div>
                    <div className="skill-tags">
                        <span>Node.js</span><span>Express.js</span>
                    </div>
                    <div className="skill-progress"><div className="progress-bar" style={{ width: '85%' }}><span>85% Proficiency</span></div></div>
                </div>

                <div className="skill-card glass-card" data-aos="zoom-in" data-aos-delay="400">
                    <div className="skill-header">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" className="skill-dp" alt="DB" />
                        <div style={{ flex: 1 }}>
                            <h3>Databases</h3><span className="skill-count">2 Technologies</span>
                        </div>
                    </div>
                    <div className="skill-tags">
                        <span>MongoDB</span><span>MySQL</span>
                    </div>
                    <div className="skill-progress"><div className="progress-bar" style={{ width: '80%' }}><span>80% Proficiency</span></div></div>
                </div>

                <div className="skill-card glass-card" data-aos="zoom-in" data-aos-delay="500">
                    <div className="skill-header">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" className="skill-dp" alt="Tools" />
                        <div style={{ flex: 1 }}>
                            <h3>Tools</h3><span className="skill-count">6 Technologies</span>
                        </div>
                    </div>
                    <div className="skill-tags">
                        <span>Git</span><span>GitHub</span><span>VS Code</span><span>Postman</span><span>AWS</span><span>Docker</span>
                    </div>
                    <div className="skill-progress"><div className="progress-bar" style={{ width: '85%' }}><span>85% Proficiency</span></div></div>
                </div>

                <div className="skill-card glass-card" data-aos="zoom-in" data-aos-delay="600">
                    <div className="skill-header">
                        <img src="https://cdn-icons-png.flaticon.com/512/1005/1005141.png" className="skill-dp" alt="Concept" />
                        <div style={{ flex: 1 }}>
                            <h3>Concepts</h3><span className="skill-count">3 Technologies</span>
                        </div>
                    </div>
                    <div className="skill-tags">
                        <span>Responsive Design</span><span>REST APIs</span><span>DOM Manipulation</span>
                    </div>
                    <div className="skill-progress"><div className="progress-bar" style={{ width: '90%' }}><span>90% Proficiency</span></div></div>
                </div>
            </div>
        </section>
    );
};

export default Skills;
