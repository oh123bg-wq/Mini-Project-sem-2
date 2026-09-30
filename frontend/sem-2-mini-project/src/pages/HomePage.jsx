import { BookOpen, Code, FileText, Zap, ArrowRight } from 'lucide-react';
import '../assets/css/HomePage.css';

const HomePage = () => {
    return (
        <div className="homepage-container">
            {/* Navigation Bar */}
            {/* <nav className="homepage-navbar">
                <div className="logo-group">
                    <BookOpen size={28} color="#4F46E5" />
                    <span className="logo-text">DevNotes</span>
                </div>
                <div className="nav-links">
                    <a href="/login" className="btn-login">Sign In</a>
                    <a href="/register" className="btn-register">Get Started</a>
                </div>
            </nav> */}

            {/* Hero Section */}
            <section className="hero-section">
                {/* <div className="hero-badge">
                    <Zap size={14} color="#4F46E5" />
                    <span>The Ultimate Note Application for Developers</span>
                </div> */}
                <h1 className="hero-title">
                    Organize Your Code, Notes & <br />
                    <span>Cheatsheets in One Place</span>
                </h1>
                <p className="hero-subtitle">
                    DevNotes helps developers streamline their learning, document daily code snippets, and manage class notes seamlessly with speed and privacy.
                </p>
                <div className="hero-cta">
                    <a href="/register" className="cta-primary">
                        Register <ArrowRight size={18} />
                    </a>
                    <a href="/login" className="cta-secondary">
                        Existing User? Sign In
                    </a>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2 className="section-title">Everything You Need to Stay Organized</h2>
                
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="icon-box icon-indigo">
                            <BookOpen size={24} color="#4F46E5" />
                        </div>
                        <h3 className="feature-title">Class Notes</h3>
                        <p className="feature-desc">
                            Keep structured documentation of your study materials, lecture summaries, and main concepts.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="icon-box icon-emerald">
                            <Code size={24} color="#059669" />
                        </div>
                        <h3 className="feature-title">Code Snippets</h3>
                        <p className="feature-desc">
                            Save frequently used code blocks, configurations, and syntax templates for rapid development.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="icon-box icon-amber">
                            <FileText size={24} color="#D97706" />
                        </div>
                        <h3 className="feature-title">Quick Cheatsheets</h3>
                        <p className="feature-desc">
                            Build handy reference guides for commands, shortcut keys, and APIs that you can lookup anytime.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="homepage-footer">
                <p>© 2026 DevNotes. Built for Developers.</p>
            </footer>
        </div>
    );
};

export default HomePage;