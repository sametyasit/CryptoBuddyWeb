import React from 'react';
import styled from 'styled-components';
import { FaBitcoin, FaExchangeAlt, FaChartLine, FaPercentage } from 'react-icons/fa';

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background-color: var(--cardBackground);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => `var(--${props.color || 'primary'})`};
  color: var(--secondary);
`;

const StatTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--subText);
  margin: 0;
`;

const StatValue = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0.5rem 0;
`;

const StatSubvalue = styled.p`
  font-size: 0.9rem;
  color: ${props => props.isPositive ? 'var(--success)' : props.isNegative ? 'var(--danger)' : 'var(--subText)'};
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const formatNumber = (num, options = {}) => {
  if (num === undefined || num === null) return 'N/A';
  
  const { style = 'decimal', notation = 'standard', minimumFractionDigits = 0, maximumFractionDigits = 2 } = options;
  
  return new Intl.NumberFormat('tr-TR', {
    style,
    notation,
    minimumFractionDigits,
    maximumFractionDigits,
    currency: style === 'currency' ? 'USD' : undefined
  }).format(num);
};

const formatPercentage = (num) => {
  if (num === undefined || num === null) return 'N/A';
  return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
};

const GlobalStats = ({ data }) => {
  // Global veriler için mockup değerler
  const mockGlobalData = {
    totalMarketCap: 2860000000000, // 2.86 trilyon
    totalVolume24h: 79620000000, // 79.62 milyar
    marketCapChange24h: -0.17, // %-0.17
    volumeChange24h: 12.03, // %12.03
    btcDominance: 60.5, // %60.5
    ethDominance: 8.7, // %8.7
    activeCoins: 13240000, // 13.24 milyon
    activeExchanges: 814,
  };
  
  // API verileri veya mockup verileri kullan
  const globalData = data || mockGlobalData;
  
  return (
    <StatsContainer>
      <StatCard>
        <StatHeader>
          <IconWrapper color="primary">
            <FaChartLine />
          </IconWrapper>
          <StatTitle>Toplam Piyasa Değeri</StatTitle>
        </StatHeader>
        <StatValue>{formatNumber(globalData.totalMarketCap, { notation: 'compact' })}</StatValue>
        <StatSubvalue isPositive={globalData.marketCapChange24h > 0} isNegative={globalData.marketCapChange24h < 0}>
          {formatPercentage(globalData.marketCapChange24h)} (24s)
        </StatSubvalue>
      </StatCard>
      
      <StatCard>
        <StatHeader>
          <IconWrapper color="info">
            <FaExchangeAlt />
          </IconWrapper>
          <StatTitle>24s Hacim</StatTitle>
        </StatHeader>
        <StatValue>{formatNumber(globalData.totalVolume24h, { notation: 'compact' })}</StatValue>
        <StatSubvalue isPositive={globalData.volumeChange24h > 0} isNegative={globalData.volumeChange24h < 0}>
          {formatPercentage(globalData.volumeChange24h)} (24s)
        </StatSubvalue>
      </StatCard>
      
      <StatCard>
        <StatHeader>
          <IconWrapper color="warning">
            <FaBitcoin />
          </IconWrapper>
          <StatTitle>BTC Dominansı</StatTitle>
        </StatHeader>
        <StatValue>{globalData.btcDominance}%</StatValue>
        <StatSubvalue>
          ETH: {globalData.ethDominance}%
        </StatSubvalue>
      </StatCard>
      
      <StatCard>
        <StatHeader>
          <IconWrapper color="success">
            <FaPercentage />
          </IconWrapper>
          <StatTitle>Aktif Varlıklar</StatTitle>
        </StatHeader>
        <StatValue>{formatNumber(globalData.activeCoins, { notation: 'compact' })}</StatValue>
        <StatSubvalue>
          {globalData.activeExchanges} Borsa
        </StatSubvalue>
      </StatCard>
    </StatsContainer>
  );
};

export default GlobalStats; 