// ================================
// SKYSHIELD_ - Main JavaScript
// Made by Aanya
// ================================

// Our API key from OpenWeatherMap
const API_KEY = "15cd93c4be335744cdcffd934725f46e";

// Base URL for weather API
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// ================================
// GET HTML ELEMENTS
// ================================
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherCard = document.getElementById('weather-card');
const alertBanner = document.getElementById('alert-banner');
const alertMessage = document.getElementById('alert-message');
const alertIcon = document.getElementById('alert-icon');
const forecastSection = document.getElementById('forecast-section');
const safetySection = document.getElementById('safety-section');

// ================================
// SEARCH BUTTON CLICK EVENT
// ================================

searchBtn.addEventListener('click', function() {
    const city = cityInput.value.trim();
    
    if (city === '') {
        alert('Please enter a city name!');
        return;
    }
    
    fetchWeather(city);
});

cityInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchBtn.click();
    }
});

// ================================
// FETCH WEATHER FUNCTION
// ================================

async function fetchWeather(city) {
    try {
        console.log("Calling API for:", city);
        
        const response = await fetch(
            `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error('City not found');
        }
        
        const data = await response.json();
        console.log("Weather data received:", data);
        
        displayWeather(data);
        
    } catch (error) {
        console.log("Error:", error.message);
        alert('City not found! Please check the spelling and try again.');
    }
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

    // Update HTML elements with real data
    document.getElementById('city-name').textContent = `${city}, ${country}`;
    document.getElementById('temperature').textContent = `${temp}°C`;
    document.getElementById('feels-like').textContent = `${feelsLike}°C`;
    document.getElementById('humidity').textContent = `${humidity}%`;
    document.getElementById('wind').textContent = `${windSpeed} km/h`;
    document.getElementById('visibility').textContent = `${visibility} km`;
    document.getElementById('description').textContent = description;
    document.getElementById('weather-icon').src = iconUrl;

    // Show the weather card
    weatherCard.classList.remove('hidden');
    safetySection.classList.remove('hidden');

    // Show date
    displayDate();

    // Check for disaster alerts
    checkAlerts(data);
}

// ================================
// DISPLAY DATE FUNCTION
// ================================

function displayDate() {
    const now = new Date();
    
    const days = [
        'Sunday', 'Monday', 'Tuesday', 
        'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];
    
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const dayName = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    document.getElementById('date').textContent = 
        `${dayName}, ${date} ${month} ${year}`;
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
        'alert-hidden', 
        'alert-danger', 
        'alert-warning', 
        'alert-safe'
    );

    // Check conditions and set alert
    if (windSpeed > 60) {
        alertIcon.textContent = '🌀';
        alertMessage.textContent = 
            `Cyclone Warning! Wind speed ${windSpeed} km/h — Stay indoors!`;
        alertBanner.classList.add('alert-danger');

    } else if (temp > 45) {
        alertIcon.textContent = '🔥';
        alertMessage.textContent = 
            `Heatwave Alert! Temperature ${temp}°C — Avoid going out!`;
        alertBanner.classList.add('alert-warning');

    } else if (temp < 2) {
        alertIcon.textContent = '🥶';
        alertMessage.textContent = 
            `Cold Wave Warning! Temperature ${temp}°C — Keep warm!`;
        alertBanner.classList.add('alert-warning');

    } else if (visibility < 1) {
        alertIcon.textContent = '🌫️';
        alertMessage.textContent = 
            `Dense Fog Warning! Visibility ${visibility} km — Drive carefully!`;
        alertBanner.classList.add('alert-warning');

    } else if (weatherMain === 'Thunderstorm') {
        alertIcon.textContent = '⛈️';
        alertMessage.textContent = 
            `Thunderstorm Alert! Stay indoors and away from trees!`;
        alertBanner.classList.add('alert-danger');

    } else if (weatherMain === 'Rain') {
        alertIcon.textContent = '🌧️';
        alertMessage.textContent = 
            `Heavy Rain Alert! Watch out for waterlogging and flooding!`;
        alertBanner.classList.add('alert-warning');

    } else {
        alertIcon.textContent = '✅';
        alertMessage.textContent = 
            `All Clear! Weather is safe in this area.`;
        alertBanner.classList.add('alert-safe');
    }
}