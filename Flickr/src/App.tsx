import { ShutterSyncAnalyzer } from './components/ShutterSyncAnalyzer';

function App() {
  const handleBackToPortal = () => {
    window.location.href = '/';
  };

  return (
    <div className="app-container">
      {/* グローバルナビゲーションバー */}
      <nav className="global-nav">
        <div className="nav-content">
          <button className="nav-back-button" onClick={handleBackToPortal}>
            ← ポータルに戻る
          </button>
          <div className="nav-breadcrumbs">
            <span className="breadcrumb-link" onClick={handleBackToPortal}>
              LED System Portal
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">
              ShutterSync Quick Analyzer
            </span>
          </div>
        </div>
      </nav>

      {/* メイン画面表示 */}
      <ShutterSyncAnalyzer />

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
