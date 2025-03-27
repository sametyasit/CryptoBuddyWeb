import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaExternalLinkAlt, FaClock } from 'react-icons/fa';

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
`;

const Title = styled.h1`
  color: var(--text);
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const NewsCard = styled.div`
  background: var(--cardBackground);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const NewsImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const NewsContent = styled.div`
  padding: 1.5rem;
`;

const NewsTitle = styled.h3`
  color: var(--text);
  margin-bottom: 1rem;
  font-size: 1.2rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NewsSource = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--subText);
  font-size: 0.875rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
`;

const NewsLink = styled.a`
  color: var(--primary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;

  &:hover {
    text-decoration: underline;
  }
`;

const TimeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--subText);
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
  margin: 2rem auto;
  max-width: 600px;
`;

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          'https://min-api.cryptocompare.com/data/v2/news/?lang=EN',
          {
            headers: {
              'Authorization': `Apikey ${process.env.REACT_APP_CRYPTOCOMPARE_API_KEY}`
            }
          }
        );

        setNews(response.data.Data);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Haberler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    // Her 5 dakikada bir haberleri güncelle
    const interval = setInterval(fetchNews, 300000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return <LoadingSpinner>Haberler yükleniyor...</LoadingSpinner>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <Title>Kripto Para Haberleri</Title>
      <NewsGrid>
        {news.map(item => (
          <NewsCard key={item.id}>
            <NewsImage src={item.imageurl} alt={item.title} />
            <NewsContent>
              <NewsTitle>{item.title}</NewsTitle>
              <NewsSource>
                <TimeInfo>
                  <FaClock />
                  {formatDate(item.published_on)}
                </TimeInfo>
                <div>{item.source}</div>
              </NewsSource>
              <NewsLink href={item.url} target="_blank" rel="noopener noreferrer">
                Haberi Oku <FaExternalLinkAlt />
              </NewsLink>
            </NewsContent>
          </NewsCard>
        ))}
      </NewsGrid>
    </Container>
  );
};

export default News; 