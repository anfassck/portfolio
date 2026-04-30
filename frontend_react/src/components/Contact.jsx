import React, { useState } from 'react';

const Contact = () => {
    const [status, setStatus] = useState({ show: false, text: '', color: '' });
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setStatus({ show: true, text: 'Sending inquiry...', color: '#f8fafc' });

        try {
            // Note: The original logic connected to the backend URL, but since you had web3forms in your HTML too
            // I'm implementing the custom backend fetch your script.js had
            const response = await fetch('https://portfolioapi.anfassck.online/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setStatus({ show: true, text: 'Awesome! Message sent successfully ✅ We will contact you shortly. Thank you!', color: '#10b981' });
                setFormData({ name: '', email: '', phone: '', message: '' });
            } else {
                setStatus({ show: true, text: 'Error: ' + (data.error || 'Failed to send.'), color: '#ef4444' });
            }
        } catch (error) {
            setStatus({ show: true, text: 'Server connection failed. Is your backend running?', color: '#ef4444' });
        }
    };

    return (
        <section id="contact" className="section">
            <h2 className="section-title" data-aos="fade-up"><span className="gradient-text">Start a Project</span></h2>
            <div className="contact-grid">
                <div className="contact-info glass-card" data-aos="fade-right" data-aos-delay="200">
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.8rem', color: 'var(--text-main)' }}>Let's collaborate</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.2rem', fontSize: '0.95rem' }}>Have any work or project in mind? Fill out the details or contact me directly below.</p>
                    <div className="info-items">
                        <a href="tel:+918301005996" className="info-item hover-link"><i className='bx bx-phone'></i> <span>+91 8301005996</span></a>
                        <a href="mailto:muhammedanfasck07@gmail.com" className="info-item hover-link"><i className='bx bx-envelope'></i> <span>muhammedanfasck07@gmail.com</span></a>
                        <a href="https://www.google.com/maps/place/Irikkur,+Kerala/" target="_blank" rel="noreferrer" className="info-item hover-link"><i className='bx bx-map'></i> <span>Kannur, Irikkur</span></a>
                    </div>
                </div>
                
                <div className="contact-form glass-card" data-aos="fade-left" data-aos-delay="400">
                    <form onSubmit={handleSubmit} id="contactForm">
                        {status.show && (
                            <div id="formStatus" style={{ display: 'block', color: status.color, marginBottom: '15px' }}>
                                {status.text}
                            </div>
                        )}
                        <input type="hidden" name="access_key" value="df22c9ed-8426-47a7-b794-c69384394222" />

                        <div className="input-group">
                            <label>Full Name</label>
                            <input type="text" id="name" name="name" required placeholder="Enter your full name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label>Email Address</label>
                            <input type="email" id="email" name="email" required placeholder="Enter your email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label>Phone Number</label>
                            <input type="tel" id="phone" name="phone" required placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label>What work do you need?</label>
                            <textarea id="message" name="message" rows="4" required placeholder="Tell me about the work or inquiry..." value={formData.message} onChange={handleChange}></textarea>
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '15px', fontSize: '1.1rem' }}>
                            Send Inquiry <i className='bx bx-send'></i>
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
