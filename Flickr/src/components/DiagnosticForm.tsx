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

  const cameraBasePresets = [23.976, 24.00, 25.00, 29.97, 30.00];
  const cameraHsPresets = [23.976, 24.00, 25.00, 29.97, 30.00, 47.952, 48.00, 50.00, 59.94, 60.00, 95.904, 100.00, 120.00];
  const ledRefreshPresets = [23.976, 24.00, 25.00, 29.97, 30.00, 47.952, 48.00, 50.00, 59.94, 60.00, 95.904, 100.00, 120.00];

  const shutterAnglePresets = [45, 90, 144, 172.8, 180, 270, 360];
  const shutterSpeedPresets = [50, 60, 100, 120, 250, 500];

  return (
    <div className="diagnostic-form-container">
      <form className="diagnostic-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label htmlFor="cameraBaseFps" className="form-label">
            カメラ ベースフレームレート (Fps)
          </label>
          <div className="input-with-presets">
            <input
              id="cameraBaseFps"
              type="text"
              inputMode="decimal"
              value={inputs.cameraBaseFps}
              onChange={(e) => handleInputChange('cameraBaseFps', e.target.value.replace(/[^0-9.]/g, ''))}
              className="form-input"
            />
            <div className="preset-buttons">
              {cameraBasePresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`preset-btn ${inputs.cameraBaseFps === preset ? 'active' : ''}`}
                  onClick={() => handleInputChange('cameraBaseFps', preset)}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">カメラ 実フレームレート (HS)</label>
          <div className="input-with-presets">
            <input
              id="cameraHsFps"
              type="text"
              inputMode="decimal"
              value={inputs.cameraHsFps}
              onChange={(e) => handleInputChange('cameraHsFps', e.target.value.replace(/[^0-9.]/g, ''))}
              className="form-input"
            />
            <div className="preset-buttons">
              {cameraHsPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`preset-btn ${inputs.cameraHsFps === preset ? 'active' : ''}`}
                  onClick={() => handleInputChange('cameraHsFps', preset)}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">センサーシャッター方式</label>
          <div className="segmented-control">
            <button
              type="button"
              className={`segment-btn ${inputs.sensorType === 'Rolling' ? 'active' : ''}`}
              onClick={() => handleInputChange('sensorType', 'Rolling')}
            >
              Rolling (ローリング)
            </button>
            <button
              type="button"
              className={`segment-btn ${inputs.sensorType === 'Global' ? 'active' : ''}`}
              onClick={() => handleInputChange('sensorType', 'Global')}
            >
              Global (グローバル)
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="ledRefreshRate" className="form-label">
            LED 駆動フレームレート (Fps)
          </label>
          <div className="input-with-presets">
            <input
              id="ledRefreshRate"
              type="text"
              inputMode="decimal"
              value={inputs.ledRefreshRate}
              onChange={(e) => handleInputChange('ledRefreshRate', e.target.value.replace(/[^0-9.]/g, ''))}
              className="form-input"
            />
            <div className="preset-buttons">
              {ledRefreshPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`preset-btn ${inputs.ledRefreshRate === preset ? 'active' : ''}`}
                  onClick={() => handleInputChange('ledRefreshRate', preset)}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group half-width">
            <label className="form-label">シャッター設定モード</label>
            <div className="segmented-control">
              <button
                type="button"
                className={`segment-btn ${inputs.shutterMode === 'Angle' ? 'active' : ''}`}
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
                className={`segment-btn ${inputs.shutterMode === 'Speed' ? 'active' : ''}`}
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

          <div className="form-group half-width">
            <label htmlFor="shutterValue" className="form-label">
              シャッター設定値 {inputs.shutterMode === 'Angle' ? '(°)' : '(1/s)'}
            </label>
            <input
              id="shutterValue"
              type="text"
              inputMode="decimal"
              value={inputs.shutterValue}
              onChange={(e) => handleInputChange('shutterValue', e.target.value.replace(/[^0-9.]/g, ''))}
              className="form-input"
            />
          </div>
        </div>

        <div className="preset-buttons shutter-value-presets">
          {(inputs.shutterMode === 'Angle' ? shutterAnglePresets : shutterSpeedPresets).map((preset) => (
            <button
              key={preset}
              type="button"
              className={`preset-btn ${inputs.shutterValue === preset ? 'active' : ''}`}
              onClick={() => handleInputChange('shutterValue', preset)}
            >
              {inputs.shutterMode === 'Angle' ? `${preset}°` : `1/${preset}`}
            </button>
          ))}
        </div>

        <div className="form-group">
          <label className="form-label">カメラへのGenlock入力</label>
          <div className="segmented-control">
            <button
              type="button"
              className={`segment-btn ${inputs.hasGenlock ? 'active' : ''}`}
              onClick={() => handleInputChange('hasGenlock', true)}
            >
              あり
            </button>
            <button
              type="button"
              className={`segment-btn ${!inputs.hasGenlock ? 'active' : ''}`}
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
