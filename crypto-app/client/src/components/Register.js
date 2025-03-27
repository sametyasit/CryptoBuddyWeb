import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaGlobe, FaVenusMars, FaCalendar } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--cardBackground);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: var(--text);
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text);
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 2px solid var(--border);
  border-radius: 4px;
  background: var(--background);
  color: var(--text);
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    border-color: var(--primary);
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 2px solid var(--border);
  border-radius: 4px;
  background: var(--background);
  color: var(--text);
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    border-color: var(--primary);
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
  }
`;

const Icon = styled.div`
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--subText);
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  background: linear-gradient(to right, var(--primary), #FFA500);
  color: var(--text);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

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

const Error = styled.div`
  color: #f44336;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const LoginLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: var(--primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    tcNo: '',
    country: 'TR',
    gender: '',
    birthDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      setError('İsim ve soyisim alanları zorunludur.');
      return false;
    }
    if (!formData.tcNo || formData.tcNo.length !== 11) {
      setError('Geçerli bir TC kimlik numarası giriniz.');
      return false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Geçerli bir email adresi giriniz.');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return false;
    }
    if (!formData.birthDate) {
      setError('Doğum tarihi zorunludur.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setError('');
      setLoading(true);
      await register(formData);
      navigate('/');
    } catch (err) {
      setError('Hesap oluşturulurken bir hata oluştu.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Hesap Oluştur</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>İsim</Label>
          <InputWrapper>
            <Icon><FaUser /></Icon>
            <Input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </InputWrapper>
        </FormGroup>

        <FormGroup>
          <Label>Soyisim</Label>
          <InputWrapper>
            <Icon><FaUser /></Icon>
            <Input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </InputWrapper>
        </FormGroup>

        <FormGroup>
          <Label>Kullanıcı Adı</Label>
          <InputWrapper>
            <Icon><FaUser /></Icon>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </InputWrapper>
        </FormGroup>

        <FormGroup>
          <Label>TC Kimlik No</Label>
          <InputWrapper>
            <Icon><FaIdCard /></Icon>
            <Input
              type="text"
              name="tcNo"
              value={formData.tcNo}
              onChange={handleChange}
              maxLength="11"
              required
            />
          </InputWrapper>
        </FormGroup>

        <FormGroup>
          <Label>Ülke</Label>
          <InputWrapper>
            <Icon><FaGlobe /></Icon>
            <Select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="TR">Türkiye</option>
              <option value="US">Amerika Birleşik Devletleri</option>
              <option value="GB">Birleşik Krallık</option>
              <option value="DE">Almanya</option>
              <option value="FR">Fransa</option>
            </Select>
          </InputWrapper>
        </FormGroup>

        <FormGroup>
          <Label>Cinsiyet</Label>
          <InputWrapper>
            <Icon><FaVenusMars /></Icon>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Seçiniz</option>
              <option value="M">Erkek</option>
              <option value="F">Kadın</option>
              <option value="O">Diğer</option>
            </Select>
          </InputWrapper>
        </FormGroup>

        <FormGroup>
          <Label>Doğum Tarihi</Label>
          <InputWrapper>
            <Icon><FaCalendar /></Icon>
            <Input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
            />
          </InputWrapper>
        </FormGroup>

        <FormGroup>
          <Label>Email</Label>
          <InputWrapper>
            <Icon><FaEnvelope /></Icon>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputWrapper>
        </FormGroup>

        <FormGroup>
          <Label>Şifre</Label>
          <InputWrapper>
            <Icon><FaLock /></Icon>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </InputWrapper>
        </FormGroup>

        <FormGroup>
          <Label>Şifre Tekrar</Label>
          <InputWrapper>
            <Icon><FaLock /></Icon>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </InputWrapper>
        </FormGroup>

        {error && <Error>{error}</Error>}
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}
        </Button>
      </Form>

      <LoginLink to="/login">
        Zaten hesabınız var mı? Giriş yapın
      </LoginLink>
    </Container>
  );
};

export default Register; 