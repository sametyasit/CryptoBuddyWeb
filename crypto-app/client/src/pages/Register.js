import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Container = styled.div`
  max-width: 400px;
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

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
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
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Kayıt olurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Kayıt Ol</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Kullanıcı Adı</Label>
          <InputWrapper>
            <Icon>
              <FaUser />
            </Icon>
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
          <Label>E-posta</Label>
          <InputWrapper>
            <Icon>
              <FaEnvelope />
            </Icon>
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
            <Icon>
              <FaLock />
            </Icon>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
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
          <Label>Şifre Tekrar</Label>
          <InputWrapper>
            <Icon>
              <FaLock />
            </Icon>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <TogglePassword
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </TogglePassword>
          </InputWrapper>
        </FormGroup>

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