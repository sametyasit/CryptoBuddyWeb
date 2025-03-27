import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { coinAPI } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import CoinCard from '../components/CoinCard';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: var(--text);
  
  span {
    color: var(--primary);
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  padding-left: 2.5rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background-color: var(--foreground);
  color: var(--text);
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
  }
  
  &::placeholder {
    color: var(--subText);
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--subText);
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background-color: ${props => props.active ? 'var(--primary)' : 'var(--foreground)'};
  color: ${props => props.active ? 'var(--secondary)' : 'var(--text)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--primary);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background-color: ${props => props.active ? 'var(--primary)' : 'var(--foreground)'};
  color: ${props => props.active ? 'var(--secondary)' : 'var(--text)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    border-color: var(--primary);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CoinList = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, gainers, losers, trending
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const fetchCoins = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      switch (filter) {
        case 'gainers':
          response = await coinAPI.getGainers();
          break;
        case 'losers':
          response = await coinAPI.getLosers();
          break;
        case 'trending':
          response = await coinAPI.getTrending();
          break;
        default:
          response = await coinAPI.getAllCoins(page);
          break;
      }
      
      setCoins(response.data);
      if (response.totalPages) {
        setTotalPages(response.totalPages);
      }
    } catch (err) {
      setError('Kripto para listesi yüklenirken bir hata oluştu.');
      console.error('Error fetching coins:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCoins();
  }, [page, filter]);
  
  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  
  if (loading) {
    return <Loading message="Kripto paralar yükleniyor..." />;
  }
  
  return (
    <Container>
      <Header>
        <Title>
          <span>Crypto</span>Buddy Kripto Para Listesi
        </Title>
        <SearchContainer>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            type="text"
            placeholder="Kripto para ara..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </SearchContainer>
      </Header>
      
      {error && <ErrorMessage message={error} />}
      
      <FilterContainer>
        <FilterButton
          active={filter === 'all'}
          onClick={() => handleFilterChange('all')}
        >
          Tümü
        </FilterButton>
        <FilterButton
          active={filter === 'gainers'}
          onClick={() => handleFilterChange('gainers')}
        >
          Yükselenler
        </FilterButton>
        <FilterButton
          active={filter === 'losers'}
          onClick={() => handleFilterChange('losers')}
        >
          Düşenler
        </FilterButton>
        <FilterButton
          active={filter === 'trending'}
          onClick={() => handleFilterChange('trending')}
        >
          Trend
        </FilterButton>
      </FilterContainer>
      
      <Grid>
        {filteredCoins.map(coin => (
          <CoinCard key={coin.id} coin={coin} />
        ))}
      </Grid>
      
      {filter === 'all' && (
        <Pagination>
          <PageButton
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Önceki
          </PageButton>
          {[...Array(totalPages)].map((_, index) => (
            <PageButton
              key={index + 1}
              active={page === index + 1}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </PageButton>
          ))}
          <PageButton
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Sonraki
          </PageButton>
        </Pagination>
      )}
    </Container>
  );
};

export default CoinList; 