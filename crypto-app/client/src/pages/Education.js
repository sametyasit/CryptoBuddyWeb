import React from 'react';
import styled from 'styled-components';
import { FaBitcoin, FaChartLine, FaShieldAlt, FaExchangeAlt, FaInfoCircle } from 'react-icons/fa';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: var(--text);
  margin-bottom: 2rem;
  text-align: center;
  
  span {
    color: var(--primary);
  }
`;

const Section = styled.section`
  background-color: var(--cardBackground);
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  svg {
    color: var(--primary);
  }
`;

const Content = styled.div`
  color: var(--text);
  line-height: 1.6;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
`;

const ListItem = styled.li`
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  position: relative;
  
  &:before {
    content: "•";
    color: var(--primary);
    position: absolute;
    left: 0;
  }
`;

const InfoBox = styled.div`
  background-color: var(--foreground);
  border-left: 4px solid var(--primary);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
`;

const Education = () => {
  return (
    <Container>
      <Title>
        <span>Kripto Para</span> Bilgilendirme
      </Title>

      <Section>
        <SectionTitle>
          <FaBitcoin /> Kripto Para Nedir?
        </SectionTitle>
        <Content>
          <p>
            Kripto para, kriptografi (şifreleme bilimi) kullanılarak güvenli işlem yapmayı sağlayan ve dijital ortamda var olan sanal para birimidir. Merkezi bir otoriteye bağlı olmadan çalışan bu sistem, blokzincir teknolojisi üzerine kuruludur.
          </p>
          <InfoBox>
            <strong>Önemli:</strong> Kripto paralar merkeziyetsizdir, yani herhangi bir devlet veya finansal kuruluş tarafından kontrol edilmezler.
          </InfoBox>
        </Content>
      </Section>

      <Section>
        <SectionTitle>
          <FaChartLine /> Kripto Para Özellikleri
        </SectionTitle>
        <Content>
          <List>
            <ListItem>
              <strong>Merkeziyetsizlik:</strong> Herhangi bir merkezi otorite tarafından kontrol edilmez.
            </ListItem>
            <ListItem>
              <strong>Şeffaflık:</strong> Tüm işlemler blokzincir üzerinde herkes tarafından görüntülenebilir.
            </ListItem>
            <ListItem>
              <strong>Güvenlik:</strong> Kriptografik şifreleme sayesinde yüksek güvenlik sağlar.
            </ListItem>
            <ListItem>
              <strong>Hız:</strong> Uluslararası transferler saniyeler içinde gerçekleşir.
            </ListItem>
            <ListItem>
              <strong>Düşük Maliyet:</strong> Geleneksel finansal sistemlere göre daha düşük işlem ücretleri.
            </ListItem>
          </List>
        </Content>
      </Section>

      <Section>
        <SectionTitle>
          <FaShieldAlt /> Güvenli Kripto Para Yatırımı İçin Öneriler
        </SectionTitle>
        <Content>
          <List>
            <ListItem>
              <strong>Araştırma Yapın:</strong> Yatırım yapmadan önce kripto para ve proje hakkında detaylı araştırma yapın.
            </ListItem>
            <ListItem>
              <strong>Güvenilir Platformlar:</strong> Lisanslı ve güvenilir kripto para borsalarını tercih edin.
            </ListItem>
            <ListItem>
              <strong>Risk Yönetimi:</strong> Kaybetmeyi göze alabileceğiniz miktarda yatırım yapın.
            </ListItem>
            <ListItem>
              <strong>Güvenli Saklama:</strong> Kripto paralarınızı güvenli cüzdanlarda saklayın.
            </ListItem>
          </List>
        </Content>
      </Section>

      <Section>
        <SectionTitle>
          <FaExchangeAlt /> Kripto Para Alım-Satım İşlemleri
        </SectionTitle>
        <Content>
          <p>
            Kripto para alım-satım işlemleri kripto para borsaları üzerinden gerçekleştirilir. Bu borsalar iki ana kategoriye ayrılır:
          </p>
          <List>
            <ListItem>
              <strong>Merkezi Borsalar (CEX):</strong> Binance, Coinbase gibi merkezi bir otorite tarafından yönetilen platformlar.
            </ListItem>
            <ListItem>
              <strong>Merkeziyetsiz Borsalar (DEX):</strong> Uniswap gibi akıllı kontratlar üzerinden çalışan, aracısız platformlar.
            </ListItem>
          </List>
        </Content>
      </Section>

      <Section>
        <SectionTitle>
          <FaInfoCircle /> Sık Sorulan Sorular
        </SectionTitle>
        <Content>
          <List>
            <ListItem>
              <strong>Kripto para nasıl üretilir?</strong>
              <p>Kripto paralar madencilik (mining) veya hisse ispatı (proof of stake) gibi yöntemlerle üretilir.</p>
            </ListItem>
            <ListItem>
              <strong>Kripto paraların değeri nasıl belirlenir?</strong>
              <p>Arz-talep dengesi, piyasa koşulları, projenin kullanım alanı ve teknolojik gelişmeler gibi faktörler etkilidir.</p>
            </ListItem>
            <ListItem>
              <strong>Kripto para yatırımı güvenli mi?</strong>
              <p>Kripto para yatırımları yüksek risk içerir. Dikkatli araştırma ve risk yönetimi önemlidir.</p>
            </ListItem>
          </List>
        </Content>
      </Section>
    </Container>
  );
};

export default Education; 