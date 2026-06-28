import { useState } from 'react';
import { ShutterSyncAnalyzer } from './components/ShutterSyncAnalyzer';
import { GlossaryModal } from './components/GlossaryModal';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);

  const openGlossary = () => {
    setIsMenuOpen(false);
    setIsGlossaryOpen(true);
  };

  return (
    <div
      className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-gray-950 to-gray-900 text-gray-100 selection:bg-blue-500/30 flex flex-col"
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

      <div className="max-w-6xl mx-auto px-safe p-3 md:p-8 flex-1 flex flex-col w-full">
        <GlossaryModal isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />

        <header className="mb-4 md:mb-8 text-center relative shrink-0">
          {/* PCのみ：用語説明ボタンを右上に表示 */}
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
          
          {/* モバイルのみ：ハンバーガーボタン */}
          <button
            onClick={() => setIsMenuOpen(prev => !prev)}
            className="lg:hidden absolute right-0 top-0 shrink-0 flex flex-col justify-center items-center w-9 h-9 rounded-lg active:scale-90 transition-transform"
            style={{ background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(148,163,184,0.2)', zIndex: 65 }}
            aria-label="メニューを開く"
          >
            <span className={`block h-px bg-gray-300 transition-all duration-250 ${isMenuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} style={{ width: '18px' }} />
            <span className={`block h-px bg-gray-300 mt-1 transition-all duration-250 ${isMenuOpen ? 'opacity-0 w-0' : ''}`} style={{ width: '18px' }} />
            <span className={`block h-px bg-gray-300 mt-1 transition-all duration-250 ${isMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} style={{ width: '18px' }} />
          </button>

          <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold mb-2 md:mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight leading-tight px-10 lg:px-0">
            ShutterSync<br className="sm:hidden" /> Quick Analyzer
          </h1>
          <p className="hidden md:block text-sm text-gray-400 max-w-2xl mx-auto mb-4">
            カメラとLED間の同期トラブル（スキャンラインノイズ等）の診断・セーフアングルの算出を行います。
          </p>
        </header>

        {/* メイン画面表示 */}
        <div className="flex-1 flex flex-col min-h-0">
          <ShutterSyncAnalyzer />
        </div>

        {/* 共通フッター */}
        <footer className="text-center mt-8 py-6 text-xs text-gray-500 shrink-0">
          <p>LED System Portal v1.0 | Designed for DIT, Camera Crew & LED Wall Operators</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
