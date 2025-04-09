import React, { useState } from 'react';
import styled from 'styled-components';
import { FaGraduationCap, FaTwitter, FaYoutube, FaLink } from 'react-icons/fa';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: var(--text);
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2.5rem;
`;

const Subtitle = styled.p`
  color: var(--textSecondary);
  margin-bottom: 2rem;
  text-align: center;
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto 3rem auto;
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 1rem;
  justify-content: center;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${({ active }) => active ? 'var(--primary)' : 'none'};
  color: ${({ active }) => active ? 'white' : 'var(--text)'};
  cursor: pointer;
  font-size: 1.1rem;
  border-radius: 5px;
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover {
    background: ${({ active }) => active ? 'var(--primary)' : 'var(--hover)'};
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const InfluencerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const Card = styled.div`
  background: var(--cardBackground);
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const CardTitle = styled.h3`
  color: var(--text);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.3rem;
`;

const CardDescription = styled.p`
  color: var(--textSecondary);
  margin-bottom: 1.5rem;
  font-size: 1rem;
  line-height: 1.5;
  flex-grow: 1;
`;

const CardLink = styled.a`
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
  background: var(--primary);
  padding: 0.75rem;
  border-radius: 5px;
  transition: background 0.3s ease;
  font-weight: 600;

  &:hover {
    background: var(--primaryHover);
  }
`;

const InfluencerCard = styled(Card)`
  display: flex;
  flex-direction: column;
  text-align: center;
  overflow: hidden;
  position: relative;

  &:hover img {
    transform: scale(1.05);
  }
`;

const InfluencerImageWrapper = styled.div`
  position: relative;
  margin: 0 auto 1.5rem;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--primary);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const InfluencerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-top: 1.5rem;
  justify-content: center;
`;

const SocialLink = styled.a`
  color: var(--textSecondary);
  font-size: 1.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--cardBackground);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    color: white;
    background: var(--primary);
    transform: translateY(-3px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
`;

const CategoryTitle = styled.h2`
  color: var(--text);
  margin: 2rem 0;
  font-size: 1.8rem;
  text-align: center;
  position: relative;
  
  &:after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: var(--primary);
    margin: 0.8rem auto 0;
    border-radius: 2px;
  }
`;

// Eğitim içerikleri
const educationContent = [
  {
    id: 1,
    title: "Kripto Para Temelleri",
    description: "Blockchain, Bitcoin ve diğer kripto paraların nasıl çalıştığını öğrenin. Cüzdan oluşturma, güvenlik ve temel kavramlar hakkında detaylı bilgi edinin.",
    link: "https://academy.binance.com/tr",
    icon: <FaGraduationCap />
  },
  {
    id: 2,
    title: "Teknik Analiz Eğitimi",
    description: "Grafik formasyonları, indikatörler ve fiyat hareketlerini analiz etmeyi öğrenin. Alım satım kararlarınızı verimektiklerinize yardımcı olacak ipuçları alın.",
    link: "https://www.tradingview.com/education/",
    icon: <FaGraduationCap />
  },
  {
    id: 3,
    title: "DeFi ve Web3",
    description: "Merkeziyetsiz finans uygulamaları, likidite sağlama, yield farming ve staking kavramlarını öğrenin. Web3 ekosistemindeki fırsatları keşfedin.",
    link: "https://defi.org/",
    icon: <FaGraduationCap />
  },
  {
    id: 4,
    title: "NFT ve Metaverse",
    description: "NFT'lerin nasıl çalıştığını, nasıl satın alınacağını ve oluşturulacağını öğrenin. Metaverse platformlarını ve dijital varlık ekosistemini keşfedin.",
    link: "https://opensea.io/learn",
    icon: <FaGraduationCap />
  },
  {
    id: 5,
    title: "Kripto Güvenliği",
    description: "Dijital varlıklarınızı korumak için en iyi uygulamaları öğrenin. Güvenli cüzdanlar, dolandırıcılıktan korunma ve güvenli işlem yapma konularında bilgi edinin.",
    link: "https://www.ledger.com/academy",
    icon: <FaGraduationCap />
  },
  {
    id: 6,
    title: "Akıllı Kontrat Geliştirme",
    description: "Ethereum, Solana ve diğer blokzincirlerde akıllı kontrat geliştirmeyi öğrenin. Solidity ile programlama ve dApp oluşturma adımlarını keşfedin.",
    link: "https://ethereum.org/developers/",
    icon: <FaGraduationCap />
  }
];

// Kripto fenomenleri
const influencers = [
  {
    id: 1,
    name: "Davinci Jeremie",
    description: "Uzun vadeli Bitcoin yatırımcısı ve eğitimci",
    image: "https://pbs.twimg.com/profile_images/1656200897763598336/G-4iS0fg_400x400.jpg",
    twitter: "https://twitter.com/Davincij15",
    youtube: "https://youtube.com/c/DavinciJ15"
  },
  {
    id: 2,
    name: "Andreas Antonopoulos",
    description: "Bitcoin ve açık blokzincir uzmanı, yazar ve konuşmacı",
    image: "https://pbs.twimg.com/profile_images/1454837867867148293/wWZvZBwB_400x400.jpg",
    twitter: "https://twitter.com/aantonop",
    youtube: "https://youtube.com/aantonop"
  },
  {
    id: 3,
    name: "Raoul Pal",
    description: "Real Vision CEO'su ve makroekonomi uzmanı",
    image: "https://pbs.twimg.com/profile_images/1595500289553309697/zzGrhJ2e_400x400.jpg",
    twitter: "https://twitter.com/RaoulGMI"
  },
  {
    id: 4,
    name: "Vitalik Buterin",
    description: "Ethereum kurucu ortağı",
    image: "https://pbs.twimg.com/profile_images/977496875887558661/L86xyLF4_400x400.jpg",
    twitter: "https://twitter.com/VitalikButerin"
  },
  {
    id: 5,
    name: "Emre Alkin",
    description: "Ekonomist ve kripto para yorumcusu",
    image: "https://pbs.twimg.com/profile_images/1659574372851703811/x3lFvs2__400x400.jpg",
    twitter: "https://twitter.com/emrealkin1969"
  },
  {
    id: 6,
    name: "MMCrypto",
    description: "Teknik analiz ve kripto para haber kanalı",
    image: "https://pbs.twimg.com/profile_images/1514702169748770825/8w8diie0_400x400.jpg",
    twitter: "https://twitter.com/MMCrypto",
    youtube: "https://youtube.com/c/MMCrypto"
  },
  {
    id: 7,
    name: "Cathie Wood",
    description: "Ark Invest CEO'su ve Bitcoin destekçisi",
    image: "https://pbs.twimg.com/profile_images/1340587185012695040/akPQprJd_400x400.jpg",
    twitter: "https://twitter.com/CathieDWood"
  },
  {
    id: 8,
    name: "Michael Saylor",
    description: "MicroStrategy CEO'su ve kurumsal Bitcoin savunucusu",
    image: "https://pbs.twimg.com/profile_images/1485632175932383235/8xJRUb2z_400x400.jpg",
    twitter: "https://twitter.com/saylor"
  },
  {
    id: 9,
    name: "Anthony Pompliano",
    description: "Yatırımcı ve 'The Pomp Podcast' sunucusu",
    image: "https://pbs.twimg.com/profile_images/1517214991542784000/28T67Lc6_400x400.jpg",
    twitter: "https://twitter.com/APompliano",
    youtube: "https://youtube.com/c/AnthonyPompliano"
  },
  {
    id: 10,
    name: "CZ Binance",
    description: "Binance kripto borsasının kurucusu ve CEO'su",
    image: "https://pbs.twimg.com/profile_images/1667836489279795201/4EkLuCyT_400x400.jpg",
    twitter: "https://twitter.com/cz_binance"
  },
  {
    id: 11,
    name: "Clem Chambers",
    description: "ADVFN CEO'su ve finansal analist",
    image: "https://pbs.twimg.com/profile_images/1404825788570390534/QiH_pHCr_400x400.jpg",
    twitter: "https://twitter.com/ClemChambers"
  },
  {
    id: 12,
    name: "Crypto Banter",
    description: "Canlı kripto para haber ve analiz kanalı",
    image: "https://pbs.twimg.com/profile_images/1669339614428246023/mSJACZZE_400x400.jpg",
    twitter: "https://twitter.com/cryptobanter",
    youtube: "https://youtube.com/c/CryptoBanter"
  },
  {
    id: 13,
    name: "Balaji Srinivasan",
    description: "Girişimci, yatırımcı ve eski Coinbase CTO'su",
    image: "https://pbs.twimg.com/profile_images/1656761892452356097/HLUxQDb9_400x400.jpg",
    twitter: "https://twitter.com/balajis"
  },
  {
    id: 14,
    name: "Vedat Akgiray",
    description: "SPK eski başkanı, akademisyen ve fintech uzmanı",
    image: "https://pbs.twimg.com/profile_images/1279044544922136576/fUNsNLxA_400x400.jpg",
    twitter: "https://twitter.com/vedatakgiray"
  },
  {
    id: 15,
    name: "Onur Gözüpek",
    description: "Kripto para yatırımcısı ve eğitimci",
    image: "https://pbs.twimg.com/profile_images/1643950230654181384/KQl-rh_K_400x400.jpg",
    twitter: "https://twitter.com/onurgozupek",
    youtube: "https://youtube.com/c/OnurGozupek"
  },
  {
    id: 16,
    name: "Hayden Adams",
    description: "Uniswap'ın kurucusu",
    image: "https://pbs.twimg.com/profile_images/1582168006766080000/J46ttUcT_400x400.jpg",
    twitter: "https://twitter.com/haydenzadams"
  },
  {
    id: 17,
    name: "Erik Voorhees",
    description: "ShapeShift kurucusu ve erken dönem Bitcoin savunucusu",
    image: "https://pbs.twimg.com/profile_images/1534356162607955969/RvxZEHhj_400x400.jpg",
    twitter: "https://twitter.com/ErikVoorhees"
  },
  {
    id: 18,
    name: "Efe Bulduk",
    description: "Kripto para analisti ve yatırım stratejisti",
    image: "https://pbs.twimg.com/profile_images/1613561380181565443/aMp5Ttsp_400x400.jpg",
    twitter: "https://twitter.com/efebulduk",
    youtube: "https://youtube.com/@EfeBulduk"
  }
];

const Earn = () => {
  const [activeTab, setActiveTab] = useState('education');

  return (
    <PageContainer>
      <Title>Kripto Eğitim ve İçerik Merkezi</Title>
      <Subtitle>
        Kripto para dünyasında bilgi güçtür. En kaliteli eğitim kaynaklarına ve alanında uzman fenomenlere buradan ulaşabilirsiniz.
      </Subtitle>
      
      <Tabs>
        <Tab 
          active={activeTab === 'education'} 
          onClick={() => setActiveTab('education')}
        >
          Eğitim Kaynakları
        </Tab>
        <Tab 
          active={activeTab === 'influencers'} 
          onClick={() => setActiveTab('influencers')}
        >
          Kripto Fenomenleri
        </Tab>
      </Tabs>

      {activeTab === 'education' && (
        <ContentGrid>
          {educationContent.map(item => (
            <Card key={item.id}>
              <CardTitle>
                {item.icon}
                {item.title}
              </CardTitle>
              <CardDescription>{item.description}</CardDescription>
              <CardLink href={item.link} target="_blank" rel="noopener noreferrer">
                <FaLink />
                Eğitime Git
              </CardLink>
            </Card>
          ))}
        </ContentGrid>
      )}

      {activeTab === 'influencers' && (
        <>
          <CategoryTitle>Kripto Dünyasından Uzmanlar</CategoryTitle>
          <InfluencerGrid>
            {influencers.map(influencer => (
              <InfluencerCard key={influencer.id}>
                <InfluencerImageWrapper>
                  <InfluencerImage src={influencer.image} alt={influencer.name} />
                </InfluencerImageWrapper>
                <CardTitle>{influencer.name}</CardTitle>
                <CardDescription>{influencer.description}</CardDescription>
                <SocialLinks>
                  {influencer.twitter && (
                    <SocialLink href={influencer.twitter} target="_blank" rel="noopener noreferrer">
                      <FaTwitter />
                    </SocialLink>
                  )}
                  {influencer.youtube && (
                    <SocialLink href={influencer.youtube} target="_blank" rel="noopener noreferrer">
                      <FaYoutube />
                    </SocialLink>
                  )}
                </SocialLinks>
              </InfluencerCard>
            ))}
          </InfluencerGrid>
        </>
      )}
    </PageContainer>
  );
};

export default Earn; 