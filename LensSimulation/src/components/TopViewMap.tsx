import React from 'react';

interface TopViewMapProps {
  hFov: number;
  unit: 'm' | 'ft';
  focusDistanceM: number;
  nearLimitM: number;
  farLimitM: number;
}

export const TopViewMap: React.FC<TopViewMapProps> = ({ hFov, unit, focusDistanceM, nearLimitM, farLimitM }) => {
  const cx = 200, cy = 380, depth = 320; 
  const rad = (hFov / 2) * (Math.PI / 180);
  const leftX = cx - depth * Math.tan(rad);
  const rightX = cx + depth * Math.tan(rad);
  const pathD = `M ${cx} ${cy} L ${leftX} ${cy - depth} L ${rightX} ${cy - depth} Z`;

  // 1m = 3pxのスケール
  // グリッドを5m間隔にする -> 15px

  return (
    <div className="w-full h-full flex bg-[#0f172a] overflow-hidden">
      <svg viewBox="0 0 400 400" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <pattern id="grid" width="15" height="15" patternUnits="userSpaceOnUse">
            <path d="M 15 0 L 0 0 0 15" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          </pattern>
          <rect width="400" height="400" fill="url(#grid)" />

          {/* 奥への距離（Y軸/Z深度）ルーラー (左端) */}
          <line x1="20" y1="50" x2="20" y2="380" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          {(unit === 'm' ? [10, 20, 30, 40, 50, 60, 70, 80, 90, 100] : [50, 100, 150, 200, 250, 300, 330]).map(dist => {
            const zDist = unit === 'm' ? dist : dist / 3.28084;
            const y = 380 - zDist * 3;
            const isMajor = unit === 'm' ? dist % 50 === 0 : dist % 100 === 0;
            return (
              <g key={`y-${dist}`}>
                <line 
                  x1={isMajor ? "15" : "18"} 
                  y1={y} 
                  x2="25" 
                  y2={y} 
                  stroke={isMajor ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)"} 
                  strokeWidth="1" 
                />
                <text 
                  x="28" 
                  y={y + 3} 
                  fill={isMajor ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)"} 
                  fontSize={isMajor ? "10" : "8"} 
                  textAnchor="start" 
                  fontWeight={isMajor ? "bold" : "normal"}
                  className="font-mono"
                >
                  {unit === 'm' ? `${dist}m` : `${dist}ft`}
                </text>
              </g>
            )
          })}

          {/* 左右の距離（X軸/横幅）ルーラー (カメラ基準ライン) */}
          <line x1="20" y1="380" x2="380" y2="380" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          {(unit === 'm' ? [-60, -50, -40, -30, -20, -10, 10, 20, 30, 40, 50, 60] : [-200, -150, -100, -50, 50, 100, 150, 200]).map(dist => {
            const xDist = unit === 'm' ? dist : dist / 3.28084;
            const x = cx + xDist * 3;
            const isMajor = unit === 'm' ? Math.abs(dist) % 50 === 0 : Math.abs(dist) % 100 === 0;
            const showText = unit === 'm' ? Math.abs(dist) % 20 === 0 : (Math.abs(dist) % 100 === 0 || Math.abs(dist) === 50);
            return (
              <g key={`x-${dist}`}>
                <line 
                  x1={x} 
                  y1="380" 
                  x2={x} 
                  y2={isMajor ? "385" : "383"} 
                  stroke={isMajor ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)"} 
                  strokeWidth="1" 
                />
                {showText && (
                  <text 
                    x={x} 
                    y="395" 
                    fill={isMajor ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)"} 
                    fontSize={isMajor ? "10" : "8"} 
                    textAnchor="middle" 
                    fontWeight={isMajor ? "bold" : "normal"}
                    className="font-mono"
                  >
                    {unit === 'm' ? `${Math.abs(dist)}m` : `${Math.abs(dist)}ft`}
                  </text>
                )}
              </g>
            )
          })}
          
          <path d={pathD} fill="rgba(59, 130, 246, 0.15)" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />

          {/* DoF近点・遠点・フォーカス帯 */}
          {(() => {
            const nearY = 380 - nearLimitM * 3;
            const farY = farLimitM === Infinity ? 50 : Math.max(380 - farLimitM * 3, 50);
            const focusY = 380 - focusDistanceM * 3;
            return (
              <>
                {/* DoF帯（合焦範囲） */}
                <rect
                  x="35"
                  y={farY}
                  width="330"
                  height={nearY - farY}
                  fill="rgba(251, 191, 36, 0.08)"
                  stroke="none"
                />
                {/* 近点ライン */}
                {nearY < 380 && nearY > 50 && (
                  <>
                    <line x1="35" y1={nearY} x2="365" y2={nearY} stroke="rgba(251,191,36,0.5)" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="37" y={nearY + 11} fill="rgba(251,191,36,0.7)" fontSize="9" textAnchor="start" paintOrder="stroke" stroke="#0f172a" strokeWidth="3">
                      近: {unit === 'm' ? `${nearLimitM.toFixed(1)}m` : `${(nearLimitM * 3.28084).toFixed(0)}ft`}
                    </text>
                  </>
                )}
                {/* 遠点ライン */}
                {farLimitM !== Infinity && farY > 50 && (
                  <>
                    <line x1="35" y1={farY} x2="365" y2={farY} stroke="rgba(251,191,36,0.5)" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="37" y={farY - 4} fill="rgba(251,191,36,0.7)" fontSize="9" textAnchor="start" paintOrder="stroke" stroke="#0f172a" strokeWidth="3">
                      遠: {unit === 'm' ? `${farLimitM.toFixed(1)}m` : `${(farLimitM * 3.28084).toFixed(0)}ft`}
                    </text>
                  </>
                )}
                {farLimitM === Infinity && (
                  <text x="37" y="58" fill="rgba(251,191,36,0.7)" fontSize="9" textAnchor="start">遠: ∞ (無限遠)</text>
                )}
                {/* フォーカスライン */}
                {focusY < 380 && focusY > 50 && (
                  <>
                    <line x1="35" y1={focusY} x2="365" y2={focusY} stroke="rgba(251,191,36,0.9)" strokeWidth="1.5" />
                    <circle cx="200" cy={focusY} r="4" fill="#fbbf24" />
                    <text x="206" y={focusY + 3} fill="#fbbf24" fontSize="9" fontWeight="bold" paintOrder="stroke" stroke="#0f172a" strokeWidth="3">
                      focus: {unit === 'm' ? `${focusDistanceM.toFixed(1)}m` : `${(focusDistanceM * 3.28084).toFixed(1)}ft`}
                    </text>
                  </>
                )}
              </>
            );
          })()}
          
          {/* 山 (0m, 100m) => cx=200, cy=380-300=80 */}
          <g>
            <path d="M 180 80 L 200 50 L 220 80 Z" fill="#64748b" />
            <text x="200" y="45" fill="#94a3b8" fontSize="11" textAnchor="middle">山 ({unit === 'm' ? '100m' : '330ft'})</text>
          </g>

          {/* 木2 (6m, 80m) => cx=200+18=218, cy=380-240=140 */}
          <g>
            <circle cx="218" cy="140" r="6" fill="#059669" />
            <text x="231" y="144" fill="#34d399" fontSize="11" textAnchor="start">木 ({unit === 'm' ? '80m' : '260ft'})</text>
          </g>
          
          {/* 建物 (-8m, 60m) => cx=200-24=176, cy=380-180=200 */}
          <g>
            <rect x="168.5" y="192.5" width="15" height="15" fill="#7f1d1d" rx="2" />
            <text x="176" y="186" fill="#fca5a5" fontSize="11" textAnchor="middle">建物 ({unit === 'm' ? '60m' : '200ft'})</text>
          </g>

          {/* 低木 (-6m, 40m) => cx=200-18=182, cy=380-120=260 */}
          <g>
            <circle cx="182" cy="260" r="4" fill="#059669" />
            <circle cx="179" cy="258" r="3" fill="#10b981" />
            <circle cx="184" cy="262" r="3" fill="#34d399" />
            <text x="174" y="263" fill="#6ee7b7" fontSize="11" textAnchor="end">低木 ({unit === 'm' ? '40m' : '130ft'})</text>
          </g>

          {/* 木 (5m, 30m) => cx=200+15=215, cy=380-90=290 */}
          <g>
            <circle cx="215" cy="290" r="6" fill="#059669" />
            <text x="228" y="294" fill="#34d399" fontSize="11" textAnchor="start">木 ({unit === 'm' ? '30m' : '100ft'})</text>
          </g>

          {/* 人物 (0m, 15m) => cx=200, cy=380-45=335 */}
          <g>
            <circle cx="200" cy="335" r="4" fill="#ef4444" />
            <text x="210" y="338" fill="#f87171" fontSize="11" textAnchor="start">人物 ({unit === 'm' ? '15m' : '50ft'})</text>
          </g>

          {/* 車 (4m, 10m) => cx=200+12=212, cy=380-30=350 */}
          <g>
            {/* SVGの回転は時計回りなので、3Dの -Math.PI/6 (時計回り) に合わせるため +30 にする */}
            <rect x="209" y="344" width="6" height="12" fill="#ef4444" rx="1" transform="rotate(30 212 350)" />
            <text x="222" y="354" fill="#f87171" fontSize="11" textAnchor="start">車 ({unit === 'm' ? '10m' : '33ft'})</text>
          </g>

          {/* カメラ (0m, 0m) => cx=200, cy=380 */}
          <g>
            <circle cx="200" cy="380" r="6" fill="#e2e8f0" />
            <circle cx="200" cy="380" r="3" fill="#0f172a" />
            <text x="200" y="400" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">Camera</text>
          </g>
        </svg>
    </div>
  );
};
