import moment from 'moment'

export const fiveDayDataParser = (data) => {

  const weatherData = {}

  for (let l of data.list) {
    const parsedDate = moment(l.dt_txt).format('ll')
    if (weatherData[parsedDate]) {
      weatherData[parsedDate].push(l)
    } else {
      weatherData[parsedDate] = [
        l
      ]
    }
  }

  return weatherData

}