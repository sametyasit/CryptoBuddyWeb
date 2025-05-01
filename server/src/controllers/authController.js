const { auth, db } = require('../config/firebase');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// Register user
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, username } = req.body;

    // Create user in Firebase Auth
    const userCredential = await auth.createUser({
      email,
      password,
      displayName: username
    });

    // Create user document in Firestore
    await db.collection('users').doc(userCredential.uid).set({
      username,
      email,
      favorites: [],
      portfolio: [],
      alerts: [],
      createdAt: new Date()
    });

    // Create custom token
    const token = await auth.createCustomToken(userCredential.uid);

    res.status(201).json({
      token,
      user: {
        id: userCredential.uid,
        username,
        email
      }
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Sign in with email and password
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(user.uid).get();
    const userData = userDoc.data();

    // Create custom token
    const token = await auth.createCustomToken(user.uid);

    res.json({
      token,
      user: {
        id: user.uid,
        username: userData.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(400).json({ message: 'Invalid credentials' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userData = userDoc.data();

    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(userData);
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const updates = {};

    if (username) updates.username = username;
    if (email) {
      updates.email = email;
      await auth.updateUser(req.user.uid, { email });
    }

    if (Object.keys(updates).length > 0) {
      await db.collection('users').doc(req.user.uid).update(updates);
    }

    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userData = userDoc.data();

    res.json(userData);
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Şifremi unuttum / Şifre sıfırlama e-postası gönderimi
exports.forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    
    // Firebase Authentication ile şifre sıfırlama e-postası gönder
    const actionCodeSettings = {
      url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`,
      handleCodeInApp: false,
    };

    await auth.generatePasswordResetLink(email, actionCodeSettings)
      .then(async (link) => {
        // Kullanıcı bilgilerini Firestore'dan al (opsiyonel)
        try {
          const userRecord = await auth.getUserByEmail(email);
          const userDoc = await db.collection('users').doc(userRecord.uid).get();
          
          // E-posta içeriğini hazırlayabilirsin (opsiyonel, doğrudan link de kullanılabilir)
          console.log('Password reset link:', link);
          console.log('User data:', userDoc.data());

          // Firebase doğrudan bu bağlantıyı e-posta olarak gönderecek
        } catch (userErr) {
          console.log('User lookup error, but password reset still sent:', userErr);
        }
        
        res.status(200).json({
          success: true,
          message: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi."
        });
      });
      
  } catch (error) {
    console.error('Şifre sıfırlama hatası:', error);
    
    // Firebase error kodlarına göre özelleştirilmiş mesajlar
    let errorMessage = "Şifre sıfırlama işlemi sırasında bir hata oluştu.";
    let statusCode = 500;
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = "Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı.";
      statusCode = 404;
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "Geçersiz e-posta adresi.";
      statusCode = 400;
    } else if (error.code === 'auth/invalid-continue-uri') {
      errorMessage = "Devam URL'i geçersiz.";
      statusCode = 400;
    }
    
    res.status(statusCode).json({
      success: false,
      message: errorMessage
    });
  }
};

// E-posta gönderme fonksiyonu
const sendEmail = async (options) => {
  // Nodemailer transporter oluştur
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
  
  // E-posta ayarları
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: options.to,
    subject: options.subject,
    html: options.html
  };
  
  // E-postayı gönder
  await transporter.sendMail(mailOptions);
}; 