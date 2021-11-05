const loading = document.querySelector(".loading");
const block = document.querySelector(".block");

// loading 보여주기
block.style.display = "none";

window.onload = function () {
    loading.style.display = "none";
    block.style.display = "flex";
}

//
function shareTwitter() {
    let sendText = "행복한연말보내세요"; // 전달할 텍스트
    let sendUrl = "https://mbtimaker.github.io/MBTImaker-javascript-frontend/html/result.html/"; // 전달할 URL
    window.open("https://twitter.com/intent/tweet?text=" + sendText + "&url=" + sendUrl);
}