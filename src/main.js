import './js/slider';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const API_KEY = '7a2dfcb51e1141c71771f685e7f4e2df';

const form = document.querySelector('.search-form');
const btnCurrentLoc = document.querySelector('.current-location-btn');
const input = form.querySelector('input');
const contLocationTime = document.querySelector('.location-time');

clock_2();
dateNow();
document.addEventListener('DOMContentLoaded', askForLocation);
form.addEventListener('submit', handleSubmit);
btnCurrentLoc.addEventListener('click', askForLocation);

function askForLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  } else {
    geoError(error);
    iziToast.error({
      title: 'Помилка!',
      message: 'Геолокація не підтримується вашим браузером.',
      position: 'topRight',
    });
  }
}

function geoSuccess(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const options = {
    lat,
    lon,
    lang: 'ua, uk',
    units: 'metric',
  };

  getWeather(options)
    .then(data => {
      contLocationTime.querySelector('h1').textContent = data.city.name;
      initElements(data);
    })
    .catch(error => {
      iziToast.error({
        title: 'Error!',
        message: `${error.message}`,
        position: 'topRight',
      });
    });
}

function geoError(error) {
  let message = 'Не вдалося визначити місцезнаходження.';
  switch (error.code) {
    case error.PERMISSION_DENIED:
      message = 'Ви заборонили доступ до свого місцезнаходження';
      iziToast.error({
        title: 'Error!',
        message: message,
        position: 'topRight',
      });
      break;
    case error.POSITION_UNAVAILABLE:
      message = 'Інформація про місцезнаходження недоступна.';
      iziToast.error({
        title: 'Error!',
        message: message,
        position: 'topRight',
      });
      break;
    case error.TIMEOUT:
      message = 'Час очікування запиту на місцезнаходження вичерпано.';
      iziToast.error({
        title: 'Error!',
        message: message,
        position: 'topRight',
      });
      break;
  }
}

function handleSubmit(event) {
  event.preventDefault();
  getCoordinates();
  form.reset();
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
      contLocationTime.querySelector('h1').textContent = res[0].local_names.uk;

      const options = {
        lat: res[0].lat,
        lon: res[0].lon,
        lang: 'ua, uk',
        units: 'metric',
      };

      getWeather(options)
        .then(data => {
          initElements(data);
        })
        .catch(error => {
          iziToast.error({
            title: 'Error!',
            message: error.message,
            position: 'topRight',
          });
        });
    })
    .catch(error => {
      iziToast.error({
        title: 'Error!',
        message: error.message,
        position: 'topRight',
      });
    });
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

  const dailyForecasts = [];
  const processedDates = new Set();

  for (const forecast of obj.list) {
    const forecastDate = new Date(forecast.dt * 1000);
    const dateString = forecastDate.toLocaleDateString();

    if (
      !processedDates.has(dateString) &&
      forecastDate.getHours() >= 14 &&
      forecastDate.getHours() < 17 &&
      dailyForecasts.length < 5
    ) {
      dailyForecasts.push({
        date: forecastDate,
        temp: forecast.main.temp,
        icon: forecast.weather[0].icon,
      });
      processedDates.add(dateString);
    }
  }

  const forecastListItems = document.querySelectorAll(
    '.list-forecast-5days li'
  );

  forecastListItems.forEach((li, index) => {
    if (dailyForecasts[index]) {
      const dayData = dailyForecasts[index];
      const iconElement = li.querySelector('.icon');
      const tempElement = li.querySelector('.temp');
      const dayElement = li.querySelector('.day');

      if (iconElement) {
        iconElement.innerHTML = `<img src="https://openweathermap.org/img/wn/${dayData.icon}.png" alt="Weather icon"/>`;
      }
      if (tempElement) {
        tempElement.textContent = `${roundNum(dayData.temp)}°C`;
      }
      if (dayElement) {
        dayElement.textContent = dayData.date.toLocaleDateString('uk-UA', {
          weekday: 'short',
          day: 'numeric',
          month: 'long',
        });
      }
    } else {
      li.style.display = 'none';
    }
  });

  const hourlyCards = document.querySelectorAll('.hourly-cards .hour-card');
  const hourlyForecasts = obj.list.slice(0, hourlyCards.length);

  hourlyCards.forEach((card, index) => {
    if (hourlyForecasts[index]) {
      const hourData = hourlyForecasts[index];
      const timeElement = card.querySelector('time');
      const iconElement = card.querySelector('.icon');
      const tempElement = card.querySelector('.temp');
      const windElement = card.querySelector('.wind');

      const forecastDate = new Date(hourData.dt * 1000);

      if (timeElement)
        timeElement.textContent = forecastDate.toLocaleTimeString('uk-UA', {
          hour: '2-digit',
          minute: '2-digit',
        });
      if (iconElement)
        iconElement.innerHTML = `<img src="https://openweathermap.org/img/wn/${hourData.weather[0].icon}.png" alt="Weather icon"/>`;
      if (tempElement)
        tempElement.textContent = `${roundNum(hourData.main.temp)}°C`;
      if (windElement)
        windElement.textContent = `${roundNum(hourData.wind.speed)} км/г`;
    } else {
      card.style.display = 'none';
    }
  });
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

function clock_2() {
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (hours < 10) hours = '0' + hours;
  if (minutes < 10) minutes = '0' + minutes;

  let str = hours + ':' + minutes;

  contLocationTime.querySelector('.current-time').innerHTML = str;
  setTimeout(clock_2, 1000);
}

function dateNow() {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('uk-UA', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });
  contLocationTime.querySelector('.current-date').textContent = formattedDate;
}
