import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { FaGoogle } from 'react-icons/fa';

const Container = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: var(--cardBackground);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text);
  
  span {
    color: var(--primary);
  }
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
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background-color: var(--foreground);
  color: var(--text);
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
  }
  
  &::placeholder {
    color: var(--subText);
  }
`;

const Button = styled.button`
  background-color: var(--primary);
  color: var(--secondary);
  border: none;
  border-radius: 4px;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const GoogleButton = styled(Button)`
  background-color: #4285F4;
  margin-top: 1rem;
  
  &:hover {
    background-color: #357ae8;
  }
`;

const ForgotPassword = styled(Link)`
  text-align: right;
  color: var(--primary);
  font-size: 0.9rem;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: var(--subText);
  
  a {
    color: var(--primary);
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.code === 'auth/user-not-found' 
          ? 'Bu e-posta adresine sahip bir kullanıcı bulunamadı.' 
          : err.code === 'auth/wrong-password'
          ? 'Yanlış şifre girdiniz.' 
          : err.code === 'auth/invalid-email'
          ? 'Geçersiz e-posta adresi.'
          : 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      console.error("Google login error:", err);
      setError('Google ile giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container>
      <Title>
        <span>Crypto</span>Buddy'ye Hoş Geldiniz
      </Title>
      
      {error && <ErrorMessage message={error} />}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="email">E-posta</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@email.com"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">Şifre</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <ForgotPassword to="/forgot-password">
            Şifremi Unuttum
          </ForgotPassword>
        </FormGroup>
        
        <Button type="submit" disabled={loading}>
          {loading ? <Loading message="Giriş yapılıyor..." /> : 'Giriş Yap'}
        </Button>
      </Form>
      
      <GoogleButton type="button" onClick={handleGoogleLogin} disabled={loading}>
        <FaGoogle /> Google ile Giriş Yap
      </GoogleButton>
      
      <RegisterLink>
        Hesabınız yok mu?{' '}
        <Link to="/register">Kayıt Ol</Link>
      </RegisterLink>
    </Container>
  );
};

export default Login; 