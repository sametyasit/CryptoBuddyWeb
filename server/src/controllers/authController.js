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
    const { email } = req.body;

    // Kullanıcıyı e-postaya göre bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı."
      });
    }

    // Şifre sıfırlama token'ı oluştur
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Token'ın hash'ini oluştur ve kullanıcı kaydına ekle
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Token'ı kullanıcıya kaydet
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 saat geçerli
    await user.save();

    // E-posta içeriği oluştur
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      to: user.email,
      subject: 'CryptoBuddy - Şifre Sıfırlama',
      html: `
        <h1>Şifre Sıfırlama İsteği</h1>
        <p>Merhaba ${user.username},</p>
        <p>Hesabınız için bir şifre sıfırlama isteği aldık. Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #FFD700; color: #333; text-decoration: none; border-radius: 5px; margin: 15px 0;">Şifremi Sıfırla</a>
        <p>Bu bağlantı 1 saat süreyle geçerlidir.</p>
        <p>Eğer bu isteği siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
        <p>Saygılarımızla,<br>CryptoBuddy Ekibi</p>
      `
    };

    // E-postayı gönder
    await sendEmail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi."
    });
  } catch (error) {
    console.error('Şifre sıfırlama hatası:', error);
    res.status(500).json({
      success: false,
      message: "Şifre sıfırlama işlemi sırasında bir hata oluştu."
    });
  }
};

// Şifre sıfırlama token'ını doğrula
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    // Token'ın hash'ini oluştur
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Token'a sahip ve süresi dolmamış kullanıcıyı bul
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz veya süresi dolmuş şifre sıfırlama bağlantısı."
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Token geçerli."
    });
  } catch (error) {
    console.error('Token doğrulama hatası:', error);
    res.status(500).json({
      success: false,
      message: "Token doğrulama sırasında bir hata oluştu."
    });
  }
};

// Şifre sıfırlama
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // Token'ın hash'ini oluştur
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Token'a sahip ve süresi dolmamış kullanıcıyı bul
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz veya süresi dolmuş şifre sıfırlama bağlantısı."
      });
    }
    
    // Kullanıcının şifresini güncelle
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    // Şifre değişikliği bildirim e-postası gönder
    const mailOptions = {
      to: user.email,
      subject: 'CryptoBuddy - Şifreniz Değiştirildi',
      html: `
        <h1>Şifre Değişikliği Bildirimi</h1>
        <p>Merhaba ${user.username},</p>
        <p>Hesabınızın şifresi başarıyla değiştirildi.</p>
        <p>Eğer bu değişikliği siz yapmadıysanız, lütfen hemen bizimle iletişime geçin.</p>
        <p>Saygılarımızla,<br>CryptoBuddy Ekibi</p>
      `
    };
    
    await sendEmail(mailOptions);
    
    res.status(200).json({
      success: true,
      message: "Şifreniz başarıyla sıfırlandı."
    });
  } catch (error) {
    console.error('Şifre sıfırlama hatası:', error);
    res.status(500).json({
      success: false,
      message: "Şifre sıfırlama işlemi sırasında bir hata oluştu."
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