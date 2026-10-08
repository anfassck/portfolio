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
const gameCanvasWrapper = document.querySelector('.game-canvas-wrapper');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const restartGameBtn = document.getElementById('restartGameBtn');
const gameScoreVal = document.getElementById('gameScore');
const highScoreVal = document.getElementById('highScore');

let gamePlaying = false;
let gameAnimationFrameId = null;
let dinoScore = 0;
let dinoHighScore = parseInt(localStorage.getItem('dinoRunnerHighScore') || '0', 10);
if (highScoreVal) highScoreVal.textContent = dinoHighScore;

let ctxDino = dinoCanvas ? dinoCanvas.getContext('2d') : null;
let baseGameSpeed = 4.8;
let gameSpeed = 4.8;
let obstacleTimer = 0;
let obstacles = [];
let gameFrame = 0;
let groundOffset = 0;

// High Score Celebration (Padakkangal / Fireworks)
let hasCelebratedNewRecord = false;
let celebrationTextTimer = 0;
let fireworks = [];

const triggerFireworkBurst = (x, y) => {
    const festiveColors = ['#f59e0b', '#ef4444', '#10b981', '#38bdf8', '#ec4899', '#a855f7', '#fbbf24', '#ffffff'];
    for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5.5;
        fireworks.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.2,
            color: festiveColors[Math.floor(Math.random() * festiveColors.length)],
            alpha: 1,
            size: 2.5 + Math.random() * 3,
            decay: 0.015 + Math.random() * 0.02
        });
    }
};

// Atmosphere background elements
const skyStars = [
    { x: 50, y: 30, size: 2, speed: 0.3 },
    { x: 170, y: 55, size: 3, speed: 0.4 },
    { x: 290, y: 25, size: 2, speed: 0.25 },
    { x: 410, y: 65, size: 3, speed: 0.5 },
    { x: 540, y: 35, size: 2, speed: 0.35 }
];

// Dino coordinates
const groundY = 185;
const dinoHeight = 40;
const dinoWidth = 36;
const dinoGroundY = groundY - dinoHeight; // 145

let dino = {
    x: 55,
    y: dinoGroundY,
    width: dinoWidth,
    height: dinoHeight,
    vy: 0,
    gravity: 0.72,
    jumpStrength: -11.8,
    isGrounded: true
};

// Web Audio API Retro Sound Effects
let audioCtx = null;
const playRetroSound = (type) => {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const now = audioCtx.currentTime;

        if (type === 'jump') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(420, now);
            osc.frequency.exponentialRampToValueAtTime(840, now + 0.09);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.09);
            osc.start(now);
            osc.stop(now + 0.09);
        } else if (type === 'over') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(260, now);
            osc.frequency.linearRampToValueAtTime(90, now + 0.25);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        } else if (type === 'celebration') {
            // Rapid celebratory arpeggio / firecracker pop
            [523, 659, 784, 1046].forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'triangle';
                const t = now + idx * 0.07;
                osc.frequency.setValueAtTime(freq, t);
                gain.gain.setValueAtTime(0.15, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
                osc.start(t);
                osc.stop(t + 0.12);
            });
        }
    } catch (e) {
        // Fallback for environments with strict audio policy
    }
};

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

const stopDinoGame = () => {
    gamePlaying = false;
    if (gameAnimationFrameId) {
        cancelAnimationFrame(gameAnimationFrameId);
        gameAnimationFrameId = null;
    }
};

const initDinoGame = () => {
    stopDinoGame();

    if (!ctxDino && dinoCanvas) {
        ctxDino = dinoCanvas.getContext('2d');
    }

    dinoScore = 0;
    baseGameSpeed = 4.8;
    gameSpeed = 4.8;
    obstacles = [];
    obstacleTimer = 0;
    gameFrame = 0;
    groundOffset = 0;
    hasCelebratedNewRecord = false;
    celebrationTextTimer = 0;
    fireworks = [];

    dino.y = dinoGroundY;
    dino.vy = 0;
    dino.isGrounded = true;

    if (gameOverOverlay) gameOverOverlay.classList.remove('visible');
    if (gameScoreVal) gameScoreVal.textContent = '0';
    if (highScoreVal) highScoreVal.textContent = dinoHighScore;

    gamePlaying = true;
    dinoLoop();
};

// Universal Jump Handler (Works seamlessly on desktop & mobile)
const handleDinoJump = () => {
    if (!gameModal?.classList.contains('open')) return;

    if (!gamePlaying) {
        initDinoGame();
        return;
    }

    if (dino.isGrounded) {
        dino.vy = dino.jumpStrength;
        dino.isGrounded = false;
        playRetroSound('jump');
    }
};

// Keyboard triggers
window.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'ArrowUp' || e.code === 'Space') {
        if (gameModal && gameModal.classList.contains('open')) {
            e.preventDefault();
            handleDinoJump();
        }
    }
});

// Canvas & touch triggers for desktop and phone view
dinoCanvas?.addEventListener('click', (e) => {
    e.stopPropagation();
    handleDinoJump();
});

// Mobile touch: Tap anywhere in game container or canvas to jump/restart
const registerMobileTouch = (el) => {
    if (!el) return;
    el.addEventListener('touchstart', (e) => {
        if (e.target.closest('#closeGame') || e.target.closest('#restartGameBtn')) return;
        e.preventDefault();
        e.stopPropagation();
        handleDinoJump();
    }, { passive: false });
};

registerMobileTouch(dinoCanvas);
registerMobileTouch(gameCanvasWrapper);
registerMobileTouch(document.querySelector('.game-container'));

gameCanvasWrapper?.addEventListener('click', (e) => {
    if (e.target !== restartGameBtn && !e.target.closest('#closeGame')) {
        handleDinoJump();
    }
});

restartGameBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    initDinoGame();
});

// Draw custom cyber retro Dinosaur
const drawDino = (ctx, x, y, isAirborne, isDead, frame) => {
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = isDead ? '#ef4444' : '#0ea5e9';
    ctx.shadowColor = isDead ? '#ef4444' : '#38bdf8';
    ctx.shadowBlur = 8;

    // 1. Torso
    ctx.fillRect(4, 14, 22, 18);

    // 2. Neck & Head
    ctx.fillRect(16, 2, 16, 14);
    // Snout
    ctx.fillRect(26, 4, 10, 8);

    // 3. Eye
    ctx.fillStyle = isDead ? '#ffffff' : '#030712';
    ctx.shadowBlur = 0;
    if (isDead) {
        ctx.fillRect(22, 5, 4, 2);
        ctx.fillRect(23, 4, 2, 4);
    } else {
        ctx.fillRect(23, 5, 4, 4);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(25, 5, 2, 2);
    }

    ctx.fillStyle = isDead ? '#ef4444' : '#0ea5e9';

    // 4. Arms
    ctx.fillRect(24, 20, 6, 3);
    ctx.fillRect(27, 23, 3, 2);

    // 5. Tail
    ctx.fillRect(0, 18, 6, 8);
    ctx.fillRect(-4, 14, 6, 6);

    // 6. Spines
    ctx.fillRect(8, 10, 4, 4);
    ctx.fillRect(14, 10, 4, 4);

    // 7. Animated Legs
    const legPhase = Math.floor(frame / Math.max(3, 7 - Math.floor(gameSpeed * 0.4))) % 2;
    if (isAirborne) {
        ctx.fillRect(8, 32, 4, 5);
        ctx.fillRect(16, 32, 4, 5);
        ctx.fillRect(10, 36, 4, 2);
        ctx.fillRect(18, 36, 4, 2);
    } else if (legPhase === 0) {
        ctx.fillRect(8, 32, 4, 8);
        ctx.fillRect(8, 38, 6, 2);
        ctx.fillRect(18, 32, 4, 5);
        ctx.fillRect(18, 35, 4, 2);
    } else {
        ctx.fillRect(8, 32, 4, 5);
        ctx.fillRect(8, 35, 4, 2);
        ctx.fillRect(18, 32, 4, 8);
        ctx.fillRect(18, 38, 6, 2);
    }

    ctx.restore();
};

// Draw stylized cactus
const drawCactus = (ctx, obs) => {
    ctx.save();
    const x = obs.x;
    const y = groundY - obs.height;
    const w = obs.width;
    const h = obs.height;

    ctx.fillStyle = '#f43f5e';
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 8;

    const trunkW = Math.max(8, Math.round(w * 0.45));
    const trunkX = x + Math.round((w - trunkW) / 2);
    ctx.fillRect(trunkX, y, trunkW, h);

    if (h >= 30) {
        ctx.fillRect(trunkX - 6, y + Math.round(h * 0.3), 6, 4);
        ctx.fillRect(trunkX - 6, y + Math.round(h * 0.15), 4, Math.round(h * 0.2));
        ctx.fillRect(trunkX + trunkW, y + Math.round(h * 0.45), 6, 4);
        ctx.fillRect(trunkX + trunkW + 2, y + Math.round(h * 0.25), 4, Math.round(h * 0.25));
    }

    ctx.restore();
};

// Main Game Loop
const dinoLoop = () => {
    if (!gamePlaying || !ctxDino || !dinoCanvas) return;

    gameFrame++;

    // Dynamic Progressive Speed: Increases smoothly as time & score progress
    gameSpeed = baseGameSpeed + Math.min(7.2, (dinoScore / 40) * 0.3 + (gameFrame / 350) * 0.25);

    // Clear
    ctxDino.clearRect(0, 0, dinoCanvas.width, dinoCanvas.height);

    // Sky stars
    ctxDino.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let s of skyStars) {
        s.x -= s.speed;
        if (s.x < -10) s.x = dinoCanvas.width + 10;
        ctxDino.fillRect(s.x, s.y, s.size, s.size);
    }

    // Ground line
    groundOffset = (groundOffset + gameSpeed) % 40;
    ctxDino.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctxDino.lineWidth = 2;
    ctxDino.beginPath();
    ctxDino.moveTo(0, groundY);
    ctxDino.lineTo(dinoCanvas.width, groundY);
    ctxDino.stroke();

    // Moving ground dots
    ctxDino.fillStyle = 'rgba(14, 165, 233, 0.3)';
    for (let gx = -groundOffset; gx < dinoCanvas.width; gx += 30) {
        ctxDino.fillRect(gx, groundY + 5, 8, 2);
    }

    // Physics
    dino.vy += dino.gravity;
    dino.y += dino.vy;

    if (dino.y >= dinoGroundY) {
        dino.y = dinoGroundY;
        dino.vy = 0;
        dino.isGrounded = true;
    }

    // Draw Dino
    drawDino(ctxDino, dino.x, dino.y, !dino.isGrounded, false, gameFrame);

    // Spawn Obstacles (Spawn intervals automatically adjust to speed)
    obstacleTimer++;
    const minInterval = Math.max(38, Math.round(75 - (gameSpeed - 4.8) * 5));
    if (obstacleTimer > minInterval + Math.random() * 32) {
        const obsH = 28 + Math.floor(Math.random() * 22);
        const obsW = 20 + Math.floor(Math.random() * 10);
        obstacles.push({
            x: dinoCanvas.width + 10,
            width: obsW,
            height: obsH
        });
        obstacleTimer = 0;
    }

    // Draw Obstacles & Collision Check
    let collisionOccurred = false;
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= gameSpeed;

        drawCactus(ctxDino, obs);

        const hitPad = 6;
        if (
            dino.x + hitPad < obs.x + obs.width &&
            dino.x + dino.width - hitPad > obs.x &&
            dino.y + hitPad < groundY &&
            dino.y + dino.height - hitPad > groundY - obs.height
        ) {
            collisionOccurred = true;
        }

        if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
            dinoScore += 10;
            if (gameScoreVal) gameScoreVal.textContent = dinoScore;

            // Check if user beat High Score record! 🎉 (Celebration with Fireworks / Padakkangal)
            if (dinoHighScore > 0 && dinoScore > dinoHighScore && !hasCelebratedNewRecord) {
                hasCelebratedNewRecord = true;
                triggerFireworkBurst(180, 60);
                triggerFireworkBurst(320, 45);
                triggerFireworkBurst(460, 65);
                celebrationTextTimer = 110;
                playRetroSound('celebration');
            }
        }
    }

    // Render Fireworks & Confetti Celebration Particles (Padakkangal)
    for (let f = fireworks.length - 1; f >= 0; f--) {
        const p = fireworks[f];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // Gravity on sparks
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
            fireworks.splice(f, 1);
        } else {
            ctxDino.save();
            ctxDino.globalAlpha = p.alpha;
            ctxDino.fillStyle = p.color;
            ctxDino.shadowColor = p.color;
            ctxDino.shadowBlur = 6;
            ctxDino.beginPath();
            ctxDino.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctxDino.fill();
            ctxDino.restore();
        }
    }

    // High Score Banner Toast
    if (celebrationTextTimer > 0) {
        celebrationTextTimer--;
        ctxDino.save();
        ctxDino.fillStyle = '#f59e0b';
        ctxDino.shadowColor = '#f59e0b';
        ctxDino.shadowBlur = 12;
        ctxDino.font = 'bold 18px "Space Grotesk", sans-serif';
        ctxDino.textAlign = 'center';
        ctxDino.fillText('🎆 NEW RECORD BEATEN! 🎉', dinoCanvas.width / 2, 45);
        ctxDino.restore();

        // Extra spark bursts while celebrating
        if (celebrationTextTimer % 25 === 0) {
            triggerFireworkBurst(120 + Math.random() * 360, 40 + Math.random() * 40);
        }
    }

    // Game Over
    if (collisionOccurred) {
        gamePlaying = false;
        playRetroSound('over');

        ctxDino.clearRect(dino.x - 5, dino.y - 5, dino.width + 20, dino.height + 15);
        drawDino(ctxDino, dino.x, dino.y, false, true, gameFrame);

        if (gameOverOverlay) gameOverOverlay.classList.add('visible');

        if (dinoScore > dinoHighScore) {
            dinoHighScore = dinoScore;
            localStorage.setItem('dinoRunnerHighScore', dinoHighScore);
            if (highScoreVal) highScoreVal.textContent = dinoHighScore;
        }
        return;
    }

    gameAnimationFrameId = requestAnimationFrame(dinoLoop);
};

// --- Sticky Navbar Scroll Effect ---
const mainNav = document.getElementById('mainNavbar') || document.querySelector('.navbar');
if (mainNav) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    }, { passive: true });
}
