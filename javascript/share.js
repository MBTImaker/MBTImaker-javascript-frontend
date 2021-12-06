"use strict";

/* 설명: 공유 기능 구현 */

// =========================== Variables ===========================

// share
const shareLink = window.location.href; // 차후에 배포되면 home.html로 수정
const subText = "나의 MBTI 유형과 어울리는 캐릭터와 영화를 알아보세요!";
const shareImage = "url(https://mbti-test.herokuapp.com/og_image.png)";

let mainText = { "text": "나의 영화 캐릭터 유형은? " };
let KAKAO_JAVASCRIPT_KEY = "";


// =========================== Functions ===========================

// MBTI에 따라 공유되는 텍스트를 다르게 설정한다.
function getNamebyMBTI(obj, userMBTI) {
    console.log(userMBTI);

    switch (userMBTI) {
        case "ISTJ": {
            obj.text += "'킹스맨의 해리 하트'";
            break;
        }
        case "ISFJ": {
            obj.text += "'셜록홈즈의 왓슨'";
            break;
        }
        case "ISTP": {
            obj.text += "'007의 제임스 본드'";
            break;
        }
        case "ISFP": {
            obj.text += "'타이타닉의 로즈'";
            break;
        }
        case "INTJ": {
            obj.text += "'닥터 스트레인지의 닥터 스트레인지'";
            break;
        }
        case "INTP": {
            obj.text += "'이미테이션 게임의 앨런 튜링'";
            break;
        }
        case "INFJ": {
            obj.text += "'위대한 개츠비의 개츠비'";
            break;
        }
        case "INFP": {
            obj.text += "'신비한 동물사전의 뉴트 스캐맨더'";
            break;
        }
        case "ESTJ": {
            obj.text += "'해리포터의 헤르미온느'";
            break;
        }
        case "ESFJ": {
            obj.text += "'분노의 질주의 돔'";
            break;
        }
        case "ESTP": {
            obj.text += "'라푼젤의 플린 라이더'";
            break;
        }
        case "ESFP": {
            obj.text += "'수어사이드 스쿼드의 할리퀸'";
            break;
        }
        case "ENTJ": {
            obj.text += "'악마는 프라다를 입는다의 미란다'";
            break;
        }
        case "ENTP": {
            obj.text += "'크리스마스의 악몽의 잭 스켈레톤'";
            break;
        }
        case "ENFJ": {
            obj.text += "'금발이 너무해의 엘 우즈'";
            break;
        }
        case "ENFP": {
            obj.text += "'사운드 오브 뮤직의 마리아'";
            break;
        }
        default: {
            break;
        }
    }
}

function shareKakaotalk() {
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: mainText.text,
            description: subText,
            imageUrl:
                'https://mbti-test.herokuapp.com/og_image.png',
            link: {
                mobileWebUrl: shareLink,
                webUrl: shareLink,
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
    window.open("https://twitter.com/intent/tweet?text=" + mainText.text + "&url=" + shareLink);
}

function format() {
    let args = Array.prototype.slice.call(arguments, 1);
    return arguments[0].replace(/\{(\d+)\}/g, function (match, index) {
        return args[index];
    });
}

// band
function shareBand() {
    let encodeBody = encodeURIComponent(format('{0}\n{1}', mainText.text, shareLink));
    let encodeRoute = encodeURIComponent(window.location.href);
    let link = format('http://band.us/plugin/share?body={0}&route={1}', encodeBody, encodeRoute);
    window.open(link, 'share', 'width=500, height=500');
}