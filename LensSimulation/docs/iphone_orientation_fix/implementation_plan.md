# 実装計画: 横向きレイアウト・セーフエリアの改修

## 1. セーフエリア (Notch / Punch hole) 対応の強化
`viewport-fit=cover` は設定済みですが、iOS の場合、パディングとして `env(safe-area-inset-top)` 等が効きにくいか、値が0として扱われるケースがあります。
WebベースのアプリがCapacitor経由でiPhoneアプリとして動く際、`index.css` にて全ての方向に対する `safe-area` クラスを作成します。

- `pt-safe`: `max(env(safe-area-inset-top), 1rem)` 等のフォールバックをつけます。
- `pl-safe`: 左側のノッチ用
- `pr-safe`: 右側のノッチ用
これにより、横持ち時の左右への被りも防ぎます。

## 2. モバイルでのランドスケープ (横画面) 対応
現在 `App.tsx` では、`hidden lg:grid`（PC用）と `flex flex-col lg:hidden`（モバイル用）の2系統があります。

モバイルのランドスケープ状態は、以下のCSSメディアクエリまたはTailwindのArbitrary variant機能を使ってスタイリングします。
しかし、React側で画面の短辺・長辺の違いを判定するのは複雑になるため、Tailwind CSS の `landscape:` と `portrait:` プレフィックスを駆使してレイアウトを出し分けます。

### 具体的な変更点 (App.tsx)
1.  **既存のモバイル用レイアウトを「縦向き (Portrait)」専用にする。**
    - `<div className="flex flex-col lg:hidden portrait:flex landscape:hidden">`
2.  **新しいモバイル「横向き (Landscape)」用レイアウトを追加する。**
    - `<div className="hidden lg:hidden landscape:grid grid-cols-3 gap-4">`
    - 左側にパラメーターパネル（1/3）
    - 右側にビューアー・被写界深度等（2/3）
    - スクロールが個別にできるように調整します。
3.  最上位のコンテナ (`div.max-w-6xl.mx-auto`) に左右のセーフエリアパディング (`px-safe` 相当) を付与し、横持ち時にコンテンツがノッチに埋もれないようにします。
