import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--text);
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid var(--border);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: var(--subText);
  font-size: 1rem;
  margin: 0;
`;

const Loading = ({ message = 'Yükleniyor...' }) => {
  return (
    <Container>
      <Spinner />
      <Message>{message}</Message>
    </Container>
  );
};

export default Loading; 