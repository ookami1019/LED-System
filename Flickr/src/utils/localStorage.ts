import type { AnalyzerInputs } from '../types';
import { logger } from './logger';

const STORAGE_KEY = 'shuttersync_analyzer_inputs';

export const DEFAULT_INPUTS: AnalyzerInputs = {
  cameraBaseFps: 23.976,
  cameraHsFps: 59.94,
  ledRefreshRate: 60.00,
  shutterMode: 'Angle',
  shutterValue: 180,
  hasGenlock: true,
  sensorType: 'Rolling',
};

/**
 * LocalStorageからAnalyzerInputsを取得します。
 * 保存されていない場合は、デフォルト値を返します。
 */
export function loadSavedInputs(): AnalyzerInputs {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return DEFAULT_INPUTS;
    }
    const parsed = JSON.parse(saved);
    return {
      cameraBaseFps: (typeof parsed.cameraBaseFps === 'number' || typeof parsed.cameraBaseFps === 'string') ? parsed.cameraBaseFps : DEFAULT_INPUTS.cameraBaseFps,
      cameraHsFps: (typeof parsed.cameraHsFps === 'number' || typeof parsed.cameraHsFps === 'string') ? parsed.cameraHsFps : DEFAULT_INPUTS.cameraHsFps,
      ledRefreshRate: (typeof parsed.ledRefreshRate === 'number' || typeof parsed.ledRefreshRate === 'string') ? parsed.ledRefreshRate : DEFAULT_INPUTS.ledRefreshRate,
      shutterMode: parsed.shutterMode === 'Angle' || parsed.shutterMode === 'Speed' ? parsed.shutterMode : DEFAULT_INPUTS.shutterMode,
      shutterValue: (typeof parsed.shutterValue === 'number' || typeof parsed.shutterValue === 'string') ? parsed.shutterValue : DEFAULT_INPUTS.shutterValue,
      hasGenlock: typeof parsed.hasGenlock === 'boolean' ? parsed.hasGenlock : DEFAULT_INPUTS.hasGenlock,
      sensorType: parsed.sensorType === 'Rolling' || parsed.sensorType === 'Global' ? parsed.sensorType : DEFAULT_INPUTS.sensorType,
    };
  } catch (error) {
    logger.error({
      location: 'localStorage.ts:loadSavedInputs',
      message: 'LocalStorageからの入力パラメータ読み込みに失敗しました。デフォルト値を使用します。',
      error,
    });
    return DEFAULT_INPUTS;
  }
}

/**
 * AnalyzerInputsをLocalStorageに保存します。
 */
export function saveInputs(inputs: AnalyzerInputs): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
  } catch (error) {
    logger.error({
      location: 'localStorage.ts:saveInputs',
      message: 'LocalStorageへの入力パラメータ保存に失敗しました。',
      error,
    });
  }
}
