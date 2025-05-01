import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaLock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

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
  padding: 8px;
  background-color: rgba(244, 67, 54, 0.1);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
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
  padding: 16px;
  background-color: rgba(76, 175, 80, 0.1);
  border-radius: 4px;
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

const PasswordRequirements = styled.ul`
  margin: 0.5rem 0;
  padding-left: 1.5rem;
  font-size: 0.8rem;
  color: var(--subText);
`;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [tokenValid, setTokenValid] = useState(true);
  const { resetPassword, verifyResetToken } = useAuth();

  // Token geçerliliğini kontrol et
  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setTokenValid(false);
        setError('Geçersiz şifre sıfırlama bağlantısı.');
        return;
      }

      try {
        setLoading(true);
        const response = await verifyResetToken(token);
        if (!response.success) {
          setTokenValid(false);
          setError('Bu şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.');
        }
      } catch (err) {
        console.error('Token verification error:', err);
        setTokenValid(false);
        setError('Bu şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.');
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [token, verifyResetToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tokenValid) {
      return;
    }

    if (password !== confirmPassword) {
      return setError('Şifreler eşleşmiyor.');
    }

    if (password.length < 8) {
      return setError('Şifre en az 8 karakter uzunluğunda olmalıdır.');
    }

    try {
      setError('');
      setMessage('');
      setLoading(true);
      
      const response = await resetPassword(token, password);
      
      if (response.success) {
        setMessage('Şifreniz başarıyla sıfırlandı. Şimdi giriş yapabilirsiniz.');
        // 3 saniye sonra giriş sayfasına yönlendir
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.error || 'Şifre sıfırlama işlemi başarısız oldu. Lütfen tekrar deneyin.');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Şifre sıfırlama işlemi başarısız oldu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !message) {
    return (
      <Container>
        <Loading message="Yükleniyor..." />
      </Container>
    );
  }

  return (
    <Container>
      <Title>Şifre Sıfırlama</Title>
      <Description>
        Lütfen yeni şifrenizi belirleyin.
      </Description>

      {!tokenValid ? (
        <>
          <Error>
            <FaExclamationTriangle />
            {error}
          </Error>
          <BackToLogin to="/forgot-password">
            Yeni bir şifre sıfırlama bağlantısı iste
          </BackToLogin>
        </>
      ) : (
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Yeni Şifre</Label>
            <InputWrapper>
              <Icon><FaLock /></Icon>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Yeni şifreniz"
                required
                disabled={!!message}
              />
            </InputWrapper>
            <PasswordRequirements>
              <li>En az 8 karakter uzunluğunda olmalıdır</li>
              <li>Harf ve rakam içermelidir</li>
            </PasswordRequirements>
          </FormGroup>

          <FormGroup>
            <Label>Şifre Tekrar</Label>
            <InputWrapper>
              <Icon><FaLock /></Icon>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Şifrenizi tekrar girin"
                required
                disabled={!!message}
              />
            </InputWrapper>
          </FormGroup>

          {error && (
            <Error>
              <FaExclamationTriangle />
              {error}
            </Error>
          )}
          
          {message && (
            <Success>
              <FaCheckCircle />
              {message}
            </Success>
          )}

          <Button type="submit" disabled={loading || !!message}>
            {loading ? <Loading small message="İşlem yapılıyor..." /> : 'Şifremi Sıfırla'}
          </Button>
        </Form>
      )}

      <BackToLogin to="/login">
        Giriş sayfasına dön
      </BackToLogin>
    </Container>
  );
};

export default ResetPassword; 