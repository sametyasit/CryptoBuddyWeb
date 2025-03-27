const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// Kripto para haberleri için API
// Not: Gerçek bir API anahtarı gerekecektir, şu an için sadece örnek yanıtlar döndürüyoruz
// Daha sonra NewsAPI, CryptoCompare veya başka bir haber API'si kullanılabilir

// Tüm kripto haberlerini getir
router.get('/', async (req, res) => {
  try {
    // Gerçek API çağrısı burada olacak
    // Örnek veri döndürüyoruz
    const mockNewsData = [
      {
        id: '1',
        title: 'Bitcoin Fiyatı Yeni Rekorlar Kırmaya Devam Ediyor',
        description: 'Bitcoin bugün yeni bir rekor fiyata ulaştı...',
        url: 'https://example.com/bitcoin-new-ath',
        imageUrl: 'https://example.com/images/bitcoin-ath.jpg',
        source: 'Kripto Haber',
        publishedAt: '2024-03-25T10:30:00Z',
        category: 'Bitcoin'
      },
      {
        id: '2',
        title: 'Ethereum 2.0 Güncellemesi Başarıyla Tamamlandı',
        description: 'Ethereum ağı yeni güncellemesi ile daha hızlı işlem sürelerine kavuştu...',
        url: 'https://example.com/ethereum-update',
        imageUrl: 'https://example.com/images/ethereum-update.jpg',
        source: 'Blockchain Haber',
        publishedAt: '2024-03-24T15:45:00Z',
        category: 'Ethereum'
      },
      {
        id: '3',
        title: 'Yeni Meme Coin Piyasayı Alt Üst Etti',
        description: 'Son zamanların popüler meme coin projesi...',
        url: 'https://example.com/new-memecoin',
        imageUrl: 'https://example.com/images/meme-coin.jpg',
        source: 'Kripto Dünyası',
        publishedAt: '2024-03-23T08:15:00Z',
        category: 'Altcoin'
      },
      {
        id: '4',
        title: 'Büyük Borsa Hack Saldırısına Uğradı',
        description: 'Popüler kripto para borsası güvenlik açığı nedeniyle...',
        url: 'https://example.com/exchange-hack',
        imageUrl: 'https://example.com/images/exchange-hack.jpg',
        source: 'Güvenlik Haberleri',
        publishedAt: '2024-03-22T12:00:00Z',
        category: 'Güvenlik'
      },
      {
        id: '5',
        title: 'DeFi Protokollerinde Yeni Trend',
        description: 'Merkeziyetsiz finans dünyasındaki son gelişmeler...',
        url: 'https://example.com/defi-trends',
        imageUrl: 'https://example.com/images/defi-trend.jpg',
        source: 'DeFi Haberleri',
        publishedAt: '2024-03-21T09:30:00Z',
        category: 'DeFi'
      }
    ];
    
    res.json(mockNewsData);
  } catch (error) {
    console.error('Haberler alınırken hata oluştu:', error.message);
    res.status(500).json({ message: 'Haberler alınırken hata oluştu', error: error.message });
  }
});

// Kategoriye göre haberleri getir
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    // Gerçek API çağrısı burada olacak
    // Şimdilik örnek filtrelenmiş veri döndürüyoruz
    const mockNewsData = [
      {
        id: '1',
        title: 'Bitcoin Fiyatı Yeni Rekorlar Kırmaya Devam Ediyor',
        description: 'Bitcoin bugün yeni bir rekor fiyata ulaştı...',
        url: 'https://example.com/bitcoin-new-ath',
        imageUrl: 'https://example.com/images/bitcoin-ath.jpg',
        source: 'Kripto Haber',
        publishedAt: '2024-03-25T10:30:00Z',
        category: 'Bitcoin'
      },
      {
        id: '2',
        title: 'Ethereum 2.0 Güncellemesi Başarıyla Tamamlandı',
        description: 'Ethereum ağı yeni güncellemesi ile daha hızlı işlem sürelerine kavuştu...',
        url: 'https://example.com/ethereum-update',
        imageUrl: 'https://example.com/images/ethereum-update.jpg',
        source: 'Blockchain Haber',
        publishedAt: '2024-03-24T15:45:00Z',
        category: 'Ethereum'
      }
    ];
    
    const filteredNews = mockNewsData.filter(news => 
      news.category.toLowerCase() === category.toLowerCase()
    );
    
    res.json(filteredNews);
  } catch (error) {
    console.error(`${req.params.category} kategorisindeki haberler alınırken hata oluştu:`, error.message);
    res.status(500).json({ message: 'Kategoriye göre haberler alınırken hata oluştu', error: error.message });
  }
});

// Haber detaylarını getir
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Gerçek API çağrısı burada olacak
    // Şimdilik örnek detay verisi döndürüyoruz
    const mockNewsDetail = {
      id: '1',
      title: 'Bitcoin Fiyatı Yeni Rekorlar Kırmaya Devam Ediyor',
      description: 'Bitcoin bugün yeni bir rekor fiyata ulaştı...',
      content: 'Bitcoin, son 24 saat içinde %5 artışla yeni bir rekor seviyesine ulaştı. Kurumsal yatırımcıların ilgisinin artması ve ETF onayları fiyatı yukarı yönlü etkiliyor. Analistler, önümüzdeki dönemde Bitcoin fiyatının daha da yükselebileceğini öngörüyor.',
      url: 'https://example.com/bitcoin-new-ath',
      imageUrl: 'https://example.com/images/bitcoin-ath.jpg',
      source: 'Kripto Haber',
      author: 'Ali Yılmaz',
      publishedAt: '2024-03-25T10:30:00Z',
      category: 'Bitcoin',
      tags: ['Bitcoin', 'BTC', 'Kripto Para', 'Yatırım']
    };
    
    res.json(mockNewsDetail);
  } catch (error) {
    console.error(`${req.params.id} ID'li haber detayları alınırken hata oluştu:`, error.message);
    res.status(500).json({ message: 'Haber detayları alınırken hata oluştu', error: error.message });
  }
});

// Haberlerde arama yap
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    // Gerçek API çağrısı burada olacak
    // Şimdilik örnek arama sonuçları döndürüyoruz
    const mockNewsData = [
      {
        id: '1',
        title: 'Bitcoin Fiyatı Yeni Rekorlar Kırmaya Devam Ediyor',
        description: 'Bitcoin bugün yeni bir rekor fiyata ulaştı...',
        url: 'https://example.com/bitcoin-new-ath',
        imageUrl: 'https://example.com/images/bitcoin-ath.jpg',
        source: 'Kripto Haber',
        publishedAt: '2024-03-25T10:30:00Z',
        category: 'Bitcoin'
      },
      {
        id: '3',
        title: 'Yeni Meme Coin Piyasayı Alt Üst Etti',
        description: 'Son zamanların popüler meme coin projesi...',
        url: 'https://example.com/new-memecoin',
        imageUrl: 'https://example.com/images/meme-coin.jpg',
        source: 'Kripto Dünyası',
        publishedAt: '2024-03-23T08:15:00Z',
        category: 'Altcoin'
      }
    ];
    
    const searchResults = mockNewsData.filter(news => 
      news.title.toLowerCase().includes(query.toLowerCase()) || 
      news.description.toLowerCase().includes(query.toLowerCase())
    );
    
    res.json(searchResults);
  } catch (error) {
    console.error(`"${req.params.query}" araması yapılırken hata oluştu:`, error.message);
    res.status(500).json({ message: 'Haber araması yapılırken hata oluştu', error: error.message });
  }
});

module.exports = router; 