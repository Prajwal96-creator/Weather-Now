// src/api.js
const BASE = "https://api.open-meteo.com/v1/forecast";

/**
 * Fetch weather for given latitude and longitude (Open-Meteo)
 * Returns { current, days, timezone, raw }
 */
export async function fetchWeather(lat, lon) {
  const url =
    BASE +
    `?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(
      lon
    )}` +
    `&current_weather=true` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,windspeed_10m_max` +
    `&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Open-Meteo responded with ${res.status}`);
  }
  const data = await res.json();

  const current = data.current_weather
    ? {
        temperature: data.current_weather.temperature,
        windspeed: data.current_weather.windspeed,
        winddirection: data.current_weather.winddirection,
        weathercode: data.current_weather.weathercode,
        time: data.current_weather.time,
      }
    : null;

  const d = data.daily || {};
  const days = (d.time || []).map((t, i) => ({
    date: t,
    tmax: d.temperature_2m_max?.[i] ?? null,
    tmin: d.temperature_2m_min?.[i] ?? null,
    precipitation: d.precipitation_sum?.[i] ?? null,
    weathercode: d.weathercode?.[i] ?? null,
    windspeedMax: d.windspeed_10m_max?.[i] ?? null,
  }));

  return {
    current,
    days,
    timezone: data.timezone,
    raw: data,
  };
}

/** Small mapping for weather codes (Open-Meteo) */
export function describeWeatherCode(code) {
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return map[code] ?? `Code ${code}`;
}
