import { useState } from 'react';
import { ParameterPanel } from './components/ParameterPanel';
import { FovDisplay, DofDisplay } from './components/StatsDisplay';
import { TopViewMap } from './components/TopViewMap';
import { CameraView3D } from './components/CameraView3D';
import { GlossaryModal } from './components/GlossaryModal';
import { useCameraSettings } from './hooks/useCameraSettings';

function App() {
  const cameraSettings = useCameraSettings();
  const [viewMode, setViewMode] = useState<'3d' | 'top'>('3d');
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [isMobileParamOpen, setIsMobileParamOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const {
    angleState,
    dofResult,
    aspect,
    effectiveFocusDistanceM,
    unit,
    fNumber,
    isAutoFocus,
    isDofEnabled,
    setFocusDistanceM,
    setIsAutoFocus
  } = cameraSettings;

  const openGlossary = () => {
    setIsMenuOpen(false);
    setIsGlossaryOpen(true);
  };

  const handleFocusUpdate = (dist: number) => {
    setIsAutoFocus(false); // マニュアルフォーカスに切り替え
    setFocusDistanceM(dist);
  };

  const HamburgerButton = () => (
    <button
      id="hamburger-menu-btn"
      onClick={() => setIsMenuOpen(prev => !prev)}
      className="shrink-0 flex flex-col justify-center items-center w-9 h-9 rounded-lg active:scale-90 transition-transform lg:hidden"
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
      className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-100 selection:bg-blue-500/30 flex flex-col"
      style={{ paddingTop: 'max(env(safe-area-inset-top), 16px)' }}
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

      {/* ========== スライドインメニュー（モバイル用） ========== */}
      <div className="lg:hidden">
        {isMenuOpen && (
          <div
            className="fixed inset-0"
            style={{ zIndex: 55, background: 'rgba(0,0,0,0.4)' }}
            onClick={() => setIsMenuOpen(false)}
          />
        )}
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

      <div className="max-w-7xl mx-auto px-safe p-3 md:p-8 flex-1 flex flex-col w-full">
        <header className="mb-4 md:mb-6 text-center relative shrink-0">
          <button
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
          <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight leading-tight">
            カメラ画角 ＆ 圧縮効果シミュレーター
          </h1>
          <p className="hidden md:block text-sm text-gray-400 max-w-2xl mx-auto">
            焦点距離・センサーサイズ・アスペクト比を変えながら、画角と圧縮効果をリアルタイムで確認できます。
          </p>
        </header>

        <GlossaryModal isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />

        <div className="shrink-0 mb-4">
          <FovDisplay hFov={angleState.hFov} vFov={angleState.vFov} dFov={angleState.dFov} />
        </div>

        {/* 
          単一のレスポンシブレイアウト 
          PC: lg:grid-cols-4 (右3: ビューア, 左1: パラメータ)
          Mobile Portrait: flex-col (上: ビューア, 下: アコーディオンパラメータ)
          Mobile Landscape: fixed overlay + grid-cols-3 (右2: ビューア, 左1: パラメータ)
        */}
        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-4 gap-4 md:gap-6 landscape:max-lg:fixed landscape:max-lg:inset-0 landscape:max-lg:z-20 landscape:max-lg:bg-gradient-to-br landscape:max-lg:from-gray-950 landscape:max-lg:to-gray-900 landscape:max-lg:grid landscape:max-lg:grid-cols-3 landscape:max-lg:items-stretch landscape:max-lg:p-safe">
          
          {/* ========== パラメータエリア (PC/横向き: 左, 縦向き: 下) ========== */}
          <div className="lg:col-span-1 landscape:max-lg:col-span-1 landscape:max-lg:overflow-y-auto landscape:max-lg:h-full order-2 lg:order-1 landscape:max-lg:order-1 flex flex-col min-w-0">
            {/* アコーディオン枠 (縦向きスマホのみ) */}
            <div className="portrait:max-lg:rounded-2xl portrait:max-lg:border portrait:max-lg:border-gray-700/50 portrait:max-lg:bg-gray-800/50 portrait:max-lg:backdrop-blur-sm flex-1 lg:h-[80vh] lg:overflow-y-auto lg:pr-2 hide-scrollbar">
              <button
                onClick={() => setIsMobileParamOpen(prev => !prev)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-200 hover:bg-gray-700/50 transition-colors portrait:max-lg:flex lg:hidden landscape:max-lg:hidden"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                  パラメーター設定
                </span>
                <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isMobileParamOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`transition-all duration-300 ease-in-out ${isMobileParamOpen ? 'portrait:max-lg:max-h-[2000px] portrait:max-lg:opacity-100' : 'portrait:max-lg:max-h-0 portrait:max-lg:opacity-0 portrait:max-lg:overflow-hidden'} lg:block landscape:max-lg:block portrait:max-lg:border-t portrait:max-lg:border-gray-700/50`}>
                <ParameterPanel {...cameraSettings} />
              </div>
            </div>
          </div>

          {/* ========== ビューアエリア (PC/横向き: 右, 縦向き: 上) ========== */}
          <div className="lg:col-span-3 landscape:max-lg:col-span-2 flex flex-col gap-2 md:gap-4 order-1 lg:order-2 landscape:max-lg:order-2 landscape:max-lg:h-full min-w-0">
            {/* 切り替えタブ */}
            <div className="flex items-center gap-1.5 p-1 bg-gray-900/80 rounded-xl border border-gray-700/50 backdrop-blur-md shadow-sm shrink-0">
              <button onClick={() => setViewMode('3d')} className={`flex-1 py-1.5 md:py-2.5 text-sm font-semibold rounded-lg transition-all ${viewMode === '3d' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                🎥 3Dカメラビュー
              </button>
              <button onClick={() => setViewMode('top')} className={`flex-1 py-1.5 md:py-2.5 text-sm font-semibold rounded-lg transition-all ${viewMode === 'top' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                🗺️ TOPマップ
              </button>
              <HamburgerButton />
            </div>

            {/* キャンバス */}
            <div className="relative w-full h-[35vh] lg:h-[70vh] landscape:max-lg:flex-1 min-h-[220px] rounded-2xl overflow-hidden border border-gray-700/80 shadow-2xl bg-[#0f172a]">
              {viewMode === '3d' ? (
                <div className="absolute inset-0">
                  <CameraView3D 
                    vFov={angleState.vFov} 
                    aspect={aspect} 
                    targetRatioStr={angleState.targetRatioStr} 
                    unit={unit} 
                    fNumber={fNumber} 
                    focusDistanceM={effectiveFocusDistanceM} 
                    nearLimitM={dofResult.nearLimitM} 
                    farLimitM={dofResult.farLimitM} 
                    isAutoFocus={isAutoFocus} 
                    isDofEnabled={isDofEnabled}
                    onFocusUpdate={handleFocusUpdate}
                  />
                </div>
              ) : (
                <div className="absolute inset-0">
                  <TopViewMap 
                    hFov={angleState.hFov} 
                    unit={unit} 
                    focusDistanceM={effectiveFocusDistanceM} 
                    nearLimitM={dofResult.nearLimitM} 
                    farLimitM={dofResult.farLimitM} 
                  />
                </div>
              )}
            </div>

            {/* DoF表示 */}
            <div className="shrink-0 text-left -mt-1 lg:mt-0">
              <DofDisplay fNumber={fNumber} focusDistanceM={effectiveFocusDistanceM} dof={dofResult} unit={unit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
