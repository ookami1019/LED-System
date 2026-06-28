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

  // アニメーション周期
  const shutterSpeedPeriod = parsedCameraHsFps > 0 ? 90 / parsedCameraHsFps : 1.5;
  const ledSpeedPeriod = parsedLedRefreshRate > 0 ? 90 / parsedLedRefreshRate : 1.5;

  // スクロール制御用のステート
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(0.015);
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

  const getShutterPath = (cx: number, cy: number, r: number, angle: number) => {
    if (angle >= 360) {
      return `M ${cx} ${cy} m -${r} 0 a ${r} ${r} 0 1 0 ${r*2} 0 a ${r} ${r} 0 1 0 -${r*2} 0`;
    }
    const startAngle = 0;
    const endAngle = angle;
    
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    
    const largeArcFlag = angle <= 180 ? 0 : 1;
    
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const getRiskColors = () => {
    switch (riskAssessment.level) {
      case 'Safe': return { text: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/50', hex: '#4ade80' };
      case 'Moderate': return { text: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/50', hex: '#fbbf24' };
      case 'HighRisk': return { text: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/50', hex: '#f87171' };
      default: return { text: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/50', hex: '#9ca3af' };
    }
  };
  const colors = getRiskColors();

  const renderTimeline = () => {
    const totalDuration = parsedCameraHsFps > 0 ? 2.5 / parsedCameraHsFps : 0.0416;
    if (totalDuration <= 0) return null;

    const width = 500;
    const height = 65;
    const currentOffset = isScrolling ? offsetTime : 0;
    const timeToX = (t: number) => ((t - currentOffset) / totalDuration) * width;

    const frames = [];
    const frameDuration = parsedCameraHsFps > 0 ? 1 / parsedCameraHsFps : 0.0166;
    
    const minFrameIdx = Math.floor(currentOffset / frameDuration) - 1;
    const maxFrameIdx = Math.ceil((currentOffset + totalDuration) / frameDuration) + 1;
    
    for (let i = Math.max(0, minFrameIdx); i <= maxFrameIdx; i++) {
      const start = i * frameDuration;
      const actualDuration = Math.min(exposureTime, frameDuration);
      const xStart = timeToX(start);
      const xWidth = timeToX(start + actualDuration) - xStart;
      
      if (xStart + xWidth >= 0 && xStart <= width) {
        frames.push({
          id: i,
          start: xStart,
          width: xWidth,
          label: `Frame ${i + 1}`
        });
      }
    }

    const ledLines = [];
    const ledPeriod = parsedLedRefreshRate > 0 ? 1 / parsedLedRefreshRate : 0.0166;
    const minLedIdx = Math.floor(currentOffset / ledPeriod) - 1;
    const maxLedIdx = Math.ceil((currentOffset + totalDuration) / ledPeriod) + 1;

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
          id: k,
          x,
          isColliding: checkCollision(t),
        });
      }
    }

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto mt-2 rounded-lg overflow-hidden" style={{ maxHeight: '80px' }}>
        <rect width={width} height={height} fill="rgba(30,41,59,0.5)" />
        
        {ledLines.map((line) => (
          <g key={`led-group-${line.id}`}>
            <line
              x1={line.x} y1={0} x2={line.x} y2={height}
              stroke={line.isColliding ? '#f87171' : '#4ade80'}
              strokeWidth={line.isColliding ? '2' : '1.2'}
              strokeDasharray={line.isColliding ? 'none' : '3 3'}
              opacity={line.isColliding ? '0.95' : '0.4'}
            />
            {line.isColliding && (
              <circle cx={line.x} cy={15} r="3.5" fill="#f87171" />
            )}
          </g>
        ))}

        {frames.map((frame) => (
          <g key={`frame-${frame.id}`}>
            <rect
              x={frame.start} y={15} width={frame.width} height={35} rx="4"
              fill={colors.hex} opacity={0.8}
            />
            <text
              x={frame.start + 8} y={36}
              fontSize="10" fontWeight="bold" fill="#0f172a"
            >
              {frame.label}
            </text>
          </g>
        ))}

        <line x1={0} y1={15} x2={width} y2={15} stroke="rgba(148,163,184,0.2)" strokeWidth="0.5" />
        <line x1={0} y1={50} x2={width} y2={50} stroke="rgba(148,163,184,0.2)" strokeWidth="0.5" />
      </svg>
    );
  };

  return (
    <div className="flex flex-col gap-5 relative">
      {globalShutterStyle}
      
      {/* リスクヘッダー */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-700/50">
        <h3 className="text-base md:text-lg font-bold text-gray-100 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          シャッター＆LED同期ビジュアライザー
        </h3>
        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colors.bg} ${colors.text} border ${colors.border}`}>
          {riskAssessment.level}
        </div>
      </div>

      <div className={`p-4 rounded-xl border bg-gray-900/50 ${colors.border}`}>
        <p className={`text-sm md:text-base font-semibold mb-2 ${colors.text}`}>
          {riskAssessment.message}
        </p>
        <div className="flex items-baseline gap-2 text-sm">
          <span className="text-gray-400 font-medium">実質露光時間:</span>
          <span className="font-mono text-gray-100 font-bold text-base md:text-lg">
            {expDenominator > 0 ? `1/${expDenominator}秒` : 'N/A'}
          </span>
          <span className="text-xs text-gray-500">
            ({exposureTime.toFixed(6)}秒)
          </span>
        </div>
      </div>

      {/* グラフィック要素 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 回転シャッター */}
        <div className="flex flex-col items-center gap-2 bg-gray-900/40 border border-gray-700/50 rounded-xl p-4">
          <span className="text-xs font-semibold text-gray-400">
            シャッターモデル ({Math.round(shutterAngle)}°)
          </span>
          <div className="w-full max-w-[140px] aspect-square flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="46" fill="#0f172a" stroke="rgba(148,163,184,0.3)" strokeWidth="1" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(148,163,184,0.3)" strokeWidth="0.5" strokeDasharray="2 2" />
              <g 
                style={{ 
                  transformOrigin: '50px 50px',
                  animation: inputs.sensorType === 'Rolling'
                    ? `shutter-rotate ${shutterSpeedPeriod}s linear infinite`
                    : `${blinkAnimationName} ${shutterSpeedPeriod}s linear infinite`
                }}
              >
                <circle cx="50" cy="50" r="44" fill="rgba(255, 255, 255, 0.05)" />
                <path
                  d={getShutterPath(50, 50, 44, shutterAngle)}
                  fill={colors.hex}
                  style={{ filter: `drop-shadow(0 0 6px ${colors.hex})` }}
                />
              </g>
              <circle cx="50" cy="50" r="4" fill="#94a3b8" />
              <line x1="50" y1="4" x2="50" y2="12" stroke="#3b82f6" strokeWidth="1.5" />
            </svg>
            <style>{`
              @keyframes shutter-rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>

        {/* LEDスキャンライン */}
        <div className="flex flex-col items-center gap-2 bg-gray-900/40 border border-gray-700/50 rounded-xl p-4">
          <span className="text-xs font-semibold text-gray-400">
            LED駆動フレームレート ({inputs.ledRefreshRate} Fps)
          </span>
          <div className="w-full max-w-[140px] aspect-square flex items-center justify-center">
            <div 
              className={`relative w-full h-[120px] bg-slate-950 border-2 border-gray-700 rounded-lg overflow-hidden flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]`}
              style={inputs.sensorType === 'Global' ? { animation: `led-flicker-global ${ledSpeedPeriod}s linear infinite` } : undefined}
            >
              {inputs.sensorType === 'Rolling' && (
                <div 
                  className="absolute left-0 w-full h-1 bg-gradient-to-b from-transparent via-white/80 to-transparent shadow-[0_0_10px_rgba(255,255,255,0.6)]" 
                  style={{ animation: `led-scan ${ledSpeedPeriod}s linear infinite` }}
                />
              )}
              <span className="z-10 font-mono text-[10px] tracking-widest text-gray-500 uppercase select-none">
                LED Wall
              </span>
            </div>
            <style>{`
              @keyframes led-scan {
                0% { top: -4px; }
                100% { top: 100%; }
              }
              @keyframes led-flicker-global {
                0%, 80% { opacity: 1; }
                81%, 100% { opacity: 0.7; }
              }
            `}</style>
          </div>
        </div>
      </div>

      {/* タイムラインチャート */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-semibold text-gray-400">露光タイミングチャート</span>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer bg-gray-900/40 border border-gray-700/50 px-2.5 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">
              <input
                type="checkbox"
                checked={isScrolling}
                onChange={(e) => setIsScrolling(e.target.checked)}
                className="w-3.5 h-3.5 accent-blue-500"
              />
              ずれていく様子をシミュレート
            </label>
            
            {isScrolling && (
              <div className="flex items-center gap-2 bg-gray-900/40 border border-gray-700/50 px-2.5 py-1.5 rounded-lg">
                <span className="text-[10px] text-gray-400 font-mono w-12">
                  速度: {(scrollSpeed * 62.5).toFixed(1)}x
                </span>
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
                  className="w-16 h-1 bg-gray-700 rounded-full appearance-none outline-none accent-blue-500"
                  style={{ height: '4px' }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-gray-400 font-medium">
          <div className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm ${colors.bg} border ${colors.border}`}></span>
            露光時間
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-green-500/60 border border-green-500/50"></span>
            LED更新 (安全)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-red-500/80 border border-red-500/50"></span>
            LED更新 (干渉)
          </div>
        </div>

        {renderTimeline()}
      </div>
    </div>
  );
};
