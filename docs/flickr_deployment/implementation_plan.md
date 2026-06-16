# Flickr (ShutterSync Quick Analyzer) デプロイ・共有インフラ統合計画

Flickr プロジェクト (ShutterSync Quick Analyzer) を Docker コンテナ化し、共有インフラである `mws-infrastructure` (Nginx リバースプロキシ / 共通ネットワーク) に統合して、ドメイン **`led.mimusubi.tokyo/flickr`** で公開するための実装計画です。

---

## ユーザー確認事項 (User Review Required)

> [!NOTE]
> **サブパス構成 (`led.mimusubi.tokyo/flickr`) の採用について**
> ユーザーのご指定通り、今後LED関連ツールを拡張していくことを見据え、親ドメイン `led.mimusubi.tokyo` の配下にサブパスで配置する構成を採用します。
> これにより、既存の SSL 証明書 (`*.mimusubi.tokyo`) をそのまま共有利用でき、新規ツール追加の際もDNS設定を追加することなく、Nginx設定の追記のみで拡張可能になります。

---

## 提案される変更 (Proposed Changes)

### 1. [Flickr プロジェクト側] (file:///Users/seiji/Antigravity-1/LED-System/Flickr)

本番環境のサブパス `/flickr/` 配下で正常に静的ファイル（JS, CSS, 画像アセット）がロードされるように設定を調整し、Docker化します。

#### [MODIFY] [vite.config.ts](file:///Users/seiji/Antigravity-1/LED-System/Flickr/vite.config.ts)
Vite のビルド時のベースパスとして `base: '/flickr/'` を追加します。これにより、HTML内のアセットURLが相対的に解決されるようになります。

#### [NEW] [Dockerfile](file:///Users/seiji/Antigravity-1/LED-System/Flickr/Dockerfile)
マルチステージビルドを定義します。
* **ビルドステージ**: `node:20-alpine` を使用して `npm run build` を実行。
* **実行ステージ**: `nginx:alpine` を使用。Nginx の配信ディレクトリ内に `flickr` というサブフォルダを作成し、ビルド成果物を `/usr/share/nginx/html/flickr` にコピーします。これにより、Nginxリバースプロキシからサブパス付きで転送されたリクエストをシームレスに処理できます。

#### [NEW] [docker-compose.yml](file:///Users/seiji/Antigravity-1/LED-System/Flickr/docker-compose.yml)
* サービス名: `flickr`
* ポート設定: `3003:80`（ホストの `3003` ポートをコンテナの Nginx `80` ポートにマップ。空きポートを使用）
* ネットワーク設定: 共有ネットワーク `my-web-server-network` (`external: true`) を利用。

---

### 2. [共有インフラ側] (file:///Users/seiji/Antigravity-1/mws-infrastructure)

#### [MODIFY] [nginx/default.conf](file:///Users/seiji/Antigravity-1/mws-infrastructure/nginx/default.conf)
* `led.mimusubi.tokyo` のホスト名に対するサーバーブロック（HTTP 80 → HTTPS 443のリダイレクト、およびHTTPS 443設定）を追加。
* `location /flickr/` ブロックを定義し、コンテナ `flickr:80` へリバースプロキシ（`proxy_pass`）します。既存コンテナ追従設計に合わせ、`resolver` と変数を用いた動的ホスト解決（起動順序依存の回避）を実装します。
* `location = /flickr` ブロックを定義し、末尾スラッシュなしアクセスを `/flickr/` へ 301 リダイレクトして相対パスのズレを防ぎます。

#### [MODIFY] [web_set/site_structure.xml](file:///Users/seiji/Antigravity-1/mws-infrastructure/web_set/site_structure.xml)
Flickr アプリケーションを `site_structure.xml` の Applications リストに追記し、公開用ドメイン `led.mimusubi.tokyo/flickr` および使用ポート `3003` などの定義をドキュメント化します。

---

## 動作・デプロイ手順 (Deployment Steps)

### 1. Mac ローカル環境でのファイル作成・検証
1. `Flickr` プロジェクトの `vite.config.ts` に `base: '/flickr/'` を設定。
2. Docker イメージをビルド・起動し、ローカルでコンテナ動作確認。
3. `mws-infrastructure` の `nginx/default.conf` を修正。

### 2. Windows 本番サーバーへの適用手順
1. **GitHub等への Push**:
   Mac 側で各プロジェクトの変更をコミットし、リモートリポジトリへ Push します。
2. **Windows Server 側での適用**:
   * Windows サーバー上で `mws-infrastructure` および `Flickr` のリポジトリを Pull。
   * Flickr 用ディレクトリ (例: `E:\mws\led\flickr` を想定) にコードを配置。
   * 共有インフラの再起動:
     ```bash
     cd E:\mws\infrastructure
     docker compose restart nginx
     ```
   * Flickr コンテナのビルド・起動:
     ```bash
     cd E:\mws\led\flickr
     docker compose up -d --build
     ```
3. **Cloudflare DNS の設定**:
   Cloudflare ドメイン管理画面で、`led.mimusubi.tokyo` (Aレコード) にサーバーのグローバル IP アドレスを紐付けます（※すでに紐付いている場合は、Flickr 用の設定は不要です）。

---

## 検証計画 (Verification Plan)

### 自動テスト / 構文チェック
* Flickr 側の Vitest テストが正常に実行・完了すること。
* Nginx 設定ファイルの構文チェック (Nginx コンテナ内の `nginx -t` に相当する検証)。

### 手動検証
* `https://led.mimusubi.tokyo/flickr/` にアクセスし、正常にツール画面が表示され、コンポーネントがエラーなく動作すること。
* `https://led.mimusubi.tokyo/flickr`（スラッシュなし）にアクセスした際、自動的に `https://led.mimusubi.tokyo/flickr/` へリダイレクトされること。
