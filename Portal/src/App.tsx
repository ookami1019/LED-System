import { useState } from 'react';
import { PortalHome } from './components/PortalHome';
import { LedControllerPlaceholder } from './components/LedControllerPlaceholder';
import { LedCalculatorPlaceholder } from './components/LedCalculatorPlaceholder';

type ViewState = 'portal' | 'controller' | 'calculator';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('portal');

  const renderView = () => {
    switch (currentView) {
      case 'controller':
        return <LedControllerPlaceholder />;
      case 'calculator':
        return <LedCalculatorPlaceholder />;
      case 'portal':
      default:
        return <PortalHome onSelectView={setCurrentView} />;
    }
  };

  return (
    <div className="app-container">
      {/* グローバルナビゲーションバー（ポータル以外で表示） */}
      {currentView !== 'portal' && (
        <nav className="global-nav">
          <div className="nav-content">
            <button className="nav-back-button" onClick={() => setCurrentView('portal')}>
              ← ポータルに戻る
            </button>
            <div className="nav-breadcrumbs">
              <span className="breadcrumb-link" onClick={() => setCurrentView('portal')}>
                LED System Portal
              </span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">
                {currentView === 'controller' && 'LED Wall Controller'}
                {currentView === 'calculator' && 'LED Signal Calculator'}
              </span>
            </div>
          </div>
        </nav>
      )}

      {/* メイン画面表示 */}
      {renderView()}

      {/* 共通フッター */}
      <footer className="app-footer">
        <p>
          LED System Portal v1.0 | Designed for DIT, Camera Crew & LED Wall Operators
        </p>
      </footer>
    </div>
  );
}

export default App;
