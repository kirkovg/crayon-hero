import Ionicons from '@expo/vector-icons/Ionicons';
import type { StyleProp, TextStyle } from 'react-native';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function Icon({
  name,
  size = 22,
  color = '#2B2D42',
  style,
}: {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}) {
  return <Ionicons name={name} size={size} color={color} style={style} />;
}
