import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background-color: var(--cardBackground);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Icon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const NameContainer = styled.div`
  flex: 1;
`;

const Name = styled.h3`
  color: var(--text);
  margin: 0;
  font-size: 1.1rem;
`;

const Symbol = styled.span`
  color: var(--subText);
  font-size: 0.9rem;
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Price = styled.span`
  color: var(--text);
  font-size: 1.2rem;
  font-weight: 600;
`;

const PriceChange = styled.span`
  color: ${props => props.isPositive ? 'var(--success)' : 'var(--danger)'};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &::before {
    content: ${props => props.isPositive ? '"↑"' : '"↓"'};
  }
`;

const MarketCap = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  color: var(--subText);
  font-size: 0.9rem;
`;

const CoinCard = ({ coin }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };
  
  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${(marketCap / 1e3).toFixed(2)}K`;
    }
  };
  
  return (
    <Card to={`/coin/${coin.id}`}>
      <Header>
        <Icon src={coin.image} alt={coin.name} />
        <NameContainer>
          <Name>{coin.name}</Name>
          <Symbol>{coin.symbol.toUpperCase()}</Symbol>
        </NameContainer>
      </Header>
      
      <PriceContainer>
        <Price>{formatPrice(coin.current_price)}</Price>
        <PriceChange isPositive={coin.price_change_percentage_24h > 0}>
          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
          <span>24s</span>
        </PriceChange>
      </PriceContainer>
      
      <MarketCap>
        Market Cap: {formatMarketCap(coin.market_cap)}
      </MarketCap>
    </Card>
  );
};

export default CoinCard; 