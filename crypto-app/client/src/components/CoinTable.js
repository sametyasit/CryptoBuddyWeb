import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaStar } from 'react-icons/fa';

const Table = styled.div`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--cardBackground);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 2fr 1fr 1fr 1fr 1fr 1fr;
  padding: 1rem;
  background-color: var(--foreground);
  border-bottom: 1px solid var(--border);
  font-weight: 600;
  
  @media (max-width: 992px) {
    grid-template-columns: 0.5fr 2fr 1fr 1fr 1fr;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 0.5fr 2fr 1fr 1fr;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 0.5fr 2fr 1fr;
  }
`;

const HeaderCell = styled.div`
  color: var(--subText);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  
  &:not(:first-child) {
    justify-content: flex-end;
  }
  
  @media (max-width: 992px) {
    &.hide-md {
      display: none;
    }
  }
  
  @media (max-width: 768px) {
    &.hide-sm {
      display: none;
    }
  }
  
  @media (max-width: 576px) {
    &.hide-xs {
      display: none;
    }
  }
`;

const TableBody = styled.div`
  overflow-y: auto;
  max-height: 600px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 2fr 1fr 1fr 1fr 1fr 1fr;
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--foreground);
  }
  
  @media (max-width: 992px) {
    grid-template-columns: 0.5fr 2fr 1fr 1fr 1fr;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 0.5fr 2fr 1fr 1fr;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 0.5fr 2fr 1fr;
  }
`;

const Cell = styled.div`
  display: flex;
  align-items: center;
  
  &:not(:first-child):not(:nth-child(2)) {
    justify-content: flex-end;
  }
  
  @media (max-width: 992px) {
    &.hide-md {
      display: none;
    }
  }
  
  @media (max-width: 768px) {
    &.hide-sm {
      display: none;
    }
  }
  
  @media (max-width: 576px) {
    &.hide-xs {
      display: none;
    }
  }
`;

const RankCell = styled(Cell)`
  color: var(--subText);
  font-weight: 600;
  font-size: 0.9rem;
`;

const CoinCell = styled(Cell)`
  gap: 1rem;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.isFavorite ? 'var(--primary)' : 'var(--border)'};
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--primary);
  }
`;

const CoinImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

const CoinInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const CoinName = styled.div`
  font-weight: 600;
`;

const CoinSymbol = styled.div`
  color: var(--subText);
  font-size: 0.9rem;
  text-transform: uppercase;
`;

const PriceCell = styled(Cell)`
  font-weight: 600;
`;

const ChangeCell = styled(Cell)`
  color: ${props => props.value >= 0 ? 'var(--success)' : 'var(--danger)'};
  font-weight: 600;
`;

const CoinLink = styled(Link)`
  color: var(--text);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  &:hover {
    color: var(--primary);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: var(--subText);
`;

const EmptyTitle = styled.h3`
  margin-bottom: 0.5rem;
  color: var(--text);
`;

const formatCurrency = (value) => {
  if (value === undefined || value === null) return 'N/A';
  
  // Büyük sayılar için compact notation kullan
  if (value >= 1000) {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(value);
  }
  
  // Küçük sayılar için uygun basamak sayısı kullan
  const fractionDigits = value < 1 ? (value < 0.01 ? 6 : 4) : 2;
  
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: fractionDigits
  }).format(value);
};

const formatPercentage = (value) => {
  if (value === undefined || value === null) return 'N/A';
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

const formatMarketCap = (value) => {
  if (value === undefined || value === null) return 'N/A';
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2
  }).format(value);
};

const formatVolume = (value) => {
  if (value === undefined || value === null) return 'N/A';
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 0
  }).format(value);
};

const CoinTable = ({ coins = [] }) => {
  const handleFavoriteClick = (e, coinId) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Toggle favorite for ${coinId}`);
    // Favoriler işlevselliği burada eklenecek
  };

  if (!coins || coins.length === 0) {
    return (
      <EmptyState>
        <EmptyTitle>Hiç kripto para bulunamadı</EmptyTitle>
        <p>Arama kriterlerinizi değiştirmeyi veya daha sonra tekrar denemeyi deneyin.</p>
      </EmptyState>
    );
  }

  return (
    <Table>
      <TableHeader>
        <HeaderCell>#</HeaderCell>
        <HeaderCell>Coin</HeaderCell>
        <HeaderCell>Fiyat</HeaderCell>
        <HeaderCell className="hide-xs">24s %</HeaderCell>
        <HeaderCell className="hide-sm">7g %</HeaderCell>
        <HeaderCell className="hide-md">Piyasa Değeri</HeaderCell>
        <HeaderCell className="hide-md">Hacim (24s)</HeaderCell>
      </TableHeader>
      <TableBody>
        {coins.map((coin, index) => (
          <Row key={coin.id}>
            <RankCell>
              <StarButton
                isFavorite={false} // Burada favori durumunu kontrol et
                onClick={(e) => handleFavoriteClick(e, coin.id)}
                title={`${coin.name} favorilere ekle`}
              >
                <FaStar />
              </StarButton>
            </RankCell>
            <CoinCell>
              <CoinLink to={`/coin/${coin.id}`}>
                <CoinImage src={coin.image} alt={coin.name} />
                <CoinInfo>
                  <CoinName>{coin.name}</CoinName>
                  <CoinSymbol>{coin.symbol}</CoinSymbol>
                </CoinInfo>
              </CoinLink>
            </CoinCell>
            <PriceCell>{formatCurrency(coin.current_price)}</PriceCell>
            <ChangeCell className="hide-xs" value={coin.price_change_percentage_24h}>
              {formatPercentage(coin.price_change_percentage_24h)}
            </ChangeCell>
            <ChangeCell className="hide-sm" value={coin.price_change_percentage_7d_in_currency}>
              {formatPercentage(coin.price_change_percentage_7d_in_currency)}
            </ChangeCell>
            <Cell className="hide-md">{formatMarketCap(coin.market_cap)}</Cell>
            <Cell className="hide-md">{formatVolume(coin.total_volume)}</Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
};

export default CoinTable; 