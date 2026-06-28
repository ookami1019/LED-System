import React, { useState, useCallback } from 'react';
import { CINEMA_CAMERAS } from '../types';
import type { PresetType, AspectRatioType } from '../types';
import type { SensorCategory } from '../App';

interface ParameterPanelProps {
  focalLength: number;
  setFocalLength: (v: number) => void;
  sensorCategory: SensorCategory;
  setSensorCategory: (v: SensorCategory) => void;
  preset: PresetType;
  setPreset: (v: PresetType) => void;
  cinemaCameraId: string;
  setCinemaCameraId: (v: string) => void;
  cinemaModeIdx: number;
  setCinemaModeIdx: (v: number) => void;
  aspectType: AspectRatioType;
  setAspectType: (v: AspectRatioType) => void;
  sensorW: number;
  setSensorW: (v: number) => void;
  sensorH: number;
  setSensorH: (v: number) => void;
  customAspectW: number;
  setCustomAspectW: (v: number) => void;
  customAspectH: number;
  setCustomAspectH: (v: number) => void;
  unit: 'm' | 'ft';
  setUnit: (v: 'm' | 'ft') => void;
  fNumber: number;
  setFNumber: (v: number) => void;
  focusDistanceM: number;
  setFocusDistanceM: (v: number) => void;
  isAutoFocus: boolean;
  setIsAutoFocus: (v: boolean) => void;
}

const FOCAL_SHORTCUTS = [24, 35, 50, 80, 100, 135];

export const ParameterPanel: React.FC<ParameterPanelProps> = ({
  focalLength, setFocalLength,
  sensorCategory, setSensorCategory,
  preset, setPreset,
  cinemaCameraId, setCinemaCameraId,
  cinemaModeIdx, setCinemaModeIdx,
  aspectType, setAspectType,
  sensorW, setSensorW,
  sensorH, setSensorH,
  customAspectW, setCustomAspectW,
  customAspectH, setCustomAspectH,
  unit, setUnit,
  fNumber, setFNumber,
  focusDistanceM, setFocusDistanceM,
  isAutoFocus, setIsAutoFocus,
}) => {
  const inputClass = "block w-full bg-gray-800 text-white rounded-lg border-gray-700 p-2.5 border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors";

  const selectedCinemaCam = CINEMA_CAMERAS.find(c => c.id === cinemaCameraId);

  return (
    <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700/50 shadow-lg backdrop-blur-sm w-full min-w-0 overflow-x-hidden">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-100">
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
        パラメーター設定
      </h2>

      {/* 単位切り替え */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-3">距離の単位 (Unit)</label>
        <div className="flex bg-gray-900 rounded-md border border-gray-700 p-1">
          <button
            onClick={() => setUnit('m')}
            className={`flex-1 py-1.5 text-xs font-bold rounded transition-colors ${unit === 'm' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Meters (m)
          </button>
          <button
            onClick={() => setUnit('ft')}
            className={`flex-1 py-1.5 text-xs font-bold rounded transition-colors ${unit === 'ft' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Feet (ft)
          </button>
        </div>
      </div>

      {/* 焦点距離設定 */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-3">
          <label className="block text-sm font-medium text-gray-300">焦点距離</label>
          <span className="font-mono text-lg font-bold text-blue-400 bg-blue-900/30 px-3 py-1 rounded-md">{focalLength} mm</span>
        </div>
        <input 
          type="range" 
          min="8" max="200" 
          value={focalLength} 
          onChange={(e) => setFocalLength(Number(e.target.value))}
          className="mb-4"
        />
        <div className="flex overflow-x-auto gap-2 pb-3 mb-2 hide-scrollbar snap-x">
          {FOCAL_SHORTCUTS.map(f => (
            <button
              key={f}
              onClick={() => setFocalLength(f)}
              className={`flex-shrink-0 min-w-[5rem] px-2 py-2.5 text-sm md:text-base font-bold rounded-xl transition-all shadow-sm snap-center ${
                focalLength === f 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 border border-blue-400' 
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {f}mm
            </button>
          ))}
        </div>
        <div className="relative">
          <input 
            type="number" 
            min="1" 
            value={focalLength} 
            onChange={(e) => setFocalLength(Number(e.target.value))}
            className={`${inputClass} pr-10`}
          />
          <span className="absolute right-3 top-2.5 text-gray-500 text-sm">mm</span>
        </div>
      </div>

      {/* センサーサイズ設定 */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-3 text-gray-300">センサーフォーマット</label>
        
        {/* カテゴリ切り替えボタン */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-gray-800 rounded-lg mb-4">
          <button
            onClick={() => setSensorCategory('stills')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${sensorCategory === 'stills' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            汎用/スチール
          </button>
          <button
            onClick={() => setSensorCategory('cinema')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${sensorCategory === 'cinema' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            シネマカメラ
          </button>
          <button
            onClick={() => { setSensorCategory('custom'); setPreset('custom'); }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${sensorCategory === 'custom' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            カスタム
          </button>
        </div>

        {/* 汎用・スチール向けUI */}
        {sensorCategory === 'stills' && (
          <div className="space-y-2">
            <select 
              value={preset} 
              onChange={(e) => setPreset(e.target.value as PresetType)}
              className={`${inputClass}`}
            >
              <option value="full">フルサイズ (36x24mm)</option>
              <option value="super35">Super 35 (24.89x18.66mm)</option>
              <option value="apsc">APS-C (23.6x15.6mm)</option>
              <option value="mft">マイクロフォーサーズ (17.3x13mm)</option>
            </select>
            <div className="flex justify-between items-center px-1">
              <span className="text-xs text-gray-400">センサー寸法:</span>
              <span className="text-sm font-mono font-bold text-blue-300 bg-blue-900/40 px-2 py-1 rounded border border-blue-700/50">
                {sensorW} × {sensorH} mm
              </span>
            </div>
          </div>
        )}

        {/* シネマカメラ向けUI */}
        {sensorCategory === 'cinema' && (
          <div className="space-y-3 animate-in fade-in duration-300">
            <select 
              value={cinemaCameraId} 
              onChange={(e) => {
                setCinemaCameraId(e.target.value);
                setCinemaModeIdx(0); // 機種を変えたらモードを一番上にリセット
              }}
              className={`${inputClass}`}
            >
              {CINEMA_CAMERAS.map(cam => (
                <option key={cam.id} value={cam.id}>{cam.name}</option>
              ))}
            </select>

            {selectedCinemaCam && (
              <div className="space-y-2">
                <select 
                  value={cinemaModeIdx} 
                  onChange={(e) => setCinemaModeIdx(Number(e.target.value))}
                  className={`${inputClass} text-sm`}
                >
                  {selectedCinemaCam.modes.map((mode, idx) => (
                    <option key={idx} value={idx}>
                      {mode.name} ({mode.w}x{mode.h}mm)
                    </option>
                  ))}
                </select>
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs text-gray-400">収録センサー寸法:</span>
                  <span className="text-sm font-mono font-bold text-blue-300 bg-blue-900/40 px-2 py-1 rounded border border-blue-700/50">
                    {selectedCinemaCam.modes[cinemaModeIdx]?.w} × {selectedCinemaCam.modes[cinemaModeIdx]?.h} mm
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* カスタム入力UI */}
        {sensorCategory === 'custom' && (
          <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="relative">
              <input type="number" step="0.1" value={sensorW} onChange={(e) => setSensorW(Number(e.target.value))} className={`${inputClass} pr-8`} placeholder="幅" />
              <span className="absolute right-3 top-2.5 text-gray-500 text-sm">W</span>
            </div>
            <div className="relative">
              <input type="number" step="0.1" value={sensorH} onChange={(e) => setSensorH(Number(e.target.value))} className={`${inputClass} pr-8`} placeholder="高" />
              <span className="absolute right-3 top-2.5 text-gray-500 text-sm">H</span>
            </div>
          </div>
        )}
      </div>

      {/* アスペクト比設定 */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-3 text-gray-300">アスペクト比クロップ (任意)</label>
        <select 
          value={aspectType} 
          onChange={(e) => setAspectType(e.target.value as AspectRatioType)}
          className={`${inputClass} mb-3`}
        >
          <option value="original">センサーオリジナル (クロップなし)</option>
          <option value="16:9">16:9 (標準ビデオ)</option>
          <option value="9:16">9:16 (縦型動画)</option>
          <option value="2.35:1">2.35:1 (シネマスコープ)</option>
          <option value="custom">カスタム比率入力</option>
        </select>
        
        {aspectType === 'custom' && (
          <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="relative">
              <input type="number" step="0.1" value={customAspectW} onChange={(e) => setCustomAspectW(Number(e.target.value))} className={`${inputClass} pr-8`} placeholder="横" />
              <span className="absolute right-3 top-2.5 text-gray-500 text-sm">W</span>
            </div>
            <div className="relative">
              <input type="number" step="0.1" value={customAspectH} onChange={(e) => setCustomAspectH(Number(e.target.value))} className={`${inputClass} pr-8`} placeholder="縦" />
              <span className="absolute right-3 top-2.5 text-gray-500 text-sm">H</span>
            </div>
          </div>
        )}
      </div>

      {/* F値（絞り）設定 */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-3">
          <label className="block text-sm font-medium text-gray-300">絞り (F値)</label>
          <span className="font-mono text-lg font-bold text-amber-400 bg-amber-900/30 px-3 py-1 rounded-md">F{fNumber}</span>
        </div>
        <input
          type="range"
          min="1"
          max="22"
          step="0.1"
          value={fNumber}
          onChange={(e) => setFNumber(Number(e.target.value))}
          className="mb-4 accent-amber-400"
        />
        <div className="flex overflow-x-auto gap-2 pb-3 hide-scrollbar snap-x">
          {[1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22].map(f => (
            <button
              key={f}
              onClick={() => setFNumber(f)}
              className={`flex-shrink-0 min-w-[5rem] px-2 py-2.5 text-sm md:text-base font-bold rounded-xl transition-all shadow-sm snap-center ${
                fNumber === f
                  ? 'bg-amber-500 text-gray-900 shadow-lg shadow-amber-900/50 border border-amber-400 font-black'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:text-white'
              }`}
            >
              F{f}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          {fNumber <= 2.8 ? '開放: ボケ大きく、光量多い' : fNumber >= 11 ? '絞り: 被写界深度が広く、光量少ない' : '標準的な絞り値'}
        </p>
      </div>

      {/* フォーカス距離設定 */}
      <div>
        {/* ラベル行 + AF トグル */}
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-300">フォーカス距離</label>
          <div className="flex items-center gap-2">
            {/* AF トグルボタン */}
            <button
              onClick={() => setIsAutoFocus(!isAutoFocus)}
              className={`relative inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border transition-all duration-200 ${
                isAutoFocus
                  ? 'bg-green-500 border-green-400 text-white shadow-md shadow-green-900/40'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isAutoFocus ? 'bg-white animate-pulse' : 'bg-gray-500'}`} />
              {isAutoFocus ? 'AF ON' : 'AF OFF'}
            </button>
          </div>
        </div>

        {/* AF ON 時は人物にフォーカス中と表示 */}
        {isAutoFocus && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-green-900/30 border border-green-700/40 text-green-300 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
            人物（{unit === 'm' ? '15m' : '49.2ft'}）にフォーカス固定中
          </div>
        )}

        {/* ===== マニュアルフォーカスUI（AF OFF 時のみ有効） ===== */}
        <div className={`transition-opacity ${isAutoFocus ? 'opacity-30 pointer-events-none' : ''}`}>

          {/* 距離表示 + 直接入力 */}
          <FocusDistanceInput
            focusDistanceM={focusDistanceM}
            setFocusDistanceM={setFocusDistanceM}
            unit={unit}
          />

          {/* 対数スケールスライダー */}
          <FocusLogSlider
            focusDistanceM={focusDistanceM}
            setFocusDistanceM={setFocusDistanceM}
            unit={unit}
          />

          {/* 微調整ボタン */}
          <FocusFineAdjust
            focusDistanceM={focusDistanceM}
            setFocusDistanceM={setFocusDistanceM}
            unit={unit}
          />

          {/* プリセットショートカットは削除し、微調整ボタンのみに統一 */}
        </div>
      </div>
    </div>
  );
};

// ===== 対数スケールスライダー =====
// 近距離（cm単位）から遠距離（m単位）まで自然な操作感を実現
const MIN_DIST_M = 0.3;  // 30cm（最短）
const MAX_DIST_M = 100;  // 100m（最長）
const LOG_STEPS = 10000; // スライダーの内部分解能

const sliderToDistance = (v: number): number =>
  MIN_DIST_M * Math.pow(MAX_DIST_M / MIN_DIST_M, v / LOG_STEPS);

const distanceToSlider = (d: number): number =>
  Math.round(Math.log(d / MIN_DIST_M) / Math.log(MAX_DIST_M / MIN_DIST_M) * LOG_STEPS);

const FocusLogSlider: React.FC<{
  focusDistanceM: number;
  setFocusDistanceM: (v: number) => void;
  unit: 'm' | 'ft';
}> = ({ focusDistanceM, setFocusDistanceM, unit }) => {
  const labels = unit === 'm' 
    ? ['0.3m', '1m', '3m', '10m', '30m', '100m']
    : ['1ft', '3ft', '10ft', '30ft', '100ft', '330ft'];

  return (
    <div className="relative my-2">
      <input
        type="range"
        min={0}
        max={LOG_STEPS}
        step={1}
        value={distanceToSlider(Math.max(MIN_DIST_M, Math.min(MAX_DIST_M, focusDistanceM)))}
        onChange={(e) => {
          const d = sliderToDistance(Number(e.target.value));
          setFocusDistanceM(Math.round(d * 1000) / 1000); // 1mm精度で丸め
        }}
        className="w-full accent-amber-400"
      />
      {/* スケールラベル */}
      <div className="flex justify-between text-[10px] text-gray-600 mt-0.5 px-0.5">
        {labels.map((l, i) => <span key={i}>{l}</span>)}
      </div>
    </div>
  );
};

// ===== cm/mm 微調整ボタン =====
const FocusFineAdjust: React.FC<{
  focusDistanceM: number;
  setFocusDistanceM: (v: number) => void;
  unit: 'm' | 'ft';
}> = ({ focusDistanceM, setFocusDistanceM, unit }) => {
  const adjust = useCallback((deltaMm: number) => {
    const deltaM = deltaMm / 1000;
    const next = Math.max(MIN_DIST_M, Math.min(MAX_DIST_M, focusDistanceM + deltaM));
    setFocusDistanceM(Math.round(next * 1000) / 1000);
  }, [focusDistanceM, setFocusDistanceM]);

  // metric: mm/cm 刻み、imperial: 1/16in・1in 刻み
  const steps = unit === 'm'
    ? [
        { label: '−10cm', delta: -100 },
        { label: '−1cm',  delta: -10  },
        { label: '−1mm',  delta: -1   },
        { label: '+1mm',  delta: +1   },
        { label: '+1cm',  delta: +10  },
        { label: '+10cm', delta: +100 },
      ]
    : [
        // imperial: 1ft ≈ 304.8mm, 1in ≈ 25.4mm
        { label: '−1ft',   delta: -304.8  },
        { label: '−1in',   delta: -25.4   },
        { label: '−¼in',   delta: -6.35   },
        { label: '+¼in',   delta: +6.35   },
        { label: '+1in',   delta: +25.4   },
        { label: '+1ft',   delta: +304.8  },
      ];

  return (
    <div className="mt-2">
      <p className="text-[10px] text-gray-500 mb-1.5">微調整（フォーカスプリング）</p>
      <div className="grid grid-cols-3 gap-2">
        {steps.map(({ label, delta }) => (
          <button
            key={label}
            onClick={() => adjust(delta)}
            className={`py-3 px-1 whitespace-nowrap text-sm sm:text-base font-mono font-bold rounded-xl transition-all shadow-sm ${
              delta < 0
                ? 'bg-blue-900/40 text-blue-300 hover:bg-blue-800/60 border border-blue-700/50 hover:border-blue-500 hover:text-white'
                : 'bg-rose-900/40 text-rose-300 hover:bg-rose-800/60 border border-rose-700/50 hover:border-rose-500 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

// ===== 数値直接入力 + 精密表示 =====
const FocusDistanceInput: React.FC<{
  focusDistanceM: number;
  setFocusDistanceM: (v: number) => void;
  unit: 'm' | 'ft';
}> = ({ focusDistanceM, setFocusDistanceM, unit }) => {
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState('');

  const displayValue = unit === 'm'
    ? `${focusDistanceM.toFixed(3)}m`        // mm精度 例: 15.123m
    : (() => {
        const totalIn = focusDistanceM * 39.3701;
        const ft = Math.floor(totalIn / 12);
        const inch = totalIn % 12;
        return `${ft}'${inch.toFixed(2)}"`; // 例: 49'7.25"
      })();

  const handleCommit = (s: string) => {
    setEditing(false);
    const num = parseFloat(s);
    if (isNaN(num) || num <= 0) return;
    const inM = unit === 'm' ? num : num / 3.28084;
    setFocusDistanceM(Math.max(MIN_DIST_M, Math.min(MAX_DIST_M, Math.round(inM * 1000) / 1000)));
  };

  return (
    <div className="flex items-center gap-2 mb-1">
      <span className="text-xs text-gray-500 shrink-0">距離:</span>
      {editing ? (
        <input
          type="number"
          autoFocus
          step={unit === 'm' ? 0.001 : 0.1}
          defaultValue={unit === 'm' ? focusDistanceM : focusDistanceM * 3.28084}
          className="flex-1 min-w-0 bg-gray-900 border border-amber-500 text-amber-300 text-sm font-mono rounded px-2 py-0.5 focus:outline-none"
          onChange={(e) => setRaw(e.target.value)}
          onBlur={(e) => handleCommit(raw || e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCommit(raw || (e.target as HTMLInputElement).value);
            if (e.key === 'Escape') setEditing(false);
          }}
        />
      ) : (
        <button
          onClick={() => { setRaw(''); setEditing(true); }}
          className="flex-1 text-left font-mono text-xl font-bold text-amber-400 bg-amber-900/20 hover:bg-amber-900/40 border border-amber-500/20 hover:border-amber-400/50 px-3 py-1 rounded-lg transition-all"
          title="クリックして直接入力"
        >
          {displayValue}
          <span className="ml-1.5 text-xs text-amber-600/70 font-normal">✏️</span>
        </button>
      )}
      <span className="text-[10px] text-gray-600 shrink-0">{unit === 'm' ? '±1mm' : '±0.01"'}</span>
    </div>
  );
};
