import { LoadingButton } from "@mui/lab";
import { Box, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";



export default function App() {
  
  const API_WEATHER = `http://api.weatherapi.com/v1/current.json?key=313889553d5b4249a3c65933232805&q=`; 
  
const [city, setCity] = useState("")
const [loading, setloading] = useState(false)
const [error, setError] = useState({
  error: false, 
  message: "", 
})

const [weather, setWeather] = useState({
  city: "",
  country: "", 
  temp: "",
  condition: "",
  icon: "",
  conditionText: "", 

})

  const onSubmit = async(e) => {
    e.preventDefault();
    setloading(true)
    setError({
      error: false, 
    message: error.message,
    })
try{
if(!city.trim()) throw { message: "Este campo es obligatorio" }

const response = await fetch (`${API_WEATHER}${city}`);
const data = await response.json()

if(data.error) throw { message: data.error.message }

setWeather({
  city: data.location.name, 
  country: data.location.country,
  temp: data.current.temp_c,
  condition: data.current.condition.code,
  icon: data.current.condition.icon,
  conditionText: data.current.condition.text,
})

}catch (error) {
  setError({
    error: true, 
  message: error.message,
  })
} finally{
  setloading(false)
}

  }

return(
<Container maxWidth="xs"
  sx={{ mt: 2}}>


<Typography variant="h3"
component="h1"
align="center"
gutterBottom>
Clima de hoy en:
</Typography>

<Box sx={{display: "grid", gap: 2}}
component="form"
autoComplete="off"
onSubmit={onSubmit}>

<TextField id="city"
label="Ciudad"
variant="outlined"
size="small"
required
value={city}
onChange={(e) => setCity(e.target.value)}
error={error.error}
helperText={error.message}/>

<LoadingButton type="submit"
variant="contained"
loading={loading}
loadingIndicator="Buscando...">
  Buscar
</LoadingButton>
</Box>

{weather.city && (
  <Box sx={{ mt: 2, 
  display: "grid", 
  gap: 2,
  textAlign: "center"}}>

  <Typography variant="h4" component="h2">
  {weather.city}, {weather.country}
  </Typography>

<Box component = "img"
alt={weather.conditionText}
src={weather.icon}
sx={{margin: "0 auto"}}/>

<Typography variant="h5" component="h3">
  {weather.temp} C
</Typography>
<Typography variant="h6" component="h4">
{weather.conditionText}
</Typography>
</Box>
)}

</Container>
  ); 
}

