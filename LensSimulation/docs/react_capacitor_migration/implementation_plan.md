# Implementation Plan: React + Capacitor移行

## フェーズ1: プロジェクトの初期構築
- `npx create-vite` を使用して `React + TypeScript` プロジェクトをルートディレクトリに作成。
- すべての不要な初期ファイルを削除・整理。
- 必要な依存関係のインストール：
  - `three`, `@types/three`
  - `@react-three/fiber`, `@react-three/drei`
  - `tailwindcss`, `postcss`, `autoprefixer`
  - `lucide-react` (アイコン用)
  - `@capacitor/core`, `@capacitor/cli`

## フェーズ2: UIとスタイリング環境の構築 (Tailwind CSS)
- Tailwind CSSの初期化 (`tailwind.config.js` 等)。
- スタイリッシュなダークテーマ、グラスモーフィズム等を取り入れたプレミアムなデザインのベースとなる `index.css` の作成。
- `user_global` ルールに従い、構成を `src/components`, `src/utils`, `src/types` に分割。

## フェーズ3: コア・ロジックの移植とコンポーネント作成
- `src/types/index.ts` にセンサーサイズやアスペクト比の型定義を追加。
- 以下のReactコンポーネントを作成:
  - `ParameterPanel`: スライダーやセレクトボックスなどの設定UI
  - `StatsDisplay`: 算出された画角（水平・垂直・対角）の表示パネル
  - `TopViewMap`: SVGを利用したTOPビューの切り取り範囲ビジュアライザー
  - `CameraView3D`: React Three Fiber を用いた 3D シミュレーション・キャンバス

## フェーズ4: アプリケーション全体の統合
- `App.tsx` 内でステート（焦点距離、センサーサイズ、アスペクト比）を統合管理し、各コンポーネントへpropsとして渡す。
- ユーザーの操作に応じて画角計算が走り、2Dビューと3Dビューが連動する処理を実装。

## フェーズ5: Capacitor のセットアップ
- `npx cap init` の実行。
- CapacitorとViteを連携させるための設定調整（ビルドディレクトリの設定など）。
- 将来的なネイティブビルドに向けた設定完了を確認し、動作チェックを実施。
