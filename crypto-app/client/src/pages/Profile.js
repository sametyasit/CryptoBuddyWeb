import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaIdCard, FaGlobe, FaVenusMars, FaCalendar, FaEdit, FaKey } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(to right, var(--primary), #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ProfileCard = styled.div`
  background: var(--cardBackground);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  color: var(--text);
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const InfoGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.div`
  color: var(--subText);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Value = styled.div`
  color: var(--text);
  font-size: 1rem;
  padding: 0.5rem;
  background: var(--background);
  border-radius: 4px;
  border: 1px solid var(--border);
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background: linear-gradient(to right, var(--primary), #FFA500);
  color: var(--text);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Profile = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  // Örnek kullanıcı verisi (gerçek uygulamada API'den gelecek)
  const userData = {
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    email: currentUser?.email || '',
    tcNo: '12345678901',
    country: 'TR',
    gender: 'M',
    birthDate: '1990-01-01',
    joinDate: '2024-01-01',
  };

  const handleEditProfile = () => {
    // Profil düzenleme modalını aç
  };

  const handleChangePassword = () => {
    // Şifre değiştirme modalını aç
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGenderText = (gender) => {
    switch (gender) {
      case 'M':
        return 'Erkek';
      case 'F':
        return 'Kadın';
      case 'O':
        return 'Diğer';
      default:
        return 'Belirtilmemiş';
    }
  };

  const getCountryText = (countryCode) => {
    const countries = {
      TR: 'Türkiye',
      US: 'Amerika Birleşik Devletleri',
      GB: 'Birleşik Krallık',
      DE: 'Almanya',
      FR: 'Fransa'
    };
    return countries[countryCode] || countryCode;
  };

  return (
    <Container>
      <Header>
        <Title>Profil Bilgileri</Title>
      </Header>

      <ProfileCard>
        <Section>
          <SectionTitle>
            <FaUser />
            Kişisel Bilgiler
          </SectionTitle>
          <Grid>
            <InfoGroup>
              <Label><FaUser /> Ad</Label>
              <Value>{userData.firstName}</Value>
            </InfoGroup>
            <InfoGroup>
              <Label><FaUser /> Soyad</Label>
              <Value>{userData.lastName}</Value>
            </InfoGroup>
            <InfoGroup>
              <Label><FaUser /> Kullanıcı Adı</Label>
              <Value>{userData.username}</Value>
            </InfoGroup>
            <InfoGroup>
              <Label><FaEnvelope /> Email</Label>
              <Value>{userData.email}</Value>
            </InfoGroup>
          </Grid>
        </Section>

        <Section>
          <SectionTitle>
            <FaIdCard />
            Kimlik Bilgileri
          </SectionTitle>
          <Grid>
            <InfoGroup>
              <Label><FaIdCard /> TC Kimlik No</Label>
              <Value>{userData.tcNo}</Value>
            </InfoGroup>
            <InfoGroup>
              <Label><FaGlobe /> Ülke</Label>
              <Value>{getCountryText(userData.country)}</Value>
            </InfoGroup>
            <InfoGroup>
              <Label><FaVenusMars /> Cinsiyet</Label>
              <Value>{getGenderText(userData.gender)}</Value>
            </InfoGroup>
            <InfoGroup>
              <Label><FaCalendar /> Doğum Tarihi</Label>
              <Value>{formatDate(userData.birthDate)}</Value>
            </InfoGroup>
          </Grid>
        </Section>

        <ButtonGroup>
          <Button onClick={handleEditProfile}>
            <FaEdit />
            Profili Düzenle
          </Button>
          <Button onClick={handleChangePassword}>
            <FaKey />
            Şifre Değiştir
          </Button>
        </ButtonGroup>
      </ProfileCard>
    </Container>
  );
};

export default Profile; 