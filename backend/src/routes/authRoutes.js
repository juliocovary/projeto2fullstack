// backend/src/routes/authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/UserModel');

const router = express.Router();

// POST /auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('senha').trim().notEmpty().escape()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Erro de validação no login:", errors.array());
      return res.status(400).json({ erros: errors.array() });
    }

    const { email, senha } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        console.error("Usuário não encontrado:", email);
        return res.status(401).json({ mensagem: 'Credenciais inválidas' });
      }

      const senhaCorreta = await user.compararSenha(senha);
      if (!senhaCorreta) {
        console.error("Senha incorreta para:", email);
        return res.status(401).json({ mensagem: 'Credenciais inválidas' });
      }

      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });

      return res.json({ token });

    } catch (err) {
      console.error("Erro no login:", err.message);
      return res.status(500).json({ mensagem: 'Erro no servidor' });
    }
  }
);

module.exports = router;
