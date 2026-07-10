import AsyncStorage from '@react-native-async-storage/async-storage';

// Phase 1 gallery persistence.
// Artwork is stored as JPEG data-URIs in AsyncStorage — simple and 100% Expo Go
// compatible. When we move to a dev build we'll swap this for expo-file-system
// (real PNG files + downscaled thumbnails). Keep this module's API stable so the
// swap is isolated here.

const INDEX_KEY = 'crayonhero.gallery.index.v1';
const imgKey = (id: string) => `crayonhero.gallery.img.${id}`;

export type ArtworkMeta = { id: string; createdAt: number };
export type Artwork = ArtworkMeta & { uri: string | null };

function newId(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

async function readIndex(): Promise<ArtworkMeta[]> {
  const raw = await AsyncStorage.getItem(INDEX_KEY);
  return raw ? (JSON.parse(raw) as ArtworkMeta[]) : [];
}

export async function saveArtwork(dataUri: string): Promise<ArtworkMeta> {
  const meta: ArtworkMeta = { id: newId(), createdAt: Date.now() };
  await AsyncStorage.setItem(imgKey(meta.id), dataUri);
  const index = await readIndex();
  await AsyncStorage.setItem(INDEX_KEY, JSON.stringify([meta, ...index]));
  return meta;
}

export async function listArtworks(): Promise<Artwork[]> {
  const index = await readIndex();
  if (index.length === 0) return [];
  const pairs = await AsyncStorage.multiGet(index.map((m) => imgKey(m.id)));
  const map = new Map(pairs);
  return index.map((m) => ({ ...m, uri: map.get(imgKey(m.id)) ?? null }));
}

export async function getArtwork(id: string): Promise<string | null> {
  return AsyncStorage.getItem(imgKey(id));
}

export async function deleteArtwork(id: string): Promise<void> {
  const index = await readIndex();
  await AsyncStorage.multiRemove([imgKey(id)]);
  await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(index.filter((m) => m.id !== id)));
}

export async function clearAllArtworks(): Promise<void> {
  const index = await readIndex();
  await AsyncStorage.multiRemove([INDEX_KEY, ...index.map((m) => imgKey(m.id))]);
}
