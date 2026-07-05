import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { ImageFormat, useCanvasRef } from '@shopify/react-native-skia';

import FpsMeter from '../components/FpsMeter';
import CrayonTray from '../editor/CrayonTray';
import DrawingCanvas from '../editor/DrawingCanvas';
import Toolbar from '../editor/Toolbar';
import { CRAYONS, ERASER, THICKNESSES, styleFor, type Crayon } from '../editor/palette';
import type { Stroke } from '../editor/types';
import { success, tick } from '../feedback/haptics';
import type { ScreenProps } from '../navigation/types';
import { useAppStore } from '../state/useAppStore';
import { saveArtwork } from '../storage/gallery';

export default function EditorScreen({ navigation }: ScreenProps<'Editor'>) {
  const handedness = useAppStore((s) => s.handedness);
  const canvasRef = useCanvasRef();

  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redo, setRedo] = useState<Stroke[]>([]);
  const [selectedId, setSelectedId] = useState<string>(CRAYONS[0].id);
  const [thicknessId, setThicknessId] = useState<string>('normal');
  const [trayOpen, setTrayOpen] = useState(true);

  const current: Crayon = useMemo(
    () => (selectedId === ERASER.id ? ERASER : CRAYONS.find((c) => c.id === selectedId) ?? CRAYONS[0]),
    [selectedId],
  );
  const activeStyle = useMemo(() => styleFor(current), [current]);
  const thicknessScale = useMemo(
    () => THICKNESSES.find((t) => t.id === thicknessId)?.scale ?? 1,
    [thicknessId],
  );

  // Latest selection available to the commit callback without coupling the draw worklet to state.
  const selRef = useRef<Crayon>(current);
  useEffect(() => {
    selRef.current = current;
  }, [current]);
  const idRef = useRef(0);

  const onCommitStroke = useCallback((svg: string) => {
    if (!svg) return;
    const st = styleFor(selRef.current);
    setStrokes((prev) => [
      ...prev,
      { id: idRef.current++, svg, color: st.color, grain: st.grain, blend: st.blend },
    ]);
    setRedo([]);
  }, []);

  const onSelect = useCallback((id: string) => {
    tick();
    setSelectedId(id);
  }, []);
  const onThickness = useCallback((id: string) => {
    tick();
    setThicknessId(id);
  }, []);
  const onToggleTray = useCallback(() => {
    tick();
    setTrayOpen((o) => !o);
  }, []);

  const undo = useCallback(() => {
    setStrokes((prev) => {
      if (!prev.length) return prev;
      setRedo((r) => [...r, prev[prev.length - 1]]);
      return prev.slice(0, -1);
    });
  }, []);

  const redoFn = useCallback(() => {
    setRedo((prev) => {
      if (!prev.length) return prev;
      setStrokes((s) => [...s, prev[prev.length - 1]]);
      return prev.slice(0, -1);
    });
  }, []);

  const clear = useCallback(() => {
    if (!strokes.length) return;
    Alert.alert('Clear the page?', 'This erases your whole drawing.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          setStrokes([]);
          setRedo([]);
        },
      },
    ]);
  }, [strokes.length]);

  const save = useCallback(async () => {
    const image = canvasRef.current?.makeImageSnapshot();
    if (!image) {
      Alert.alert('Hmm', 'Could not save right now.');
      return;
    }
    const b64 = image.encodeToBase64(ImageFormat.JPEG, 85);
    const uri = `data:image/jpeg;base64,${b64}`;
    try {
      await saveArtwork(uri);
      success();
      Alert.alert('Saved! 🎨', 'Your drawing is in the gallery.', [
        { text: 'Keep drawing', style: 'cancel' },
        { text: 'Go to gallery', onPress: () => navigation.navigate('Gallery') },
      ]);
    } catch {
      Alert.alert('Hmm', 'Could not save right now.');
    }
  }, [canvasRef, navigation]);

  return (
    <View style={styles.root}>
      <DrawingCanvas
        strokes={strokes}
        activeStyle={activeStyle}
        thicknessScale={thicknessScale}
        onCommitStroke={onCommitStroke}
        canvasRef={canvasRef}
      />
      <CrayonTray
        crayons={CRAYONS}
        eraser={ERASER}
        selectedId={selectedId}
        onSelect={onSelect}
        thicknesses={THICKNESSES}
        thicknessId={thicknessId}
        onThickness={onThickness}
        handedness={handedness}
        open={trayOpen}
        onToggle={onToggleTray}
      />
      <Toolbar
        onBack={() => navigation.goBack()}
        onUndo={undo}
        onRedo={redoFn}
        onClear={clear}
        onSave={save}
        canUndo={strokes.length > 0}
        canRedo={redo.length > 0}
        canSave={strokes.length > 0}
        center={<FpsMeter />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7F1E3' },
});
