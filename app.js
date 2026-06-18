// ================================
// SKYSHIELD - Main JavaScript
// Made by Aanya
// ================================

// Our API key from OpenWeatherMap
const API_KEY = "15cd93c4be335744cdcffd934725f46e";

// Base URL for weather API
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// ================================
// GET HTML ELEMENTS
// ================================
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherCard = document.getElementById("weather-card");
const alertBanner = document.getElementById("alert-banner");
const alertMessage = document.getElementById("alert-message");
const alertIcon = document.getElementById("alert-icon");
const forecastSection = document.getElementById("forecast-section");
const safetySection = document.getElementById("safety-section");
const loadSpinner = document.getElementById("loading-spinner");

// ================================
// ERROR HANDLING
// ================================

function showError(message) {
  const errorDiv = document.getElementById("error-message");
  const errorText = document.getElementById("error-text");
  errorText.textContent = message;
  errorDiv.classList.remove("hidden");

  // Auto hide after 4 seconds
  setTimeout(() => {
    errorDiv.classList.add("hidden");
  }, 4000);
}

function hideError() {
  document.getElementById("error-message").classList.add("hidden");
}
// ================================
// SEARCH BUTTON CLICK EVENT
// ================================

searchBtn.addEventListener("click", function () {
  const city = cityInput.value.trim();

  weatherCard.classList.add("hidden");
  forecastSection.classList.add("hidden");
  alertBanner.classList.add("alert-hidden");
  safetySection.classList.add("hidden");
  hideError();
  if (city === "") {
    showError("Please enter a city name!");
    return;
  }

  fetchWeather(city);
  fetchForecast(city);
});

cityInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});

// ================================
// FETCH WEATHER FUNCTION
// ================================

async function fetchWeather(city) {
  try {
    // Show spinner, hide old data
    loadSpinner.classList.remove("hidden");

    console.log("Calling API for:", city);

    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`,
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();
    console.log("Weather data received:", data);

    // Hide spinner
    loadSpinner.classList.add("hidden");
    saveToHistory(city);
    displayWeather(data);
  } catch (error) {
    // Hide spinner
    loadSpinner.classList.add("hidden");
    console.log("Error:", error.message);
    showError("City not found! Please check the spelling and try again.");
  }
}

// ================================
// WEATHER EMOJI FUNCTION
// ================================

function getWeatherEmoji(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return "⛈️"; // Thunderstorm
  if (weatherId >= 300 && weatherId < 400) return "🌦️"; // Drizzle
  if (weatherId >= 500 && weatherId < 600) return "🌧️"; // Rain
  if (weatherId >= 600 && weatherId < 700) return "❄️"; // Snow
  if (weatherId >= 700 && weatherId < 800) return "🌫️"; // Fog/Mist
  if (weatherId === 800) return "☀️"; // Clear sky
  if (weatherId === 801) return "🌤️"; // Few clouds
  if (weatherId === 802) return "⛅"; // Scattered clouds
  if (weatherId >= 803) return "☁️"; // Overcast
  return "🌡️"; // Default
}

// ================================
// DISPLAY WEATHER FUNCTION
// ================================

function displayWeather(data) {
  // Extract data from API response
  const city = data.name;
  const country = data.sys.country;
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const humidity = data.main.humidity;
  const windSpeed = Math.round(data.wind.speed * 3.6);
  const visibility = Math.round(data.visibility / 1000);
  const description = data.weather[0].description;
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const weatherId = data.weather[0].id;
  const weatherEmoji = getWeatherEmoji(weatherId);

  // Update HTML elements with real data
  document.getElementById("city-name").textContent = country
    ? `${city}, ${country}`
    : city;
  document.getElementById("temperature").textContent = `${temp}°C`;
  document.getElementById("feels-like").textContent = `${feelsLike}°C`;
  document.getElementById("humidity").textContent = `${humidity}%`;
  document.getElementById("wind").textContent = `${windSpeed} km/h`;
  document.getElementById("visibility").textContent = `${visibility} km`;
  document.getElementById("description").textContent =
    `${weatherEmoji} ${description}`;

  // Show the weather card
  weatherCard.classList.remove("hidden");
  safetySection.classList.remove("hidden");

  // Show date
  displayDate();

  // Show sunrise and sunset
  displaySunriseSunset(data);

  // Check for disaster alerts
  checkAlerts(data);

  // Set dynamic background
  setDynamicBackground(weatherId, iconCode);
}

// ================================
// DISPLAY DATE FUNCTION
// ================================

function displayDate() {
  const now = new Date();

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayName = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();

  document.getElementById("date").textContent =
    `${dayName}, ${date} ${month} ${year}`;
}

// ================================
// SUNRISE & SUNSET
// ================================

function displaySunriseSunset(data) {
  const sunrise = data.sys.sunrise;
  const sunset = data.sys.sunset;
  const timezone = data.timezone;

  const sunriseTime = new Date((sunrise + timezone) * 1000)
    .toUTCString()
    .slice(17, 22);

  const sunsetTime = new Date((sunset + timezone) * 1000)
    .toUTCString()
    .slice(17, 22);

  document.getElementById("sunrise").textContent = `🌅 ${sunriseTime}`;
  document.getElementById("sunset").textContent = `🌇 ${sunsetTime}`;
}

// ================================
// DISASTER ALERT CHECKER
// ================================

function checkAlerts(data) {
  const windSpeed = Math.round(data.wind.speed * 3.6);
  const temp = Math.round(data.main.temp);
  const visibility = Math.round(data.visibility / 1000);
  const weatherMain = data.weather[0].main;

  // Remove all previous alert classes
  alertBanner.classList.remove(
    "alert-hidden",
    "alert-danger",
    "alert-warning",
    "alert-safe",
  );

  // Check conditions and set alert
  if (windSpeed > 60) {
    alertIcon.textContent = "🌀";
    alertMessage.textContent = `Cyclone Warning! Wind speed ${windSpeed} km/h — Stay indoors!`;
    alertBanner.classList.add("alert-danger");
  } else if (temp > 45) {
    alertIcon.textContent = "🔥";
    alertMessage.textContent = `Heatwave Alert! Temperature ${temp}°C — Avoid going out!`;
    alertBanner.classList.add("alert-warning");
  } else if (temp < 2) {
    alertIcon.textContent = "🥶";
    alertMessage.textContent = `Cold Wave Warning! Temperature ${temp}°C — Keep warm!`;
    alertBanner.classList.add("alert-warning");
  } else if (visibility < 1) {
    alertIcon.textContent = "🌫️";
    alertMessage.textContent = `Dense Fog Warning! Visibility ${visibility} km — Drive carefully!`;
    alertBanner.classList.add("alert-warning");
  } else if (weatherMain === "Thunderstorm") {
    alertIcon.textContent = "⛈️";
    alertMessage.textContent = `Thunderstorm Alert! Stay indoors and away from trees!`;
    alertBanner.classList.add("alert-danger");
  } else if (weatherMain === "Rain") {
    alertIcon.textContent = "🌧️";
    alertMessage.textContent = `Heavy Rain Alert! Watch out for waterlogging and flooding!`;
    alertBanner.classList.add("alert-warning");
  } else {
    alertIcon.textContent = "✅";
    alertMessage.textContent = `All Clear! Weather is safe in this area.`;
    alertBanner.classList.add("alert-safe");
  }
}

// ================================
// DYNAMIC BACKGROUND
// ================================

function setDynamicBackground(weatherId, iconCode) {
  const isNight = iconCode.includes("n");
  let gradient = "";

  if (isNight) {
    gradient = "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)";
  } else if (weatherId >= 200 && weatherId < 300) {
    // Thunderstorm
    gradient = "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)";
  } else if (weatherId >= 300 && weatherId < 600) {
    // Rain/Drizzle
    gradient = "linear-gradient(135deg, #373b44 0%, #4286f4 50%, #373b44 100%)";
  } else if (weatherId >= 600 && weatherId < 700) {
    // Snow
    gradient = "linear-gradient(135deg, #e0eafc 0%, #cfdef3 50%, #e0eafc 100%)";
  } else if (weatherId >= 700 && weatherId < 800) {
    // Fog/Mist
    gradient = "linear-gradient(135deg, #606c88 0%, #3f4c6b 50%, #606c88 100%)";
  } else if (weatherId === 800) {
    // Clear sky
    gradient = "linear-gradient(135deg, #1a73e8 0%, #0d47a1 50%, #1a1a2e 100%)";
  } else {
    // Cloudy
    gradient = "linear-gradient(135deg, #4b6cb7 0%, #182848 50%, #4b6cb7 100%)";
  }

  document.body.style.background = gradient;
  document.body.style.color =
    weatherId >= 600 && weatherId < 700 && !isNight ? "#1a1a2e" : "#ffffff";
}

// ================================
// FETCH 5-DAY FORECAST
// ================================

async function fetchForecast(city) {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`,
    );

    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    console.log("Forecast error:", error);
  }
}

// ================================
// DISPLAY FORECAST FUNCTION
// ================================

function displayForecast(data) {
  const forecastCards = document.getElementById("forecast-cards");
  forecastCards.innerHTML = "";

  const dailyData = {};

  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    const today = new Date().toISOString().split("T")[0];

    if (date !== today && !dailyData[date]) {
      dailyData[date] = item;
    }
  });

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  Object.values(dailyData)
    .slice(0, 5)
    .forEach((item) => {
      const date = new Date(item.dt_txt);
      const dayName = days[date.getDay()];
      const dateNum = date.getDate();
      const month = months[date.getMonth()];
      const temp = Math.round(item.main.temp);
      const weatherId = item.weather[0].id;
      const emoji = getWeatherEmoji(weatherId);
      const desc = item.weather[0].description;

      const card = document.createElement("div");
      card.className = "forecast-card";
      card.innerHTML = `
            <div class="forecast-day">${dayName}</div>
            <div class="forecast-date">${dateNum} ${month}</div>
            <div style="font-size:28px">${emoji}</div>
            <div class="forecast-temp">${temp}°C</div>
            <div class="forecast-desc">${desc}</div>
        `;

      forecastCards.appendChild(card);
    });

  forecastSection.classList.remove("hidden");
}

// ================================
// SEARCH HISTORY
// ================================

function saveToHistory(city) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

  // Remove if already exists
  history = history.filter((c) => c.toLowerCase() !== city.toLowerCase());

  // Add to beginning
  history.unshift(city);

  // Keep only last 3
  history = history.slice(0, 3);

  // Save back to localStorage
  localStorage.setItem("searchHistory", JSON.stringify(history));

  // Update display
  displayHistory();
}

function displayHistory() {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  const historyDiv = document.getElementById("search-history");
  const historyButtons = document.getElementById("history-buttons");

  if (history.length === 0) {
    historyDiv.classList.add("hidden");
    return;
  }

  historyDiv.classList.remove("hidden");
  historyButtons.innerHTML = "";

  history.forEach((city) => {
    const btn = document.createElement("button");
    btn.className = "history-btn";
    btn.textContent = city;
    btn.style.cssText = `
    padding: 4px 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 11px;
    font-family: Poppins, sans-serif;
    cursor: pointer;
    margin: 3px;
`;
    btn.onclick = () => {
      cityInput.value = city;
      searchBtn.click();
    };
    historyButtons.appendChild(btn);
  });
}

// ================================
// LOAD HISTORY ON PAGE START
// ================================
displayHistory();
