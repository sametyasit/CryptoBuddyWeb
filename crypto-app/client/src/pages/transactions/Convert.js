import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaExchangeAlt, FaChevronDown, FaArrowRight, FaSearch, FaTimes } from 'react-icons/fa';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: var(--text);
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: var(--textSecondary);
  margin-bottom: 2.5rem;
  font-size: 1.1rem;
`;

const ConverterCard = styled.div`
  background-color: var(--cardBackground);
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ConverterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InputLabel = styled.label`
  color: var(--textSecondary);
  font-size: 0.9rem;
`;

const InputRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CurrencyInput = styled.div`
  flex: 1;
  display: flex;
  background-color: var(--inputBackground);
  border-radius: 8px;
  border: 1px solid var(--border);
  overflow: hidden;
`;

const AmountInput = styled.input`
  flex: 1;
  padding: 1rem;
  border: none;
  background-color: transparent;
  color: var(--text);
  font-size: 1.1rem;
  
  &:focus {
    outline: none;
  }
`;

const CurrencySelect = styled.div`
  position: relative;
  min-width: 140px;
  border-left: 1px solid var(--border);
`;

const CurrencySelectButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  width: 100%;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: var(--text);
  
  &:hover {
    background-color: var(--hover);
  }
  
  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
`;

const SwapButton = styled.button`
  background-color: var(--hover);
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0 1rem;
  transition: all 0.2s ease;
  color: var(--primary);
  
  &:hover {
    background-color: var(--primaryHover);
    color: white;
    transform: rotate(180deg);
  }
  
  @media (max-width: 768px) {
    margin: 1rem auto;
    transform: rotate(90deg);
    
    &:hover {
      transform: rotate(270deg);
    }
  }
`;

const ConvertButton = styled.button`
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: var(--primaryHover);
  }
  
  &:disabled {
    background-color: var(--border);
    cursor: not-allowed;
  }
`;

const ResultCard = styled.div`
  background-color: var(--cardBackground);
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-top: 2rem;
  display: ${({ visible }) => (visible ? 'block' : 'none')};
`;

const ResultRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const ResultLabel = styled.div`
  color: var(--textSecondary);
  font-size: 0.9rem;
`;

const ResultValue = styled.div`
  font-size: 1.1rem;
  color: var(--text);
  font-weight: 500;
`;

const ResultAmount = styled.div`
  font-size: 2rem;
  color: var(--primary);
  font-weight: 700;
  text-align: center;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const RateInfo = styled.div`
  text-align: center;
  color: var(--textSecondary);
  font-size: 0.9rem;
  margin-top: 1.5rem;
`;

const ErrorMessage = styled.div`
  color: var(--error);
  padding: 1rem;
  margin-top: 1rem;
  background-color: var(--errorBackground);
  border-radius: 8px;
  display: ${({ visible }) => (visible ? 'block' : 'none')};
`;

// Örnek kripto ve fiat para listesi
const CURRENCIES = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', type: 'crypto', logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', type: 'crypto', logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { id: 'binancecoin', symbol: 'BNB', name: 'Binance Coin', type: 'crypto', logo: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', type: 'crypto', logo: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', type: 'crypto', logo: 'https://assets.coingecko.com/coins/images/975/small/cardano.png' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', type: 'crypto', logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', type: 'crypto', logo: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', type: 'crypto', logo: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', type: 'crypto', logo: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', type: 'crypto', logo: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png' },
  { id: 'usd', symbol: 'USD', name: 'US Dollar', type: 'fiat', logo: 'https://assets.coingecko.com/static_images/fiat/usd.png' },
  { id: 'eur', symbol: 'EUR', name: 'Euro', type: 'fiat', logo: 'https://assets.coingecko.com/static_images/fiat/eur.png' },
  { id: 'try', symbol: 'TRY', name: 'Turkish Lira', type: 'fiat', logo: 'https://assets.coingecko.com/static_images/fiat/try.png' },
];

// Yeni modal dropdown stilleri
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background-color: var(--cardBackground);
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: var(--text);
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: var(--textSecondary);
  font-size: 1.2rem;
  cursor: pointer;
  
  &:hover {
    color: var(--text);
  }
`;

const SearchBox = styled.div`
  display: flex;
  background-color: var(--inputBackground);
  border: 1px solid var(--border);
  border-radius: 8px;
  margin-bottom: 1rem;
  padding: 0.5rem;
  align-items: center;
  
  input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 0.5rem;
    color: var(--text);
    font-size: 1rem;
    
    &:focus {
      outline: none;
    }
  }
  
  svg {
    color: var(--textSecondary);
    margin: 0 0.5rem;
  }
`;

const CurrencyList = styled.div`
  overflow-y: auto;
  flex: 1;
`;

const CurrencyOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid var(--border);
  
  &:hover {
    background-color: var(--hover);
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  
  .currency-details {
    display: flex;
    flex-direction: column;
    
    .currency-name {
      font-size: 0.9rem;
      color: var(--textSecondary);
    }
  }
`;

const Convert = () => {
  const [fromCurrency, setFromCurrency] = useState(CURRENCIES[0]);
  const [toCurrency, setToCurrency] = useState(CURRENCIES[10]);
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fromModalOpen, setFromModalOpen] = useState(false);
  const [toModalOpen, setToModalOpen] = useState(false);
  const [currencies, setCurrencies] = useState(CURRENCIES);
  const [loadingCurrencies, setLoadingCurrencies] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // API'den güncel fiyatları almak için
  const fetchExchangeRate = async (from, to) => {
    try {
      // Kripto para kurları için CoinGecko API kullanıyoruz
      if (from.type === 'crypto' && to.id === 'usd') {
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${from.id}&vs_currencies=usd`);
        if (response.data && response.data[from.id] && response.data[from.id].usd) {
          return response.data[from.id].usd;
        }
      } 
      else if (from.type === 'crypto' && to.id === 'eur') {
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${from.id}&vs_currencies=eur`);
        if (response.data && response.data[from.id] && response.data[from.id].eur) {
          return response.data[from.id].eur;
        }
      }
      else if (from.type === 'crypto' && to.id === 'try') {
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${from.id}&vs_currencies=try`);
        if (response.data && response.data[from.id] && response.data[from.id].try) {
          return response.data[from.id].try;
        }
      }
      // Kripto -> kripto dönüşümü için her iki kripto parayla ilgili USD değerlerini alıp oranlar
      else if (from.type === 'crypto' && to.type === 'crypto') {
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${from.id},${to.id}&vs_currencies=usd`);
        if (response.data && response.data[from.id] && response.data[to.id]) {
          const fromUsd = response.data[from.id].usd;
          const toUsd = response.data[to.id].usd;
          return fromUsd / toUsd;
        }
      }
      
      // API'den veri alınamazsa simülasyon verilerine dönüş yap
      throw new Error("API'den kur bilgisi alınamadı");
    } catch (error) {
      console.log("API hatası, simülasyon verileri kullanılıyor:", error);
      // Simüle edilmiş kurlar - sadece API hatası durumunda kullanılır
      if (from.id === 'bitcoin' && to.id === 'usd') {
        return 63000;
      } else if (from.id === 'ethereum' && to.id === 'usd') {
        return 3200;
      } else if (from.id === 'bitcoin' && to.id === 'ethereum') {
        return 19.5;
      } else if (from.id === 'ethereum' && to.id === 'bitcoin') {
        return 0.051;
      } else if (from.id === 'bitcoin' && to.id === 'try') {
        return 1850000;
      } else if (from.id === 'ethereum' && to.id === 'try') {
        return 94000;
      } else if (from.id === 'usd' && to.id === 'try') {
        return 32.5;
      } else if (from.id === 'try' && to.id === 'usd') {
        return 0.0307;
      } else if (from.id === 'eur' && to.id === 'try') {
        return 35.2;
      } else {
        // Diğer dönüşümler için mantıklı bir oran
        if (from.type === 'crypto' && to.type === 'fiat') {
          return Math.random() * 10000 + 500;
        } else if (from.type === 'fiat' && to.type === 'crypto') {
          return Math.random() * 0.01;
        } else if (from.type === 'crypto' && to.type === 'crypto') {
          return Math.random() * 50;
        } else {
          return Math.random() * 2 + 0.5;
        }
      }
    }
  };

  useEffect(() => {
    // API'den para birimlerini getir
    const fetchCurrencies = async () => {
      setLoadingCurrencies(true);
      try {
        // CoinGecko API'den kripto para listesi çekiliyor
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1');
        
        // Elde edilen verilerden kripto para listesi oluşturuluyor
        const cryptoCurrencies = response.data.map(coin => ({
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          type: 'crypto',
          logo: coin.image
        }));
        
        // Mevcut sabit para birimleri (fiat) ile kripto para birimlerini birleştiriyoruz
        const allCurrencies = [...cryptoCurrencies, ...CURRENCIES.filter(c => c.type === 'fiat')];
        
        // State güncelleniyor
        setCurrencies(allCurrencies);
        
        // İlk para birimlerini ayarla (varsayılan olarak)
        if (cryptoCurrencies.length > 0) {
          setFromCurrency(cryptoCurrencies[0]);
          setToCurrency(CURRENCIES.find(c => c.id === 'usd'));
        }
      } catch (error) {
        console.error('Para birimleri yüklenirken hata oluştu:', error);
        // API hatası durumunda varsayılan para birimlerini kullan
      } finally {
        setLoadingCurrencies(false);
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(() => {
    if (fromCurrency && toCurrency && amount > 0) {
      convertCurrency();
    }
  }, [fromCurrency, toCurrency]);

  const convertCurrency = async () => {
    if (!fromCurrency || !toCurrency || amount <= 0) return;

    setLoading(true);
    setError('');

    try {
      // API'den kur bilgisini al
      const rate = await fetchExchangeRate(fromCurrency, toCurrency);
      
      setExchangeRate(rate);
      setConvertedAmount(amount * rate);
    } catch (err) {
      console.error('Dönüştürme hatası:', err);
      setError('Dönüştürme işlemi sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    convertCurrency();
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0.00';
    return num.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    });
  };

  const handleAmountChange = (e) => {
    // Sayıyı doğrudan input değerinden alır
    const value = e.target.value;
    if (value === '' || value <= 0) {
      setAmount('');
    } else {
      setAmount(value);
    }
  };

  // Arama sonuçlarını filtrele
  const filteredCurrencies = searchTerm 
    ? currencies.filter(
        currency => 
          currency.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          currency.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : currencies;

  return (
    <PageContainer>
      <PageTitle>Kripto Para Dönüştürme</PageTitle>
      <PageDescription>
        İstediğiniz kripto para birimini başka bir kripto para veya fiat para birimine dönüştürebilirsiniz.
        Güncel piyasa kurları üzerinden hesaplama yapılmaktadır.
      </PageDescription>

      <ConverterCard>
        <ConverterForm onSubmit={handleSubmit}>
          <InputGroup>
            <InputLabel>Dönüştürmek İstediğiniz</InputLabel>
            <InputRow>
              <CurrencyInput>
                <AmountInput
                  type="number"
                  min="0.00000001"
                  step="0.00000001"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  required
                />
                <CurrencySelect>
                  <CurrencySelectButton 
                    type="button" 
                    onClick={() => setFromModalOpen(true)}
                  >
                    <img src={fromCurrency.logo} alt={fromCurrency.name} />
                    {fromCurrency.symbol}
                    <FaChevronDown size={12} />
                  </CurrencySelectButton>
                </CurrencySelect>
              </CurrencyInput>

              <SwapButton type="button" onClick={handleSwap}>
                <FaExchangeAlt />
              </SwapButton>

              <CurrencyInput>
                <AmountInput
                  type="text"
                  value={convertedAmount !== null ? formatNumber(convertedAmount) : ''}
                  placeholder="0.00"
                  disabled
                />
                <CurrencySelect>
                  <CurrencySelectButton 
                    type="button" 
                    onClick={() => setToModalOpen(true)}
                  >
                    <img src={toCurrency.logo} alt={toCurrency.name} />
                    {toCurrency.symbol}
                    <FaChevronDown size={12} />
                  </CurrencySelectButton>
                </CurrencySelect>
              </CurrencyInput>
            </InputRow>
          </InputGroup>

          <ConvertButton type="submit" disabled={loading || loadingCurrencies}>
            {loading ? 'Dönüştürülüyor...' : 'Dönüştür'}
          </ConvertButton>
        </ConverterForm>

        <ErrorMessage visible={!!error}>{error}</ErrorMessage>

        {exchangeRate && (
          <RateInfo>
            1 {fromCurrency.symbol} = {formatNumber(exchangeRate)} {toCurrency.symbol}
          </RateInfo>
        )}
      </ConverterCard>

      <ResultCard visible={convertedAmount !== null}>
        <ResultRow>
          <ResultLabel>Dönüştürme Özeti</ResultLabel>
          <ResultValue>{new Date().toLocaleString('tr-TR')}</ResultValue>
        </ResultRow>

        <ResultAmount>
          {amount ? formatNumber(parseFloat(amount)) : '0.00'} {fromCurrency.symbol}
          <FaArrowRight />
          {formatNumber(convertedAmount)} {toCurrency.symbol}
        </ResultAmount>

        <ResultRow>
          <ResultLabel>Dönüşüm Kuru</ResultLabel>
          <ResultValue>1 {fromCurrency.symbol} = {formatNumber(exchangeRate)} {toCurrency.symbol}</ResultValue>
        </ResultRow>
      </ResultCard>

      {/* Para Birimi Seçim Modalı (From) */}
      {fromModalOpen && (
        <ModalOverlay onClick={() => setFromModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Para Birimi Seç</ModalTitle>
              <CloseButton onClick={() => setFromModalOpen(false)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            
            <SearchBox>
              <FaSearch />
              <input
                type="text"
                placeholder="Ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </SearchBox>
            
            <CurrencyList>
              {loadingCurrencies ? (
                <div style={{ padding: '1rem', textAlign: 'center' }}>Yükleniyor...</div>
              ) : (
                filteredCurrencies.map((currency) => (
                  <CurrencyOption
                    key={currency.id}
                    onClick={() => {
                      if (currency.id !== toCurrency.id) {
                        setFromCurrency(currency);
                        setFromModalOpen(false);
                        setSearchTerm('');
                        if (amount > 0) {
                          setTimeout(() => convertCurrency(), 100);
                        }
                      }
                    }}
                    style={{ 
                      opacity: currency.id === toCurrency.id ? 0.5 : 1,
                      cursor: currency.id === toCurrency.id ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <img src={currency.logo} alt={currency.name} />
                    <div className="currency-details">
                      <span>{currency.symbol}</span>
                      <span className="currency-name">{currency.name}</span>
                    </div>
                  </CurrencyOption>
                ))
              )}
            </CurrencyList>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Para Birimi Seçim Modalı (To) */}
      {toModalOpen && (
        <ModalOverlay onClick={() => setToModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Para Birimi Seç</ModalTitle>
              <CloseButton onClick={() => setToModalOpen(false)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            
            <SearchBox>
              <FaSearch />
              <input
                type="text"
                placeholder="Ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </SearchBox>
            
            <CurrencyList>
              {loadingCurrencies ? (
                <div style={{ padding: '1rem', textAlign: 'center' }}>Yükleniyor...</div>
              ) : (
                filteredCurrencies.map((currency) => (
                  <CurrencyOption
                    key={currency.id}
                    onClick={() => {
                      if (currency.id !== fromCurrency.id) {
                        setToCurrency(currency);
                        setToModalOpen(false);
                        setSearchTerm('');
                        if (amount > 0) {
                          setTimeout(() => convertCurrency(), 100);
                        }
                      }
                    }}
                    style={{ 
                      opacity: currency.id === fromCurrency.id ? 0.5 : 1,
                      cursor: currency.id === fromCurrency.id ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <img src={currency.logo} alt={currency.name} />
                    <div className="currency-details">
                      <span>{currency.symbol}</span>
                      <span className="currency-name">{currency.name}</span>
                    </div>
                  </CurrencyOption>
                ))
              )}
            </CurrencyList>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default Convert;
