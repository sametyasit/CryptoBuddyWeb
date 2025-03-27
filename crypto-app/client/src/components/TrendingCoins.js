import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaFire, FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { coinAPI } from '../services/api';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';

const Container = styled.div`
  background-color: var(--cardBackground);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  border-bottom: 1px solid var(--border);
  background-color: var(--foreground);
`;

const HeaderTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: var(--primary);
  }
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
  padding: 1.5rem;
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
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

const TrendingCoins = () => {
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Gerçek API'den trend coinleri alabilirsiniz
        // const data = await coinAPI.getTrendingCoins();
        
        // Şimdilik örnek veriler kullanıyoruz
        const mockTrendingCoins = [
          {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'btc',
            image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
            current_price: 52000,
            price_change_percentage_24h: 2.5
          },
          {
            id: 'ethereum',
            name: 'Ethereum',
            symbol: 'eth',
            image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
            current_price: 3100,
            price_change_percentage_24h: 3.2
          },
          {
            id: 'solana',
            name: 'Solana',
            symbol: 'sol',
            image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
            current_price: 140,
            price_change_percentage_24h: 5.8
          },
          {
            id: 'dogecoin',
            name: 'Dogecoin',
            symbol: 'doge',
            image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
            current_price: 0.12,
            price_change_percentage_24h: -1.2
          },
          {
            id: 'cardano',
            name: 'Cardano',
            symbol: 'ada',
            image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
            current_price: 0.55,
            price_change_percentage_24h: 1.8
          }
        ];
        
        setTrendingCoins(mockTrendingCoins);
      } catch (err) {
        console.error('Trend coinler alınırken hata oluştu:', err);
        setError('Trend coinler alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingCoins();
  }, []);
  
  if (loading) {
    return (
      <Container>
        <EmptyState>
          <Loading message="Trend Coinler yükleniyor..." />
        </EmptyState>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <EmptyState>
          <ErrorMessage message={error} />
        </EmptyState>
      </Container>
    );
  }

  if (!trendingCoins || trendingCoins.length === 0) {
    return (
      <Container>
        <EmptyState>Trend coin verisi bulunamadı.</EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderTitle>
          <FaFire /> Trend Coinler
        </HeaderTitle>
      </Header>
      
      {trendingCoins.map(coin => (
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

export default TrendingCoins; 