import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WeatherProvider } from './contexts/weatherContext';
import { AuthProvider } from './contexts/authContext'; // 🔸 Novo

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <WeatherProvider>
        <App />
      </WeatherProvider>
    </AuthProvider>
  </React.StrictMode>
);
