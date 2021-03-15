import axios from 'axios'

const API_KEY = '9dcf7835390b3ed755fb9bba26242cce'
const BASE_URL = '//api.openweathermap.org/data/2.5'

export const getCurrentWeatherService = async (cityName) => {

  return await axios({
    method: 'GET',
    url: `${BASE_URL}/weather`,
    params: {
      q: cityName,
      appid: API_KEY
    }
  })

}

export const forecastWeatherService = async (cityName) => {

  return await axios({
    method: 'GET',
    url: `${BASE_URL}/forecast`,
    params: {
      q: cityName,
      appid: API_KEY
    }
  })

}
