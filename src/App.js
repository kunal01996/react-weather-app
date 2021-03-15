import React, { useState } from 'react'
import {
  Card, Button, CardHeader, CardFooter, CardBody,
  CardTitle, CardText, Container, Row, Col, Input,
  Spinner
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBomb } from '@fortawesome/free-solid-svg-icons'

import './App.css';

import {
  getCurrentWeatherService
} from './services/weather'

import ForeCastTabs from './components/forecast'

function App() {

  const [city, setCity] = useState('')
  const [fetchStatus, setFetchStatus] = useState('UNINIT')
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecastTabs, setForcastTabs] = useState(false)

  const fetchCurrentWeather = () => {

    setFetchStatus('IN_PROGRESS')

    getCurrentWeatherService(city)
      .then(({ data }) => {
        setCurrentWeather(data)
        setFetchStatus('SUCCESS')
      })
      .catch(e => {
        setFetchStatus('ERROR')
      })

  }

  let body = <></>

  if (fetchStatus === 'IN_PROGRESS') {
    body = (
      <div className="center-place">
        <Spinner style={{ width: '3rem', height: '3rem' }} />
      </div>
    )
  } else if (fetchStatus === 'SUCCESS') {
    body = (
      <div className="container">
        <Row>
          <Col sm="4">
            <Card body>
              <CardTitle tag="h5">
                Max: <strong>{currentWeather.main.temp_max} K</strong> &nbsp;
              Min: <strong>{currentWeather.main.temp_min} K</strong><br />
              </CardTitle>
              <CardText>
                Wind Speed: <strong>{currentWeather.wind.speed}</strong><br />
              Humidity: <strong>{currentWeather.main.humidity}</strong>
              </CardText>
              <Button onClick={() => setForcastTabs(true)}>Get 5 Day Forecast</Button>
            </Card>
          </Col>
        </Row>
        {
          forecastTabs ? (
            <div className="container">
              <h2>5 Day weather Forecast</h2>
              <div className="container">
                <ForeCastTabs
                  cityName={city}
                />
              </div>
            </div>
          ) : null
        }
      </div>
    )
  } else if (fetchStatus === 'ERROR') {
    body = (
      <Container>
        <Row>
          <Col>
            <div className="center-place">
              <FontAwesomeIcon icon={faBomb} size="4x" />
            </div>
            <h4 className="text-center">Looks like the address does not exist, give it another shot.</h4>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <h1>Weather Forecast</h1>
            </CardHeader>
            <CardBody>
              <CardTitle tag="h5">
                Enter a city to start getting weather updates
              </CardTitle>
              <CardText>
                <Input type="text" name="cityName" placeholder="Enter city name" value={city} onChange={(e) => setCity(e.target.value)} />
              </CardText>
              <Button onClick={() => {
                setForcastTabs(false)
                fetchCurrentWeather()
              }} >Get Current</Button>
              {body}
            </CardBody>
            <CardFooter>
              Weather App <br />
              <i>by Kunal Singh</i>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
