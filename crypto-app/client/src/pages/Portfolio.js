import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { portfolioAPI, coinAPI } from '../services/api';
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

const AddButton = styled.button`
  background-color: var(--primary);
  color: var(--secondary);
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: var(--cardBackground);
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
`;

const StatTitle = styled.h3`
  color: var(--subText);
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  color: var(--text);
  font-size: 1.5rem;
  font-weight: 600;
  
  &.positive {
    color: var(--success);
  }
  
  &.negative {
    color: var(--danger);
  }
`;

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--cardBackground);
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  color: var(--text);
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--subText);
  font-size: 1.5rem;
  cursor: pointer;
  
  &:hover {
    color: var(--text);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: var(--text);
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background-color: var(--foreground);
  color: var(--text);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background-color: var(--foreground);
  color: var(--text);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const SubmitButton = styled.button`
  background-color: var(--primary);
  color: var(--secondary);
  border: none;
  border-radius: 4px;
  padding: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Portfolio = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [stats, setStats] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableCoins, setAvailableCoins] = useState([]);
  const [formData, setFormData] = useState({
    coinId: '',
    amount: '',
    purchasePrice: '',
    purchaseDate: ''
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [portfolioResponse, statsResponse, coinsResponse] = await Promise.all([
          portfolioAPI.getPortfolio(),
          portfolioAPI.getPortfolioStats(),
          coinAPI.getAllCoins()
        ]);
        
        setPortfolio(portfolioResponse);
        setStats(statsResponse);
        setAvailableCoins(coinsResponse.data);
      } catch (err) {
        setError('Portföy bilgileri yüklenirken bir hata oluştu.');
        console.error('Error fetching portfolio data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleAddCoin = async (e) => {
    e.preventDefault();
    
    try {
      await portfolioAPI.addCoin(formData);
      const updatedPortfolio = await portfolioAPI.getPortfolio();
      setPortfolio(updatedPortfolio);
      setIsModalOpen(false);
      setFormData({
        coinId: '',
        amount: '',
        purchasePrice: '',
        purchaseDate: ''
      });
    } catch (err) {
      setError('Kripto para eklenirken bir hata oluştu.');
      console.error('Error adding coin:', err);
    }
  };
  
  const handleRemoveCoin = async (coinId) => {
    try {
      await portfolioAPI.removeCoin(coinId);
      const updatedPortfolio = await portfolioAPI.getPortfolio();
      setPortfolio(updatedPortfolio);
    } catch (err) {
      setError('Kripto para kaldırılırken bir hata oluştu.');
      console.error('Error removing coin:', err);
    }
  };
  
  if (loading) {
    return <Loading message="Portföy yükleniyor..." />;
  }
  
  return (
    <Container>
      <Header>
        <Title>
          <span>Crypto</span>Buddy Portföyüm
        </Title>
        <AddButton onClick={() => setIsModalOpen(true)}>
          Kripto Para Ekle
        </AddButton>
      </Header>
      
      {error && <ErrorMessage message={error} />}
      
      {stats && (
        <StatsGrid>
          <StatCard>
            <StatTitle>Toplam Değer</StatTitle>
            <StatValue>${stats.totalValue.toLocaleString()}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>24s Değişim</StatTitle>
            <StatValue className={stats.change24h >= 0 ? 'positive' : 'negative'}>
              {stats.change24h.toFixed(2)}%
            </StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Toplam Kar/Zarar</StatTitle>
            <StatValue className={stats.totalProfitLoss >= 0 ? 'positive' : 'negative'}>
              ${Math.abs(stats.totalProfitLoss).toLocaleString()}
            </StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Kar/Zarar Oranı</StatTitle>
            <StatValue className={stats.profitLossPercentage >= 0 ? 'positive' : 'negative'}>
              {stats.profitLossPercentage.toFixed(2)}%
            </StatValue>
          </StatCard>
        </StatsGrid>
      )}
      
      <PortfolioGrid>
        {portfolio.map(item => (
          <CoinCard
            key={item.id}
            coin={item}
            onRemove={() => handleRemoveCoin(item.id)}
          />
        ))}
      </PortfolioGrid>
      
      {isModalOpen && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Kripto Para Ekle</ModalTitle>
              <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleAddCoin}>
              <FormGroup>
                <Label htmlFor="coinId">Kripto Para</Label>
                <Select
                  id="coinId"
                  value={formData.coinId}
                  onChange={(e) => setFormData({ ...formData, coinId: e.target.value })}
                  required
                >
                  <option value="">Seçiniz</option>
                  {availableCoins.map(coin => (
                    <option key={coin.id} value={coin.id}>
                      {coin.name} ({coin.symbol.toUpperCase()})
                    </option>
                  ))}
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="amount">Miktar</Label>
                <Input
                  type="number"
                  id="amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  step="any"
                  min="0"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="purchasePrice">Alış Fiyatı (USD)</Label>
                <Input
                  type="number"
                  id="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  step="any"
                  min="0"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="purchaseDate">Alış Tarihi</Label>
                <Input
                  type="date"
                  id="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  required
                />
              </FormGroup>
              
              <SubmitButton type="submit">Ekle</SubmitButton>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Portfolio; 