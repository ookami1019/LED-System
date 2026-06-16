# タスクリスト

- [x] プロジェクトの初期化 (Vite + React + TypeScript)
- [x] テスト環境 (Vitest 等) の設定と依存関係のインストール
- [x] 型定義ファイルの作成 (`src/types/index.ts`)
- [x] ローカルストレージユーティリティの作成 (`src/utils/localStorage.ts`)
- [x] 診断ロジックの作成 (`src/utils/diagnostic.ts`)
- [x] 診断ロジックのテスト作成と動作確認 (`src/utils/__tests__/diagnostic.test.ts`)
- [x] UIコンポーネント (フォーム) の作成 (`src/components/DiagnosticForm.tsx`)
- [x] UIコンポーネント (診断結果) の作成 (`src/components/DiagnosticResult.tsx`)
- [x] スタイルの調整 (`src/index.css`)
- [x] アプリケーションの統合 (`src/App.tsx` / `src/main.tsx`)
- [x] 動作確認とウォークスルーの作成 (`walkthrough.md`)

## 追加要件タスク
- [x] 型定義に `calculatedShutterAngle` を追加 (`src/types/index.ts`)
- [x] 診断ロジックにシャッタースピード時の角度計算と同期判定を追加 (`src/utils/diagnostic.ts`)
- [x] 診断ロジックのテストにシャッタースピード用ケースを追加 (`src/utils/__tests__/diagnostic.test.ts`)
- [x] UIに算出されたシャッター角度を表示する機能を追加 (`src/components/DiagnosticResult.tsx`)
- [x] 動作確認とウォークスルーの更新 (`walkthrough.md`)

## ビジュアライザー機能タスク
- [x] ビジュアライザー用の型定義の追加 (`src/types/index.ts`)
- [x] 露出時間・リスク評価のロジック追加とテスト作成 (`src/utils/diagnostic.ts`, `src/utils/__tests__/diagnostic.test.ts`)
- [x] ExposureVisualizer コンポーネントの実装 (`src/components/ExposureVisualizer.tsx`)
- [x] UI統合とレイアウト調整 (`src/App.tsx`)
- [x] ビジュアライザー用CSSスタイルの追加 (`src/index.css`)
- [x] 動作確認とウォークスルーの作成 (`walkthrough.md`)

## シャッター方式（ローリング/グローバル）対応タスク
- [x] シャッター方式用の型定義追加 (`src/types/index.ts`)
- [x] デフォルト値とLocalStorage連携の更新 (`src/utils/localStorage.ts`)
- [x] グローバルシャッター対応の診断ロジック・テストの更新 (`src/utils/diagnostic.ts`, `src/utils/__tests__/diagnostic.test.ts`)
- [x] シャッター方式選択UIの追加 (`src/components/DiagnosticForm.tsx`)
- [x] グローバルシャッター対応のビジュアライザー実装とCSS定義 (`src/components/ExposureVisualizer.tsx`, `src/index.css`)
- [x] 動作確認とウォークスルーの作成 (`walkthrough.md`)

