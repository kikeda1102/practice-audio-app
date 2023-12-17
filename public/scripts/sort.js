
// 日付順にソートする
function sort_by_date(clips, order = 'ascend') {
    if (!['ascend', 'descend'].includes(order)) {
        throw new Error(`Invalid order parameter: ${order}. Please use 'ascend' or 'descend'.`);
    }

    const sortedClips = [...clips];

    sortedClips.sort((a, b) => {
        const dateA = new Date(a.uploadedDate);
        const dateB = new Date(b.uploadedDate);

        // 日付で比較
        const dateComparison = order === 'ascend' ? dateA - dateB : dateB - dateA;

        if (dateComparison !== 0) {
            return dateComparison; // 日付が異なる場合、それで返す
        }

        // 日付が同じ場合は time で比較
        const timeA = parseTime(a.time);
        const timeB = parseTime(b.time);

        return timeA - timeB;
    });

    return sortedClips;
}

// "1:23" のような時間文字列を分単位の数値に変換する関数
function parseTime(timeString) {
    const [minutes, seconds] = timeString.split(':').map(Number);
    return minutes * 60 + seconds;
}


// タイトル順
function sort_by_title(clips, order = 'ascend') {
    if (!['ascend', 'descend'].includes(order)) {
        throw new Error(`Invalid order parameter: ${order}. Please use 'ascend' or 'descend'.`);
    }

    const sortedClips = [...clips];

    sortedClips.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();

        if (order === 'ascend') {
            return titleA.localeCompare(titleB);
        } else {
            return titleB.localeCompare(titleA);
        }
    });

    return sortedClips;
}

function sortClips(clips, order, type) {
    // let sortedClips = [...window.clips];

    switch (type) {
        case 'date':
            sortedClips = sort_by_date(clips, order);
            break;
        case 'title':
            sortedClips = sort_by_title(clips, order);
            break;
        default:
            // サポートしていないソートタイプの場合はエラー
            throw new Error(`Invalid sort type: ${type}`);
    }

    return sortedClips;
}


// ソート後のクリップを表示または処理する
function displaySortedClips(sortedClips) {
    // 表示エリアをクリア
    const playButtonArea = document.getElementById("playButtonArea");
    playButtonArea.innerHTML = '';

    // ボタンを生成
    sortedClips.forEach((clip) => {
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

}

// ソートボタンがクリックされたときにソートを実行する関数
function onSortButtonClick(clips, order, type, buttonId) {
    // ここで clips をソートする処理を行う
    const sortedClips = sortClips(clips, order, type);
    // ソート後のクリップを表示する
    displaySortedClips(sortedClips);
    // ボタンの選択状態を更新する
    updateSortButtons(buttonId);
}


// ソートボタンのIDに基づいて order と type を返す wrapper 関数
function getSortParams(buttonId) {
    switch (buttonId) {
        case 'sortAscendDateButton':
            return { order: 'ascend', type: 'date' };
        case 'sortDescendDateButton':
            return { order: 'descend', type: 'date' };
        case 'sortAscendTitleButton':
            return { order: 'ascend', type: 'title' };
        case 'sortDescendTitleButton':
            return { order: 'descend', type: 'title' };
        default:
            return { order: 'ascend', type: 'date' }; // デフォルトの設定
    }
}



// wrapper 関数を使用して sortClips を呼び出す
function sortClipsWrapper(clips, buttonId) {
    const { order, type } = getSortParams(buttonId);
    // console.log(`order: ${order}, type: ${type}`);
    const result = sortClips(clips, order, type);
    // console.log(result);
    return result;
}
