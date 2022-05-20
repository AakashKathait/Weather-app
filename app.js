window.onload = function () {
  const icon = document.querySelector(".icon");
  const bgImage = document.querySelector(".first-panel");
  const description = document.querySelector(".description");
  const temp = document.querySelector(".deg");
  const cityName = document.querySelector(".city-name");
  const windSpeed = document.querySelector(".wind-js");
  const humidityClass = document.querySelector(".humidity-js");
  const feelsLikeClass = document.querySelector(".feels-like-js");
  const uvClass = document.querySelector(".UV-js");
  const searchInput = document.querySelector("#search");
  const searchButton = document.querySelector(".search-btn");
  var unsplashKey = config.IMAGE_KEY;
  var weatherKey = config.WEATHER_KEY;

  let lat;
  let long;

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
  }
  function showPosition(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;

    let currentLocationApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&appid=${weatherKey}`;

    fetch(currentLocationApi)
      .then((response) => response.json())
      .then((data) => {
        let temperature = `${Math.round(data.current.temp)}°C`;
        let desc = data.current.weather[0].description;
        let city = data.timezone;
        let feelsLike = `${Math.round(data.current.feels_like)}°C`;
        let uv = data.current.uvi;
        let wind = `${Math.round((data.current.wind_speed * 18) / 5)} km/hr`;
        let humidity = `${data.current.humidity}%`;

        description.innerHTML = desc.toUpperCase();
        cityName.innerHTML = city;
        temp.innerHTML = temperature;
        feelsLikeClass.innerHTML = feelsLike;
        humidityClass.innerHTML = humidity;
        windSpeed.innerHTML = wind;
        uvIndex(uvClass, uv);

        icon.src = `https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;

        let imageApi = `https://api.unsplash.com/search/photos?photos?page=1&query=${city}&orientation=portrait&count=5&client_id=${unsplashKey}`;

        fetch(imageApi)
          .then((response) => response.json())
          .then((data) => {
            let randomNum = Math.floor(Math.random() * 6);
            let image = data.results[randomNum].urls.raw;
            bgImage.style.backgroundImage = `url(${image})`;
          });
      });
  }

  searchInput.addEventListener("search", searchWeather);
  searchButton.addEventListener("click", searchWeather);

  function searchWeather() {
    let searchApi = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&units=metric&appid=${weatherKey}`;
    fetch(searchApi)
      .then((response) => response.json())
      .then((data) => {
        if (data.cod == 404) {
          description.innerHTML = `City not found`;
          cityName.innerHTML = `--`;
          temp.innerHTML = ``;
          feelsLikeClass.innerHTML = `--`;
          humidityClass.innerHTML = `--`;
          windSpeed.innerHTML = `--`;
          uvClass.innerHTML = `--`;
          icon.src = `./error-404.png`;

          fetch(
            `https://api.unsplash.com/search/photos?photos?page=1&query=not found&orientation=portrait&client_id=${unsplashKey}`
          )
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              let image = data.results[0].urls.raw;
              bgImage.style.backgroundImage = `url(${image})`;
            });
        }

        if (data) {
          let long = data.coord.lon;
          let lat = data.coord.lat;
          let currentLocationApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&appid=${weatherKey}`;

          async function wait() {
            let call = await fetch(currentLocationApi);
            let getResponse = await call.json();
            let temperature = `${Math.round(getResponse.current.temp)}°C`;
            let desc = getResponse.current.weather[0].description;
            let city = getResponse.timezone;
            let feelsLike = `${Math.round(getResponse.current.feels_like)}°C`;
            let uv = getResponse.current.uvi;
            let wind = `${Math.round(
              (getResponse.current.wind_speed * 18) / 5
            )} km/hr`;
            let humidity = `${getResponse.current.humidity}%`;

            description.innerHTML = desc.toUpperCase();
            cityName.innerHTML = searchInput.value.toUpperCase();
            temp.innerHTML = temperature;
            feelsLikeClass.innerHTML = feelsLike;
            humidityClass.innerHTML = humidity;
            windSpeed.innerHTML = wind;
            icon.src = `https://openweathermap.org/img/wn/${getResponse.current.weather[0].icon}@2x.png`;
            uvIndex(uvClass, uv);

            let imageApi = `https://api.unsplash.com/search/photos?photos?page=1&query=${searchInput.value}&orientation=portrait&count=5&client_id=${unsplashKey}`;
            fetch(imageApi)
              .then((response) => response.json())
              .then((data) => {
                let randomNum = Math.floor(Math.random() * 6);
                let image = data.results[randomNum].urls.raw;
                bgImage.style.backgroundImage = `url(${image})`;
                searchInput.value = "";
              });
          }
          wait();
        }
      });
  }

  function uvIndex(element, uv) {
    if (uv < 2) {
      element.innerHTML = `${uv} <h5>(Low)<h5/>`;
    } else if (uv < 5 && uv > 3) {
      element.innerHTML = `${uv} <h5>(Moderate)<h5/>`;
    } else if (uv < 7 && uv > 6) {
      element.innerHTML = `${uv} <h5>(High)<h5/>`;
    } else if (uv < 10 && uv > 8) {
      element.innerHTML = `${uv} <h5>(Very High)<h5/>`;
    } else if (uv > 11) {
      element.innerHTML = `${uv} <h5>(Extreme)<h5/>`;
    }
  }

  getLocation();
};
