import { useState, useMemo } from 'react';
import { PRESETS, CINEMA_CAMERAS } from '../types';
import type { PresetType, AspectRatioType, SensorCategory } from '../types';
import { calculateFovAndCrop, calculateDoF } from '../utils/math';

export function useCameraSettings() {
  const [focalLength, setFocalLength] = useState<number>(50);
  const [sensorCategory, setSensorCategory] = useState<SensorCategory>('stills');
  const [preset, setPreset] = useState<PresetType>('full');
  const [cinemaCameraId, setCinemaCameraId] = useState<string>('alexa35');
  const [cinemaModeIdx, setCinemaModeIdx] = useState<number>(0);
  const [aspectType, setAspectType] = useState<AspectRatioType>('16:9');
  const [sensorW, setSensorW] = useState<number>(PRESETS.full.w);
  const [sensorH, setSensorH] = useState<number>(PRESETS.full.h);
  const [customAspectW, setCustomAspectW] = useState<number>(16);
  const [customAspectH, setCustomAspectH] = useState<number>(9);
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [fNumber, setFNumber] = useState<number>(5.6);
  const [focusDistanceM, setFocusDistanceM] = useState<number>(15);
  const [isAutoFocus, setIsAutoFocus] = useState<boolean>(false);
  const [isDofEnabled, setIsDofEnabled] = useState<boolean>(true); // 追加: DoFトグル

  // 人物のシーン上の距離（m）
  const HUMAN_DISTANCE_M = 15;
  // AF ON かマニュアルかに応じて有効なフォーカス距離を決める
  const effectiveFocusDistanceM = isAutoFocus ? HUMAN_DISTANCE_M : focusDistanceM;

  // レンダリング中に現在のセンサーサイズを動的に計算
  let currentSensorW = sensorW;
  let currentSensorH = sensorH;

  if (sensorCategory === 'stills') {
    if (preset !== 'custom') {
      currentSensorW = PRESETS[preset].w;
      currentSensorH = PRESETS[preset].h;
    }
  } else if (sensorCategory === 'cinema') {
    const cam = CINEMA_CAMERAS.find(c => c.id === cinemaCameraId);
    if (cam && cam.modes[cinemaModeIdx]) {
      currentSensorW = cam.modes[cinemaModeIdx].w;
      currentSensorH = cam.modes[cinemaModeIdx].h;
    }
  }

  const angleState = useMemo(() => {
    return calculateFovAndCrop(focalLength, currentSensorW, currentSensorH, aspectType, customAspectW, customAspectH);
  }, [focalLength, currentSensorW, currentSensorH, aspectType, customAspectW, customAspectH]);

  // DoF計算（AF ON時は人物距離で固定）
  const dofResult = useMemo(() => {
    return calculateDoF(focalLength, fNumber, effectiveFocusDistanceM, currentSensorW, currentSensorH);
  }, [focalLength, fNumber, effectiveFocusDistanceM, currentSensorW, currentSensorH]);

  const aspect = angleState.ew / angleState.eh;

  return {
    // states
    focalLength, setFocalLength,
    sensorCategory, setSensorCategory,
    preset, setPreset,
    cinemaCameraId, setCinemaCameraId,
    cinemaModeIdx, setCinemaModeIdx,
    aspectType, setAspectType,
    sensorW: currentSensorW, setSensorW,
    sensorH: currentSensorH, setSensorH,
    customAspectW, setCustomAspectW,
    customAspectH, setCustomAspectH,
    unit, setUnit,
    fNumber, setFNumber,
    focusDistanceM, setFocusDistanceM,
    isAutoFocus, setIsAutoFocus,
    isDofEnabled, setIsDofEnabled,
    
    // derived
    effectiveFocusDistanceM,
    angleState,
    dofResult,
    aspect,
  };
}
