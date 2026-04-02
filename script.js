// Script.js Original
const canvas = document.getElementById('matrixCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const phrases = ["< CODE >", "// SYSTEM", "{ UI }", "{ UX }"];
    let floatingWords = [];
    const wordCount = 40;

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

    function animateWords() {
        ctx.fillStyle = "rgba(3, 7, 18, 1)";
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < wordCount; i++) {
            floatingWords[i].update();
            floatingWords[i].draw();
        }
        requestAnimationFrame(animateWords);
    }
    animateWords();

    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
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

// Contact Form Submission Connected to Backend
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
            const response = await fetch('http://localhost:8000/api/contact', {
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
