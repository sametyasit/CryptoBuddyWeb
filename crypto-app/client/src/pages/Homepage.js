import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { coinAPI } from '../services/api';
import GlobalStats from '../components/GlobalStats';
import CoinTable from '../components/CoinTable';
import TopGainersLosers from '../components/TopGainersLosers';
import TrendingCoins from '../components/TrendingCoins';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const HeroSection = styled.div`
  margin: 2rem 0 3rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(to right, var(--primary), #e0a800);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: var(--subText);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (min-width: 992px) {
    grid-template-columns: 7fr 3fr;
  }
`;

const MainContent = styled.div``;

const Sidebar = styled.div``;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0;
`;

const ViewAllLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--primary);
  font-weight: 600;
  font-size: 0.9rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Homepage = () => {
  const [globalStats, setGlobalStats] = useState(null);
  const [coins, setCoins] = useState([]);
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Global piyasa verilerini al
        const globalData = await coinAPI.getGlobalStats();
        setGlobalStats(globalData);
        
        // Kripto para listesini al (sayfa 1, limit 10)
        const coinsData = await coinAPI.getCoins({ page: 1, limit: 10 });
        setCoins(coinsData);
        
        // En çok kazandıran ve kaybettiren kripto paraları al
        const gainersLosersData = await coinAPI.getGainersLosers();
        setTopGainers(gainersLosersData.gainers.slice(0, 5));
        setTopLosers(gainersLosersData.losers.slice(0, 5));
        
        // Trend kripto paraları al
        const trendingData = await coinAPI.getTrendingCoins();
        setTrendingCoins(trendingData);
        
      } catch (err) {
        console.error('Ana sayfa verileri alınırken hata oluştu:', err);
        setError('Kripto para verileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Mock data (gerçek API'ye bağlanmadan önce demo amaçlı)
  const mockGlobalStats = {
    totalMarketCap: 2470000000000,
    volume24h: 98600000000,
    marketCapChange: 2.4,
    btcDominance: 52.3,
    activeCoins: 10482
  };
  
  const mockCoins = [
    {
      id: 'bitcoin',
      rank: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      price: 52000,
      marketCap: 1010000000000,
      volume: 32000000000,
      change24h: 2.5
    },
    {
      id: 'ethereum',
      rank: 2,
      name: 'Ethereum',
      symbol: 'ETH',
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      price: 2800,
      marketCap: 337000000000,
      volume: 15800000000,
      change24h: 3.1
    },
    {
      id: 'binancecoin',
      rank: 3,
      name: 'Binance Coin',
      symbol: 'BNB',
      image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
      price: 380,
      marketCap: 64200000000,
      volume: 1900000000,
      change24h: 1.2
    },
    {
      id: 'solana',
      rank: 4,
      name: 'Solana',
      symbol: 'SOL',
      image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
      price: 96,
      marketCap: 41100000000,
      volume: 2800000000,
      change24h: 4.8
    },
    {
      id: 'ripple',
      rank: 5,
      name: 'XRP',
      symbol: 'XRP',
      image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
      price: 0.52,
      marketCap: 28300000000,
      volume: 1250000000,
      change24h: -0.7
    },
    {
      id: 'cardano',
      rank: 6,
      name: 'Cardano',
      symbol: 'ADA',
      image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
      price: 0.37,
      marketCap: 13100000000,
      volume: 350000000,
      change24h: 0.5
    },
    {
      id: 'dogecoin',
      rank: 7,
      name: 'Dogecoin',
      symbol: 'DOGE',
      image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
      price: 0.09,
      marketCap: 12500000000,
      volume: 620000000,
      change24h: 1.8
    },
    {
      id: 'polkadot',
      rank: 8,
      name: 'Polkadot',
      symbol: 'DOT',
      image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
      price: 5.90,
      marketCap: 8400000000,
      volume: 230000000,
      change24h: 2.1
    },
    {
      id: 'matic-network',
      rank: 9,
      name: 'Polygon',
      symbol: 'MATIC',
      image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
      price: 0.65,
      marketCap: 6300000000,
      volume: 320000000,
      change24h: 3.5
    },
    {
      id: 'avalanche-2',
      rank: 10,
      name: 'Avalanche',
      symbol: 'AVAX',
      image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
      price: 35.20,
      marketCap: 5900000000,
      volume: 290000000,
      change24h: 5.2
    }
  ];
  
  const mockGainers = [
    {
      id: 'jasmy',
      name: 'Jasmy',
      symbol: 'JASMY',
      image: 'https://assets.coingecko.com/coins/images/13876/large/jasmy.jpg',
      price: 0.0074,
      change24h: 24.5
    },
    {
      id: 'immutable-x',
      name: 'Immutable',
      symbol: 'IMX',
      image: 'https://assets.coingecko.com/coins/images/17233/large/immutableX-symbol-Gradient.png',
      price: 2.86,
      change24h: 18.7
    },
    {
      id: 'fetch-ai',
      name: 'Fetch.ai',
      symbol: 'FET',
      image: 'https://assets.coingecko.com/coins/images/5681/large/Fetch.jpg',
      price: 0.98,
      change24h: 15.3
    },
    {
      id: 'injective-protocol',
      name: 'Injective',
      symbol: 'INJ',
      image: 'https://assets.coingecko.com/coins/images/12882/large/Secondary_Symbol.png',
      price: 32.35,
      change24h: 12.8
    },
    {
      id: 'chiliz',
      name: 'Chiliz',
      symbol: 'CHZ',
      image: 'https://assets.coingecko.com/coins/images/8834/large/Chiliz.png',
      price: 0.12,
      change24h: 10.2
    }
  ];
  
  const mockLosers = [
    {
      id: 'pepe',
      name: 'Pepe',
      symbol: 'PEPE',
      image: 'https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg',
      price: 0.000001032,
      change24h: -12.8
    },
    {
      id: 'sui',
      name: 'Sui',
      symbol: 'SUI',
      image: 'https://assets.coingecko.com/coins/images/26375/large/sui_asset.jpeg',
      price: 0.98,
      change24h: -8.5
    },
    {
      id: 'artificial-superintelligence',
      name: 'Artificial Superintelligence',
      symbol: 'ASI',
      image: 'https://assets.coingecko.com/coins/images/31252/large/asi.png',
      price: 0.34,
      change24h: -7.6
    },
    {
      id: 'worldcoin',
      name: 'Worldcoin',
      symbol: 'WLD',
      image: 'https://assets.coingecko.com/coins/images/31069/large/worldcoin.png',
      price: 3.45,
      change24h: -6.9
    },
    {
      id: 'shiba-inu',
      name: 'Shiba Inu',
      symbol: 'SHIB',
      image: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png',
      price: 0.00001823,
      change24h: -5.4
    }
  ];
  
  const mockTrending = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      price: 52000,
      change24h: 2.5
    },
    {
      id: 'solana',
      name: 'Solana',
      symbol: 'SOL',
      image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
      price: 96,
      change24h: 4.8
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      price: 2800,
      change24h: 3.1
    },
    {
      id: 'blast',
      name: 'Blast',
      symbol: 'BLAST',
      image: 'https://assets.coingecko.com/coins/images/35163/large/blast.png',
      price: 0.42,
      change24h: 8.7
    },
    {
      id: 'celestia',
      name: 'Celestia',
      symbol: 'TIA',
      image: 'https://assets.coingecko.com/coins/images/31967/large/tia.jpg',
      price: 11.25,
      change24h: 6.3
    }
  ];
  
  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    return <ErrorMessage message={error} />;
  }
  
  // API verilerinin yokluğunda mock verileri kullan
  const displayGlobalStats = globalStats || mockGlobalStats;
  const displayCoins = coins.length > 0 ? coins : mockCoins;
  const displayGainers = topGainers.length > 0 ? topGainers : mockGainers;
  const displayLosers = topLosers.length > 0 ? topLosers : mockLosers;
  const displayTrending = trendingCoins.length > 0 ? trendingCoins : mockTrending;
  
  return (
    <Container>
      <HeroSection>
        <Title>Kripto Dünyasını Keşfedin</Title>
        <Subtitle>
          Gerçek zamanlı fiyatlar, piyasa değerleri ve kripto dünyasındaki son gelişmeler hakkında güncel bilgiler CryptoBuddy'de.
        </Subtitle>
      </HeroSection>
      
      <GlobalStats data={displayGlobalStats} />
      
      <GridContainer>
        <MainContent>
          <SectionHeader>
            <SectionTitle>En Popüler Kripto Paralar</SectionTitle>
            <ViewAllLink to="/coins">
              Tümünü Gör <FaArrowRight />
            </ViewAllLink>
          </SectionHeader>
          
          <CoinTable coins={displayCoins} showStarColumn={false} />
        </MainContent>
        
        <Sidebar>
          <TrendingCoins coins={displayTrending} />
          <TopGainersLosers gainers={displayGainers} losers={displayLosers} />
        </Sidebar>
      </GridContainer>
    </Container>
  );
};

export default Homepage; 