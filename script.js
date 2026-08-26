// --- Three.js 3D Interactive Particle Background ---
const canvas = document.getElementById('matrixCanvas');
if (canvas && typeof THREE !== 'undefined') {
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

    window.addEventListener('mousemove', (event) => {
        // Normalize mouse coordinates from -0.5 to 0.5
        mouseX = (event.clientX / window.innerWidth) - 0.5;
        mouseY = (event.clientY / window.innerHeight) - 0.5;
    });

    const clock = new THREE.Clock();

    // Render & Animation Loop
    function animate() {
        requestAnimationFrame(animate);

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
    }
    animate();

    // Window Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}



// --- Number Counter Animation ---
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
}

// Trigger counter when visible
const counterSection = document.getElementById('counterSection');
if (counterSection) {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            runCounters();
            observer.disconnect();
        }
    }, { threshold: 0.5 });
    observer.observe(counterSection);
}



// --- Contact Form Submission Connected to Backend ---
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const status = document.getElementById('formStatus');

        status.style.display = 'block';
        status.textContent = 'Sending inquiry...';
        status.style.color = '#f8fafc';

        try {
            const apiBase = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:8000'
                : 'https://portfolioapi.anfassck.online';

            const response = await fetch(`${apiBase}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, message })
            });

            const data = await response.json();

            if (data.success) {
                status.textContent = 'Awesome! Message sent successfully ✅ We will contact you shortly. Thank you!';
                status.style.color = '#10b981'; 
                contactForm.reset();
            } else {
                status.textContent = 'Error: ' + (data.error || 'Failed to send.');
                status.style.color = '#ef4444';
            }
        } catch (error) {
            status.textContent = 'Server connection failed. Is your backend running?';
            status.style.color = '#ef4444'; 
        }
    });
}



// --- Premium 3D Hover Tilt Effect ---
const interactiveCards = document.querySelectorAll('.project-card, .skill-card, .profile-container');

interactiveCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        
        // Find cursor coordinate relative to the card dimensions
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Normalize cursor position to range [-1, 1]
        const normX = (x / rect.width) * 2 - 1;
        const normY = (y / rect.height) * 2 - 1;

        // Rotation intensity limits (degrees)
        const maxRotation = card.classList.contains('profile-container') ? 8 : 6;
        const rotX = -normY * maxRotation;
        const rotY = normX * maxRotation;

        // 3D Translation heights (lifting the card up)
        const lift = card.classList.contains('profile-container') ? 0 : -8; 

        // Set the perspective transform dynamic styling
        card.style.transform = `perspective(1000px) translateY(${lift}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        card.style.transition = 'transform 0.08s ease-out'; // Fast tracking for fluid responsiveness
    });

    card.addEventListener('mouseleave', () => {
        // Return back to original resting orientation smoothly
        card.style.transform = 'perspective(1000px) translateY(0) rotateX(0) rotateY(0)';
        card.style.transition = 'transform 0.4s ease-out, border-color 0.3s, box-shadow 0.3s';
    });
});


// --- Apple Spotlight Mouse Tracking ---
document.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
});

// --- Orbiting Tech Icons Clicks ---
const orbitingIcons = document.querySelectorAll('.orbiting-icon');
orbitingIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent opening image modal
        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            skillsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// --- Command Palette (Ctrl + K) Logic ---
const palette = document.getElementById('commandPalette');
const searchInput = document.getElementById('paletteSearch');
const options = document.querySelectorAll('.palette-option');

const openPalette = () => {
    if (palette) {
        palette.classList.add('open');
        setTimeout(() => searchInput && searchInput.focus(), 100);
    }
};

const closePalette = () => {
    if (palette) {
        palette.classList.remove('open');
        if (searchInput) searchInput.value = '';
        options.forEach(opt => opt.style.display = 'flex');
    }
};

// Keyboard triggers
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (palette && palette.classList.contains('open')) {
            closePalette();
        } else {
            openPalette();
        }
    }
    if (e.key === 'Escape') {
        closePalette();
    }
    
    // Quick keys (1-5, R) when palette is open
    if (palette && palette.classList.contains('open') && !e.ctrlKey && !e.metaKey) {
        if (e.key === '1') {
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            closePalette();
        } else if (e.key === '2') {
            document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
            closePalette();
        } else if (e.key === '3') {
            document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
            closePalette();
        } else if (e.key === '4') {
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            closePalette();
        } else if (e.key === '5') {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            closePalette();
        } else if (e.key.toLowerCase() === 'r') {
            window.open('https://portfolioapi.anfassck.online/api/profile', '_blank');
            closePalette();
        }
    }
});

// Click outside to close
palette?.addEventListener('click', (e) => {
    if (e.target === palette) {
        closePalette();
    }
});

// Options clicking
options.forEach(option => {
    option.addEventListener('click', () => {
        const action = option.getAttribute('data-action');
        if (action === 'scroll-about') {
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'scroll-skills') {
            document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'scroll-experience') {
            document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'scroll-projects') {
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'scroll-contact') {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'download-resume') {
            window.open('https://portfolioapi.anfassck.online/api/profile', '_blank');
        }
        closePalette();
    });
});

// Search filtering
searchInput?.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase().trim();
    options.forEach(opt => {
        const txt = opt.textContent.toLowerCase();
        if (txt.includes(val)) {
            opt.style.display = 'flex';
        } else {
            opt.style.display = 'none';
        }
    });
});


// --- Floating AI Chatbot Assistant Logic ---
const chatBubbleBtn = document.getElementById('chatBubbleBtn');
const chatWindow = document.getElementById('chatWindow');
const closeChat = document.getElementById('closeChat');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');
const chatMessages = document.getElementById('chatMessages');
const quickReplies = document.querySelectorAll('.quick-reply-btn');

// Toggle chatbox window
chatBubbleBtn?.addEventListener('click', () => {
    chatWindow?.classList.toggle('open');
});
closeChat?.addEventListener('click', () => {
    chatWindow?.classList.remove('open');
});

// Send message logic
const appendMessage = (text, sender) => {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${sender}`;
    msg.textContent = text;
    chatMessages?.appendChild(msg);
    if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
};

const handleChatBotReply = (query) => {
    const q = query.toLowerCase().trim();
    let reply = "I didn't quite catch that. You can ask me about Anfas's 'projects', 'skills', his contact details, or type 'resume' to download his CV!";

    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
        reply = "Hello! Hope you're doing well. Ask me about Anfas's MERN stack experience, his portfolio projects, or how to contact him!";
    } else if (q.includes('project') || q.includes('work') || q.includes('portfolio')) {
        reply = "Anfas has built several premium web applications, including a MERN-stack Hospital Management System (hospital.anfassck.online) and a Food Delivery App featuring Redux & JWT (food.anfassck.online).";
    } else if (q.includes('react') || q.includes('node') || q.includes('skills') || q.includes('mongo') || q.includes('toolkit')) {
        reply = "Anfas's technical toolkit includes React, Node.js, Express.js, MongoDB, React Native, Bootstrap, Tailwind CSS, AWS, Docker, Git, and REST APIs.";
    } else if (q.includes('resume') || q.includes('cv') || q.includes('download')) {
        reply = "You can download Anfas's resume from his live portal. Type 'contact' if you want his email/phone to request it directly!";
    } else if (q.includes('contact') || q.includes('phone') || q.includes('email') || q.includes('call') || q.includes('social')) {
        reply = "You can reach Anfas via Email: muhammedanfasck07@gmail.com, Phone: +91 8301005996, or visit his GitHub (github.com/anfassck).";
    } else if (q.includes('pixora')) {
        reply = "Pixora is Anfas's latest real-time social networking application featuring post uploads, instant messaging via socket connection, explore page, and a admin dashboard panel.";
    } else if (q.includes('aws') || q.includes('deploy')) {
        reply = "Anfas deploys his projects on AWS EC2 instances, managing configurations via reverse proxies like Nginx and Caddy with automatic SSL certificates.";
    }

    setTimeout(() => appendMessage(reply, 'bot'), 400);
};

const submitMessage = () => {
    const val = chatInput?.value;
    if (!val || val.trim() === '') return;
    appendMessage(val, 'user');
    if (chatInput) chatInput.value = '';
    handleChatBotReply(val);
};

sendChatBtn?.addEventListener('click', submitMessage);
chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitMessage();
});

// Quick reply buttons
quickReplies.forEach(btn => {
    btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        if (query) {
            appendMessage(query, 'user');
            handleChatBotReply(query);
        }
    });
});


// --- Custom 3D Liquid Cursor Inertia Loop ---
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

// Listen to mouse moving to position cursor dot instantly
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    }
});

// Linear interpolation loop for ring inertia
const animateCursor = () => {
    const ease = 0.16; // Lerp factor
    ringX += (mouseX - ringX) * ease;
    ringY += (mouseY - ringY) * ease;
    
    if (cursorRing) {
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
    }
    
    requestAnimationFrame(animateCursor);
};
animateCursor();

// Mouse hovers logic for scaling custom ring with text content
document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-cursor]');
    if (target && cursorRing) {
        const text = target.getAttribute('data-cursor');
        cursorRing.setAttribute('data-text', text);
        cursorRing.classList.add('hover-active');
        if (cursorDot) cursorDot.style.opacity = '0';
    }
});

document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('[data-cursor]');
    if (!target && cursorRing) {
        cursorRing.classList.remove('hover-active');
        cursorRing.removeAttribute('data-text');
        if (cursorDot) cursorDot.style.opacity = '1';
    }
});


// --- Chrome Dino Runner Easter Egg Game ---
const gameModal = document.getElementById('gameModal');
const gameBubbleBtn = document.getElementById('gameBubbleBtn');
const closeGame = document.getElementById('closeGame');
const dinoCanvas = document.getElementById('dinoCanvas');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const restartGameBtn = document.getElementById('restartGameBtn');
const gameScoreVal = document.getElementById('gameScore');
const highScoreVal = document.getElementById('highScore');

// Open/Close Game Modal
gameBubbleBtn?.addEventListener('click', () => {
    gameModal?.classList.add('open');
    initDinoGame();
});

closeGame?.addEventListener('click', () => {
    gameModal?.classList.remove('open');
    stopDinoGame();
});

gameModal?.addEventListener('click', (e) => {
    if (e.target === gameModal) {
        gameModal.classList.remove('open');
        stopDinoGame();
    }
});

let gamePlaying = false;
let gameAnimationFrameId = null;
let dinoScore = 0;
let dinoHighScore = 0;

// Game physics loop variables
let ctxDino = dinoCanvas ? dinoCanvas.getContext('2d') : null;
let dino = { x: 50, y: 150, width: 30, height: 35, vy: 0, gravity: 0.65, jumpStrength: -10.5, isGrounded: true };
let obstacles = [];
let obstacleTimer = 0;
let gameSpeed = 4.5;

const initDinoGame = () => {
    dinoScore = 0;
    gameSpeed = 4.5;
    obstacles = [];
    obstacleTimer = 0;
    dino.y = 150;
    dino.vy = 0;
    dino.isGrounded = true;
    gamePlaying = true;
    if (gameOverOverlay) gameOverOverlay.classList.remove('visible');
    if (gameScoreVal) gameScoreVal.textContent = '0';
    
    // Start game animate loop
    stopDinoGame(); // Clean up duplicate instances
    dinoLoop();
};

const stopDinoGame = () => {
    gamePlaying = false;
    if (gameAnimationFrameId) {
        cancelAnimationFrame(gameAnimationFrameId);
        gameAnimationFrameId = null;
    }
};

// Jump triggers
const handleDinoJump = () => {
    if (dino.isGrounded && gamePlaying) {
        dino.vy = dino.jumpStrength;
        dino.isGrounded = false;
    }
};

window.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'ArrowUp') {
        if (gameModal && gameModal.classList.contains('open')) {
            e.preventDefault(); // Stop spacebar scrolling the page
            handleDinoJump();
        }
    }
});

dinoCanvas?.addEventListener('click', handleDinoJump);
dinoCanvas?.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleDinoJump();
});

restartGameBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    initDinoGame();
});

const dinoLoop = () => {
    if (!gamePlaying || !ctxDino) return;
    
    // Clear canvas
    ctxDino.clearRect(0, 0, dinoCanvas.width, dinoCanvas.height);
    
    // Draw ground line
    ctxDino.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctxDino.lineWidth = 2;
    ctxDino.beginPath();
    ctxDino.moveTo(0, 185);
    ctxDino.lineTo(dinoCanvas.width, 185);
    ctxDino.stroke();
    
    // Update Dino position
    dino.vy += dino.gravity;
    dino.y += dino.vy;
    
    // Ground collision
    if (dino.y >= 150) {
        dino.y = 150;
        dino.vy = 0;
        dino.isGrounded = true;
    }
    
    // Draw Dino (as a glowing retro triangle/square)
    ctxDino.fillStyle = '#0ea5e9'; // Cyan glow
    ctxDino.shadowColor = '#0ea5e9';
    ctxDino.shadowBlur = 10;
    ctxDino.fillRect(dino.x, dino.y, dino.width, dino.height);
    
    // Reset shadow blur for other items to optimize performance
    ctxDino.shadowBlur = 0;
    
    // Spawn Obstacles (Cacti)
    obstacleTimer++;
    if (obstacleTimer > 85 + Math.random() * 40) {
        obstacles.push({
            x: dinoCanvas.width,
            y: 155,
            width: 15 + Math.random() * 15,
            height: 30 + Math.random() * 15
        });
        obstacleTimer = 0;
    }
    
    // Update and draw obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= gameSpeed;
        
        // Draw Cacti (as red/orange warning rectangles)
        ctxDino.fillStyle = '#f43f5e'; // Rose pink
        ctxDino.fillRect(obs.x, 185 - obs.height, obs.width, obs.height);
        
        // Collision detection
        if (
            dino.x < obs.x + obs.width &&
            dino.x + dino.width > obs.x &&
            dino.y < 185 &&
            dino.y + dino.height > 185 - obs.height
        ) {
            // Collision occurred! Game Over!
            gamePlaying = false;
            if (gameOverOverlay) gameOverOverlay.classList.add('visible');
            if (dinoScore > dinoHighScore) {
                dinoHighScore = dinoScore;
                if (highScoreVal) highScoreVal.textContent = dinoHighScore;
            }
            return; // Exit loop
        }
        
        // Remove off-screen obstacles
        if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
            dinoScore += 10;
            if (gameScoreVal) gameScoreVal.textContent = dinoScore;
            
            // Speed up slightly as score goes up
            if (dinoScore % 100 === 0) {
                gameSpeed += 0.5;
            }
        }
    }
    
    gameAnimationFrameId = requestAnimationFrame(dinoLoop);
};


