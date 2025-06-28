import { useState, useContext } from 'react';
import axios from 'axios';
import { Box, Container, TextField, Button, Typography, Paper } from '@mui/material';
import { AuthContext } from '../contexts/authContext';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://localhost:3000/auth/login', {
        email,
        senha
      });

      login(response.data.token);
    } catch (err) {
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f4f6f8', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>Login</Typography>

          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Senha"
            type="password"
            fullWidth
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button variant="contained" fullWidth onClick={handleLogin}>Entrar</Button>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
