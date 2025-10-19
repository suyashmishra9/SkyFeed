import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export function SkeletonLoader({ width = '100%', height = 20, borderRadius = 4, style }) {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = () => {
      shimmerValue.setValue(0);
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start(() => shimmer());
    };
    shimmer();
  }, [shimmerValue]);

  const shimmerOpacity = shimmerValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.7, 0.3],
  });

  return (
    <View style={[styles.container, { width, height, borderRadius }, style]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            opacity: shimmerOpacity,
          },
        ]}
      />
    </View>
  );
}

export function WeatherCardSkeleton() {
  return (
    <View style={styles.weatherCard}>
      <SkeletonLoader height={24} width="60%" style={styles.title} />
      <View style={styles.weatherMain}>
        <SkeletonLoader height={60} width={60} borderRadius={30} />
        <View style={styles.tempContainer}>
          <SkeletonLoader height={48} width="80%" style={styles.temp} />
          <SkeletonLoader height={16} width="60%" />
        </View>
      </View>
      <View style={styles.details}>
        <SkeletonLoader height={16} width="30%" />
        <SkeletonLoader height={16} width="30%" />
        <SkeletonLoader height={16} width="30%" />
      </View>
    </View>
  );
}

export function NewsCardSkeleton() {
  return (
    <View style={styles.newsCard}>
      <SkeletonLoader height={20} width="90%" style={styles.newsTitle} />
      <SkeletonLoader height={16} width="100%" style={styles.newsDesc} />
      <SkeletonLoader height={16} width="100%" style={styles.newsDesc} />
      <View style={styles.newsFooter}>
        <SkeletonLoader height={14} width="40%" />
        <SkeletonLoader height={14} width="30%" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E5E5EA',
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
  },
  weatherCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    marginBottom: 16,
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tempContainer: {
    marginLeft: 16,
    flex: 1,
  },
  temp: {
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  newsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  newsTitle: {
    marginBottom: 12,
  },
  newsDesc: {
    marginBottom: 8,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
});


