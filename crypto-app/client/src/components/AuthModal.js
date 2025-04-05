import React, { useState } from 'react';
import styled from 'styled-components';
import { FaLock, FaEnvelope, FaUser, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: var(--cardBackground);
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  position: relative;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--text);
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: var(--primary);
  }
`;

const Title = styled.h2`
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  padding-left: 2.5rem;
  border: 2px solid var(--border);
  border-radius: 4px;
  background: var(--background);
  color: var(--text);
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
  }
`;

const Icon = styled.div`
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--subText);
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background: var(--primary);
  color: var(--secondary);
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
  }

  &:disabled {
    background: var(--border);
    cursor: not-allowed;
    transform: none;
  }
`;

const ToggleText = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: var(--subText);

  button {
    background: none;
    border: none;
    color: var(--primary);
    font-weight: 500;
    cursor: pointer;
    padding: 0;
    margin-left: 0.5rem;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Error = styled.div`
  color: var(--danger);
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
`;

const PasswordRequirements = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
  font-size: 0.8rem;
  color: var(--subText);
`;

const Requirement = styled.li`
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '•';
    color: ${props => props.met ? 'var(--success)' : 'var(--danger)'};
  }
`;

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const passwordRequirements = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*]/.test(formData.password),
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Şifreler eşleşmiyor');
          setLoading(false);
          return;
        }

        if (!Object.values(passwordRequirements).every(Boolean)) {
          setError('Lütfen tüm şifre gereksinimlerini karşılayın');
          setLoading(false);
          return;
        }

        await register(formData.username, formData.email, formData.password);
      }
      onClose();
    } catch (err) {
      setError(isLogin ? 'Giriş yapılamadı' : 'Kayıt oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>

        <Title>{isLogin ? 'Giriş Yap' : 'Hesap Oluştur'}</Title>

        {error && <Error>{error}</Error>}

        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <FormGroup>
              <Icon>
                <FaUser />
              </Icon>
              <Input
                type="text"
                name="username"
                placeholder="Kullanıcı Adı"
                value={formData.username}
                onChange={handleChange}
                required={!isLogin}
              />
            </FormGroup>
          )}

          <FormGroup>
            <Icon>
              <FaEnvelope />
            </Icon>
            <Input
              type="email"
              name="email"
              placeholder="E-posta"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Icon>
              <FaLock />
            </Icon>
            <Input
              type="password"
              name="password"
              placeholder="Şifre"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </FormGroup>

          {!isLogin && (
            <>
              <FormGroup>
                <Icon>
                  <FaLock />
                </Icon>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Şifre Tekrar"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </FormGroup>

              <PasswordRequirements>
                <Requirement met={passwordRequirements.length}>
                  En az 8 karakter
                </Requirement>
                <Requirement met={passwordRequirements.uppercase}>
                  En az 1 büyük harf
                </Requirement>
                <Requirement met={passwordRequirements.lowercase}>
                  En az 1 küçük harf
                </Requirement>
                <Requirement met={passwordRequirements.number}>
                  En az 1 rakam
                </Requirement>
                <Requirement met={passwordRequirements.special}>
                  En az 1 özel karakter (!@#$%^&*)
                </Requirement>
              </PasswordRequirements>
            </>
          )}

          <Button type="submit" disabled={loading}>
            {loading
              ? (isLogin ? 'Giriş yapılıyor...' : 'Hesap oluşturuluyor...')
              : (isLogin ? 'Giriş Yap' : 'Hesap Oluştur')}
          </Button>
        </Form>

        <ToggleText>
          {isLogin ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Hesap Oluştur' : 'Giriş Yap'}
          </button>
        </ToggleText>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AuthModal; 