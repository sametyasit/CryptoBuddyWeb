import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { favoriteAPI, coinAPI } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

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

const FavoritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const FavoriteCard = styled(Link)`
  background-color: var(--cardBackground);
  padding: 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const CoinIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const CoinInfo = styled.div`
  flex: 1;
`;

const CoinName = styled.h3`
  color: var(--text);
  margin: 0;
  font-size: 1.1rem;
`;

const CoinSymbol = styled.span`
  color: var(--subText);
  font-size: 0.9rem;
`;

const PriceContainer = styled.div`
  margin-bottom: 1rem;
`;

const Price = styled.div`
  color: var(--text);
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const PriceChange = styled.div`
  color: ${props => props.isPositive ? 'var(--success)' : 'var(--danger)'};
  font-size: 0.9rem;
`;

const MarketCap = styled.div`
  color: var(--subText);
  font-size: 0.9rem;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--danger);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(220, 53, 69, 0.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: var(--cardBackground);
  border-radius: 8px;
`;

const EmptyStateTitle = styled.h2`
  color: var(--text);
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  color: var(--subText);
  margin-bottom: 2rem;
`;

const BrowseButton = styled(Link)`
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

const Favorites = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const favoritesResponse = await favoriteAPI.getFavorites();
        setFavorites(favoritesResponse);
      } catch (err) {
        setError('Favoriler yüklenirken bir hata oluştu.');
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavorites();
  }, []);
  
  const handleRemoveFavorite = async (coinId) => {
    try {
      await favoriteAPI.removeFavorite(coinId);
      const updatedFavorites = await favoriteAPI.getFavorites();
      setFavorites(updatedFavorites);
    } catch (err) {
      setError('Favori kaldırılırken bir hata oluştu.');
      console.error('Error removing favorite:', err);
    }
  };
  
  if (loading) {
    return <Loading message="Favoriler yükleniyor..." />;
  }
  
  return (
    <Container>
      <Header>
        <Title>
          <span>Crypto</span>Buddy Favoriler
        </Title>
      </Header>
      
      {error && <ErrorMessage message={error} />}
      
      {favorites.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>Henüz Favori Kripto Paranız Yok</EmptyStateTitle>
          <EmptyStateText>
            Favori kripto paralarınızı ekleyerek hızlıca takip edebilirsiniz.
          </EmptyStateText>
          <BrowseButton to="/coins">Kripto Paraları Keşfet</BrowseButton>
        </EmptyState>
      ) : (
        <FavoritesGrid>
          {favorites.map(favorite => (
            <FavoriteCard key={favorite.id} to={`/coins/${favorite.coin.id}`}>
              <RemoveButton
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveFavorite(favorite.coin.id);
                }}
              >
                ×
              </RemoveButton>
              
              <CardHeader>
                <CoinIcon src={favorite.coin.image} alt={favorite.coin.name} />
                <CoinInfo>
                  <CoinName>{favorite.coin.name}</CoinName>
                  <CoinSymbol>{favorite.coin.symbol.toUpperCase()}</CoinSymbol>
                </CoinInfo>
              </CardHeader>
              
              <PriceContainer>
                <Price>${favorite.coin.current_price.toLocaleString()}</Price>
                <PriceChange isPositive={favorite.coin.price_change_percentage_24h > 0}>
                  {favorite.coin.price_change_percentage_24h > 0 ? '+' : ''}
                  {favorite.coin.price_change_percentage_24h.toFixed(2)}%
                </PriceChange>
                <MarketCap>
                  Market Değeri: ${favorite.coin.market_cap.toLocaleString()}
                </MarketCap>
              </PriceContainer>
            </FavoriteCard>
          ))}
        </FavoritesGrid>
      )}
    </Container>
  );
};

export default Favorites; 