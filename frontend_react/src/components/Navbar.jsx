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
            </ul>
            <div className="nav-socials" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <a href="https://github.com/anfassck" target="_blank" rel="noreferrer" className="btn-primary">
                    <i className='bx bxl-github'></i> GitHub
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
