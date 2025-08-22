import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "./Hero.css"

const Hero = () => {
  const navigate = useNavigate();
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);
  
  const phrases = [
    "Save Food,",
    "Share Smiles,",
    "Reduce Waste,"
  ];

  useEffect(() => {
    const handleTyping = () => {
      const currentPhrase = phrases[currentPhraseIndex];
      
      if (isDeleting) {
        // Delete text
        setCurrentText(currentPhrase.substring(0, currentText.length - 1));
        setTypingSpeed(50); // Faster when deleting
      } else {
        // Type text
        setCurrentText(currentPhrase.substring(0, currentText.length + 1));
        setTypingSpeed(150); // Normal typing speed
      }
      
      // Check if we've finished typing or deleting
      if (!isDeleting && currentText === currentPhrase) {
        // Pause at the end of typing
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && currentText === '') {
        // Move to next phrase after deleting
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIndex, phrases, typingSpeed]);

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h2>
            <span className="hero-header">
              {currentText}
              <span className="cursor">|</span>
            </span>
            <span className="hero-subheader">Feed Communities</span>
          </h2>
          
          {/* Progress indicators */}
          <div className="phrase-indicators">
            {phrases.map((_, index) => (
              <div 
                key={index}
                className={`indicator ${index === currentPhraseIndex ? 'active' : ''}`}
              ></div>
            ))}
          </div>
        </div>
        
        <p>Join our initiative to reduce food waste and help those in need through our smart food management platform</p>
        
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={handleGetStarted}>
            Get Started
          </button>
          <button className="btn btn-secondary" onClick={handleLearnMore}>
            Learn More
          </button>
        </div>
      </div>
      
      <div className="hero-visual">
        <div className="food-icon">
          <i className="fas fa-apple-alt"></i>
        </div>
        <div className="food-icon">
          <i className="fas fa-bread-slice"></i>
        </div>
        <div className="food-icon">
          <i className="fas fa-carrot"></i>
        </div>
        <div className="hero-graphic">
          <div className="circle"></div>
          <div className="wave"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;