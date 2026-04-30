import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    const API_BASE = 'https://portfolioapi.anfassck.online';

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

  const API_BASE = 'https://portfolioapi.anfassck.online';

  const userImageUrl = profileData?.imageUrl 
      ? (profileData.imageUrl.startsWith('http') ? profileData.imageUrl : `${API_BASE}${profileData.imageUrl}`) 
      : null;

  const userResumeUrl = profileData?.resumeUrl 
      ? (profileData.resumeUrl.startsWith('http') ? profileData.resumeUrl : `${API_BASE}${profileData.resumeUrl}`) 
      : null;

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
    </>
  );
}

export default App;
