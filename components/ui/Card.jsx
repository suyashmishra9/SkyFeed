import { StyleSheet, View } from 'react-native';

export function Card({ children, variant = 'default', style, ...props }) {
  const cardStyle = [
    styles.base,
    styles[variant],
    style
  ];

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  default: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  elevated: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  outlined: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowOpacity: 0.05,
  },
  filled: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    shadowOpacity: 0.05,
  },
});


