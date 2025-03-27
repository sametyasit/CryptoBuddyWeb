import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px);
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  color: var(--text);
  font-size: 4rem;
  margin: 0 0 1rem 0;
  
  span {
    color: var(--primary);
  }
`;

const Subtitle = styled.p`
  color: var(--subText);
  font-size: 1.2rem;
  margin: 0 0 2rem 0;
`;

const HomeButton = styled(Link)`
  display: inline-block;
  background-color: var(--primary);
  color: var(--secondary);
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

const NotFound = () => {
  return (
    <Container>
      <Title>
        <span>404</span> Sayfa Bulunamadı
      </Title>
      <Subtitle>
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </Subtitle>
      <HomeButton to="/">
        Ana Sayfaya Dön
      </HomeButton>
    </Container>
  );
};

export default NotFound; 