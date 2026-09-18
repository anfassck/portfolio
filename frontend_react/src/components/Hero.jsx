import React, { useEffect, useRef } from 'react';

const Hero = ({ profileData, userImageUrl, userResumeUrl }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || typeof window.THREE === 'undefined') return;

        const THREE = window.THREE;
        const scene = new THREE.Scene();
        
        // Camera Setup (Perspective)
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 90;
        camera.position.y = 40;
        camera.rotation.x = -Math.PI / 6;

        // WebGL Renderer with transparent background to let CSS body gradients show through
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Dynamic glowing circular particle texture generated via HTML5 canvas
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 16;
        pCanvas.height = 16;
        const pCtx = pCanvas.getContext('2d');
        const grad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.3, 'rgba(14, 165, 233, 0.8)'); // Light blue glow
        grad.addColorStop(1, 'rgba(3, 7, 18, 0)');
        pCtx.fillStyle = grad;
        pCtx.fillRect(0, 0, 16, 16);
        const pTexture = new THREE.CanvasTexture(pCanvas);

        // Particle Configuration
        const particleCount = 1200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        // Color definitions
        const color1 = new THREE.Color('#0ea5e9'); // Cyan/Blue
        const color2 = new THREE.Color('#8b5cf6'); // Purple
        const color3 = new THREE.Color('#10b981'); // Accent Green

        const numRows = 30;
        const numCols = 40;
        const spacing = 5.5;
        let index = 0;
        
        const initialPositions = [];

        // Distribute particles in a waving 3D grid layout
        for (let r = 0; r < numRows; r++) {
            for (let c = 0; c < numCols; c++) {
                if (index >= particleCount) break;

                const x = (c - numCols / 2) * spacing;
                const z = (r - numRows / 2) * spacing;
                const y = 0;

                positions[index * 3] = x;
                positions[index * 3 + 1] = y;
                positions[index * 3 + 2] = z;

                initialPositions.push({ x, z, r, c });

                // Generate a color gradient transition across the grid
                const ratio = (r + c) / (numRows + numCols);
                const mixedColor = color1.clone().lerp(color2, ratio);
                
                // Randomly sprinkle green highlights
                if (Math.random() > 0.88) {
                    mixedColor.lerp(color3, 0.5);
                }

                colors[index * 3] = mixedColor.r;
                colors[index * 3 + 1] = mixedColor.g;
                colors[index * 3 + 2] = mixedColor.b;

                index++;
            }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Particle Point Material
        const material = new THREE.PointsMaterial({
            size: 3.0,
            map: pTexture,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // Mouse movement tracking for interactive parallax effect
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const handleMouseMove = (event) => {
            mouseX = (event.clientX / window.innerWidth) - 0.5;
            mouseY = (event.clientY / window.innerHeight) - 0.5;
        };
        window.addEventListener('mousemove', handleMouseMove);

        const clock = new THREE.Clock();
        let animationFrameId;

        // Render & Animation Loop
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();
            const positionsArray = geometry.attributes.position.array;

            // Perform wave equations to animate particle heights (y-axis)
            let idx = 0;
            for (let r = 0; r < numRows; r++) {
                for (let c = 0; c < numCols; c++) {
                    if (idx >= particleCount) break;

                    const pos = initialPositions[idx];
                    
                    // Double-harmonic sine wave calculations for organic fluid flow
                    const wave1 = Math.sin(pos.x * 0.06 + elapsedTime * 1.4) * 5.5;
                    const wave2 = Math.cos(pos.z * 0.06 + elapsedTime * 1.0) * 5.5;
                    
                    positionsArray[idx * 3 + 1] = wave1 + wave2;
                    idx++;
                }
            }
            geometry.attributes.position.needsUpdate = true;

            // Smoothly interpolate (lerp) particle orientation to create mouse tracking parallax
            targetX = mouseX * 22;
            targetY = -mouseY * 18;

            points.rotation.y += (targetX - points.rotation.y) * 0.035;
            points.rotation.x += ((targetY * 0.01) - points.rotation.x) * 0.035;

            renderer.render(scene, camera);
        };
        animate();

        // Window Resize Handler
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // React Component Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            
            // Dispose Three.js objects to prevent memory leaks
            geometry.dispose();
            material.dispose();
            pTexture.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <header className="hero custom-hero">
            <canvas ref={canvasRef} id="matrixCanvas" className="bg-canvas" style={{ opacity: 0.15 }}></canvas>
            <div className="video-overlay" style={{ zIndex: 1 }}></div>

            <div className="hero-container" style={{ zIndex: 2 }}>
                <div className="hero-left" data-aos="fade-right" data-aos-duration="1200">
                    <div className="hero-left-card">
                        <h3 className="greeting" style={{ marginBottom: '1.5rem' }}>HELLO, WORLD. I AM</h3>
                        <h1 className="hero-title" style={{ marginBottom: '1.5rem' }}>{profileData?.name || 'MUHAMMED ANFAS CK'}</h1>
                        
                        <div className="typewriter-container" style={{ marginBottom: '3rem' }}>
                            <h2 className="hero-subtitle typing-effect">&gt; {profileData?.role1 || 'Software Engineer & MERN Stack Developer.'}</h2>
                            <h2 className="hero-subtitle typing-effect-delay">&gt; {profileData?.role2 || 'Designing the web, line by code.'}</h2>
                        </div>

                        <div className="hero-buttons" style={{ gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                            <a href="#projects" className="btn-glow" data-cursor="EXPLORE">Explore Work</a>
                            {userResumeUrl && (
                                <a href={userResumeUrl} target="_blank" rel="noreferrer" className="btn-glow" data-cursor="EXPLORE" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--text-main)' }}>
                                    <i className='bx bx-file-blank' style={{ marginRight: '8px' }}></i> Download Resume
                                </a>
                            )}
                            <div className="social-icons" style={{ marginLeft: '1rem' }}>
                                 <a href={profileData?.github || "https://github.com/anfassck"} target="_blank" rel="noreferrer"><i className='bx bxl-github'></i></a>
                                 <a href={profileData?.instagram || "https://instagram.com/zantrix_code"} target="_blank" rel="noreferrer"><i className='bx bxl-instagram'></i></a>
                                 <a href={profileData?.facebook || "#"}><i className='bx bxl-facebook-circle'></i></a>
                                 <a href={profileData?.email ? `mailto:${profileData.email}` : "#contact"}><i className='bx bx-envelope'></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="hero-right" data-aos="fade-left" data-aos-duration="1200">
                    <div className="profile-container hero-image-wrapper" data-cursor="ROTATE">
                        <div className="decor-chev left-chev">&lt;</div>
                        <div className="decor-chev right-chev">&gt;</div>
                        <div className="hero-circle"></div>
                        <img 
                            src={userImageUrl || "/anfas_studio_dark.jpg"} 
                            alt={profileData?.name || "Muhammed Anfas CK"} 
                            className="hero-person-img ceo-img-format" 
                            style={{ opacity: 1 }}
                        />
                        
                        {/* Orbiting Tech Icons */}
                        <div className="orbiting-container">
                            <div className="orbiting-icon icon-react" title="React" onClick={(e) => { e.stopPropagation(); document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }); }}><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" /></div>
                            <div className="orbiting-icon icon-node" title="Node.js" onClick={(e) => { e.stopPropagation(); document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }); }}><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" /></div>
                            <div className="orbiting-icon icon-mongo" title="MongoDB" onClick={(e) => { e.stopPropagation(); document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }); }}><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" /></div>
                            <div className="orbiting-icon icon-aws" title="AWS" onClick={(e) => { e.stopPropagation(); document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }); }}><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" alt="AWS" /></div>
                            <div className="orbiting-icon icon-docker" title="Docker" onClick={(e) => { e.stopPropagation(); document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }); }}><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" /></div>
                            <div className="orbiting-icon icon-git" title="Git" onClick={(e) => { e.stopPropagation(); document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }); }}><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git" /></div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Hero;
