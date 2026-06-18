# 🌦️ SkyShield

### Weather Forecast & Disaster Alert System

**Developer:** Aanya Gupta | Class 9B | 2026

---

## Overview

SkyShield is a web-based weather forecast and disaster alert application.
It provides real-time weather information for any city worldwide and
automatically generates disaster alerts based on live weather conditions.

---

## Features

- Real-time weather data for any city worldwide
- Displays temperature, humidity, wind speed, feels like, visibility, sunrise and sunset
- 5-day weather forecast with day-wise breakdown
- Automatic disaster alert system based on IMD guidelines:

| Alert                 | Trigger Condition            |
| --------------------- | ---------------------------- |
| 🌀 Cyclone Warning    | Wind speed > 60 km/h         |
| 🌊 Flood Alert        | Heavy rainfall detected      |
| 🔥 Heatwave Alert     | Temperature > 45°C           |
| 🥶 Cold Wave Warning  | Temperature < 2°C            |
| 🌫️ Dense Fog Warning  | Visibility < 1 km            |
| ⛈️ Thunderstorm Alert | Active thunderstorm detected |
| ✅ All Clear          | Normal weather conditions    |

- Dynamic background that changes with weather condition (clear, rain, snow, fog, storm, night)
- Search history — remembers last 3 searched cities for quick access
- Loading spinner during data fetch
- Custom error messages for invalid city names
- Quick links to NDMA, IMD and SACHET disaster portals
- Fully responsive design for mobile devices

---

## Tech Stack

| Technology           | Purpose                                          |
| -------------------- | ------------------------------------------------ |
| HTML                 | Application structure                            |
| CSS                  | Styling, animations and responsive layout        |
| JavaScript           | Logic, API integration and disaster alert engine |
| OpenWeatherMap API   | Live weather and 5-day forecast data             |
| Browser localStorage | Search history persistence                       |
| GitHub Pages         | Hosting                                          |

---

## Project Structure

```
SkyShield/
├── index.html   → Application structure
├── style.css    → Styling and animations
├── app.js       → JavaScript logic and API calls
└── README.md    → Project documentation
---

## How It Works

1. User enters a city name and clicks Search (or presses Enter)
2. App fetches live weather data from OpenWeatherMap's current weather API
3. App fetches 5-day forecast data from OpenWeatherMap's forecast API
4. Weather data is checked against IMD-based threshold rules to determine disaster alerts
5. Background gradient updates dynamically based on weather condition and time of day
6. Successful searches are saved to browser local storage as recent search history

---

## Live Demo

🔗 [SkyShield — Live App](https://aanyagupta9.github.io/skyshield)

---

## Data Source

Weather data powered by [OpenWeatherMap](https://openweathermap.org) API.
Disaster alert thresholds based on [IMD](https://mausam.imd.gov.in) guidelines.

---

*SkyShield | School Project | 2026*
=======
```
