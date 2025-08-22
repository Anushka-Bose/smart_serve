import Hero from "./Hero"
import "./LandingPage.css"
import myImage1 from "../../assets/img1.jpg"
import myImage2 from "../../assets/img2.jpg"
import myImage3 from "../../assets/img3.jpg"
import myImage4 from "../../assets/img4.jpg"
import { useRef, useEffect } from 'react';
import { SwiperSlide } from "swiper/react"

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "2rem",
    textAlign: "center"
  },
  title: {
    fontSize: "2rem",
    marginBottom: "0.5rem"
  },
  subtitle: {
    fontSize: "1.1rem",
    marginBottom: "2rem"
  },
  swiperContainer: {
    width: "100%",
    height: "350px",
    marginBottom: "2rem"
  },
  slide: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%"
  },
  image: {
    width: "100%",
    height: "400px",
    objectFit: "cover",
    borderRadius: "10px"
  }
};

function ImageSwiper() {
  const swiperRef = useRef(null);

  useEffect(() => {
    const params = {
      pagination: { 
        clickable: true,
      },
      navigation: true,
      effect: 'cube',
      grabCursor: true,
      cubeEffect: {
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94,
      },
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
    };

    if (swiperRef.current) {
      Object.assign(swiperRef.current, params);
      swiperRef.current.initialize();
    }
  }, []);

  return (
    <swiper-container 
      ref={swiperRef}
      style={styles.swiperContainer}
      init="false"
    >
      <swiper-slide>
        <div style={styles.slide}>
          <img 
            src={myImage1} 
            alt="Surplus Food" 
            style={styles.image}
          />
        </div>
      </swiper-slide>
      <swiper-slide>
        <div style={styles.slide}>
          <img 
            src={myImage2} 
            alt="AI Prediction" 
            style={styles.image}
          />
        </div>
      </swiper-slide>
      <swiper-slide>
        <div style={styles.slide}>
          <img 
            src={myImage3} 
            alt="Food distribution" 
            style={styles.image}
          />
        </div>
      </swiper-slide>
      <swiper-slide>
        <div style={styles.slide}>
          <img 
            src={myImage4} 
            alt="Innocent Smiles" 
            style={styles.image}
          />
        </div>
      </swiper-slide>
    </swiper-container>
  );
}

export default function LandingPage() {
  return (
    <>
      {/* -----HERO SECTION----- */}
      <Hero/>
      {/* -----FEATURES----- */}
      <section className="features" id="features">
        <div style={styles.container}>
          <h2 style={styles.title}>How Smart Serve Works</h2>
          <p style={styles.subtitle}>Our platform connects food donors with recipients to reduce waste and fight hunger</p>
          <ImageSwiper />
          <div className="features-grid">
            <div className="feature-card">
              <h3><i className="fas fa-brain"></i> AI-Powered Predictions</h3>
              <p>Our smart prediction engine forecasts food surplus and determines safe consumption windows to minimize waste.</p>
            </div>
            <div className="feature-card">
              <h3><i className="fas fa-utensils"></i> Food Redistribution</h3>
              <p>Connect with local NGOs, students, and food stalls to efficiently redistribute surplus food to those who need it.</p>
            </div>
            <div className="feature-card">
              <h3><i className="fas fa-chart-line"></i> Analytics & Reporting</h3>
              <p>Track your impact with detailed analytics and leaderboards that show how much food you've saved from waste.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}