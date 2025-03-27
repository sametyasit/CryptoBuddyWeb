import React from 'react';
import styled from 'styled-components';
import { FaBitcoin, FaChartLine, FaShieldAlt, FaUsers } from 'react-icons/fa';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Hero = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  padding: 3rem 0;
  background: linear-gradient(to bottom, rgba(255, 215, 0, 0.1), transparent);
  border-radius: 10px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  
  span {
    color: var(--primary);
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: var(--subText);
  max-width: 800px;
  margin: 0 auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const FeatureCard = styled.div`
  background: var(--cardBackground);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: var(--subText);
`;

const TeamSection = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 3px;
    background: var(--primary);
  }
`;

const About = () => {
  return (
    <Container>
      <Hero>
        <Title>
          Hakkımızda - <span>CryptoBuddy</span>
        </Title>
        <Subtitle>
          Kripto para dünyasında güvenilir ve kullanıcı dostu bir platform oluşturma vizyonuyla yola çıktık.
        </Subtitle>
      </Hero>

      <FeaturesGrid>
        <FeatureCard>
          <FeatureIcon>
            <FaBitcoin />
          </FeatureIcon>
          <FeatureTitle>Gerçek Zamanlı Veriler</FeatureTitle>
          <FeatureDescription>
            En güncel kripto para verilerini ve piyasa analizlerini anlık olarak takip edin.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <FaChartLine />
          </FeatureIcon>
          <FeatureTitle>Gelişmiş Analiz Araçları</FeatureTitle>
          <FeatureDescription>
            Teknik analiz araçları ve detaylı grafiklerle yatırımlarınızı yönetin.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <FaShieldAlt />
          </FeatureIcon>
          <FeatureTitle>Güvenli Platform</FeatureTitle>
          <FeatureDescription>
            En yüksek güvenlik standartlarıyla verilerinizi koruyoruz.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <FaUsers />
          </FeatureIcon>
          <FeatureTitle>Topluluk Odaklı</FeatureTitle>
          <FeatureDescription>
            Kripto para topluluğuyla etkileşime geçin ve deneyimlerinizi paylaşın.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesGrid>

      <TeamSection>
        <SectionTitle>Vizyonumuz</SectionTitle>
        <Subtitle>
          CryptoBuddy olarak, kripto para piyasalarını herkes için erişilebilir kılmayı ve 
          kullanıcılarımıza en iyi yatırım deneyimini sunmayı hedefliyoruz. Güvenilir, 
          şeffaf ve kullanıcı dostu bir platform olma vizyonuyla çalışıyoruz.
        </Subtitle>
      </TeamSection>
    </Container>
  );
};

export default About; 