import React from 'react';
import type { DiagnosticResult as DiagnosticResultType } from '../types';

interface DiagnosticResultProps {
  result: DiagnosticResultType;
}

export const DiagnosticResult: React.FC<DiagnosticResultProps> = ({ result }) => {
  const { phase1Results, phase2Instructions, phase2Results, calculatedShutterAngle } = result;

  return (
    <div className="diagnostic-results">
      {/* Phase 1 結果 */}
      <section className="result-section">
        <h2 className="section-title">
          <span className="step-badge">Phase 1</span>
          基本周波数・露光同期
        </h2>

        {calculatedShutterAngle !== undefined && (
          <div className="calculated-angle-container">
            <span className="calculated-angle-label">算出シャッター角度:</span>
            <span className={`calculated-angle-value ${Math.abs(calculatedShutterAngle - 180) <= 0.1 ? 'match' : 'mismatch'}`}>
              {calculatedShutterAngle}°
            </span>
            {Math.abs(calculatedShutterAngle - 180) <= 0.1 ? (
              <span className="angle-status-badge status-ok">同期可</span>
            ) : (
              <span className="angle-status-badge status-ng">非推奨</span>
            )}
          </div>
        )}

        {phase1Results.length > 0 ? (
          <div className="alert-list">
            {phase1Results.map((alert) => (
              <div key={alert.id} className={`alert-card severity-${alert.severity.toLowerCase()}`}>
                <div className="alert-icon">
                  {alert.severity === 'High' ? '🚨' : '⚠️'}
                </div>
                <div className="alert-content">
                  <p className="alert-text">{alert.advice}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert-card severity-success">
            <div className="alert-icon">✓</div>
            <div className="alert-content">
              <p className="alert-text">
                基本同期に問題ありません。カメラの実フレームレートとLEDフレームレートが一致し、シャッター角度は適切に同期しています（180°）。
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Phase 2 微調整手順 */}
      <section className="result-section">
        <h2 className="section-title">
          <span className="step-badge">Phase 2</span>
          Brompton 側微調整
        </h2>
        <p className="section-subtitle">
          基本同期を行ってもスキャンラインノイズが残る場合、以下の順序で微調整を行ってください。
        </p>

        <div className="instruction-steps">
          {phase2Instructions.map((step) => (
            <div key={step.order} className="step-card">
              <div className="step-header">
                <span className="step-number">{step.order}</span>
                <h3 className="step-action">{step.action}</h3>
              </div>
              <div className="step-body">
                <p className="step-description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Phase 2 警告（Genlockなし等の警告） */}
        {phase2Results.length > 0 && (
          <div className="alert-list p2-alerts">
            {phase2Results.map((alert) => (
              <div key={alert.id} className={`alert-card severity-${alert.severity.toLowerCase()}`}>
                <div className="alert-icon">⚠️</div>
                <div className="alert-content">
                  <p className="alert-text">{alert.advice}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
