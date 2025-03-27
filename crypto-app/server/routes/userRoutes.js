const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Kullanıcı modelini daha sonra oluşturacağız, şimdilik yorum olarak bırakıyorum
// const User = require('../models/userModel');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'cryptobuddySecretKey2024';

// Middleware - token doğrulama
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Yetkilendirme başarısız: Token bulunamadı' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Yetkilendirme başarısız: Geçersiz token' });
  }
};

// Kullanıcı kaydı
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Lütfen tüm alanları doldurun' });
    }
    
    // Kullanıcı modelini import edince burayı açacağız
    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //   return res.status(400).json({ message: 'Bu email adresi zaten kullanılıyor' });
    // }
    
    // Şifreyi hashleme
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Kullanıcı modelini import edince burayı açacağız
    // const newUser = new User({
    //   username,
    //   email,
    //   password: hashedPassword,
    // });
    
    // await newUser.save();
    
    // Şimdilik sabit bir userId kullanıyoruz
    const token = jwt.sign({ userId: '123456789' }, JWT_SECRET, { expiresIn: '1d' });
    
    res.status(201).json({
      message: 'Kullanıcı kaydı başarılı',
      token,
      // Kullanıcı modeli import edince burayı değiştireceğiz
      user: {
        id: '123456789',
        username,
        email,
      },
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
});

// Kullanıcı girişi
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Lütfen email ve şifrenizi girin' });
    }
    
    // Kullanıcı modelini import edince burayı açacağız
    // const user = await User.findOne({ email });
    // if (!user) {
    //   return res.status(400).json({ message: 'Geçersiz kimlik bilgileri' });
    // }
    
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(400).json({ message: 'Geçersiz kimlik bilgileri' });
    // }
    
    // Şimdilik sabit bir kullanıcı bilgisi kullanıyoruz
    const token = jwt.sign({ userId: '123456789' }, JWT_SECRET, { expiresIn: '1d' });
    
    res.json({
      message: 'Giriş başarılı',
      token,
      // Kullanıcı modeli import edince burayı değiştireceğiz
      user: {
        id: '123456789',
        username: 'testuser',
        email,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
});

// Kullanıcı bilgilerini getir
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // Kullanıcı modelini import edince burayı açacağız
    // const user = await User.findById(req.userId).select('-password');
    // if (!user) {
    //   return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    // }
    
    // Şimdilik sabit bir kullanıcı bilgisi kullanıyoruz
    res.json({
      user: {
        id: '123456789',
        username: 'testuser',
        email: 'test@example.com',
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
});

// Kullanıcı bilgilerini güncelle
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { username, email } = req.body;
    
    // Kullanıcı modelini import edince burayı açacağız
    // const user = await User.findById(req.userId);
    // if (!user) {
    //   return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    // }
    
    // if (username) user.username = username;
    // if (email) user.email = email;
    
    // await user.save();
    
    res.json({
      message: 'Profil güncellendi',
      user: {
        id: '123456789',
        username: username || 'testuser',
        email: email || 'test@example.com',
      },
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
});

module.exports = router; 