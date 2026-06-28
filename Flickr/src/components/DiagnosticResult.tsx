import React from 'react';
import type { DiagnosticResult as DiagnosticResultType } from '../types';

interface DiagnosticResultProps {
  result: DiagnosticResultType;
}

export const DiagnosticResult: React.FC<DiagnosticResultProps> = ({ result }) => {
  const { phase1Results, phase2Instructions, phase2Results, calculatedShutterAngle } = result;

  const getAlertClasses = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-500/10 border-red-500/30 border-l-red-500 text-red-200';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/30 border-l-amber-500 text-amber-200';
      case 'success':
        return 'bg-green-500/10 border-green-500/30 border-l-green-500 text-green-200';
      default:
        return 'bg-gray-800/50 border-gray-700 border-l-gray-500 text-gray-300';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Phase 1 結果 */}
      <section className="flex flex-col gap-3">
        <h2 className="flex items-center gap-2 text-sm md:text-base font-bold text-gray-100 border-b border-gray-700/50 pb-2">
          <span className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm tracking-wider">
            Phase 1
          </span>
          基本周波数・露光同期
        </h2>

        {calculatedShutterAngle !== undefined && (
          <div className="flex items-center gap-2 bg-gray-900/40 border border-gray-700/50 p-3 rounded-lg">
            <span className="text-xs font-semibold text-gray-400">算出シャッター角度:</span>
            <span className={`font-mono text-lg font-bold ${Math.abs(calculatedShutterAngle - 180) <= 0.1 ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.3)]' : 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.3)]'}`}>
              {calculatedShutterAngle}°
            </span>
            {Math.abs(calculatedShutterAngle - 180) <= 0.1 ? (
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md bg-green-500/20 border border-green-500/30 text-green-400">同期可</span>
            ) : (
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-500/20 border border-red-500/30 text-red-400">非推奨</span>
            )}
          </div>
        )}

        {phase1Results.length > 0 ? (
          <div className="flex flex-col gap-2">
            {phase1Results.map((alert) => (
              <div key={alert.id} className={`flex gap-3 p-3.5 rounded-lg border-l-4 border ${getAlertClasses(alert.severity)}`}>
                <div className="text-xl flex items-center justify-center">
                  {alert.severity === 'High' ? '🚨' : '⚠️'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-relaxed">{alert.advice}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`flex gap-3 p-3.5 rounded-lg border-l-4 border ${getAlertClasses('success')}`}>
            <div className="text-xl flex items-center justify-center">✓</div>
            <div className="flex-1">
              <p className="text-sm font-medium leading-relaxed">
                基本同期に問題ありません。カメラの実フレームレートとLEDフレームレートが一致し、シャッター角度は適切に同期しています（180°）。
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Phase 2 微調整手順 */}
      <section className="flex flex-col gap-3">
        <h2 className="flex items-center gap-2 text-sm md:text-base font-bold text-gray-100 border-b border-gray-700/50 pb-2">
          <span className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm tracking-wider">
            Phase 2
          </span>
          Brompton 側微調整
        </h2>
        <p className="text-xs text-gray-400">
          基本同期を行ってもスキャンラインノイズが残る場合、以下の順序で微調整を行ってください。
        </p>

        <div className="flex flex-col gap-3">
          {phase2Instructions.map((step) => (
            <div key={step.order} className="bg-gray-900/40 border border-gray-700/50 rounded-lg p-3.5 hover:-translate-y-0.5 transition-transform">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-blue-600 text-white font-bold w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                  {step.order}
                </span>
                <h3 className="text-sm font-bold text-gray-100">{step.action}</h3>
              </div>
              <div className="pl-7">
                <p className="text-xs text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Phase 2 警告（Genlockなし等の警告） */}
        {phase2Results.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            {phase2Results.map((alert) => (
              <div key={alert.id} className={`flex gap-3 p-3.5 rounded-lg border-l-4 border ${getAlertClasses(alert.severity)}`}>
                <div className="text-xl flex items-center justify-center">⚠️</div>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-relaxed">{alert.advice}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
