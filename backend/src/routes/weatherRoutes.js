const express = require('express');
const autenticarToken = require('../middleware/authMiddleware');
const cache = require('../config/cache');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Weather = require('../models/WeatherModel'); // 🆕
const { body, validationResult } = require('express-validator'); // 🆕

const router = express.Router();

// 🔐 Middleware de autenticação
router.use(autenticarToken);

// 🔍 Rota de busca de clima por cidade (com cache)
router.get('/search', async (req, res) => {
  const city = req.query.city;

  if (!city || typeof city !== 'string') {
    return res.status(400).json({ erro: 'Parâmetro "city" é obrigatório.' });
  }

  const citySanitized = city.trim().toLowerCase();

  const cached = cache.get(citySanitized);
  if (cached) {
    return res.json(cached);
  }

  try {
    const response = await axios.get('https://api.weatherapi.com/v1/current.json', {
      params: {
        key: process.env.WEATHER_API_KEY,
        q: citySanitized
      }
    });

    const weatherData = response.data;
    cache.set(citySanitized, weatherData);

    return res.json(weatherData);
  } catch (error) {
    const logPath = path.join(__dirname, '..', 'logs', 'failures.log');
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] Falha ao buscar "${citySanitized}": ${error.message}\n`);
    return res.status(500).json({ erro: 'Erro ao buscar dados do clima. Verifique o nome da cidade.' });
  }
});

// 📝 Rota para salvar dados climáticos
router.post('/save',
  [
    body('cidade').notEmpty().isString(),
    body('pais').notEmpty().isString(),
    body('temperatura').isNumeric(),
    body('condicao').notEmpty().isString(),
    body('umidade').isNumeric(),
    body('vento').isNumeric()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array() });
    }

    const { cidade, pais, temperatura, condicao, umidade, vento } = req.body;

    try {
      const novaEntrada = new Weather({
        userId: req.usuario.id, // vem do token JWT
        cidade,
        pais,
        temperatura,
        condicao,
        umidade,
        vento
      });

      await novaEntrada.save();

      return res.status(201).json({ mensagem: 'Dados climáticos salvos com sucesso!' });
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao salvar os dados climáticos.' });
    }
  }
);

module.exports = router;
