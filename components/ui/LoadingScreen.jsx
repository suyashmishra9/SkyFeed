import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../themed-text';
import { GradientBackground } from './GradientBackground';
import { LoadingSpinner } from './LoadingSpinner';
import { IconSymbol } from './icon-symbol';

export function LoadingScreen({ message = "Loading SkyFeed..." }) {
  const insets = useSafeAreaInsets();

  return (
    <GradientBackground variant="weather" style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
        <IconSymbol name="cloud.sun.fill" size={80} color="#FFFFFF" />
        <ThemedText style={styles.title}>SkyFeed</ThemedText>
        <ThemedText style={styles.subtitle}>Weather & News Aggregator</ThemedText>
        
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="large" color="#FFFFFF" />
          <ThemedText style={styles.loadingText}>{message}</ThemedText>
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    marginTop: 24,
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
    marginBottom: 48,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
    opacity: 0.9,
    fontWeight: '500',
  },
});

