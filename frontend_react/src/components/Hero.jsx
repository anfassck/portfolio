import React, { useEffect, useRef } from 'react';

const Hero = ({ profileData, userImageUrl, userResumeUrl }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const phrases = ["< CODE >", "// SYSTEM", "{ UI }", "{ UX }"];
        let floatingWords = [];
        const wordCount = 40;
        let animationFrameId;

        class FlyingWord {
            constructor() {
                this.reset();
            }
            reset() {
                this.text = phrases[Math.floor(Math.random() * phrases.length)];
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.z = Math.random() * 1.5 + 0.5;
                this.vx = (Math.random() - 0.5) * 0.8 * this.z;
                this.vy = (Math.random() - 0.5) * 0.8 * this.z;

                const colors = [
                    "rgba(14, 165, 233, 0.4)",
                    "rgba(139, 92, 246, 0.4)",
                    "rgba(16, 185, 129, 0.4)"
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < -100) this.x = width + 100;
                if (this.x > width + 100) this.x = -100;
                if (this.y < -50) this.y = height + 50;
                if (this.y > height + 50) this.y = -50;
            }
            draw() {
                ctx.font = `bold ${Math.floor(18 * this.z)}px 'Space Grotesk', sans-serif`;
                ctx.fillStyle = this.color;
                ctx.textAlign = "center";
                ctx.fillText(this.text, this.x, this.y);
            }
        }

        for (let i = 0; i < wordCount; i++) {
            floatingWords.push(new FlyingWord());
        }

        const animateWords = () => {
            ctx.fillStyle = "rgba(3, 7, 18, 1)";
            ctx.fillRect(0, 0, width, height);

            for (let i = 0; i < wordCount; i++) {
                floatingWords[i].update();
                floatingWords[i].draw();
            }
            animationFrameId = requestAnimationFrame(animateWords);
        };
        animateWords();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <header className="hero custom-hero">
            <canvas ref={canvasRef} id="matrixCanvas" className="bg-canvas" style={{ opacity: 0.15 }}></canvas>
            <div className="video-overlay" style={{ zIndex: 1 }}></div>

            <div className="hero-container" style={{ zIndex: 2 }}>
                <div className="hero-left" data-aos="fade-right" data-aos-duration="1200">
                    <h3 className="greeting" style={{ marginBottom: '1.5rem' }}>HELLO, WORLD. I AM</h3>
                    <h1 className="hero-title" style={{ marginBottom: '1.5rem' }}>{profileData?.name || 'MUHAMMED ANFAS CK'}</h1>
                    
                    <div className="typewriter-container" style={{ marginBottom: '3rem' }}>
                        <h2 className="hero-subtitle typing-effect">&gt; {profileData?.role1 || 'Software Engineer & MERN Stack Developer.'}</h2>
                        <h2 className="hero-subtitle typing-effect-delay">&gt; {profileData?.role2 || 'Designing the web, line by code.'}</h2>
                    </div>

                    <div className="hero-buttons" style={{ gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                        <a href="#projects" className="btn-glow">Explore Work</a>
                        {userResumeUrl && (
                            <a href={userResumeUrl} target="_blank" rel="noreferrer" className="btn-glow" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--text-main)' }}>
                                <i className='bx bx-file-blank' style={{ marginRight: '8px' }}></i> Download Resume
                            </a>
                        )}
                        <div className="social-icons" style={{ marginLeft: '1rem' }}>
                             <a href={profileData?.github || "https://github.com/anfassck"} target="_blank" rel="noreferrer"><i className='bx bxl-github'></i></a>
                             <a href={profileData?.instagram || "https://instagram.com/anfaaseeii"} target="_blank" rel="noreferrer"><i className='bx bxl-instagram'></i></a>
                             <a href={profileData?.facebook || "#"}><i className='bx bxl-facebook-circle'></i></a>
                             <a href={profileData?.email ? `mailto:${profileData.email}` : "#contact"}><i className='bx bx-envelope'></i></a>
                        </div>
                    </div>
                </div>
                
                <div className="hero-right" data-aos="fade-left" data-aos-duration="1200">
                    <div className="profile-container hero-image-wrapper">
                        <div className="decor-chev left-chev">&lt;</div>
                        <div className="decor-chev right-chev">&gt;</div>
                        <div className="hero-circle"></div>
                        <img src={userImageUrl || "/portfolio.png"} alt={profileData?.name || "Muhammed Anfas CK"} className="hero-person-img ceo-img-format" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Hero;
