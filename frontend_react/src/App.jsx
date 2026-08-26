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

  // Dino Runner Game Loop
  useEffect(() => {
    if (!isGameOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Dynamically resize canvas to fill its CSS-rendered width (responsive)
    const cssWidth = canvas.offsetWidth || 600;
    const cssHeight = Math.round(cssWidth * (200 / 600)); // Maintain 600:200 ratio
    canvas.width = cssWidth;
    canvas.height = cssHeight;

    const groundY = Math.round(cssHeight * 0.925); // 185/200 of canvas height
    const dinoGroundY = Math.round(cssHeight * 0.75); // 150/200 of canvas height

    const ctx = canvas.getContext('2d');

    // Initialize fresh game state with scaled positions
    dinoRef.current = { x: Math.round(cssWidth * 0.083), y: dinoGroundY, width: Math.round(cssWidth * 0.05), height: Math.round(cssHeight * 0.175), vy: 0, isGrounded: true };
    obstaclesRef.current = [];
    obstacleTimerRef.current = 0;
    gameSpeedRef.current = 4.5;
    gameStateRef.current.playing = true;

    const loop = () => {
        if (!gameStateRef.current.playing) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw ground
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(canvas.width, groundY);
        ctx.stroke();

        // Physics: gravity (scale gravity to canvas height)
        const dino = dinoRef.current;
        dino.vy += cssHeight * 0.00325; // ~0.65 at 200px height
        dino.y += dino.vy;

        if (dino.y >= dinoGroundY) {
            dino.y = dinoGroundY;
            dino.vy = 0;
            dino.isGrounded = true;
        }

        // Draw Dino
        ctx.fillStyle = '#0ea5e9';
        ctx.shadowColor = '#0ea5e9';
        ctx.shadowBlur = 10;
        ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
        ctx.shadowBlur = 0;

        // Spawn obstacles (scale size to canvas height)
        obstacleTimerRef.current++;
        if (obstacleTimerRef.current > 85 + Math.random() * 40) {
            const obsW = Math.round(cssWidth * 0.025) + Math.random() * Math.round(cssWidth * 0.025);
            const obsH = Math.round(cssHeight * 0.15) + Math.random() * Math.round(cssHeight * 0.075);
            obstaclesRef.current.push({
                x: canvas.width,
                width: obsW,
                height: obsH
            });
            obstacleTimerRef.current = 0;
        }

        // Update and draw obstacles
        let collided = false;
        obstaclesRef.current = obstaclesRef.current.filter(obs => {
            obs.x -= gameSpeedRef.current;
            ctx.fillStyle = '#f43f5e';
            ctx.fillRect(obs.x, groundY - obs.height, obs.width, obs.height);

            // Collision detection
            if (
                dino.x < obs.x + obs.width &&
                dino.x + dino.width > obs.x &&
                dino.y < groundY &&
                dino.y + dino.height > groundY - obs.height
            ) {
                collided = true;
            }

            // Score when obstacle passes
            if (obs.x + obs.width < 0) {
                scoreRef.current += 10;
                setGameScore(scoreRef.current);
                if (scoreRef.current % 100 === 0) gameSpeedRef.current += 0.5;
                return false; // Remove from array
            }
            return true;
        });

        if (collided) {
            gameStateRef.current.playing = false;
            if (scoreRef.current > highScoreRef.current) {
                highScoreRef.current = scoreRef.current;
                setGameHighScore(highScoreRef.current);
            }
            setIsGameOver(true);
            return;
        }

        gameStateRef.current.animId = requestAnimationFrame(loop);
    };

    gameStateRef.current.animId = requestAnimationFrame(loop);

    // Spacebar jump handler
    const handleJump = (e) => {
        if (e.key === ' ' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (dinoRef.current.isGrounded && gameStateRef.current.playing) {
                dinoRef.current.vy = -(cssHeight * 0.0525); // ~-10.5 at 200px height
                dinoRef.current.isGrounded = false;
            }
        }
    };
    window.addEventListener('keydown', handleJump);

    return () => {
        gameStateRef.current.playing = false;
        if (gameStateRef.current.animId) cancelAnimationFrame(gameStateRef.current.animId);
        window.removeEventListener('keydown', handleJump);
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
                        const c = canvasRef.current;
                        if (dinoRef.current.isGrounded && gameStateRef.current.playing && c) { 
                            dinoRef.current.vy = -(c.height * 0.0525);
                            dinoRef.current.isGrounded = false; 
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
