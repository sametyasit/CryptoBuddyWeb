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

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.5rem;
  overflow-x: auto;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  white-space: nowrap;
  color: ${props => (props.active ? 'var(--primary)' : 'var(--text)')};
  font-weight: ${props => (props.active ? '600' : '400')};
  border-bottom: ${props => (props.active ? '2px solid var(--primary)' : 'none')};
  
  &:hover {
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

const fetchPriceHistory = async (id, days = '7') => {
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
    console.error('Error fetching price history:', error);
    return null;
  }
};

const CoinDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('24h');
  const [priceHistory, setPriceHistory] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

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

        // Fetch price history
        const days = timeRange === '24h' ? '1' : 
                    timeRange === '7d' ? '7' :
                    timeRange === '30d' ? '30' :
                    timeRange === '90d' ? '90' :
                    timeRange === '1y' ? '365' : 'max';
        
        const historyData = await fetchPriceHistory(id, days);
        
        setCoin(coinResponse.data);
        setPriceHistory(historyData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Veri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, timeRange]);
  
  // Mock coin data (Gerçek API'den gelen veri yapısına adapte edilecek)
  const mockCoin = {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'btc',
    market_cap_rank: 1,
    image: {
      large: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
    },
    market_data: {
      current_price: {
        usd: 52000
      },
      price_change_percentage_24h: 2.5,
      price_change_percentage_7d: 8.75,
      price_change_percentage_30d: 15.3,
      market_cap: {
        usd: 1010000000000
      },
      total_volume: {
        usd: 32000000000
      },
      high_24h: {
        usd: 53000
      },
      low_24h: {
        usd: 51000
      },
      ath: {
        usd: 69000
      },
      ath_date: {
        usd: '2021-11-10T14:24:11.849Z'
      },
      atl: {
        usd: 67.81
      },
      atl_date: {
        usd: '2013-07-06T00:00:00.000Z'
      },
      circulating_supply: 19400000,
      total_supply: 21000000,
      max_supply: 21000000
    },
    description: {
      en: "Bitcoin is the first successful internet money based on peer-to-peer technology; whereby no central bank or authority is involved in the transaction and production of the Bitcoin currency. It was created by an anonymous individual/group under the name, Satoshi Nakamoto. The source code is available publicly as an open source project, anybody can look at it and be part of the developmental process.\r\n\r\nBitcoin is changing the way we see money as we speak. The idea was to produce a means of exchange, independent of any central authority, that could be transferred electronically in a secure, verifiable and immutable way. It is a decentralized peer-to-peer internet currency making mobile payment easy, very low transaction fees, protects your identity, and it works anywhere all the time with no central authority and banks.\r\n\r\nBitcoin is designed to have only 21 million BTC ever created, thus making it a deflationary currency. Bitcoin uses the <a href=\"https://www.investopedia.com/terms/h/hash.asp\">SHA-256</a> hashing algorithm with an average transaction confirmation time of 10 minutes. Miners today are mining Bitcoin using ASIC chip dedicated to only mining Bitcoin, and the hash rate has shot up to peta hashes.\r\n\r\nBeing the first successful online cryptography currency, Bitcoin has inspired other alternative currencies such as <a href=\"https://www.coingecko.com/en/coins/litecoin\">Litecoin</a>, <a href=\"https://www.coingecko.com/en/coins/peercoin\">Peercoin</a>, <a href=\"https://www.coingecko.com/en/coins/primecoin\">Primecoin</a>, and so on."
    },
    links: {
      homepage: ["https://bitcoin.org/"],
      blockchain_site: ["https://blockchair.com/bitcoin/", "https://btc.com/", "https://btc.tokenview.io/"],
      official_forum_url: ["https://bitcointalk.org/"],
      chat_url: [""],
      announcement_url: [""],
      twitter_screen_name: "bitcoin",
      facebook_username: "bitcoins",
      telegram_channel_identifier: "",
      subreddit_url: "https://www.reddit.com/r/Bitcoin/",
      repos_url: {
        github: ["https://github.com/bitcoin/bitcoin"]
      }
    },
    categories: ["Cryptocurrency", "Layer 1 (L1)"]
  };
  
  // API'den veri henüz gelmemişse mockup verileri kullan
  const coinData = coin || mockCoin;
  
  const toggleFavorite = () => {
    if (!isAuthenticated) {
      // Kullanıcı giriş yapmamışsa, giriş yapması gerektiğini bildir veya direkt giriş sayfasına yönlendir
      alert('Favorilere eklemek için giriş yapmalısınız');
      return;
    }
    
    setIsFavorite(!isFavorite);
    // Burada API çağrısı yapılarak favori durumu güncellenebilir
  };
  
  const handleAddToPortfolio = () => {
    if (!isAuthenticated) {
      alert('Portföye eklemek için giriş yapmalısınız');
      return;
    }
    
    // Portföy ekleme sayfasına yönlendir veya modal göster
    console.log(`${coinData.name} portföye eklenecek`);
  };
  
  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    return <ErrorMessage message={error} />;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(price);
  };
  
  const formatNumber = (num) => {
    return new Intl.NumberFormat('tr-TR', {
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(num);
  };
  
  const chartData = priceHistory ? {
    labels: priceHistory.map(item => {
      const date = new Date(item[0]);
      return timeRange === '24h' 
        ? date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    }),
    datasets: [
      {
        label: 'Fiyat',
        data: priceHistory.map(item => item[1]),
        borderColor: 'var(--primary)',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHitRadius: 20,
      }
    ]
  } : null;
  
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
          color: 'var(--subText)',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8
        }
      },
      y: {
        grid: {
          color: 'var(--border)'
        },
        ticks: {
          color: 'var(--subText)',
          callback: function(value) {
            return formatCurrency(value, { notation: 'compact' });
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <Container>
      <Breadcrumbs>
        <BreadcrumbItem to="/">Ana Sayfa</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem to="/coins">Kripto Paralar</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <CurrentBreadcrumb>{coinData.name}</CurrentBreadcrumb>
      </Breadcrumbs>
      
      <Header>
        <CoinInfo>
          <CoinImage src={coinData.image.large} alt={coinData.name} />
          <CoinTitle>
            <TitleRow>
              <CoinName>{coinData.name}</CoinName>
              <CoinSymbol>{coinData.symbol}</CoinSymbol>
              <CoinRank>Sıra #{coinData.market_cap_rank}</CoinRank>
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
                {formatCurrency(coinData.market_data.current_price.usd)}
              </CurrentPrice>
              <PriceChange isPositive={coinData.market_data.price_change_percentage_24h >= 0}>
                {coinData.market_data.price_change_percentage_24h >= 0 ? <FaCaretUp /> : <FaCaretDown />}
                {Math.abs(coinData.market_data.price_change_percentage_24h).toFixed(2)}%
              </PriceChange>
            </PriceRow>
            
            <PriceDetails>
              <PriceDetailItem>
                <DetailLabel>24s En Yüksek</DetailLabel>
                <DetailValue>{formatCurrency(coinData.market_data.high_24h.usd)}</DetailValue>
              </PriceDetailItem>
              <PriceDetailItem>
                <DetailLabel>24s En Düşük</DetailLabel>
                <DetailValue>{formatCurrency(coinData.market_data.low_24h.usd)}</DetailValue>
              </PriceDetailItem>
              <PriceDetailItem>
                <DetailLabel>7g Değişim</DetailLabel>
                <DetailValue style={{ color: coinData.market_data.price_change_percentage_7d >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {formatPercentage(coinData.market_data.price_change_percentage_7d)}
                </DetailValue>
              </PriceDetailItem>
              <PriceDetailItem>
                <DetailLabel>30g Değişim</DetailLabel>
                <DetailValue style={{ color: coinData.market_data.price_change_percentage_30d >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {formatPercentage(coinData.market_data.price_change_percentage_30d)}
                </DetailValue>
              </PriceDetailItem>
            </PriceDetails>
          </PriceSection>
          
          <Card>
            <CardTitle>
              <FaChartLine /> Fiyat Grafiği
            </CardTitle>
            
            <TabsContainer>
              <Tab 
                active={activeTab === '24h'} 
                onClick={() => setActiveTab('24h')}
              >
                24 Saat
              </Tab>
              <Tab 
                active={activeTab === '7d'} 
                onClick={() => setActiveTab('7d')}
              >
                7 Gün
              </Tab>
              <Tab 
                active={activeTab === '30d'} 
                onClick={() => setActiveTab('30d')}
              >
                30 Gün
              </Tab>
              <Tab 
                active={activeTab === '90d'} 
                onClick={() => setActiveTab('90d')}
              >
                90 Gün
              </Tab>
              <Tab 
                active={activeTab === '1y'} 
                onClick={() => setActiveTab('1y')}
              >
                1 Yıl
              </Tab>
              <Tab 
                active={activeTab === 'all'} 
                onClick={() => setActiveTab('all')}
              >
                Tüm Zamanlar
              </Tab>
            </TabsContainer>
            
            <ChartContainer>
              <TimeRangeButtons>
                <TimeRangeButton
                  active={timeRange === '24h'}
                  onClick={() => setTimeRange('24h')}
                >
                  24 Saat
                </TimeRangeButton>
                <TimeRangeButton
                  active={timeRange === '7d'}
                  onClick={() => setTimeRange('7d')}
                >
                  7 Gün
                </TimeRangeButton>
                <TimeRangeButton
                  active={timeRange === '30d'}
                  onClick={() => setTimeRange('30d')}
                >
                  30 Gün
                </TimeRangeButton>
                <TimeRangeButton
                  active={timeRange === '1y'}
                  onClick={() => setTimeRange('1y')}
                >
                  1 Yıl
                </TimeRangeButton>
              </TimeRangeButtons>
              
              {chartData && (
                <Line data={chartData} options={chartOptions} />
              )}
            </ChartContainer>
          </Card>
          
          <AboutSection>
            <Card>
              <CardTitle>
                <FaFileAlt /> {coinData.name} Hakkında
              </CardTitle>
              
              <Description dangerouslySetInnerHTML={{ __html: coinData.description.en }} />
              
              <LinksGrid>
                {coinData.links.homepage[0] && (
                  <LinkItem href={coinData.links.homepage[0]} target="_blank" rel="noopener noreferrer">
                    <FaGlobe />
                    <LinkText>Resmi Web Sitesi</LinkText>
                  </LinkItem>
                )}
                
                {coinData.links.repos_url.github[0] && (
                  <LinkItem href={coinData.links.repos_url.github[0]} target="_blank" rel="noopener noreferrer">
                    <FaGithub />
                    <LinkText>GitHub</LinkText>
                  </LinkItem>
                )}
                
                {coinData.links.twitter_screen_name && (
                  <LinkItem href={`https://twitter.com/${coinData.links.twitter_screen_name}`} target="_blank" rel="noopener noreferrer">
                    <FaTwitter />
                    <LinkText>Twitter</LinkText>
                  </LinkItem>
                )}
                
                {coinData.links.subreddit_url && (
                  <LinkItem href={coinData.links.subreddit_url} target="_blank" rel="noopener noreferrer">
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
                <StatValue>{formatCurrency(coinData.market_data.market_cap.usd, { notation: 'compact' })}</StatValue>
              </StatItem>
              
              <StatItem>
                <StatLabel>24s Hacim</StatLabel>
                <StatValue>{formatCurrency(coinData.market_data.total_volume.usd, { notation: 'compact' })}</StatValue>
              </StatItem>
              
              <StatItem>
                <StatLabel>Dolaşımdaki Arz</StatLabel>
                <StatValue>{formatCurrency(coinData.market_data.circulating_supply, { style: 'decimal', notation: 'compact' })}</StatValue>
              </StatItem>
              
              <StatItem>
                <StatLabel>Toplam Arz</StatLabel>
                <StatValue>
                  {coinData.market_data.total_supply 
                    ? formatCurrency(coinData.market_data.total_supply, { style: 'decimal', notation: 'compact' })
                    : 'Sınırsız'}
                </StatValue>
              </StatItem>
              
              <StatItem>
                <StatLabel>Maksimum Arz</StatLabel>
                <StatValue>
                  {coinData.market_data.max_supply 
                    ? formatCurrency(coinData.market_data.max_supply, { style: 'decimal', notation: 'compact' })
                    : 'Belirtilmemiş'}
                </StatValue>
              </StatItem>
              
              <StatItem>
                <StatLabel>Tüm Zamanların En Yükseği</StatLabel>
                <StatValue>{formatCurrency(coinData.market_data.ath.usd)}</StatValue>
              </StatItem>
              
              <StatItem>
                <StatLabel>ATH Tarihi</StatLabel>
                <StatValue>{formatDate(coinData.market_data.ath_date.usd)}</StatValue>
              </StatItem>
              
              <StatItem>
                <StatLabel>Tüm Zamanların En Düşüğü</StatLabel>
                <StatValue>{formatCurrency(coinData.market_data.atl.usd)}</StatValue>
              </StatItem>
              
              <StatItem>
                <StatLabel>ATL Tarihi</StatLabel>
                <StatValue>{formatDate(coinData.market_data.atl_date.usd)}</StatValue>
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