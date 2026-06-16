import { useState, useEffect } from 'react';
import { DiagnosticForm } from './DiagnosticForm';
import { DiagnosticResult } from './DiagnosticResult';
import { ExposureVisualizer } from './ExposureVisualizer';
import { loadSavedInputs, saveInputs } from '../utils/localStorage';
import { analyzeSettings } from '../utils/diagnostic';

/**
 * シャッター同期診断ツール (ShutterSync Quick Analyzer) コンポーネント
 */
export function ShutterSyncAnalyzer() {
  const [inputs, setInputs] = useState(loadSavedInputs);

  useEffect(() => {
    saveInputs(inputs);
  }, [inputs]);

  const diagnosticResult = analyzeSettings(inputs);

  return (
    <div className="analyzer-container">
      <header className="tool-header">
        <h2 className="tool-title">ShutterSync Quick Analyzer</h2>
        <p className="tool-description">
          カメラとLED間の同期トラブル（スキャンラインノイズ等）診断・ナビゲーション
        </p>
      </header>

      <main className="main-content">
        <div className="left-column">
          <section className="card-section">
            <DiagnosticForm inputs={inputs} onChange={setInputs} />
          </section>

          <section className="card-section">
            <ExposureVisualizer inputs={inputs} result={diagnosticResult} />
          </section>
        </div>

        <div className="right-column">
          <section className="card-section">
            <DiagnosticResult result={diagnosticResult} />
          </section>
        </div>
      </main>
    </div>
  );
}
