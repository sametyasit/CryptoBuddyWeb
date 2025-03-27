import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
`;

const Title = styled.h1`
  color: var(--text);
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const Card = styled.div`
  background: var(--cardBackground);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Description = styled.p`
  color: var(--text);
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ComingSoon = styled.div`
  text-align: center;
  padding: 4rem 0;
  color: var(--primary);
  font-size: 1.5rem;
  font-weight: 600;
`;

const AIBasket = () => {
  return (
    <Container>
      <Title>Yapay Zeka Sepeti</Title>
      <Card>
        <Description>
          Yapay zeka destekli kripto para analizi ve portföy önerileri yakında sizlerle!
          Bu özellik sayesinde:
        </Description>
        <ul>
          <li>Piyasa trendlerinin analizi</li>
          <li>Kişiselleştirilmiş yatırım önerileri</li>
          <li>Risk analizi ve portföy optimizasyonu</li>
          <li>Otomatik alım-satım stratejileri</li>
          <li>Gerçek zamanlı piyasa uyarıları</li>
        </ul>
        <ComingSoon>
          Çok Yakında!
        </ComingSoon>
      </Card>
    </Container>
  );
};

export default AIBasket; 