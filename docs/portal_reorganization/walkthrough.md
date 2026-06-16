# ウォークスルー: ポータル画面のルートドメイン独立配置とFlickrの分離

`https://led.mimusubi.tokyo` のルート（トップページ）に独立したポータル画面（Portal）をデプロイし、シャッター同期診断ツール（Flickr）を `/flickr/` サブパスで動作する単一のツールとして分離する再構成作業を完了しました。

---

## 実施した主な変更

### 1. ポータル専用プロジェクトの新規作成
* **`Portal` ディレクトリの作成**:
  Vite + React (TypeScript) を用いた独立したWebアプリケーションプロジェクトを `/Users/seiji/Antigravity-1/LED-System/Portal` に新規作成しました。
* **ポータルコンポーネントの移植**:
  Flickr内に配置されていた `PortalHome.tsx` を移植し、Flickrカードをクリックした際に `window.location.href = '/flickr/'` で遷移する形に調整しました。また、開発中の他のツール（`controller`, `calculator`）のプレースホルダーも移植しました。
* **デザインの適用**:
  ガラスモルフィズムやグラデーションなどのプレミアムスタイルを `Portal/src/index.css` に移植しました。
* **Docker化設定**:
  ポータル用コンテナの設定として `Dockerfile` および `docker-compose.yml` を作成しました（ポート `3004:80` で動作）。

### 2. Flickr プロジェクトの単一機能化
* **状態管理の削除**:
  `Flickr/src/App.tsx` からポータルやプレースホルダー切り替え用の状態（`currentView`）およびコンポーネント読み込みを除去し、起動時に直接シャッター同期診断ツール (`ShutterSyncAnalyzer`) を表示するようにしました。
* **ナビゲーションの調整**:
  ヘッダーナビゲーションの「ポータルに戻る」をクリックした際の遷移先を、外部URLである `window.location.href = '/'`（ルートドメイン）に変更しました。
* **不要ファイルの削除**:
  Flickrプロジェクト内に残っていた `PortalHome.tsx` やプレースホルダー用のファイルを削除し、コードベースをクリーンに保ちました。

### 3. 共有インフラ設定（Nginx）の更新
* **`nginx/default.conf` の修正**:
  `led.mimusubi.tokyo` サーバーブロック内に `location /` ブロックを追記し、トップへのアクセスを新ポータルコンテナ `http://portal:80` (ポート3004) へプロキシするように設定しました。
* **`web_set/site_structure.xml` の更新**:
  インフラ定義ドキュメントに `portal` アプリケーション（ポート3004）を追記し、仮想ホストのルーティングをドキュメント化しました。

---

## 本番環境への反映手順

作業内容を本番環境（Windows Server）に反映させる手順は以下の通りです。

### 1. ソースコードの Push & Pull
ローカル（Mac）で追加・変更されたファイルをコミットし、Gitリモートリポジトリへ Push します。
Windows Server側で、`mws-infrastructure` と `LED-System` の両リポジトリで `git pull` を実行して最新の変更を取り込みます。

### 2. 新ポータル（portal）コンテナのデプロイ
Windowsサーバー上のポータル配置用ディレクトリ（例：`E:\mws\led\portal` に新 `Portal` のソースコードを配置）に移動し、ビルドおよび起動します。
```bash
cd E:\mws\led\portal
docker compose up -d --build
```

### 3. Flickrコンテナの再ビルド・再起動
ポータルコードが除去されたクリーンな状態のFlickrコンテナを再ビルドします。
```bash
cd E:\mws\led\flickr
docker compose up -d --build
```

### 4. 共有インフラ Nginx の設定反映
Nginxコンテナを再起動して、新しく追加した `location /` (ポータルプロキシ) の設定を読み込ませます。
```bash
cd E:\mws\infrastructure
docker compose restart nginx
```

---

## 検証結果

### 1. 自動検証 (ビルド & テスト)
* **ポータルプロジェクトのビルド**:
  `Portal` ディレクトリで `npm run build` がエラーなくパスし、静的ファイル（`dist/`）が正常に生成されました。
* **Flickrプロジェクトのテスト**:
  `Flickr` ディレクトリで `npm run test` (Vitest) を実行し、診断ロジックの全12件のテストが正常にパスしました。
* **Flickrプロジェクトのビルド**:
  不要なコードを削除した状態で `npm run build` が正常に成功することを確認しました。

### 2. 手動検証 (意図される画面遷移)
* `https://led.mimusubi.tokyo/` (ルート) ➡️ 新ポータル画面が表示されます。
* ポータル画面で「ShutterSync Quick Analyzer」をクリック ➡️ `https://led.mimusubi.tokyo/flickr/` へリダイレクトされ、診断ツールが直接起動します。
* 診断ツールのナビゲーションから「← ポータルに戻る」をクリック ➡️ `https://led.mimusubi.tokyo/`（ルート）にリダイレクトされ、元のポータル画面に戻ります。
* ポータル内の開発中ツールカードをクリック ➡️ ポータルSPA内で美しいロードマップ（プレースホルダー）が表示されます。
