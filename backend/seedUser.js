const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/UserModel');

async function seedUser() {
  await mongoose.connect(process.env.MONGO_URI);

  const existingUser = await User.findOne({ email: 'teste1@exemplo.com' });
  if (existingUser) {
    console.log('Usuário já existe. Abortando seed.');
    return mongoose.disconnect();
  }

  const user = new User({
    email: 'teste1@exemplo.com',
    senha: 'senha123'
  });

  await user.save();
  console.log('Usuário de teste criado com sucesso!');
  mongoose.disconnect();
}

seedUser();
