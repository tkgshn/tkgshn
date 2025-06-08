# Scrapbox 統合機能 - GitHub Actions 版

このドキュメントでは、GitHub Actions を使用して自動的に Scrapbox データを取得・更新する機能について説明します。

## 🎯 概要

- **定期実行**: 毎日 06:00 JST（21:00 UTC）に自動実行
- **手動実行**: GitHub 上でワークフローを手動トリガー可能
- **静的ファイル**: プロキシサーバー不要、JSON ファイルベース
- **デザイン統一**: 既存の`project-list`スタイルに合わせた最小限の CSS

## 📁 ファイル構成

```
.github/workflows/update-scrapbox.yml  # GitHub Actionsワークフロー
scripts/fetch-scrapbox.js              # データ取得スクリプト
data/scrapbox-pages.json               # 生成されるデータファイル
index.html                             # 更新されたメインページ
```

## 🚀 セットアップ

### 1. 初回データ取得

ローカルで初回データ取得を実行：

```bash
# データディレクトリ作成
mkdir -p data

# 初回データ取得
node scripts/fetch-scrapbox.js
```

### 2. GitHub Actions の有効化

リポジトリを GitHub にプッシュすると、以下が自動的に実行されます：

- **定期実行**: 毎日 6 時に最新データを取得
- **手動実行**: "Actions"タブから手動でトリガー可能

### 3. 動作確認

```bash
# ローカルサーバー起動
python3 -m http.server 8004
```

ブラウザで `http://localhost:8004` にアクセス

## 🎨 デザイン仕様

### 既存デザインとの統一

```css
.scrapbox-item {
  background-color: #f0f0f0; /* project-listと同じ背景色 */
  padding: 15px; /* project-listと同じパディング */
  border-radius: 5px; /* project-listと同じ角丸 */
  margin-bottom: 15px; /* project-listと同じマージン */
  cursor: pointer;
}

.scrapbox-item:hover {
  background-color: #e8e8e8; /* ホバー時の色変更 */
}
```

### 表示要素

- **日付**: 2025 年 6 月 8 日 形式
- **タイトル**: 太字で表示
- **コンテンツ**: 200 文字プレビュー
- **タグ**: 最大 4 つ、残りは+N 形式

## 🔧 カスタマイズ

### 表示件数の変更

`scripts/fetch-scrapbox.js` の以下の行を編集：

```javascript
.slice(0, 12); // 最初の12件を取得
```

### 実行頻度の変更

`.github/workflows/update-scrapbox.yml` の cron 設定を編集：

```yaml
schedule:
  - cron: "0 21 * * *" # 毎日21:00 UTC (06:00 JST)
```

### プロジェクト名の変更

`scripts/fetch-scrapbox.js` の定数を編集：

```javascript
const PROJECT = "tkgshn"; // 他のプロジェクト名に変更
```

## 📊 データ構造

生成される`data/scrapbox-pages.json`の構造：

```json
{
  "project": "tkgshn",
  "lastUpdated": 1749376803556,
  "pages": [
    {
      "id": "unique-page-id",
      "title": "ページタイトル",
      "updated": 1749376803,
      "contentText": "200文字プレビュー...",
      "tags": ["tag1", "tag2", "tag3"]
    }
  ]
}
```

## 🚨 トラブルシューティング

### GitHub Actions が失敗する

1. Actions タブでエラーログを確認
2. Node.js 18 が正しく設定されているか確認
3. Scrapbox API の変更がないか確認

### データが表示されない

1. `data/scrapbox-pages.json` ファイルが存在するか確認
2. ブラウザの開発者ツールでネットワークエラーを確認
3. JSON ファイルの構造が正しいか確認

### フィルタリングが適切でない

`scripts/fetch-scrapbox.js` のフィルタリング条件を調整：

```javascript
// タイトルフィルタ
if (title.includes('annopage') || title.includes('memo')) {
  return false;
}

// コンテンツフィルタ
if (contentLower.includes('annotation')) {
  continue;
}
```

## 🌟 メリット

### プロキシサーバー版との比較

| 項目         | GitHub Actions 版 | プロキシサーバー版      |
| ------------ | ----------------- | ----------------------- |
| サーバー運用 | ❌ 不要           | ⚠️ 必要                 |
| 表示速度     | ⚡ 高速（静的）   | 🐌 低速（API 呼び出し） |
| 運用コスト   | 💰 無料           | 💸 サーバー費用         |
| データ更新   | 🕒 定期自動       | 🔄 リアルタイム         |
| セットアップ | 🎯 簡単           | 🔧 複雑                 |

## 📝 今後の拡張

- **キャッシュ機能**: ブラウザキャッシュでさらなる高速化
- **エラー通知**: Slack/Discord 通知
- **複数プロジェクト**: 複数 Scrapbox プロジェクトの統合
- **タグフィルタ**: 特定タグの記事のみ表示

この実装により、メンテナンスフリーで美しく Scrapbox の記事を表示できるようになりました！
