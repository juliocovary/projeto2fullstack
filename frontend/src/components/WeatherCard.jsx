import { Card, CardContent, Typography, Box } from '@mui/material';

function WeatherCard({ data }) {
  const { location, current } = data;

  return (
    <Card
      sx={{
        maxWidth: 400,
        margin: '0 auto',
        borderRadius: 3,
        boxShadow: 5,
        background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {location.name}, {location.region}
        </Typography>

        <Typography variant="subtitle1" color="text.secondary">
          {location.country}
        </Typography>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          mt={2}
        >
          <img
            src={current.condition.icon}
            alt={current.condition.text}
            style={{ width: 80, height: 80 }}
          />
          <Typography variant="h3" ml={2}>
            {current.temp_c}°C
          </Typography>
        </Box>

        <Typography variant="h6" mt={2} color="primary">
          {current.condition.text}
        </Typography>

        <Box mt={2}>
          <Typography variant="body2">
            🌡️ Sensação térmica: <strong>{current.feelslike_c}°C</strong>
          </Typography>
          <Typography variant="body2">
            💧 Umidade: <strong>{current.humidity}%</strong>
          </Typography>
          <Typography variant="body2">
            🌬️ Vento: <strong>{current.wind_kph} km/h</strong>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default WeatherCard;
