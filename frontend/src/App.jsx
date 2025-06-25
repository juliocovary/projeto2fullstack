import { useContext, useState } from 'react';
import { WeatherContext } from './contexts/weatherContext';
import { AuthContext } from './contexts/authContext'; // ✅ Importa contexto de autenticação
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
import Login from './components/Login';
import {
  Container, TextField, Button, Typography, Box, Paper
} from '@mui/material';

function App() {
  const { state, dispatch } = useContext(WeatherContext);
  const { token, logout } = useContext(AuthContext); // ✅ Usa token global
  const [city, setCity] = useState('');

  const handleSearch = async () => {
    if (!city.trim()) return alert("Digite o nome da cidade!");

    dispatch({ type: 'FETCH_START' });

    try {
      const response = await axios.get(`https://localhost:3000/weather/search`, {
        params: { city },
        headers: { Authorization: `Bearer ${token}` } // ✅ Autenticação
      });

      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: 'Cidade não encontrada.' });
    }
  };

  // ✅ Se não estiver autenticado, exibe o Login
  if (!token) {
    return <Login />;
  }

  return (
    <Box sx={{ backgroundColor: '#f4f6f8', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>Previsão do Tempo</Typography>

          <TextField
            label="Digite o nome da cidade ou CEP"
            variant="outlined"
            fullWidth
            value={city}
            onChange={(e) => setCity(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button variant="contained" color="primary" fullWidth onClick={handleSearch}>
            Buscar
          </Button>

          <Button variant="text" color="error" sx={{ mt: 2 }} onClick={logout}>
            Sair
          </Button>

          {state.error && (
            <Typography color="error" sx={{ mt: 2 }}>{state.error}</Typography>
          )}

          {state.data && (
            <Box mt={4}>
              <WeatherCard data={state.data} />
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
