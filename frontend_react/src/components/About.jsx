import React, { useEffect, useRef } from 'react';

const About = () => {
    const counterSectionRef = useRef(null);

    useEffect(() => {
        const counters = document.querySelectorAll('.counter');
        const speed = 200;

        const runCounters = () => {
            counters.forEach(counter => {
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 40);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
        };

        const currentSection = counterSectionRef.current;
        if (currentSection) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    runCounters();
                    observer.disconnect();
                }
            }, { threshold: 0.5 });
            observer.observe(currentSection);
            
            return () => {
                if (currentSection) {
                    observer.unobserve(currentSection);
                }
            };
        }
    }, []);

    return (
        <section id="about" className="section">
            <h2 className="section-title" data-aos="fade-up" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.4 }}>
                <span className="gradient-text">Full Stack and MERN Stack Developer building scalable, user-focused web applications.</span>
            </h2>
            <div className="about-grid">
                <div className="about-text glass-card" data-aos="fade-up" data-aos-delay="200">
                    <p><strong>Entry-level MERN Stack Developer </strong> passionate about crafting responsive, scalable, and high-performance web applications. I specialize in turning complex ideas into elegant, user-centric solutions using modern technologies like <strong> React, Node.js, Express.js, and MongoDB.</strong><br/><br/>
                    With a strong foundation in both frontend and backend development, I focus on writing clean, maintainable code and delivering seamless user experiences. I’m particularly interested in building real-world applications, improving performance, and developing efficient APIs.</p>
                </div>
                <div className="about-stats" ref={counterSectionRef} id="counterSection">
                    <div className="stat-card glass-card stat-centered" data-aos="fade-left" data-aos-delay="300">
                        <i className='bx bx-briefcase'></i>
                        <h3 className="stat-num"><span className="counter" data-target="1">0</span>+</h3>
                        <p>Experience<br/>Year</p>
                    </div>
                    <div className="stat-card glass-card stat-centered" data-aos="fade-left" data-aos-delay="400">
                        <i className='bx bx-code-block'></i>
                        <h3 className="stat-num"><span className="counter" data-target="5">0</span>+</h3>
                        <p>Projects<br/>Completed</p>
                    </div>
                    <div className="stat-card glass-card stat-centered" data-aos="fade-left" data-aos-delay="500">
                        <i className='bx bx-tachometer'></i>
                        <h3 className="stat-num">A+</h3>
                        <p>Speed<br/>Optimization</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
