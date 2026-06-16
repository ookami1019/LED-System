/**
 * LED Wall Controller (将来開発用プレースホルダー)
 */
export function LedControllerPlaceholder() {
  return (
    <div className="placeholder-container">
      <header className="tool-header">
        <h2 className="tool-title">🎛️ LED Wall Controller</h2>
        <p className="tool-description">
          LEDコントローラーの設定（輝度、色温度、テストパターン）を仮想シミュレーション
        </p>
      </header>

      <main className="placeholder-content">
        <div className="placeholder-card glass-panel">
          <h3>🚧 開発中のロードマップ</h3>
          <p>
            このツールでは、実際のLED送信カード（Sending Card）や受信カード（Receiving Card）のパラメータをブラウザ上でシミュレートし、現場での色調整やトラブルシューティングを容易にすることを目指しています。
          </p>
          
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">✨</span>
              <div>
                <strong>輝度・ガンマカーブ調整</strong>
                <p>暗部階調の潰れや高輝度時の飽和を可視化します。</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎨</span>
              <div>
                <strong>テストパターン生成器</strong>
                <p>グレースケール、カラーバー、スキャニングライン検出パターンの表示。</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌡️</span>
              <div>
                <strong>色温度マッチング</strong>
                <p>カメラのホワイトバランスとLEDのケルビン値を視覚的に同期。</p>
              </div>
            </div>
          </div>
          
          <div className="placeholder-alert">
            <p>💡 <strong>開発者向け情報:</strong> この画面のロジックは <code>src/components/LedControllerPlaceholder.tsx</code> で管理されています。新規ツールの開発時はここを書き換えて実装を開始してください。</p>
          </div>
        </div>
      </main>
    </div>
  );
}
