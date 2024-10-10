import React, { useEffect, useState } from 'react';
import Clock from 'react-live-clock';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import CloudIcon from '@mui/icons-material/Cloud';
import AirIcon from '@mui/icons-material/Air';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import SolarPowerIcon from '@mui/icons-material/SolarPower';

function WeatherForecast() {
  const [weatherData, setWeatherData] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/get-weather')
      .then(response => response.json())
      .then(data => {
        console.log("Data received from API:", data.daily);
        setWeatherData(data.daily);
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
    fetch('http://localhost:5000/prediction')
      .then(response => response.json())
      .then(data => {
        setPredictions(data.predictions);
        setDates(data.dates);
      })
      .catch(error => {
        console.error('Error fetching drying predictions:', error);
      });
  }, []);

  return (
    <div className='container mx-auto px-4 space-y-2'>
      <div className='flex justify-center'>
        <Clock
          format={'h:mm:ssa'}
          style={{ fontSize: '6em', fontFamily: 'Digital, sans-serif', color: 'black' }}
          ticking={true} />
      </div>
      {weatherData && predictions ? (
        <div>
          <div className='bg-white rounded-lg shadow-lg p-5 flex justify-center items-center flex-col space-y-2'>
            <div className='font-bold text-4xl mb-2'>{dates[0]}</div>
            <h4 className={predictions[0] === 1 ? 'text-green-500 text-2xl' : 'text-red-500 text-2xl'}>
              {predictions[0] === 1 ? 'Good for dry the clothes' : 'Not good for dry the clothes'}
            </h4>
            <div className='flex items-center space-x-4'>
              <div className='flex flex-row'>
                <ThermostatIcon className="w-6 h-6 mr-2" />
                <p>Max Temperature: {weatherData.temperature_2m_max[0]} °C</p>
              </div>
              <div className='flex flex-row space-x-4'>
                <CloudIcon className='w-6 h-6 mr-2' />
                <p>Min Temperature: {weatherData.temperature_2m_min[0]} °C</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <WbSunnyIcon className="w-6 h-6 mr-2" />
              <p>Sunshine Duration: {(weatherData.sunshine_duration[0] / 3600).toFixed(2)} hours</p>
              <WbTwilightIcon className="w-6 h-6 mr-2" />
              <p>Daylight Duration: {(weatherData.daylight_duration[0] / 3600).toFixed(2)} hours</p>
            </div>
            <div className='flex items-center space-x-4'>
              <BeachAccessIcon className="w-6 h-6 mr-2" />
              <p>UV Index: {weatherData.uv_index_max[0]}%</p>
              <SolarPowerIcon className="w-6 h-6 mr-2" />
              <p>UV Index Clear Sky: {weatherData.uv_index_clear_sky_max[0]}%</p>
            </div>
            <div className='flex items-center space-x-4'>
              <WaterDropIcon className="w-6 h-6 mr-2" />
              <p>Precipitation Probability: {weatherData.precipitation_probability_max[0]}%</p>
            </div>
            <div className='flex items-center space-x-4'>
              <AirIcon className="w-6 h-6 mr-2" />
              <p>Wind Speed Max: {weatherData.wind_speed_10m_max[0]} km/h</p>
            </div>
          </div>

        </div>
      ) : (
        <p className='text-center text-xl'>Loading weather data...</p>
      )}
      {weatherData && predictions.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {weatherData.time.slice(1).map((date, index) => (
            <div key={index} className='bg-white rounded-lg shadow-lg p-5'>
              <h3 className='font-bold text-xl mb-2'>{date}</h3>
              <h4 className={predictions[index] === 1 ? 'text-green-500' : 'text-red-500'}>
                {predictions[index] === 1 ? 'Good for dry the clothes' : 'Not good for dry the clothes'}
              </h4>
              <div className='flex items-center'>
                <ThermostatIcon className="w-6 h-6 mr-2" />
                <p>Max Temperature: {weatherData.temperature_2m_max[index]} °C</p>
              </div>
              <div className='flex items-center'>
                <WbSunnyIcon className="w-6 h-6 mr-2" />
                <p>Sunshine Duration: {(weatherData.sunshine_duration[index] / 3600).toFixed(2)} hours</p>
              </div>
              <div className='flex items-center'>
                <WaterDropIcon className="w-6 h-6 mr-2" />
                <p>Precipitation Probability: {weatherData.precipitation_probability_max[index]}%</p>
              </div>
              <div className='flex items-center'>
                <AirIcon className="w-6 h-6 mr-2" />
                <p>Wind Speed Max: {weatherData.wind_speed_10m_max[index]} km/h</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-center text-xl'>Loading weather data...</p>
      )}
    </div>
  );
}

export default WeatherForecast;
