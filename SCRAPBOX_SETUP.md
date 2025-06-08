# Scrapbox 統合機能セットアップガイド

このドキュメントでは、ポートフォリオサイトに Scrapbox の最新ページを表示する機能のセットアップ方法を説明します。

## 🎯 機能概要

- Scrapbox プロジェクト「tkgshn」から最新ページを取得
- pin されたページや注釈ページを自動除外
- 美しいカード UI で記事のプレビューを表示
- レスポンシブデザイン対応
- 実際のページコンテンツプレビュー付き

## 🚀 セットアップ方法

### 1. プロキシサーバーの起動

CORS 問題を解決するため、専用のプロキシサーバーを起動します：

```bash
# ターミナル1: プロキシサーバー
node proxy-server.js
```

プロキシサーバーが正常に起動すると以下が表示されます：

```
🚀 Scrapbox Proxy Server running on http://localhost:3002
📚 Ready to proxy Scrapbox API requests
🔗 Available endpoints:
   GET /api/pages/{project}?limit=N
   GET /api/pages/{project}/{title}/text
   GET /health
```

### 2. Web サーバーの起動

```bash
# ターミナル2: Webサーバー
python3 -m http.server 8003
```

### 3. 動作確認

ブラウザで以下の URL にアクセス：

- **メインサイト**: http://localhost:8003
- **プロキシヘルスチェック**: http://localhost:3002/health

## 🔧 技術詳細

### プロキシサーバー (proxy-server.js)

- **ポート**: 3002
- **機能**: ScrapboxAPI への CORS 問題を解決
- **エンドポイント**:
  - `GET /api/pages/tkgshn?limit=N` - ページリスト取得
  - `GET /api/pages/tkgshn/{title}/text` - 個別ページ内容取得
  - `GET /health` - ヘルスチェック

### フロントエンド統合

- **ファイル**: `index.html`
- **表示位置**: Social Links セクションの上
- **データ処理**:
  - Scrapbox 記法の自動除去
  - 200 文字プレビュー
  - タグ抽出・表示
  - エラーハンドリング

### フィルタリング機能

以下のページは自動的に除外されます：

- pin されたページ
- タイトルに「anno」「memo」「note」が含まれるページ
- 注釈関連のコンテンツを含むページ

## 🛠️ カスタマイズ

### 表示件数の変更

`index.html`の以下の行を編集：

```javascript
.slice(0, 12); // 最初の12件を取得
```

### プロキシサーバーポートの変更

1. `proxy-server.js`の`PORT`を変更
2. `index.html`の`PROXY_BASE_URL`を対応するポートに変更

### プロジェクト名の変更

`index.html`の以下の行を編集：

```javascript
const project = "tkgshn"; // 他のScrapboxプロジェクト名に変更
```

## 🚨 トラブルシューティング

### プロキシサーバーが起動しない

- ポート 3002 が使用中の場合、別のポートを使用
- Node.js がインストールされているか確認

### データが表示されない

1. プロキシサーバーのヘルスチェックを確認
2. ブラウザの開発者ツールでコンソールエラーを確認
3. ネットワークタブで API 呼び出しを確認

### CORS エラーが発生する

- プロキシサーバーが正常に動作しているか確認
- ブラウザのセキュリティ設定を確認

## 📝 開発メモ

- **実装日**: 2025 年 6 月 8 日
- **参考実装**: `/Users/tkgshn/Developer/scrapbox-reader`
- **技術スタック**: vanilla JavaScript, Node.js HTTP server
- **デザイン**: Card UI, Flexbox Grid, Hover effects

## 🎨 デザイン特徴

- **カードベース UI**: 各記事を独立したカードで表示
- **ホバーエフェクト**: マウスオーバーで 3D 風の浮き上がり効果
- **レスポンシブ**: モバイルで 1 列、デスクトップで複数列表示
- **統一感**: 既存サイトデザインとの調和

この統合により、ポートフォリオサイトで Scrapbox の最新記事が動的に表示され、訪問者により豊富なコンテンツを提供できます。
