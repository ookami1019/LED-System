import React from 'react';
import type { DoFResult } from '../utils/math';



/** 距離を表示用文字列に変換する（無限大対応） */
const formatDist = (m: number, unit: 'm' | 'ft'): string => {
  if (!isFinite(m)) return '∞';
  if (unit === 'ft') {
    const ft = m * 3.28084;
    return ft >= 100 ? `${ft.toFixed(0)}ft` : `${ft.toFixed(1)}ft`;
  }
  return m >= 100 ? `${m.toFixed(0)}m` : `${m.toFixed(2)}m`;
};

export const FovDisplay: React.FC<{ hFov: number; vFov: number; dFov: number }> = ({ hFov, vFov, dFov }) => {
  return (
    <div className="grid grid-cols-3 gap-3 text-center mb-4 md:mb-6">
      <div className="bg-gray-800 p-3 md:p-4 rounded-xl border border-gray-700 shadow-md">
        <div className="text-xs text-blue-400 mb-1 font-medium tracking-wider">水平画角</div>
        <div className="text-xl md:text-2xl font-bold text-blue-100">{hFov.toFixed(1)}°</div>
      </div>
      <div className="bg-gray-800 p-3 md:p-4 rounded-xl border border-gray-700 shadow-md">
        <div className="text-xs text-green-400 mb-1 font-medium tracking-wider">垂直画角</div>
        <div className="text-xl md:text-2xl font-bold text-green-100">{vFov.toFixed(1)}°</div>
      </div>
      <div className="bg-gray-800 p-3 md:p-4 rounded-xl border border-gray-700 shadow-md">
        <div className="text-xs text-purple-400 mb-1 font-medium tracking-wider">対角画角</div>
        <div className="text-xl md:text-2xl font-bold text-purple-100">{dFov.toFixed(1)}°</div>
      </div>
    </div>
  );
};

export const DofDisplay: React.FC<{
  fNumber: number;
  focusDistanceM: number;
  dof: DoFResult;
  unit: 'm' | 'ft';
}> = ({ fNumber, focusDistanceM, dof, unit }) => {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-600 shadow-lg mt-3 overflow-hidden">
      {/* ヘッダー行 */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-700 bg-gray-900/60">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400 shrink-0"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
        <span className="text-sm font-bold text-gray-100 tracking-wider">被写界深度（DoF）</span>
        <span className="ml-auto text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
          F{fNumber} &nbsp;|&nbsp; focus {formatDist(focusDistanceM, unit)}
        </span>
      </div>

      {/* 数値行: コントラストを強化し、値を強調 */}
      <div className="grid grid-cols-4 gap-0 text-center divide-x divide-gray-700/80 bg-gray-800">
        <div className="px-1 py-3">
          <div className="text-[10px] md:text-xs text-gray-300 mb-1 font-medium">近点</div>
          <div className="text-sm md:text-base font-bold text-amber-400">{formatDist(dof.nearLimitM, unit)}</div>
        </div>
        <div className="px-1 py-3">
          <div className="text-[10px] md:text-xs text-gray-300 mb-1 font-medium">遠点</div>
          <div className="text-sm md:text-base font-bold text-amber-400">{formatDist(dof.farLimitM, unit)}</div>
        </div>
        <div className="px-1 py-3 bg-gray-750">
          <div className="text-[10px] md:text-xs text-gray-300 mb-1 font-medium">DoF幅</div>
          <div className="text-sm md:text-base font-bold text-amber-400">{formatDist(dof.totalDoFM, unit)}</div>
        </div>
        <div className="px-1 py-3">
          <div className="text-[10px] md:text-xs text-gray-400 mb-1 font-medium">過焦点</div>
          <div className="text-sm md:text-base font-bold text-gray-100">{formatDist(dof.hyperfocalM, unit)}</div>
        </div>
      </div>

      {/* ビジュアルバー */}
      <div className="px-4 py-2.5 border-t border-gray-700 bg-gray-900/40">
        <DoFBar focusDistanceM={focusDistanceM} dof={dof} unit={unit} />
      </div>
    </div>
  );
};

/** DoF 範囲を視覚的に表示するバー */
const DoFBar: React.FC<{ focusDistanceM: number; dof: DoFResult; unit: 'm' | 'ft' }> = ({ focusDistanceM, dof, unit }) => {
  // バーの表示スケール：過焦点距離か50mの小さい方を上限にする
  const maxDisplayM = Math.min(isFinite(dof.hyperfocalM) ? dof.hyperfocalM * 1.2 : 100, 100);

  const toPercent = (m: number) => Math.min((m / maxDisplayM) * 100, 100);

  const nearPct = toPercent(dof.nearLimitM);
  const focusPct = toPercent(focusDistanceM);
  const farPct = dof.farLimitM === Infinity ? 100 : toPercent(dof.farLimitM);
  const dofWidth = farPct - nearPct;

  return (
    <div className="relative h-4 rounded-full bg-gray-700 overflow-hidden shadow-inner border border-gray-600">
      {/* DoF範囲（合焦帯） */}
      <div
        className="absolute top-0 h-full rounded-full bg-amber-500/60 border-x border-amber-400 shadow-sm"
        style={{ left: `${nearPct}%`, width: `${dofWidth}%` }}
      />
      {/* フォーカス点 */}
      <div
        className="absolute top-0 h-full w-0.5 bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)]"
        style={{ left: `${focusPct}%` }}
      />
      {/* 目盛ラベル */}
      <div className="absolute inset-0 flex justify-between items-end px-1.5 pb-px">
        <span className="text-[9px] font-bold text-gray-300 drop-shadow-md">0</span>
        <span className="text-[9px] font-bold text-gray-300 drop-shadow-md">{formatDist(maxDisplayM, unit).replace('.0','')}</span>
      </div>
    </div>
  );
};
