import React, { useState, useEffect } from 'react';
import UltraLuxuryTransition from './UltraLuxuryTransition';
import styled from 'styled-components';
import { FaBitcoin, FaEthereum, FaChartLine } from 'react-icons/fa';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #111;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  background: linear-gradient(45deg, #ffd700, #e6b800);
  color: black;
  border: none;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 25px rgba(255, 215, 0, 0.7);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  color: white;
`;

const Header = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(to right, #ffd700, #ffcc00, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  text-align: center;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 10px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(255, 215, 0, 0.3);
    border-color: rgba(255, 215, 0, 0.6);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #ffd700;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: #e0e0e0;
  line-height: 1.5;
`;

const LuxuryExamplePage = () => {
  const [showTransition, setShowTransition] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    // When first loaded, show the component for a brief moment
    setLoaded(true);
    setShowTransition(true);
    
    // Hide it after 5 seconds to let user see it and interact
    const timer = setTimeout(() => {
      setShowTransition(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleShowTransition = () => {
    setShowTransition(true);
  };
  
  const handleAnimationComplete = () => {
    console.log('Animation completed!');
    // You could automatically hide it here if needed
    // setTimeout(() => setShowTransition(false), 3000);
  };
  
  return (
    <Container>
      {!showTransition && loaded && (
        <Button onClick={handleShowTransition}>
          Show Ultra Luxury Transition
        </Button>
      )}
      
      <UltraLuxuryTransition 
        isVisible={showTransition}
        onAnimationComplete={handleAnimationComplete}
      >
        <ContentWrapper>
          <Header>CryptoBuddy Premium Experience</Header>
          
          <Description>
            Elevate your crypto journey with our exclusive premium features designed to give you the competitive edge in the market.
          </Description>
          
          <FeaturesGrid>
            <FeatureCard>
              <FeatureTitle>
                <FaBitcoin size={24} /> Advanced Bitcoin Analysis
              </FeatureTitle>
              <FeatureDescription>
                Get real-time insights on Bitcoin's market movements with our proprietary prediction algorithms and trend analysis.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureTitle>
                <FaEthereum size={24} /> Ethereum Smart Contract Alerts
              </FeatureTitle>
              <FeatureDescription>
                Receive instant notifications about significant smart contract activities and potential DeFi opportunities.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureTitle>
                <FaChartLine size={24} /> AI-Powered Portfolio Management
              </FeatureTitle>
              <FeatureDescription>
                Let our advanced AI analyze your portfolio and suggest optimal adjustments based on market conditions and your risk profile.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </ContentWrapper>
      </UltraLuxuryTransition>
    </Container>
  );
};

export default LuxuryExamplePage; 