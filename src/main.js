import './js/slider';

const API_KEY = '7a2dfcb51e1141c71771f685e7f4e2df';

const coordinatesOptions = {
  city: 'Старий Мерчик',
  limit: 5,
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
  .then(data => {
    const options = {
      lat: data[0].lat,
      lon: data[0].lon,
      lang: 'ua, uk',
      units: 'metric',
    };
    console.log(data);
    console.log(data[0].lat);
    console.log(data[0].lon);

    getCoordinates(options)
      .then(data => {
        console.log(data);
      })
      .catch(error => console.log(error));
  })
  .catch(error => console.log(error));

function getCoordinates(options) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${options.lat}&lon=${options.lon}&appid=${API_KEY}&lang=${options.lang}&units=${options.units}`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
