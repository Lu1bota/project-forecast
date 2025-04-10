import './js/slider';
import axios from 'axios';

const API_KEY = '7a2dfcb51e1141c71771f685e7f4e2df';

const form = document.querySelector('.search-form');
const btnCurrentLoc = document.querySelector('.current-location-btn');
const input = form.querySelector('input');
const contWeatherDetails = document.querySelector('.weather-details');

form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  getCoordinates();
  console.log(contWeatherDetails);
}

function getCoordinates() {
  const coordinatesOptions = {
    city: input.value,
    limit: 1,
  };
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${coordinatesOptions.city}&limit=${coordinatesOptions.limit}&appid=${API_KEY}`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(res => {
      console.log(res[0]);

      const options = {
        lat: res[0].lat,
        lon: res[0].lon,
        lang: 'ua, uk',
        units: 'metric',
      };
      console.log(res[0].lat);
      console.log(res[0].lon);

      getWeather(options)
        .then(data => {
          console.log(data);
          initElements(data);
        })
        .catch(error => console.log(error));
    })
    .catch(error => console.log(error));
}

function getWeather(options) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${options.lat}&lon=${options.lon}&appid=${API_KEY}&lang=${options.lang}&units=${options.units}`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

function initElements(obj) {
  const pTemp = document.querySelector('.main-temp');
  const pFeelsLike = document.querySelector('.feels-like-span');
  const timeUp = document.querySelector('.time-up');
  const timeDown = document.querySelector('.time-down');

  const contWeathIcon = document.querySelector('.weather-icon');
  const pDesc = document.querySelector('.description');

  const pHumidity = document.querySelector('.humidity');
  const pWind = document.querySelector('.wind');
  const pPressure = document.querySelector('.pressure');
  const pUltraviolet = document.querySelector('.ultraviolet');

  const iconDay1 = document.querySelector('.icon-day-1');
  const tempDay1 = document.querySelector('.temp-day-1');
  const day1 = document.querySelector('.day-1');

  const iconDay2 = document.querySelector('.icon-day-2');
  const tempDay2 = document.querySelector('.temp-day-2');
  const day2 = document.querySelector('.day-2');

  const iconDay3 = document.querySelector('.icon-day-3');
  const tempDay3 = document.querySelector('.temp-day-3');
  const day3 = document.querySelector('.day-3');

  const iconDay4 = document.querySelector('.icon-day-4');
  const tempDay4 = document.querySelector('.temp-day-4');
  const day4 = document.querySelector('.day-4');

  const iconDay5 = document.querySelector('.icon-day-5');
  const tempDay5 = document.querySelector('.temp-day-5');
  const day5 = document.querySelector('.day-5');

  pTemp.textContent = `${roundNum(obj.list[0].main.temp)}°C`;
  pFeelsLike.textContent = `${roundNum(obj.list[0].main.feels_like)}`;
  timeUp.textContent = `${timeUpSun(obj)}`;
  timeDown.textContent = `${timeDownSun(obj)}`;

  contWeathIcon.innerHTML = `
  <img src="https://openweathermap.org/img/wn/${obj.list[0].weather[0].icon}@2x.png" alt="Weather icon"/>
  `;
  pDesc.textContent = `${obj.list[0].weather[0].description}`;

  pHumidity.textContent = `${obj.list[0].main.humidity} %`;
  pWind.textContent = `${roundNum(obj.list[0].wind.speed)} км/г`;
  pPressure.textContent = `${obj.list[0].main.pressure}`;
  pUltraviolet.textContent = `${obj.list[0].clouds.all} %`;
}

function roundNum(num) {
  return Math.round(num);
}

function timeUpSun(obj) {
  const timestampInSeconds = obj.city.sunrise;

  const timestampInMilliseconds = timestampInSeconds * 1000;

  const dateObject = new Date(timestampInMilliseconds);

  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  const formattedTime = `${formattedHours}:${formattedMinutes}`;
  return formattedTime;
}

function timeDownSun(obj) {
  const timestampInSeconds = obj.city.sunset;

  const timestampInMilliseconds = timestampInSeconds * 1000;

  const dateObject = new Date(timestampInMilliseconds);

  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  const formattedTime = `${formattedHours}:${formattedMinutes}`;
  return formattedTime;
}
