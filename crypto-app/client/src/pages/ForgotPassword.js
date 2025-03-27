import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--cardBackground);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: var(--text);
  margin-bottom: 1rem;
  font-size: 2rem;
`;

const Description = styled.p`
  text-align: center;
  color: var(--subText);
  margin-bottom: 2rem;
  font-size: 0.9rem;
  line-height: 1.5;
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
  text-align: center;
`;

const Success = styled.div`
  color: #4caf50;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const BackToLogin = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 1.5rem;
  color: var(--primary);
  text-decoration: none;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return setError('Lütfen email adresinizi girin.');
    }

    try {
      setError('');
      setMessage('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Şifre sıfırlama bağlantısı email adresinize gönderildi.');
      setEmail('');
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Şifre sıfırlama işlemi başarısız oldu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Şifremi Unuttum</Title>
      <Description>
        Email adresinizi girin, size şifrenizi sıfırlamanız için bir bağlantı göndereceğiz.
      </Description>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Email</Label>
          <InputWrapper>
            <Icon><FaEnvelope /></Icon>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              required
            />
          </InputWrapper>
        </FormGroup>

        {error && <Error>{error}</Error>}
        {message && (
          <Success>
            <FaCheckCircle />
            {message}
          </Success>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
        </Button>
      </Form>

      <BackToLogin to="/login">
        Giriş sayfasına dön
      </BackToLogin>
    </Container>
  );
};

export default ForgotPassword; 