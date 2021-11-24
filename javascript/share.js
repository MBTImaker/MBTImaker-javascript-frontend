// =========================== Variables ===========================



// share
const shareLink2 = "https://mbtimaker.github.io/MBTImaker-javascript-frontend/html/result.html/";
const shareLink = window.location.href; // 차후에 배포되면 home.html로 수정
let mainText = "나의 영화 캐릭터 유형은? ";
const subText = "나의 MBTI 유형과 어울리는 캐릭터와 영화를 알아보세요!";
const shareImage = "url(../imgs/share_img_test.png)";

switch (MBTI) {
    case (ISTJ): {
        mainText += "'킹스맨의 해리 하트'";
    }
    case (ISFJ): {
        mainText += "'셜록홈즈의 왓슨'";
    }
    case (ISTP): {
        mainText += "'007의 제임스 본드'";
    }
    case (ISFP): {
        mainText += "'타이타닉의 로즈'";
    }
    case (INTJ): {
        mainText += "'닥터 스트레인지의 닥터 스트레인지'";
    }
    case (INTP): {
        mainText += "'이미테이션 게임의 앨런 튜링'";
    }
}


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
    window.open("https://twitter.com/intent/tweet?text=" + mainText + "&url=" + shareLink);
}

function format() {
    let args = Array.prototype.slice.call(arguments, 1);
    return arguments[0].replace(/\{(\d+)\}/g, function (match, index) {
        return args[index];
    });
}

// band
function shareBand() {
    let encodeBody = encodeURIComponent(format('{0}\n{1}', mainText, shareLink));
    let encodeRoute = encodeURIComponent(window.location.href);
    let link = format('http://band.us/plugin/share?body={0}&route={1}', encodeBody, encodeRoute);
    window.open(link, 'share', 'width=500, height=500');
}

// Instagram
function shareInstagram() {
    window.open("hhttps://www.instagram.com/?url=https://www.drdrop.co/" + shareLink);
}