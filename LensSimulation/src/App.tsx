import { useState, useMemo } from 'react';
import { ParameterPanel } from './components/ParameterPanel';
import { FovDisplay, DofDisplay } from './components/StatsDisplay';
import { TopViewMap } from './components/TopViewMap';
import { CameraView3D } from './components/CameraView3D';
import { GlossaryModal } from './components/GlossaryModal';
import { calculateFovAndCrop, calculateDoF } from './utils/math';
import { PRESETS, CINEMA_CAMERAS } from './types';
import type { PresetType, AspectRatioType } from './types';

export type SensorCategory = 'stills' | 'cinema' | 'custom';

function App() {
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
  const [viewMode, setViewMode] = useState<'3d' | 'top'>('3d');
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  // モバイル向けパラメーターパネルの開閉管理
  const [isMobileParamOpen, setIsMobileParamOpen] = useState<boolean>(false);
  // F値・フォーカス距離（デフォルト: F5.6, 15m）
  const [fNumber, setFNumber] = useState<number>(5.6);
  const [focusDistanceM, setFocusDistanceM] = useState<number>(15);
  // AF(オートフォーカス): ON時は人物位置（15m）にフォーカス固定
  const [isAutoFocus, setIsAutoFocus] = useState<boolean>(false);
  // ハンバーガーメニューの開閉管理（モバイル用）
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // 人物のシーン上の距離（m）
  const HUMAN_DISTANCE_M = 15;
  // AF ON かマニュアルかに応じて有効なフォーカス距離を決める
  const effectiveFocusDistanceM = isAutoFocus ? HUMAN_DISTANCE_M : focusDistanceM;

  // レンダリング中に現在のセンサーサイズを動的に計算（Derived State）
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

  // メニューを閉じて用語説明を開く
  const openGlossary = () => {
    setIsMenuOpen(false);
    setIsGlossaryOpen(true);
  };

  // ParameterPanelの共通propsをまとめる
  const panelProps = {
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
  };

  // ハンバーガーボタン（タブ行の右端に配置）
  const HamburgerButton = () => (
    <button
      id="hamburger-menu-btn"
      onClick={() => setIsMenuOpen(prev => !prev)}
      className="shrink-0 flex flex-col justify-center items-center w-9 h-9 rounded-lg active:scale-90 transition-transform"
      style={{ background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(148,163,184,0.2)' }}
      aria-label="メニューを開く"
    >
      <span className={`block w-4.5 h-px bg-gray-300 transition-all duration-250 ${isMenuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} style={{ width: '18px' }} />
      <span className={`block h-px bg-gray-300 mt-1 transition-all duration-250 ${isMenuOpen ? 'opacity-0 w-0' : ''}`} style={{ width: '18px' }} />
      <span className={`block h-px bg-gray-300 mt-1 transition-all duration-250 ${isMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} style={{ width: '18px' }} />
    </button>
  );

  return (
    <div
      className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-gray-950 to-gray-900 text-gray-100 selection:bg-blue-500/30"
      style={{ paddingTop: 'max(env(safe-area-inset-top), 20px)' }}
    >
      {/* ========== ポータルへ戻るボタン (PC用) ========== */}
      <a
        href="/"
        className="fixed left-4 z-50 items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition-colors hidden lg:flex"
        style={{ top: 'max(env(safe-area-inset-top, 16px), 16px)', background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(148,163,184,0.15)', backdropFilter: 'blur(8px)' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Portal
      </a>
      {/* ========== スライドインメニュー（モバイル用、lg未満のみ） ========== */}
      <div className="lg:hidden">
        {/* オーバーレイ：メニュー外タップで閉じる */}
        {isMenuOpen && (
          <div
            className="fixed inset-0"
            style={{ zIndex: 55, background: 'rgba(0,0,0,0.4)' }}
            onClick={() => setIsMenuOpen(false)}
          />
        )}
        {/* ドロワー本体 */}
        <div
          className="fixed top-0 right-0 bottom-0 w-52 flex flex-col gap-2 px-3 transition-transform duration-300 ease-out"
          style={{
            zIndex: 60,
            transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
            background: 'rgba(10, 18, 35, 0.94)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderLeft: '1px solid rgba(148,163,184,0.12)',
            boxShadow: '-12px 0 40px rgba(0,0,0,0.5)',
            paddingTop: 'calc(max(env(safe-area-inset-top), 16px) + 52px)',
            paddingBottom: 'max(env(safe-area-inset-bottom), 24px)',
          }}
        >
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mb-1">メニュー</p>
          <a
            href="/"
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-semibold text-gray-100 active:bg-blue-600/30 transition-colors text-left"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(148,163,184,0.08)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400 shrink-0">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Portalに戻る
          </a>
          <button
            id="glossary-drawer-item"
            onClick={openGlossary}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-semibold text-gray-100 active:bg-blue-600/30 transition-colors text-left"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(148,163,184,0.08)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400 shrink-0">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            用語説明
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-safe p-3 md:p-8">
        <header className="mb-4 md:mb-8 text-center relative">
          {/* PCのみ：用語説明ボタンを右上に表示 */}
          <button
            id="pc-glossary-btn"
            onClick={() => setIsGlossaryOpen(true)}
            className="hidden lg:flex absolute right-0 top-0 items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition-colors"
            style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(148,163,184,0.15)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            用語説明
          </button>
          <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold mb-2 md:mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight leading-tight">
            カメラ画角 ＆ <br className="sm:hidden" />圧縮効果シミュレーター
          </h1>
          <p className="hidden md:block text-sm text-gray-400 max-w-2xl mx-auto mb-4">
            焦点距離・センサーサイズ・アスペクト比を変えながら、画角と圧縮効果をリアルタイムで確認できます。
          </p>
        </header>

        <GlossaryModal isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />

        <FovDisplay hFov={angleState.hFov} vFov={angleState.vFov} dFov={angleState.dFov} />

        {/* ===== PCレイアウト（lg以上）: 左右2カラム ===== */}
        <div className="hidden lg:grid grid-cols-4 gap-6 items-start">
          <div className="col-span-1">
            <ParameterPanel {...panelProps} />
          </div>
          <div className="col-span-3 flex flex-col gap-4 sticky top-4 z-40">
            <div className="flex items-center p-1.5 bg-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur-md shadow-sm">
              <button onClick={() => setViewMode('3d')} className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${viewMode === '3d' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                🎥 3Dカメラビュー
              </button>
              <button onClick={() => setViewMode('top')} className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${viewMode === 'top' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                🗺️ TOPマップ
              </button>
            </div>
            <div className="relative w-full h-[70vh] min-h-[500px] rounded-2xl overflow-hidden border border-gray-700/80 shadow-2xl bg-[#0f172a]">
              {viewMode === '3d' ? (
                <div className="absolute inset-0"><CameraView3D vFov={angleState.vFov} aspect={aspect} targetRatioStr={angleState.targetRatioStr} unit={unit} fNumber={fNumber} focusDistanceM={effectiveFocusDistanceM} nearLimitM={dofResult.nearLimitM} farLimitM={dofResult.farLimitM} isAutoFocus={isAutoFocus} /></div>
              ) : (
                <div className="absolute inset-0"><TopViewMap hFov={angleState.hFov} unit={unit} focusDistanceM={effectiveFocusDistanceM} nearLimitM={dofResult.nearLimitM} farLimitM={dofResult.farLimitM} /></div>
              )}
            </div>
            <DofDisplay fNumber={fNumber} focusDistanceM={effectiveFocusDistanceM} dof={dofResult} unit={unit} />
          </div>
        </div>

        {/* ===== モバイル 縦向き（Portrait）レイアウト（lg未満） ===== */}
        <div className="flex flex-col lg:!hidden max-lg:landscape:!hidden">
          {/* ▼ sticky コンテナ ▼ */}
          <div className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-xl pt-2 pb-3 mb-3 -mx-3 px-3 shadow-2xl border-b border-gray-800/80">
            {/* ビュー切り替えタブ + ハンバーガーメニュー */}
            <div className="flex items-center gap-2 p-1 mb-2 bg-gray-900/80 rounded-xl border border-gray-700/50 backdrop-blur-md">
              <button onClick={() => setViewMode('3d')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${viewMode === '3d' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                🎥 3Dビュー
              </button>
              <button onClick={() => setViewMode('top')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${viewMode === 'top' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                🗺️ TOPマップ
              </button>
              <HamburgerButton />
            </div>

            {/* ビューエリア */}
            <div className="relative w-full h-[35vh] min-h-[220px] rounded-2xl overflow-hidden border border-gray-700/80 shadow-inner bg-[#0f172a]">
              {viewMode === '3d' ? (
                <div className="absolute inset-0"><CameraView3D vFov={angleState.vFov} aspect={aspect} targetRatioStr={angleState.targetRatioStr} unit={unit} fNumber={fNumber} focusDistanceM={effectiveFocusDistanceM} nearLimitM={dofResult.nearLimitM} farLimitM={dofResult.farLimitM} isAutoFocus={isAutoFocus} /></div>
              ) : (
                <div className="absolute inset-0"><TopViewMap hFov={angleState.hFov} unit={unit} focusDistanceM={effectiveFocusDistanceM} nearLimitM={dofResult.nearLimitM} farLimitM={dofResult.farLimitM} /></div>
              )}
            </div>

            <div className="text-left -mt-1">
              <DofDisplay fNumber={fNumber} focusDistanceM={effectiveFocusDistanceM} dof={dofResult} unit={unit} />
            </div>
          </div>
          {/* ▲ sticky コンテナ終了 ▲ */}

          {/* アコーディオン：パラメーターパネル */}
          <div className="rounded-2xl border border-gray-700/50 overflow-hidden bg-gray-800/50 backdrop-blur-sm">
            <button
              onClick={() => setIsMobileParamOpen(prev => !prev)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-200 hover:bg-gray-700/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                パラメーター設定
              </span>
              <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isMobileParamOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isMobileParamOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="border-t border-gray-700/50">
                <ParameterPanel {...panelProps} />
              </div>
            </div>
          </div>
        </div>

        {/* ===== モバイル 横向き（Landscape）レイアウト（lg未満） ===== */}
        {/* position:fixed でビューポートに完全固定 */}
        <div
          className="hidden max-lg:landscape:grid lg:!hidden grid-cols-3 gap-2 items-stretch bg-gradient-to-br from-gray-950 to-gray-900"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 20,
            paddingTop: 'max(env(safe-area-inset-top), 16px)',
            paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
            paddingLeft: 'max(env(safe-area-inset-left), 8px)',
            paddingRight: 'max(env(safe-area-inset-right), 8px)',
          }}
        >
          {/* 左側1/3: パラメーターパネル（スクロール可能） */}
          <div className="col-span-1 min-w-0 h-full overflow-y-auto overflow-x-hidden hide-scrollbar rounded-xl bg-gray-800/30 border border-gray-700/50 shadow-inner">
            <ParameterPanel {...panelProps} />
          </div>

          {/* 右側2/3: ビューアーと結果表示 */}
          <div className="col-span-2 min-w-0 flex flex-col gap-2 h-full">
            {/* ビュー切り替えタブ + ハンバーガーメニュー */}
            <div className="flex items-center gap-1.5 p-1 bg-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur-md shadow-sm shrink-0">
              <button onClick={() => setViewMode('3d')} className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${viewMode === '3d' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                🎥 3Dカメラビュー
              </button>
              <button onClick={() => setViewMode('top')} className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${viewMode === 'top' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                🗺️ TOPマップ
              </button>
              <HamburgerButton />
            </div>

            <div className="relative flex-1 rounded-2xl overflow-hidden border border-gray-700/80 shadow-2xl bg-[#0f172a]">
              {viewMode === '3d' ? (
                <div className="absolute inset-0"><CameraView3D vFov={angleState.vFov} aspect={aspect} targetRatioStr={angleState.targetRatioStr} unit={unit} fNumber={fNumber} focusDistanceM={effectiveFocusDistanceM} nearLimitM={dofResult.nearLimitM} farLimitM={dofResult.farLimitM} isAutoFocus={isAutoFocus} /></div>
              ) : (
                <div className="absolute inset-0"><TopViewMap hFov={angleState.hFov} unit={unit} focusDistanceM={effectiveFocusDistanceM} nearLimitM={dofResult.nearLimitM} farLimitM={dofResult.farLimitM} /></div>
              )}
            </div>

            <div className="shrink-0">
              <DofDisplay fNumber={fNumber} focusDistanceM={effectiveFocusDistanceM} dof={dofResult} unit={unit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
