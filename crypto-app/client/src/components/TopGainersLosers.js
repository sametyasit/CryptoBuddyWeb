import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';

const Container = styled.div`
  background-color: var(--cardBackground);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`;

const CoinItem = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  border-bottom: 1px solid var(--border);
  text-decoration: none;
  color: var(--text);
  transition: background-color 0.3s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: var(--foreground);
  }
`;

const CoinInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const CoinImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const CoinName = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
`;

const Symbol = styled.span`
  color: var(--subText);
  font-size: 0.8rem;
  text-transform: uppercase;
`;

const PriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Price = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
`;

const Change = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
  color: ${props => props.isPositive ? 'var(--success)' : 'var(--danger)'};
  font-size: 0.8rem;
  font-weight: 600;
`;

const EmptyState = styled.div`
  padding: 1rem;
  text-align: center;
  color: var(--subText);
  font-size: 0.9rem;
`;

const formatCurrency = (value) => {
  if (value === undefined || value === null) return 'N/A';
  
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'USD',
    notation: value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: value < 1 ? 6 : 2
  }).format(value);
};

const formatPercentage = (value) => {
  if (value === undefined || value === null) return 'N/A';
  return `${Math.abs(value).toFixed(2)}%`;
};

const TopGainersLosers = ({ coins = [], type = 'gainers' }) => {
  if (!coins || coins.length === 0) {
    return (
      <Container>
        <EmptyState>Henüz veri yok.</EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      {coins.map(coin => (
        <CoinItem key={coin.id} to={`/coin/${coin.id}`}>
          <CoinInfo>
            <CoinImage src={coin.image} alt={coin.name} />
            <CoinName>
              <Name>{coin.name}</Name>
              <Symbol>{coin.symbol}</Symbol>
            </CoinName>
          </CoinInfo>
          <PriceInfo>
            <Price>{formatCurrency(coin.current_price)}</Price>
            <Change isPositive={coin.price_change_percentage_24h > 0}>
              {coin.price_change_percentage_24h > 0 ? (
                <FaCaretUp />
              ) : (
                <FaCaretDown />
              )}
              {formatPercentage(coin.price_change_percentage_24h)}
            </Change>
          </PriceInfo>
        </CoinItem>
      ))}
    </Container>
  );
};

export default TopGainersLosers; 