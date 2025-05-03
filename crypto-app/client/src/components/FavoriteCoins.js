import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { saveFavoriteCoin, removeFavoriteCoin, getUserProfile } from '../services/firestoreService';
import styled from 'styled-components';

const FavoriteContainer = styled.div`
  background-color: #1a1a2e;
  border-radius: 10px;
  padding: 20px;
  color: #fff;
  margin-bottom: 20px;
`;

const FavoriteTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #ffd700;
`;

const FavoritesList = styled.ul`
  list-style: none;
  padding: 0;
`;

const FavoriteItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #2a2a3a;
  
  &:last-child {
    border-bottom: none;
  }
`;

const RemoveButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #c0392b;
  }
`;

const EmptyMessage = styled.p`
  color: #888;
  font-style: italic;
`;

const LoadingText = styled.div`
  color: #888;
  text-align: center;
  padding: 20px;
`;

const FavoriteCoins = () => {
  const { user, userProfile } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && userProfile) {
      setFavorites(userProfile.favorites || []);
      setLoading(false);
    } else if (!user) {
      setLoading(false);
    }
  }, [user, userProfile]);

  const handleToggleFavorite = async (coinId) => {
    try {
      await removeFavoriteCoin(user.uid, coinId);
      setFavorites(favorites.filter(id => id !== coinId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return <LoadingText>Yükleniyor...</LoadingText>;
  }

  if (!user) {
    return (
      <FavoriteContainer>
        <FavoriteTitle>Favori Kripto Paralar</FavoriteTitle>
        <EmptyMessage>Favorileri görmek için giriş yapmalısınız.</EmptyMessage>
      </FavoriteContainer>
    );
  }

  return (
    <FavoriteContainer>
      <FavoriteTitle>Favori Kripto Paralarınız</FavoriteTitle>
      {favorites.length === 0 ? (
        <EmptyMessage>Henüz favori kripto paranız yok.</EmptyMessage>
      ) : (
        <FavoritesList>
          {favorites.map(coinId => (
            <FavoriteItem key={coinId}>
              {coinId}
              <RemoveButton onClick={() => handleToggleFavorite(coinId)}>
                Favorilerden Çıkar
              </RemoveButton>
            </FavoriteItem>
          ))}
        </FavoritesList>
      )}
    </FavoriteContainer>
  );
};

export default FavoriteCoins; 