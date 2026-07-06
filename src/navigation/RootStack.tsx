import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ArtworkViewerScreen from '../screens/ArtworkViewerScreen';
import DrawCategoryScreen from '../screens/DrawCategoryScreen';
import EditorScreen from '../screens/EditorScreen';
import GalleryScreen from '../screens/GalleryScreen';
import HomeScreen from '../screens/HomeScreen';
import ScoreScreen from '../screens/ScoreScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SubjectPickerScreen from '../screens/SubjectPickerScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F7F1E3' } }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Editor" component={EditorScreen} />
      <Stack.Screen name="DrawCategory" component={DrawCategoryScreen} />
      <Stack.Screen name="SubjectPicker" component={SubjectPickerScreen} />
      <Stack.Screen name="Score" component={ScoreScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="Gallery" component={GalleryScreen} />
      <Stack.Screen name="ArtworkViewer" component={ArtworkViewerScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
