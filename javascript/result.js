const loading = document.querySelector(".loading");
const block = document.querySelector(".block");

// loading 보여주기
block.style.display = "none";

window.onload = function () {
    loading.style.display = "none";
    block.style.display = "flex";
}

Kakao.init('KAKAO_JAVASCRIPT_KEY');
console.log(Kakao.isInitialized());

function shareKakaotalk() {
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: 'christmas MBTI',
            description: '#MBTI #christmas #크리스마스 #연말 #난코딩하고있는데 #어디가',
            imageUrl:
                'http://graphics8.nytimes.com/images/2012/02/19/us/19whitney-span/19whitney-span-articleLarge.jpg',
            link: {
                mobileWebUrl: 'https://mbtimaker.github.io/MBTImaker-javascript-frontend/html/home.html',
                webUrl: 'https://mbtimaker.github.io/MBTImaker-javascript-frontend/html/home.html',
            },
        },
        // 카카오톡 미설치 시 카카오톡 설치 경로이동
        installTalk: true,
    })
}


function shareFacebook() {
    let sendUrl = "https://mbtimaker.github.io/MBTImaker-javascript-frontend/html/result.html/"; // 전달할 URL
    window.open("http://www.facebook.com/sharer/sharer.php?u=" + sendUrl);
}

// twitter
function shareTwitter() {
    let sendText = "행복한연말보내세요"; // 전달할 텍스트
    let sendUrl = "https://mbtimaker.github.io/MBTImaker-javascript-frontend/html/result.html/"; // 전달할 URL
    window.open("https://twitter.com/intent/tweet?text=" + sendText + "&url=" + sendUrl);
}

