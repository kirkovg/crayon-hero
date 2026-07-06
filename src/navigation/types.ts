import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Editor: { mode: 'free' } | { mode: 'draw'; subjectId: string };
  DrawCategory: undefined;
  SubjectPicker: { category: string };
  Score: {
    subjectId: string;
    stars: number;
    points: number;
    coverage: number;
    colorMatch: number;
    containment: number;
  };
  Gallery: undefined;
  ArtworkViewer: { id: string };
  Settings: undefined;
};

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
