import type { SkPath } from '@shopify/react-native-skia';
import { circle, oval, poly, rect } from './geometry';

// A subject is a stack of regions (drawn back-to-front) defined in unit space.
// Each region builds its own path lazily (so Skia is ready by call time).
export type Region = { build: () => SkPath; color: string };
export type CategoryId = 'household' | 'flora' | 'fauna';
export type Subject = {
  id: string;
  name: string;
  category: CategoryId;
  regions: Region[];
};

export const CATEGORIES: { id: CategoryId; name: string; emoji: string; color: string }[] = [
  { id: 'household', name: 'Around the House', emoji: '🏠', color: '#4062BB' },
  { id: 'flora', name: 'Plants & Flowers', emoji: '🌷', color: '#3FA34D' },
  { id: 'fauna', name: 'Animals', emoji: '🐱', color: '#F2A65A' },
];

export const SUBJECTS: Subject[] = [
  // ---------- Household ----------
  {
    id: 'mug',
    name: 'Mug',
    category: 'household',
    regions: [
      { build: () => rect(0.32, 0.34, 0.36, 0.42), color: '#4062BB' },
      { build: () => rect(0.3, 0.3, 0.4, 0.07), color: '#6E8BE0' },
      { build: () => oval(0.72, 0.52, 0.1, 0.13), color: '#4062BB' },
    ],
  },
  {
    id: 'balloon',
    name: 'Balloon',
    category: 'household',
    regions: [
      { build: () => circle(0.5, 0.4, 0.24), color: '#E4572E' },
      { build: () => poly([[0.46, 0.63], [0.54, 0.63], [0.5, 0.72]]), color: '#E4572E' },
    ],
  },
  {
    id: 'house',
    name: 'House',
    category: 'household',
    regions: [
      { build: () => rect(0.28, 0.46, 0.44, 0.34), color: '#F2A65A' },
      { build: () => poly([[0.24, 0.46], [0.5, 0.22], [0.76, 0.46]]), color: '#E4572E' },
      { build: () => rect(0.44, 0.62, 0.12, 0.18), color: '#8D5B4C' },
    ],
  },
  // ---------- Flora ----------
  {
    id: 'flower',
    name: 'Flower',
    category: 'flora',
    regions: [
      { build: () => rect(0.48, 0.5, 0.04, 0.38), color: '#3FA34D' },
      { build: () => oval(0.62, 0.66, 0.09, 0.05), color: '#3FA34D' },
      { build: () => circle(0.5, 0.24, 0.12), color: '#EF6BA1' },
      { build: () => circle(0.32, 0.36, 0.12), color: '#EF6BA1' },
      { build: () => circle(0.68, 0.36, 0.12), color: '#EF6BA1' },
      { build: () => circle(0.38, 0.52, 0.12), color: '#EF6BA1' },
      { build: () => circle(0.62, 0.52, 0.12), color: '#EF6BA1' },
      { build: () => circle(0.5, 0.42, 0.11), color: '#F6C90E' },
    ],
  },
  {
    id: 'tree',
    name: 'Tree',
    category: 'flora',
    regions: [
      { build: () => rect(0.44, 0.55, 0.12, 0.34), color: '#8D5B4C' },
      { build: () => circle(0.5, 0.42, 0.27), color: '#3FA34D' },
    ],
  },
  {
    id: 'leaf',
    name: 'Leaf',
    category: 'flora',
    regions: [
      { build: () => oval(0.5, 0.46, 0.2, 0.32), color: '#3FA34D' },
      { build: () => rect(0.485, 0.6, 0.03, 0.3), color: '#2A7D3A' },
    ],
  },
  // ---------- Fauna ----------
  {
    id: 'fish',
    name: 'Fish',
    category: 'fauna',
    regions: [
      { build: () => poly([[0.66, 0.5], [0.88, 0.34], [0.88, 0.66]]), color: '#2A9D8F' },
      { build: () => oval(0.44, 0.5, 0.26, 0.17), color: '#2A9D8F' },
      { build: () => circle(0.32, 0.45, 0.03), color: '#2B2D42' },
    ],
  },
  {
    id: 'cat',
    name: 'Cat',
    category: 'fauna',
    regions: [
      { build: () => poly([[0.3, 0.38], [0.4, 0.14], [0.52, 0.34]]), color: '#F2A65A' },
      { build: () => poly([[0.48, 0.34], [0.6, 0.14], [0.7, 0.38]]), color: '#F2A65A' },
      { build: () => circle(0.5, 0.54, 0.26), color: '#F2A65A' },
      { build: () => circle(0.41, 0.52, 0.035), color: '#2B2D42' },
      { build: () => circle(0.59, 0.52, 0.035), color: '#2B2D42' },
    ],
  },
  {
    id: 'ladybug',
    name: 'Ladybug',
    category: 'fauna',
    regions: [
      { build: () => circle(0.5, 0.53, 0.28), color: '#E4572E' },
      { build: () => circle(0.5, 0.28, 0.11), color: '#2B2D42' },
      { build: () => circle(0.4, 0.5, 0.05), color: '#2B2D42' },
      { build: () => circle(0.6, 0.5, 0.05), color: '#2B2D42' },
      { build: () => circle(0.5, 0.66, 0.05), color: '#2B2D42' },
    ],
  },
];

export function getSubject(id: string): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

export function subjectsByCategory(category: CategoryId): Subject[] {
  return SUBJECTS.filter((s) => s.category === category);
}
