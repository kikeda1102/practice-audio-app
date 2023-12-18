// app.js
const express = require("express");
const ejs = require("ejs");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
require('dotenv').config();
require('./config');
const youtubeAPI = require('./youtubeAPI');
const app = express();
const PORT = process.env.PORT || 3000; // Herokuが提供するポートまたはデフォルトのポート3000を使用

app.use(cors()); // CORSミドルウェアを追加
app.use(bodyParser.urlencoded({ extended: true })); // URLエンコードされたデータを解析するミドルウェアを追加
app.use(bodyParser.json()); // JSONデータを解析するミドルウェアを追加
// publicディレクトリを静的ファイルのルートディレクトリとして指定
app.use(express.static("public"));

// EJS をテンプレートエンジンとして設定
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// JSONファイルの絶対パスを取得
const jsonFilePath = path.join(__dirname, "clipInfo.json");
const clips = fs.readFileSync(jsonFilePath, "utf8");

// ルートパスへのGETリクエストの処理
app.get("/", (req, res) => {
  // データベースから取得した曲の情報をテンプレートに渡して表示
  res.render("index", { clips: clips });
});

// 切り抜き元動画を表示
app.get('/reference-videos', async (req, res) => {
  try {
    const uniqueUrls = new Set();
    const videosData = [];

    // 重複を除いた切り抜き元動画のURLを取得
    for (const clip of JSON.parse(clips)) {
      const videoUrl = clip.url;
      if (!uniqueUrls.has(videoUrl)) {
        uniqueUrls.add(videoUrl);

        const videoId = youtubeAPI.extractVideoIdFromUrl(videoUrl);
        if (!videoId) {
          throw new Error('Invalid YouTube video URL');
        }

        const title = await youtubeAPI.getVideoTitle(videoId);
        videosData.push({ url: videoUrl, title: title || videoUrl });
      }
    }

    res.render('reference-videos', { videosData });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error fetching video title');
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
