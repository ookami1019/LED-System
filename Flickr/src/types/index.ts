/**
 * カメラとLEDの同期トラブルを解決するための入力パラメータ
 */
export interface AnalyzerInputs {
  /** カメラ ベースフレームレート (例: 23.98, 24.00) */
  cameraBaseFps: number;
  /** カメラ 実フレームレート (例: 59.94, 60.00) */
  cameraHsFps: number;
  /** LED 駆動リフレッシュレート (例: 59.94, 60.00) */
  ledRefreshRate: number;
  /** シャッター設定モード (Angle または Speed) */
  shutterMode: 'Angle' | 'Speed';
  /** シャッター設定値 (Angleの場合は角度、Speedの場合は分母の数値) */
  shutterValue: number;
  /** カメラへのGenlock入力があるかどうか */
  hasGenlock: boolean;
  /** センサーシャッター方式 (Rolling または Global) */
  sensorType: 'Rolling' | 'Global';
}

/**
 * 診断結果の深刻度 (Severity)
 */
export type DiagnosticSeverity = 'High' | 'Warning' | 'Info';

/**
 * 診断の各フェーズで得られるアドバイス・ルール結果
 */
export interface DiagnosticRuleResult {
  /** ルールの一意なID */
  id: string;
  /** 警告・重要度 */
  severity: DiagnosticSeverity;
  /** アドバイス内容（日本語） */
  advice: string;
}

/**
 * Brompton側の微調整手順項目
 */
export interface AdjustmentInstruction {
  /** 調整の順番 */
  order: number;
  /** アクション名 */
  action: string;
  /** 具体的な調整手順の説明 */
  description: string;
}

/**
 * 診断結果の全体構造
 */
export interface DiagnosticResult {
  /** Phase 1: 基本周波数と露光の同期チェック結果のリスト */
  phase1Results: DiagnosticRuleResult[];
  /** Phase 2: Brompton側の微調整手順のリスト */
  phase2Instructions: AdjustmentInstruction[];
  /** Phase 2: 警告/確認ルールの結果リスト */
  phase2Results: DiagnosticRuleResult[];
  /** 警告やエラーが存在するかどうか */
  hasIssues: boolean;
  /** シャッタースピードから算出されたシャッター角度（オプション） */
  calculatedShutterAngle?: number;
  /** 実質露光時間 (秒) */
  exposureTime: number;
  /** 同期リスクアセスメント */
  riskAssessment: RiskAssessment;
}

/**
 * 同期リスクアセスメントの評価結果
 */
export interface RiskAssessment {
  level: 'Safe' | 'Moderate' | 'HighRisk';
  color: 'Green' | 'Yellow' | 'Red';
  message: string;
}
