import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: var(--danger);
  color: white;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Icon = styled.span`
  font-size: 1.2rem;
`;

const Message = styled.p`
  margin: 0;
  font-size: 0.9rem;
`;

const ErrorMessage = ({ message }) => {
  return (
    <Container>
      <Icon>⚠️</Icon>
      <Message>{message}</Message>
    </Container>
  );
};

export default ErrorMessage; 