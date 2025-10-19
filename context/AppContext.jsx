import * as Location from 'expo-location';
import { createContext, useContext, useEffect, useReducer } from 'react';
import { NewsService } from '../services/newsService';
import { WeatherService } from '../services/weatherService';

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  const initialState = {
    // Weather data
    weather: null,
    forecast: [],
    weatherLoading: false,
    weatherError: null,
    
    // News data
    news: [],
    newsLoading: false,
    newsError: null,
    
    // Settings
    temperatureUnit: 'metric',
    selectedNewsCategories: [],
    
    // Location
    location: null,
    locationError: null,
  };

  function appReducer(state, action) {
    switch (action.type) {
      case 'SET_WEATHER_LOADING':
        return { ...state, weatherLoading: action.payload, weatherError: null };
      case 'SET_WEATHER_DATA':
        return { 
          ...state, 
          weather: action.payload.weather, 
          forecast: action.payload.forecast,
          weatherLoading: false,
          weatherError: null
        };
      case 'SET_WEATHER_ERROR':
        return { ...state, weatherError: action.payload, weatherLoading: false };
      case 'SET_NEWS_LOADING':
        return { ...state, newsLoading: action.payload, newsError: null };
      case 'SET_NEWS_DATA':
        return { ...state, news: action.payload, newsLoading: false, newsError: null };
      case 'SET_NEWS_ERROR':
        return { ...state, newsError: action.payload, newsLoading: false };
      case 'SET_TEMPERATURE_UNIT':
        return { ...state, temperatureUnit: action.payload };
      case 'SET_NEWS_CATEGORIES':
        return { ...state, selectedNewsCategories: action.payload };
      case 'SET_LOCATION':
        return { ...state, location: action.payload, locationError: null };
      case 'SET_LOCATION_ERROR':
        return { ...state, locationError: action.payload };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(appReducer, initialState);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        dispatch({ type: 'SET_LOCATION_ERROR', payload: 'Location permission denied' });
        return false;
      }
      return true;
    } catch (error) {
      dispatch({ type: 'SET_LOCATION_ERROR', payload: 'Failed to request location permission' });
      return false;
    }
  };

  const fetchWeatherData = async () => {
    if (!state.location) {
      dispatch({ type: 'SET_WEATHER_ERROR', payload: 'Location not available' });
      return;
    }

    try {
      dispatch({ type: 'SET_WEATHER_LOADING', payload: true });
      const weatherData = await WeatherService.getWeatherByLocation(
        state.location.latitude,
        state.location.longitude,
        state.temperatureUnit
      );
      dispatch({ 
        type: 'SET_WEATHER_DATA', 
        payload: { 
          weather: weatherData.current, 
          forecast: weatherData.forecast 
        } 
      });
    } catch (error) {
      dispatch({ 
        type: 'SET_WEATHER_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to fetch weather data' 
      });
    }
  };

  const fetchNewsData = async () => {
    try {
      dispatch({ type: 'SET_NEWS_LOADING', payload: true });
      
      let newsData = [];
      
      if (state.weather) {
        // Use weather-based filtering
        const weatherCategory = WeatherService.getWeatherCategory(
          state.weather.temperature, 
          state.weather.condition
        );
        newsData = await NewsService.getWeatherBasedNews(weatherCategory);
      } else {
        // Use selected categories or fallback to general headlines
        if (state.selectedNewsCategories && state.selectedNewsCategories.length > 0) {
          // Fetch news for each selected category
          const allNews = [];
          for (const category of state.selectedNewsCategories) {
            try {
              const categoryNews = await NewsService.getNewsHeadlines(category);
              allNews.push(...categoryNews.slice(0, 5)); // Limit to 5 articles per category
            } catch (error) {
              console.warn(`Failed to fetch news for category ${category}:`, error);
            }
          }
          newsData = allNews;
        } else {
          // Fallback to general headlines
          newsData = await NewsService.getNewsHeadlines();
        }
      }
      
      dispatch({ type: 'SET_NEWS_DATA', payload: newsData });
    } catch (error) {
      dispatch({ 
        type: 'SET_NEWS_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to fetch news data' 
      });
    }
  };

  // Initialize location and fetch data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const hasPermission = await requestLocationPermission();
        if (hasPermission) {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          });
          dispatch({ 
            type: 'SET_LOCATION', 
            payload: { 
              latitude: location.coords.latitude, 
              longitude: location.coords.longitude 
            } 
          });
        } else {
          // Fallback to default location (New York) if permission denied
          dispatch({ 
            type: 'SET_LOCATION', 
            payload: { 
              latitude: 40.7128, 
              longitude: -74.0060 
            } 
          });
        }
      } catch (error) {
        console.log('Location error:', error);
        // Fallback to default location
        dispatch({ 
          type: 'SET_LOCATION', 
          payload: { 
            latitude: 40.7128, 
            longitude: -74.0060 
          } 
        });
      }
    };

    initializeApp();
  }, []);

  // Fetch weather data when location changes
  useEffect(() => {
    if (state.location) {
      fetchWeatherData();
    }
  }, [state.location, state.temperatureUnit]);

  // Fetch news data when weather changes
  useEffect(() => {
    if (state.weather) {
      fetchNewsData();
    }
  }, [state.weather]);

  // Fetch news data when categories change (only if no weather-based filtering)
  useEffect(() => {
    if (!state.weather && state.selectedNewsCategories) {
      fetchNewsData();
    }
  }, [state.selectedNewsCategories]);

  const value = {
    state,
    dispatch,
    fetchWeatherData,
    fetchNewsData,
    requestLocationPermission,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
