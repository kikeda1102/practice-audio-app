// 現在再生中のソース
let currentSource;
// 単音か複音かのフラグ
let isMonophonic = false;


// 音声再生
// 単音
function playMonoAudio(audioBuffer) {
    // 現在再生中の音があれば停止
    if (currentSource) {
        currentSource.stop();
    }
    // 新しいソースを作成して再生
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
    // 現在のソースを更新
    currentSource = source;
}
// 複数音声
function playPolyAudio(audioBuffer) {
    // 新しいソースを作成して再生
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
}

// 再生モード切り替え関数
function setMonophonicMode() {
    isMonophonic = true;
    updateModeButtons();
}

function setPolyphonicMode() {
    isMonophonic = false;
    updateModeButtons();
}




// 音声データを一括でプリロードする関数
async function preloadAllAudio(clips, progressBar) {
    return new Promise(async (resolve) => {
        // Promiseの配列を作成
        const promises = clips.map(async (clip, index) => {

            // ファイルの取得
            const response = await fetch(`audioClips/${clip.title}.mp3`);

            // レスポンスが正常でない場合はエラーをスロー
            if (!response.ok) {
                throw new Error(
                    `Failed to fetch: ${response.status} ${response.statusText}`
                );
            }

            // 音声データの取得とデコード
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            // 進捗のリアルタイム表示
            const progress = (index + 1) / clips.length * 100;
            progressBar.style.width = `${progress}%`;


            // 取得した音声データを返す
            return audioBuffer;
        });


        // すべての音声データを一括でプリロード
        const audioBuffers = await Promise.all(promises);

        // プログレスバーの進捗を100%に更新
        progressBar.style.width = "100%";

        // プログレスバーの削除
        // progressContainer.remove();

        resolve(audioBuffers);
    }
    );
}
