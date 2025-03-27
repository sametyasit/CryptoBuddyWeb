const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    default: 'Ana Portföy'
  },
  description: {
    type: String,
    default: ''
  },
  coins: [{
    coinId: {
      type: String,
      required: true
    },
    symbol: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    buyPrice: {
      type: Number,
      required: true
    },
    transactions: [{
      type: {
        type: String,
        enum: ['buy', 'sell'],
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      },
      notes: String
    }],
    color: {
      type: String,
      default: '#627EEA' // Varsayılan renk
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalInvestment: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  history: [{
    date: {
      type: Date,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  }],
  settings: {
    currency: {
      type: String,
      default: 'USD'
    },
    isPublic: {
      type: Boolean,
      default: false
    }
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
});

// Toplam yatırımı hesaplama
PortfolioSchema.methods.calculateTotalInvestment = function() {
  let total = 0;
  
  for (const coin of this.coins) {
    total += coin.amount * coin.buyPrice;
  }
  
  this.totalInvestment = total;
  return total;
};

// Portföy değeri hesaplama (güncel fiyatları alarak)
PortfolioSchema.methods.calculateCurrentValue = async function(getCurrentPrice) {
  try {
    let totalValue = 0;
    
    for (const coin of this.coins) {
      const currentPrice = await getCurrentPrice(coin.coinId);
      totalValue += coin.amount * currentPrice;
    }
    
    // Portföy geçmişini güncelle
    this.history.push({
      date: new Date(),
      value: totalValue
    });
    
    await this.save();
    return totalValue;
  } catch (error) {
    throw new Error(`Portföy değeri hesaplanırken hata oluştu: ${error.message}`);
  }
};

// Güncellendiğinde updatedAt alanını güncelle
PortfolioSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Portfolio = mongoose.model('Portfolio', PortfolioSchema);

module.exports = Portfolio; 