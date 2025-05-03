import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSun, FaMoon, FaBars, FaTimes, FaChevronDown, FaUser } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Nav = styled.nav`
  background-color: var(--cardBackground);
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  color: var(--text);
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 2rem;
  
  span {
    color: var(--primary);
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--text);
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2.5rem;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--cardBackground);
    padding: 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  min-width: 100px;
  text-align: center;
`;

const DropdownButton = styled.button`
  background: none;
  border: none;
  color: var(--text);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 130px;
  font-size: 1rem;
  
  &:hover {
    color: var(--primary);
  }
`;

const DropdownContent = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: absolute;
  background-color: var(--cardBackground);
  min-width: 180px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 0.5rem;
  
  @media (max-width: 768px) {
    position: relative;
    box-shadow: none;
  }
`;

const DropdownItem = styled(Link)`
  color: var(--text);
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  
  &:hover {
    background-color: var(--hover);
    color: var(--primary);
  }
`;

const NavLink = styled(Link)`
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  min-width: 110px;
  text-align: center;
  font-size: 1rem;
  
  &:hover {
    color: var(--primary);
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--hover);
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-left: 1rem;
`;

const AuthButton = styled(Link)`
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 1rem;
  
  ${props => props.primary ? `
    background-color: var(--primary);
    color: white;
    
    &:hover {
      background-color: var(--primaryHover);
    }
  ` : `
    background-color: transparent;
    color: var(--text);
    border: 1px solid var(--border);
    
    &:hover {
      background-color: var(--hover);
    }
  `}
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProfileLink = styled(Link)`
  display: flex;
  align-items: center;
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--hover);
    color: var(--primary);
  }
  
  .username {
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  background-color: transparent;
  color: var(--text);
  border: 1px solid var(--border);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 1rem;
  
  &:hover {
    background-color: var(--hover);
  }
`;

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);
  const [isOtherOpen, setIsOtherOpen] = useState(false);
  const [isAIBasketOpen, setIsAIBasketOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">
          <span>Crypto</span>Buddy
        </Logo>
        
        <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </MenuButton>
        
        <NavLinks isOpen={isMenuOpen}>
          <NavLink to="/">Ana Sayfa</NavLink>
          <NavLink to="/news">Haberler</NavLink>
          
          <DropdownContainer>
            <DropdownButton onClick={() => setIsTransactionsOpen(!isTransactionsOpen)}>
              İşlemler <FaChevronDown />
            </DropdownButton>
            <DropdownContent isOpen={isTransactionsOpen}>
              <DropdownItem to="/transactions/convert">Dönüştür</DropdownItem>
              <DropdownItem to="/transactions/swap">Takas</DropdownItem>
              <DropdownItem to="/transactions/launchpool">Launchpool</DropdownItem>
            </DropdownContent>
          </DropdownContainer>
          
          <DropdownContainer>
            <DropdownButton onClick={() => setIsAIBasketOpen(!isAIBasketOpen)}>
              Yapay Zeka Sepeti <FaChevronDown />
            </DropdownButton>
            <DropdownContent isOpen={isAIBasketOpen}>
              <DropdownItem to="/ai-basket?tab=market">Piyasa Analizi</DropdownItem>
              <DropdownItem to="/ai-basket?tab=suggestions">Yatırım Önerileri</DropdownItem>
              <DropdownItem to="/ai-basket?tab=alerts">Piyasa Uyarıları</DropdownItem>
              <DropdownItem to="/ai-basket?tab=strategies">Alım-Satım Stratejileri</DropdownItem>
            </DropdownContent>
          </DropdownContainer>
          
          <DropdownContainer>
            <DropdownButton onClick={() => setIsOtherOpen(!isOtherOpen)}>
              Diğer <FaChevronDown />
            </DropdownButton>
            <DropdownContent isOpen={isOtherOpen}>
              <DropdownItem to="/education">Bilgilendirme</DropdownItem>
              <DropdownItem to="/transactions/earn">Eğitim ve İçerik</DropdownItem>
              <DropdownItem to="/about">Hakkımızda</DropdownItem>
            </DropdownContent>
          </DropdownContainer>
          
          <ThemeToggle onClick={toggleTheme}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </ThemeToggle>
          
          {isAuthenticated && currentUser ? (
            <ProfileContainer>
              <NavLink to="/portfolio">Portföy</NavLink>
              <ProfileLink to="/profile">
                <FaUser />
                <span className="username">{currentUser.username || currentUser.email.split('@')[0]}</span>
              </ProfileLink>
              <LogoutButton onClick={handleLogout}>Çıkış Yap</LogoutButton>
            </ProfileContainer>
          ) : (
            <AuthButtons>
              <AuthButton to="/login">Giriş Yap</AuthButton>
              <AuthButton primary to="/register">Kayıt Ol</AuthButton>
            </AuthButtons>
          )}
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navbar; 