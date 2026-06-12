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
- Displays temperature, humidity, wind speed, feels like and visibility
- 5-day weather forecast
- Automatic disaster alert system based on IMD guidelines:

| Alert | Trigger Condition |
|---|---|
| 🌀 Cyclone Warning | Wind speed > 60 km/h |
| 🌊 Flood Alert | Heavy rainfall detected |
| 🔥 Heatwave Alert | Temperature > 45°C |
| 🥶 Cold Wave Warning | Temperature < 2°C |
| 🌫️ Dense Fog Warning | Visibility < 200 metres |
| ✅ All Clear | Normal weather conditions |

- Quick links to NDMA, IMD and SACHET disaster portals

---

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML | Application structure |
| CSS | Styling and animations |
| JavaScript | Logic and API integration |
| OpenWeatherMap API | Live weather data |
| GitHub Pages | Hosting |

---

## Project Structure

```
SkyShield/
├── index.html   → Application structure
├── style.css    → Styling and animations
├── app.js       → JavaScript logic and API calls
└── README.md    → Project documentation
```

---

## Live Demo

🔗 [SkyShield — Live App](https://aanyagupta9.github.io/SkyShield)

---

## Data Source

Weather data powered by [OpenWeatherMap](https://openweathermap.org) API.
Disaster alert thresholds based on
[IMD](https://mausam.imd.gov.in) guidelines.

---

*SkyShield | School Project | 2026*