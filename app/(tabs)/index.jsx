import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useApp } from '@/context/AppContext';
import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const { state, fetchWeatherData, fetchNewsData } = useApp();

  const onRefresh = async () => {
    await Promise.all([fetchWeatherData(), fetchNewsData()]);
  };

  const getWeatherIcon = (iconCode) => {
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
    return iconMap[iconCode] || 'cloud.fill';
  };

  const getWeatherCategory = () => {
    if (!state.weather) return '';
    const temp = state.weather.temperature;
    if (temp < 10) return 'Cold - Showing depressing news';
    if (temp > 25) return 'Hot - Showing fear-related news';
    return 'Cool - Showing winning and happiness news';
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={state.weatherLoading || state.newsLoading} onRefresh={onRefresh} />
      }
    >
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>SkyFeed</ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>Weather & News Aggregator</ThemedText>
      </ThemedView>

      {/* Weather Section */}
      <ThemedView style={styles.weatherCard}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Current Weather</ThemedText>
        
        {state.weatherLoading ? (
          <ThemedView style={styles.loadingContainer}>
            <ThemedText>Loading weather...</ThemedText>
          </ThemedView>
        ) : state.weatherError ? (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{state.weatherError}</ThemedText>
            <TouchableOpacity style={styles.retryButton} onPress={fetchWeatherData}>
              <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ) : state.weather ? (
          <>
            <ThemedView style={styles.currentWeather}>
              <ThemedView style={styles.weatherMain}>
                <IconSymbol 
                  name={getWeatherIcon(state.weather.icon)} 
                  size={60} 
                  color="#007AFF" 
                />
                <ThemedView style={styles.temperatureContainer}>
                  <ThemedText type="title" style={styles.temperature}>
                    {state.weather.temperature}°{state.temperatureUnit === 'metric' ? 'C' : 'F'}
                  </ThemedText>
                  <ThemedText style={styles.condition}>{state.weather.description}</ThemedText>
                </ThemedView>
              </ThemedView>
              
              <ThemedView style={styles.weatherDetails}>
                <ThemedView style={styles.detailItem}>
                  <IconSymbol name="location.fill" size={16} color="#666" />
                  <ThemedText style={styles.detailText}>
                    {state.weather.city}, {state.weather.country}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.detailItem}>
                  <IconSymbol name="drop.fill" size={16} color="#666" />
                  <ThemedText style={styles.detailText}>{state.weather.humidity}%</ThemedText>
                </ThemedView>
                <ThemedView style={styles.detailItem}>
                  <IconSymbol name="wind" size={16} color="#666" />
                  <ThemedText style={styles.detailText}>{state.weather.windSpeed} m/s</ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>

            {/* 5-Day Forecast */}
            {state.forecast.length > 0 && (
              <ThemedView style={styles.forecastContainer}>
                <ThemedText type="subtitle" style={styles.forecastTitle}>5-Day Forecast</ThemedText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {state.forecast.map((day, index) => (
                    <ThemedView key={index} style={styles.forecastDay}>
                      <ThemedText style={styles.forecastDate}>
                        {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                      </ThemedText>
                      <IconSymbol 
                        name={getWeatherIcon(day.icon)} 
                        size={30} 
                        color="#007AFF" 
                      />
                      <ThemedText style={styles.forecastTemp}>
                        {day.temperature}°{state.temperatureUnit === 'metric' ? 'C' : 'F'}
                      </ThemedText>
                    </ThemedView>
                  ))}
                </ScrollView>
              </ThemedView>
            )}
          </>
        ) : (
          <ThemedView style={styles.noDataContainer}>
            <ThemedText>No weather data available</ThemedText>
          </ThemedView>
        )}
      </ThemedView>

      {/* News Filtering Info */}
      {state.weather && (
        <ThemedView style={styles.filterInfo}>
          <IconSymbol name="info.circle.fill" size={20} color="#007AFF" />
          <ThemedText style={styles.filterText}>{getWeatherCategory()}</ThemedText>
        </ThemedView>
      )}

      {/* News Preview */}
      <ThemedView style={styles.newsCard}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Filtered News</ThemedText>
        
        {state.newsLoading ? (
          <ThemedView style={styles.loadingContainer}>
            <ThemedText>Loading news...</ThemedText>
          </ThemedView>
        ) : state.newsError ? (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{state.newsError}</ThemedText>
            <TouchableOpacity style={styles.retryButton} onPress={fetchNewsData}>
              <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ) : state.news.length > 0 ? (
          <ThemedView style={styles.newsPreview}>
            {state.news.slice(0, 3).map((article, index) => (
              <ThemedView key={index} style={styles.newsItem}>
                <ThemedText type="defaultSemiBold" style={styles.newsTitle} numberOfLines={2}>
                  {article.title}
                </ThemedText>
                <ThemedText style={styles.newsDescription} numberOfLines={2}>
                  {article.description}
                </ThemedText>
                <ThemedText style={styles.newsSource}>{article.source.name}</ThemedText>
              </ThemedView>
            ))}
            <ThemedText style={styles.newsMore}>View more news in the News tab</ThemedText>
          </ThemedView>
        ) : (
          <ThemedView style={styles.noDataContainer}>
            <ThemedText>No news available</ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
  },
  weatherCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsCard: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
  },
  currentWeather: {
    marginBottom: 20,
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  temperatureContainer: {
    marginLeft: 16,
    flex: 1,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  condition: {
    fontSize: 16,
    color: '#666',
    textTransform: 'capitalize',
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  forecastContainer: {
    marginTop: 20,
  },
  forecastTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  forecastDay: {
    alignItems: 'center',
    padding: 12,
    marginRight: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    minWidth: 80,
  },
  forecastDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  forecastTemp: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  filterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    marginTop: 0,
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    gap: 8,
  },
  filterText: {
    flex: 1,
    fontSize: 14,
    color: '#1976D2',
  },
  newsPreview: {
    gap: 12,
  },
  newsItem: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  newsTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  newsDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  newsSource: {
    fontSize: 12,
    color: '#999',
  },
  newsMore: {
    textAlign: 'center',
    color: '#007AFF',
    fontSize: 14,
    marginTop: 8,
  },
});
