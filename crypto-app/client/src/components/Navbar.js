import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';
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
  max-width: 1200px;
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
  gap: 2rem;
  
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

const NavLink = styled(Link)`
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  
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
  gap: 1rem;
`;

const AuthButton = styled(Link)`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
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

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <NavLink to="/ai-basket">Yapay Zeka Sepeti</NavLink>
          <NavLink to="/education">Bilgilendirme</NavLink>
          <NavLink to="/about">Hakkımızda</NavLink>
          
          <ThemeToggle onClick={toggleTheme}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </ThemeToggle>
          
          {currentUser ? (
            <>
              <NavLink to="/portfolio">Portföyüm</NavLink>
              <NavLink to="/profile">Profilim</NavLink>
              <AuthButton as="button" onClick={handleLogout}>Çıkış Yap</AuthButton>
            </>
          ) : (
            <AuthButtons>
              <AuthButton to="/login">Giriş Yap</AuthButton>
              <AuthButton to="/register" primary>Kayıt Ol</AuthButton>
            </AuthButtons>
          )}
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navbar; 