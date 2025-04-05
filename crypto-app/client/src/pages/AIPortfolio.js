import React, { useState } from 'react';
import styled from 'styled-components';
import { FaRobot, FaChartLine, FaCoins, FaShieldAlt } from 'react-icons/fa';

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
  margin: 0 auto 2rem;
`;

const Form = styled.form`
  max-width: 600px;
  margin: 0 auto;
  background: var(--cardBackground);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: var(--shadow);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text);
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid var(--border);
  border-radius: 4px;
  background: var(--background);
  color: var(--text);
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid var(--border);
  border-radius: 4px;
  background: var(--background);
  color: var(--text);
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background: var(--primary);
  color: var(--secondary);
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
  }

  &:disabled {
    background: var(--border);
    cursor: not-allowed;
    transform: none;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 4rem 0;
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

const AIPortfolio = () => {
  const [formData, setFormData] = useState({
    investment: '',
    risk: 'moderate',
    duration: '6',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Yapay zeka portföy önerisi oluşturma işlemi
    console.log('Form data:', formData);
  };

  return (
    <Container>
      <Hero>
        <Title>
          Yapay Zeka <span>Portföy Yönetimi</span>
        </Title>
        <Subtitle>
          Yapay zeka teknolojimiz ile kişiselleştirilmiş kripto para portföyünüzü oluşturun.
          Risk toleransınıza ve yatırım hedeflerinize göre özel öneriler alın.
        </Subtitle>
      </Hero>

      <FeaturesGrid>
        <FeatureCard>
          <FeatureIcon>
            <FaRobot />
          </FeatureIcon>
          <FeatureTitle>Akıllı Analiz</FeatureTitle>
          <FeatureDescription>
            Yapay zeka algoritmalarımız piyasayı sürekli analiz eder ve en iyi fırsatları belirler.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <FaChartLine />
          </FeatureIcon>
          <FeatureTitle>Risk Yönetimi</FeatureTitle>
          <FeatureDescription>
            Risk toleransınıza göre dengeli ve çeşitlendirilmiş portföy önerileri sunar.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <FaCoins />
          </FeatureIcon>
          <FeatureTitle>Portföy Optimizasyonu</FeatureTitle>
          <FeatureDescription>
            Portföyünüzü sürekli optimize eder ve piyasa koşullarına göre güncellemeler önerir.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <FaShieldAlt />
          </FeatureIcon>
          <FeatureTitle>Güvenli Yatırım</FeatureTitle>
          <FeatureDescription>
            En güvenilir kripto paralarla portföy oluşturur ve riskleri minimize eder.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesGrid>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Yatırım Miktarı (USD)</Label>
          <Input
            type="number"
            name="investment"
            value={formData.investment}
            onChange={handleChange}
            placeholder="Örn: 1000"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Risk Seviyesi</Label>
          <Select
            name="risk"
            value={formData.risk}
            onChange={handleChange}
            required
          >
            <option value="conservative">Düşük Risk</option>
            <option value="moderate">Orta Risk</option>
            <option value="aggressive">Yüksek Risk</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Yatırım Süresi (Ay)</Label>
          <Select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          >
            <option value="3">3 Ay</option>
            <option value="6">6 Ay</option>
            <option value="12">12 Ay</option>
            <option value="24">24 Ay</option>
          </Select>
        </FormGroup>

        <Button type="submit">
          Yapay Zeka Portföyü Oluştur
        </Button>
      </Form>
    </Container>
  );
};

export default AIPortfolio; 