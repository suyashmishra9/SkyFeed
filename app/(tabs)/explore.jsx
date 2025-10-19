import { Alert, Linking, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/themed-text';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { GradientBackground } from '../../components/ui/GradientBackground';
import { IconSymbol } from '../../components/ui/icon-symbol';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import { NewsCardSkeleton } from '../../components/ui/SkeletonLoader';
import { useApp } from '../../context/AppContext';

export default function NewsScreen() {
  const { state, fetchNewsData } = useApp();
  const insets = useSafeAreaInsets();

  const onRefresh = async () => {
    await fetchNewsData();
  };

  const openArticle = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this article');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open article');
    }
  };

  const getWeatherCategoryInfo = () => {
    if (!state.weather) return { 
      title: 'General News', 
      description: 'Showing general news headlines',
      color: '#007AFF'
    };
    
    const temp = state.weather.temperature;
    if (temp < 10) {
      return { 
        title: 'Cold Weather News', 
        description: 'Showing depressing and serious news based on cold weather',
        color: '#4A90E2'
      };
    } else if (temp > 25) {
      return { 
        title: 'Hot Weather News', 
        description: 'Showing fear-related and concerning news based on hot weather',
        color: '#FF6B6B'
      };
    } else {
      return { 
        title: 'Cool Weather News', 
        description: 'Showing positive and uplifting news based on cool weather',
        color: '#4ECDC4'
      };
    }
  };

  const categoryInfo = getWeatherCategoryInfo();

  // Show loading screen if no location yet (initial app load)
  if (!state.location && !state.locationError) {
    return <LoadingScreen message="Loading news..." />;
  }

  return (
    <GradientBackground variant="news" style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={state.newsLoading} 
            onRefresh={onRefresh}
            tintColor="#FFFFFF"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <ThemedText style={styles.title}>{categoryInfo.title}</ThemedText>
          <ThemedText style={styles.subtitle}>{categoryInfo.description}</ThemedText>
        </View>

        {state.newsLoading ? (
          <View style={styles.newsContainer}>
            <NewsCardSkeleton />
            <NewsCardSkeleton />
            <NewsCardSkeleton />
            <NewsCardSkeleton />
            <NewsCardSkeleton />
          </View>
        ) : state.newsError ? (
          <Card variant="elevated" style={styles.errorCard}>
            <View style={styles.errorContainer}>
              <IconSymbol name="exclamationmark.triangle.fill" size={64} color="#FF3B30" />
              <ThemedText style={styles.errorText}>{state.newsError}</ThemedText>
              <Button 
                title="Retry" 
                onPress={fetchNewsData}
                variant="outline"
                size="lg"
                style={styles.retryButton}
              />
            </View>
          </Card>
        ) : state.news.length > 0 ? (
          <View style={styles.newsContainer}>
            {state.news.map((article, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.newsItem}
                onPress={() => openArticle(article.url)}
                activeOpacity={0.7}
              >
                <Card variant="outlined" style={styles.newsCard}>
                  <View style={styles.newsContent}>
                    <ThemedText style={styles.newsTitle} numberOfLines={3}>
                      {article.title}
                    </ThemedText>
                    <ThemedText style={styles.newsDescription} numberOfLines={3}>
                      {article.description}
                    </ThemedText>
                    <View style={styles.newsFooter}>
                      <View style={styles.sourceContainer}>
                        <IconSymbol name="newspaper" size={16} color={categoryInfo.color} />
                        <ThemedText style={[styles.newsSource, { color: categoryInfo.color }]}>
                          {article.source.name}
                        </ThemedText>
                      </View>
                      <ThemedText style={styles.newsDate}>
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </ThemedText>
                    </View>
                  </View>
                  <View style={styles.chevronContainer}>
                    <IconSymbol name="chevron.right" size={20} color="#8E8E93" />
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Card variant="elevated" style={styles.noDataCard}>
            <View style={styles.noDataContainer}>
              <IconSymbol name="newspaper" size={80} color="#8E8E93" />
              <ThemedText style={styles.noDataText}>No news available</ThemedText>
              <ThemedText style={styles.noDataSubtext}>
                Pull down to refresh or check your internet connection
              </ThemedText>
              <Button 
                title="Refresh" 
                onPress={onRefresh}
                variant="outline"
                size="lg"
                style={styles.refreshButton}
              />
            </View>
          </Card>
        )}

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
    fontSize: 32,
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
  newsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  newsItem: {
    marginBottom: 16,
  },
  newsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
  },
  newsContent: {
    flex: 1,
    padding: 20,
  },
  newsTitle: {
    fontSize: 20,
    color: '#1C1C1E',
    marginBottom: 12,
    lineHeight: 28,
    fontWeight: '700',
  },
  newsDescription: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 16,
    lineHeight: 24,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  newsSource: {
    fontSize: 16,
    fontWeight: '600',
  },
  newsDate: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  chevronContainer: {
    paddingRight: 20,
    paddingVertical: 20,
  },
  errorCard: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 32,
    fontSize: 18,
    fontWeight: '600',
  },
  retryButton: {
    marginTop: 8,
  },
  noDataCard: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noDataText: {
    fontSize: 22,
    color: '#8E8E93',
    marginTop: 20,
    marginBottom: 12,
    fontWeight: '700',
  },
  noDataSubtext: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  refreshButton: {
    marginTop: 8,
  },
});
