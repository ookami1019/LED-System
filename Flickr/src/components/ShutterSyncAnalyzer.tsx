import { useState, useEffect } from 'react';
import { DiagnosticForm } from './DiagnosticForm';
import { DiagnosticResult } from './DiagnosticResult';
import { ExposureVisualizer } from './ExposureVisualizer';
import { loadSavedInputs, saveInputs } from '../utils/localStorage';
import { analyzeSettings } from '../utils/diagnostic';

export function ShutterSyncAnalyzer() {
  const [inputs, setInputs] = useState(loadSavedInputs);

  useEffect(() => {
    saveInputs(inputs);
  }, [inputs]);

  const diagnosticResult = analyzeSettings(inputs);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 md:gap-6 items-start w-full">
      {/* 
        左カラム: パラメータ設定 (PCでは1カラム分) 
        モバイルでは下部に配置、PCでは左に固定配置
      */}
      <div className="order-2 lg:order-1 col-span-1 w-full bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-xl overflow-hidden p-4 md:p-5">
        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          設定パラメータ
        </h3>
        <DiagnosticForm inputs={inputs} onChange={setInputs} />
      </div>

      {/* 
        右カラム: ビジュアライザー & 診断結果 (PCでは3カラム分)
        モバイルでは上部に配置
      */}
      <div className="order-1 lg:order-2 col-span-3 w-full flex flex-col gap-4 md:gap-6 lg:sticky lg:top-4 z-30">
        <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-xl overflow-hidden p-4 md:p-6 transition-colors duration-300">
          <ExposureVisualizer inputs={inputs} result={diagnosticResult} />
        </div>

        <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-xl overflow-hidden p-4 md:p-6">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            診断結果 & 改善提案
          </h3>
          <DiagnosticResult result={diagnosticResult} />
        </div>
      </div>
    </div>
  );
}
