import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useApp } from '@/context/AppContext';
import { NewsService } from '@/services/newsService';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';

export default function SettingsScreen() {
  const { state, dispatch } = useApp();

  const toggleTemperatureUnit = () => {
    const newUnit = state.temperatureUnit === 'metric' ? 'imperial' : 'metric';
    dispatch({ type: 'SET_TEMPERATURE_UNIT', payload: newUnit });
  };

  const toggleNewsCategory = (category) => {
    const currentCategories = state.selectedNewsCategories || [];
    const isSelected = currentCategories.includes(category);
    
    let newCategories;
    if (isSelected) {
      newCategories = currentCategories.filter(cat => cat !== category);
    } else {
      newCategories = [...currentCategories, category];
    }
    
    dispatch({ type: 'SET_NEWS_CATEGORIES', payload: newCategories });
  };

  const clearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data and refresh the app.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            // Reset to initial state
            dispatch({ type: 'SET_WEATHER_DATA', payload: { weather: null, forecast: [] } });
            dispatch({ type: 'SET_NEWS_DATA', payload: [] });
          }
        }
      ]
    );
  };

  const availableCategories = NewsService.getAvailableCategories();

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Settings</ThemedText>
        <ThemedText style={styles.subtitle}>Customize your SkyFeed experience</ThemedText>
      </ThemedView>

      {/* Temperature Unit Settings */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Temperature Units</ThemedText>
        <ThemedView style={styles.settingItem}>
          <ThemedView style={styles.settingInfo}>
            <IconSymbol name="thermometer" size={24} color="#007AFF" />
            <ThemedView style={styles.settingText}>
              <ThemedText style={styles.settingLabel}>Temperature Unit</ThemedText>
              <ThemedText style={styles.settingDescription}>
                Currently using {state.temperatureUnit === 'metric' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}
              </ThemedText>
            </ThemedView>
          </ThemedView>
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={toggleTemperatureUnit}
          >
            <ThemedText style={styles.toggleText}>
              {state.temperatureUnit === 'metric' ? '°C' : '°F'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      {/* News Categories Settings */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>News Categories</ThemedText>
        <ThemedText style={styles.sectionDescription}>
          Select categories you're interested in (weather-based filtering will still apply)
        </ThemedText>
        
        {availableCategories.map((category) => {
          const isSelected = state.selectedNewsCategories?.includes(category) || false;
          return (
            <TouchableOpacity
              key={category}
              style={styles.categoryItem}
              onPress={() => toggleNewsCategory(category)}
            >
              <ThemedView style={styles.categoryInfo}>
                <IconSymbol 
                  name="newspaper" 
                  size={20} 
                  color={isSelected ? "#007AFF" : "#999"} 
                />
                <ThemedText style={[
                  styles.categoryLabel,
                  { color: isSelected ? "#007AFF" : "#333" }
                ]}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </ThemedText>
              </ThemedView>
              <Switch
                value={isSelected}
                onValueChange={() => toggleNewsCategory(category)}
                trackColor={{ false: "#E5E5EA", true: "#007AFF" }}
                thumbColor={isSelected ? "#FFFFFF" : "#FFFFFF"}
              />
            </TouchableOpacity>
          );
        })}
      </ThemedView>

      {/* Weather Info */}
      {state.weather && (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Current Weather Filter</ThemedText>
          <ThemedView style={styles.weatherInfo}>
            <IconSymbol name="cloud.fill" size={24} color="#007AFF" />
            <ThemedView style={styles.weatherText}>
              <ThemedText style={styles.weatherLabel}>
                {state.weather.temperature}°{state.temperatureUnit === 'metric' ? 'C' : 'F'} - {state.weather.condition}
              </ThemedText>
              <ThemedText style={styles.weatherDescription}>
                {state.weather.temperature < 10 
                  ? 'Showing depressing news due to cold weather'
                  : state.weather.temperature > 25
                  ? 'Showing fear-related news due to hot weather'
                  : 'Showing positive news due to cool weather'
                }
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      )}

      {/* App Info */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>App Information</ThemedText>
        <ThemedView style={styles.infoItem}>
          <ThemedText style={styles.infoLabel}>Version</ThemedText>
          <ThemedText style={styles.infoValue}>1.0.0</ThemedText>
        </ThemedView>
        <ThemedView style={styles.infoItem}>
          <ThemedText style={styles.infoLabel}>Weather API</ThemedText>
          <ThemedText style={styles.infoValue}>OpenWeatherMap</ThemedText>
        </ThemedView>
        <ThemedView style={styles.infoItem}>
          <ThemedText style={styles.infoLabel}>News API</ThemedText>
          <ThemedText style={styles.infoValue}>NewsAPI</ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Actions */}
      <ThemedView style={styles.section}>
        <TouchableOpacity style={styles.actionButton} onPress={clearCache}>
          <IconSymbol name="trash" size={20} color="#FF3B30" />
          <ThemedText style={styles.actionButtonText}>Clear Cache</ThemedText>
        </TouchableOpacity>
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
    backgroundColor: '#007AFF',
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
  },
  section: {
    margin: 16,
    marginTop: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
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
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  toggleButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toggleText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryLabel: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  weatherText: {
    marginLeft: 12,
    flex: 1,
  },
  weatherLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  weatherDescription: {
    fontSize: 14,
    color: '#666',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
    marginLeft: 8,
  },
});
