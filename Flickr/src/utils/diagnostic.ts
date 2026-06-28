import type { AnalyzerInputs, DiagnosticResult, DiagnosticRuleResult, AdjustmentInstruction } from '../types';

/**
 * 入力されたパラメータに基づいて診断を行います。
 * @param inputs カメラおよびLEDの設定パラメータ
 * @returns 診断結果
 */
export function analyzeSettings(rawInputs: AnalyzerInputs): DiagnosticResult {
  const inputs = {
    ...rawInputs,
    cameraHsFps: Number(rawInputs.cameraHsFps) || 0,
    ledRefreshRate: Number(rawInputs.ledRefreshRate) || 0,
    shutterValue: Number(rawInputs.shutterValue) || 0,
  };

  const phase1Results: DiagnosticRuleResult[] = [];
  const phase2Results: DiagnosticRuleResult[] = [];
  let hasIssues = false;

  // Phase 1: 基本周波数と露光の同期チェック
  // Rule id: check_fps_sync
  if (inputs.cameraHsFps !== inputs.ledRefreshRate) {
    phase1Results.push({
      id: 'check_fps_sync',
      severity: 'High',
      advice: `【重要】カメラの実フレームレートとLEDの駆動フレームレートが一致していません。LED側のフレームレートをカメラの実フレームレート（${inputs.cameraHsFps}Fps）に合わせてください。`,
    });
    hasIssues = true;
  }

  let calculatedShutterAngle: number | undefined = undefined;

  // Rule id: check_shutter_angle
  if (inputs.sensorType === 'Rolling') {
    if (inputs.shutterMode === 'Angle') {
      if (inputs.shutterValue !== 180) {
        phase1Results.push({
          id: 'check_shutter_angle',
          severity: 'High',
          advice: '【重要】シャッター角度は原則「180°」に設定してください。角度を狭くするとスキャンラインは回避しやすくなりますが、代償としてLED特有の「バンディング(横縞)」「モアレ」の発生リスクが跳ね上がり、不自然な動き(モーションブラー不足)の原因となります。180°を維持したままPhase Offset等で調整するのが基本です。',
        });
        hasIssues = true;
      }
    } else if (inputs.shutterMode === 'Speed') {
      if (inputs.shutterValue > 0) {
        const calculatedVal = (360 * inputs.cameraHsFps) / inputs.shutterValue;
        calculatedShutterAngle = Math.round(calculatedVal * 100) / 100;
        
        // 許容誤差を考慮 (例えば 179.5 ~ 180.5)
        if (Math.abs(calculatedShutterAngle - 180) > 0.5) {
          const recommendedSpeed = inputs.cameraHsFps * 2;
          phase1Results.push({
            id: 'check_shutter_angle',
            severity: 'High',
            advice: `【重要】現在のシャッタースピードから計算される角度は ${calculatedShutterAngle}° です。180°（1/${recommendedSpeed}秒）に設定してください。短すぎる露光時間は「バンディング(横縞)」や「モアレ」、不自然な動きなどの致命的な映像ノイズを引き起こすため推奨されません。`,
          });
          hasIssues = true;
        }
      } else {
        phase1Results.push({
          id: 'check_shutter_angle',
          severity: 'High',
          advice: '【重要】無効なシャッタースピード値です。正の数値を入力してください。',
        });
        hasIssues = true;
      }
    }
  } else {
    // Global シャッターのときも、 calculatedShutterAngle の計算だけは行う
    if (inputs.shutterMode === 'Speed' && inputs.shutterValue > 0) {
      const calculatedVal = (360 * inputs.cameraHsFps) / inputs.shutterValue;
      calculatedShutterAngle = Math.round(calculatedVal * 100) / 100;
    }
  }

  // Phase 2: Brompton側の微調整手順（常に表示される手順）
  const phase2Instructions: AdjustmentInstruction[] = [
    {
      order: 1,
      action: 'Phase Offsetの調整',
      description: 'Bromptonの設定画面にて『Phase Offset』の数値を変更してください。数値を変えることでスキャンラインノイズが上下に動くため、カメラの画角からノイズが見えない位置に設定してください。',
    },
    {
      order: 2,
      action: 'Sensor Readout Timeの調整',
      description: 'Phase Offsetを調整してもノイズが消えきらない場合は、『Sensor Readout Time』の数値を調整してください。目安として2〜3msあたりに設定すると改善する場合があります。',
    },
  ];

  // Rule id: check_genlock_warning
  if (!inputs.hasGenlock) {
    phase2Results.push({
      id: 'check_genlock_warning',
      severity: 'Warning',
      advice: '【警告】カメラにGenlockが入力されていないため、調整したものが時間経過によってズレてしまいます。撮影前に定期的な確認・再調整が必要です。',
    });
    hasIssues = true;
  }

  // 露出時間 (秒) の計算
  const exposureTime = inputs.shutterMode === 'Angle'
    ? (inputs.cameraHsFps > 0 ? (inputs.shutterValue / 360) * (1 / inputs.cameraHsFps) : 0)
    : (inputs.shutterValue > 0 ? (1 / inputs.shutterValue) : 0);

  // シャッター角度の取得
  const shutterAngleForRisk = inputs.shutterMode === 'Angle'
    ? inputs.shutterValue
    : (inputs.shutterValue > 0 ? (360 * inputs.cameraHsFps) / inputs.shutterValue : 0);

  // 同期リスク評価 (Risk Assessment)
  let riskAssessment: import('../types').RiskAssessment;

  if (inputs.sensorType === 'Rolling') {
    if (shutterAngleForRisk >= 358) {
      riskAssessment = {
        level: 'Safe',
        color: 'Green',
        message: '【ノイズリスク最小】1サイクルを完全に露光しています。ただしモーションブラー（被写体のブレ）は大きくなります。',
      };
    } else if (shutterAngleForRisk >= 170) {
      riskAssessment = {
        level: 'Moderate',
        color: 'Yellow',
        message: '【標準的】調整によりノイズ回避が可能です。Phase Offsetを操作してスキャンラインを画面外に移動させてください。',
      };
    } else {
      riskAssessment = {
        level: 'HighRisk',
        color: 'Red',
        message: '【ノイズ発生リスク大】部分露光によりスキャンラインが太く映り込みます。ShutterSync等のLEDコントローラー側の高度な同期機能の併用を検討してください。',
      };
    }
  } else {
    // Global Shutter
    if (shutterAngleForRisk >= 358) {
      riskAssessment = {
        level: 'Safe',
        color: 'Green',
        message: '【フリッカーリスク最小】グローバルシャッターかつ全露出状態です。スキャンラインノイズは発生しません。',
      };
    } else if (shutterAngleForRisk >= 170) {
      riskAssessment = {
        level: 'Moderate',
        color: 'Yellow',
        message: '【フリッカーリスク低】グローバルシャッターのため縞ノイズは発生しませんが、明滅（フリッカー）防止のため、実フレームレートとLED同期をご確認ください。',
      };
    } else {
      riskAssessment = {
        level: 'HighRisk',
        color: 'Red',
        message: '【フリッカーリスクあり】縞ノイズは出ませんが、露光時間が極めて短いため画面全体の明暗差（フリッカー）が発生するリスクがあります。',
      };
    }
  }

  return {
    phase1Results,
    phase2Instructions,
    phase2Results,
    hasIssues,
    calculatedShutterAngle,
    exposureTime,
    riskAssessment,
  };
}
