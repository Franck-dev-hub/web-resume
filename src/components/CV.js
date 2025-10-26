import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import './CV-animations.css';
import './CV-base.css';
import './CV-certifications.css';
import './CV-header.css';
import './CV-hero.css';
import './CV-interests.css';
import './CV-main.css';
import './CV-projects.css';
import './CV-sidebar.css';
import './CV-skills.css';
import './CV-timeline.css';
import './CV-variables.css';
import { cvData } from './data/cvData';
import { useQRCode } from './hooks/useQRCode';
import { useScroll } from './hooks/useScroll';
import { useSidebar } from './hooks/useSidebar';

const CV = () => {
    // Theme and language state
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [language, setLanguage] = useState('fr');

    // Sidebar state (hook)
    const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();

    // QR code refs
    const linkedinQRRef = useRef(null);
    const githubQRRef = useRef(null);
    const fr_resumeQRRef = useRef(null);
    const en_resumeQRRef = useRef(null);
    useQRCode(linkedinQRRef, githubQRRef, fr_resumeQRRef, en_resumeQRRef, cvData, language);

    // Scroll navigation (hook)
    const { showScrollButtons, setShowScrollButtons, scrollToSection, scrollToTop, scrollToBottom } = useScroll();

    // UI state management
    const [openPlatform, setOpenPlatform] = useState(null);
    const [openCertification, setOpenCertification] = useState(null);
    const [openTimelineCards, setOpenTimelineCards] = useState({});
    const [activeSkillCategory, setActiveSkillCategory] = useState('');
    const [activeSoftSkillCategory, setActiveSoftSkillCategory] = useState('');
    const [nameClickCount, setNameClickCount] = useState(0);
    const [showProfileImage, setShowProfileImage] = useState(false);
    const [profileImageUrl, setProfileImageUrl] = useState('');

    // Initialize skill categories on language change
    useEffect(() => {
        const skillCategories = Object.keys(cvData[language].skills);
        const softSkillCategories = Object.keys(cvData[language].softSkills);

        if (skillCategories.length > 0 && !activeSkillCategory) {
            setActiveSkillCategory(skillCategories[0]);
        }
        if (softSkillCategories.length > 0 && !activeSoftSkillCategory) {
            setActiveSoftSkillCategory(softSkillCategories[0]);
        }
    }, [language, activeSkillCategory, activeSoftSkillCategory]);

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    // Scroll to top on component mount
    useEffect(() => {
        scrollToTop();
    }, []);

    // Handle scroll events for navigation buttons
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setShowScrollButtons(scrollTop > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle mobile menu close on overlay click
    useEffect(() => {
        const handleOverlayClick = (e) => {
            if (e.target.classList.contains('mobile-overlay')) {
                closeSidebar();
            }
        };

        const handleEscapeKey = (e) => {
            if (e.key === 'Escape' && isSidebarOpen) {
                closeSidebar();
            }
        };

        // Swipe to close functionality
        let startX = 0;
        let currentX = 0;
        const sidebar = document.querySelector('.cv-sidebar');

        const handleTouchStart = (e) => {
            startX = e.touches[0].clientX;
        };

        const handleTouchMove = (e) => {
            if (!isSidebarOpen) return;
            currentX = e.touches[0].clientX;
            const diff = startX - currentX;

            if (diff > 50) { // Swipe left to close
                closeSidebar();
            }
        };

        if (isSidebarOpen && sidebar) {
            sidebar.addEventListener('touchstart', handleTouchStart);
            sidebar.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('click', handleOverlayClick);
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            if (sidebar) {
                sidebar.removeEventListener('touchstart', handleTouchStart);
                sidebar.removeEventListener('touchmove', handleTouchMove);
            }
            document.removeEventListener('click', handleOverlayClick);
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
    }, [isSidebarOpen, closeSidebar]);

    // Toggle platform sections
    const togglePlatform = (platformName) => {
        const isOpening = openPlatform !== platformName;
        setOpenPlatform(openPlatform === platformName ? null : platformName);

        if (isOpening && (platformName === 'technical' || platformName === 'soft')) {
            setTimeout(() => {
                scrollToTop();
            }, 100);
        }
    };

    // Toggle certification sections
    const toggleCertification = (certificationName) => {
        const isOpening = openCertification !== certificationName;
        setOpenCertification(openCertification === certificationName ? null : certificationName);

        if (isOpening && (certificationName === 'technical' || certificationName === 'soft')) {
            setTimeout(() => {
                scrollToTop();
            }, 100);
        }
    };

    // Toggle timeline cards
    const toggleTimelineCard = (cardId) => {
        setOpenTimelineCards(prev => ({
            ...prev,
            [cardId]: !prev[cardId]
        }));
    };

    // Navigation functions for skill cards
    const nextSkillCard = () => {
        setCurrentSkillCard((prev) => (prev + 1) % Object.keys(cvData[language].skills).length);
    };

    const prevSkillCard = () => {
        setCurrentSkillCard((prev) => (prev - 1 + Object.keys(cvData[language].skills).length) % Object.keys(cvData[language].skills).length);
    };

    const goToSkillCard = (index) => {
        setCurrentSkillCard(index);
    };

    // Navigation functions for soft skill cards
    const nextSoftSkillCard = () => {
        setCurrentSoftSkillCard((prev) => (prev + 1) % Object.keys(cvData[language].softSkills).length);
    };

    const prevSoftSkillCard = () => {
        setCurrentSoftSkillCard((prev) => (prev - 1 + Object.keys(cvData[language].softSkills).length) % Object.keys(cvData[language].softSkills).length);
    };

    const goToSoftSkillCard = (index) => {
        setActiveSoftSkillCard(index);
    };

    // Handle name click to reveal profile image
    const handleNameClick = () => {
        setNameClickCount(prevCount => {
            const newCount = prevCount + 1;

            if (newCount >= 10) {
                setShowProfileImage(true);
                return 0; // Reset counter
            }

            return newCount;
        });
    };

    // Navigation items configuration
    const navItems = [
        { id: 'hero', icon: '🏠', label: language === 'fr' ? 'Profil' : 'Profile' },
        { id: 'skills', icon: '💻', label: language === 'fr' ? 'Compétences' : 'Skills' },
        { id: 'experience', icon: '📅', label: language === 'fr' ? 'Exp. & Form.' : 'Exp. & Edu.' },
        { id: 'certifications', icon: '🎓', label: language === 'fr' ? 'Cert. & Auto-form.' : 'Cert. & Self-Learn.' },
        { id: 'projects', icon: '🚀', label: language === 'fr' ? 'Projets' : 'Projects' },
        { id: 'interests', icon: '🎯', label: language === 'fr' ? 'Intérêts' : 'Interests' }
    ];

    // Get badge URL for skill display
    function getBadgeUrl(skill) {
        const badgeMap = {
            'C': 'https://img.shields.io/badge/C-00599C?logo=c&logoColor=white',
            'C++': 'https://img.shields.io/badge/C++-00599C?logo=c%2B%2B&logoColor=white',
            'Rust': 'https://img.shields.io/badge/Rust-000000?logo=rust&logoColor=white',
            'C#': 'https://custom-icon-badges.demolab.com/badge/C%23-239120?logo=csharp&logoColor=white',
            'Python': 'https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white',
            'Lua': 'https://img.shields.io/badge/Lua-2C2D72?logo=lua&logoColor=white',
            'GDScript': 'https://img.shields.io/badge/GDScript-478CBF?logo=godotengine&logoColor=white',
            'VBA': 'https://img.shields.io/badge/VBA-2C7ACD?logo=microsoft-excel&logoColor=white',
            'HTML': 'https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white',
            'CSS': 'https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white',
            'JavaScript': 'https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black',
            'Node.js': 'https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white',
            'Markdown': 'https://img.shields.io/badge/Markdown-%23000000.svg?logo=markdown&logoColor=white',
            'Shell': 'https://img.shields.io/badge/Shell-89E051?logo=powershell&logoColor=white',
            'Bash': 'https://img.shields.io/badge/Bash-4EAA25?logo=gnubash&logoColor=white',
            'Zsh': 'https://img.shields.io/badge/Zsh-F15A24?logo=zsh&logoColor=fff',
            'MySQL': 'https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white',
            'SQLite': 'https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white',
            'JSON': 'https://img.shields.io/badge/JSON-000000?logo=json&logoColor=white',
            'XML': 'https://img.shields.io/badge/XML-767C52?logo=xml&logoColor=fff',
            'YAML': 'https://img.shields.io/badge/YAML-CB171E?logo=yaml&logoColor=fff',
            'TOML': 'https://custom-icon-badges.demolab.com/badge/TOML-9C4221?logo=toml&logoColor=fff',
            'CSV': 'https://custom-icon-badges.demolab.com/badge/CSV-003B57?logo=csv&logoColor=fff',
            'Git': 'https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white',
            'GitHub': 'https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white',
            'Docker': 'https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white',
            'JetBrains': 'https://custom-icon-badges.demolab.com/badge/JetBrains-000000?logo=jetbrains&logoColor=white',
            'Sublime Text': 'https://img.shields.io/badge/Sublime%20Text-%23575757.svg?logo=sublime-text&logoColor=important',
            'VS Code': 'https://custom-icon-badges.demolab.com/badge/Visual%20Studio%20Code-0078d7.svg?logo=vsc&logoColor=white',
            'Visual Studio': 'https://custom-icon-badges.demolab.com/badge/Visual%20Studio-5C2D91.svg?&logo=visual-studio&logoColor=white',
            'Notepad++': 'https://img.shields.io/badge/Notepad++-90E59A.svg?&logo=notepad%2b%2b&logoColor=black',
            'Vim': 'https://img.shields.io/badge/Vim-%2311AB00.svg?logo=vim&logoColor=white',
            'Nano': 'https://img.shields.io/badge/Nano-4EAA25?logo=nano&logoColor=white',
            'Godot Engine': 'https://img.shields.io/badge/Godot-%23FFFFFF.svg?logo=godot-engine',
            'Unity': 'https://img.shields.io/badge/Unity-000000?logo=unity&logoColor=white',
            'Unreal Engine': 'https://img.shields.io/badge/Unreal%20Engine-%23313131.svg?logo=unrealengine&logoColor=white',
            'NumPy': 'https://img.shields.io/badge/NumPy-4DABCF?logo=numpy&logoColor=fff',
            'Pandas': 'https://img.shields.io/badge/Pandas-150458?logo=pandas&logoColor=fff',
            'Scikit-learn': 'https://img.shields.io/badge/-scikit--learn-%23F7931E?logo=scikit-learn&logoColor=white',
            'TensorFlow': 'https://img.shields.io/badge/TensorFlow-ff8f00?logo=tensorflow&logoColor=white',
            'PyTorch': 'https://img.shields.io/badge/PyTorch-ee4c2c?logo=pytorch&logoColor=white',
            'Matplotlib': 'https://custom-icon-badges.demolab.com/badge/Matplotlib-71D291?logo=matplotlib&logoColor=fff',
            'Tkinter': 'https://img.shields.io/badge/Tkinter-FFB13B?logo=python&logoColor=white',
            'Obsidian': 'https://img.shields.io/badge/Obsidian-%23483699.svg?&logo=obsidian&logoColor=white',
            'Discord': 'https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white',
            'Slack': 'https://img.shields.io/badge/Slack-4A154B?logo=slack&logoColor=fff',
            'Zoom': 'https://img.shields.io/badge/Zoom-2D8CFF?logo=zoom&logoColor=white',
            'Éthique professionnelle': 'https://img.shields.io/badge/Ethique%20pro-%23483699.svg',
            'Travail d\'équipe': 'https://img.shields.io/badge/Travail%20d%27equipe-blue',
            'Proactivité': 'https://img.shields.io/badge/Proactivite-purple',
            'Communication': 'https://img.shields.io/badge/Communication-orange',
            'Créativité': 'https://img.shields.io/badge/Creativite-pink',
            'Curiosité': 'https://img.shields.io/badge/Curiosite-red',
            'Français': 'https://img.shields.io/badge/Francais-red',
            'Anglais': 'https://img.shields.io/badge/Anglais-blue',
            'Permis A': 'https://img.shields.io/badge/Permis%20A-green',
            'Permis B': 'https://img.shields.io/badge/Permis%20B-purple',
            'Professional Ethic': 'https://img.shields.io/badge/Professional%20Ethic-brightgreen',
            'Teamwork': 'https://img.shields.io/badge/Teamwork-blue',
            'Proactivity': 'https://img.shields.io/badge/Proactivity-purple',
            'Creativity': 'https://img.shields.io/badge/Creativity-pink',
            'French': 'https://img.shields.io/badge/French-red',
            'English': 'https://img.shields.io/badge/English-blue',
            'Car': 'https://img.shields.io/badge/Car-green',
            'Motorbike': 'https://img.shields.io/badge/Motorbike-purple'
        };

        return badgeMap[skill] || `https://img.shields.io/badge/${encodeURIComponent(skill)}-gray?logoColor=white`;
    }

    // Fetch GitHub profile image
    const fetchGitHubProfile = async (username) => {
        try {
            // Essayer d'abord l'URL directe de l'avatar
            const directAvatarUrl = `https://github.com/${username}.png?size=120`;
            console.log('Trying direct GitHub avatar URL:', directAvatarUrl);

            // Tester si l'image directe fonctionne
            const imgTest = new Image();
            const directImagePromise = new Promise((resolve) => {
                imgTest.onload = () => {
                    console.log('Direct GitHub avatar loaded successfully');
                    resolve(directAvatarUrl);
                };
                imgTest.onerror = () => {
                    console.log('Direct GitHub avatar failed, trying API');
                    resolve(null);
                };
                imgTest.src = directAvatarUrl;
            });

            const directResult = await directImagePromise;
            if (directResult) {
                return directResult;
            }

            // Si l'URL directe échoue, essayer l'API
            const response = await fetch(`https://api.github.com/users/${username}`);

            if (!response.ok) {
                if (response.status === 403) {
                    console.log('GitHub API rate limit exceeded. Using fallback image.');
                } else {
                    console.log(`GitHub API error: ${response.status} ${response.statusText}`);
                }
                return null;
            }

            const data = await response.json();

            if (data.avatar_url) {
                console.log('GitHub profile image fetched successfully:', data.avatar_url);
                return data.avatar_url;
            } else {
                console.log('No avatar URL found in GitHub response');
                return null;
            }
        } catch (error) {
            console.error('Error fetching GitHub profile image:', error);
            return null;
        }
    };

    // Fetch LinkedIn profile image (fallback)
    const fetchLinkedInProfile = async () => {
        // Fallback vers une image SVG locale avec vos initiales
        return 'data:image/svg+xml;base64,' + btoa(`
            <svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="120" fill="#3B82F6" rx="60"/>
                <text x="60" y="70" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">FS</text>
            </svg>
        `);
    };

    // Initialize profile image on component mount
    useEffect(() => {
        const initProfileImage = async () => {
            const githubUsername = 'Franck-dev-hub';
            console.log('Fetching GitHub profile for:', githubUsername);

            const githubImage = await fetchGitHubProfile(githubUsername);

            if (githubImage) {
                console.log('Setting GitHub profile image:', githubImage);
                setProfileImageUrl(githubImage);
            } else {
                console.log('GitHub fetch failed, using fallback image');
                const fallbackImage = await fetchLinkedInProfile();
                console.log('Setting fallback image:', fallbackImage);
                setProfileImageUrl(fallbackImage);
            }
        };

        initProfileImage();
    }, []);

    // Debug: Log when showProfileImage changes
    useEffect(() => {
        console.log('showProfileImage changed to:', showProfileImage);
        console.log('profileImageUrl is:', profileImageUrl);
    }, [showProfileImage, profileImageUrl]);

    // Focus automatique sur les premiers boutons de skills à l'ouverture
    useEffect(() => {
        if (firstTechSkillBtnRef.current) {
            firstTechSkillBtnRef.current.focus();
        }
        if (firstSoftSkillBtnRef.current) {
            firstSoftSkillBtnRef.current.focus();
        }
    }, [language]);

    const firstTechSkillBtnRef = useRef(null);
    const firstSoftSkillBtnRef = useRef(null);

    return (
        <div className="cv-container">
            {/* Mobile overlay */}
            <div
                className={`mobile-overlay ${isSidebarOpen ? 'open' : ''}`}
                onClick={closeSidebar}
            />

            <aside className={`cv-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <button
                    className="sidebar-close"
                    onClick={closeSidebar}
                    aria-label="Fermer le menu"
                >
                    ✕
                </button>
                <nav className="sidebar-nav">
                    <ul>
                        {navItems.map(item => (
                            <li key={item.id}>
                                <button
                                    onClick={() => scrollToSection(item.id)}
                                    className="sidebar-nav-btn"
                                >
                                    <span className="sidebar-icon">{item.icon}</span>
                                    <span className="sidebar-label">{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            <header className="cv-header">
                <div className="container">
                    <div className="header-content">
                        <button
                            className="sidebar-toggle mobile-only"
                            onClick={toggleSidebar}
                            aria-label="Ouvrir le menu"
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        </button>
                        <h1 className="cv-name" onClick={handleNameClick}>{cvData[language].name}</h1>
                        {showProfileImage && (
                            <div className="profile-image-container">
                                <img
                                    src={profileImageUrl}
                                    alt={language === 'fr' ? 'Photo de profil' : 'Profile photo'}
                                    className="profile-image"
                                    onClick={() => setShowProfileImage(false)}
                                    onLoad={() => console.log('Profile image loaded successfully')}
                                    onError={(e) => {
                                        console.error('Profile image failed to load:', e.target.src);
                                        e.target.src = 'https://via.placeholder.com/120x120/3B82F6/FFFFFF?text=FS';
                                    }}
                                />
                            </div>
                        )}
                        <div className="header-qr-codes">
                            <div className="qr-code-container">
                                <a href={cvData[language].contact.linkedin} target="_blank" rel="noopener noreferrer">
                                    <div className="qr-code-wrapper">
                                        <canvas ref={linkedinQRRef} className="qr-code" title="LinkedIn QR Code"></canvas>
                                        <img
                                            src="/assets/linkedin.svg"
                                            alt="LinkedIn Logo"
                                            className="qr-logo"
                                        />
                                    </div>
                                </a>
                                <span className="qr-label">LinkedIn</span>
                            </div>
                            <div className="qr-code-container">
                                <a href={cvData[language].contact.github} target="_blank" rel="noopener noreferrer">
                                    <div className="qr-code-wrapper">
                                        <canvas ref={githubQRRef} className="qr-code" title="GitHub QR Code"></canvas>
                                        <img
                                            src="/assets/github.svg"
                                            alt="GitHub Logo"
                                            className="qr-logo"
                                        />
                                    </div>
                                </a>
                                <span className="qr-label">GitHub</span>
                            </div>
                            <div className="qr-code-container">
                                <a href={cvData[language].contact.fr_resume} target="_blank" rel="noopener noreferrer">
                                    <div className="qr-code-wrapper">
                                        <canvas ref={fr_resumeQRRef} className="qr-code" title="CV Français"></canvas>
                                        <div className="qr-logo">🇫🇷</div>
                                    </div>
                                </a>
                                <span className="qr-label">{language === 'fr' ? 'CV FR' : 'FR CV'}</span>
                            </div>
                            <div className="qr-code-container">
                                <a href={cvData[language].contact.en_resume} target="_blank" rel="noopener noreferrer">
                                    <div className="qr-code-wrapper">
                                        <canvas ref={en_resumeQRRef} className="qr-code" title="CV Anglais"></canvas>
                                        <div className="qr-logo">🌍</div>
                                    </div>
                                </a>
                                <span className="qr-label">{language === 'fr' ? 'CV EN' : 'EN CV'}</span>
                            </div>
                        </div>

                        <div className="header-controls">
                            <div className="navigation-buttons">
                                <button className="nav-btn" onClick={scrollToTop}>
                                    ⬆️
                                </button>
                                <button className="toggle-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
                                    {isDarkMode ? '☀️' : '🌙'}
                                </button>
                                <button className="nav-btn" onClick={scrollToBottom}>
                                    ⬇️
                                </button>
                                <button className="toggle-btn" onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}>
                                    {language === 'fr' ? '🇬🇧' : '🇫🇷'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="cv-main">
                <div className="container">
                    <section id="hero" className="cv-hero">
                        <div className="hero-content">
                            <div className="hero-title-card">
                                <h2 className="hero-title">{cvData[language].title}</h2>
                            </div>
                            <p className="hero-summary">{cvData[language].summary}</p>
                            <div className="hero-contact">
                                <div className="contact-item">
                                    📧 <a href={`mailto:${cvData[language].contact.email}`}>{cvData[language].contact.email}</a>
                                </div>
                                <div className="contact-item">
                                    📱 <a href={`tel:${cvData[language].contact.phone}`}>{cvData[language].contact.phone}</a>
                                </div>
                                <div className="contact-item">
                                    📍 <span>{cvData[language].contact.location}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="skills" className="cv-section">
                        <h2 className="section-title" data-text={language === 'fr' ? 'Compétences' : 'Skills'}>
                            {language === 'fr' ? 'Compétences' : 'Skills'}
                        </h2>
                        <div className="skills-section">
                            <h3 className="skills-section-title">{language === 'fr' ? 'Compétences Techniques' : 'Technical Skills'}</h3>
                            <div className="skills-filters">
                                {Object.keys(cvData[language].skills).map((category, idx) => (
                                    <button
                                        key={category}
                                        className={`skill-filter-btn ${activeSkillCategory === category ? 'active' : ''}`}
                                        onClick={() => setActiveSkillCategory(category)}
                                        ref={idx === 0 ? firstTechSkillBtnRef : null}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                            <div className="skills-grid">
                                {Object.entries(cvData[language].skills).map(([category, skills]) => (
                                    <div key={category} className={`skills-category ${activeSkillCategory === category ? 'active' : ''}`}>
                                        {skills.map((skill, index) => (
                                            <div key={index} className={`skill-item ${category === 'Programming Languages' ? 'programming-language' : ''}`}>
                                                <img src={getBadgeUrl(skill)} alt={skill} className="skill-badge" />
                                                <span className="skill-name">{skill}</span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="skills-section">
                            <h3 className="skills-section-title">{language === 'fr' ? 'Soft Skills' : 'Soft Skills'}</h3>
                            <div className="skills-filters">
                                {Object.keys(cvData[language].softSkills).map((category, idx) => (
                                    <button
                                        key={category}
                                        className={`skill-filter-btn ${activeSoftSkillCategory === category ? 'active' : ''}`}
                                        onClick={() => setActiveSoftSkillCategory(category)}
                                        ref={idx === 0 ? firstSoftSkillBtnRef : null}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                            <div className="soft-skills-grid">
                                {Object.entries(cvData[language].softSkills).map(([category, skills]) => (
                                    <div key={category} className={`soft-skills-category ${activeSoftSkillCategory === category ? 'active' : ''}`}>
                                        {skills.map((skill, index) => (
                                            <div key={index} className="skill-item">
                                                <img src={getBadgeUrl(skill)} alt={skill} className="skill-badge" />
                                                <span className="skill-name">{skill}</span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="experience" className="cv-section">
                        <h2 className="section-title" data-text={language === 'fr' ? 'Expérience & Formation' : 'Experience & Education'}>
                            {language === 'fr' ? 'Expérience & Formation' : 'Experience & Education'}
                        </h2>
                        <div className="timeline-container">
                            <div className="timeline-column">
                                <h3 className="timeline-column-title">{language === 'fr' ? 'Expérience Professionnelle' : 'Professional Experience'}</h3>
                                {cvData[language].experience.map((exp, index) => {
                                    const cardId = `exp-${index}`;
                                    const isOpen = openTimelineCards[cardId];
                                    return (
                                        <div key={index} className="timeline-card">
                                            <button
                                                className="timeline-header"
                                                onClick={() => toggleTimelineCard(cardId)}
                                            >
                                                <div className="timeline-title">{exp.title}</div>
                                                <div className="timeline-date">{exp.period}</div>
                                                <div className="timeline-toggle">
                                                    {isOpen ? '−' : '+'}
                                                </div>
                                            </button>
                                            <div className={`timeline-content ${isOpen ? 'open' : ''}`}>
                                                <div className="timeline-company">{exp.company}</div>
                                                <div className="timeline-description">{exp.description}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="timeline-column">
                                <h3 className="timeline-column-title">{language === 'fr' ? 'Formation' : 'Education'}</h3>
                                {cvData[language].education.map((edu, index) => {
                                    const cardId = `edu-${index}`;
                                    const isOpen = openTimelineCards[cardId];
                                    return (
                                        <div key={index} className="timeline-card">
                                            <button
                                                className="timeline-header"
                                                onClick={() => toggleTimelineCard(cardId)}
                                            >
                                                <div className="timeline-title">{edu.degree}</div>
                                                <div className="timeline-date">{edu.year}</div>
                                                <div className="timeline-toggle">
                                                    {isOpen ? '−' : '+'}
                                                </div>
                                            </button>
                                            <div className={`timeline-content ${isOpen ? 'open' : ''}`}>
                                                <div className="timeline-company">{edu.school}</div>
                                                <div className="timeline-description">{edu.description}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    <section id="certifications" className="cv-section">
                        <h2 className="section-title" data-text={language === 'fr' ? 'Certifications & Auto-formation' : 'Certifications & Self-Learning'}>
                            {language === 'fr' ? 'Certifications & Auto-formation' : 'Certifications & Self-Learning'}
                        </h2>
                        <div className="timeline-container">
                            <div className="timeline-column">
                                <h3 className="timeline-column-title">{language === 'fr' ? 'Certifications' : 'Certifications'}</h3>
                                {cvData[language].certifications.map((cert, index) => {
                                    const cardId = `cert-${index}`;
                                    const isOpen = openTimelineCards[cardId];
                                    return (
                                        <div key={index} className="timeline-card">
                                            <button
                                                className="timeline-header"
                                                onClick={() => toggleTimelineCard(cardId)}
                                            >
                                                <div className="timeline-title">{cert.category}</div>
                                                <div className="timeline-toggle">
                                                    {isOpen ? '−' : '+'}
                                                </div>
                                            </button>
                                            <div className={`timeline-content ${isOpen ? 'open' : ''}`}>
                                                <div className="certification-items">
                                                    {cert.items.map((item, itemIndex) => (
                                                        <div key={itemIndex} className="certification-item">
                                                            <div className="certification-name">{item.name}</div>
                                                            <div className="certification-date">{item.date}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="timeline-column">
                                <h3 className="timeline-column-title">{language === 'fr' ? 'Auto-formation' : 'Self-Learning'}</h3>
                                {cvData[language].selfLearning.map((platform, index) => {
                                    const cardId = `platform-${index}`;
                                    const isOpen = openTimelineCards[cardId];
                                    return (
                                        <div key={index} className="timeline-card">
                                            <button
                                                className="timeline-header"
                                                onClick={() => toggleTimelineCard(cardId)}
                                            >
                                                <div className="timeline-title">{platform.platform}</div>
                                                <div className="timeline-toggle">
                                                    {isOpen ? '−' : '+'}
                                                </div>
                                            </button>
                                            <div className={`timeline-content ${isOpen ? 'open' : ''}`}>
                                                {platform.categories.map((category, catIndex) => (
                                                    <div key={catIndex} className="category-section">
                                                        <div className="category-title">{category.name}</div>
                                                        <ul className="course-list">
                                                            {category.courses.map((course, courseIndex) => (
                                                                <li key={courseIndex} className="course-item">{course}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    <section id="projects" className="cv-section">
                        <h2 className="section-title" data-text={language === 'fr' ? 'Projets' : 'Projects'}>
                            {language === 'fr' ? 'Projets' : 'Projects'}
                        </h2>
                        <div className="projects-grid">
                            {cvData[language].projects.map((project, index) => (
                                <div key={index} className="project-card">
                                    <h3 className="project-title">{project.title}</h3>
                                    <p className="project-description">{project.description}</p>
                                    <div className="project-tech">
                                        {project.technologies.map((tech, techIndex) => (
                                            <span key={techIndex} className="tech-tag">{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section id="interests" className="cv-section">
                        <h2 className="section-title" data-text={language === 'fr' ? 'Centres d\'intérêt' : 'Interests'}>
                            {language === 'fr' ? 'Centres d\'intérêt' : 'Interests'}
                        </h2>
                        <div className="interests-grid">
                            {cvData[language].interests.map((interest, index) => (
                                <div key={index} className="interest-card">
                                    <div className="interest-icon">{interest.icon}</div>
                                    <h3 className="interest-title">{interest.title}</h3>
                                    <p className="interest-description">{interest.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            {showScrollButtons && (
                <div className="scroll-navigation">
                    <button onClick={scrollToTop}>⬆️</button>
                    <button onClick={scrollToBottom}>⬇️</button>
                </div>
            )}
        </div>
    );
};

export default CV; 