const https = require('https');
const fs = require('fs');
const path = require('path');

/**
 * GitHub Actions用 Scrapboxデータ取得スクリプト
 * プロキシサーバー不要で直接APIから取得
 */

const PROJECT = 'tkgshn';
const OUTPUT_DIR = path.join(__dirname, '../data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'scrapbox-pages.json');

// Scrapbox記法を除去する関数
function cleanScrapboxContent(content) {
  return content
    .replace(/\[public\.icon[^\]]*\]/g, '')
    .replace(/\[[^\]]*\.icon[^\]]*\]/g, '')
    .replace(/\[https?:\/\/[^\]]+\]/g, '')
    .replace(/\[([^\[\]]+)\s+https?:\/\/[^\]]+\]/g, '$1')
    .replace(/\[[^\[\]]{50,}\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// タグを抽出する関数
function extractTags(descriptions) {
  const tags = [];
  descriptions.forEach(desc => {
    const matches = desc.match(/\[([^\]]+)\]/g);
    if (matches) {
      matches.forEach(match => {
        const tagContent = match.slice(1, -1);
        if (!tagContent.includes('public.icon') &&
            !tagContent.includes('http') &&
            !tagContent.includes('.icon') &&
            !tagContent.includes('/') &&
            !tagContent.includes('*') &&
            tagContent.length > 0 &&
            tagContent.length < 30) {
          tags.push(tagContent);
        }
      });
    }
  });
  return [...new Set(tags)];
}

// HTTPSリクエストのPromiseラッパー
function httpsRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', reject);
  });
}

// メイン処理
async function fetchScrapboxData() {
  try {
    console.log(`📚 Fetching Scrapbox data from project: ${PROJECT}`);

    // ページリストを取得
    const listUrl = `https://scrapbox.io/api/pages/${PROJECT}?limit=100`;
    const listData = JSON.parse(await httpsRequest(listUrl));

    if (!listData.pages) {
      throw new Error('No pages found in response');
    }

    console.log(`📄 Found ${listData.pages.length} pages`);

    // フィルタリング
    const filteredPages = listData.pages.filter(page => {
      // pinされたページを除外
      if (page.pin && page.pin > 0) return false;

      // タイトルに注釈関連のキーワードが含まれる場合を除外
      const title = page.title ? page.title.toLowerCase() : '';
      if (title.includes('annopage') ||
          title.includes('annview') ||
          title.includes('annotation') ||
          title.includes('memo') ||
          title.includes('note') ||
          title.includes('#anno')) {
        return false;
      }

      // descriptions内に注釈関連のキーワードが含まれる場合を除外
      const descriptions = page.descriptions || [];
      const hasAnnoContent = descriptions.some(desc => {
        const lowerDesc = desc.toLowerCase();
        return lowerDesc.includes('#annopage') ||
               lowerDesc.includes('annopage') ||
               lowerDesc.includes('annview') ||
               lowerDesc.includes('annotation') ||
               lowerDesc.includes('memo') ||
               lowerDesc.includes('note');
      });

      return !hasAnnoContent;
    }).slice(0, 12); // 最初の12件

    console.log(`✅ Filtered to ${filteredPages.length} pages`);

    // 各ページのコンテンツを取得
    const pagesWithContent = [];
    for (let i = 0; i < filteredPages.length; i++) {
      const page = filteredPages[i];
      console.log(`📖 Processing ${i + 1}/${filteredPages.length}: ${page.title}`);

      try {
        const contentUrl = `https://scrapbox.io/api/pages/${PROJECT}/${encodeURIComponent(page.title)}/text`;
        const content = await httpsRequest(contentUrl);

        // コンテンツ内にも注釈関連のキーワードが含まれていないかチェック
        const contentLower = content.toLowerCase();
        if (contentLower.includes('#annopage') ||
            contentLower.includes('annopage') ||
            contentLower.includes('annview') ||
            contentLower.includes('annotation')) {
          console.log(`⏭️  Skipping ${page.title} - contains annotation content`);
          continue;
        }

        // コンテンツ処理
        const lines = content.split('\n').filter(line => line.trim() !== '');
        const rawPreview = lines.slice(0, 5).join(' ').trim();
        const cleanedPreview = cleanScrapboxContent(rawPreview);
        const contentText = cleanedPreview.length > 200
          ? cleanedPreview.substring(0, 200) + '…'
          : cleanedPreview;

        const tags = extractTags(page.descriptions || []);

        pagesWithContent.push({
          ...page,
          contentText: contentText || 'コンテンツを読み込めませんでした',
          tags
        });

        // API負荷軽減のため少し待機
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn(`⚠️  Error fetching content for ${page.title}:`, error.message);
        pagesWithContent.push({
          ...page,
          contentText: 'ページの内容を取得できませんでした',
          tags: []
        });
      }
    }

    // 出力ディレクトリを作成
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // 結果をJSONファイルに保存
    const result = {
      project: PROJECT,
      lastUpdated: Date.now(),
      pages: pagesWithContent
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
    console.log(`💾 Saved ${pagesWithContent.length} pages to ${OUTPUT_FILE}`);
    console.log(`🎉 Successfully updated Scrapbox data!`);

  } catch (error) {
    console.error('❌ Error fetching Scrapbox data:', error);
    process.exit(1);
  }
}

// 実行
fetchScrapboxData();
