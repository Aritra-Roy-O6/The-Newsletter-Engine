import React, { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

// --- Keyframe Animations ---
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Animation for scroll unrolling
const unrollAnimation = keyframes`
  0% {
    height: 0;
    border-bottom-width: 0px;
  }
  100% {
    height: 120px; /* Height for the text content area */
    border-bottom-width: 30px; /* This acts as the bottom roller */
  }
`;

// Animation for text fading in on the scroll
const fadeInTextAnimation = keyframes`
  0%, 40% { /* Text starts appearing after scroll is partially unrolled */
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;


// --- Loading Screen Styled Components ---
const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(243, 234, 211, 0.9); /* Semi-transparent parchment */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* Ensure it's on top of everything */
  opacity: 0;
  animation: ${fadeIn} 0.3s ease-out forwards;
`;

const ScrollWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  filter: drop-shadow(3px 5px 8px rgba(0,0,0,0.25)); /* A bit more pronounced shadow */
`;

const ScrollTopRoller = styled.div`
  width: 250px; /* Width of the roll */
  height: 30px;
  background: #A07855; /* Wooden color for the roller */
  border: 2px solid #5D3A1A; /* Darker border for definition */
  border-bottom: none; /* Top roller doesn't have a bottom border itself */
  border-radius: 15px 15px 0 0; /* Rounded top edges */
  box-shadow: inset 0px 5px 5px rgba(0,0,0,0.1), inset 0px -2px 2px rgba(0,0,0,0.05); /* Inner shadow for depth */
`;

const ScrollPaper = styled.div`
  width: 230px; /* Slightly narrower than the roller */
  background-color: #FAF0E6; /* Lighter parchment for the paper itself */
  border-left: 2px solid #D2B48C; /* Side borders for the paper */
  border-right: 2px solid #D2B48C;
  /* The bottom border animates to become the bottom roller */
  border-bottom: 0px solid #A07855; /* Starts with 0 width, same color as top roller */
  box-shadow: 0px 2px 3px rgba(0,0,0,0.1); /* Subtle shadow beneath the paper */
  overflow: hidden; /* Important to hide text until paper unrolls */
  height: 0; /* Starts with 0 height, animates with keyframes */
  animation: ${unrollAnimation} 1.5s ease-out forwards 0.2s; /* 1.5s duration, 0.2s delay after overlay fades in */
  position: relative; /* For positioning text inside */
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box; /* Ensures padding/border are included correctly */
`;

const LoadingText = styled.p`
  font-family: 'Garamond', serif;
  font-size: 1.2rem; /* Slightly larger for readability */
  font-style: italic;
  color: #5D3A1A; /* Dark Sepia text */
  text-align: center;
  padding: 15px; /* Padding around the text */
  opacity: 0; /* Starts hidden */
  animation: ${fadeInTextAnimation} 0.8s ease-in forwards 0.8s; /* Text fades in after scroll starts unrolling (0.2s + 0.6s delay) */
`;

// --- Original Styled Components ---
const PageWrapper = styled.div`
  background-color: #F3EAD3; /* Parchment background */
  animation: ${fadeIn} 1s ease-in; /* Initial page fade in */
  min-height: 100vh; /* Ensure wrapper takes full height */
  position: relative; /* For potential absolute positioning of children if needed */
`;

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 65vh;
  background: linear-gradient(135deg, #D2B48C 0%, #E8D8C0 100%);
  color: #5D3A1A;
  text-align: center;
  padding: 5rem 1.5rem 4rem 1.5rem;
  position: relative;
  border-bottom: 2px solid #A07855;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const AppName = styled.h1`
  font-family: 'IM Fell English SC', serif;
  font-size: 4rem;
  font-weight: 400;
  margin-bottom: 1.5rem;
  letter-spacing: 1px;
  color: #4A2C18;
  text-shadow: 1px 1px 2px rgba(243, 234, 211, 0.5);

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const Tagline = styled.p`
  font-family: 'Garamond', serif;
  font-size: 1.5rem;
  font-style: italic;
  font-weight: 400;
  margin-bottom: 3rem;
  color: #5D3A1A;
  max-width: 600px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const GetStartedButton = styled.button`
  font-family: 'IM Fell English SC', serif;
  background: #704214;
  color: #F3EAD3;
  font-size: 1.4rem;
  padding: 0.8rem 2rem;
  border: 1px solid #5D3A1A;
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
  letter-spacing: 0.5px;

  &:hover {
    background-color: #5D3A1A;
    color: #FAF0E6;
    transform: translateY(-1px);
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
  }
`;

const FeaturesSection = styled.section`
  background: #F3EAD3;
  padding: 4rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const SectionTitle = styled.h2`
  font-family: 'IM Fell English SC', serif;
  font-size: 2.8rem;
  margin-bottom: 3rem;
  color: #4A2C18;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  max-width: 1000px;
  width: 100%;
`;

const FeatureCardWrapper = styled.div`
  position: relative;
`;

const FeatureCard = styled.div`
  background: #E8D8C0;
  border: 1px solid #A07855;
  border-radius: 4px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #704214;
`;

const FeatureTitle = styled.h3`
  font-family: 'IM Fell English SC', serif;
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: #5D3A1A;
`;

const FeatureDescOriginal = styled.p`
  font-family: 'Garamond', serif;
  font-size: 1rem;
  color: #5D3A1A;
  line-height: 1.6;
  opacity: 1;
  transition: opacity 0.3s ease;
`;

const FeatureDescEnglish = styled.p`
  font-family: 'Garamond', serif;
  font-size: 1rem;
  color: #5D3A1A;
  line-height: 1.6;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const featuresData = [
  { icon: '✍️', title: 'Craft by Hand & Eye', original: 'Fashion thy missives with graceful ease, as a scribe doth pen a noble scroll.', english: 'Write your messages easily, like a scribe writing on parchment.' },
  { icon: '📜', title: 'A Swift Glimpse Forth', original: 'Behold thy creation ere it is sent, its form foreseen upon the instant.', english: 'See your newsletter before sending it, knowing exactly how it looks.' },
  { icon: '📤', title: 'Transcribe to Digital Scroll', original: 'Render forth thy work in purest HTML, ready for the King\'s own messengers.', english: 'Convert your work into clean HTML, ready for email delivery.' },
  { icon: '🎨', title: 'Bespoke Adornments', original: 'Embellish with headers, images, and missives of choice, each wrought to thy very will.', english: 'Customize with headers, images, and your own text, tailored to your needs.' },
  { icon: '🌓', title: 'Day\'s Hue & Night\'s Veil', original: 'Shift thy view \'twixt light and shade, for comfort in thy timely craft.', english: 'Switch between light and dark mode for comfortable writing at any time.' },
  { icon: '🗝️', title: 'Enter Freely, Unfettered', original: 'Commence thy work forthwith, no tiresome registry doth bar thy passage.', english: 'Start creating immediately, without any registration required.' },
];

// Loading Screen Component Definition
const LoadingScreen: React.FC = () => (
  <LoadingOverlay>
    <ScrollWrapper>
      <ScrollTopRoller />
      <ScrollPaper>
        <LoadingText>Unfurling the Parchment...</LoadingText>
      </ScrollPaper>
    </ScrollWrapper>
  </LoadingOverlay>
);

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCommenceCreation = () => {
    setIsLoading(true);
    setTimeout(() => {
      // No need to setIsLoading(false) if we are navigating away
      navigate('/builder');
    }, 2000); // Total time for loading screen
  };

  return (
    <PageWrapper>
      {isLoading && <LoadingScreen />}
      <Hero>
        <img src="./scroll-icon.png" width="150" height="150" alt="Scroll Icon"/> 
        <AppName>The Newsletter Engine</AppName>
        <Tagline>"Hark, what words through yonder window break? 'Tis thy missive, crafted with art and grace!"</Tagline>
        <GetStartedButton onClick={handleCommenceCreation}>Commence Thy Creation</GetStartedButton>
      </Hero>
      <FeaturesSection>
        <SectionTitle>Behold Its Virtues</SectionTitle>
        <FeaturesGrid>
          {featuresData.map((feature, index) => (
            <FeatureCardWrapper key={index} onMouseEnter={(e) => {
              const card = e.currentTarget.querySelector('p:first-child') as HTMLElement | null;
              const englishDesc = e.currentTarget.querySelector('p:last-child') as HTMLElement | null;
              if (card && englishDesc) {
                card.style.opacity = '0';
                englishDesc.style.opacity = '1';
              }
            }}
            onMouseLeave={(e) => {
              const card = e.currentTarget.querySelector('p:first-child') as HTMLElement | null;
              const englishDesc = e.currentTarget.querySelector('p:last-child') as HTMLElement | null;
              if (card && englishDesc) {
                card.style.opacity = '1';
                englishDesc.style.opacity = '0';
              }
            }}>
              <FeatureCard>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescOriginal>{feature.original}</FeatureDescOriginal>
                <FeatureDescEnglish>{feature.english}</FeatureDescEnglish>
              </FeatureCard>
            </FeatureCardWrapper>
          ))}
        </FeaturesGrid>
      </FeaturesSection>
    </PageWrapper>
  );
};

export default LandingPage;