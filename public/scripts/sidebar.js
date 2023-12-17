// サイドバーのトグル
function openNav() {
    document.getElementById("sidebar").style.bottom = "0";
}

// サイドバーを閉じる処理
function closeNav() {
    document.getElementById("sidebar").style.bottom = "-100%";
}


// mono/polyボタンのスタイルを更新
function updateModeButtons() {
    const monophonicButton = document.getElementById('monophonicButton');
    const polyphonicButton = document.getElementById('polyphonicButton');

    monophonicButton.classList.toggle('btn-unselected', !isMonophonic);
    monophonicButton.classList.toggle('btn-selected', isMonophonic);

    polyphonicButton.classList.toggle('btn-unselected', isMonophonic);
    polyphonicButton.classList.toggle('btn-selected', !isMonophonic);
}

// tagボタンのスタイルを更新
function updateTagButtons(currentSelectedTags) {
    const tagButtons = document.querySelectorAll(".tagbutton");
    tagButtons.forEach(button => {
        button.classList.toggle('btn-selected', currentSelectedTags.includes(button.textContent));
        button.classList.toggle('btn-unselected', !currentSelectedTags.includes(button.textContent));
        // console.log(`${button.textContent}'のstyleは${button.style}です`);
    });
}


// タグフィルターの表示・非表示を切り替える
function toggleFilterSection() {
    const filterSection = document.querySelector('.accordion-section-content');
    filterSection.classList.toggle('hidden'); // 'hidden' クラスをトグル
}
