// app.js
const express = require("express");
const ejs = require("ejs");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
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

// // MySQLデータベースへの接続
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "!toriniNaru5",
//   database: "mymusicdb",
// });

// JSONファイルのパス
const jsonFilePath = path.join(__dirname, "clipInfo.json");

// ルートパスへのGETリクエストの処理

// app.get("/", (req, res) => {
//   // MySQLから曲の情報を取得
//   connection.query("SELECT * FROM songs", (err, results) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send("Error retrieving songs");
//     } else {
//       // データベースから取得した曲の情報をテンプレートに渡して表示
//       res.render("index", { title: "Music App", songs: results });
//     }
//   });
// });

// ルートパスへのGETリクエストの処理
app.get("/", (req, res) => {
  // JSONファイルから曲の情報を取得
  const songs = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));

  // データベースから取得した曲の情報をテンプレートに渡して表示
  res.render("index", { title: "Music App", songs: songs });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
