import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaChartLine, FaRobot, FaShieldAlt, FaBell, FaExchangeAlt, FaSpinner, FaChevronDown } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

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

const Card = styled.div`
  background: var(--cardBackground);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const Description = styled.p`
  color: var(--text);
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const FeatureCard = styled.div`
  background: var(--background);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
`;

const FeatureDescription = styled.p`
  color: var(--subText);
  font-size: 0.9rem;
`;

const Button = styled.button`
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: var(--primary-dark);
  }
  
  &:disabled {
    background: var(--border);
    cursor: not-allowed;
  }
`;

const Form = styled.form`
  margin-top: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--background);
  color: var(--text);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--background);
  color: var(--text);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const TabContainer = styled.div`
  margin-bottom: 2rem;
`;

const AiMenuContainer = styled.div`
  margin-bottom: 2rem;
`;

const AiMenuHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const AiMenuTitle = styled.h3`
  margin: 0;
  color: var(--text);
`;

const DropdownSelector = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1.5rem;
`;

const DropdownButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--cardBackground);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  color: var(--text);
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--hover);
  }
  
  svg {
    transition: transform 0.2s ease;
    transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--cardBackground);
  border: 1px solid var(--border);
  border-radius: 8px;
  z-index: 100;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  margin-top: 5px;
  overflow: hidden;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  text-align: left;
  background: ${({ active }) => active ? 'var(--hover)' : 'transparent'};
  border: none;
  cursor: pointer;
  color: var(--text);
  transition: background 0.2s ease;
  
  &:hover {
    background: var(--hover);
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid var(--border);
  }
`;

const ContentContainer = styled.div`
  padding: 1.5rem;
  background: var(--cardBackground);
  border-radius: 8px;
  border: 1px solid var(--border);
`;

const ChartPlaceholder = styled.div`
  height: 300px;
  background: var(--background);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  border: 1px dashed var(--border);
`;

const AlertContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${props => props.type === 'success' ? 'rgba(0, 200, 83, 0.1)' : 'rgba(255, 0, 0, 0.1)'};
  border-left: 4px solid ${props => props.type === 'success' ? 'var(--success)' : 'var(--danger)'};
  border-radius: 4px;
  color: var(--text);
`;

const ResultCard = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--cardBackground);
  border-radius: 8px;
  box-shadow: var(--shadow);
`;

const CoinSuggestion = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  
  &:last-child {
    border-bottom: none;
  }
`;

const CoinIcon = styled.div`
  width: 40px;
  height: 40px;
  background: var(--background);
  border-radius: 50%;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  font-weight: bold;
`;

const CoinInfo = styled.div`
  flex: 1;
`;

const CoinName = styled.div`
  font-weight: 500;
`;

const CoinAllocation = styled.div`
  font-size: 0.9rem;
  color: var(--subText);
`;

const CoinChange = styled.div`
  color: ${props => props.isPositive ? 'var(--success)' : 'var(--danger)'};
  font-weight: 500;
`;

const Spinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
  
  svg {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const GPTResponse = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--cardBackground);
  border-radius: 8px;
  box-shadow: var(--shadow);
  white-space: pre-wrap;
`;

const AIBasket = () => {
  const location = useLocation();
  
  // URL'den tab parametresini al veya varsayılan olarak 'market' kullan
  const getTabFromUrl = () => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    return tab && ['market', 'suggestions', 'alerts', 'strategies'].includes(tab) ? tab : 'market';
  };
  
  const [activeTab, setActiveTab] = useState(getTabFromUrl());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [riskLevel, setRiskLevel] = useState('moderate');
  const [strategyType, setStrategyType] = useState('trend');
  const [strategyRiskLevel, setStrategyRiskLevel] = useState('moderate');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [coinCount, setCoinCount] = useState(5);
  const [timeHorizon, setTimeHorizon] = useState(12);
  const [showResult, setShowResult] = useState(false);
  const [showStrategyResult, setShowStrategyResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [strategyLoading, setStrategyLoading] = useState(false);
  const [gptResponse, setGptResponse] = useState('');
  const [strategyResponse, setStrategyResponse] = useState('');
  
  const mockMarketTrends = [
    { trend: "Bitcoin 50 günlük ortalamasının üzerine çıktı", sentiment: "bullish" },
    { trend: "Altcoin piyasası toparlanma sinyalleri veriyor", sentiment: "bullish" },
    { trend: "DeFi projelerinde kullanıcı sayısı artıyor", sentiment: "bullish" },
    { trend: "Metaverse tokenlarında düşüş trendi devam ediyor", sentiment: "bearish" },
    { trend: "Regülasyon endişeleri stablecoin piyasasını etkiliyor", sentiment: "bearish" }
  ];
  
  const mockPortfolioSuggestions = [
    { name: 'Bitcoin (BTC)', allocation: '40%', change: '+5.2%', icon: 'BTC' },
    { name: 'Ethereum (ETH)', allocation: '30%', change: '+3.8%', icon: 'ETH' },
    { name: 'Cardano (ADA)', allocation: '10%', change: '+2.1%', icon: 'ADA' },
    { name: 'Solana (SOL)', allocation: '10%', change: '-1.2%', icon: 'SOL' },
    { name: 'Polkadot (DOT)', allocation: '10%', change: '+0.8%', icon: 'DOT' }
  ];
  
  const fetchGPTResponse = async (prompt) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Dinamik olarak coin sayısına göre portföy oluşturma
        const coins = [];
        
        // Risk seviyesine göre farklı coin listeleri
        const lowRiskCoins = [
          { name: 'Bitcoin (BTC)', description: 'Piyasanın en büyük ve en istikrarlı kripto parası, düşük riskli portföylerin temel taşıdır.' },
          { name: 'Ethereum (ETH)', description: 'Akıllı kontrat altyapısının lideri, geniş ekosistemi ile uzun vadeli potansiyel sunuyor.' },
          { name: 'Binance Coin (BNB)', description: 'Dünyanın en büyük kripto para borsasının coin\'i, istikrarlı büyüme gösteriyor.' },
          { name: 'Solana (SOL)', description: 'Yüksek işlem hızı ve düşük maliyeti ile uzun vadede potansiyel gösteriyor.' },
          { name: 'Cardano (ADA)', description: 'Bilimsel yaklaşımı ve sürdürülebilir vizyonu ile güvenli yatırım alternatifi.' },
          { name: 'XRP (XRP)', description: 'Finansal kurumlar için geliştirilen hızlı ve düşük maliyetli ödeme ağı.' },
          { name: 'Polkadot (DOT)', description: 'Farklı blokzincirleri birbirine bağlayan interoperabilite çözümü.' },
          { name: 'Avalanche (AVAX)', description: 'Yüksek hızlı, düşük maliyetli ve çevre dostu akıllı kontrat platformu.' },
          { name: 'Chainlink (LINK)', description: 'Blokzincir uygulamaları için gerçek dünya verilerini sağlayan oracle çözümü.' },
          { name: 'Polygon (MATIC)', description: 'Ethereum\'un ölçeklenebilirliğini artıran Layer-2 çözümü.' },
        ];
        
        const mediumRiskCoins = [
          { name: 'Bitcoin (BTC)', description: 'Piyasanın en büyük ve en istikrarlı kripto parası.' },
          { name: 'Ethereum (ETH)', description: 'Akıllı kontrat altyapısının lideri ve DeFi ekosisteminin temeli.' },
          { name: 'Solana (SOL)', description: 'Yüksek işlem hızı ile ön plana çıkan akıllı kontrat platformu.' },
          { name: 'Polkadot (DOT)', description: 'Farklı blokzincirleri birbirine bağlayan interoperabilite çözümü.' },
          { name: 'Avalanche (AVAX)', description: 'Yüksek hızlı, düşük maliyetli ve çevre dostu akıllı kontrat platformu.' },
          { name: 'Uniswap (UNI)', description: 'Önde gelen merkeziyetsiz borsa protokolü.' },
          { name: 'Cosmos (ATOM)', description: 'Blokzincirler arası iletişim ve ölçeklenebilirlik sağlayan ekosistem.' },
          { name: 'Aave (AAVE)', description: 'Lider merkeziyetsiz borç verme protokolü.' },
          { name: 'Fantom (FTM)', description: 'Yüksek hızlı, düşük maliyetli akıllı kontrat platformu.' },
          { name: 'The Graph (GRT)', description: 'Blokzincir verilerini indeksleyen ve sorgulayan protokol.' },
          { name: 'Algorand (ALGO)', description: 'Ölçeklenebilir, güvenli ve merkeziyetsiz blokzincir platformu.' },
          { name: 'Theta Network (THETA)', description: 'Merkeziyetsiz video yayın ağı.' },
          { name: 'VeChain (VET)', description: 'Tedarik zinciri yönetimi odaklı kurumsal blokzincir çözümü.' },
          { name: 'Hedera (HBAR)', description: 'Kurumsal uygulamalar için güvenli, hızlı dağıtık defter teknolojisi.' },
          { name: 'Stellar (XLM)', description: 'Küresel ödeme sistemleri için düşük maliyetli, hızlı transfer çözümü.' },
        ];
        
        const highRiskCoins = [
          { name: 'Ethereum (ETH)', description: 'Akıllı kontrat altyapısının lideri ve DeFi ekosisteminin temeli.' },
          { name: 'Solana (SOL)', description: 'Yüksek işlem hızı ile ön plana çıkan akıllı kontrat platformu.' },
          { name: 'Aptos (APT)', description: 'Yeni nesil Layer-1 blokzinciri, yüksek performans ve güvenlik sunuyor.' },
          { name: 'Render (RNDR)', description: 'Merkeziyetsiz GPU render ağı.' },
          { name: 'Arbitrum (ARB)', description: 'Ethereum için Layer-2 ölçeklendirme çözümü.' },
          { name: 'Injective (INJ)', description: 'Merkeziyetsiz türev ticareti için zincirler arası protokol.' },
          { name: 'Sui (SUI)', description: 'Yüksek verimli, güvenli ve ölçeklenebilir Layer-1 blokzinciri.' },
          { name: 'Optimism (OP)', description: 'Ethereum için Layer-2 ölçeklendirme çözümü.' },
          { name: 'Immutable X (IMX)', description: 'NFT odaklı Layer-2 ölçeklendirme çözümü.' },
          { name: 'Kaspa (KAS)', description: 'Yüksek işlem hacmi için tasarlanmış yenilikçi blokzincir.' },
          { name: 'Stacks (STX)', description: 'Bitcoin için akıllı kontrat ve DApp geliştirme platformu.' },
          { name: 'Mina Protocol (MINA)', description: 'Dünyanın en hafif blokzinciri, gizlilik odaklı akıllı kontratlar.' },
          { name: 'Conflux (CFX)', description: 'Yüksek işlem hızı sunan konsensüs algoritması ile çalışan blokzincir.' },
          { name: 'Fetch.ai (FET)', description: 'Yapay zeka ve makine öğrenimi odaklı blokzincir projesi.' },
          { name: 'Arweave (AR)', description: 'Kalıcı veri depolama için merkeziyetsiz çözüm.' },
          { name: 'The Sandbox (SAND)', description: 'Merkeziyetsiz metaverse ve oyun ekosistemi.' },
          { name: 'Decentraland (MANA)', description: 'Kullanıcı kontrollü sanal gerçeklik platformu.' },
          { name: 'Enjin Coin (ENJ)', description: 'Oyun varlıkları için blokzincir platformu.' },
          { name: 'Chiliz (CHZ)', description: 'Spor ve eğlence için fan token platformu.' },
          { name: 'Audius (AUDIO)', description: 'Merkeziyetsiz müzik yayın platformu.' },
        ];
        
        // Risk seviyesine göre coin listesi seçimi
        let selectedCoins;
        let riskLabel;
        
        if (riskLevel === 'low') {
          selectedCoins = lowRiskCoins;
          riskLabel = 'düşük riskli';
        } else if (riskLevel === 'moderate') {
          selectedCoins = mediumRiskCoins;
          riskLabel = 'orta riskli';
        } else {
          selectedCoins = highRiskCoins;
          riskLabel = 'yüksek riskli';
        }
        
        // Talep edilen coin sayısı kadar rastgele seçim (veya maksimum mevcut coin sayısı kadar)
        const actualCoinCount = Math.min(coinCount, selectedCoins.length);
        const shuffledCoins = [...selectedCoins].sort(() => 0.5 - Math.random()).slice(0, actualCoinCount);
        
        // Risk seviyesine göre ağırlık dağılımı stratejisi belirleme
        let totalWeight = 0;
        
        // Coin ağırlıklarını risk seviyesine göre ayarlama
        if (riskLevel === 'low') {
          // Düşük risk: Ana coinlere daha yüksek ağırlık (eğer varsa)
          shuffledCoins.forEach((coin, index) => {
            // Bitcoin ve Ethereum varsa, daha yüksek ağırlık
            if (coin.name.includes('Bitcoin')) {
              coin.weight = 30 + Math.floor(Math.random() * 10); // %30-40
            } else if (coin.name.includes('Ethereum')) {
              coin.weight = 20 + Math.floor(Math.random() * 10); // %20-30
            } else if (index < 2) {
              coin.weight = 15 + Math.floor(Math.random() * 5); // %15-20
            } else {
              coin.weight = 5 + Math.floor(Math.random() * 5); // %5-10
            }
            totalWeight += coin.weight;
          });
        } else if (riskLevel === 'moderate') {
          // Orta risk: Daha dengeli dağılım
          shuffledCoins.forEach((coin, index) => {
            if (coin.name.includes('Bitcoin')) {
              coin.weight = 20 + Math.floor(Math.random() * 10); // %20-30
            } else if (coin.name.includes('Ethereum')) {
              coin.weight = 15 + Math.floor(Math.random() * 10); // %15-25
            } else if (index < 3) {
              coin.weight = 10 + Math.floor(Math.random() * 10); // %10-20
            } else {
              coin.weight = 5 + Math.floor(Math.random() * 10); // %5-15
            }
            totalWeight += coin.weight;
          });
        } else {
          // Yüksek risk: Daha eşit dağılım, altcoinlere daha fazla ağırlık
          shuffledCoins.forEach((coin, index) => {
            if (coin.name.includes('Ethereum')) {
              coin.weight = 15 + Math.floor(Math.random() * 10); // %15-25
            } else {
              const baseWeight = Math.floor(100 / shuffledCoins.length);
              coin.weight = baseWeight + Math.floor(Math.random() * 5) - 2; // Dengeli dağılım ±2
            }
            totalWeight += coin.weight;
          });
        }
        
        // Ağırlıkları normalleştirme (toplamı 100% yapmak için)
        shuffledCoins.forEach(coin => {
          coin.weight = Math.round((coin.weight / totalWeight) * 100);
        });
        
        // Yuvarlama hataları nedeniyle toplam 100'den farklı olabilir, son coinle dengeleme
        const weightsSum = shuffledCoins.reduce((sum, coin) => sum + coin.weight, 0);
        if (weightsSum !== 100 && shuffledCoins.length > 0) {
          shuffledCoins[shuffledCoins.length - 1].weight += (100 - weightsSum);
        }
        
        // Portföy dağılımını oluşturma
        let portfolioText = `${riskLabel.charAt(0).toUpperCase() + riskLabel.slice(1)} ${investmentAmount} dolarlık ${actualCoinCount} adet kripto para için ${timeHorizon} aylık yatırım portföyü:\n\n`;
        
        shuffledCoins.forEach((coin, index) => {
          const allocation = Math.round(investmentAmount * coin.weight / 100);
          portfolioText += `${index + 1}. ${coin.name} - %${coin.weight} - ${allocation} USD\n   ${coin.description}\n\n`;
        });
        
        // Risk seviyesine göre farklı öneriler ekleme
        if (riskLevel === 'low') {
          portfolioText += `Bu düşük riskli portföy, piyasanın daha stabil coinlerine ağırlık vererek sermayenizi korumayı amaçlamaktadır. ${timeHorizon} aylık yatırım süresi için düzenli olarak 3 ayda bir portföy dengelemesi yapmanız önerilir.`;
        } else if (riskLevel === 'moderate') {
          portfolioText += `Bu orta riskli portföy, stabil coinler ile gelişmekte olan projeleri dengeli bir şekilde içermektedir. ${timeHorizon} aylık yatırım süresi için ayda bir piyasa koşullarını değerlendirmeniz ve gerekirse portföy ayarlaması yapmanız önerilir.`;
        } else {
          portfolioText += `Bu yüksek riskli portföy, büyüme potansiyeli olan yenilikçi projelere odaklanmaktadır. Volatilite yüksek olacağından, ${timeHorizon} aylık yatırım süresi boyunca haftalık takip yapmanız ve piyasa koşullarına göre hızlı karar almanız önerilir.`;
        }
        
        resolve(portfolioText);
      }, 2000);
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowResult(false);
    
    const riskLevelText = riskLevel === 'low' ? 'düşük riskli' : 
                         riskLevel === 'moderate' ? 'orta riskli' : 'yüksek riskli';
    
    const prompt = `${investmentAmount} dolarlık ${coinCount} tane coin olan bir coin sepeti oluşturulacak ve bu sepet ${timeHorizon} ay boyunca tutulacak ve ${riskLevelText} olacak bu bilgiler ile bana bir coin sepeti oluştur.`;
    
    try {
      const response = await fetchGPTResponse(prompt);
      setGptResponse(response);
      setShowResult(true);
    } catch (error) {
      console.error("ChatGPT response error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Simüle edilmiş strateji oluşturma işlevi
  const generateStrategy = () => {
    setStrategyLoading(true);
    setShowStrategyResult(false);
    
    // Rastgele öneriler oluşturmak için kullanılacak veri setleri
    const coinPools = {
      lowRisk: [
        'Bitcoin (BTC)',
        'Ethereum (ETH)',
        'Binance Coin (BNB)',
        'XRP (XRP)',
        'Cardano (ADA)',
        'Solana (SOL)',
        'Polkadot (DOT)',
        'Avalanche (AVAX)',
        'Chainlink (LINK)',
        'Polygon (MATIC)',
        'Cosmos (ATOM)',
        'Toncoin (TON)',
        'Near Protocol (NEAR)',
        'Stellar (XLM)',
        'Uniswap (UNI)'
      ],
      
      moderateRisk: [
        'Bitcoin (BTC)',
        'Ethereum (ETH)',
        'Solana (SOL)',
        'Polkadot (DOT)',
        'Avalanche (AVAX)',
        'Uniswap (UNI)',
        'Cosmos (ATOM)',
        'Aave (AAVE)',
        'Fantom (FTM)',
        'The Graph (GRT)',
        'Algorand (ALGO)',
        'Theta Network (THETA)',
        'VeChain (VET)',
        'Hedera (HBAR)',
        'Stellar (XLM)',
        'Chainlink (LINK)',
        'Polygon (MATIC)',
        'Optimism (OP)',
        'Arbitrum (ARB)',
        'Filecoin (FIL)'
      ],
      
      highRisk: [
        'Ethereum (ETH)',
        'Solana (SOL)',
        'Aptos (APT)',
        'Render (RNDR)',
        'Arbitrum (ARB)',
        'Injective (INJ)',
        'Sui (SUI)',
        'Optimism (OP)',
        'Immutable X (IMX)',
        'Kaspa (KAS)',
        'Stacks (STX)',
        'Mina Protocol (MINA)',
        'Conflux (CFX)',
        'Fetch.ai (FET)',
        'Arweave (AR)',
        'The Sandbox (SAND)',
        'Decentraland (MANA)',
        'Enjin Coin (ENJ)',
        'Chiliz (CHZ)',
        'Audius (AUDIO)',
        'Blur (BLUR)',
        'Worldcoin (WLD)',
        'Akash Network (AKT)',
        'Celestia (TIA)'
      ]
    };
    
    const entryConditions = {
      trend: [
        'Hareketli ortalamaların altın çapraz oluşturması (kısa vadeli MA\'nın uzun vadeli MA\'yı yukarı kesmesi)',
        'Fiyatın belirlenmiş bir destek seviyesinden sıçrama yapması',
        'RSI göstergesinin aşırı satım bölgesinden çıkış sinyali vermesi',
        'MACD histogramının sıfır çizgisini yukarı doğru kesmesi',
        'Bollinger bantlarının daralması sonrası fiyatın üst banda doğru hareket etmeye başlaması',
        'İşlem hacminin son 10 günlük ortalamanın %30 üzerine çıkması',
        'Parabolic SAR indikatörünün fiyatın altına geçmesi',
        'Fibonacci geri çekilme seviyelerinden birinde tutunma oluşması',
        'Stokastik osilatörün aşırı satım bölgesinden çıkması',
        'OBV (On-Balance Volume) indikatöründe yükseliş trendinin başlaması'
      ],
      
      reversal: [
        'RSI göstergesinin aşırı satım bölgesinde (30 altı) dipten dönüş sinyali vermesi',
        'Fiyat-RSI pozitif uyumsuzluğu (fiyat düşerken RSI\'ın yükselmesi)',
        'Çift dip veya üçlü dip formasyonu oluşması',
        'MACD histogramında pozitif divergence oluşması',
        'Fiyatın düşüş trendi içinde yükselen bir destek seviyesi oluşturması',
        'İşlem hacminin düşüş sonrası azalması ve sonrasında artması',
        'Bollinger bantlarının alt bandının kırılması sonrası içeri geri dönüş',
        'Ichimoku bulutu altında pozitif momentum oluşması',
        'Elder-ray indikatöründe alıcı gücünün artmaya başlaması',
        'Fibonacci düzeltme seviyelerinde (0.618 veya 0.786) güçlü alım hacmi'
      ],
      
      breakout: [
        'Üçgen, bayrak veya dikdörtgen formasyonunun yukarı kırılması',
        'Fiyatın uzun süredir test ettiği direnç seviyesini aşması',
        'Yüksek işlem hacmi ile birlikte oluşan yeni yüksek seviyeler',
        'Bollinger bantlarının üst bandının yukarı kırılması',
        'ATR değerinin ani yükselişi ile birlikte fiyat hareketi',
        'Momentum indikatörlerinin (RSI, MACD) eşzamanlı olarak yükseliş sinyali vermesi',
        'Kuvvetli bir konsolidasyon dönemi sonrası fiyat hareketi',
        'İşlem hacminde son 20 günlük ortalamanın %50 üzerinde artış',
        'Fiyatın 50 ve 200 günlük hareketli ortalamaların üzerine çıkması',
        'Kırılım sonrası formasyonun test edilmesi ve tutunması'
      ],
      
      dca: [
        'Satın alma zamanı: Her ayın 1. ve 15. günleri',
        'Haftalık alım stratejisi: Her pazartesi günü düzenli alım',
        'Korku & Açgözlülük Endeksi 30\'un altındayken ek alım',
        'Uzun süreli (30 gün+) düşüş trendinden sonra aşamalı alım',
        'İki haftalık periyotlarla düzenli alım stratejisi',
        'Büyük düşüşlerden sonra (%20+) ekstra alım yapma',
        'Ayda bir belirli gün sabit miktarda alım yapma',
        'Aylık maaş gününde düzenli alım stratejisi',
        'Piyasaya giriş zamanlaması olmaksızın düzenli aralıklarla alım',
        'Volatilite yüksekken daha küçük, düşükken daha büyük miktarlarda alım'
      ]
    };
    
    const exitConditions = {
      trend: [
        'Hareketli ortalamaların ölüm çaprazı oluşturması (kısa vadeli MA\'nın uzun vadeli MA\'yı aşağı kesmesi)',
        'Fiyatın belirlenmiş bir destek seviyesinin altına düşmesi',
        'RSI göstergesinin aşırı alım bölgesinden aşağı dönmesi',
        'MACD histogramının sıfır çizgisini aşağı doğru kesmesi',
        'Bollinger bantlarının üst bandından sert düşüş',
        'İşlem hacminin düşerken fiyatın yükselmesi (negatif divergence)',
        'Parabolic SAR indikatörünün fiyatın üstüne geçmesi',
        'Trailing stop: Yüksek noktadan %10-15 düşüş',
        'Stokastik osilatörün aşırı alım bölgesinden düşüşe geçmesi',
        'OBV indikatöründe düşüş trendinin başlaması'
      ],
      
      reversal: [
        'RSI göstergesinin aşırı alım bölgesinde (70 üstü) tepe yapması',
        'Fiyat-RSI negatif uyumsuzluğu (fiyat yükselirken RSI\'ın düşmesi)',
        'Çift tepe veya üçlü tepe formasyonu oluşması',
        'Kar hedefine ulaşılması (giriş fiyatının %20-50 üstü)',
        'Belirli bir süre sonra (örn. 30-60 gün) pozisyonun değerlendirilmesi',
        'İşlem hacminin yükseliş sonrası artması ve sonrasında azalması',
        'Bollinger bantlarının üst bandının kırılması sonrası içeri geri dönüş',
        'Ichimoku bulutunun üstünde negatif momentum oluşması',
        'Fiyatın parabolik yükseliş göstermesi (çok hızlı artış)',
        'Fiyatın uzun vadeli trend çizgisini aşağı kırması'
      ],
      
      breakout: [
        'Formasyon hedefine ulaşılması (formasyon yüksekliğinin kırılım noktasına eklenmesi)',
        'Fiyatın hareketli ortalamaların altına düşmesi',
        'Kırılım seviyesinin altına geri dönüş',
        'Kar hedefine ulaşılması (giriş fiyatının %20-40 üstü)',
        'İşlem hacminin azalması ile birlikte fiyat hareketinin yavaşlaması',
        'Momentum indikatörlerinde zayıflama sinyalleri',
        'RSI ve diğer osilatörlerde aşırı alım bölgelerine ulaşılması',
        'Trailing stop: Yüksek seviyeden %10-20 düşüş',
        'Yeni bir direnç seviyesine ulaşılması ve orada tutunamaması',
        'Volatilitenin ani düşüşü (ATR değerinin azalması)'
      ],
      
      dca: [
        'Belirli bir toplam getiri hedefine ulaşıldığında (%100+)',
        'Hedef fiyat seviyelerine ulaşıldığında kademeli satış',
        'Belirlenen zaman dilimi sonunda (örn. 2-3 yıl) yeniden değerlendirme',
        'Büyük bir piyasa döngüsünün tepe noktasında (örn. Bitcoin yarılanma sonrası)',
        'Kademeli çıkış: Hedefin %50, %75, %100\'üne ulaşıldığında pozisyonun belirli yüzdelerini satma',
        'Aşırı alım bölgelerinde kâr realizasyonu',
        'Market değerinin belirli bir çarpana ulaşması durumunda (örn. BTC için 100k USD)',
        'Belirli bir yaşam hedefine ulaşıldığında (ev almak, borç ödemek vb.)',
        'Her coin için farklı kâr hedefleri belirleyerek kademeli çıkış',
        'Yüksek volatilite dönemlerinde pozisyonun bir kısmını hedge etme'
      ]
    };
    
    const positionSizing = {
      lowRisk: [
        'Her işlem için portföyün maksimum %10-15\'i',
        'Her coin için maksimum portföy yüzdesi: %25-30',
        'Toplam yatırım: portföyün maksimum %50-60\'ı',
        'Ana coinlere (BTC, ETH) daha yüksek ağırlık: %60+',
        'Stop-loss seviyeleri: giriş fiyatının %5-10 altı',
        'Risk/ödül oranı: minimum 1:3',
        'Kademeli pozisyon girişi: hedef miktarın 3-4 adımda alınması',
        'Daha uzun vadeli pozisyonlar: 6+ ay',
        'Pozisyon büyüklüğü için Kelly kriterinin %25\'i',
        'Her işlem için maksimum kayıp risk: toplam portföyün %1-2\'si'
      ],
      
      moderateRisk: [
        'Her işlem için portföyün maksimum %15-25\'i',
        'Her coin için maksimum portföy yüzdesi: %20-40',
        'Toplam yatırım: portföyün maksimum %60-80\'i',
        'Ana coinlere (BTC, ETH) orta düzey ağırlık: %40-60',
        'Stop-loss seviyeleri: giriş fiyatının %10-15 altı',
        'Risk/ödül oranı: minimum 1:2',
        'Kademeli pozisyon girişi: hedef miktarın 2-3 adımda alınması',
        'Orta vadeli pozisyonlar: 3-6 ay',
        'Pozisyon büyüklüğü için Kelly kriterinin %50\'si',
        'Her işlem için maksimum kayıp risk: toplam portföyün %2-4\'ü'
      ],
      
      highRisk: [
        'Her işlem için portföyün maksimum %20-30\'u',
        'Her coin için maksimum portföy yüzdesi: %30-50',
        'Toplam yatırım: portföyün maksimum %70-100\'ü',
        'Ana coinlere (ETH) düşük ağırlık: %20-40',
        'Stop-loss seviyeleri: giriş fiyatının %15-20 altı',
        'Risk/ödül oranı: minimum 1:1.5',
        'Kademeli pozisyon girişi: hedef miktarın 1-2 adımda alınması',
        'Kısa vadeli pozisyonlar: 1-3 ay',
        'Pozisyon büyüklüğü için Kelly kriterinin %75\'i',
        'Her işlem için maksimum kayıp risk: toplam portföyün %3-6\'sı'
      ]
    };

    // Rastgele coin seçimi işlevi
    const getRandomCoins = (riskLevel, count) => {
      let coinPool = [];
      
      if (riskLevel === 'low') {
        coinPool = coinPools.lowRisk;
      } else if (riskLevel === 'moderate') {
        coinPool = coinPools.moderateRisk;
      } else {
        coinPool = coinPools.highRisk;
      }
      
      // Karıştır ve istenilen sayıda coin seç
      return [...coinPool]
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(count, coinPool.length));
    };
    
    // Rastgele koşul seçimi
    const getRandomItems = (array, count) => {
      if (!Array.isArray(array)) {
        console.error("getRandomItems'a geçilen parametre bir dizi değil:", array);
        return [];
      }
      return [...array]
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(count, array.length));
    };
    
    // Strateji tipi ve risk seviyesine göre dinamik içerik oluşturma
    const strategyType_Local = strategyType;
    const riskLevel_Local = strategyRiskLevel;
    
    // Hata kontrolü ile koşulları seçme
    const selectedEntryConditions = entryConditions[strategyType_Local] 
      ? getRandomItems(entryConditions[strategyType_Local], 3 + Math.floor(Math.random() * 3))
      : [];
      
    const selectedExitConditions = exitConditions[strategyType_Local]
      ? getRandomItems(exitConditions[strategyType_Local], 3 + Math.floor(Math.random() * 3))
      : [];
    
    // Rastgele 2-3 pozisyon boyutlandırma stratejisi seç
    const positionSizingCount = 2 + Math.floor(Math.random() * 2);
    const selectedPositionSizing = getRandomItems(
      positionSizing[riskLevel_Local],
      positionSizingCount
    );
    
    // Tavsiye edilen coinleri seç (risk seviyesine göre farklı sayılarda)
    let recommendedCoinCount = 0;
    
    if (riskLevel_Local === 'low') {
      recommendedCoinCount = 3 + Math.floor(Math.random() * 3); // 3-5 coin
    } else if (riskLevel_Local === 'moderate') {
      recommendedCoinCount = 4 + Math.floor(Math.random() * 3); // 4-6 coin
    } else {
      recommendedCoinCount = 5 + Math.floor(Math.random() * 4); // 5-8 coin
    }
    
    const recommendedCoins = getRandomCoins(riskLevel_Local, recommendedCoinCount);
    
    // Strateji başlığı ve özeti
    let title = "";
    let summary = "";
    
    // Strateji tipi ve risk seviyesine göre başlık ve özet belirleme
    if (strategyType_Local === 'trend') {
      title = `${riskLevel_Local === 'low' ? 'Düşük' : riskLevel_Local === 'moderate' ? 'Orta' : 'Yüksek'} Riskli Trend Takip Stratejisi`;
      
      if (riskLevel_Local === 'low') {
        summary = "Bu strateji, ana kripto paraların (özellikle Bitcoin ve Ethereum) uzun vadeli trend değişikliklerini takip eder. Yüksek volatiliteyi önlemek için ortalama hareketlere dayalı sinyallere göre hareket edilir.";
      } else if (riskLevel_Local === 'moderate') {
        summary = "Bu strateji, hem büyük kripto paraların hem de seçilmiş altcoinlerin orta vadeli trend değişikliklerini takip eder. Daha kısa vadeli hareketli ortalamalar kullanarak, daha erken giriş ve çıkış sinyalleri oluşturulur.";
      } else {
        summary = "Bu agresif strateji, hem büyük kripto paraların hem de yeni gelişen altcoinlerin kısa vadeli trend değişikliklerini takip eder. Hızlı giriş ve çıkış sinyalleri ile yüksek getiri hedeflenir.";
      }
    } else if (strategyType_Local === 'reversal') {
      title = `${riskLevel_Local === 'low' ? 'Düşük' : riskLevel_Local === 'moderate' ? 'Orta' : 'Yüksek'} Riskli Trend Dönüşü Stratejisi`;
      
      if (riskLevel_Local === 'low') {
        summary = "Bu strateji, ana kripto paraların aşırı satış bölgelerinde trend dönüşlerini tespit ederek alım fırsatları yakalamayı hedefler. Temel analiz ve teknik göstergeler birlikte kullanılarak risk minimize edilir.";
      } else if (riskLevel_Local === 'moderate') {
        summary = "Bu strateji, kripto paraların aşırı alım ve satım bölgelerinde trend dönüşlerini tespit ederek alım-satım fırsatlarını yakalamayı hedefler. Çeşitli indikatörler kullanılarak doğrulama sinyalleri aranır.";
      } else {
        summary = "Bu agresif strateji, altcoinlerin ve özellikle yeni gelişen projelerin keskin düşüşlerinin ardından gelen güçlü dönüşleri yakalamayı hedefler. Hızlı giriş ve çıkış ile yüksek getiri potansiyeli sunulur.";
      }
    } else if (strategyType_Local === 'breakout') {
      title = `${riskLevel_Local === 'low' ? 'Düşük' : riskLevel_Local === 'moderate' ? 'Orta' : 'Yüksek'} Riskli Kırılma Stratejisi`;
      
      if (riskLevel_Local === 'low') {
        summary = "Bu strateji, büyük kripto paraların uzun süreli konsolidasyon veya direnç/destek seviyelerini kırmasıyla oluşan fırsatları değerlendirmeyi hedefler. Yüksek güvenilirliğe sahip formasyon kırılımları takip edilir.";
      } else if (riskLevel_Local === 'moderate') {
        summary = "Bu strateji, orta ve büyük ölçekli kripto paraların kısa ve orta vadeli direnç/destek kırılımlarını takip eder. Hem teknik formasyonlar hem de momentum indikatörleri kullanılarak kırılım sinyalleri doğrulanır.";
      } else {
        summary = "Bu agresif strateji, altcoinlerin keskin direnç kırılımlarını takip ederek yüksek getiri hedefler. Erken kırılım tespiti ve hızlı giriş-çıkış prensibine dayanır.";
      }
    } else if (strategyType_Local === 'dca') {
      title = `${riskLevel_Local === 'low' ? 'Düşük' : riskLevel_Local === 'moderate' ? 'Orta' : 'Yüksek'} Riskli Ortalama Maliyet Stratejisi (DCA)`;
      
      if (riskLevel_Local === 'low') {
        summary = "Bu strateji, belirli zaman aralıklarında düzenli olarak sabit miktarda yatırım yaparak, piyasa volatilitesinden kaynaklanan riskleri azaltmayı hedefler. Ana kripto paralara odaklanarak uzun vadeli birikim yapmayı sağlar.";
      } else if (riskLevel_Local === 'moderate') {
        summary = "Bu strateji, düzenli yatırımları piyasa koşullarına göre ayarlayarak ortalama bir yaklaşım sunar. Temel kripto paralarla birlikte seçilmiş altcoinlere de yatırım yapılmasını içerir.";
      } else {
        summary = "Bu agresif DCA stratejisi, düzenli yatırımları piyasa koşullarına ve momentum indikatörlerine göre aktif şekilde ayarlar. Ana kripto paralarla birlikte yüksek potansiyelli altcoinlere önemli oranda yatırım yapılmasını içerir.";
      }
    }
    
    // Son öneri eklemesi
    let finalRecommendation = "";
    
    if (riskLevel_Local === 'low') {
      finalRecommendation = "Bu düşük riskli strateji, uzun vadeli ve istikrarlı bir yatırım yaklaşımı sunar. Piyasadaki aşırı volatiliteyi en aza indirgemek için teknik analiz ve temel verilerin birlikte kullanılması önerilir.";
    } else if (riskLevel_Local === 'moderate') {
      finalRecommendation = "Bu orta riskli strateji, makul bir risk-getiri dengesi sunar. Hem ana kripto paralar hem de seçili altcoinler ile çeşitlendirme yaparak, piyasadaki fırsatları değerlendirmenizi sağlar.";
    } else {
      finalRecommendation = "Bu yüksek riskli strateji, agresif bir getiri potansiyeli sunar ancak yüksek risk içerir. Piyasayı aktif olarak takip etmeniz ve hızlı karar almanız gerekebilir.";
    }
    
    // Strateji içeriğini oluştur
    const strategyContent = `# ${title}

## Strateji Özeti
${summary}

## Giriş Koşulları
${selectedEntryConditions.map(condition => `- ${condition}`).join('\n')}

## Çıkış Koşulları
${selectedExitConditions.map(condition => `- ${condition}`).join('\n')}

## Pozisyon Boyutu
${selectedPositionSizing.map(sizing => `- ${sizing}`).join('\n')}

## Tavsiye Edilen Coinler
${recommendedCoins.map(coin => `- ${coin}`).join('\n')}

${finalRecommendation}`;
    
    // Yanıtı döndür
    setTimeout(() => {
      setStrategyLoading(false);
      setStrategyResponse(strategyContent);
      setShowStrategyResult(true);
    }, 1500);
  };
  
  // Ekran başlıklarını belirle
  const getActiveTitle = () => {
    switch(activeTab) {
      case 'market':
        return 'Piyasa Analizi';
      case 'suggestions':
        return 'Yatırım Önerileri';
      case 'alerts':
        return 'Piyasa Uyarıları';
      case 'strategies':
        return 'Alım-Satım Stratejileri';
      default:
        return 'Piyasa Analizi';
    }
  };

  // URL parametresi değiştiğinde tab'ı güncelle
  useEffect(() => {
    setActiveTab(getTabFromUrl());
  }, [location.search]);

  return (
    <Container>
      <Title>Yapay Zeka Sepeti</Title>
      
      <Card>
        <Description>
          Yapay zeka algoritmalarımız, piyasa trendlerini analiz ederek size özel yatırım stratejileri oluşturur.
          Risk seviyenize, yatırım miktarınıza ve zaman dilimine göre kişiselleştirilmiş öneriler alın.
        </Description>
        
        <AiMenuContainer>
          <AiMenuHeader>
            <AiMenuTitle>{getActiveTitle()}</AiMenuTitle>
          </AiMenuHeader>
          
          <DropdownSelector>
            <DropdownButton 
              isOpen={dropdownOpen} 
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {getActiveTitle()}
              <FaChevronDown />
            </DropdownButton>
            
            <DropdownMenu isOpen={dropdownOpen}>
              <DropdownItem 
                active={activeTab === 'market'} 
                onClick={() => {
                  setActiveTab('market');
                  setDropdownOpen(false);
                }}
              >
                Piyasa Analizi
              </DropdownItem>
              <DropdownItem 
                active={activeTab === 'suggestions'} 
                onClick={() => {
                  setActiveTab('suggestions');
                  setDropdownOpen(false);
                }}
              >
                Yatırım Önerileri
              </DropdownItem>
              <DropdownItem 
                active={activeTab === 'alerts'} 
                onClick={() => {
                  setActiveTab('alerts');
                  setDropdownOpen(false);
                }}
              >
                Piyasa Uyarıları
              </DropdownItem>
              <DropdownItem 
                active={activeTab === 'strategies'}
                onClick={() => {
                  setActiveTab('strategies');
                  setDropdownOpen(false);
                }}
              >
                Alım-Satım Stratejileri
              </DropdownItem>
            </DropdownMenu>
          </DropdownSelector>
          
          <ContentContainer>
            {activeTab === 'market' && (
              <>
                <ChartPlaceholder>
                  <FaChartLine size={40} color="var(--primary)" />
                </ChartPlaceholder>
                
                <h3>Güncel Piyasa Trendleri</h3>
                
                {mockMarketTrends.map((trend, index) => (
                  <AlertContainer 
                    key={index} 
                    type={trend.sentiment === 'bullish' ? 'success' : 'danger'}
                  >
                    {trend.trend}
                  </AlertContainer>
                ))}
              </>
            )}
            
            {activeTab === 'suggestions' && (
              <>
                <h3>Kişiselleştirilmiş Yatırım Önerileri</h3>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label>Yatırım Miktarı (USD)</Label>
                    <Input 
                      type="number" 
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      placeholder="1000"
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Coin Sayısı (1-20)</Label>
                    <Input 
                      type="number" 
                      value={coinCount}
                      onChange={(e) => setCoinCount(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                      min="1"
                      max="20"
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Risk Seviyeniz</Label>
                    <Select 
                      value={riskLevel}
                      onChange={(e) => setRiskLevel(e.target.value)}
                      required
                    >
                      <option value="low">Düşük Risk (Muhafazakar)</option>
                      <option value="moderate">Orta Risk (Dengeli)</option>
                      <option value="high">Yüksek Risk (Agresif)</option>
                    </Select>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Yatırım Zaman Dilimi (Ay)</Label>
                    <Input 
                      type="number" 
                      value={timeHorizon}
                      onChange={(e) => setTimeHorizon(Math.min(120, Math.max(1, parseInt(e.target.value) || 1)))}
                      min="1"
                      max="120"
                      required
                    />
                  </FormGroup>
                  
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Analiz Ediliyor...' : 'Yapay Zeka Önerisi Al'}
                  </Button>
                </Form>
                
                {loading && (
                  <Spinner>
                    <FaSpinner size={40} color="var(--primary)" />
                  </Spinner>
                )}
                
                {showResult && (
                  <GPTResponse>
                    {gptResponse}
                  </GPTResponse>
                )}
              </>
            )}
            
            {activeTab === 'alerts' && (
              <>
                <h3>Gerçek Zamanlı Piyasa Uyarıları</h3>
                <Description>
                  Piyasadaki önemli değişiklikler ve fırsatlar için gerçek zamanlı uyarılar alın.
                  Yapay zeka algoritmalarımız, fiyat hareketlerini, haber etkilerini ve sosyal medya trendlerini
                  analiz ederek size özel uyarılar oluşturur.
                </Description>
                
                <Form>
                  <FormGroup>
                    <Label>Uyarı Tipi</Label>
                    <Select>
                      <option value="price">Fiyat Değişiklikleri</option>
                      <option value="trend">Trend Değişiklikleri</option>
                      <option value="news">Önemli Haberler</option>
                      <option value="volume">Hacim Artışları</option>
                      <option value="all">Tüm Uyarılar</option>
                    </Select>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Takip Etmek İstediğiniz Kripto Paralar</Label>
                    <Input placeholder="BTC, ETH, ADA..." />
                  </FormGroup>
                  
                  <Button type="button">Uyarıları Ayarla</Button>
                </Form>
              </>
            )}
            
            {activeTab === 'strategies' && (
              <>
                <h3>Otomatik Alım-Satım Stratejileri</h3>
                <Description>
                  Yapay zeka destekli ticaret stratejileri ile piyasa hareketlerinden maksimum fayda sağlayın.
                  Risk seviyenize ve tercihlerinize göre otomatik alım-satım stratejileri oluşturun.
                </Description>
                
                <Form onSubmit={(e) => {
                  e.preventDefault();
                  generateStrategy();
                }}>
                  <FormGroup>
                    <Label>Strateji Tipi</Label>
                    <Select 
                      value={strategyType}
                      onChange={(e) => setStrategyType(e.target.value)}
                    >
                      <option value="trend">Trend Takibi</option>
                      <option value="reversal">Trend Dönüşü</option>
                      <option value="breakout">Kırılma Stratejisi</option>
                      <option value="dca">Ortalama Maliyet Stratejisi (DCA)</option>
                    </Select>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Risk Seviyesi</Label>
                    <Select 
                      value={strategyRiskLevel}
                      onChange={(e) => setStrategyRiskLevel(e.target.value)}
                    >
                      <option value="low">Düşük Risk</option>
                      <option value="moderate">Orta Risk</option>
                      <option value="high">Yüksek Risk</option>
                    </Select>
                  </FormGroup>
                  
                  <Button type="submit" disabled={strategyLoading}>
                    {strategyLoading ? 'Strateji Oluşturuluyor...' : 'Strateji Oluştur'}
                  </Button>
                </Form>
                
                {strategyLoading && (
                  <Spinner>
                    <FaSpinner size={40} color="var(--primary)" />
                  </Spinner>
                )}
                
                {showStrategyResult && (
                  <GPTResponse>
                    {strategyResponse}
                  </GPTResponse>
                )}
              </>
            )}
          </ContentContainer>
        </AiMenuContainer>
      </Card>
      
      <FeatureGrid>
        <FeatureCard>
          <FeatureIcon>
            <FaChartLine />
          </FeatureIcon>
          <FeatureTitle>Piyasa Trendlerinin Analizi</FeatureTitle>
          <FeatureDescription>
            Yapay zeka algoritmalarımız, kripto para piyasasındaki trendleri analiz ederek size
            güncel piyasa durumu hakkında detaylı bilgiler sunar.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>
            <FaRobot />
          </FeatureIcon>
          <FeatureTitle>Kişiselleştirilmiş Yatırım Önerileri</FeatureTitle>
          <FeatureDescription>
            Risk seviyenize, yatırım miktarınıza ve zaman diliminize göre özelleştirilmiş
            kripto para portföyü önerileri alın.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>
            <FaShieldAlt />
          </FeatureIcon>
          <FeatureTitle>Risk Analizi ve Portföy Optimizasyonu</FeatureTitle>
          <FeatureDescription>
            Portföyünüzün risk seviyesini analiz eder ve maksimum getiri için
            optimizasyon önerileri sunar.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>
            <FaExchangeAlt />
          </FeatureIcon>
          <FeatureTitle>Otomatik Alım-Satım Stratejileri</FeatureTitle>
          <FeatureDescription>
            Piyasa koşullarına göre otomatik alım-satım stratejileri oluşturarak
            pozisyonlarınızı en iyi şekilde yönetmenize yardımcı olur.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>
            <FaBell />
          </FeatureIcon>
          <FeatureTitle>Gerçek Zamanlı Piyasa Uyarıları</FeatureTitle>
          <FeatureDescription>
            Önemli fiyat hareketleri, trend değişiklikleri ve fırsatlar için
            gerçek zamanlı uyarılar alın.
          </FeatureDescription>
        </FeatureCard>
      </FeatureGrid>
    </Container>
  );
};

export default AIBasket; 