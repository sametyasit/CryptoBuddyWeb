import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaRocket, FaCalendarAlt, FaHistory, FaLock, FaPercentage, FaSpinner } from 'react-icons/fa';
import { getAllLaunchpools } from '../../services/api';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--text);
  
  span {
    color: var(--primary);
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: var(--subText);
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.active ? 'var(--primary)' : 'var(--cardBackground)'};
  color: ${props => props.active ? 'var(--secondary)' : 'var(--text)'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ProjectCard = styled.div`
  background-color: var(--cardBackground);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ProjectIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const ProjectTitle = styled.h3`
  font-size: 1.2rem;
  color: var(--text);
  margin: 0;
`;

const ProjectDetails = styled.div`
  margin-bottom: 1.5rem;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const DetailLabel = styled.span`
  color: var(--subText);
`;

const DetailValue = styled.span`
  color: var(--text);
  font-weight: 500;
`;

const StakeButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary);
  color: var(--secondary);
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    background-color: var(--border);
    cursor: not-allowed;
  }
`;

const Launchpool = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [projects, setProjects] = useState({
    active: [],
    upcoming: [],
    past: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLaunchpools = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllLaunchpools();
        setProjects(data);
      } catch (err) {
        setError('Launchpool verileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        console.error('Error fetching launchpools:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunchpools();
    // Her 5 dakikada bir verileri güncelle
    const interval = setInterval(fetchLaunchpools, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const renderProjects = () => {
    switch (activeTab) {
      case 'active':
        return projects.active;
      case 'upcoming':
        return projects.upcoming;
      case 'past':
        return projects.past;
      default:
        return [];
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('tr-TR').format(number);
  };

  if (loading) {
    return <Loading message="Launchpool verileri yükleniyor..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <Container>
      <Header>
        <Title>
          <span>Crypto</span>Buddy Launchpool
        </Title>
        <Subtitle>
          Yeni kripto para projelerine stake yaparak pasif gelir elde edin. 
          Yüksek APY oranlarıyla yatırımlarınızı değerlendirin.
        </Subtitle>
      </Header>
      
      <Tabs>
        <Tab 
          active={activeTab === 'active'} 
          onClick={() => setActiveTab('active')}
        >
          <FaRocket /> Aktif Projeler ({projects.active.length})
        </Tab>
        <Tab 
          active={activeTab === 'upcoming'} 
          onClick={() => setActiveTab('upcoming')}
        >
          <FaCalendarAlt /> Gelecek Projeler ({projects.upcoming.length})
        </Tab>
        <Tab 
          active={activeTab === 'past'} 
          onClick={() => setActiveTab('past')}
        >
          <FaHistory /> Geçmiş Projeler ({projects.past.length})
        </Tab>
      </Tabs>
      
      <ProjectsGrid>
        {renderProjects().map(project => (
          <ProjectCard key={project.id}>
            <ProjectHeader>
              <ProjectIcon src={project.icon} alt={project.name} />
              <ProjectTitle>{project.name}</ProjectTitle>
            </ProjectHeader>
            
            <ProjectDetails>
              <DetailRow>
                <DetailLabel>APY</DetailLabel>
                <DetailValue>
                  <FaPercentage /> {project.apy}%
                </DetailValue>
              </DetailRow>
              
              {project.totalStaked && (
                <DetailRow>
                  <DetailLabel>Toplam Stake</DetailLabel>
                  <DetailValue>{formatNumber(project.totalStaked)} {project.symbol}</DetailValue>
                </DetailRow>
              )}
              
              {project.minStake && (
                <DetailRow>
                  <DetailLabel>Minimum Stake</DetailLabel>
                  <DetailValue>{formatNumber(project.minStake)} {project.symbol}</DetailValue>
                </DetailRow>
              )}
              
              {project.marketCap && (
                <DetailRow>
                  <DetailLabel>Piyasa Değeri</DetailLabel>
                  <DetailValue>${formatNumber(project.marketCap)}</DetailValue>
                </DetailRow>
              )}
              
              <DetailRow>
                <DetailLabel>
                  {project.status === 'UPCOMING' ? 'Başlangıç' : 'Bitiş'} Tarihi
                </DetailLabel>
                <DetailValue>{formatDate(project.status === 'UPCOMING' ? project.startDate : project.endDate)}</DetailValue>
              </DetailRow>
            </ProjectDetails>
            
            {project.status === 'ACTIVE' && (
              <StakeButton>
                Stake Et
              </StakeButton>
            )}
            
            {project.status === 'UPCOMING' && (
              <StakeButton disabled>
                <FaLock /> Yakında Başlıyor
              </StakeButton>
            )}
            
            {project.status === 'COMPLETED' && (
              <StakeButton disabled>
                Tamamlandı
              </StakeButton>
            )}
          </ProjectCard>
        ))}
      </ProjectsGrid>
    </Container>
  );
};

export default Launchpool;
