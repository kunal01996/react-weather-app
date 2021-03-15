import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Table, Spinner, Container } from 'reactstrap'
import classnames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThermometerEmpty, faBomb } from '@fortawesome/free-solid-svg-icons'

import {
  forecastWeatherService
} from '../services/weather'

import {
  fiveDayDataParser
} from '../utils/helper'

const Forecast = ({
  cityName
}) => {

  const [activeTab, setActiveTab] = useState('1');
  const [fetchStatus, setFetchStatus] = useState('UNINIT')
  const [forecastData, setForecastdata] = useState(null)

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  }

  const fetchForecast = () => {
    setFetchStatus('IN_PROGRESS')
    forecastWeatherService(cityName)
      .then(({ data }) => {
        const parsedData = fiveDayDataParser(data)
        setForecastdata(parsedData)
        setActiveTab(Object.keys(parsedData)[0])
        setFetchStatus('SUCCESS')
      })
      .catch(e => {
        setFetchStatus('ERROR')
      })
  }

  useEffect(() => {
    fetchForecast()
  }, [])

  const noData = (
    <Container>
      <Row>
        <Col>
          <div className="center-place">
            <FontAwesomeIcon icon={faThermometerEmpty} size="4x" />
          </div>
          <h4 className="text-center">No weather data could be fetched.</h4>
        </Col>
      </Row>
    </Container>
  )

  let body = <></>

  if (fetchStatus === 'IN_PROGRESS') {
    body = (
      <div className="center-place">
        <Spinner style={{ width: '3rem', height: '3rem' }} />
      </div>
    )
  } else if (fetchStatus === 'SUCCESS') {
    body = forecastData && Object.keys(forecastData).length ? (
      <div>
        <Nav tabs>
          {
            Object.keys(forecastData).map(f => (
              <>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === f })}
                    onClick={() => { toggle(f); }}
                  >
                    {f}
                  </NavLink>
                </NavItem>
              </>
            ))
          }
        </Nav>
        <TabContent activeTab={activeTab}>
          {
            Object.keys(forecastData).length ? Object.keys(forecastData).map((f) => (
              <TabPane tabId={f}>
                <Row>
                  <Col sm="12">
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Date</th>
                          <th>Temp</th>
                          <th>Min. Temp.</th>
                          <th>Max. Temp.</th>
                          <th>Wind</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          Array.isArray(forecastData[f]) && forecastData[f].length ? forecastData[f].map((c, i) => (
                            <tr>
                              <th scope="row">{i+1}</th>
                              <td>{moment(c.dt_txt).format('LLL')}</td>
                              <td>{c.main.temp}</td>
                              <td>{c.main.temp_min}</td>
                              <td>{c.main.temp_max}</td>
                              <td>{c.wind.speed} m/sec</td>
                              <td>{c.weather[0].description}</td>
                            </tr>
                          )) : noData
                        }
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </TabPane>
            )) : noData
          }
        </TabContent>
      </div>
    ) : noData
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

  return body;
}

Forecast.propTypes = {
  cityName: PropTypes.string.isRequired
}

export default Forecast