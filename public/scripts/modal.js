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

                // Web Audio APIコンテキストの作成
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                // preload
                const audioBuffers = await preloadAllAudio(clips, progressBar);

                // ブラウザの再生状態を確認
                if (audioContext.state === "suspended") {
                    // AudioContextが一時停止状態の場合、ユーザージェスチャー後に再開
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

                // playボタンの作成とクリック時の処理を設定
                clips.forEach((clip, index) => {
                    const button = document.createElement("button");
                    button.type = "button";
                    button.textContent = clip.title;
                    button.onclick = () => {
                        // 単音モードの場合、選択された音のみ再生
                        if (isMonophonic) {
                            playMonoAudio(audioBuffers[index]);
                        } else {
                            // 複音モードの場合、すべての音を同時に再生
                            playPolyAudio(audioBuffers[index]);
                        }
                    };
                    document.body.appendChild(button);
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
