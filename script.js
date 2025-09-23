const key = '637e619566e6dd275f2ada8670356e02';
const params = new URLSearchParams(location.search);
const city = params.get('city');

if (!city) location.href = 'index.html';

const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => document.body.classList.toggle('dark'));

async function getWeather() {
  const [current, forecast] = await Promise.all([
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`).then(r => r.json()),
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&units=metric`).then(r => r.json())
  ]);

  if (current.cod === '404') {
    document.getElementById('cityName').textContent = 'City not found';
    return;
  }

  // current
  document.getElementById('cityName').textContent = `${current.name}, ${current.sys.country}`;
  document.getElementById('temperature').textContent = `${Math.round(current.main.temp)}°C`;
  document.getElementById('condition').textContent = current.weather[0].description;
  document.getElementById('humidity').textContent = `${current.main.humidity}%`;
  document.getElementById('wind').textContent = `${current.wind.speed} km/h`;
  document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;

  // background
  const main = current.weather[0].main.toLowerCase();
  const gradients = {
    clear: 'linear-gradient(135deg, #43cea2, #185a9d)',
    clouds: 'linear-gradient(135deg, #bdc3c7, #2c3e50)',
    rain: 'linear-gradient(135deg, #3a7bd5, #3a6073)',
    snow: 'linear-gradient(135deg, #e6dada, #274046)',
    thunderstorm: 'linear-gradient(135deg, #141e30, #243b55)',
    drizzle: 'linear-gradient(135deg, #4b79a1, #283e51)',
    mist: 'linear-gradient(135deg, #606c88, #3f4c6b)'
  };
  document.body.style.background = gradients[main] || gradients.clear;

  // 5-day forecast
  const list = forecast.list.filter((_, i) => i % 8 === 0).slice(0, 5);
  document.getElementById('forecast').innerHTML = list.map(item => `
    <div class="forecast-day">
      <p>${new Date(item.dt * 1000).toLocaleDateString(undefined, { weekday: 'short' })}</p>
      <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
      <p>${Math.round(item.main.temp)}°C</p>
    </div>
  `).join('');
}

getWeather();
