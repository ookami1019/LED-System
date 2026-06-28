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
    <>
      {/* ========== ポータルへ戻るボタン (PC用) ========== */}
      <a
        href="/"
        className="floating-btn fixed-top-left desktop-only"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Portal
      </a>

      {/* ========== 用語説明ボタン (PC用) ========== */}
      <button
        onClick={() => setIsGlossaryOpen(true)}
        className="floating-btn fixed-top-right desktop-only"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="icon-blue">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
        用語説明
      </button>

      {/* ========== ハンバーガーボタン (モバイル用) ========== */}
      <button
        className="hamburger-btn mobile-only"
        onClick={() => setIsMenuOpen(prev => !prev)}
        aria-label="メニューを開く"
      >
        <span className={`hamburger-line ${isMenuOpen ? 'open-1' : ''}`} />
        <span className={`hamburger-line ${isMenuOpen ? 'open-2' : ''}`} />
        <span className={`hamburger-line ${isMenuOpen ? 'open-3' : ''}`} />
      </button>

      {/* ========== スライドインメニュー（モバイル用） ========== */}
      <div className="mobile-only">
        {isMenuOpen && (
          <div className="drawer-overlay" onClick={() => setIsMenuOpen(false)} />
        )}
        <div className={`drawer-menu ${isMenuOpen ? 'open' : ''}`}>
          <p className="drawer-title">メニュー</p>
          <a href="/" className="drawer-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="icon-blue">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Portalに戻る
          </a>
          <button onClick={openGlossary} className="drawer-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="icon-blue">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            用語説明
          </button>
        </div>
      </div>

      <div className="app-container">
        <GlossaryModal isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />

        <header className="app-header">
          <h1 className="app-title">ShutterSync Quick Analyzer</h1>
          <p className="app-description">カメラのフリッカー・スキャンライン現象を防ぐためのセーフアングルとシャッタースピードを計算します</p>
        </header>

        {/* メイン画面表示 */}
        <ShutterSyncAnalyzer />

        {/* 共通フッター */}
        <footer className="app-footer">
          <p>
            LED System Portal v1.0 | Designed for DIT, Camera Crew & LED Wall Operators
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;
