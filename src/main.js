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
    `http://api.openweathermap.org/geo/1.0/direct?q=${coordinatesOptions.city}&limit=${coordinatesOptions.limit}&appid=${API_KEY}`
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
    `https://api.openweathermap.org/data/2.5/weather?lat=${options.lat}&lon=${options.lon}&appid=${API_KEY}&lang=${options.lang}&units=${options.units}`
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

  pTemp.textContent = `${roundNum(obj.main.temp)}°C`;
  pFeelsLike.textContent = `${roundNum(obj.main.feels_like)}`;
  timeUp.textContent = `${timeUpSun(obj)}`;
  timeDown.textContent = `${timeDownSun(obj)}`;

  contWeathIcon.textContent = `${obj.weather[0].icon}`;
  pDesc.textContent = `${obj.weather[0].main}`;

  pHumidity.textContent = `${obj.main.humidity}%`;
  pWind.textContent = `${roundNum(obj.wind.speed)} км/г`;
  pPressure.textContent = `${obj.main.pressure}`;
  pUltraviolet.textContent = `${obj.clouds.all} %`;
}

function roundNum(num) {
  return Math.round(num);
}

function timeUpSun(obj) {
  const timestampInSeconds = obj.sys.sunrise;

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
  const timestampInSeconds = obj.sys.sunset;

  const timestampInMilliseconds = timestampInSeconds * 1000;

  const dateObject = new Date(timestampInMilliseconds);

  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  const formattedTime = `${formattedHours}:${formattedMinutes}`;
  return formattedTime;
}

// const coordinatesOptions = {
//   city: 'Старий Мерчик',
//   limit: 5,
// };

// fetch(
//   `http://api.openweathermap.org/geo/1.0/direct?q=${coordinatesOptions.city}&limit=${coordinatesOptions.limit}&appid=${API_KEY}`
// )
//   .then(response => {
//     if (!response.ok) {
//       throw new Error(response.status);
//     }
//     return response.json();
//   })
//   .then(data => {
//     const options = {
//       lat: data[0].lat,
//       lon: data[0].lon,
//       lang: 'ua, uk',
//       units: 'metric',
//     };
//     console.log(data);
//     console.log(data[0].lat);
//     console.log(data[0].lon);

//     getCoordinates(options)
//       .then(data => {
//         console.log(data);
//       })
//       .catch(error => console.log(error));
//   })
//   .catch(error => console.log(error));

// function getCoordinates(options) {
//   return fetch(
//     `https://api.openweathermap.org/data/2.5/weather?lat=${options.lat}&lon=${options.lon}&appid=${API_KEY}&lang=${options.lang}&units=${options.units}`
//   ).then(response => {
//     if (!response.ok) {
//       throw new Error(response.status);
//     }
//     return response.json();
//   });
// }
