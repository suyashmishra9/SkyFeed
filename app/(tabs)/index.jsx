import { Dimensions, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/themed-text';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ErrorBoundary } from '../../components/ui/ErrorBoundary';
import { GradientBackground } from '../../components/ui/GradientBackground';
import { IconSymbol } from '../../components/ui/icon-symbol';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import { NewsCardSkeleton, WeatherCardSkeleton } from '../../components/ui/SkeletonLoader';
import { WeatherIcon } from '../../components/ui/WeatherIcon';
import { useApp } from '../../context/AppContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { state, fetchWeatherData, fetchNewsData } = useApp();
  const insets = useSafeAreaInsets();

  const onRefresh = async () => {
    await Promise.all([fetchWeatherData(), fetchNewsData()]);
  };

  const getWeatherCategory = () => {
    if (!state.weather) return { text: '', color: '#007AFF' };
    const temp = state.weather.temperature;
    if (temp < 10) return { text: 'Cold Weather - Showing Depressing News', color: '#4A90E2' };
    if (temp > 25) return { text: 'Hot Weather - Showing Fear-Related News', color: '#FF6B6B' };
    return { text: 'Cool Weather - Showing Positive News', color: '#4ECDC4' };
  };

  const categoryInfo = getWeatherCategory();

  // Show loading screen if no location yet (initial app load)
  if (!state.location && !state.locationError) {
    return <LoadingScreen message="Getting your location..." />;
  }

  // Show error screen if location failed
  if (state.locationError) {
    return (
      <ErrorBoundary 
        error="Unable to get your location. Using default location (New York)." 
        onRetry={() => {
          // Restart the app by refreshing the context
          fetchWeatherData();
        }} 
      />
    );
  }

  return (
    <GradientBackground variant="weather" style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={state.weatherLoading || state.newsLoading} 
            onRefresh={onRefresh}
            tintColor="#FFFFFF"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <ThemedText style={styles.title}>SkyFeed</ThemedText>
          <ThemedText style={styles.subtitle}>Weather & News Aggregator</ThemedText>
        </View>

        {/* Weather Section */}
        <Card variant="elevated" style={styles.weatherCard}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="cloud.sun.fill" size={24} color="#007AFF" />
            <ThemedText style={styles.sectionTitle}>Current Weather</ThemedText>
          </View>
          
          {state.weatherLoading ? (
            <WeatherCardSkeleton />
          ) : state.weatherError ? (
            <View style={styles.errorContainer}>
              <IconSymbol name="exclamationmark.triangle.fill" size={48} color="#FF3B30" />
              <ThemedText style={styles.errorText}>{state.weatherError}</ThemedText>
              <Button 
                title="Retry" 
                onPress={fetchWeatherData}
                variant="outline"
                size="md"
                style={styles.retryButton}
              />
            </View>
          ) : state.weather ? (
            <>
              <View style={styles.currentWeather}>
                <View style={styles.weatherMain}>
                  <WeatherIcon 
                    iconCode={state.weather.icon} 
                    size={80} 
                  />
                  <View style={styles.temperatureContainer}>
                    <ThemedText style={styles.temperature}>
                      {state.weather.temperature}°{state.temperatureUnit === 'metric' ? 'C' : 'F'}
                    </ThemedText>
                    <ThemedText style={styles.condition}>
                      {state.weather.description}
                    </ThemedText>
                  </View>
                </View>
                
                <View style={styles.weatherDetails}>
                  <View style={styles.detailItem}>
                    <IconSymbol name="location.fill" size={18} color="#007AFF" />
                    <ThemedText style={styles.detailText}>
                      {state.weather.city}, {state.weather.country}
                    </ThemedText>
                  </View>
                  <View style={styles.detailItem}>
                    <IconSymbol name="drop.fill" size={18} color="#007AFF" />
                    <ThemedText style={styles.detailText}>{state.weather.humidity}%</ThemedText>
                  </View>
                  <View style={styles.detailItem}>
                    <IconSymbol name="wind" size={18} color="#007AFF" />
                    <ThemedText style={styles.detailText}>{state.weather.windSpeed} m/s</ThemedText>
                  </View>
                </View>
              </View>

              {/* 5-Day Forecast */}
              {state.forecast.length > 0 && (
                <View style={styles.forecastContainer}>
                  <ThemedText style={styles.forecastTitle}>5-Day Forecast</ThemedText>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastScroll}>
                    {state.forecast.map((day, index) => (
                      <View key={index} style={styles.forecastDay}>
                        <ThemedText style={styles.forecastDate}>
                          {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                        </ThemedText>
                        <WeatherIcon 
                          iconCode={day.icon} 
                          size={40} 
                        />
                        <ThemedText style={styles.forecastTemp}>
                          {day.temperature}°{state.temperatureUnit === 'metric' ? 'C' : 'F'}
                        </ThemedText>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </>
          ) : (
            <View style={styles.noDataContainer}>
              <IconSymbol name="cloud.slash.fill" size={48} color="#8E8E93" />
              <ThemedText style={styles.noDataText}>No weather data available</ThemedText>
            </View>
          )}
        </Card>

        {/* News Filtering Info */}
        {state.weather && (
          <Card variant="filled" style={[styles.filterInfo, { borderLeftColor: categoryInfo.color }]}>
            <IconSymbol name="info.circle.fill" size={24} color={categoryInfo.color} />
            <ThemedText style={[styles.filterText, { color: categoryInfo.color }]}>
              {categoryInfo.text}
            </ThemedText>
          </Card>
        )}

        {/* News Preview */}
        <Card variant="elevated" style={styles.newsCard}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="newspaper.fill" size={24} color="#007AFF" />
            <ThemedText style={styles.sectionTitle}>Filtered News</ThemedText>
          </View>
          
          {state.newsLoading ? (
            <View>
              <NewsCardSkeleton />
              <NewsCardSkeleton />
              <NewsCardSkeleton />
            </View>
          ) : state.newsError ? (
            <View style={styles.errorContainer}>
              <IconSymbol name="exclamationmark.triangle.fill" size={48} color="#FF3B30" />
              <ThemedText style={styles.errorText}>{state.newsError}</ThemedText>
              <Button 
                title="Retry" 
                onPress={fetchNewsData}
                variant="outline"
                size="md"
                style={styles.retryButton}
              />
            </View>
          ) : state.news.length > 0 ? (
            <View style={styles.newsPreview}>
              {state.news.slice(0, 3).map((article, index) => (
                <View key={index} style={styles.newsItem}>
                  <ThemedText style={styles.newsTitle} numberOfLines={2}>
                    {article.title}
                  </ThemedText>
                  <ThemedText style={styles.newsDescription} numberOfLines={2}>
                    {article.description}
                  </ThemedText>
                  <View style={styles.newsFooter}>
                    <ThemedText style={styles.newsSource}>{article.source.name}</ThemedText>
                    <IconSymbol name="chevron.right" size={16} color="#8E8E93" />
                  </View>
                </View>
              ))}
              <Button 
                title="View More News" 
                onPress={() => {}} // Navigate to news tab
                variant="ghost"
                size="md"
                style={styles.newsMoreButton}
                icon="arrow.right"
              />
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <IconSymbol name="newspaper" size={48} color="#8E8E93" />
              <ThemedText style={styles.noDataText}>No news available</ThemedText>
            </View>
          )}
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
  },
  weatherCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  newsCard: {
    marginHorizontal: 20,
    marginBottom: 32,
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
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    fontWeight: '500',
  },
  retryButton: {
    marginTop: 8,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noDataText: {
    color: '#8E8E93',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
  currentWeather: {
    marginBottom: 24,
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  temperatureContainer: {
    marginLeft: 20,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  temperature: {
    fontSize: 56,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 4,
    lineHeight: 64,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  condition: {
    fontSize: 18,
    color: '#8E8E93',
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  forecastContainer: {
    marginTop: 24,
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1C1C1E',
  },
  forecastScroll: {
    paddingRight: 20,
  },
  forecastDay: {
    alignItems: 'center',
    padding: 16,
    marginRight: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    minWidth: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  forecastDate: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
    fontWeight: '600',
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 8,
  },
  filterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderRadius: 12,
  },
  filterText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '600',
  },
  newsPreview: {
    gap: 16,
  },
  newsItem: {
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  newsTitle: {
    fontSize: 18,
    color: '#1C1C1E',
    marginBottom: 8,
    fontWeight: '700',
    lineHeight: 24,
  },
  newsDescription: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 12,
    lineHeight: 22,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsSource: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  newsMoreButton: {
    marginTop: 8,
  },
});
