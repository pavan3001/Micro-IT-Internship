const apiKey = "61d3bbc56610098398353ee43c5a751c"; // Your OpenWeatherMap API key
const mapApiKey = "AIzaSyDvUVxJdCZpAwpZdyFjgsu9vzFwdbRHmW0"; // Google Maps API key

const weatherOutput = document.getElementById("weatherOutput");
const forecastContainer = document.getElementById("forecast");
const alertBox = document.getElementById("alertBox");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const detectBtn = document.getElementById("detectBtn");

const celsiusBtn = document.getElementById("celsiusBtn");
const fahrenheitBtn = document.getElementById("fahrenheitBtn");

let map;
let marker;
let currentUnit = "metric"; // metric = Celsius, imperial = Fahrenheit

function showAlert(msg) {
  alertBox.style.display = "block";
  alertBox.textContent = msg;
  setTimeout(() => {
    alertBox.style.display = "none";
  }, 4000);
}

function initMap(lat = 51.5074, lon = -0.1278) {
  const pos = { lat, lng: lon };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: pos,
  });
  marker = new google.maps.Marker({
    position: pos,
    map,
  });
}

function updateMap(lat, lon) {
  const pos = { lat, lng: lon };
  map.setCenter(pos);
  marker.setPosition(pos);
}

async function fetchWeather(city) {
  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${currentUnit}&appid=${apiKey}`
    );
    if (!weatherRes.ok) throw new Error("City not found");
    const weatherData = await weatherRes.json();

    const { coord } = weatherData;
    updateMap(coord.lat, coord.lon);

    displayWeather(weatherData);

    await fetchForecast(coord.lat, coord.lon);

    weatherOutput.style.display = "block";
    forecastContainer.style.display = "flex";
  } catch (error) {
    showAlert(error.message);
  }
}

async function fetchForecast(lat, lon) {
  try {
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${apiKey}`
    );
    if (!forecastRes.ok) throw new Error("Forecast data not found");
    const forecastData = await forecastRes.json();

    displayForecast(forecastData);
  } catch (error) {
    showAlert(error.message);
  }
}

function displayWeather(data) {
  const dateObj = new Date(data.dt * 1000);
  const options = { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
  const dateString = dateObj.toLocaleString(undefined, options);

  const weatherHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p><small>${dateString}</small></p>
    <p style="font-size: 3rem; margin: 10px 0;">
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}" style="vertical-align: middle;"/>
      ${Math.round(data.main.temp)}°${currentUnit === "metric" ? "C" : "F"}
    </p>
    <p>Feels like ${Math.round(data.main.feels_like)}°. ${data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}.</p>
    <p>Wind: ${data.wind.speed} ${currentUnit === "metric" ? "m/s" : "mph"} ${data.wind.deg}° | Pressure: ${data.main.pressure} hPa</p>
    <p>Humidity: ${data.main.humidity}% | UV: N/A</p>
    <p>Dew point: N/A | Visibility: ${data.visibility / 1000} km</p>
  `;

  weatherOutput.innerHTML = weatherHTML;
}

function displayForecast(data) {
  // Get one forecast per day (around midday)
  const filtered = data.list.filter((item) => item.dt_txt.includes("12:00:00"));

  forecastContainer.innerHTML = "";

  filtered.slice(0, 5).forEach((day) => {
    const date = new Date(day.dt * 1000);
    const options = { weekday: "short", month: "short", day: "numeric" };
    const dateStr = date.toLocaleDateString(undefined, options);

    const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

    const html = `
      <div class="forecast-day">
        <p><strong>${dateStr}</strong></p>
        <img src="${iconUrl}" alt="${day.weather[0].description}" />
        <p>${Math.round(day.main.temp_max)}° / ${Math.round(day.main.temp_min)}°</p>
        <p>${day.weather[0].description}</p>
      </div>
    `;

    forecastContainer.insertAdjacentHTML("beforeend", html);
  });
}

searchBtn.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) {
    fetchWeather(city);
  } else {
    showAlert("Please enter a city name");
  }
});

detectBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    showAlert("Geolocation is not supported by your browser.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      updateMap(latitude, longitude);
      // Don't fetch weather or forecast on detect location
      weatherOutput.style.display = "none";
      forecastContainer.style.display = "none";
    },
    () => {
      showAlert("Unable to retrieve your location.");
    }
  );
});

celsiusBtn.addEventListener("click", () => {
  if (currentUnit !== "metric") {
    currentUnit = "metric";
    celsiusBtn.classList.add("active");
    fahrenheitBtn.classList.remove("active");
    // If weather displayed, refresh it for current city
    if (weatherOutput.style.display === "block") {
      fetchWeather(searchInput.value.trim());
    }
  }
});

fahrenheitBtn.addEventListener("click", () => {
  if (currentUnit !== "imperial") {
    currentUnit = "imperial";
    fahrenheitBtn.classList.add("active");
    celsiusBtn.classList.remove("active");
    if (weatherOutput.style.display === "block") {
      fetchWeather(searchInput.value.trim());
    }
  }
});

window.onload = () => {
  initMap();
  // No weather fetch here, so no weather/forecast visible initially
  
};
