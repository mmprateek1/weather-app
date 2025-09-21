const apiKey = "637e619566e6dd275f2ada8670356e02"; 
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const suggestions = document.getElementById("suggestions");

// Elements
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherIcon = document.getElementById("weatherIcon");

// Fetch weather by city name
async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.cod === "404") {
    cityName.textContent = "City Not Found";
    temperature.textContent = "--°C";
    condition.textContent = "--";
    humidity.textContent = "--%";
    wind.textContent = "-- km/h";
    weatherIcon.src = "";
    return;
  }

  cityName.textContent = data.name;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  condition.textContent = data.weather[0].description;
  humidity.textContent = `${data.main.humidity}%`;
  wind.textContent = `${data.wind.speed} km/h`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

// Autocomplete city suggestions
async function getCitySuggestions(query) {
  if (!query) {
    suggestions.style.display = "none";
    return;
  }

  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  suggestions.innerHTML = "";
  if (data.length === 0) {
    suggestions.style.display = "none";
    return;
  }

  data.forEach(city => {
    const li = document.createElement("li");
    li.textContent = `${city.name}, ${city.country}`;
    li.addEventListener("click", () => {
      cityInput.value = `${city.name}`;
      suggestions.style.display = "none";
      getWeather(city.name);
    });
    suggestions.appendChild(li);
  });

  suggestions.style.display = "block";
}

// Search button click
searchBtn.addEventListener("click", () => {
  const city = cityInput.value;
  if (city) getWeather(city);
});

// Input typing → show suggestions
cityInput.addEventListener("input", () => {
  const query = cityInput.value;
  getCitySuggestions(query);
});

// Press Enter to search
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value;
    if (city) {
      suggestions.style.display = "none";
      getWeather(city);
    }
  }
});

// Hide suggestions when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-box")) {
    suggestions.style.display = "none";
  }
});

// Fetch weather by current location
function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      cityName.textContent = data.name;
      temperature.textContent = `${Math.round(data.main.temp)}°C`;
      condition.textContent = data.weather[0].description;
      humidity.textContent = `${data.main.humidity}%`;
      wind.textContent = `${data.wind.speed} km/h`;
      weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    });
  }
}

// Load current location weather on page load
window.onload = getLocationWeather;
