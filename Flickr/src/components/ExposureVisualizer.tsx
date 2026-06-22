import React, { useState, useEffect, useRef } from 'react';
import type { AnalyzerInputs, DiagnosticResult } from '../types';

interface ExposureVisualizerProps {
  inputs: AnalyzerInputs;
  result: DiagnosticResult;
}

export const ExposureVisualizer: React.FC<ExposureVisualizerProps> = ({ inputs, result }) => {
  const { exposureTime, riskAssessment, calculatedShutterAngle } = result;

  const parsedShutterValue = Number(inputs.shutterValue) || 0;
  const parsedCameraHsFps = Number(inputs.cameraHsFps) || 0;
  const parsedLedRefreshRate = Number(inputs.ledRefreshRate) || 0;

  // 実質的なシャッター角度
  const shutterAngle = inputs.shutterMode === 'Angle'
    ? parsedShutterValue
    : (calculatedShutterAngle ?? 180);

  // 実質的な露出分母
  const expDenominator = exposureTime > 0 ? Math.round(1 / exposureTime) : 0;

  // アニメーション周期（見やすさのためにスケーリング。基準は60fps/60Hzで1.5秒周期に設定）
  const shutterSpeedPeriod = parsedCameraHsFps > 0 ? 90 / parsedCameraHsFps : 1.5;
  const ledSpeedPeriod = parsedLedRefreshRate > 0 ? 90 / parsedLedRefreshRate : 1.5;

  // スクロール制御用のステート
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(0.015); // 初期値を超低速 (0.015) に設定
  const [offsetTime, setOffsetTime] = useState<number>(0);
  const lastTimeRef = useRef<number>(0);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    if (!isScrolling) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      return;
    }

    lastTimeRef.current = performance.now();

    const animate = () => {
      const now = performance.now();
      const deltaMs = now - lastTimeRef.current;
      lastTimeRef.current = now;

      // ユーザー設定された再生速度を用いて進行秒数を算出
      const deltaSeconds = (deltaMs / 1000) * scrollSpeed;

      setOffsetTime((prev) => prev + deltaSeconds);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isScrolling, scrollSpeed]);

  // グローバルシャッター用の点滅キーフレームの生成
  const blinkAnimationName = `shutter-blink-${Math.round(shutterAngle)}`;
  const openPercentage = (shutterAngle / 360) * 100;
  const globalShutterStyle = inputs.sensorType === 'Global' ? (
    <style>{`
      @keyframes ${blinkAnimationName} {
        0%, ${openPercentage}% {
          opacity: 1;
        }
        ${openPercentage + 0.01}%, 100% {
          opacity: 0.15;
        }
      }
    `}</style>
  ) : null;

  // SVG扇形描画用のパス生成（開始角 0度から shutterAngle度 までの扇形）
  const getShutterPath = (cx: number, cy: number, r: number, angle: number) => {
    if (angle >= 360) {
      return `M ${cx} ${cy} m -${r} 0 a ${r} ${r} 0 1 0 ${r*2} 0 a ${r} ${r} 0 1 0 -${r*2} 0`;
    }
    const startAngle = 0;
    const endAngle = angle;
    
    // SVGの座標系に合わせて変換 (上0度, 時計回り)
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    
    const largeArcFlag = angle <= 180 ? 0 : 1;
    
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  // タイムラインチャート用パラメータの計算
  const renderTimeline = () => {
    const totalDuration = parsedCameraHsFps > 0 ? 2.5 / parsedCameraHsFps : 0.0416; // カメラの2.5フレーム分を表示してストロボ効果を防止
    if (totalDuration <= 0) return null;

    const width = 500; // SVGの仮想的な横幅
    const height = 65;
    
    const currentOffset = isScrolling ? offsetTime : 0;

    // 時間t（絶対時間）からSVG内のX座標への変換
    // currentOffset から currentOffset + totalDuration の範囲が 0 から width に対応
    const timeToX = (t: number) => ((t - currentOffset) / totalDuration) * width;

    // カメラの露光区間
    const frames = [];
    const frameDuration = parsedCameraHsFps > 0 ? 1 / parsedCameraHsFps : 0.0166;
    
    // 描画範囲に入りうるインデックスを算出
    const minFrameIdx = Math.floor(currentOffset / frameDuration) - 1;
    const maxFrameIdx = Math.ceil((currentOffset + totalDuration) / frameDuration) + 1;
    
    for (let i = Math.max(0, minFrameIdx); i <= maxFrameIdx; i++) {
      const start = i * frameDuration;
      const actualDuration = Math.min(exposureTime, frameDuration);
      
      const xStart = timeToX(start);
      const xWidth = timeToX(start + actualDuration) - xStart;
      
      if (xStart + xWidth >= 0 && xStart <= width) {
        frames.push({
          id: i, // 絶対的なインデックスをIDとする
          start: xStart,
          width: xWidth,
          label: `Frame ${i + 1}`
        });
      }
    }

    // LEDのフレーム書き換えライン
    const ledLines = [];
    const ledPeriod = parsedLedRefreshRate > 0 ? 1 / parsedLedRefreshRate : 0.0166;
    
    const minLedIdx = Math.floor(currentOffset / ledPeriod) - 1;
    const maxLedIdx = Math.ceil((currentOffset + totalDuration) / ledPeriod) + 1;

    // LEDの書き換えタイミングがカメラの露光時間内に落ちているか判定するヘルパー
    const checkCollision = (t: number) => {
      if (exposureTime <= 0) return false;
      const approxFrameIdx = Math.floor(t / frameDuration);
      for (let i = approxFrameIdx - 1; i <= approxFrameIdx + 1; i++) {
        if (i < 0) continue;
        const start = i * frameDuration;
        const end = start + exposureTime;
        if (t >= start && t <= end) {
          return true;
        }
      }
      return false;
    };
    
    for (let k = Math.max(0, minLedIdx); k <= maxLedIdx; k++) {
      const t = k * ledPeriod;
      const x = timeToX(t);
      if (x >= 0 && x <= width) {
        ledLines.push({
          id: k, // 絶対的なインデックスをIDとする
          x,
          isColliding: checkCollision(t),
        });
      }
    }

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="timeline-svg" width="100%" height={height}>
        {/* 背景グリッド */}
        <rect width={width} height={height} fill="var(--bg-tertiary)" rx="8" />
        
        {/* LED書き換えタイミング（縦ライン） */}
        {ledLines.map((line) => (
          <g key={`led-group-${line.id}`}>
            <line
              x1={line.x}
              y1={0}
              x2={line.x}
              y2={height}
              stroke={line.isColliding ? 'var(--color-high)' : 'var(--color-success)'}
              strokeWidth={line.isColliding ? '2' : '1.2'}
              strokeDasharray={line.isColliding ? 'none' : '3 3'}
              opacity={line.isColliding ? '0.95' : '0.4'}
            />
            {line.isColliding && (
              <circle
                cx={line.x}
                cy={15}
                r="3.5"
                fill="var(--color-high)"
              />
            )}
          </g>
        ))}

        {/* カメラ露光帯 */}
        {frames.map((frame) => (
          <g key={`frame-${frame.id}`}>
            <rect
              x={frame.start}
              y={15}
              width={frame.width}
              height={35}
              rx="4"
              className={`exposure-bar risk-${riskAssessment.level.toLowerCase()}`}
            />
            <text
              x={frame.start + 8}
              y={36}
              fontSize="10"
              fontWeight="bold"
              fill="var(--bg-primary)"
              className="exposure-bar-text"
            >
              {frame.label}
            </text>
          </g>
        ))}

        {/* 各要素の区切り線などの装飾 */}
        <line x1={0} y1={15} x2={width} y2={15} stroke="var(--border-color)" strokeWidth="0.5" />
        <line x1={0} y1={50} x2={width} y2={50} stroke="var(--border-color)" strokeWidth="0.5" />
      </svg>
    );
  };

  return (
    <div className={`exposure-visualizer risk-level-${riskAssessment.level.toLowerCase()}`}>
      {globalShutterStyle}
      {/* リスクヘッダー */}
      <div className="visualizer-header">
        <h3 className="visualizer-title">シャッター＆LED同期ビジュアライザー</h3>
        <div className={`risk-badge risk-${riskAssessment.level.toLowerCase()}`}>
          {riskAssessment.level}
        </div>
      </div>

      <div className="risk-banner">
        <p className="risk-message">{riskAssessment.message}</p>
        <div className="exposure-stat">
          <span className="stat-label">実質露光時間: </span>
          <span className="stat-value">
            {expDenominator > 0 ? `1/${expDenominator}秒` : 'N/A'}{' '}
            <span className="stat-sub">({exposureTime.toFixed(6)}秒)</span>
          </span>
        </div>
      </div>

      {/* グラフィック要素 */}
      <div className="visualizer-panels">
        {/* 回転シャッター */}
        <div className="visual-panel">
          <div className="panel-label">
            シャッターモデル ({Math.round(shutterAngle)}°)
          </div>
          <div className="graphic-container shutter-container">
            <svg viewBox="0 0 100 100" className="shutter-wheel-svg">
              {/* シャッター外枠 */}
              <circle cx="50" cy="50" r="46" fill="var(--bg-primary)" stroke="var(--border-color)" strokeWidth="1" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="2 2" />
              
              {/* シャッター開口部・回転ブレード */}
              <g 
                style={{ 
                  transformOrigin: '50px 50px',
                  animation: inputs.sensorType === 'Rolling'
                    ? `shutter-rotate ${shutterSpeedPeriod}s linear infinite`
                    : `${blinkAnimationName} ${shutterSpeedPeriod}s linear infinite`
                }}
              >
                {/* 遮光部（ブレード） */}
                <circle cx="50" cy="50" r="44" fill="rgba(255, 255, 255, 0.05)" />
                {/* 開口部（光が通る明るい扇形） */}
                <path
                  d={getShutterPath(50, 50, 44, shutterAngle)}
                  fill="var(--shutter-glow)"
                  className="shutter-opening-path"
                />
              </g>
              
              {/* 中心軸 */}
              <circle cx="50" cy="50" r="4" fill="var(--text-secondary)" />
              {/* 基準位置を示すインデックス */}
              <line x1="50" y1="4" x2="50" y2="12" stroke="var(--primary)" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* LEDスキャンライン */}
        <div className="visual-panel">
          <div className="panel-label">
            LED駆動フレームレート ({inputs.ledRefreshRate} Fps)
          </div>
          <div className="graphic-container scan-container">
            <div 
              className={`led-screen-mock ${inputs.sensorType === 'Global' ? 'global-shutter' : ''}`}
              style={
                inputs.sensorType === 'Global'
                  ? { animation: `led-flicker-global ${ledSpeedPeriod}s linear infinite` }
                  : undefined
              }
            >
              {inputs.sensorType === 'Rolling' && (
                <div 
                  className="led-scan-line" 
                  style={{ 
                    animationDuration: `${ledSpeedPeriod}s` 
                  }}
                />
              )}
              <div className="screen-content">
                <span className="screen-indicator">LED Wall</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* タイムラインチャート */}
      <div className="timeline-panel">
        <div className="timeline-header">
          <span className="panel-label">露光タイミングチャート</span>
          <div className="timeline-controls">
            <label className="scroll-checkbox-label">
              <input
                type="checkbox"
                checked={isScrolling}
                onChange={(e) => setIsScrolling(e.target.checked)}
                className="scroll-checkbox"
              />
              ずれていく様子をシミュレート（横スクロール）
            </label>
            {isScrolling && (
              <div className="speed-slider-container">
                <span className="slider-label">速度: {(scrollSpeed * 62.5).toFixed(1)}x</span>
                <input
                  type="range"
                  min="0.002"
                  max="0.08"
                  step="0.002"
                  value={scrollSpeed}
                  onChange={(e) => {
                    setOffsetTime(0);
                    setScrollSpeed(parseFloat(e.target.value));
                  }}
                  className="speed-slider"
                />
              </div>
            )}
          </div>
          <span className="timeline-legend">
            <span className="legend-item">
              <span className={`legend-color legend-exp risk-${riskAssessment.level.toLowerCase()}`}></span>露光時間
            </span>
            <span className="legend-item">
              <span 
                className="legend-color legend-scan"
                style={{ backgroundColor: 'var(--color-success)', opacity: '0.6' }}
              ></span>LED更新 (安全)
            </span>
            <span className="legend-item">
              <span 
                className="legend-color legend-scan"
                style={{ backgroundColor: 'var(--color-high)' }}
              ></span>LED更新 (干渉)
            </span>
          </span>
        </div>
        <div className="timeline-container">
          {renderTimeline()}
        </div>
      </div>
    </div>
  );
};
