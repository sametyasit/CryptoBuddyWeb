import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaIdCard, FaGlobe, FaVenusMars, FaCalendar, FaEdit, FaKey, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

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
  color: white;
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

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 1.2rem;
  color: var(--subText);
`;

const NotLoggedIn = styled.div`
  text-align: center;
  padding: 3rem;
  background: var(--cardBackground);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

// Modal bileşenleri
const ModalOverlay = styled.div`
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
  background: var(--cardBackground);
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  color: var(--text);
  font-size: 1.5rem;
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

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text);
  font-size: 0.875rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--background);
  color: var(--text);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--background);
  color: var(--text);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
  }
`;

const PasswordInput = styled.div`
  position: relative;
  
  input {
    width: 100%;
    padding: 0.75rem;
    padding-right: 2.5rem;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: var(--background);
    color: var(--text);
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
    }
  }
  
  button {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--subText);
    cursor: pointer;
    
    &:hover {
      color: var(--text);
    }
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: #4caf50;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const Profile = () => {
  const { currentUser, isAuthenticated, isLoading, updateProfile, changePassword } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Profil düzenleme state'i
  const [profileData, setProfileData] = useState({
    username: '',
    country: '',
    gender: '',
    birthDate: ''
  });
  
  // Şifre değiştirme state'i
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Şifre görünürlüğü
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profil düzenleme modalını aç
  const handleEditProfile = () => {
    setProfileData({
      username: currentUser.username || '',
      country: currentUser.country || '',
      gender: currentUser.gender || '',
      birthDate: currentUser.birthDate ? formatDateForInput(currentUser.birthDate) : ''
    });
    setError(null);
    setSuccess(null);
    setShowEditModal(true);
  };

  // Şifre değiştirme modalını aç
  const handleChangePassword = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError(null);
    setSuccess(null);
    setShowPasswordModal(true);
  };

  // Form alanlarını güncelle
  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  // Şifre formunu güncelle
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  // Profil güncelleme formunu gönder
  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      const result = await updateProfile({
        username: profileData.username,
        country: profileData.country || null,
        gender: profileData.gender || null,
        birthDate: profileData.birthDate || null
      });
      
      if (result.success) {
        setSuccess('Profil bilgileriniz başarıyla güncellendi.');
        setTimeout(() => {
          setShowEditModal(false);
        }, 1500);
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error('Profil güncelleme hatası:', err);
      setError('Profil güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Şifre değiştirme formunu gönder
  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Yeni şifreler eşleşmiyor.');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      if (result.success) {
        setSuccess('Şifreniz başarıyla değiştirildi.');
        setTimeout(() => {
          setShowPasswordModal(false);
        }, 1500);
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error('Şifre değiştirme hatası:', err);
      setError('Şifre değiştirilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Belirtilmemiş';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
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
    return countries[countryCode] || countryCode || 'Belirtilmemiş';
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingState>Yükleniyor...</LoadingState>
      </Container>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return (
      <Container>
        <NotLoggedIn>
          <h2>Giriş Yapmadınız</h2>
          <p>Profil bilgilerinizi görüntülemek için lütfen giriş yapın.</p>
        </NotLoggedIn>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Profil Bilgileri</Title>
      </Header>

      <ProfileCard>
        <Section>
          <SectionTitle>
            <FaUser />
            Kullanıcı Bilgileri
          </SectionTitle>
          <Grid>
            <InfoGroup>
              <Label><FaUser /> Kullanıcı Adı</Label>
              <Value>{currentUser.username || 'Belirtilmemiş'}</Value>
            </InfoGroup>
            <InfoGroup>
              <Label><FaEnvelope /> Email</Label>
              <Value>{currentUser.email || 'Belirtilmemiş'}</Value>
            </InfoGroup>
            {currentUser.createdAt && (
              <InfoGroup>
                <Label><FaCalendar /> Kayıt Tarihi</Label>
                <Value>{formatDate(currentUser.createdAt.toDate ? currentUser.createdAt.toDate() : currentUser.createdAt)}</Value>
              </InfoGroup>
            )}
          </Grid>
        </Section>

        {currentUser.country || currentUser.gender || currentUser.birthDate ? (
          <Section>
            <SectionTitle>
              <FaIdCard />
              Kişisel Bilgiler
            </SectionTitle>
            <Grid>
              {currentUser.country && (
                <InfoGroup>
                  <Label><FaGlobe /> Ülke</Label>
                  <Value>{getCountryText(currentUser.country)}</Value>
                </InfoGroup>
              )}
              {currentUser.gender && (
                <InfoGroup>
                  <Label><FaVenusMars /> Cinsiyet</Label>
                  <Value>{getGenderText(currentUser.gender)}</Value>
                </InfoGroup>
              )}
              {currentUser.birthDate && (
                <InfoGroup>
                  <Label><FaCalendar /> Doğum Tarihi</Label>
                  <Value>{formatDate(currentUser.birthDate)}</Value>
                </InfoGroup>
              )}
            </Grid>
          </Section>
        ) : null}

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
      
      {/* Profil Düzenleme Modal */}
      {showEditModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Profil Düzenle</ModalTitle>
              <CloseButton onClick={() => setShowEditModal(false)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            
            <form onSubmit={handleSubmitProfile}>
              <FormGroup>
                <InputLabel htmlFor="username">Kullanıcı Adı</InputLabel>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <InputLabel htmlFor="country">Ülke</InputLabel>
                <Select
                  id="country"
                  name="country"
                  value={profileData.country}
                  onChange={handleProfileChange}
                >
                  <option value="">Seçiniz</option>
                  <option value="TR">Türkiye</option>
                  <option value="US">Amerika Birleşik Devletleri</option>
                  <option value="GB">Birleşik Krallık</option>
                  <option value="DE">Almanya</option>
                  <option value="FR">Fransa</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <InputLabel htmlFor="gender">Cinsiyet</InputLabel>
                <Select
                  id="gender"
                  name="gender"
                  value={profileData.gender}
                  onChange={handleProfileChange}
                >
                  <option value="">Seçiniz</option>
                  <option value="M">Erkek</option>
                  <option value="F">Kadın</option>
                  <option value="O">Diğer</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <InputLabel htmlFor="birthDate">Doğum Tarihi</InputLabel>
                <Input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={profileData.birthDate}
                  onChange={handleProfileChange}
                  max={new Date().toISOString().split('T')[0]}
                />
              </FormGroup>
              
              {error && <ErrorMessage>{error}</ErrorMessage>}
              {success && <SuccessMessage>{success}</SuccessMessage>}
              
              <ButtonGroup>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </ButtonGroup>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
      
      {/* Şifre Değiştirme Modal */}
      {showPasswordModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Şifre Değiştir</ModalTitle>
              <CloseButton onClick={() => setShowPasswordModal(false)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            
            <form onSubmit={handleSubmitPassword}>
              <FormGroup>
                <InputLabel htmlFor="currentPassword">Mevcut Şifre</InputLabel>
                <PasswordInput>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </PasswordInput>
              </FormGroup>
              
              <FormGroup>
                <InputLabel htmlFor="newPassword">Yeni Şifre</InputLabel>
                <PasswordInput>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </PasswordInput>
              </FormGroup>
              
              <FormGroup>
                <InputLabel htmlFor="confirmPassword">Yeni Şifre (Tekrar)</InputLabel>
                <PasswordInput>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </PasswordInput>
              </FormGroup>
              
              {error && <ErrorMessage>{error}</ErrorMessage>}
              {success && <SuccessMessage>{success}</SuccessMessage>}
              
              <ButtonGroup>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
                </Button>
              </ButtonGroup>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Profile; 