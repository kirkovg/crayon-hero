import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { ImageFormat, useCanvasRef } from '@shopify/react-native-skia';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FpsMeter from '../components/FpsMeter';
import CrayonTray from '../editor/CrayonTray';
import DrawingCanvas from '../editor/DrawingCanvas';
import Toolbar from '../editor/Toolbar';
import { CRAYONS, ERASER, THICKNESSES, styleFor, type Crayon } from '../editor/palette';
import type { Stroke } from '../editor/types';
import { success, tick } from '../feedback/haptics';
import { useT } from '../i18n';
import type { ScreenProps } from '../navigation/types';
import { scoreDrawing } from '../scoring/score';
import { useAppStore } from '../state/useAppStore';
import { useProgress } from '../state/useProgress';
import { saveArtwork } from '../storage/gallery';
import { getSubject } from '../subjects/catalog';
import { SubjectCanvas } from '../subjects/SubjectRenderer';
import { AppText } from '../ui/AppText';

export default function EditorScreen({ route, navigation }: ScreenProps<'Editor'>) {
  const t = useT();
  const params = route.params;
  const subject = params.mode === 'draw' ? getSubject(params.subjectId) : undefined;
  const isDraw = params.mode === 'draw' && !!subject;

  const handedness = useAppStore((s) => s.handedness);
  const award = useProgress((s) => s.award);
  const canvasRef = useCanvasRef();

  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const stage = useMemo(() => {
    const size = Math.min(width - 40, height * 0.5);
    return { x: (width - size) / 2, y: insets.top + 96, size };
  }, [width, height, insets.top]);

  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redo, setRedo] = useState<Stroke[]>([]);
  const [selectedId, setSelectedId] = useState<string>(CRAYONS[0].id);
  const [thicknessId, setThicknessId] = useState<string>('normal');
  const [trayOpen, setTrayOpen] = useState(true);
  const [subMode, setSubMode] = useState<'color' | 'draw'>('color');

  const current: Crayon = useMemo(
    () => (selectedId === ERASER.id ? ERASER : CRAYONS.find((c) => c.id === selectedId) ?? CRAYONS[0]),
    [selectedId],
  );
  const activeStyle = useMemo(() => styleFor(current), [current]);
  const thicknessScale = useMemo(
    () => THICKNESSES.find((tt) => tt.id === thicknessId)?.scale ?? 1,
    [thicknessId],
  );

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
    Alert.alert(t('editor.clearTitle'), t('editor.clearMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('editor.clear'), style: 'destructive', onPress: () => { setStrokes([]); setRedo([]); } },
    ]);
  }, [strokes.length, t]);

  const save = useCallback(async () => {
    const image = canvasRef.current?.makeImageSnapshot();
    if (!image) {
      Alert.alert(t('editor.oops'), t('editor.couldNotSave'));
      return;
    }
    const uri = `data:image/jpeg;base64,${image.encodeToBase64(ImageFormat.JPEG, 85)}`;
    try {
      await saveArtwork(uri);
      success();
      Alert.alert(t('editor.savedTitle'), t('editor.savedMsg'), [
        { text: t('editor.keepDrawing'), style: 'cancel' },
        { text: t('editor.goToGallery'), onPress: () => navigation.navigate('Gallery') },
      ]);
    } catch {
      Alert.alert(t('editor.oops'), t('editor.couldNotSave'));
    }
  }, [canvasRef, navigation, t]);

  const finish = useCallback(() => {
    if (!subject) return;
    const image = canvasRef.current?.makeImageSnapshot();
    if (!image) {
      Alert.alert(t('editor.oops'), t('editor.couldNotSave'));
      return;
    }
    const result = scoreDrawing(image, subject, stage, width);
    award(subject.id, result.stars, result.points);
    success();
    navigation.replace('Score', {
      subjectId: subject.id,
      stars: result.stars,
      points: result.points,
      coverage: result.coverage,
      colorMatch: result.colorMatch,
      containment: result.containment,
    });
  }, [subject, stage, width, canvasRef, award, navigation, t]);

  return (
    <View style={styles.root}>
      <DrawingCanvas
        strokes={strokes}
        activeStyle={activeStyle}
        thicknessScale={thicknessScale}
        onCommitStroke={onCommitStroke}
        canvasRef={canvasRef}
      />

      {isDraw && subject ? (
        <View pointerEvents="none" style={[styles.overlay, { left: stage.x, top: stage.y }]}>
          <SubjectCanvas subject={subject} size={stage.size} mode={subMode === 'color' ? 'outline' : 'guide'} />
        </View>
      ) : null}

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

      {isDraw && subject ? (
        <View style={[styles.refPanel, { bottom: insets.bottom + 14 }]}>
          <SubjectCanvas subject={subject} size={50} mode="filled" paper style={styles.refChip} />
          <View>
            <AppText style={styles.refName}>{t(`subjects.${subject.id}`)}</AppText>
            <View style={styles.segment}>
              {(['color', 'draw'] as const).map((m) => (
                <Pressable
                  key={m}
                  onPress={() => { tick(); setSubMode(m); }}
                  style={[styles.segBtn, subMode === m && styles.segBtnActive]}
                >
                  <AppText style={[styles.segTxt, subMode === m && styles.segTxtActive]}>
                    {m === 'color' ? t('editor.colorIt') : t('editor.drawIt')}
                  </AppText>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      ) : null}

      <Toolbar
        onBack={() => navigation.goBack()}
        onUndo={undo}
        onRedo={redoFn}
        onClear={clear}
        onPrimary={isDraw ? finish : save}
        primaryLabel={isDraw ? t('editor.done') : t('editor.save')}
        primaryIcon={isDraw ? 'checkmark' : 'save-outline'}
        canUndo={strokes.length > 0}
        canRedo={redo.length > 0}
        canPrimary={strokes.length > 0}
        center={<FpsMeter />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7F1E3' },
  overlay: { position: 'absolute' },
  refPanel: {
    position: 'absolute',
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  refChip: { borderRadius: 10 },
  refName: { fontSize: 14, fontWeight: '800', color: '#2B2D42', marginBottom: 4 },
  segment: { flexDirection: 'row', backgroundColor: '#EFE7DA', borderRadius: 9, padding: 2 },
  segBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 7 },
  segBtnActive: { backgroundColor: '#fff' },
  segTxt: { fontSize: 12, fontWeight: '700', color: '#7A6F5D' },
  segTxtActive: { color: '#2B2D42' },
});
