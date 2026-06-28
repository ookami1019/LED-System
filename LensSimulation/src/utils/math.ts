import type { AngleState } from '../types';

export function calculateFovAndCrop(
  focalLength: number,
  baseW: number,
  baseH: number,
  aspectType: string,
  customAspectW: number,
  customAspectH: number
): AngleState {
  let targetRatio;
  if (aspectType === 'original') {
    targetRatio = baseW / baseH;
  } else if (aspectType === 'custom') {
    targetRatio = customAspectW / customAspectH;
  } else {
    const [aw, ah] = aspectType.split(':').map(Number);
    targetRatio = aw / ah;
  }

  const currentRatio = baseW / baseH;
  let ew = baseW;
  let eh = baseH;

  if (targetRatio > currentRatio) {
    eh = baseW / targetRatio; // 上下クロップ
  } else {
    ew = baseH * targetRatio; // 左右クロップ
  }

  const calcFOV = (d: number) => 2 * Math.atan(d / (2 * focalLength)) * (180 / Math.PI);
  
  const hFov = calcFOV(ew);
  const vFov = calcFOV(eh);
  const dFov = calcFOV(Math.sqrt(ew * ew + eh * eh));

  let targetRatioStr = 'Original';
  if (aspectType === 'custom') {
    targetRatioStr = `${targetRatio.toFixed(2)}:1`;
  } else if (aspectType !== 'original') {
    targetRatioStr = aspectType;
  }

  return { hFov, vFov, dFov, ew, eh, targetRatioStr };
}

// ========== 被写界深度計算 ==========

export interface DoFResult {
  /** ハイパーフォーカル距離（m） */
  hyperfocalM: number;
  /** 被写界深度・近点（m） */
  nearLimitM: number;
  /** 被写界深度・遠点（m）：無限大の場合は Infinity */
  farLimitM: number;
  /** 合焦深度の幅（m）：無限大の場合は Infinity */
  totalDoFM: number;
  /** 前ボケ範囲（m） */
  frontBokeM: number;
  /** 後ボケ範囲（m）：無限大の場合は Infinity */
  rearBokeM: number;
}

/**
 * 被写界深度（DoF）を計算する
 * @param focalLength - 焦点距離（mm）
 * @param fNumber - F値（絞り値）
 * @param focusDistanceM - フォーカス距離（m）
 * @param sensorW - センサー横幅（mm）
 * @param sensorH - センサー縦幅（mm）
 */
export function calculateDoF(
  focalLength: number,
  fNumber: number,
  focusDistanceM: number,
  sensorW: number,
  sensorH: number
): DoFResult {
  // 許容錯乱円（CoC）: センサー対角線の 1/1500 が一般的な基準
  const sensorDiagMm = Math.sqrt(sensorW * sensorW + sensorH * sensorH);
  const cocMm = sensorDiagMm / 1500;

  const fMm = focalLength; // mm
  const dMm = focusDistanceM * 1000; // m -> mm に変換

  // ハイパーフォーカル距離（mm）: H = f² / (N × c) + f
  const hyperfocalMm = (fMm * fMm) / (fNumber * cocMm) + fMm;
  const hyperfocalM = hyperfocalMm / 1000;

  // 被写界深度・近点（mm）: Dn = d(H-f) / (H + d - 2f)
  const nearLimitMm = (dMm * (hyperfocalMm - fMm)) / (hyperfocalMm + dMm - 2 * fMm);
  const nearLimitM = Math.max(nearLimitMm / 1000, 0);

  // 被写界深度・遠点（mm）: Df = d(H-f) / (H - d)
  let farLimitM: number;
  if (dMm >= hyperfocalMm) {
    // フォーカス距離がハイパーフォーカル距離以上 → 無限遠まで合焦
    farLimitM = Infinity;
  } else {
    const farLimitMm = (dMm * (hyperfocalMm - fMm)) / (hyperfocalMm - dMm);
    farLimitM = farLimitMm / 1000;
  }

  const totalDoFM = farLimitM === Infinity ? Infinity : farLimitM - nearLimitM;
  const frontBokeM = focusDistanceM - nearLimitM;
  const rearBokeM = farLimitM === Infinity ? Infinity : farLimitM - focusDistanceM;

  return { hyperfocalM, nearLimitM, farLimitM, totalDoFM, frontBokeM, rearBokeM };
}
