// 初期化関数
async function initialize() {
    try {
        // ダブルタップでの画面拡大を無効にする
        document.addEventListener("dblclick", function (e) {
            e.preventDefault();
        }, { passive: false });

        const clips = window.clips;

        // モーダルウィンドウを表示 userGestureを得るため
        showLoadModal(clips);

        // isMonophonicの初期値を読み取り、ボタンのスタイルに反映
        const monophonicButton = document.getElementById('monophonicButton');
        const polyphonicButton = document.getElementById('polyphonicButton');
        monophonicButton.classList.toggle('btn-unselected', !isMonophonic);
        monophonicButton.classList.toggle('btn-selected', isMonophonic);
        polyphonicButton.classList.toggle('btn-unselected', isMonophonic);
        polyphonicButton.classList.toggle('btn-selected', !isMonophonic);

        // サイドバー以外がクリッックされたときサイドバーを閉じる処理
        // document.addEventListener("click", function (event) {
        //   const sidebar = document.getElementById('sidebar');
        //   const sidebarToggleButton = document.getElementById('sidebar-toggle-button');

        //   let targetElement = event.target;
        //   while (targetElement) {
        //     if (targetElement === sidebar || targetElement === sidebarToggleButton) {
        //       return; // ターゲットがサイドバーまたはトグルボタンの場合は何もしない
        //     }
        //     targetElement = targetElement.parentElement;
        //   }
        //   // ターゲットがサイドバーまたはトグルボタンの子孫でない場合はサイドバーを閉じる
        //   closeNav();
        // });


        // タグフィルター機能
        // clipsからwhoSaidのユニークな値を取得
        const uniqueWhoSaidValues = [...new Set(clips.flatMap(clip => clip.whoSaid))];


        // タグフィルターのボタンの生成
        const tagButtonsContainer = document.querySelector(".accordion-section-content");
        uniqueWhoSaidValues.forEach(tag => {
            const button = document.createElement("button");
            button.className = "btn btn-unselected tagbutton";
            button.textContent = tag;
            button.onclick = () => filterClipsByTag(tag);
            tagButtonsContainer.appendChild(button);
        });



        // 検索フォームの生成
        const searchFormContainer = document.querySelector(".search-form-content");
        const searchForm = document.createElement("form");
        searchForm.id = "searchForm";
        // form要素にsubmitイベントリスナーを追加
        searchForm.addEventListener('submit', function (event) {
            event.preventDefault(); // デフォルトのsubmit動作をキャンセル
            handleSearch(); // 検索処理を実行
        });
        const searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.id = "searchInput";
        searchInput.placeholder = "検索...";
        searchInput.oninput = handleSearch;
        searchForm.appendChild(searchInput);
        searchFormContainer.appendChild(searchForm);





    } catch (error) {
        // エラーが発生した場合はコンソールに出力
        console.error(error);
    }
}

// ページが読み込まれた時に初期化関数を実行
document.addEventListener("DOMContentLoaded", initialize);
