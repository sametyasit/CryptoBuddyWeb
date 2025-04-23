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
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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
  margin-top: auto;

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
const educationResources = [
  {
    title: "Kripto Para Temelleri",
    description: "Kripto para dünyasına giriş yapın. Blockchain teknolojisi, dijital varlıklar ve temel kavramlar hakkında detaylı bilgiler.",
    icon: "📚",
    link: "https://academy.binance.com/tr"
  },
  {
    title: "Teknik Analiz",
    description: "Grafik okuma, indikatörler ve teknik analiz stratejileri. Profesyonel trader'ların kullandığı teknikleri öğrenin.",
    icon: "📊",
    link: "https://www.tradingview.com/education/"
  },
  {
    title: "Temel Analiz",
    description: "Projeleri değerlendirme, whitepaper analizi ve temel göstergeler. Yatırım kararlarınızı güçlendirin.",
    icon: "🔍",
    link: "https://www.coingecko.com/learn"
  },
  {
    title: "Risk Yönetimi",
    description: "Portföy çeşitlendirme, stop-loss stratejileri ve risk yönetimi teknikleri. Sermayenizi korumayı öğrenin.",
    icon: "🛡️",
    link: "https://www.investopedia.com/cryptocurrency-4427762"
  },
  {
    title: "DeFi ve Web3",
    description: "Merkeziyetsiz finans, akıllı kontratlar ve Web3 dünyası. Geleceğin finans sistemini keşfedin.",
    icon: "🌐",
    link: "https://ethereum.org/en/defi/"
  },
  {
    title: "NFT ve Metaverse",
    description: "Dijital sanat, koleksiyonlar ve sanal dünyalar. NFT ekosistemini ve metaverse fırsatlarını anlayın.",
    icon: "🎨",
    link: "https://opensea.io/learn"
  },
  {
    title: "Staking ve Yield Farming",
    description: "Pasif gelir stratejileri, likidite sağlama ve ödül kazanma yöntemleri. Gelirinizi artırmanın yollarını öğrenin.",
    icon: "💰",
    link: "https://www.binance.com/en/staking"
  },
  {
    title: "Kripto Güvenliği",
    description: "Cüzdan güvenliği, 2FA, soğuk depolama ve güvenlik en iyi uygulamaları. Varlıklarınızı korumayı öğrenin.",
    icon: "🔒",
    link: "https://www.ledger.com/academy"
  },
  {
    title: "Trading Psikolojisi",
    description: "Duygusal kontrol, disiplin ve başarılı trader zihniyeti. Trading psikolojisini yönetmeyi öğrenin.",
    icon: "🧠",
    link: "https://www.babypips.com/learn/forex/trading-psychology"
  },
  {
    title: "Kripto Vergilendirme",
    description: "Kripto varlıkların vergilendirilmesi, raporlama ve yasal yükümlülükler. Vergi konularında bilgilenin.",
    icon: "📝",
    link: "https://www.cointracker.io/blog/crypto-tax-guide"
  },
  {
    title: "ICO ve Tokenomics",
    description: "Token ekonomisi, proje değerlendirme ve yatırım stratejileri. Token projelerini analiz etmeyi öğrenin.",
    icon: "💎",
    link: "https://www.coingecko.com/learn/what-is-tokenomics"
  },
  {
    title: "Kripto Cüzdanları",
    description: "Farklı cüzdan türleri, kullanım kılavuzları ve en iyi uygulamalar. Cüzdan yönetimini öğrenin.",
    icon: "👛",
    link: "https://metamask.io/learn"
  },
  {
    title: "Kripto Borsaları",
    description: "Borsa seçimi, işlem çeşitleri ve borsa güvenliği. Borsaları etkin kullanmayı öğrenin.",
    icon: "🏦",
    link: "https://www.binance.com/en/how-to-trade"
  },
  {
    title: "Kripto Haber Kaynakları",
    description: "Güvenilir haber kaynakları, analiz platformları ve piyasa takip araçları. Doğru bilgiye ulaşmayı öğrenin.",
    icon: "📰",
    link: "https://cointelegraph.com/learn"
  },
  {
    title: "Kripto Toplulukları",
    description: "Discord, Telegram ve diğer topluluk platformları. Kripto topluluklarına katılmayı öğrenin.",
    icon: "👥",
    link: "https://discord.com/invite/ethereum"
  },
  {
    title: "Kripto Terminolojisi",
    description: "Temel terimler, kısaltmalar ve kripto jargonu. Kripto dilini öğrenin.",
    icon: "📖",
    link: "https://www.coinbase.com/learn/crypto-basics/glossary"
  },
  {
    title: "Kripto Yasal Düzenlemeler",
    description: "Global regülasyonlar, yasal çerçeveler ve uyumluluk. Kripto yasal düzenlemelerini öğrenin.",
    icon: "⚖️",
    link: "https://www.elliptic.co/learning/crypto-regulations"
  },
  {
    title: "Kripto Mining",
    description: "Madencilik temelleri, donanım seçimi ve karlılık hesaplamaları. Mining dünyasını keşfedin.",
    icon: "⛏️",
    link: "https://www.nicehash.com/mining"
  },
  {
    title: "Kripto Portföy Yönetimi",
    description: "Portföy çeşitlendirme, varlık dağılımı ve performans takibi. Portföyünüzü yönetmeyi öğrenin.",
    icon: "📈",
    link: "https://www.coinmarketcap.com/portfolio-tracker"
  },
  {
    title: "Kripto Gelecek Trendleri",
    description: "Yeni teknolojiler, gelişmekte olan sektörler ve gelecek fırsatları. Kripto dünyasının geleceğini keşfedin.",
    icon: "🔮",
    link: "https://www.messari.io/research"
  }
];

// Kripto fenomenleri
const influencers = [
  {
    id: 1,
    name: "Davinci Jeremie",
    description: "Uzun vadeli Bitcoin yatırımcısı ve eğitimci",
    image: "/images/influencers/davinci-jeremie.jpg",
    twitter: "https://twitter.com/Davincij15",
    youtube: "https://youtube.com/c/DavinciJ15"
  },
  {
    id: 2,
    name: "Andreas Antonopoulos",
    description: "Bitcoin ve açık blokzincir uzmanı, yazar ve konuşmacı",
    image: "/images/influencers/andreas-antonopoulos.jpg",
    twitter: "https://twitter.com/aantonop",
    youtube: "https://youtube.com/aantonop"
  },
  {
    id: 3,
    name: "Raoul Pal",
    description: "Real Vision CEO'su ve makroekonomi uzmanı",
    image: "/images/influencers/raoul-pal.jpg",
    twitter: "https://twitter.com/RaoulGMI"
  },
  {
    id: 4,
    name: "Vitalik Buterin",
    description: "Ethereum kurucu ortağı",
    image: "/images/influencers/vitalik-buterin.jpg",
    twitter: "https://twitter.com/VitalikButerin"
  },
  {
    id: 5,
    name: "Emre Alkin",
    description: "Ekonomist ve kripto para yorumcusu",
    image: "/images/influencers/emre-alkin.jpg",
    twitter: "https://twitter.com/emrealkin1969"
  },
  {
    id: 6,
    name: "MMCrypto",
    description: "Teknik analiz ve kripto para haber kanalı",
    image: "/images/influencers/mmcrypto.jpg",
    twitter: "https://twitter.com/MMCrypto",
    youtube: "https://youtube.com/c/MMCrypto"
  },
  {
    id: 7,
    name: "Cathie Wood",
    description: "Ark Invest CEO'su ve Bitcoin destekçisi",
    image: "/images/influencers/cathie-wood.jpg",
    twitter: "https://twitter.com/CathieDWood"
  },
  {
    id: 8,
    name: "Michael Saylor",
    description: "MicroStrategy CEO'su ve kurumsal Bitcoin savunucusu",
    image: "/images/influencers/michael-saylor.jpg",
    twitter: "https://twitter.com/saylor"
  },
  {
    id: 9,
    name: "Anthony Pompliano",
    description: "Yatırımcı ve 'The Pomp Podcast' sunucusu",
    image: "/images/influencers/anthony-pompliano.jpg",
    twitter: "https://twitter.com/APompliano",
    youtube: "https://youtube.com/c/AnthonyPompliano"
  },
  {
    id: 10,
    name: "CZ Binance",
    description: "Binance kripto borsasının kurucusu ve CEO'su",
    image: "/images/influencers/cz-binance.jpg",
    twitter: "https://twitter.com/cz_binance"
  },
  {
    id: 11,
    name: "Clem Chambers",
    description: "ADVFN CEO'su ve finansal analist",
    image: "/images/influencers/clem-chambers.jpg",
    twitter: "https://twitter.com/ClemChambers"
  },
  {
    id: 12,
    name: "Crypto Banter",
    description: "Canlı kripto para haber ve analiz kanalı",
    image: "/images/influencers/crypto-banter.jpg",
    twitter: "https://twitter.com/cryptobanter",
    youtube: "https://youtube.com/c/CryptoBanter"
  },
  {
    id: 13,
    name: "Balaji Srinivasan",
    description: "Girişimci, yatırımcı ve eski Coinbase CTO'su",
    image: "/images/influencers/balaji-srinivasan.jpg",
    twitter: "https://twitter.com/balajis"
  },
  {
    id: 14,
    name: "Vedat Akgiray",
    description: "SPK eski başkanı, akademisyen ve fintech uzmanı",
    image: "/images/influencers/vedat-akgiray.jpg",
    twitter: "https://twitter.com/vedatakgiray"
  },
  {
    id: 15,
    name: "Onur Gözüpek",
    description: "Kripto para yatırımcısı ve eğitimci",
    image: "/images/influencers/onur-gozupek.jpg",
    twitter: "https://twitter.com/onurgozupek",
    youtube: "https://youtube.com/c/OnurGozupek"
  },
  {
    id: 16,
    name: "Hayden Adams",
    description: "Uniswap'ın kurucusu",
    image: "/images/influencers/hayden-adams.jpg",
    twitter: "https://twitter.com/haydenzadams"
  },
  {
    id: 17,
    name: "Erik Voorhees",
    description: "ShapeShift kurucusu ve erken dönem Bitcoin savunucusu",
    image: "/images/influencers/erik-voorhees.jpg",
    twitter: "https://twitter.com/ErikVoorhees"
  },
  {
    id: 18,
    name: "Efe Bulduk",
    description: "Kripto para analisti ve yatırım stratejisti",
    image: "/images/influencers/efe-bulduk.jpg",
    twitter: "https://twitter.com/efebulduk",
    youtube: "https://youtube.com/@EfeBulduk"
  },
  {
    id: 19,
    name: "Lark Davis",
    description: "Kripto yatırımcısı ve eğitimci",
    image: "/images/influencers/lark-davis.jpg",
    twitter: "https://twitter.com/TheCryptoLark",
    youtube: "https://youtube.com/c/TheCryptoLark"
  },
  {
    id: 20,
    name: "Benjamin Cowen",
    description: "Teknik analiz uzmanı ve Into The Cryptoverse kurucusu",
    image: "/images/influencers/benjamin-cowen.jpg",
    twitter: "https://twitter.com/intocryptoverse",
    youtube: "https://youtube.com/c/IntotheCryptoverse"
  },
  {
    id: 21,
    name: "Scott Melker",
    description: "Kripto trader ve analist",
    image: "/images/influencers/scott-melker.jpg",
    twitter: "https://twitter.com/scottmelker",
    youtube: "https://youtube.com/c/ScottMelker"
  },
  {
    id: 22,
    name: "Sheldon Snipe",
    description: "Kripto eğitimci ve yatırımcı",
    image: "/images/influencers/sheldon-snipe.jpg",
    twitter: "https://twitter.com/Sheldon_Snipe",
    youtube: "https://youtube.com/c/SheldonSnipe"
  },
  {
    id: 23,
    name: "Jason Pizzino",
    description: "Kripto analist ve eğitimci",
    image: "/images/influencers/jason-pizzino.jpg",
    twitter: "https://twitter.com/jasonpizzino",
    youtube: "https://youtube.com/c/JasonPizzino"
  },
  {
    id: 24,
    name: "CryptoWendyO",
    description: "Kripto trader ve eğitimci",
    image: "/images/influencers/cryptowendyo.jpg",
    twitter: "https://twitter.com/CryptoWendyO",
    youtube: "https://youtube.com/c/CryptoWendyO"
  },
  {
    id: 25,
    name: "BitBoy Crypto",
    description: "Kripto eğitimci ve yatırımcı",
    image: "/images/influencers/bitboy-crypto.jpg",
    twitter: "https://twitter.com/Bitboy_Crypto",
    youtube: "https://youtube.com/c/BitBoyCrypto"
  },
  {
    id: 26,
    name: "Crypto Cred",
    description: "Teknik analiz uzmanı ve eğitimci",
    image: "/images/influencers/crypto-cred.jpg",
    twitter: "https://twitter.com/CryptoCred",
    youtube: "https://youtube.com/c/CryptoCred"
  },
  {
    id: 27,
    name: "Crypto Jebb",
    description: "Kripto analist ve eğitimci",
    image: "/images/influencers/crypto-jebb.jpg",
    twitter: "https://twitter.com/CryptoJebb",
    youtube: "https://youtube.com/c/CryptoJebb"
  },
  {
    id: 28,
    name: "Crypto Zombie",
    description: "Kripto eğitimci ve yatırımcı",
    image: "/images/influencers/crypto-zombie.jpg",
    twitter: "https://twitter.com/CryptoZombie",
    youtube: "https://youtube.com/c/CryptoZombie"
  },
  {
    id: 29,
    name: "Crypto Daily",
    description: "Kripto haber ve analiz kanalı",
    image: "/images/influencers/crypto-daily.jpg",
    twitter: "https://twitter.com/CryptoDaily",
    youtube: "https://youtube.com/c/CryptoDaily"
  },
  {
    id: 30,
    name: "Crypto Capital Venture",
    description: "Kripto analist ve eğitimci",
    image: "/images/influencers/crypto-capital-venture.jpg",
    twitter: "https://twitter.com/CryptoCapVenture",
    youtube: "https://youtube.com/c/CryptoCapitalVenture"
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
          {educationResources.map((item, index) => (
            <Card key={index}>
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