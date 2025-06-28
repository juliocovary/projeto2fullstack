Projeto Fullstack - Previsão do Tempo
Uma aplicação web completa desenvolvida em 3 camadas (Frontend, Backend, Banco de Dados) que permite a usuários autenticados pesquisar dados de previsão do tempo, com um sistema de cache inteligente integrado ao banco de dados.

✨ Funcionalidades
Autenticação de Usuários: Sistema de login seguro utilizando JSON Web Tokens (JWT) para proteger as rotas.

Busca de Clima por Cidade: Funcionalidade de busca que consulta uma API externa para obter dados do tempo em tempo real.

Cache Inteligente no Banco de Dados: A primeira busca por uma cidade salva o resultado no banco de dados do usuário. Buscas subsequentes pela mesma cidade consultam primeiro o banco local, otimizando o tempo de resposta e reduzindo chamadas a APIs externas.

Segurança:

Comunicação com a API feita exclusivamente via HTTPS.

Senhas dos usuários armazenadas de forma segura com criptografia bcrypt.

API RESTful: Backend construído seguindo os princípios REST para uma comunicação clara e padronizada.

🛠️ Tecnologias Utilizadas
Frontend:

React.js

Vite

Material-UI

Axios

Backend:

Node.js

Express.js

Mongoose

JSON Web Token (JWT)

Bcrypt

Banco de Dados:

MongoDB

🚀 Como Executar o Projeto
Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

Pré-requisitos
Node.js (versão 14 ou superior)

npm

Uma instância do MongoDB (local ou um URI de conexão do MongoDB Atlas)

Uma chave de API do WeatherAPI

1. Clonar o Repositório

git clone https://github.com/juliocovary/projeto2fullstack
cd nome-do-repositorio
2. Configurar Variáveis de Ambiente
Crie um arquivo chamado .env na raiz do projeto. Copie o conteúdo do exemplo abaixo e substitua pelos seus próprios valores.

Snippet de código

# Arquivo .env

# String de conexão do seu banco de dados MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority

# Chave secreta para gerar os tokens JWT (pode ser qualquer string segura)
JWT_SECRET=SUA_CHAVE_SECRETA_SUPER_FORTE

# Sua chave de API obtida no site weatherapi.com
WEATHER_API_KEY=SUA_CHAVE_DA_API_DE_CLIMA
3. Instalar e Executar o Backend
Abra um terminal na raiz do projeto.

# Instalar as dependências do backend
npm install

# Iniciar o servidor do backend
npm run dev
O servidor backend estará rodando em https://localhost:3000.

4. Instalar e Executar o Frontend
Abra um novo terminal.

# Navegar até a pasta do frontend
cd frontend

# Instalar as dependências do frontend
npm install

# Iniciar o servidor de desenvolvimento do frontend
npm run dev
A aplicação estará acessível em http://localhost:5173.

5. (Opcional) Criar um Usuário de Teste
Para facilitar os testes, você pode usar o script seedUser para criar um usuário padrão no seu banco de dados. Abra um terceiro terminal na raiz do projeto.

node backend/seedUser.js
As credenciais do usuário de teste são:

Email: teste1@exemplo.com

Senha: senha123

📝 Endpoints da API
Você pode testar os endpoints da API usando uma ferramenta como o Postman.

POST /auth/login

Faz o login do usuário e retorna um token JWT.

Body: { "email": "teste1@exemplo.com", "senha": "senha123" }

GET /weather/search

Busca dados de clima. Requer um token de autenticação.

Header: Authorization: Bearer <seu_token_jwt>

Query Params: ?city=NomeDaCidade

POST /weather/save

Salva manualmente um registro de clima no banco de dados. Requer um token de autenticação.

Header: Authorization: Bearer <seu_token_jwt>

Body: { "cidade": "Dublin", "pais": "Irlanda", "temperatura": 15, ... }
