
// ワード検索機能, 再生ボタンの生成
function handleSearch() {
    const searchQuery = document.getElementById('searchInput').value.trim();
    const playButtonArea = document.getElementById('playButtonArea');

    // ここで検索処理を実装
    const searchResults = performSearch(searchQuery, clips);

    // 検索結果表示エリアをクリア
    playButtonArea.innerHTML = '';

    // 検索結果があるかどうかをチェック
    if (searchResults.length > 0) {
        // 検索結果がある場合はボタンを生成
        searchResults.forEach((clip) => {
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
    } else {
        // 検索結果がない場合はメッセージを表示
        const noResultsMessage = document.createElement("p");
        noResultsMessage.textContent = "検索結果がありません";
        playButtonArea.appendChild(noResultsMessage);
    }
}

function performSearch(query, clips) {
    // 検索クエリが空の場合
    if (!query) {
        return clips;
    }
    // 検索結果を格納する配列
    const searchResults = [];

    // clipsから検索クエリに一致するclipを抽出
    clips.forEach(clip => {
        // clip.titleがqueryを含む場合
        if (clip.title.toLowerCase().includes(query.toLowerCase())) {
            searchResults.push(clip);
        }
    });
    return searchResults;
}




// タグフィルター機能
function filterClipsByTag(tag) {
    // 検索結果表示エリアをクリア
    playButtonArea.innerHTML = '';

    // 新しい配列を作成して現在の選択されたタグをコピー
    let newSelectedTags = [...currentSelectedTags];

    // currentSelectedTagsにtagが含まれているかどうかをチェック
    // 含まれている場合はnewSelectedTagsからtagを削除
    // 含まれていない場合はnewSelectedTagsにtagを追加
    if (newSelectedTags.includes(tag)) {
        newSelectedTags = currentSelectedTags.filter(currentTag => currentTag !== tag);
    } else {
        newSelectedTags = [...currentSelectedTags, tag];
    }
    // console.log(`tag:${tag}`);
    // console.log(`currentSelectedTags:${currentSelectedTags}`);
    // console.log(`newSelectedTags:${newSelectedTags}`);


    // タグボタンのスタイルを更新
    updateTagButtons(newSelectedTags);

    // フィルタリング実行
    const filteredClips = performFiltering(newSelectedTags, clips);

    // フィルタリング結果を表示
    filteredClips.forEach((clip) => {
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

    // グローバル変数currentSelectedTagsを更新
    currentSelectedTags = newSelectedTags;
}

function performFiltering(tags, clips) {
    // タグが選択されていない場合
    if (tags.length === 0) {
        return clips;
    }

    // 検索結果を格納する配列
    const filteredClips = [];

    // clipsからtagsに一致するclipを抽出
    clips.forEach(clip => {
        // clip.whoSaidがtagsに含まれる場合
        if (tags.includes(clip.whoSaid)) {
            filteredClips.push(clip);
        }
    });

    // console.log(`tags.length === ${tags.length}`)

    return filteredClips;
}
