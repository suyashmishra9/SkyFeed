import { StyleSheet, View } from 'react-native';
import { IconSymbol } from './icon-symbol';

export function WeatherIcon({ iconCode, size = 60, color = '#007AFF' }) {
  const getWeatherIcon = (code) => {
    const iconMap = {
      '01d': 'sun.max.fill',
      '01n': 'moon.fill',
      '02d': 'cloud.sun.fill',
      '02n': 'cloud.moon.fill',
      '03d': 'cloud.fill',
      '03n': 'cloud.fill',
      '04d': 'cloud.fill',
      '04n': 'cloud.fill',
      '09d': 'cloud.rain.fill',
      '09n': 'cloud.rain.fill',
      '10d': 'cloud.sun.rain.fill',
      '10n': 'cloud.moon.rain.fill',
      '11d': 'cloud.bolt.fill',
      '11n': 'cloud.bolt.fill',
      '13d': 'cloud.snow.fill',
      '13n': 'cloud.snow.fill',
      '50d': 'cloud.fog.fill',
      '50n': 'cloud.fog.fill',
    };
    return iconMap[code] || 'cloud.fill';
  };

  const getWeatherColor = (code) => {
    const colorMap = {
      '01d': '#FFD700', // Sun
      '01n': '#4169E1', // Moon
      '02d': '#87CEEB', // Partly cloudy day
      '02n': '#708090', // Partly cloudy night
      '03d': '#B0C4DE', // Cloudy
      '03n': '#708090', // Cloudy night
      '04d': '#A9A9A9', // Overcast
      '04n': '#696969', // Overcast night
      '09d': '#4682B4', // Rain
      '09n': '#2F4F4F', // Rain night
      '10d': '#4682B4', // Rain with sun
      '10n': '#2F4F4F', // Rain with moon
      '11d': '#FF6347', // Thunderstorm
      '11n': '#DC143C', // Thunderstorm night
      '13d': '#F0F8FF', // Snow
      '13n': '#E6E6FA', // Snow night
      '50d': '#D3D3D3', // Fog
      '50n': '#A9A9A9', // Fog night
    };
    return colorMap[code] || color;
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <IconSymbol
        name={getWeatherIcon(iconCode)}
        size={size * 0.8}
        color={getWeatherColor(iconCode)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});


