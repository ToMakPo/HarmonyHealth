import { ThemeProvider } from './ThemeProvider';

import harmonyLogo from './assets/harmony logo.svg';
import harmonyTitle from './assets/harmony title.svg';
import heroImage from './assets/hero_image.png';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      {/* Main layout and homepage mockup */}
      <div className="main-layout">
        <header className="header">
          <h1>
            <img src={harmonyLogo} alt="Harmony Health Logo" className="harmony-logo" />
            <img src={harmonyTitle} alt="Harmony Health Title" className="harmony-title" />
          </h1>
        </header>

        <main className="main-content">
          {/* Hero Section */}
          <section className="hero-section">
            <img src={heroImage} alt="Harmony Health Hero" className="hero-image" />
            <h2>Welcome to Harmony Health</h2>
            <p>Personalized care for your health and beauty needs.</p>
            <button className="cta-button">Book Appointment</button>
          </section>

          {/* Services Section */}
          <section className="services-section">
            <h2>Our Services</h2>
            <ul className="services-list">
              <li>Facials & Skin Care</li>
              <li>Injectables & Fillers</li>
              <li>Wellness Consultations</li>
              <li>Laser Treatments</li>
            </ul>
          </section>

          {/* Testimonials Section */}
          <section className="testimonials-section">
            <h2>Testimonials</h2>
            <blockquote>“I feel radiant and confident after every visit!”</blockquote>
            <blockquote>“Professional, caring, and results-driven.”</blockquote>
          </section>

          {/* Contact Section */}
          <section className="contact-section">
            <h2>Contact Us</h2>
            <p>Email: info@harmonyhealth.com</p>
            <p>Phone: (555) 123-4567</p>
          </section>
        </main>

        <footer className="footer">
          <small>&copy; 2025 Harmony Health & Beauty Clinic</small>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default App;
