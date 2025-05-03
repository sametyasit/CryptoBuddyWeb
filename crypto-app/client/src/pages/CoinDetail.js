import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaStar, 
  FaRegStar, 
  FaChartLine, 
  FaExchangeAlt, 
  FaGlobe, 
  FaGithub, 
  FaTwitter, 
  FaReddit, 
  FaFileAlt, 
  FaShoppingCart, 
  FaPlus,
  FaCaretUp,
  FaCaretDown,
  FaExternalLinkAlt,
  FaDollarSign
} from 'react-icons/fa';
import { coinAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { TimeRangeButtons, TimeRangeButton } from '../components/TimeRangeButton';
import axios from 'axios';
import { saveFavoriteCoin, removeFavoriteCoin } from '../services/firestoreService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const BreadcrumbItem = styled(Link)`
  color: var(--subText);
  text-decoration: none;
  
  &:hover {
    color: var(--primary);
  }
`;

const BreadcrumbSeparator = styled.span`
  margin: 0 0.5rem;
  color: var(--subText);
`;

const CurrentBreadcrumb = styled.span`
  color: var(--primary);
  font-weight: 500;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const CoinInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CoinImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
`;

const CoinTitle = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CoinName = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

const CoinSymbol = styled.span`
  color: var(--subText);
  font-size: 1.2rem;
  text-transform: uppercase;
`;

const CoinRank = styled.div`
  background-color: var(--primary);
  color: var(--secondary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    margin-top: 1rem;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background-color: ${props => props.primary ? 'var(--primary)' : 'transparent'};
  color: ${props => props.primary ? 'var(--secondary)' : 'var(--text)'};
  border: ${props => props.primary ? 'none' : '1px solid var(--border)'};
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--primary)' : 'var(--foreground)'};
    opacity: ${props => props.primary ? 0.9 : 1};
    transform: translateY(-2px);
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 992px) {
    grid-template-columns: 7fr 3fr;
  }
`;

const MainContent = styled.div`
  width: 100%;
`;

const Sidebar = styled.div`
  width: 100%;
`;

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CurrentPrice = styled.div`
  font-size: 2rem;
  font-weight: 700;
`;

const PriceChange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.8rem;
  background-color: ${props => props.isPositive ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)'};
  color: ${props => props.isPositive ? 'var(--success)' : 'var(--danger)'};
  border-radius: 4px;
  font-weight: 600;
`;

const PriceDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const PriceDetailItem = styled.div`
  background-color: var(--cardBackground);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const DetailLabel = styled.div`
  color: var(--subText);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const DetailValue = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
`;

const Card = styled.div`
  background-color: var(--cardBackground);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const CardTitle = styled.h2`
  font-size: 1.2rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: var(--primary);
  }
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 400px;
  margin-bottom: 2rem;
`;

const AboutSection = styled.div`
  margin-bottom: 2rem;
`;

const Description = styled.div`
  line-height: 1.6;
  color: var(--text);
  
  a {
    color: var(--primary);
  }
`;

const LinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const LinkItem = styled.a`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  background-color: var(--foreground);
  border-radius: 8px;
  text-decoration: none;
  color: var(--text);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  svg {
    color: var(--primary);
  }
`;

const LinkText = styled.span`
  font-weight: 500;
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed var(--border);
  padding-bottom: 0.8rem;
  
  &:last-of-type {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const StatLabel = styled.div`
  color: var(--subText);
  font-size: 0.9rem;
`;

const StatValue = styled.div`
  font-weight: 600;
`;

const formatCurrency = (value, options = {}) => {
  if (value === undefined || value === null) return 'N/A';
  
  const { style = 'currency', notation = 'standard', minimumFractionDigits = 0, maximumFractionDigits = 2 } = options;
  
  // Küçük sayılar için uygun basamak sayısı
  const adjustedMaxFractionDigits = value < 1 ? (value < 0.01 ? 6 : 4) : maximumFractionDigits;
  
  return new Intl.NumberFormat('tr-TR', {
    style,
    currency: 'USD',
    notation,
    minimumFractionDigits,
    maximumFractionDigits: adjustedMaxFractionDigits
  }).format(value);
};

const formatPercentage = (value) => {
  if (value === undefined || value === null) return 'N/A';
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// CoinGecko API için fiyat geçmişi çekme fonksiyonu
const fetchPriceHistoryCoinGecko = async (id, days = '7') => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
      {
        params: {
          vs_currency: 'usd',
          days: days,
          interval: days === '1' ? 'hourly' : 'daily'
        }
      }
    );
    return response.data.prices;
  } catch (error) {
    console.error('Error fetching price history from CoinGecko:', error);
    return null;
  }
};

// CryptoCompare API için fiyat geçmişi çekme fonksiyonu (alternatif)
const fetchPriceHistoryCryptoCompare = async (symbol, days = '7') => {
  try {
    let endpoint = '';
    let limit = 30;
    
    if (days === '1' || days === '24h') {
      endpoint = 'histohour';
      limit = 24;
    } else if (days === '7' || days === '7d') {
      endpoint = 'histoday';
      limit = 7;
    } else if (days === '30' || days === '30d') {
      endpoint = 'histoday';
      limit = 30;
    } else if (days === '90' || days === '90d') {
      endpoint = 'histoday';
      limit = 90;
    } else if (days === '365' || days === '1y') {
      endpoint = 'histoday';
      limit = 365;
    } else {
      endpoint = 'histoday';
      limit = 2000;  // Uzun dönem için maksimum veri
    }
    
    const response = await axios.get(
      `https://min-api.cryptocompare.com/data/${endpoint}`,
      {
        params: {
          fsym: symbol.toUpperCase(),
          tsym: 'USD',
          limit: limit,
          api_key: 'Kendi API anahtarınızı buraya yerleştirin veya API anahtarı olmadan kullanın'
        }
      }
    );
    
    if (response.data && response.data.Data) {
      return response.data.Data.map(item => [
        item.time * 1000, // Unix timestamp to milliseconds
        item.close
      ]);
    }
    return null;
  } catch (error) {
    console.error('Error fetching price history from CryptoCompare:', error);
    return null;
  }
};

// Coinpaprika API için fiyat geçmişi çekme fonksiyonu (ikinci alternatif)
const fetchPriceHistoryCoinpaprika = async (id, days = '7') => {
  try {
    // Başlangıç ve bitiş tarihleri hesaplama
    const end = new Date();
    let start = new Date();
    
    if (days === '1' || days === '24h') {
      start.setDate(start.getDate() - 1);
    } else if (days === '7' || days === '7d') {
      start.setDate(start.getDate() - 7);
    } else if (days === '30' || days === '30d') {
      start.setMonth(start.getMonth() - 1);
    } else if (days === '90' || days === '90d') {
      start.setMonth(start.getMonth() - 3);
    } else if (days === '365' || days === '1y') {
      start.setFullYear(start.getFullYear() - 1);
    } else {
      // max için 5 yıl
      start.setFullYear(start.getFullYear() - 5);
    }
    
    const startTimestamp = Math.floor(start.getTime() / 1000);
    const endTimestamp = Math.floor(end.getTime() / 1000);
    
    const response = await axios.get(
      `https://api.coinpaprika.com/v1/coins/${id}/ohlcv/historical`,
      {
        params: {
          start: startTimestamp,
          end: endTimestamp
        }
      }
    );
    
    if (response.data) {
      return response.data.map(item => [
        new Date(item.time_open).getTime(),
        item.close
      ]);
    }
    return null;
  } catch (error) {
    console.error('Error fetching price history from Coinpaprika:', error);
    return null;
  }
};

// Farklı API'lerden veri çeken birleşik fonksiyon
const fetchPriceHistory = async (id, symbol, days = '7') => {
  // Önce CoinGecko API'den deneyelim
  let data = await fetchPriceHistoryCoinGecko(id, days);
  
  // Eğer CoinGecko çalışmazsa CryptoCompare API'yi deneyelim
  if (!data || data.length === 0) {
    console.log("CoinGecko API failed, trying CryptoCompare API...");
    data = await fetchPriceHistoryCryptoCompare(symbol, days);
  }
  
  // Eğer CryptoCompare da çalışmazsa Coinpaprika API'yi deneyelim
  if (!data || data.length === 0) {
    console.log("CryptoCompare API failed, trying Coinpaprika API...");
    let coinpaprikaId = `${symbol}-${id}`.toLowerCase();
    data = await fetchPriceHistoryCoinpaprika(coinpaprikaId, days);
  }
  
  return data;
};

const CoinDetail = () => {
  const { id } = useParams();
  const { user, userProfile } = useAuth();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [priceHistory, setPriceHistory] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [chartError, setChartError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setChartError(null);

        // Fetch coin details
        const coinResponse = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}`,
          {
            params: {
              localization: false,
              tickers: true,
              market_data: true,
              community_data: true,
              developer_data: true,
              sparkline: true
            }
          }
        );
        
        setCoin(coinResponse.data);
        
        // Verify if user has this coin in favorites
        if (user && userProfile) {
          // Firestore'dan gelen kullanıcı profilinde favorileri kontrol et
          const favorites = userProfile.favorites || [];
          setIsFavorite(favorites.includes(id));
        }

        // Fetch price history
        const days = timeRange === '24h' ? '1' : 
                    timeRange === '7d' ? '7' :
                    timeRange === '30d' ? '30' :
                    timeRange === '90d' ? '90' :
                    timeRange === '1y' ? '365' : 'max';
        
        const historyData = await fetchPriceHistory(id, coinResponse.data.symbol, days);
        
        if (!historyData || historyData.length === 0) {
          setChartError('Grafik verisi alınamadı. Lütfen daha sonra tekrar deneyin.');
        } else {
          setPriceHistory(historyData);
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Veri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, timeRange, user, userProfile]);
  
  // Don't use mock data - we want to use real API data
  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    return <ErrorMessage message={error} />;
  }
  
  // Make sure we have coin data
  if (!coin) {
    return <ErrorMessage message="Coin verisi bulunamadı" />;
  }

  const formatPrice = (price) => {
    if (price === undefined || price === null) return 'N/A';
    
    // For very small values, use more decimal places
    const decimals = price < 0.001 ? 8 : price < 0.1 ? 6 : 2;
    
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: decimals
    }).format(price);
  };
  
  const formatNumber = (num) => {
    if (num === undefined || num === null) return 'N/A';
    
    return new Intl.NumberFormat('tr-TR', {
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(num);
  };
  
  // Improved chart data preparation with better empty data handling
  const chartData = priceHistory && priceHistory.length > 0 ? {
    labels: priceHistory.map(item => {
      const date = new Date(item[0]);
      if (timeRange === '24h') {
        return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      } else if (timeRange === '7d') {
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
      } else if (timeRange === '30d' || timeRange === '90d') {
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
      } else {
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: '2-digit' });
      }
    }),
    datasets: [
      {
        label: 'Fiyat',
        data: priceHistory.map(item => item[1]),
        borderColor: coin.market_data.price_change_percentage_24h >= 0 ? '#28a745' : '#dc3545',
        segment: {
          borderColor: ctx => {
            // Daha güvenli erişim yöntemleri kullanıyoruz
            // ctx.p0DataIndex kontrolü yapalım
            if (ctx.p0DataIndex === undefined || ctx.p1DataIndex === undefined) {
              return '#28a745'; // Varsayılan renk
            }
            
            // Veri noktalarının indekslerine doğrudan erişelim
            const index = ctx.p0DataIndex;
            
            // Veri dizisinin sınırlarını kontrol edelim
            if (index >= priceHistory.length - 1) {
              return '#28a745'; // Varsayılan renk
            }
            
            // Fiyat değişimini doğrudan veri arrayi üzerinden hesaplayalım
            const startPrice = priceHistory[index][1];
            const endPrice = priceHistory[index + 1][1];
            
            // Artış/düşüş durumuna göre renk döndürelim
            return endPrice >= startPrice ? '#28a745' : '#dc3545';
          }
        },
        backgroundColor: coin.market_data.price_change_percentage_24h >= 0 ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: priceHistory.length > 100 ? 0 : timeRange === '24h' ? 0 : 1,
        pointHitRadius: 20,
      }
    ]
  } : null;
  
  // Improved chart options with better tooltip
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${formatCurrency(context.parsed.y)}`;
          },
          title: function(context) {
            if (!priceHistory || priceHistory.length === 0 || !context[0] || context[0].dataIndex === undefined) {
              return '';
            }
            
            const date = new Date(priceHistory[context[0].dataIndex][0]);
            if (timeRange === '24h') {
              return date.toLocaleString('tr-TR', { 
                hour: '2-digit', 
                minute: '2-digit',
                day: 'numeric',
                month: 'long'
              });
            } else {
              return date.toLocaleDateString('tr-TR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              });
            }
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#FFD700', // Gold renk
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: timeRange === '24h' ? 6 : timeRange === '7d' ? 7 : 10,
          font: {
            weight: 'bold',
            size: 11
          }
        },
        border: {
          color: '#666666'
        }
      },
      y: {
        grid: {
          color: 'rgba(102, 102, 102, 0.3)' // Daha görünür grid çizgileri
        },
        ticks: {
          color: '#FFD700', // Gold renk
          callback: function(value) {
            return formatCurrency(value, { notation: 'compact' });
          },
          font: {
            weight: 'bold',
            size: 11
          }
        },
        border: {
          color: '#666666'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      point: {
        radius: 0
      },
      line: {
        borderWidth: 2
      }
    }
  };

  // Render chart section with error handling
  const renderChart = () => {
    if (chartError) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <p style={{ color: 'var(--danger)' }}>{chartError}</p>
        </div>
      );
    }
    
    if (!chartData) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <Loading />
        </div>
      );
    }
    
    // ID ekleyerek chart yeniden render sorununu çözelim
    const chartId = `price-chart-${id}-${timeRange}`;
    return <Line key={chartId} id={chartId} data={chartData} options={chartOptions} />;
  };

  const toggleFavorite = async () => {
    if (!user) {
      // Kullanıcı giriş yapmamışsa, giriş yapması gerektiğini bildir
      alert('Favorilere eklemek için giriş yapmalısınız');
      return;
    }
    
    try {
      if (isFavorite) {
        // Favorilerden çıkar
        await removeFavoriteCoin(user.uid, id);
      } else {
        // Favorilere ekle
        await saveFavoriteCoin(user.uid, id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Favori işlemi sırasında hata:', error);
      alert('Favori işlemi sırasında bir hata oluştu.');
    }
  };
  
  const handleAddToPortfolio = () => {
    if (!user) {
      alert('Portföye eklemek için giriş yapmalısınız');
      return;
    }
    
    // Portföy ekleme sayfasına yönlendir veya modal göster
    console.log(`${coin.name} portföye eklenecek`);
  };

  // Özel zaman dilimi butonlarını oluşturalım ve bunları kullanmak için varolan kodu değiştirelim
  const CustomTimeRangeButton = styled(TimeRangeButton)`
    background-color: ${props => props.active ? '#3861FB' : '#2a2a2a'};
    color: ${props => props.active ? '#fff' : '#FFD700'};
    border: 1px solid ${props => props.active ? '#3861FB' : '#666'};
    border-radius: 20px;
    padding: 8px 16px;
    font-weight: ${props => props.active ? 'bold' : 'normal'};
    transition: all 0.3s ease;
    cursor: pointer;
    
    &:hover {
      background-color: ${props => props.active ? '#3861FB' : '#3a3a3a'};
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  `;

  const CustomTimeRangeButtons = styled(TimeRangeButtons)`
    display: flex;
    gap: 8px;
    margin: 20px 0;
    flex-wrap: wrap;
    justify-content: center;
  `;

  // ChartTitle component to make it more attractive
  const ChartTitle = styled(CardTitle)`
    font-size: 1.3rem;
    color: #FFD700;
    margin-bottom: 1.8rem;
    
    svg {
      color: #FFD700;
      margin-right: 8px;
    }
  `;

  return (
    <Container>
      <Breadcrumbs>
        <BreadcrumbItem to="/">Ana Sayfa</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem to="/coins">Kripto Paralar</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <CurrentBreadcrumb>{coin.name}</CurrentBreadcrumb>
      </Breadcrumbs>
      
      <Header>
        <CoinInfo>
          <CoinImage src={coin.image.large} alt={coin.name} />
          <CoinTitle>
            <TitleRow>
              <CoinName>{coin.name}</CoinName>
              <CoinSymbol>{coin.symbol}</CoinSymbol>
              <CoinRank>Sıra #{coin.market_cap_rank}</CoinRank>
            </TitleRow>
          </CoinTitle>
        </CoinInfo>
        
        <ActionButtons>
          <Button onClick={toggleFavorite}>
            {isFavorite ? <FaStar /> : <FaRegStar />}
            {isFavorite ? 'Favorilerde' : 'Favorilere Ekle'}
          </Button>
          <Button primary onClick={handleAddToPortfolio}>
            <FaPlus />
            Portföye Ekle
          </Button>
        </ActionButtons>
      </Header>
      
      <ContentGrid>
        <MainContent>
          <PriceSection>
            <PriceRow>
              <CurrentPrice>
                {formatCurrency(coin.market_data.current_price.usd)}
              </CurrentPrice>
              <PriceChange isPositive={coin.market_data.price_change_percentage_24h >= 0}>
                {coin.market_data.price_change_percentage_24h >= 0 ? <FaCaretUp /> : <FaCaretDown />}
                {Math.abs(coin.market_data.price_change_percentage_24h).toFixed(2)}%
              </PriceChange>
            </PriceRow>
            
            <PriceDetails>
              <PriceDetailItem>
                <DetailLabel>24s En Yüksek</DetailLabel>
                <DetailValue>{formatCurrency(coin.market_data.high_24h.usd)}</DetailValue>
              </PriceDetailItem>
              <PriceDetailItem>
                <DetailLabel>24s En Düşük</DetailLabel>
                <DetailValue>{formatCurrency(coin.market_data.low_24h.usd)}</DetailValue>
              </PriceDetailItem>
              <PriceDetailItem>
                <DetailLabel>7g Değişim</DetailLabel>
                <DetailValue style={{ color: coin.market_data.price_change_percentage_7d >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {formatPercentage(coin.market_data.price_change_percentage_7d)}
                </DetailValue>
              </PriceDetailItem>
              <PriceDetailItem>
                <DetailLabel>30g Değişim</DetailLabel>
                <DetailValue style={{ color: coin.market_data.price_change_percentage_30d >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {formatPercentage(coin.market_data.price_change_percentage_30d)}
                </DetailValue>
              </PriceDetailItem>
            </PriceDetails>
          </PriceSection>
          
          <Card>
            <ChartTitle>
              <FaChartLine /> Fiyat Grafiği
            </ChartTitle>
            
            <ChartContainer>
              <CustomTimeRangeButtons>
                <CustomTimeRangeButton
                  active={timeRange === '24h'}
                  onClick={() => setTimeRange('24h')}
                >
                  24 Saat
                </CustomTimeRangeButton>
                <CustomTimeRangeButton
                  active={timeRange === '7d'}
                  onClick={() => setTimeRange('7d')}
                >
                  7 Gün
                </CustomTimeRangeButton>
                <CustomTimeRangeButton
                  active={timeRange === '30d'}
                  onClick={() => setTimeRange('30d')}
                >
                  30 Gün
                </CustomTimeRangeButton>
                <CustomTimeRangeButton
                  active={timeRange === '90d'}
                  onClick={() => setTimeRange('90d')}
                >
                  90 Gün
                </CustomTimeRangeButton>
                <CustomTimeRangeButton
                  active={timeRange === '1y'}
                  onClick={() => setTimeRange('1y')}
                >
                  1 Yıl
                </CustomTimeRangeButton>
                <CustomTimeRangeButton
                  active={timeRange === 'all'}
                  onClick={() => setTimeRange('all')}
                >
                  Tüm Zamanlar
                </CustomTimeRangeButton>
              </CustomTimeRangeButtons>
              
              {renderChart()}
            </ChartContainer>
          </Card>
          
          <AboutSection>
            <Card>
              <CardTitle>
                <FaFileAlt /> {coin.name} Hakkında
              </CardTitle>
              
              <Description dangerouslySetInnerHTML={{ __html: coin.description.en }} />
              
              <LinksGrid>
                {coin.links.homepage[0] && (
                  <LinkItem href={coin.links.homepage[0]} target="_blank" rel="noopener noreferrer">
                    <FaGlobe />
                    <LinkText>Resmi Web Sitesi</LinkText>
                  </LinkItem>
                )}
                
                {coin.links.repos_url.github[0] && (
                  <LinkItem href={coin.links.repos_url.github[0]} target="_blank" rel="noopener noreferrer">
                    <FaGithub />
                    <LinkText>GitHub</LinkText>
                  </LinkItem>
                )}
                
                {coin.links.twitter_screen_name && (
                  <LinkItem href={`https://twitter.com/${coin.links.twitter_screen_name}`} target="_blank" rel="noopener noreferrer">
                    <FaTwitter />
                    <LinkText>Twitter</LinkText>
                  </LinkItem>
                )}
                
                {coin.links.subreddit_url && (
                  <LinkItem href={coin.links.subreddit_url} target="_blank" rel="noopener noreferrer">
                    <FaReddit />
                    <LinkText>Reddit</LinkText>
                  </LinkItem>
                )}
              </LinksGrid>
            </Card>
          </AboutSection>
        </MainContent>
        
        <Sidebar>
          <Card>
            <CardTitle>
              <FaExchangeAlt /> Piyasa İstatistikleri
            </CardTitle>
            
            <StatsSection>
              <StatItem>
                <StatLabel>Piyasa Değeri</StatLabel>
                <StatValue>{formatCurrency(coin.market_data.market_cap.usd, { notation: 'compact' })}</StatValue>
              </StatItem>
              
              <StatItem>
                <StatLabel>24s Hacim</StatLabel>
                <StatValue>{formatCurrency(coin.market_data.total_volume.usd, { notation: 'compact' })}</StatValue>
              </StatItem>
              
              <StatItem>
                <StatLabel>Dolaşımdaki Arz</StatLabel>
                <StatValue>{formatCurrency(coin.market_data.circulating_supply, { style: 'decimal', notation: 'compact' })}</StatValue>
              </StatItem>
              
              <StatItem>
                <StatLabel>Toplam Arz</StatLabel>
                <StatValue>
                  {coin.market_data.total_supply 
                    ? formatCurrency(coin.market_data.total_supply, { style: 'decimal', notation: 'compact' })
                    : 'Sınırsız'}
                </StatValue>
              </StatItem>
              
              <StatItem>
                <StatLabel>Maksimum Arz</StatLabel>
                <StatValue>
                  {coin.market_data.max_supply 
                    ? formatCurrency(coin.market_data.max_supply, { style: 'decimal', notation: 'compact' })
                    : 'Belirtilmemiş'}
                </StatValue>
              </StatItem>
              
              <StatItem>
                <StatLabel>Tüm Zamanların En Yükseği</StatLabel>
                <StatValue>{formatCurrency(coin.market_data.ath.usd)}</StatValue>
              </StatItem>
              
              <StatItem>
                <StatLabel>ATH Tarihi</StatLabel>
                <StatValue>{formatDate(coin.market_data.ath_date.usd)}</StatValue>
              </StatItem>
              
              <StatItem>
                <StatLabel>Tüm Zamanların En Düşüğü</StatLabel>
                <StatValue>{formatCurrency(coin.market_data.atl.usd)}</StatValue>
              </StatItem>
              
              <StatItem>
                <StatLabel>ATL Tarihi</StatLabel>
                <StatValue>{formatDate(coin.market_data.atl_date.usd)}</StatValue>
              </StatItem>
            </StatsSection>
          </Card>
          
          <Card>
            <CardTitle>
              <FaShoppingCart /> Alım Satım
            </CardTitle>
            
            <div style={{ textAlign: 'center' }}>
              <p>Henüz borsalar listelenmedi</p>
              <Button primary style={{ width: '100%', marginTop: '1rem' }} onClick={handleAddToPortfolio}>
                <FaPlus />
                Portföye Ekle
              </Button>
            </div>
          </Card>
        </Sidebar>
      </ContentGrid>
    </Container>
  );
};

export default CoinDetail; 