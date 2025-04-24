import {
  Sun,
  Cloud,
  CloudRain,
  CloudFog,
  CloudSnow,
  CloudLightning,
  CloudRainWind,
  CloudDrizzle,
  CloudSun
} from 'lucide-react'

export function celsiusToFahrenheit (celsius) {
  return (celsius * 9) / 5 + 32
}

export const getWeatherInfo = code => {
  const weatherCodes = {
    0: { description: 'Clear sky', icon: Sun, color: '#FFD700' }, // Yellow
    1: { description: 'Mainly clear', icon: Sun, color: '#FFD700' }, // Yellow
    2: { description: 'Partly cloudy', icon: CloudSun, color: '#87CEEB' }, // Sky Blue
    3: { description: 'Overcast', icon: Cloud, color: '#808080' }, // Gray
    45: { description: 'Fog', icon: CloudFog, color: '#D3D3D3' }, // Light Gray
    48: {
      description: 'Depositing rime fog',
      icon: CloudFog,
      color: '#D3D3D3'
    }, // Light Gray
    51: { description: 'Light drizzle', icon: CloudDrizzle, color: '#ADD8E6' }, // Light Blue
    53: {
      description: 'Moderate drizzle',
      icon: CloudDrizzle,
      color: '#ADD8E6'
    }, // Light Blue
    55: { description: 'Dense drizzle', icon: CloudDrizzle, color: '#4682B4' }, // Steel Blue
    56: {
      description: 'Light freezing drizzle',
      icon: CloudSnow,
      color: '#E0FFFF'
    }, // Light Cyan
    57: {
      description: 'Dense freezing drizzle',
      icon: CloudSnow,
      color: '#B0E0E6'
    }, // Powder Blue
    61: { description: 'Slight rain', icon: CloudRain, color: '#4682B4' }, // Steel Blue
    63: { description: 'Moderate rain', icon: CloudRain, color: '#4169E1' }, // Royal Blue
    65: { description: 'Heavy rain', icon: CloudRain, color: '#000080' }, // Navy
    66: {
      description: 'Light freezing rain',
      icon: CloudSnow,
      color: '#E0FFFF'
    }, // Light Cyan
    67: {
      description: 'Heavy freezing rain',
      icon: CloudSnow,
      color: '#B0E0E6'
    }, // Powder Blue
    71: { description: 'Slight snow fall', icon: CloudSnow, color: '#FFFFFF' }, // White
    73: {
      description: 'Moderate snow fall',
      icon: CloudSnow,
      color: '#B0E0E6'
    }, // White
    75: { description: 'Heavy snow fall', icon: CloudSnow, color: '#F0F8FF' }, // Alice Blue
    77: { description: 'Snow grains', icon: CloudSnow, color: '#F0FFFF' }, // Azure
    80: {
      description: 'Slight rain showers',
      icon: CloudRain,
      color: '#4682B4'
    }, // Steel Blue
    81: {
      description: 'Moderate rain showers',
      icon: CloudRain,
      color: '#4169E1'
    }, // Royal Blue
    82: {
      description: 'Violent rain showers',
      icon: CloudRainWind,
      color: '#191970'
    }, // Midnight Blue
    85: {
      description: 'Slight snow showers',
      icon: CloudSnow,
      color: '#FFFFFF'
    }, // White
    86: {
      description: 'Heavy snow showers',
      icon: CloudSnow,
      color: '#F0F8FF'
    }, // Alice Blue
    95: { description: 'Thunderstorm', icon: CloudLightning, color: '#4B0082' }, // Indigo
    96: {
      description: 'Thunderstorm with slight hail',
      icon: CloudLightning,
      color: '#4B0082' // Indigo
    },
    99: {
      description: 'Thunderstorm with heavy hail',
      icon: CloudLightning,
      color: '#191970' // Midnight Blue
    }
  }
  return (
    weatherCodes[code] || {
      description: 'Unknown',
      icon: Cloud,
      color: '#A9A9A9'
    }
  ) // Dark Gray for unknown
}

export const cities = [
  { city: 'Atlanta, GA', latitude: 33.749, longitude: -84.388 },
  { city: 'Boston, MA', latitude: 42.3601, longitude: -71.0589 },
  { city: 'Chicago, IL', latitude: 41.8781, longitude: -87.6298 },
  { city: 'Columbus, OH', latitude: 39.9612, longitude: -82.9988 },
  { city: 'Denver, CO', latitude: 39.7392, longitude: -104.9903 },
  { city: 'Houston, TX', latitude: 29.7604, longitude: -95.3698 },
  { city: 'Las Vegas, NV', latitude: 36.1699, longitude: -115.1398 },
  { city: 'Miami, FL', latitude: 25.7617, longitude: -80.1918 },
  { city: 'New Orleans, LA', latitude: 29.9511, longitude: -90.0715 },
  { city: 'New York, NY', latitude: 40.7128, longitude: -74.006 },
  { city: 'Philadelphia, PA', latitude: 39.9526, longitude: -75.1652 },
  { city: 'Phoenix, AZ', latitude: 33.4484, longitude: -112.074 },
  { city: 'Portland, OR', latitude: 45.5152, longitude: -122.6784 },
  { city: 'San Francisco, CA', latitude: 37.7749, longitude: -122.4194 },
  { city: 'Seattle, WA', latitude: 47.6062, longitude: -122.3321 }
]

export const LOCATION_SOURCES = {
  CITY: 'City',
  GEOLOCATION: 'Geolocation'
}

// You might want to add other constants here as well, such as:
export const VIEW_TYPES = {
  HOURLY: 'Hourly',
  DAILY: 'Daily'
}
