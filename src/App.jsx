import { Button, Card, CardContent, Container, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/system";
import { useState } from "react";

export default function App() {
  const API_WEATHER = `https://api.weatherapi.com/v1/current.json?key=313889553d5b4249a3c65933232805&q=`;

  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    error: false,
    message: "",
  });

  const [weather, setWeather] = useState([]);
  
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({
      error: false,
      message: error.message,
    });
    try {
      if (!city.trim()) throw { message: "Este campo es obligatorio" };

      const response = await fetch(`${API_WEATHER}${city}`);
      const data = await response.json();

      if (data.error) throw { message: data.error.message };

      setWeather((prevWeather) => [
        ...prevWeather,
        {
          city: data.location.name,
          country: data.location.country,
          temp: data.current.temp_c,
          condition: data.current.condition.code,
          icon: data.current.condition.icon,
          conditionText: data.current.condition.text,
        },
      ]);
      setCity(""); // Limpiar el campo de búsqueda después de una búsqueda exitosa
    } catch (error) {
      setError({
        error: true,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWeather = () => {
    setWeather([]);
    setSelectedWeather(null);
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 2 }}>
      <Card>
        <CardContent>
        {weather.length > 0 && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Button onClick={handleDeleteWeather}>Eliminar todas las tarjetas</Button>
            </Box>
          )}
          <Typography variant="h3" component="h1" align="center" gutterBottom>
            Clima de hoy en:
          </Typography>
          <Box
            sx={{ display: "grid", gap: 2 }}
            component="form"
            autoComplete="off"
            onSubmit={onSubmit}
          >
            <TextField
              id="city"
              label="Ciudad"
              variant="outlined"
              size="small"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              error={error.error}
              helperText={error.message}
            />
            <LoadingButton type="submit" variant="contained" loading={loading} loadingIndicator="Buscando...">
              Buscar
            </LoadingButton>
          </Box>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
            {weather.map((item, index) => (
              <Card key={index} sx={{ m: 1, flex: "1 0 200px" }}>
                <CardContent>
                  <Typography variant="h4" component="h2">
                    {item.city}, {item.country}
                  </Typography>

                  <Box component="img" alt={item.conditionText} src={item.icon} sx={{ mx: "auto" }} />

                  <Typography variant="h5" component="h3">
                    {item.temp}°C
                  </Typography>
                  <Typography variant="h6" component="h4">
                    {item.conditionText}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}