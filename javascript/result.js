const loading = document.querySelector(".loading");
const block = document.querySelector(".block");
const shareLink2 = "https://mbtimaker.github.io/MBTImaker-javascript-frontend/html/result.html/";
const shareLink = "https://mbtimaker.github.io/MBTImaker-javascript-frontend/html/result.html";
const shareText = "크리스마스";

// loading 보여주기
block.style.display = "none";

window.onload = function () {
    loading.style.display = "none";
    block.style.display = "flex";
}

// 댓글 작성
function commentInit() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
             alert(this.responseText);
         }
    };

    const nickname = document.getElementById("nickname").value;
    const content = document.getElementById("comment-area").value;
    const password = document.getElementById("password").value;

    const commentJson = '{\"content\":\"' + content + '\",\"mbti\": \"ISTJ\",' + '\"nickname\": \"' + nickname + '\", \"password\": \"' + password + '\"}';
    const sendParams = JSON.parse(commentJson);
    console.log(sendParams);

    xhttp.open("POST", "https://virtserver.swaggerhub.com/seonpilKim/MBTI/1.0.0/comment", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(sendParams);
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
    window.open("http://www.facebook.com/sharer/sharer.php?u=" + shareLink);
}

// twitter
function shareTwitter() {
    window.open("https://twitter.com/intent/tweet?text=" + shareText + "&url=" + shareLink);
}

function format() {
    let args = Array.prototype.slice.call(arguments, 1);
    return arguments[0].replace(/\{(\d+)\}/g, function (match, index) {
        return args[index];
    });
}

// band
function shareBand() {
    let encodeBody = encodeURIComponent(format('{0}\n{1}', shareText, shareLink));
    let encodeRoute = encodeURIComponent(window.location.href);
    let link = format('http://band.us/plugin/share?body={0}&route={1}', encodeBody, encodeRoute);
    window.open(link, 'share', 'width=500, height=500');
}

function shareInstagram() {
    window.open("hhttps://www.instagram.com/?url=https://www.drdrop.co/" + shareLink);
}
