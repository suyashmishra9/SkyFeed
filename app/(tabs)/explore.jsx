import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useApp } from '@/context/AppContext';
import React from 'react';
import { Alert, Linking, RefreshControl, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function NewsScreen() {
  const { state, fetchNewsData } = useApp();

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
    if (!state.weather) return { title: 'General News', description: 'Showing general news headlines' };
    
    const temp = state.weather.temperature;
    if (temp < 10) {
      return { 
        title: 'Cold Weather News', 
        description: 'Showing depressing and serious news based on cold weather' 
      };
    } else if (temp > 25) {
      return { 
        title: 'Hot Weather News', 
        description: 'Showing fear-related and concerning news based on hot weather' 
      };
    } else {
      return { 
        title: 'Cool Weather News', 
        description: 'Showing positive and uplifting news based on cool weather' 
      };
    }
  };

  const categoryInfo = getWeatherCategoryInfo();

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={state.newsLoading} onRefresh={onRefresh} />
      }
    >
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>{categoryInfo.title}</ThemedText>
        <ThemedText style={styles.subtitle}>{categoryInfo.description}</ThemedText>
      </ThemedView>

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
        <ThemedView style={styles.newsContainer}>
          {state.news.map((article, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.newsItem}
              onPress={() => openArticle(article.url)}
            >
              <ThemedView style={styles.newsContent}>
                <ThemedText type="defaultSemiBold" style={styles.newsTitle} numberOfLines={3}>
                  {article.title}
                </ThemedText>
                <ThemedText style={styles.newsDescription} numberOfLines={3}>
                  {article.description}
                </ThemedText>
                <ThemedView style={styles.newsFooter}>
                  <ThemedText style={styles.newsSource}>{article.source.name}</ThemedText>
                  <ThemedText style={styles.newsDate}>
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
              <IconSymbol name="chevron.right" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </ThemedView>
      ) : (
        <ThemedView style={styles.noDataContainer}>
          <IconSymbol name="newspaper" size={60} color="#ccc" />
          <ThemedText style={styles.noDataText}>No news available</ThemedText>
          <ThemedText style={styles.noDataSubtext}>
            Pull down to refresh or check your internet connection
          </ThemedText>
        </ThemedView>
      )}
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noDataContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  newsContainer: {
    padding: 16,
  },
  newsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsContent: {
    flex: 1,
    marginRight: 12,
  },
  newsTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  newsDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsSource: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  newsDate: {
    fontSize: 12,
    color: '#999',
  },
});
