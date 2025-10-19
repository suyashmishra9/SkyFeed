const OPENWEATHER_API_KEY = '4e93f951ae2623d3d70c9e14f7f598c3';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export class WeatherService {
  static async getCurrentWeather(lat, lon, units = 'metric') {
    try {
      const response = await fetch(
        `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=${units}`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon,
        city: data.name,
        country: data.sys.country,
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  static async getFiveDayForecast(lat, lon, units = 'metric') {
    try {
      const response = await fetch(
        `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=${units}`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Group forecast by day and get daily max/min
      const dailyForecasts = {};
      
      data.list.forEach((item) => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyForecasts[date]) {
          dailyForecasts[date] = {
            date,
            temperatures: [],
            conditions: [],
            descriptions: [],
            icons: [],
          };
        }
        dailyForecasts[date].temperatures.push(item.main.temp);
        dailyForecasts[date].conditions.push(item.weather[0].main);
        dailyForecasts[date].descriptions.push(item.weather[0].description);
        dailyForecasts[date].icons.push(item.weather[0].icon);
      });
      
      // Convert to ForecastData array (next 5 days)
      const forecast = Object.values(dailyForecasts)
        .slice(1, 6) // Skip today, get next 5 days
        .map((day) => ({
          date: day.date,
          temperature: Math.round(Math.max(...day.temperatures)),
          condition: day.conditions[0], // Use first condition of the day
          description: day.descriptions[0],
          icon: day.icons[0],
        }));
      
      return forecast;
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      throw error;
    }
  }

  static async getWeatherByLocation(lat, lon, units = 'metric') {
    try {
      const [current, forecast] = await Promise.all([
        this.getCurrentWeather(lat, lon, units),
        this.getFiveDayForecast(lat, lon, units),
      ]);
      
      return {
        current,
        forecast,
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  static getWeatherCategory(temperature, condition) {
    if (temperature < 10) {
      return 'cold';
    } else if (temperature > 25) {
      return 'hot';
    } else {
      return 'cool';
    }
  }
}
