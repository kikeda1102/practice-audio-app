// プリロードされた audioBuffers を取得関数
async function preloadAudioBuffers(clips, progressBar) {
    // Web Audio APIコンテキストの作成
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // 音声の preload
    const audioBuffers = await preloadAllAudio(clips, progressBar);

    // ブラウザの再生状態を確認
    if (audioContext.state === "suspended") {
        // AudioContext が一時停止状態の場合、ユーザージェスチャー後に再開
        document.addEventListener(
            "click",
            function () {
                audioContext.resume().then(() => {
                    console.log("AudioContext resumed successfully");
                });
            },
            { once: true }
        );
    }

    return audioBuffers;
}

// 確認ダイアログを表示する関数
async function showLoadModal(clips) {
    return new Promise(async (resolve) => {
        // モーダルを表示
        document.getElementById('loadModal').style.display = 'block';

        // プログレスバーの作成と追加
        const progressContainer = document.createElement("div");
        progressContainer.className = "progress-container";
        document.querySelector('.modal-content').appendChild(progressContainer);

        const progressBar = document.createElement("div");
        progressBar.className = "progress-bar";
        progressContainer.appendChild(progressBar);

        // ボタンがクリックされたらプリロード開始
        document.getElementById('startLoading').addEventListener('click', async function () {
            this.classList.add('clicked');
            try {
                // audioBuffersの取得
                const audioBuffers = await preloadAudioBuffers(clips, progressBar);

                // clipsにaudioBuffersを追加
                clips.forEach((clip, index) => {
                    clip.audioBuffer = audioBuffers[index];
                });

                // 音声再生ボタンの生成
                clips.forEach((clip) => {
                    const button = document.createElement("button");
                    button.type = "button";
                    button.textContent = clip.title;
                    button.onclick = () => {
                        // 単音モードの場合、選択された音のみ再生
                        if (isMonophonic) {
                            playMonoAudio(clip.audioBuffer);
                        } else {
                            // 複音モードの場合、すべての音を同時に再生
                            playPolyAudio(clip.audioBuffer);
                        }
                    };
                    playButtonArea.appendChild(button);
                });

                // プリロードが完了したら Modal を閉じる
                document.getElementById('loadModal').style.display = 'none';

                resolve(audioBuffers);
            } catch (error) {
                // エラーが発生した場合の処理
                console.error(error);
            }
        });
    });
}
