const express = require('express');
const autenticarToken = require('../middleware/authMiddleware');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Weather = require('../models/WeatherModel');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Middleware de autenticação
router.use(autenticarToken);

// Rota de busca de clima por cidade (com cache de banco de dados)
router.get('/search', async (req, res) => {
  const city = req.query.city;

  if (!city || typeof city !== 'string') {
    return res.status(400).json({ erro: 'Parâmetro "city" é obrigatório.' });
  }

  const citySanitized = city.trim().toLowerCase();

  try {
    const localData = await Weather.findOne({
      cidade: new RegExp(`^${citySanitized}$`, 'i'),
      userId: req.usuario.id
    });

    if (localData) {
      console.log(` Dados de "${citySanitized}" encontrados no banco de dados local.`);
      const formattedData = {
        location: {
          name: localData.cidade,
          country: localData.pais,
          region: ''
        },
        current: {
          temp_c: localData.temperatura,
          condition: {
            text: localData.condicao,
            icon: '' 
          },
          humidity: localData.umidade,
          wind_kph: localData.vento,
          feelslike_c: localData.temperatura 
        }
      };
      return res.json(formattedData);
    }

    console.log(`🔎 Dados de "${citySanitized}" não encontrados localmente. Buscando na API externa...`);
    const response = await axios.get('https://api.weatherapi.com/v1/current.json', {
      params: {
        key: process.env.WEATHER_API_KEY,
        q: citySanitized
      }
    });

    const weatherData = response.data;

    const novaEntrada = new Weather({
      userId: req.usuario.id,
      cidade: weatherData.location.name,
      pais: weatherData.location.country,
      temperatura: weatherData.current.temp_c,
      condicao: weatherData.current.condition.text,
      umidade: weatherData.current.humidity,
      vento: weatherData.current.wind_kph
    });
    await novaEntrada.save();
    console.log(` Dados de "${citySanitized}" salvos no banco de dados.`);

    return res.json(weatherData);

  } catch (error) {
    const logPath = path.join(__dirname, '..', 'logs', 'failures.log');
    const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] Falha ao buscar "${citySanitized}": ${errorMessage}\n`);
    return res.status(500).json({ erro: 'Erro ao buscar dados do clima. Verifique o nome da cidade.' });
  }
});



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
        userId: req.usuario.id,
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