const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// Yetkilendirme middleware'i
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Yetkilendirme başarısız: Token bulunamadı' });
    }
    
    // Token doğrulama işlemi burada yapılacak
    // Şimdilik basit bir kontrol yapıyoruz
    if (token === 'invalid') {
      return res.status(401).json({ message: 'Yetkilendirme başarısız: Geçersiz token' });
    }
    
    req.userId = '123456789'; // Gerçek uygulamada token'dan çıkartılacak
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Yetkilendirme başarısız' });
  }
};

// Kullanıcının portföyünü getir
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Veritabanından kullanıcının portföyünü çekme işlemi burada yapılacak
    // Şimdilik örnek bir portföy döndürüyoruz
    const mockPortfolio = {
      userId: req.userId,
      totalValue: 15750.25,
      coins: [
        {
          id: 'bitcoin',
          symbol: 'BTC',
          name: 'Bitcoin',
          amount: 0.25,
          buyPrice: 42000,
          currentPrice: 52000,
          value: 13000,
          profitLoss: 2500,
          profitLossPercentage: 23.81,
          color: '#F7931A'
        },
        {
          id: 'ethereum',
          symbol: 'ETH',
          name: 'Ethereum',
          amount: 2.5,
          buyPrice: 2800,
          currentPrice: 3100,
          value: 7750,
          profitLoss: 750,
          profitLossPercentage: 10.71,
          color: '#627EEA'
        }
      ],
      history: [
        { date: '2024-01-01', value: 12500 },
        { date: '2024-02-01', value: 13200 },
        { date: '2024-03-01', value: 14800 },
        { date: '2024-03-25', value: 15750.25 }
      ]
    };
    
    res.json(mockPortfolio);
  } catch (error) {
    console.error('Portföy alınırken hata oluştu:', error.message);
    res.status(500).json({ message: 'Portföy alınırken hata oluştu', error: error.message });
  }
});

// Portföye coin ekle
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { coinId, amount, buyPrice } = req.body;
    
    if (!coinId || !amount || !buyPrice) {
      return res.status(400).json({ message: 'Coin ID, miktar ve alış fiyatı gereklidir' });
    }
    
    // Veritabanına kaydetme işlemi burada yapılacak
    // Şimdilik başarılı bir yanıt döndürüyoruz
    res.status(201).json({
      message: 'Coin portföye başarıyla eklendi',
      coin: {
        id: coinId,
        symbol: coinId.toUpperCase(),
        name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
        amount: parseFloat(amount),
        buyPrice: parseFloat(buyPrice),
        addedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Coin eklenirken hata oluştu:', error.message);
    res.status(500).json({ message: 'Coin eklenirken hata oluştu', error: error.message });
  }
});

// Portföyden coin çıkar
router.delete('/remove/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Veritabanından silme işlemi burada yapılacak
    // Şimdilik başarılı bir yanıt döndürüyoruz
    res.json({
      message: `${id} ID'li coin portföyden başarıyla çıkarıldı`
    });
  } catch (error) {
    console.error(`Coin silinirken hata oluştu:`, error.message);
    res.status(500).json({ message: 'Coin silinirken hata oluştu', error: error.message });
  }
});

// OpenAI ile portföy önerisi al
router.post('/recommendation', authMiddleware, async (req, res) => {
  try {
    const { budget, numberOfCoins, riskLevel, categories } = req.body;
    
    if (!budget || !numberOfCoins || !riskLevel) {
      return res.status(400).json({ 
        message: 'Bütçe, coin sayısı ve risk seviyesi gereklidir' 
      });
    }
    
    // OpenAI API çağrısı burada yapılacak
    // Şimdilik örnek bir öneri listesi döndürüyoruz
    
    let recommendations = [];
    
    if (riskLevel === 'low') {
      recommendations = [
        { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', allocation: 40, reason: 'Düşük risk için en büyük pazar payına sahip coin' },
        { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', allocation: 30, reason: 'Akıllı kontrat platformları içinde lider' },
        { id: 'binancecoin', symbol: 'BNB', name: 'Binance Coin', allocation: 15, reason: 'Büyük bir borsanın token\'ı olarak daha istikrarlı' },
        { id: 'cardano', symbol: 'ADA', name: 'Cardano', allocation: 10, reason: 'Araştırma odaklı yaklaşımla daha güvenli bir yatırım' },
        { id: 'solana', symbol: 'SOL', name: 'Solana', allocation: 5, reason: 'Yüksek performanslı blockchain' }
      ];
    } else if (riskLevel === 'medium') {
      recommendations = [
        { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', allocation: 30, reason: 'Portföy dengeleyici olarak' },
        { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', allocation: 25, reason: 'Ethereum ekosisteminin büyüme potansiyeli' },
        { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', allocation: 15, reason: 'Blokzincirleri birbirine bağlama potansiyeli' },
        { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', allocation: 15, reason: 'Oracle çözümleri için lider platform' },
        { id: 'avalanche', symbol: 'AVAX', name: 'Avalanche', allocation: 15, reason: 'Hızlı ve ölçeklenebilir alternatif' }
      ];
    } else if (riskLevel === 'high') {
      recommendations = [
        { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', allocation: 20, reason: 'Bazı istikrar için' },
        { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', allocation: 15, reason: 'Temel altcoin olarak' },
        { id: 'solana', symbol: 'SOL', name: 'Solana', allocation: 15, reason: 'Yüksek işlem hacmi potansiyeli' },
        { id: 'injective', symbol: 'INJ', name: 'Injective', allocation: 15, reason: 'DeFi odaklı gelişen ekosistem' },
        { id: 'apecoin', symbol: 'APE', name: 'ApeCoin', allocation: 10, reason: 'NFT ve metaverse potansiyeli' },
        { id: 'render-token', symbol: 'RNDR', name: 'Render Token', allocation: 15, reason: 'GPU rendering ağı olarak büyüme potansiyeli' },
        { id: 'sui', symbol: 'SUI', name: 'Sui', allocation: 10, reason: 'Yeni nesil blockchain mimarisi' }
      ];
    }
    
    // Kategorilere göre filtreleme
    if (categories && categories.length > 0) {
      const categoryMapping = {
        'meme': ['dogecoin', 'shiba-inu', 'pepe', 'apecoin'],
        'ai': ['fetch-ai', 'singularitynet', 'ocean-protocol', 'render-token'],
        'defi': ['uniswap', 'aave', 'compound', 'maker', 'curve-dao-token'],
        'gaming': ['axie-infinity', 'the-sandbox', 'decentraland', 'gala', 'enjin-coin'],
        'technology': ['chainlink', 'polkadot', 'cosmos', 'arweave', 'filecoin'],
        'communication': ['the-graph', 'status', 'dent', 'orchid']
      };
      
      // İlgili kategorilerdeki coinlerin ID'lerini toplama
      const categoryCoins = categories.flatMap(category => categoryMapping[category] || []);
      
      // Önerileri filtreleme veya öncelik verme
      if (categoryCoins.length > 0) {
        const categoryRecommendations = recommendations.filter(coin => categoryCoins.includes(coin.id));
        
        // Eğer kategorilerden yeterli coin bulunamazsa, diğer önerilerden tamamlama
        if (categoryRecommendations.length < numberOfCoins) {
          const remainingRecommendations = recommendations.filter(coin => !categoryCoins.includes(coin.id));
          recommendations = [...categoryRecommendations, ...remainingRecommendations.slice(0, numberOfCoins - categoryRecommendations.length)];
        } else {
          recommendations = categoryRecommendations.slice(0, numberOfCoins);
        }
      }
    }
    
    // İstenen coin sayısına göre önerileri sınırlama
    recommendations = recommendations.slice(0, numberOfCoins);
    
    // Yüzdeleri yeniden hesaplama
    const totalAllocation = recommendations.reduce((total, coin) => total + coin.allocation, 0);
    recommendations = recommendations.map(coin => ({
      ...coin,
      allocation: Math.round((coin.allocation / totalAllocation) * 100)
    }));
    
    // Bütçeye göre dağıtım yapma
    recommendations = recommendations.map(coin => ({
      ...coin,
      investmentAmount: Math.round((budget * coin.allocation) / 100)
    }));
    
    res.json({
      message: 'Portföy önerisi başarıyla oluşturuldu',
      budget,
      riskLevel,
      categories: categories || [],
      recommendations
    });
  } catch (error) {
    console.error('Portföy önerisi alınırken hata oluştu:', error.message);
    res.status(500).json({ message: 'Portföy önerisi alınırken hata oluştu', error: error.message });
  }
});

module.exports = router; 