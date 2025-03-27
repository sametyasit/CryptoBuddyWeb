import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { alertAPI, coinAPI } from '../services/api';
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

const AlertsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const AlertCard = styled.div`
  background-color: var(--cardBackground);
  padding: 1.5rem;
  border-radius: 8px;
  position: relative;
`;

const AlertHeader = styled.div`
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

const AlertType = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  
  &.price-above {
    background-color: rgba(40, 167, 69, 0.1);
    color: var(--success);
  }
  
  &.price-below {
    background-color: rgba(220, 53, 69, 0.1);
    color: var(--danger);
  }
  
  &.price-change {
    background-color: rgba(255, 193, 7, 0.1);
    color: var(--warning);
  }
`;

const AlertDetails = styled.div`
  margin-bottom: 1rem;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: var(--subText);
  font-size: 0.9rem;
`;

const DetailLabel = styled.span`
  color: var(--subText);
`;

const DetailValue = styled.span`
  color: var(--text);
  font-weight: 500;
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  
  &.active {
    background-color: rgba(40, 167, 69, 0.1);
    color: var(--success);
  }
  
  &.triggered {
    background-color: rgba(220, 53, 69, 0.1);
    color: var(--danger);
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--danger);
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
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

const Alerts = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableCoins, setAvailableCoins] = useState([]);
  const [formData, setFormData] = useState({
    coinId: '',
    type: 'price-above',
    targetPrice: '',
    percentageChange: '',
    isActive: true
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [alertsResponse, coinsResponse] = await Promise.all([
          alertAPI.getAlerts(),
          coinAPI.getAllCoins()
        ]);
        
        setAlerts(alertsResponse);
        setAvailableCoins(coinsResponse.data);
      } catch (err) {
        setError('Alarmlar yüklenirken bir hata oluştu.');
        console.error('Error fetching alerts:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleAddAlert = async (e) => {
    e.preventDefault();
    
    try {
      await alertAPI.createAlert(formData);
      const updatedAlerts = await alertAPI.getAlerts();
      setAlerts(updatedAlerts);
      setIsModalOpen(false);
      setFormData({
        coinId: '',
        type: 'price-above',
        targetPrice: '',
        percentageChange: '',
        isActive: true
      });
    } catch (err) {
      setError('Alarm eklenirken bir hata oluştu.');
      console.error('Error creating alert:', err);
    }
  };
  
  const handleDeleteAlert = async (alertId) => {
    try {
      await alertAPI.deleteAlert(alertId);
      const updatedAlerts = await alertAPI.getAlerts();
      setAlerts(updatedAlerts);
    } catch (err) {
      setError('Alarm silinirken bir hata oluştu.');
      console.error('Error deleting alert:', err);
    }
  };
  
  if (loading) {
    return <Loading message="Alarmlar yükleniyor..." />;
  }
  
  return (
    <Container>
      <Header>
        <Title>
          <span>Crypto</span>Buddy Alarmlar
        </Title>
        <AddButton onClick={() => setIsModalOpen(true)}>
          Yeni Alarm
        </AddButton>
      </Header>
      
      {error && <ErrorMessage message={error} />}
      
      <AlertsGrid>
        {alerts.map(alert => (
          <AlertCard key={alert.id}>
            <StatusBadge className={alert.isActive ? 'active' : 'triggered'}>
              {alert.isActive ? 'Aktif' : 'Tetiklendi'}
            </StatusBadge>
            
            <AlertHeader>
              <CoinIcon src={alert.coin.image} alt={alert.coin.name} />
              <CoinInfo>
                <CoinName>{alert.coin.name}</CoinName>
                <CoinSymbol>{alert.coin.symbol.toUpperCase()}</CoinSymbol>
              </CoinInfo>
              <AlertType className={alert.type}>
                {alert.type === 'price-above' && 'Fiyat Üstü'}
                {alert.type === 'price-below' && 'Fiyat Altı'}
                {alert.type === 'price-change' && 'Fiyat Değişimi'}
              </AlertType>
            </AlertHeader>
            
            <AlertDetails>
              <DetailRow>
                <DetailLabel>Hedef Fiyat:</DetailLabel>
                <DetailValue>${alert.targetPrice}</DetailValue>
              </DetailRow>
              {alert.type === 'price-change' && (
                <DetailRow>
                  <DetailLabel>Değişim Yüzdesi:</DetailLabel>
                  <DetailValue>{alert.percentageChange}%</DetailValue>
                </DetailRow>
              )}
              <DetailRow>
                <DetailLabel>Oluşturulma:</DetailLabel>
                <DetailValue>
                  {new Date(alert.createdAt).toLocaleDateString('tr-TR')}
                </DetailValue>
              </DetailRow>
            </AlertDetails>
            
            <DeleteButton onClick={() => handleDeleteAlert(alert.id)}>
              Sil
            </DeleteButton>
          </AlertCard>
        ))}
      </AlertsGrid>
      
      {isModalOpen && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Yeni Alarm</ModalTitle>
              <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleAddAlert}>
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
                <Label htmlFor="type">Alarm Tipi</Label>
                <Select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="price-above">Fiyat Belirli Değerin Üstüne Çıktığında</option>
                  <option value="price-below">Fiyat Belirli Değerin Altına Düştüğünde</option>
                  <option value="price-change">Fiyat Belirli Yüzde Değiştiğinde</option>
                </Select>
              </FormGroup>
              
              {formData.type !== 'price-change' && (
                <FormGroup>
                  <Label htmlFor="targetPrice">Hedef Fiyat (USD)</Label>
                  <Input
                    type="number"
                    id="targetPrice"
                    value={formData.targetPrice}
                    onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                    step="any"
                    min="0"
                    required
                  />
                </FormGroup>
              )}
              
              {formData.type === 'price-change' && (
                <FormGroup>
                  <Label htmlFor="percentageChange">Değişim Yüzdesi</Label>
                  <Input
                    type="number"
                    id="percentageChange"
                    value={formData.percentageChange}
                    onChange={(e) => setFormData({ ...formData, percentageChange: e.target.value })}
                    step="any"
                    min="0"
                    required
                  />
                </FormGroup>
              )}
              
              <SubmitButton type="submit">Alarm Oluştur</SubmitButton>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Alerts; 