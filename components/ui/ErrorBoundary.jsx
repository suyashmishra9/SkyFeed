import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../themed-text';
import { Button } from './Button';
import { GradientBackground } from './GradientBackground';
import { IconSymbol } from './icon-symbol';

export function ErrorBoundary({ error, onRetry }) {
  const insets = useSafeAreaInsets();

  return (
    <GradientBackground variant="weather" style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
        <IconSymbol name="exclamationmark.triangle.fill" size={80} color="#FF3B30" />
        <ThemedText style={styles.title}>Something went wrong</ThemedText>
        <ThemedText style={styles.subtitle}>
          {error || 'An unexpected error occurred'}
        </ThemedText>
        
        <Button 
          title="Try Again" 
          onPress={onRetry}
          variant="outline"
          size="lg"
          style={styles.retryButton}
          icon="arrow.clockwise"
        />
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
    fontSize: 28,
    fontWeight: '800',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.9,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  retryButton: {
    marginTop: 8,
  },
});

