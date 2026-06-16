# タスクリスト: LEDツール複数開発用ポータル構築およびGit管理一元化

- [x] **1. Gitリポジトリとドキュメントの整理**
  - [x] `Flickr/.git` ディレクトリをルート `/Users/seiji/Antigravity-1/LED-System/` に移動する
  - [x] `Flickr/.gitignore` をルートに移動し、サブディレクトリ配下のビルド成果物（`Flickr/node_modules/`, `Flickr/dist/` など）も正しく無視できるように調整する
  - [x] `Flickr/docs` 内のドキュメントをルート直下の `docs/` に移動し、構成を整理する
  - [x] ルートディレクトリで `git status` が正しく動作することを確認する
- [x] **2. Reactアプリのコンポーネント分割と新規作成**
  - [x] `src/components/ShutterSyncAnalyzer.tsx` を作成し、現在の `App.tsx` から診断ツールのメインUIと状態管理を移行する
  - [x] `src/components/PortalHome.tsx` を作成し、プレミアムで美しいデザインのポータル（リンク）画面を実装する
  - [x] `src/components/LedControllerPlaceholder.tsx` を作成し、将来のLEDコントローラー用プレースホルダー画面を実装する
  - [x] `src/components/LedCalculatorPlaceholder.tsx` を作成し、将来のLED計算機用プレースホルダー画面を実装する
- [x] **3. 画面遷移と全体の結合**
  - [x] `src/App.tsx` を修正し、`currentView` の状態に応じた表示切り替えと、ポータルに戻るための共通ナビゲーションを実装する
  - [x] `src/index.css` を修正し、ポータル画面、ナビゲーション、プレースホルダー用のプレミアムなスタイルを追加する
- [/] **4. 動作検証**
  - [ ] ローカル開発サーバーでの手動動作確認（遷移や既存機能の動作）
  - [ ] 自動テスト (`npm run test`) の実行と確認
  - [ ] 静的解析 (`npm run lint`) および TypeScriptコンパイル (`npm run build`) の実行と確認
  - [ ] 変更内容をコミットし、Git管理が一元化されていることを確認する
