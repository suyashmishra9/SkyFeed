// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const MAPPING = {
  'house.fill': 'home',
  'house': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  // Weather icons
  'sun.max.fill': 'wb-sunny',
  'moon.fill': 'nightlight-round',
  'cloud.sun.fill': 'wb-cloudy',
  'cloud.moon.fill': 'cloud-queue',
  'cloud.fill': 'cloud',
  'cloud.rain.fill': 'cloud-queue',
  'cloud.sun.rain.fill': 'wb-cloudy',
  'cloud.moon.rain.fill': 'cloud-queue',
  'cloud.bolt.fill': 'flash-on',
  'cloud.snow.fill': 'ac-unit',
  'cloud.fog.fill': 'foggy',
  // Additional icons
  'location.fill': 'location-on',
  'drop.fill': 'water-drop',
  'wind': 'air',
  'gear.fill': 'settings',
  'newspaper.fill': 'newspaper',
  'newspaper': 'newspaper',
  'gear': 'settings',
  'info.circle.fill': 'info',
  'cloud.slash.fill': 'cloud-off',
  'cloud.fill': 'cloud',
  'arrow.right': 'arrow-forward',
  'arrow.forward': 'arrow-forward',
  'arrow.right.circle': 'arrow-forward',
  'exclamationmark.triangle.fill': 'warning',
  'thermometer': 'thermostat',
};

export function IconSymbol({ name, size = 24, color, style }) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
