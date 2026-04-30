import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container glass-card">
                <div className="footer-left">
                    <div className="footer-logo">
                        <h2>A</h2>
                        <div className="footer-name">Muhammed Anfas CK</div>
                    </div>
                    <p>Designing and developing high-end digital solutions with a focus on premium aesthetics and performance.</p>
                </div>
                <div className="footer-socials">
                    <a href="https://github.com/anfassck" target="_blank" rel="noreferrer"><i className='bx bxl-github'></i> GitHub</a>
                    <a href="#"><i className='bx bxl-linkedin'></i> LinkedIn</a>
                    <a href="#"><i className='bx bxl-twitter'></i> Twitter</a>
                    <a href="https://www.instagram.com/anfaaseeii/" target="_blank" rel="noreferrer"><i className='bx bxl-instagram'></i> Instagram</a>
                    <a href="#"><i className='bx bxl-facebook'></i> Facebook</a>
                    <a href="mailto:muhammedanfasck07@gmail.com?subject=Contact" target="_blank" rel="noreferrer"><i className='bx bx-envelope'></i> Email</a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; <span id="year">{new Date().getFullYear()}</span> Muhammed Anfas CK. All Rights Reserved.</p>
                <div className="footer-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
