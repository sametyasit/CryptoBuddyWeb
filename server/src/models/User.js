const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  favorites: [{
    type: String,
    ref: 'Coin'
  }],
  portfolio: [{
    coinId: {
      type: String,
      ref: 'Coin'
    },
    amount: {
      type: Number,
      required: true
    },
    purchasePrice: {
      type: Number,
      required: true
    },
    purchaseDate: {
      type: Date,
      default: Date.now
    }
  }],
  alerts: [{
    coinId: {
      type: String,
      ref: 'Coin'
    },
    price: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ['above', 'below'],
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 