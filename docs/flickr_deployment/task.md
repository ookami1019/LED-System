# タスクリスト (Flickr デプロイ・共有インフラ統合)

## 1. Flickr プロジェクト側の修正
- [x] `vite.config.ts` に `base: '/flickr/'` を設定
- [x] `Dockerfile` の作成 (マルチステージビルド・静的ファイル配信)
- [x] `docker-compose.yml` の作成 (ポート3003, 外部ネットワーク web-network)

## 2. 共有インフラ側の設定修正
- [x] `mws-infrastructure/nginx/default.conf` に `led.mimusubi.tokyo` サーバーブロックおよび `/flickr/` プロキシ設定を追加
- [x] `mws-infrastructure/web_set/site_structure.xml` に Flickr アプリ定義を追加

## 3. 検証
- [x] ローカルビルドテスト (Vitest 実行)
- [x] Docker コンテナのローカルビルド・起動確認
- [x] Nginx 設定ファイルの構文確認
- [x] walkthrough.md の作成
