// backend/index.js
const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./src/routes/authRoutes');
const weatherRoutes = require('./src/routes/weatherRoutes');

dotenv.config({ path: __dirname + '/../.env' });
console.log("URI carregada:", process.env.MONGO_URI);


const app = express();
const PORT = process.env.PORT || 3000;

// 🛡️ Middleware de segurança
app.use(cors({ origin: 'http://localhost:5173' })); // libera CORS para o Vite
app.use(express.json()); // permite receber JSON do frontend
const compression = require('compression');
app.use(compression()); // 🔽 Comprime todas as respostas HTTP

// 🔗 Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ MongoDB conectado com sucesso!'))
.catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// 🔁 Rotas
app.use('/auth', authRoutes);
app.use('/weather', weatherRoutes);

// 🔐 Carrega certificados SSL
const sslOptions = {
key: fs.readFileSync(__dirname + '/ssl/key.pem'),
cert: fs.readFileSync(__dirname + '/ssl/cert.pem')
};

// 🚀 Inicia servidor HTTPS
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`🔐 Servidor HTTPS rodando em https://localhost:${PORT}`);
});
