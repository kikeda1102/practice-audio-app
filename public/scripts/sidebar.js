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
