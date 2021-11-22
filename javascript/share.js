// =========================== Share ===========================

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

// facebook
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

// Instagram
function shareInstagram() {
    window.open("hhttps://www.instagram.com/?url=https://www.drdrop.co/" + shareLink);
}