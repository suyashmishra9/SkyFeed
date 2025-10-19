import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

export function GradientBackground({ 
  children, 
  variant = 'blue', 
  style 
}) {
  const getGradientColors = () => {
    const gradients = {
      blue: ['#007AFF', '#5856D6'],
      purple: ['#5856D6', '#AF52DE'],
      orange: ['#FF9500', '#FF3B30'],
      green: ['#34C759', '#30D158'],
      gray: ['#8E8E93', '#AEAEB2'],
      weather: ['#4A90E2', '#7B68EE'],
      news: ['#FF6B6B', '#4ECDC4'],
      settings: ['#667eea', '#764ba2'],
    };
    return gradients[variant] || gradients.blue;
  };

  return (
    <LinearGradient
      colors={getGradientColors()}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


