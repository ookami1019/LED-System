import { describe, it, expect } from 'vitest';
import { analyzeSettings } from '../diagnostic';
import type { AnalyzerInputs } from '../../types';

describe('analyzeSettings', () => {
  it('should return no issues when settings are synchronized and have genlock', () => {
    const inputs: AnalyzerInputs = {
      cameraHsFps: 59.94,
      ledRefreshRate: 59.94,
      shutterMode: 'Angle',
      shutterValue: 180,
      hasGenlock: true,
      sensorType: 'Rolling',
    };

    const result = analyzeSettings(inputs);
    expect(result.phase1Results).toHaveLength(0);
    expect(result.phase2Results).toHaveLength(0);
    expect(result.hasIssues).toBe(false);
    expect(result.phase2Instructions).toHaveLength(2);
  });

  it('should trigger check_fps_sync warning when camera HS FPS and LED refresh rate differ', () => {
    const inputs: AnalyzerInputs = {
      cameraHsFps: 59.94,
      ledRefreshRate: 60.00, // 不一致
      shutterMode: 'Angle',
      shutterValue: 180,
      hasGenlock: true,
      sensorType: 'Rolling',
    };

    const result = analyzeSettings(inputs);
    expect(result.phase1Results).toHaveLength(1);
    expect(result.phase1Results[0].id).toBe('check_fps_sync');
    expect(result.phase1Results[0].severity).toBe('High');
    expect(result.phase1Results[0].advice).toContain('59.94Fps'); // エラーメッセージに cameraHsFps が入っているか
    expect(result.hasIssues).toBe(true);
  });

  it('should trigger check_shutter_angle warning when shutter mode is not Angle', () => {
    const inputs: AnalyzerInputs = {
      cameraHsFps: 59.94,
      ledRefreshRate: 59.94,
      shutterMode: 'Speed', // 不一致
      shutterValue: 180,
      hasGenlock: true,
      sensorType: 'Rolling',
    };

    const result = analyzeSettings(inputs);
    expect(result.phase1Results).toHaveLength(1);
    expect(result.phase1Results[0].id).toBe('check_shutter_angle');
    expect(result.phase1Results[0].severity).toBe('High');
    expect(result.hasIssues).toBe(true);
  });

  it('should trigger check_shutter_angle warning when shutter value is not 180', () => {
    const inputs: AnalyzerInputs = {
      cameraHsFps: 59.94,
      ledRefreshRate: 59.94,
      shutterMode: 'Angle',
      shutterValue: 90, // 不一致
      hasGenlock: true,
      sensorType: 'Rolling',
    };

    const result = analyzeSettings(inputs);
    expect(result.phase1Results).toHaveLength(1);
    expect(result.phase1Results[0].id).toBe('check_shutter_angle');
    expect(result.hasIssues).toBe(true);
  });

  it('should trigger check_genlock_warning when hasGenlock is false', () => {
    const inputs: AnalyzerInputs = {
      cameraHsFps: 59.94,
      ledRefreshRate: 59.94,
      shutterMode: 'Angle',
      shutterValue: 180,
      hasGenlock: false, // Genlockなし
      sensorType: 'Rolling',
    };

    const result = analyzeSettings(inputs);
    expect(result.phase1Results).toHaveLength(0);
    expect(result.phase2Results).toHaveLength(1);
    expect(result.phase2Results[0].id).toBe('check_genlock_warning');
    expect(result.phase2Results[0].severity).toBe('Warning');
    expect(result.hasIssues).toBe(true);
  });

  it('should return no issues when shutter mode is Speed and calculated angle is 180', () => {
    const inputs: AnalyzerInputs = {
      cameraHsFps: 60.00,
      ledRefreshRate: 60.00,
      shutterMode: 'Speed',
      shutterValue: 120, // 360 * 60 / 120 = 180°
      hasGenlock: true,
      sensorType: 'Rolling',
    };

    const result = analyzeSettings(inputs);
    expect(result.calculatedShutterAngle).toBe(180);
    expect(result.phase1Results).toHaveLength(0);
    expect(result.hasIssues).toBe(false);
  });

  it('should trigger warning when shutter mode is Speed and calculated angle is not 180', () => {
    const inputs: AnalyzerInputs = {
      cameraHsFps: 60.00,
      ledRefreshRate: 60.00,
      shutterMode: 'Speed',
      shutterValue: 100, // 360 * 60 / 100 = 216°
      hasGenlock: true,
      sensorType: 'Rolling',
    };

    const result = analyzeSettings(inputs);
    expect(result.calculatedShutterAngle).toBe(216);
    expect(result.phase1Results).toHaveLength(1);
    expect(result.phase1Results[0].id).toBe('check_shutter_angle');
    expect(result.phase1Results[0].advice).toContain('216°');
    expect(result.phase1Results[0].advice).toContain('1/120秒');
    expect(result.hasIssues).toBe(true);
  });

  it('should evaluate risk as Safe when shutter angle is 360', () => {
    const inputs: AnalyzerInputs = {
      cameraHsFps: 60.00,
      ledRefreshRate: 60.00,
      shutterMode: 'Angle',
      shutterValue: 360,
      hasGenlock: true,
      sensorType: 'Rolling',
    };

    const result = analyzeSettings(inputs);
    expect(result.exposureTime).toBeCloseTo(0.01666, 4);
    expect(result.riskAssessment.level).toBe('Safe');
    expect(result.riskAssessment.color).toBe('Green');
  });

  it('should evaluate risk as Moderate when shutter angle is 180', () => {
    const inputs: AnalyzerInputs = {
      cameraHsFps: 60.00,
      ledRefreshRate: 60.00,
      shutterMode: 'Angle',
      shutterValue: 180,
      hasGenlock: true,
      sensorType: 'Rolling',
    };

    const result = analyzeSettings(inputs);
    expect(result.exposureTime).toBeCloseTo(0.00833, 4);
    expect(result.riskAssessment.level).toBe('Moderate');
    expect(result.riskAssessment.color).toBe('Yellow');
  });

  it('should evaluate risk as HighRisk when shutter angle is 90', () => {
    const inputs: AnalyzerInputs = {
      cameraHsFps: 60.00,
      ledRefreshRate: 60.00,
      shutterMode: 'Angle',
      shutterValue: 90,
      hasGenlock: true,
      sensorType: 'Rolling',
    };

    const result = analyzeSettings(inputs);
    expect(result.exposureTime).toBeCloseTo(0.00416, 4);
    expect(result.riskAssessment.level).toBe('HighRisk');
    expect(result.riskAssessment.color).toBe('Red');
  });

  it('should evaluate risk for Global shutter and not raise shutter angle warnings when shutter is not 180', () => {
    const inputs: AnalyzerInputs = {
      cameraHsFps: 60.00,
      ledRefreshRate: 60.00,
      shutterMode: 'Angle',
      shutterValue: 90, // 180ではないが、Globalシャッターなので警告は出ない
      hasGenlock: true,
      sensorType: 'Global',
    };

    const result = analyzeSettings(inputs);
    expect(result.phase1Results).toHaveLength(0); // 警告は0件
    expect(result.riskAssessment.level).toBe('HighRisk'); // 露出時間が短いためリスクはHigh
    expect(result.riskAssessment.message).toContain('フリッカーリスク');
  });

  it('should evaluate risk as Safe for Global shutter when shutter angle is 360', () => {
    const inputs: AnalyzerInputs = {
      cameraHsFps: 60.00,
      ledRefreshRate: 60.00,
      shutterMode: 'Angle',
      shutterValue: 360,
      hasGenlock: true,
      sensorType: 'Global',
    };

    const result = analyzeSettings(inputs);
    expect(result.riskAssessment.level).toBe('Safe');
    expect(result.riskAssessment.message).toContain('フリッカーリスク最小');
  });
});
