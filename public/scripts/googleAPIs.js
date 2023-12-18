const { google } = require('googleapis');

// APIキーを設定
const apiKey = 'YOUR_API_KEY';

// YouTube Data APIを初期化
const youtube = google.youtube({
    version: 'v3',
    auth: apiKey
});
