import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaIdCard, FaGlobe, FaBirthdayCake, FaVenusMars, FaPhone } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Container = styled.div`
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--cardBackground);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: var(--text);
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: var(--text);
  font-size: 0.875rem;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  padding-left: 2.5rem;
  background: var(--inputBackground);
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text);
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  padding-left: 2.5rem;
  background: var(--inputBackground);
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text);
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const Icon = styled.div`
  position: absolute;
  left: 0.75rem;
  color: var(--subText);
`;

const TogglePassword = styled.button`
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: var(--subText);
  cursor: pointer;
`;

const Button = styled.button`
  padding: 0.75rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;

  &:hover {
    background: var(--primaryHover);
  }

  &:disabled {
    background: var(--disabled);
    cursor: not-allowed;
  }
`;

const Error = styled.div`
  color: #f44336;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const LoginLink = styled(Link)`
  color: var(--primary);
  text-decoration: none;
  text-align: center;
  margin-top: 1rem;
  display: block;

  &:hover {
    text-decoration: underline;
  }
`;

const SectionTitle = styled.h3`
  color: var(--text);
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.5rem;
  grid-column: 1 / -1;
`;

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    age: '',
    gender: '',
    nationality: '',
    phoneNumber: '',
    identificationNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    try {
      setLoading(true);
      const result = await register(
        formData.username, 
        formData.email, 
        formData.password,
        {
          age: formData.age,
          gender: formData.gender,
          nationality: formData.nationality,
          phoneNumber: formData.phoneNumber,
          identificationNumber: formData.identificationNumber
        }
      );
      
      if (result.success) {
        navigate('/');
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error("Kayıt hatası:", err);
      setError(err.message || 'Kayıt olurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Kayıt Ol</Title>
      <Form onSubmit={handleSubmit}>
        <SectionTitle>Temel Bilgiler</SectionTitle>
        <FormGrid>
          <FormGroup>
            <Label htmlFor="username">Kullanıcı Adı*</Label>
            <InputWrapper>
              <Icon>
                <FaUser />
              </Icon>
              <Input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">E-posta*</Label>
            <InputWrapper>
              <Icon>
                <FaEnvelope />
              </Icon>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phoneNumber">Telefon Numarası</Label>
            <InputWrapper>
              <Icon>
                <FaPhone />
              </Icon>
              <Input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+90 5XX XXX XX XX"
              />
            </InputWrapper>
          </FormGroup>
        </FormGrid>

        <SectionTitle>Kişisel Bilgiler</SectionTitle>
        <FormGrid>
          <FormGroup>
            <Label htmlFor="age">Yaş</Label>
            <InputWrapper>
              <Icon>
                <FaBirthdayCake />
              </Icon>
              <Input
                type="number"
                id="age"
                name="age"
                min="18"
                max="120"
                value={formData.age}
                onChange={handleChange}
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="gender">Cinsiyet</Label>
            <InputWrapper>
              <Icon>
                <FaVenusMars />
              </Icon>
              <Select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Seçiniz</option>
                <option value="M">Erkek</option>
                <option value="F">Kadın</option>
                <option value="O">Diğer</option>
              </Select>
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="nationality">Uyruk</Label>
            <InputWrapper>
              <Icon>
                <FaGlobe />
              </Icon>
              <Select
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
              >
                <option value="">Seçiniz</option>
                <option value="TR">Türkiye</option>
                <option value="US">Amerika Birleşik Devletleri</option>
                <option value="GB">Birleşik Krallık</option>
                <option value="DE">Almanya</option>
                <option value="FR">Fransa</option>
                <option value="other">Diğer</option>
              </Select>
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="identificationNumber">T.C. Kimlik No / Pasaport No</Label>
            <InputWrapper>
              <Icon>
                <FaIdCard />
              </Icon>
              <Input
                type="text"
                id="identificationNumber"
                name="identificationNumber"
                value={formData.identificationNumber}
                onChange={handleChange}
              />
            </InputWrapper>
          </FormGroup>
        </FormGrid>

        <SectionTitle>Güvenlik Bilgileri</SectionTitle>
        <FormGrid>
          <FormGroup>
            <Label htmlFor="password">Şifre*</Label>
            <InputWrapper>
              <Icon>
                <FaLock />
              </Icon>
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
              <TogglePassword
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </TogglePassword>
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Şifre Tekrar*</Label>
            <InputWrapper>
              <Icon>
                <FaLock />
              </Icon>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
              />
              <TogglePassword
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </TogglePassword>
            </InputWrapper>
          </FormGroup>
        </FormGrid>

        {error && <Error>{error}</Error>}

        <Button type="submit" disabled={loading}>
          {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
        </Button>
      </Form>

      <LoginLink to="/login">
        Zaten hesabınız var mı? Giriş yapın
      </LoginLink>
    </Container>
  );
};

export default Register; 