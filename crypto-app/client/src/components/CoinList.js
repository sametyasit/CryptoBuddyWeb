import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaCaretUp, FaCaretDown, FaSort } from 'react-icons/fa';
import axios from 'axios';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  background-color: var(--cardBackground);
  border-radius: 8px;
  overflow: hidden;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  color: var(--subText);
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  user-select: none;
  
  &:hover {
    background-color: var(--hover);
  }
`;

const SortIcon = styled.span`
  margin-left: 0.5rem;
  display: inline-flex;
  align-items: center;
`;

const TableRow = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--hover);
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  color: var(--text);
`;

const CoinInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CoinImage = styled.img`
  width: 24px;
  height: 24px;
`;

const CoinName = styled.div`
  display: flex;
  flex-direction: column;
`;

const Symbol = styled.span`
  color: var(--subText);
  font-size: 0.875rem;
`;

const PriceChange = styled.span`
  color: ${props => props.isPositive ? '#4caf50' : '#f44336'};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const LoadMoreButton = styled.button`
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
  display: block;
  margin: 0 auto;

  &:hover {
    background-color: var(--primaryHover);
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  color: var(--text);
  padding: 2rem;
`;

const ErrorMessage = styled.div`
  color: #f44336;
  text-align: center;
  padding: 2rem;
  background: rgba(244, 67, 54, 0.1);
  border-radius: 8px;
`;

const CoinList = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap', direction: 'desc' });
  const navigate = useNavigate();

  const fetchCoins = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 20,
            page: page,
            sparkline: false,
            price_change_percentage: '1h,24h,7d'
          }
        }
      );
      if (page === 1) {
        setCoins(response.data);
      } else {
        setCoins(prevCoins => [...prevCoins, ...response.data]);
      }
    } catch (err) {
      console.error('Error fetching coins:', err);
      setError('Kripto para verileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 60000); // 1 dakikada bir güncelle
    return () => clearInterval(interval);
  }, [fetchCoins]);

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(price);
  };

  const formatMarketCap = (marketCap) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(marketCap);
  };

  const formatVolume = (volume) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(volume);
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const getSortedCoins = () => {
    const sortedCoins = [...coins];
    const { key, direction } = sortConfig;

    return sortedCoins.sort((a, b) => {
      let aValue, bValue;

      switch (key) {
        case 'price':
          aValue = a.current_price;
          bValue = b.current_price;
          break;
        case 'market_cap':
          aValue = a.market_cap;
          bValue = b.market_cap;
          break;
        case 'volume':
          aValue = a.total_volume;
          bValue = b.total_volume;
          break;
        case '1h':
          aValue = a.price_change_percentage_1h_in_currency;
          bValue = b.price_change_percentage_1h_in_currency;
          break;
        case '24h':
          aValue = a.price_change_percentage_24h;
          bValue = b.price_change_percentage_24h;
          break;
        case '7d':
          aValue = a.price_change_percentage_7d_in_currency;
          bValue = b.price_change_percentage_7d_in_currency;
          break;
        default:
          return 0;
      }

      if (direction === 'asc') {
        return aValue - bValue;
      }
      return bValue - aValue;
    });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <FaSort />;
    }
    return sortConfig.direction === 'desc' ? <FaCaretDown /> : <FaCaretUp />;
  };

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <Table>
        <thead>
          <tr>
            <TableHeader>#</TableHeader>
            <TableHeader>Kripto Para</TableHeader>
            <TableHeader onClick={() => handleSort('price')}>
              Fiyat
              <SortIcon>{getSortIcon('price')}</SortIcon>
            </TableHeader>
            <TableHeader onClick={() => handleSort('1h')}>
              1s %
              <SortIcon>{getSortIcon('1h')}</SortIcon>
            </TableHeader>
            <TableHeader onClick={() => handleSort('24h')}>
              24s %
              <SortIcon>{getSortIcon('24h')}</SortIcon>
            </TableHeader>
            <TableHeader onClick={() => handleSort('7d')}>
              7g %
              <SortIcon>{getSortIcon('7d')}</SortIcon>
            </TableHeader>
            <TableHeader onClick={() => handleSort('market_cap')}>
              Piyasa Değeri
              <SortIcon>{getSortIcon('market_cap')}</SortIcon>
            </TableHeader>
            <TableHeader onClick={() => handleSort('volume')}>
              Hacim (24s)
              <SortIcon>{getSortIcon('volume')}</SortIcon>
            </TableHeader>
          </tr>
        </thead>
        <tbody>
          {getSortedCoins().map(coin => (
            <TableRow key={coin.id} onClick={() => navigate(`/coin/${coin.id}`)}>
              <TableCell>{coin.market_cap_rank}</TableCell>
              <TableCell>
                <CoinInfo>
                  <CoinImage src={coin.image} alt={coin.name} />
                  <CoinName>
                    {coin.name}
                    <Symbol>{coin.symbol.toUpperCase()}</Symbol>
                  </CoinName>
                </CoinInfo>
              </TableCell>
              <TableCell>{formatPrice(coin.current_price)}</TableCell>
              <TableCell>
                <PriceChange isPositive={coin.price_change_percentage_1h_in_currency >= 0}>
                  {coin.price_change_percentage_1h_in_currency >= 0 ? <FaCaretUp /> : <FaCaretDown />}
                  {Math.abs(coin.price_change_percentage_1h_in_currency || 0).toFixed(2)}%
                </PriceChange>
              </TableCell>
              <TableCell>
                <PriceChange isPositive={coin.price_change_percentage_24h >= 0}>
                  {coin.price_change_percentage_24h >= 0 ? <FaCaretUp /> : <FaCaretDown />}
                  {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%
                </PriceChange>
              </TableCell>
              <TableCell>
                <PriceChange isPositive={coin.price_change_percentage_7d_in_currency >= 0}>
                  {coin.price_change_percentage_7d_in_currency >= 0 ? <FaCaretUp /> : <FaCaretDown />}
                  {Math.abs(coin.price_change_percentage_7d_in_currency || 0).toFixed(2)}%
                </PriceChange>
              </TableCell>
              <TableCell>{formatMarketCap(coin.market_cap)}</TableCell>
              <TableCell>{formatVolume(coin.total_volume)}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      {loading ? (
        <LoadingSpinner>Yükleniyor...</LoadingSpinner>
      ) : (
        <LoadMoreButton onClick={handleLoadMore}>
          Daha Fazla Göster
        </LoadMoreButton>
      )}
    </Container>
  );
};

export default CoinList; 