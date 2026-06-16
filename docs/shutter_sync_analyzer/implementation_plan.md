# ShutterSync Quick Analyzer 実装計画（グローバル/ローリングシャッター機能追加）

カメラのセンサーシャッター方式（ローリングシャッター / グローバルシャッター）の選択機能を追加し、それぞれの方式における物理的な露光挙動とノイズ/フリッカーリスクをリアルタイムに視覚化・診断する機能を追加します。

## 追加される機能

### 1. 入力パラメータの拡張
- **センサーシャッター方式 (`sensorType`)**:
  - `Rolling` (ローリングシャッター - 初期値) / `Global` (グローバルシャッター) を選択するUIをフォームに追加します。

### 2. 診断ロジックの調整
- **方式に応じたリスク評価の切り替え**:
  - `Global` (グローバルシャッター) 選択時：
    - 画面内の部分露光によるスキャンラインノイズ（縞模様）は発生しないため、評価を「フリッカー（明滅）リスク」に切り替えます。
    - 露光時間が十分に長ければ `Safe`、短い場合は全体が明滅する `Moderate` / `HighRisk` に分類し、適切なアドバイスを出力します。

### 3. ビジュアライザー (`ExposureVisualizer`) の表示切り替え
- **RotaryShutter (シャッターモデル)**:
  - `Rolling`時: 従来通り、開口部を持ったホイールが回転します。
  - `Global`時: 全画素が同時に露光・遮光するため、ホイールは回転せず、カメラの露出タイミング（`exposureTime`）に合わせて開口部が「点滅（明滅）」するアニメーションを行います。
- **LedRefreshCycle (LEDスキャンモデル)**:
  - `Rolling`時: 上から下へ落下するスキャンライン。
  - `Global`時: 縞模様は映らないため、落下ラインは非表示（またはブレンド）とし、LEDの書き換えタイミングに合わせて画面全体が同期してごく微細に明滅する（フリッカー）シミュレーションに変更します。

---

## 提案される変更

### 1. ドキュメントおよび計画

#### [MODIFY] [docs/shutter_sync_analyzer/implementation_plan.md](file:///Users/seiji/Antigravity-1/LED-System/Flickr/docs/shutter_sync_analyzer/implementation_plan.md)
- 本実装計画書（シャッター方式の追加仕様を記載）。

#### [MODIFY] [docs/shutter_sync_analyzer/task.md](file:///Users/seiji/Antigravity-1/LED-System/Flickr/docs/shutter_sync_analyzer/task.md)
- シャッター方式関連タスクの追記。

### 2. アプリケーションコード

#### [MODIFY] [src/types/index.ts](file:///Users/seiji/Antigravity-1/LED-System/Flickr/src/types/index.ts)
- `AnalyzerInputs` に `sensorType: 'Rolling' | 'Global';` を追加。

#### [MODIFY] [src/utils/localStorage.ts](file:///Users/seiji/Antigravity-1/LED-System/Flickr/src/utils/localStorage.ts)
- `DEFAULT_INPUTS` に `sensorType: 'Rolling'` を追加し、パース時の復元ロジックを更新。

#### [MODIFY] [src/utils/diagnostic.ts](file:///Users/seiji/Antigravity-1/LED-System/Flickr/src/utils/diagnostic.ts)
- グローバルシャッター時のリスクアセスメント（フリッカー判定、およびスキャンラインノイズ警告の抑制）の実装。

#### [MODIFY] [src/utils/__tests__/diagnostic.test.ts](file:///Users/seiji/Antigravity-1/LED-System/Flickr/src/utils/__tests__/diagnostic.test.ts)
- グローバルシャッター選択時の診断結果・リスク判定に関するテストを追加。

#### [MODIFY] [src/components/DiagnosticForm.tsx](file:///Users/seiji/Antigravity-1/LED-System/Flickr/src/components/DiagnosticForm.tsx)
- 「センサーシャッター方式（Rolling / Global）」を切り替えるセグメントコントロールUIを追加。

#### [MODIFY] [src/components/ExposureVisualizer.tsx](file:///Users/seiji/Antigravity-1/LED-System/Flickr/src/components/ExposureVisualizer.tsx)
- グローバルシャッター用の点滅シャッターアニメーション、およびフリッカー明滅LEDシミュレーションの実装。

#### [MODIFY] [src/index.css](file:///Users/seiji/Antigravity-1/LED-System/Flickr/src/index.css)
- グローバルシャッター用の点滅アニメーション（CSS `@keyframes`）、およびスキャンライン・明滅画面のCSSスタイル。

---

## 検証計画

### 自動テスト
- 新ロジック（グローバルシャッター判定）を含めたVitestの実行。
  ```bash
  npx vitest run
  ```

### 手動検証
1. フォームで `Global` シャッターを選択した際、ビジュアライザーのシャッターホイールが「回転」から「明滅」に切り替わること。
2. `Global` シャッター選択時、右側のスキャンモデル内の落下ラインが消え、画面全体が点滅すること。
3. `Global` シャッター選択時、右側の診断結果にて「スキャンラインノイズ」ではなく「フリッカー（明滅）」に関するアドバイスが表示されること。
