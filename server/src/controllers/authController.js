const { auth, db } = require('../config/firebase');
const { validationResult } = require('express-validator');

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