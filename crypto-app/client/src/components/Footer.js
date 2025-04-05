import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaTwitter, FaDiscord, FaTelegram, FaGithub, FaEnvelope } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: var(--cardBackground);
  padding: 3rem 0 2rem;
  border-top: 1px solid var(--border);
`;

const FooterContent = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
  
  @media (min-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 992px) {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogoSection = styled(FooterSection)`
  margin-bottom: 1rem;
`;

const FooterLogo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  text-decoration: none;
  display: flex;
  align-items: center;
  
  span {
    color: var(--text);
  }
`;

const FooterDescription = styled.p`
  color: var(--subText);
  margin: 1rem 0;
  line-height: 1.6;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  color: var(--subText);
  font-size: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--primary);
    transform: translateY(-3px);
  }
`;

const FooterTitle = styled.h3`
  font-size: 1.1rem;
  color: var(--text);
  margin-bottom: 1.2rem;
  font-weight: 600;
`;

const FooterLinks = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const FooterLink = styled(Link)`
  color: var(--subText);
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--primary);
    transform: translateX(3px);
  }
`;

const ExternalLink = styled.a`
  color: var(--subText);
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--primary);
    transform: translateX(3px);
  }
`;

const BottomFooter = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto 0;
  padding: 1.5rem 1rem 0;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
`;

const Copyright = styled.p`
  color: var(--subText);
  font-size: 0.9rem;
`;

const BottomLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  
  @media (min-width: 768px) {
    margin-top: 0;
  }
`;

const BottomLink = styled(Link)`
  color: var(--subText);
  font-size: 0.9rem;
  text-decoration: none;
  
  &:hover {
    color: var(--primary);
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <LogoSection>
          <FooterLogo to="/">
            Crypto<span>Buddy</span>
          </FooterLogo>
          <FooterDescription>
            Kripto para dünyasında güvenilir ve güncel bilgiler sunan platformunuz. Piyasa verileri, haberler ve kişisel portföy yönetimi için tek adres.
          </FooterDescription>
          <SocialLinks>
            <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </SocialLink>
            <SocialLink href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Discord">
              <FaDiscord />
            </SocialLink>
            <SocialLink href="https://telegram.org" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
              <FaTelegram />
            </SocialLink>
            <SocialLink href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub />
            </SocialLink>
          </SocialLinks>
        </LogoSection>
        
        <FooterSection>
          <FooterTitle>Hızlı Bağlantılar</FooterTitle>
          <FooterLinks>
            <li><FooterLink to="/">Ana Sayfa</FooterLink></li>
            <li><FooterLink to="/coins">Kripto Paralar</FooterLink></li>
            <li><FooterLink to="/news">Haberler</FooterLink></li>
            <li><FooterLink to="/about">Hakkımızda</FooterLink></li>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Kaynaklar</FooterTitle>
          <FooterLinks>
            <li><ExternalLink href="https://academy.binance.com/" target="_blank" rel="noopener noreferrer">Kripto Akademisi</ExternalLink></li>
            <li><ExternalLink href="https://www.coingecko.com/en/api" target="_blank" rel="noopener noreferrer">API Dokümantasyonu</ExternalLink></li>
            <li><ExternalLink href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</ExternalLink></li>
            <li><FooterLink to="/faq">Sık Sorulan Sorular</FooterLink></li>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>İletişim</FooterTitle>
          <FooterLinks>
            <li>
              <ExternalLink href="mailto:info@cryptobuddy.com">
                <FaEnvelope style={{ marginRight: '0.5rem' }} />
                info@cryptobuddy.com
              </ExternalLink>
            </li>
            <li><FooterLink to="/contact">İletişim Formu</FooterLink></li>
            <li><FooterLink to="/feedback">Geri Bildirim</FooterLink></li>
            <li><FooterLink to="/support">Destek</FooterLink></li>
          </FooterLinks>
        </FooterSection>
      </FooterContent>
      
      <BottomFooter>
        <Copyright>&copy; {currentYear} CryptoBuddy. Tüm hakları saklıdır.</Copyright>
        <BottomLinks>
          <BottomLink to="/privacy">Gizlilik Politikası</BottomLink>
          <BottomLink to="/terms">Kullanım Koşulları</BottomLink>
          <BottomLink to="/disclaimer">Yasal Uyarı</BottomLink>
        </BottomLinks>
      </BottomFooter>
    </FooterContainer>
  );
};

export default Footer; 