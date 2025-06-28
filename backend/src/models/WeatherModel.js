const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Usuario'
  },
  cidade: {
    type: String,
    required: true
  },
  pais: {
    type: String,
    required: true
  },
  temperatura: {
    type: Number,
    required: true
  },
  condicao: {
    type: String,
    required: true
  },
  umidade: {
    type: Number,
    required: true
  },
  vento: {
    type: Number,
    required: true
  },
  criadoEm: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Weather', weatherSchema);
