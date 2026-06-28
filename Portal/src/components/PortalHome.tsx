/**
 * ポータル画面コンポーネント
 */
interface PortalHomeProps {
  onSelectView: (view: 'controller' | 'calculator') => void;
}

export function PortalHome({ onSelectView }: PortalHomeProps) {
  const tools = [
    {
      id: 'flickr' as const,
      title: 'ShutterSync Quick Analyzer',
      description: 'カメラのシャッター速度とLEDのリフレッシュレート・スキャンレートの同期をシミュレート・診断し、最適な撮影設定を算出します。',
      status: 'active',
      icon: '📷',
      tag: '利用可能',
    },
    {
      id: 'lens-simulation' as const,
      title: 'Camera Angle Simulation',
      description: '焦点距離・センサーサイズ・アスペクト比を変えながら、画角と圧縮効果をリアルタイムで確認できるシミュレーターです。',
      status: 'active',
      icon: '🎥',
      tag: '利用可能',
    },
    {
      id: 'controller' as const,
      title: 'LED Wall Controller',
      description: 'LEDコントローラーの設定値（輝度、色温度、グレースケール）を仮想的にシミュレーションし、各種テストパターンを出力します。',
      status: 'placeholder',
      icon: '🎛️',
      tag: '開発中',
    },
    {
      id: 'calculator' as const,
      title: 'LED Signal Calculator',
      description: '送出解像度、リフレッシュレート、色深度から必要なイーサネットポート数や帯域幅を自動計算するDIT向けツールです。',
      status: 'placeholder',
      icon: '📊',
      tag: '開発中',
    },
  ];

  return (
    <div className="portal-container">
      <header className="portal-header">
        <h1 className="portal-title">LED System Portal</h1>
        <p className="portal-description">
          バーチャルプロダクションおよびLEDウォール運用をサポートする統合ツールプラットフォーム
        </p>
      </header>

      <div className="portal-grid">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className={`portal-card ${tool.status}`}
            onClick={() => {
              if (tool.id === 'flickr') {
                window.location.href = '/flickr/';
              } else if (tool.id === 'lens-simulation') {
                window.location.href = '/lens-simulation/';
              } else {
                onSelectView(tool.id);
              }
            }}
          >
            <div className="card-header-row">
              <span className={`card-badge ${tool.status}`}>{tool.tag}</span>
              <div className="card-icon">{tool.icon}</div>
            </div>
            <h3 className="card-title">{tool.title}</h3>
            <p className="card-description">{tool.description}</p>
            <div className="card-action">
              {tool.status === 'active' ? 'ツールを起動する →' : '準備中 (詳細を見る) →'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
