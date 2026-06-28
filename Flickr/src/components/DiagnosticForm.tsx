import React from 'react';
import type { AnalyzerInputs } from '../types';

interface DiagnosticFormProps {
  inputs: AnalyzerInputs;
  onChange: (inputs: AnalyzerInputs) => void;
}

export const DiagnosticForm: React.FC<DiagnosticFormProps> = ({ inputs, onChange }) => {
  const handleInputChange = <K extends keyof AnalyzerInputs>(
    key: K,
    value: AnalyzerInputs[K]
  ) => {
    onChange({
      ...inputs,
      [key]: value,
    });
  };

  const cameraHsPresets = [23.976, 24.00, 25.00, 29.97, 30.00, 47.952, 48.00, 50.00, 59.94, 60.00, 95.904, 100.00, 120.00];
  const ledRefreshPresets = [23.976, 24.00, 25.00, 29.97, 30.00, 47.952, 48.00, 50.00, 59.94, 60.00, 95.904, 100.00, 120.00];

  const shutterAnglePresets = [45, 90, 144, 172.8, 180, 270, 360];
  const shutterSpeedPresets = [50, 60, 100, 120, 250, 500];

  return (
    <div className="w-full">
      <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-400">カメラ センサーフレームレート (Fps)</label>
          <div className="flex flex-col gap-2">
            <input
              id="cameraHsFps"
              type="text"
              inputMode="decimal"
              value={inputs.cameraHsFps}
              onChange={(e) => handleInputChange('cameraHsFps', e.target.value.replace(/[^0-9.]/g, ''))}
              className="w-full bg-gray-900/60 border border-gray-700/50 text-gray-100 font-mono text-base px-3 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            <div className="flex flex-wrap gap-1.5">
              {cameraHsPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`px-2 py-1.5 text-xs font-medium rounded-md transition-all select-none ${
                    inputs.cameraHsFps === preset
                      ? 'bg-blue-600/90 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)] border border-blue-500'
                      : 'bg-gray-800/60 text-gray-400 border border-gray-700 hover:bg-gray-700/80 hover:text-gray-200'
                  }`}
                  onClick={() => handleInputChange('cameraHsFps', preset)}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-400">センサーシャッター方式</label>
          <div className="flex p-1 bg-gray-900/60 border border-gray-700/50 rounded-lg">
            <button
              type="button"
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                inputs.sensorType === 'Rolling'
                  ? 'bg-gray-700 text-white shadow border border-gray-600'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              onClick={() => handleInputChange('sensorType', 'Rolling')}
            >
              Rolling (ローリング)
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                inputs.sensorType === 'Global'
                  ? 'bg-gray-700 text-white shadow border border-gray-600'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              onClick={() => handleInputChange('sensorType', 'Global')}
            >
              Global (グローバル)
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="ledRefreshRate" className="text-xs font-semibold text-gray-400">
            LED 駆動フレームレート (Fps)
          </label>
          <div className="flex flex-col gap-2">
            <input
              id="ledRefreshRate"
              type="text"
              inputMode="decimal"
              value={inputs.ledRefreshRate}
              onChange={(e) => handleInputChange('ledRefreshRate', e.target.value.replace(/[^0-9.]/g, ''))}
              className="w-full bg-gray-900/60 border border-gray-700/50 text-gray-100 font-mono text-base px-3 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            <div className="flex flex-wrap gap-1.5">
              {ledRefreshPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`px-2 py-1.5 text-xs font-medium rounded-md transition-all select-none ${
                    inputs.ledRefreshRate === preset
                      ? 'bg-blue-600/90 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)] border border-blue-500'
                      : 'bg-gray-800/60 text-gray-400 border border-gray-700 hover:bg-gray-700/80 hover:text-gray-200'
                  }`}
                  onClick={() => handleInputChange('ledRefreshRate', preset)}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400">シャッター設定モード</label>
            <div className="flex p-1 bg-gray-900/60 border border-gray-700/50 rounded-lg h-full">
              <button
                type="button"
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all flex items-center justify-center ${
                  inputs.shutterMode === 'Angle'
                    ? 'bg-gray-700 text-white shadow border border-gray-600'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
                onClick={() => {
                  onChange({
                    ...inputs,
                    shutterMode: 'Angle',
                    shutterValue: 180,
                  });
                }}
              >
                Angle
              </button>
              <button
                type="button"
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all flex items-center justify-center ${
                  inputs.shutterMode === 'Speed'
                    ? 'bg-gray-700 text-white shadow border border-gray-600'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
                onClick={() => {
                  onChange({
                    ...inputs,
                    shutterMode: 'Speed',
                    shutterValue: 100,
                  });
                }}
              >
                Speed
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <label htmlFor="shutterValue" className="text-xs font-semibold text-gray-400">
              シャッター設定値 {inputs.shutterMode === 'Angle' ? '(°)' : '(1/s)'}
            </label>
            <input
              id="shutterValue"
              type="text"
              inputMode="decimal"
              value={inputs.shutterValue}
              onChange={(e) => handleInputChange('shutterValue', e.target.value.replace(/[^0-9.]/g, ''))}
              className="w-full bg-gray-900/60 border border-gray-700/50 text-gray-100 font-mono text-base px-3 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(inputs.shutterMode === 'Angle' ? shutterAnglePresets : shutterSpeedPresets).map((preset) => (
            <button
              key={preset}
              type="button"
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all select-none ${
                inputs.shutterValue === preset
                  ? 'bg-blue-600/90 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)] border border-blue-500'
                  : 'bg-gray-800/60 text-gray-400 border border-gray-700 hover:bg-gray-700/80 hover:text-gray-200'
              }`}
              onClick={() => handleInputChange('shutterValue', preset)}
            >
              {inputs.shutterMode === 'Angle' ? `${preset}°` : `1/${preset}`}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-400">カメラへのGenlock入力</label>
          <div className="flex p-1 bg-gray-900/60 border border-gray-700/50 rounded-lg">
            <button
              type="button"
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                inputs.hasGenlock
                  ? 'bg-gray-700 text-white shadow border border-gray-600'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              onClick={() => handleInputChange('hasGenlock', true)}
            >
              あり
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                !inputs.hasGenlock
                  ? 'bg-gray-700 text-white shadow border border-gray-600'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              onClick={() => handleInputChange('hasGenlock', false)}
            >
              なし
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
