import React, { useEffect, useState, useRef, useCallback } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [profileData, setProfileData] = useState(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [paletteSearch, setPaletteSearch] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInputVal, setChatInputVal] = useState('');
  const [chatHistory, setChatHistory] = useState([
      { text: "Hi! I am Anfas's AI Portfolio Assistant. Ask me anything about Anfas, his MERN stack projects, or download his resume!", sender: 'bot' }
  ]);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameHighScore, setGameHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const canvasRef = useRef(null);
  const chatEndRef = useRef(null); // auto-scroll anchor
  const gameStateRef = useRef({ playing: false, animId: null });
  const dinoRef = useRef({ x: 50, y: 150, width: 30, height: 35, vy: 0, isGrounded: true });
  const obstaclesRef = useRef([]);
  const obstacleTimerRef = useRef(0);
  const gameSpeedRef = useRef(4.5);
  const scoreRef = useRef(0);
  const highScoreRef = useRef(0);

  const API_BASE = 'https://portfolioapi.anfassck.online';

  const userImageUrl = profileData?.imageUrl 
      ? (profileData.imageUrl.startsWith('http') ? profileData.imageUrl : `${API_BASE}${profileData.imageUrl}`) 
      : null;

  const userResumeUrl = profileData?.resumeUrl 
      ? (profileData.resumeUrl.startsWith('http') ? profileData.resumeUrl : `${API_BASE}${profileData.resumeUrl}`) 
      : null;

  useEffect(() => {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    const fetchProfile = async () => {
        try {
            const apiUrl = `${API_BASE}/api/profile`;
            const res = await fetch(apiUrl);
            const data = await res.json();
            if (data.success && data.data) {
                setProfileData(data.data);
            }
        } catch (err) {
            console.error('Failed to load profile details:', err);
        }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    // --- Apple Spotlight Mouse Tracking ---
    const handleSpotlight = (e) => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    document.addEventListener('mousemove', handleSpotlight);

    // --- Custom Liquid Cursor Inertia Loop ---
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let animationFrameId;

    const handleCursorMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    };
    document.addEventListener('mousemove', handleCursorMove);

    const animateCursor = () => {
        const ease = 0.16; // Lerp factor
        ringX += (mouseX - ringX) * ease;
        ringY += (mouseY - ringY) * ease;
        
        if (cursorRing) {
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
        }
        
        animationFrameId = requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const handleMouseOver = (e) => {
        const target = e.target.closest('[data-cursor]');
        if (target && cursorRing) {
            const text = target.getAttribute('data-cursor');
            cursorRing.setAttribute('data-text', text);
            cursorRing.classList.add('hover-active');
            if (cursorDot) cursorDot.style.opacity = '0';
        }
    };

    const handleMouseOutHover = (e) => {
        const target = e.target.closest('[data-cursor]');
        if (!target && cursorRing) {
            cursorRing.classList.remove('hover-active');
            cursorRing.removeAttribute('data-text');
            if (cursorDot) cursorDot.style.opacity = '1';
        }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOutHover);

    // --- Premium 3D Card Tilt Hover Effect via Event Delegation ---
    const handleMouseMove = (e) => {
        const card = e.target.closest('.project-card, .skill-card, .profile-container');
        if (!card) return;

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
    };

    const handleMouseOut = (e) => {
        const card = e.target.closest('.project-card, .skill-card, .profile-container');
        if (!card) return;
        
        // Only reset if mouse has completely exited the card boundaries
        if (!card.contains(e.relatedTarget)) {
            card.style.transform = 'perspective(1000px) translateY(0) rotateX(0) rotateY(0)';
            card.style.transition = 'transform 0.4s ease-out, border-color 0.3s, box-shadow 0.3s';
        }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
        document.removeEventListener('mousemove', handleSpotlight);
        document.removeEventListener('mousemove', handleCursorMove);
        document.removeEventListener('mouseover', handleMouseOver);
        document.removeEventListener('mouseout', handleMouseOutHover);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseout', handleMouseOut);
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Keyboard events for Command Palette
  useEffect(() => {
    const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            setIsPaletteOpen(prev => !prev);
        }
        if (e.key === 'Escape') {
            setIsPaletteOpen(false);
        }
        
        // Quick keys when open
        if (isPaletteOpen && !e.ctrlKey && !e.metaKey) {
            if (e.key === '1') {
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                setIsPaletteOpen(false);
            } else if (e.key === '2') {
                document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
                setIsPaletteOpen(false);
            } else if (e.key === '3') {
                document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
                setIsPaletteOpen(false);
            } else if (e.key === '4') {
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                setIsPaletteOpen(false);
            } else if (e.key === '5') {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                setIsPaletteOpen(false);
            } else if (e.key.toLowerCase() === 'r') {
                if (userResumeUrl) window.open(userResumeUrl, '_blank');
                setIsPaletteOpen(false);
            }
        }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPaletteOpen, userResumeUrl]);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  // Web Audio API Retro Sound Effects for React
  const playRetroAudio = (type) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      if (type === 'jump') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(840, now + 0.09);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'over') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.linearRampToValueAtTime(90, now + 0.25);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'celebration') {
        [523, 659, 784, 1046].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'triangle';
          const t = now + idx * 0.07;
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.15, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
          osc.start(t);
          osc.stop(t + 0.12);
        });
      }
    } catch (e) {}
  };

  // Dino Runner Game Loop with Dynamic Progressive Speed & Padakkangal / Fireworks Celebration
  useEffect(() => {
    if (!isGameOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 600;
    canvas.height = 200;
    const groundY = 185;
    const dinoGroundY = 145;
    const ctx = canvas.getContext('2d');

    dinoRef.current = { x: 55, y: dinoGroundY, width: 36, height: 40, vy: 0, isGrounded: true };
    obstaclesRef.current = [];
    obstacleTimerRef.current = 0;
    gameSpeedRef.current = 4.8;
    gameStateRef.current.playing = true;
    let gameFrame = 0;
    let groundOffset = 0;
    let hasCelebrated = false;
    let celebTimer = 0;
    let fireworksList = [];

    const triggerBurst = (bx, by) => {
      const colors = ['#f59e0b', '#ef4444', '#10b981', '#38bdf8', '#ec4899', '#a855f7', '#fbbf24', '#ffffff'];
      for (let i = 0; i < 40; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 2 + Math.random() * 5.5;
        fireworksList.push({
          x: bx,
          y: by,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 1.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          size: 2.5 + Math.random() * 3,
          decay: 0.015 + Math.random() * 0.02
        });
      }
    };

    const skyStars = [
      { x: 50, y: 30, size: 2, speed: 0.3 },
      { x: 170, y: 55, size: 3, speed: 0.4 },
      { x: 290, y: 25, size: 2, speed: 0.25 },
      { x: 410, y: 65, size: 3, speed: 0.5 },
      { x: 540, y: 35, size: 2, speed: 0.35 }
    ];

    const drawDinoChar = (cx, x, y, isAirborne, isDead, frame) => {
      cx.save();
      cx.translate(x, y);
      cx.fillStyle = isDead ? '#ef4444' : '#0ea5e9';
      cx.shadowColor = isDead ? '#ef4444' : '#38bdf8';
      cx.shadowBlur = 8;
      cx.fillRect(4, 14, 22, 18);
      cx.fillRect(16, 2, 16, 14);
      cx.fillRect(26, 4, 10, 8);
      cx.fillStyle = isDead ? '#ffffff' : '#030712';
      cx.shadowBlur = 0;
      if (isDead) {
        cx.fillRect(22, 5, 4, 2);
        cx.fillRect(23, 4, 2, 4);
      } else {
        cx.fillRect(23, 5, 4, 4);
        cx.fillStyle = '#ffffff';
        cx.fillRect(25, 5, 2, 2);
      }
      cx.fillStyle = isDead ? '#ef4444' : '#0ea5e9';
      cx.fillRect(24, 20, 6, 3);
      cx.fillRect(27, 23, 3, 2);
      cx.fillRect(0, 18, 6, 8);
      cx.fillRect(-4, 14, 6, 6);
      cx.fillRect(8, 10, 4, 4);
      cx.fillRect(14, 10, 4, 4);
      const legPhase = Math.floor(frame / Math.max(3, 7 - Math.floor(gameSpeedRef.current * 0.4))) % 2;
      if (isAirborne) {
        cx.fillRect(8, 32, 4, 5);
        cx.fillRect(16, 32, 4, 5);
        cx.fillRect(10, 36, 4, 2);
        cx.fillRect(18, 36, 4, 2);
      } else if (legPhase === 0) {
        cx.fillRect(8, 32, 4, 8);
        cx.fillRect(8, 38, 6, 2);
        cx.fillRect(18, 32, 4, 5);
        cx.fillRect(18, 35, 4, 2);
      } else {
        cx.fillRect(8, 32, 4, 5);
        cx.fillRect(8, 35, 4, 2);
        cx.fillRect(18, 32, 4, 8);
        cx.fillRect(18, 38, 6, 2);
      }
      cx.restore();
    };

    const drawCactusObs = (cx, obs) => {
      cx.save();
      const x = obs.x;
      const y = groundY - obs.height;
      const w = obs.width;
      const h = obs.height;
      cx.fillStyle = '#f43f5e';
      cx.shadowColor = '#f43f5e';
      cx.shadowBlur = 8;
      const trunkW = Math.max(8, Math.round(w * 0.45));
      const trunkX = x + Math.round((w - trunkW) / 2);
      cx.fillRect(trunkX, y, trunkW, h);
      if (h >= 30) {
        cx.fillRect(trunkX - 6, y + Math.round(h * 0.3), 6, 4);
        cx.fillRect(trunkX - 6, y + Math.round(h * 0.15), 4, Math.round(h * 0.2));
        cx.fillRect(trunkX + trunkW, y + Math.round(h * 0.45), 6, 4);
        cx.fillRect(trunkX + trunkW + 2, y + Math.round(h * 0.25), 4, Math.round(h * 0.25));
      }
      cx.restore();
    };

    const loop = () => {
      if (!gameStateRef.current.playing) return;
      gameFrame++;

      // Progressive speed increase as you play!
      gameSpeedRef.current = 4.8 + Math.min(7.2, (scoreRef.current / 40) * 0.3 + (gameFrame / 350) * 0.25);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let s of skyStars) {
        s.x -= s.speed;
        if (s.x < -10) s.x = canvas.width + 10;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      }

      // Ground
      groundOffset = (groundOffset + gameSpeedRef.current) % 40;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(canvas.width, groundY);
      ctx.stroke();

      ctx.fillStyle = 'rgba(14, 165, 233, 0.3)';
      for (let gx = -groundOffset; gx < canvas.width; gx += 30) {
        ctx.fillRect(gx, groundY + 5, 8, 2);
      }

      // Physics
      const dino = dinoRef.current;
      dino.vy += 0.72;
      dino.y += dino.vy;

      if (dino.y >= dinoGroundY) {
        dino.y = dinoGroundY;
        dino.vy = 0;
        dino.isGrounded = true;
      }

      // Draw Dino
      drawDinoChar(ctx, dino.x, dino.y, !dino.isGrounded, false, gameFrame);

      // Spawn Obstacles with dynamic interval
      obstacleTimerRef.current++;
      const minInterval = Math.max(38, Math.round(75 - (gameSpeedRef.current - 4.8) * 5));
      if (obstacleTimerRef.current > minInterval + Math.random() * 32) {
        obstaclesRef.current.push({
          x: canvas.width + 10,
          width: 20 + Math.floor(Math.random() * 10),
          height: 28 + Math.floor(Math.random() * 22)
        });
        obstacleTimerRef.current = 0;
      }

      // Update & Draw Obstacles
      let collided = false;
      obstaclesRef.current = obstaclesRef.current.filter(obs => {
        obs.x -= gameSpeedRef.current;
        drawCactusObs(ctx, obs);

        const hitPad = 6;
        if (
          dino.x + hitPad < obs.x + obs.width &&
          dino.x + dino.width - hitPad > obs.x &&
          dino.y + hitPad < groundY &&
          dino.y + dino.height - hitPad > groundY - obs.height
        ) {
          collided = true;
        }

        if (obs.x + obs.width < 0) {
          scoreRef.current += 10;
          setGameScore(scoreRef.current);

          // Padakkangal Fireworks Celebration when High Score is beaten!
          if (highScoreRef.current > 0 && scoreRef.current > highScoreRef.current && !hasCelebrated) {
            hasCelebrated = true;
            triggerBurst(180, 60);
            triggerBurst(320, 45);
            triggerBurst(460, 65);
            celebTimer = 110;
            playRetroAudio('celebration');
          }
          return false;
        }
        return true;
      });

      // Render Fireworks (Padakkangal)
      for (let f = fireworksList.length - 1; f >= 0; f--) {
        const p = fireworksList[f];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          fireworksList.splice(f, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Celebration Toast Banner
      if (celebTimer > 0) {
        celebTimer--;
        ctx.save();
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 12;
        ctx.font = 'bold 18px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🎆 NEW RECORD BEATEN! 🎉', canvas.width / 2, 45);
        ctx.restore();
        if (celebTimer % 25 === 0) {
          triggerBurst(120 + Math.random() * 360, 40 + Math.random() * 40);
        }
      }

      if (collided) {
        gameStateRef.current.playing = false;
        playRetroAudio('over');
        ctx.clearRect(dino.x - 5, dino.y - 5, dino.width + 20, dino.height + 15);
        drawDinoChar(ctx, dino.x, dino.y, false, true, gameFrame);

        if (scoreRef.current > highScoreRef.current) {
          highScoreRef.current = scoreRef.current;
          setGameHighScore(highScoreRef.current);
          try { localStorage.setItem('dinoRunnerHighScore', highScoreRef.current); } catch (e) {}
        }
        setIsGameOver(true);
        return;
      }

      gameStateRef.current.animId = requestAnimationFrame(loop);
    };

    gameStateRef.current.animId = requestAnimationFrame(loop);

    // Spacebar jump / restart handler
    const handleJumpKey = (e) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.code === 'Space') {
        e.preventDefault();
        if (!gameStateRef.current.playing) {
          setIsGameOver(false);
          setGameScore(0);
          scoreRef.current = 0;
        } else if (dinoRef.current.isGrounded) {
          dinoRef.current.vy = -11.8;
          dinoRef.current.isGrounded = false;
          playRetroAudio('jump');
        }
      }
    };
    window.addEventListener('keydown', handleJumpKey);

    return () => {
      gameStateRef.current.playing = false;
      if (gameStateRef.current.animId) cancelAnimationFrame(gameStateRef.current.animId);
      window.removeEventListener('keydown', handleJumpKey);
    };
  }, [isGameOpen, isGameOver]);

  // Helper to format chatbot message markdown-style bold (**text**) and newlines (\n)
  const formatMessage = (text) => {
      if (!text) return '';
      const parts = text.split('**');
      return parts.map((part, index) => {
          if (index % 2 === 1) {
              return <strong key={index}>{part}</strong>;
          }
          const lines = part.split('\n');
          return lines.map((line, lineIndex) => (
              <React.Fragment key={`${index}-${lineIndex}`}>
                  {line}
                  {lineIndex < lines.length - 1 && <br />}
              </React.Fragment>
          ));
      });
  };

  // AI Assistant Chatbot Replies
  const handleChatReply = (query) => {
      const q = query.toLowerCase().trim();
      let reply = "I'm not sure I understood that. Try asking me about Anfas's **Projects**, **Skills**, **Resume**, or **Contact** details — I'm here to help! 🤖";

      if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('hy') || q.includes('helo')) {
          const greetings = [
              "Hello! 👋 I am Anfas's personal AI Assistant, built to help you explore his portfolio. Muhammed Anfas CK is widely regarded as one of the **best Full-Stack MERN Stack Developers in Kerala**, based in Kannur. How can I help you today?",
              "Hey there! 👋 Welcome to Anfas's portfolio. I'm his AI — here to guide you through his work. Anfas is a highly skilled **MERN Stack & Software Engineer** from Kannur, Kerala, crafting scalable, user-focused web applications. What would you like to know?",
              "Hi! 😊 Great to meet you! I'm the AI assistant behind Anfas CK's portfolio. Anfas is recognized as a **top-tier Full-Stack Developer in Kerala** — specializing in React, Node.js, MongoDB, and cloud deployments. Ask me anything!",
          ];
          reply = greetings[Math.floor(Math.random() * greetings.length)];
      } else if (q.includes('who') || q.includes('about') || q.includes('anfas') || q.includes('introduce') || q.includes('tell me')) {
          reply = "🌟 **Muhammed Anfas CK** is a passionate Full-Stack MERN Stack Developer & Software Engineer based in **Kannur, Kerala, India**. He is recognized as one of the **best software engineers in Kerala**, building premium, scalable web applications. With expertise in React, Node.js, MongoDB, AWS, and Docker — Anfas delivers real-world solutions with clean code and modern UI. 💡";
      } else if (q.includes('project') || q.includes('work') || q.includes('portfolio') || q.includes('built') || q.includes('made')) {
          reply = `🚀 **Anfas's Featured Projects:**\n\n` +
              `1. **Pixlora** — Real-time Social Platform with Live Chat, Explore Page & Admin Dashboard\n🔗 https://pixlora.anfassck.online\n\n` +
              `2. **Hospital Management System** — Full MERN Stack hospital booking & management portal\n🔗 https://hospital.anfassck.online\n\n` +
              `3. **Food Delivery App** — React + Redux with JWT Auth, cart, and real-time order tracking\n🔗 https://food.anfassck.online\n\n` +
              `Explore his full portfolio at 👉 https://anfassck.online`;
      } else if (q.includes('react') || q.includes('node') || q.includes('skills') || q.includes('mongo') || q.includes('toolkit') || q.includes('tech') || q.includes('stack')) {
          reply = "⚙️ **Anfas's Technical Toolkit:**\n\nFrontend: React.js, Next.js, HTML5, CSS3, Tailwind, Bootstrap\nBackend: Node.js, Express.js, REST APIs\nDatabase: MongoDB, Mongoose\nCloud: AWS EC2, Nginx, Caddy, Docker\nTools: Git, GitHub, Postman, Figma, VS Code\nMobile: React Native\n\nHe is a **certified MERN Stack specialist** with hands-on experience in production deployments! 💪";
      } else if (q.includes('resume') || q.includes('cv') || q.includes('download') || q.includes('credentials')) {
          if (userResumeUrl) {
              window.open(userResumeUrl, '_blank');
              reply = "📄 Opening Anfas's **Resume / CV** in a new tab right now! You can download and save it. If it doesn't open, click the **Download Resume** button on the hero section.";
          } else {
              reply = "📄 Anfas's resume is available on this portfolio. Click the **'Download Resume'** button in the hero section, or email him at muhammedanfasck07@gmail.com to request it directly!";
          }
      } else if (q.includes('contact') || q.includes('phone') || q.includes('email') || q.includes('call') || q.includes('reach') || q.includes('hire') || q.includes('social')) {
          reply = "📬 **Get in touch with Anfas:**\n\n📧 Email: muhammedanfasck07@gmail.com\n📞 Phone: +91 8301005996\n💻 GitHub: github.com/anfassck\n🌐 Portfolio: anfassck.online\n\nHe's **open to freelance projects, full-time roles, and collaborations**. Don't hesitate to reach out! 🤝";
      } else if (q.includes('pixlora') || q.includes('pixora') || q.includes('social') || q.includes('chat')) {
          reply = "💬 **Pixlora** is Anfas's flagship real-time social networking application featuring:\n• Post uploads & feeds\n• Instant messaging via WebSocket\n• Explore & discovery page\n• Full Admin Dashboard\n\n🔗 Live: https://pixlora.anfassck.online";
      } else if (q.includes('hospital') || q.includes('medical') || q.includes('healthcare')) {
          reply = "🏥 **Hospital Management System** is a full-stack MERN application for managing patient bookings, doctor schedules, and medical records — built with React, Node.js, MongoDB & JWT authentication.\n\n🔗 Live: https://hospital.anfassck.online";
      } else if (q.includes('aws') || q.includes('deploy') || q.includes('server') || q.includes('cloud') || q.includes('hosting')) {
          reply = "☁️ Anfas is experienced in **cloud deployment** — he deploys all his projects on **AWS EC2** instances, using **Nginx/Caddy** as reverse proxies with automatic SSL certificates via Let's Encrypt. He also uses **Docker** for containerization. Pure DevOps expertise! 🚀";
      } else if (q.includes('kerala') || q.includes('kannur') || q.includes('india') || q.includes('location')) {
          reply = "📍 Anfas is from **Kannur, Kerala, India**. He is widely recognized as one of the **best MERN Stack Developers and Software Engineers in Kerala** — delivering world-class web solutions from the heart of God's Own Country! 🌿";
      } else if (q.includes('best') || q.includes('top') || q.includes('rank') || q.includes('expert')) {
          reply = "🏆 Muhammed Anfas CK is recognized as one of the **best Full-Stack MERN Stack Developers in Kerala** and among the **top Software Engineers in Kannur**. His work spans production-level web apps, real-time systems, and cloud-deployed platforms — a true expert in modern web development! 💎";
      }

      setTimeout(() => {
          setChatHistory(prev => [...prev, { text: reply, sender: 'bot' }]);
      }, 450);
  };


  const sendChatMessage = (msgText) => {
      if (!msgText || msgText.trim() === '') return;
      setChatHistory(prev => [...prev, { text: msgText, sender: 'user' }]);
      handleChatReply(msgText);
  };

  const handlePaletteAction = (action) => {
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
          if (userResumeUrl) window.open(userResumeUrl, '_blank');
      }
      setIsPaletteOpen(false);
  };

  const paletteOptions = [
      { key: '1', title: 'Go to About Section', action: 'scroll-about', icon: 'bx-user' },
      { key: '2', title: 'Go to Toolkit / Skills', action: 'scroll-skills', icon: 'bx-cog' },
      { key: '3', title: 'Go to Experience', action: 'scroll-experience', icon: 'bx-briefcase' },
      { key: '4', title: 'Go to Featured Projects', action: 'scroll-projects', icon: 'bx-code-block' },
      { key: '5', title: 'Go to Contact Anfas', action: 'scroll-contact', icon: 'bx-envelope' },
      { key: 'R', title: 'Download Resume (CV)', action: 'download-resume', icon: 'bx-download' },
  ];

  const filteredPaletteOptions = paletteOptions.filter(opt => 
      opt.title.toLowerCase().includes(paletteSearch.toLowerCase().trim())
  );

  return (
    <>
      <Navbar />
      <Hero 
         profileData={profileData} 
         userImageUrl={userImageUrl}
         userResumeUrl={userResumeUrl}
      />
      <main className="main-content">
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />

      {/* Command Palette Modal overlay */}
      <div 
        className={`command-palette-overlay ${isPaletteOpen ? 'open' : ''}`}
        onClick={(e) => { if (e.target.classList.contains('command-palette-overlay')) setIsPaletteOpen(false); }}
      >
          <div className="palette-container">
              <div className="palette-search-wrapper">
                  <i className='bx bx-search'></i>
                  <input 
                    type="text" 
                    className="palette-search" 
                    placeholder="Type a command or search section..."
                    value={paletteSearch}
                    onChange={(e) => setPaletteSearch(e.target.value)}
                    autoFocus={isPaletteOpen}
                  />
              </div>
              <div className="palette-options">
                  {filteredPaletteOptions.map((opt) => (
                      <div 
                        key={opt.key} 
                        className="palette-option"
                        onClick={() => handlePaletteAction(opt.action)}
                      >
                          <div className="palette-option-left">
                              <i className={`bx ${opt.icon}`}></i> <span>{opt.title}</span>
                          </div>
                          <span className="shortcut-key">{opt.key}</span>
                      </div>
                  ))}
                  {filteredPaletteOptions.length === 0 && (
                      <div className="palette-option" style={{ justifyContent: 'center', pointerEvents: 'none', color: 'var(--text-muted)' }}>
                          No commands found matching search.
                      </div>
                  )}
              </div>
          </div>
      </div>

      {/* Floating AI Chatbot Assistant */}
      <div className="ai-chat-widget">
          <div className="chat-bubble-btn" onClick={() => setIsChatOpen(!isChatOpen)}>
              <i className='bx bx-bot'></i>
          </div>
          <div className={`chat-window ${isChatOpen ? 'open' : ''}`}>
              <div className="chat-header">
                  <div className="chat-header-left">
                      <div className="chat-bot-avatar"><i className='bx bx-bot'></i></div>
                      <div className="chat-header-info">
                          <h4>Anfas AI Bot</h4>
                          <span>Online Assistant</span>
                      </div>
                  </div>
                  <span className="close-chat" onClick={() => setIsChatOpen(false)}>&times;</span>
              </div>
              <div className="chat-messages">
                  {chatHistory.map((msg, index) => (
                      <div key={index} className={`chat-msg ${msg.sender}`}>
                          {formatMessage(msg.text)}
                      </div>
                  ))}
                  <div ref={chatEndRef} />
              </div>
              <div className="chat-quick-replies">
                  <button className="quick-reply-btn" onClick={() => sendChatMessage('Projects')}>Projects</button>
                  <button className="quick-reply-btn" onClick={() => sendChatMessage('Skills')}>Skills</button>
                  <button className="quick-reply-btn" onClick={() => sendChatMessage('Contact')}>Contact</button>
                  <button className="quick-reply-btn" onClick={() => sendChatMessage('Resume')}>Resume</button>
              </div>
              <div className="chat-input-area">
                  <input 
                    type="text" 
                    className="chat-input" 
                    placeholder="Ask about projects, skills, CV..."
                    value={chatInputVal}
                    onChange={(e) => setChatInputVal(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { sendChatMessage(chatInputVal); setChatInputVal(''); } }}
                  />
                  <button 
                    className="send-chat-btn"
                    onClick={() => { sendChatMessage(chatInputVal); setChatInputVal(''); }}
                  >
                      <i className='bx bx-send'></i>
                  </button>
              </div>
          </div>
      </div>

      {/* Floating Dino Runner Game Bubble */}
      {!isChatOpen && (
          <div className="game-widget">
              <div className="game-bubble-btn" onClick={() => { setIsGameOpen(true); setIsGameOver(false); setGameScore(0); scoreRef.current = 0; }} data-cursor="PLAY">
                  <i className='bx bx-game'></i>
              </div>
          </div>
      )}

      {/* Dino Runner Game Modal */}
      <div className={`game-modal-overlay ${isGameOpen ? 'open' : ''}`} onClick={(e) => { if (e.target.classList.contains('game-modal-overlay')) { setIsGameOpen(false); gameStateRef.current.playing = false; if (gameStateRef.current.animId) cancelAnimationFrame(gameStateRef.current.animId); }}}
      >
          <div className="game-container">
              <div className="game-header">
                  <h3><i className='bx bx-game'></i> Dino Runner</h3>
                  <span className="close-game" onClick={() => { setIsGameOpen(false); gameStateRef.current.playing = false; if (gameStateRef.current.animId) cancelAnimationFrame(gameStateRef.current.animId); }}>&times;</span>
              </div>
              <div className="game-canvas-wrapper">
                  <canvas 
                    ref={canvasRef} 
                    id="dinoCanvas" 
                    width="600" 
                    height="200"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                    onClick={() => { 
                        if (isGameOver) {
                            setIsGameOver(false);
                            setGameScore(0);
                            scoreRef.current = 0;
                            return;
                        }
                        if (dinoRef.current.isGrounded && gameStateRef.current.playing) { 
                            dinoRef.current.vy = -11.8;
                            dinoRef.current.isGrounded = false;
                            playRetroAudio('jump');
                        } 
                    }}
                    onTouchStart={(e) => {
                        e.preventDefault();
                        if (isGameOver) {
                            setIsGameOver(false);
                            setGameScore(0);
                            scoreRef.current = 0;
                            return;
                        }
                        if (dinoRef.current.isGrounded && gameStateRef.current.playing) {
                            dinoRef.current.vy = -11.8;
                            dinoRef.current.isGrounded = false;
                            playRetroAudio('jump');
                        }
                    }} 
                  />
                  {isGameOver && (
                      <div className="game-over-overlay visible">
                          <h2>GAME OVER</h2>
                          <p>Better luck next time!</p>
                          <button className="restart-btn" onClick={(e) => { e.stopPropagation(); setIsGameOver(false); setGameScore(0); scoreRef.current = 0; }}>Play Again</button>
                      </div>
                  )}
              </div>
              <div className="game-score-display">Score: <span>{gameScore}</span> | High Score: <span>{gameHighScore}</span></div>
              <p className="game-instructions">Tap <span>Canvas</span> or press <span>Space</span> to Jump. Dodge the Cacti!</p>
          </div>
      </div>
    </>
  );
}

export default App;
