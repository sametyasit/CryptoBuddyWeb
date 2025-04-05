import React from 'react';
import styled from 'styled-components';
import CoinList from '../components/CoinList';

const Container = styled.div`
  min-height: 100vh;
  background: var(--background);
`;

const Header = styled.header`
  background: var(--secondary);
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(to right, var(--primary), #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: var(--subText);
  max-width: 600px;
  margin: 0 auto;
`;

const Home = () => {
  return (
    <Container>
      <Header>
        <Title>Kripto Para Piyasası</Title>
        <Subtitle>
          En güncel kripto para fiyatları, piyasa değerleri ve hacim bilgileri.
          Veriler CoinGecko API'sinden düzenli olarak güncellenmektedir.
        </Subtitle>
      </Header>
      <CoinList />
    </Container>
  );
};

export default Home; 