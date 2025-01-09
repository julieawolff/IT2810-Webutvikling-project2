import { useEffect, useState } from 'react';
import './LandingPage.css';
import StandardButton from '../../components/StandardButton/StandardButton';
import { useNavigate } from 'react-router-dom';
import { useUsername } from '../../hooks/useUsername';
import { useTheme } from '@mui/material';

/**
 * LandingPage Component
 * Displays the landing page of the application
 * Contains 3 decorativ images, a welcome message and a button to get started
 */
function LandingPage() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const username = useUsername();
  const theme = useTheme();

  const [phraseIndex, setPhraseIndex] = useState(0);

  // Display welcome message with typewriter effect
  useEffect(() => {
    const phrases = [
      '"Unleash a world of cocktails tailored to every taste."',
      '"Shaken, stirred, or straight up — dive into expertly curated cocktails designed to elevate every occasion."',
      '"Find inspiration, try new flavors, and enjoy the art of mixology."',
      '"Ready to shake things up?”',
      '"From timeless classics to daring new flavors—cocktails for every craving."',
    ];
    let letterIndex = 0;

    const interval = setInterval(() => {
      setText(() => phrases[phraseIndex].slice(0, letterIndex + 1));
      letterIndex++;

      if (letterIndex === phrases[phraseIndex].length) {
        clearInterval(interval);
        setTimeout(() => {
          setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
          setText('');
        }, 1500);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [phraseIndex]);

  return (
    <main className="main-container">
      <section className="circle-container">
        <div className="circle circle1" role="img" aria-label="Image of lemon"></div>
        <div className="circle circle2" role="img" aria-label="Image of bar"></div>
        <div className="circle circle3" role="img" aria-label="Image of cocktails"></div>
      </section>
      <section className="text-container">
        <h1 className="header"> Shaken & Stirred </h1>
        <p className="welcome-phrase">{text}</p>
        <StandardButton
          text="Get Started"
          onClick={() => (username ? navigate(`/home`) : navigate(`/login`))}
          width={{ xs: '35vw', sm: '30vw', md: '24vw', lg: '20vw' }}
          height={{ xs: '7vh', sm: '7vh', md: '7vh' }}
          color={theme.palette.primary.light}
        ></StandardButton>
      </section>
    </main>
  );
}

export default LandingPage;
