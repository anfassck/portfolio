import React from 'react';

const Navbar = () => {
    const handleLogoDblClick = () => {
        window.open('https://portfolioapi.anfassck.online/admin', '_blank');
    };

    return (
        <nav className="navbar" data-aos="fade-down" data-aos-duration="1000">
            <div className="logo" id="navLogo" style={{ cursor: 'pointer', userSelect: 'none' }} onDoubleClick={handleLogoDblClick}>
                <i className='bx bx-code-alt'></i> Anfas.
            </div>
            <ul className="nav-links">
                <li><a href="#about">About</a></li>
                <li><a href="#skills">Toolkit</a></li>
                <li><a href="#experience">Experience</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
            <div className="nav-socials" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a 
                    href="https://www.linkedin.com/in/muhammed-anfas-ck-81687b3b8" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn-social-nav" 
                    title="LinkedIn Profile"
                >
                    <i className='bx bxl-linkedin'></i>
                </a>
                <a 
                    href="https://github.com/anfassck" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn-social-nav" 
                    title="GitHub"
                >
                    <i className='bx bxl-github'></i>
                </a>
                <a 
                    href="/Muhammed_Anfas_CK_Resume.pdf" 
                    download="Muhammed_Anfas_CK_Resume.pdf" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn-resume-nav"
                >
                    <i className='bx bx-download'></i> CV
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
