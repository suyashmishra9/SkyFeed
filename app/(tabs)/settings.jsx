import { Alert, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/themed-text';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { GradientBackground } from '../../components/ui/GradientBackground';
import { IconSymbol } from '../../components/ui/icon-symbol';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import { useApp } from '../../context/AppContext';
import { NewsService } from '../../services/newsService';

export default function SettingsScreen() {
  const { state, dispatch } = useApp();
  const insets = useSafeAreaInsets();

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

  // Show loading screen if no location yet (initial app load)
  if (!state.location && !state.locationError) {
    return <LoadingScreen message="Loading settings..." />;
  }

  return (
    <GradientBackground variant="settings" style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <ThemedText style={styles.title}>Settings</ThemedText>
          <ThemedText style={styles.subtitle}>Customize your SkyFeed experience</ThemedText>
        </View>

        {/* Temperature Unit Settings */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="thermometer" size={24} color="#007AFF" />
            <ThemedText style={styles.sectionTitle}>Temperature Units</ThemedText>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <IconSymbol name="thermometer" size={28} color="#007AFF" />
              <View style={styles.settingText}>
                <ThemedText style={styles.settingLabel}>Temperature Unit</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Currently using {state.temperatureUnit === 'metric' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}
                </ThemedText>
              </View>
            </View>
            <Button
              title={state.temperatureUnit === 'metric' ? '°C' : '°F'}
              onPress={toggleTemperatureUnit}
              variant="outline"
              size="md"
            />
          </View>
        </Card>

        {/* News Categories Settings */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="newspaper.fill" size={24} color="#007AFF" />
            <ThemedText style={styles.sectionTitle}>News Categories</ThemedText>
          </View>
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
                activeOpacity={0.7}
              >
                <View style={styles.categoryInfo}>
                  <IconSymbol 
                    name="newspaper" 
                    size={22} 
                    color={isSelected ? "#007AFF" : "#8E8E93"} 
                  />
                  <ThemedText style={[
                    styles.categoryLabel,
                    { color: isSelected ? "#007AFF" : "#1C1C1E" }
                  ]}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </ThemedText>
                </View>
                <Switch
                  value={isSelected}
                  onValueChange={() => toggleNewsCategory(category)}
                  trackColor={{ false: "#E5E5EA", true: "#007AFF" }}
                  thumbColor={isSelected ? "#FFFFFF" : "#FFFFFF"}
                />
              </TouchableOpacity>
            );
          })}
        </Card>

        {/* Weather Info */}
        {state.weather && (
          <Card variant="elevated" style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="cloud.fill" size={24} color="#007AFF" />
              <ThemedText style={styles.sectionTitle}>Current Weather Filter</ThemedText>
            </View>
            <View style={styles.weatherInfo}>
              <IconSymbol name="cloud.fill" size={32} color="#007AFF" />
              <View style={styles.weatherText}>
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
              </View>
            </View>
          </Card>
        )}

        {/* App Info */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="info.circle.fill" size={24} color="#007AFF" />
            <ThemedText style={styles.sectionTitle}>App Information</ThemedText>
          </View>
          <View style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>Version</ThemedText>
            <ThemedText style={styles.infoValue}>1.0.0</ThemedText>
          </View>
          <View style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>Weather API</ThemedText>
            <ThemedText style={styles.infoValue}>OpenWeatherMap</ThemedText>
          </View>
          <View style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>News API</ThemedText>
            <ThemedText style={styles.infoValue}>NewsAPI</ThemedText>
          </View>
        </Card>

        {/* Actions */}
        <Card variant="elevated" style={styles.section}>
          <Button 
            title="Clear Cache" 
            onPress={clearCache}
            variant="outline"
            size="lg"
            style={styles.actionButton}
            icon="trash"
          />
        </Card>

        {/* Bottom padding for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 18,
    opacity: 0.9,
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
    marginLeft: 12,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 20,
    lineHeight: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 16,
    color: '#8E8E93',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryLabel: {
    fontSize: 18,
    marginLeft: 16,
    fontWeight: '600',
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  weatherText: {
    marginLeft: 16,
    flex: 1,
  },
  weatherLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  weatherDescription: {
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 24,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#1C1C1E',
    fontWeight: '700',
  },
  actionButton: {
    marginTop: 8,
  },
});
