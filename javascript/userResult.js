"use strict";

/* 설명: 사용자가 선택한 값에 따라 MBTI 결과값을 서버에서 가져와 화면에 보여줍니다. */

// ============================== Run ==============================
if (!document.referrer.includes("question.html")) {
    location.href = "home.html";
}

// =========================== Variables ===========================

// loading
const loading = document.querySelector(".l1");
const block = document.querySelector(".b3");

// graph
const circulars = document.querySelectorAll('.circular');
const chemistry = document.querySelector('.h1');

// graph
const showMargin = 900;

let likeMePercentage = 0;
let mostTypePercentage = 0;

let likeMeCounter = 0;
let mostTypeCounter = 0;

// ====================== Variables(share) ======================
const shareLink = "https://mbtimaker.github.io/MBTImaker-javascript-frontend/html/home.html";
const subText = "나의 MBTI 유형과 어울리는 캐릭터와 영화를 알아보세요!";
const shareImage = "url(https://mbti-image-server.s3.ap-northeast-2.amazonaws.com/og_image.png)";

let mainText = { "text": "나의 영화 캐릭터 유형은? " };
let MBTI = '';

// ====================== Variables(report) ======================
/* 설명: 사용자가 선택한 값에 따라 MBTI 결과값을 서버에서 가져와 화면에 보여줍니다. */

let commentId = 0;
const reportModal = document.querySelector(".report-modal");
const reportSubject = document.querySelector("#subject");
const reportDescription = document.querySelector("#description");
let checkReportCommit = String(false);    // 신고 제출 후 취소 함수로 갈 경우, 이미 제출 완료 됐는데 취소가 자동으로 호출 되면서 '취소하겠습니까?' 라는 알림이 뜸. 이를 확인하기 위해 선언.

// =========================== Loading ===========================

// 페이지가 다시 로드되면 0ms만에 맨 위로 이동한다.
window.addEventListener('load', function () {
    loading.style.display = "none";
    block.style.display = "flex";

    setTimeout(function () {
        scrollTo(0, 0);
    }, 0);
});

// 새로고침 했을 때 위치가 맨 위로 움직이지 않으면 "circle"에 show가 로딩되자 마자 바로 들어가서 애니메이션이 동작하지 않는다.
window.addEventListener('load', () => {
    const circles = document.querySelectorAll(".circle");
    circles.forEach(circle => {
        if (circle.classList.contains("show"))
            circle.classList.remove("show");
    });
});

// ====================== Functions(report) ======================

// 신고한 댓글 아이디를 가져오고 모달을 연다.
function openReportModal(id) {
    reportModal.classList.add("open-modal");
    commentId = id;
}

// 서버에 댓글 신고 보내기
function sendReport() {
    const reportSubjectValue = reportSubject.options[reportSubject.selectedIndex].value;
    const reportDescriptionValue = reportDescription.value;

    if (reportDescriptionValue === "") {
        alert("신고 내용을 입력해 주세요.");
    }
    else {
        runFetch("POST", "https://mbti-test.herokuapp.com/report", {
            "commentId": commentId,
            "description": reportDescriptionValue,
            "subject": reportSubjectValue,
        })
            .then((data) => {
                alert("신고가 접수되었습니다. 처리될 때까지 조금만 기다려주세요.");
                checkReportCommit = true;
                closeReportModal(checkReportCommit);
            })
            .catch(err => { alert("신고 유형을 선택해 주세요.") });
    }
}

// 모달 창 닫기
function closeReportModal(checkReportCommit) {
    // 사용자가 입력한 값 초기화
    [reportSubject.selectedIndex, reportDescription.value, reportCount.innerText] = [0, null, "(0/500)"];
    if (checkReportCommit == true) { // 신고 제출이 정상적으로 완료 됐으면, 신고 취소 확인 멘트 안내보냄
        reportModal.classList.remove("open-modal");
    } else {
        if (confirm("신고를 취소 하시겠습니까? 취소를 원하시면 [예], 아니면 [아니오]를 선택해주세요.")) {    // 신고 취소 "예" 누를 경우
            alert("신고가 취소 되었습니다.");
            reportModal.classList.remove("open-modal");
        }
    }
}

// ====================== Functions(share) ======================

// MBTI에 따라 공유되는 텍스트를 다르게 설정한다.
function getNamebyMBTI(obj, userMBTI) {
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
    Kakao.init(JSON.parse(window.localStorage.getItem('KAKAO_JAVASCRIPT_KEY')));

    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: mainText.text,
            description: subText,
            imageUrl:
                'https://mbti-image-server.s3.ap-northeast-2.amazonaws.com/og_image.png',
            link: {
                mobileWebUrl: shareLink,
                webUrl: shareLink,
            },
        },
        // 카카오톡 미설치 시 카카오톡 설치 경로이동
        installTalk: true,
    })
}

function shareFacebook() {
    window.open("http://www.facebook.com/sharer/sharer.php?u=" + shareLink);
}

function shareTwitter() {
    window.open("https://twitter.com/intent/tweet?text=" + mainText.text + "&url=" + shareLink);
}

function format() {
    let args = Array.prototype.slice.call(arguments, 1);
    return arguments[0].replace(/\{(\d+)\}/g, function (match, index) {
        return args[index];
    });
}

function shareBand() {
    let encodeBody = encodeURIComponent(format('{0}\n{1}', mainText.text, shareLink));
    let encodeRoute = encodeURIComponent(window.location.href);
    let link = format('http://band.us/plugin/share?body={0}&route={1}', encodeBody, encodeRoute);
    window.open(link, 'share', 'width=500, height=500');
}

// ========================= MBTI Result =========================

// 000000000000 -> 000-000-000-000
let result = JSON.parse(window.sessionStorage.getItem('clientClicked'));
result = result.slice(0, 3) + '-' + result.slice(3, 6) + '-' + result.slice(6, 9) + '-' + result.slice(9, 12);

// 이전 결과와 다르면 데이터를 새로 불러온다.
if (window.sessionStorage.getItem('result') !== result) {

    runFetch("POST", "https://mbti-test.herokuapp.com/test", {
        "testCode": result,
    })
        .then((info) => {
            showResult(info.data);
            window.sessionStorage.setItem('mbtiResult', JSON.stringify(info.data));

            if (window.localStorage.getItem('KAKAO_JAVASCRIPT_KEY') == null)
                window.localStorage.setItem('KAKAO_JAVASCRIPT_KEY', JSON.stringify(info.data.kakao_JAVASCRIPT_KEY));
        })
        .catch(() => { alert("카카오 공유가 불가능합니다.") });

    window.sessionStorage.setItem('result', result);
}
else {
    showResult(JSON.parse(window.sessionStorage.getItem('mbtiResult')));
}


// 가져온 것들을 html에 설정한다.
function showResult(data) {
    const mbtiResult = data.mbtiResult;
    MBTI = mbtiResult.mbti;

    const textAndImg = document.querySelector(".b3 .r1 .t2");
    textAndImg.querySelector(".movie-title").src = mbtiResult.character.movieName.url;
    textAndImg.querySelector(".movie-character").src = mbtiResult.character.name.url;
    textAndImg.querySelector(".character-img").src = mbtiResult.character.image.url;

    // ---------------- conclusion ----------------
    const conclusion = document.querySelector(".b3 .r1 .c1");
    conclusion.innerHTML = mbtiResult.character.representativePersonality;

    const features = document.querySelectorAll(".b3 .r1 .f2:nth-child(n)");
    for (let i = 0; i < features.length; i++) {
        features[i].innerHTML = mbtiResult.character.personalities[i];
    }

    // ---------------- chemistry ----------------
    const goodChemi = document.querySelector(".b3 .r1 .h1 .good");
    goodChemi.querySelector(".movie-title").innerHTML = mbtiResult.bestChemistry.movieName;
    goodChemi.querySelector(".movie-character").innerHTML = mbtiResult.bestChemistry.characterName;
    goodChemi.querySelector(".character-img").src = mbtiResult.bestChemistry.imageUrl;

    const badChemi = document.querySelector(".b3 .r1 .h1 .bad");
    badChemi.querySelector(".movie-title").innerHTML = mbtiResult.worstChemistry.movieName;
    badChemi.querySelector(".movie-character").innerHTML = mbtiResult.worstChemistry.characterName;
    badChemi.querySelector(".character-img").src = mbtiResult.worstChemistry.imageUrl;

    // ------------------ graph -----------------
    const likeMe = document.querySelector(".b3 .likeMe .whiteBox");
    const sameType = data.sameType;
    likeMe.querySelector(".movie-title").innerHTML = sameType.movieName;
    likeMe.querySelector(".movie-character").innerHTML = sameType.characterName;
    likeMe.querySelector("img").src = sameType.imageUrl;
    likeMePercentage = sameType.percentage;

    const mostType = document.querySelector(".b3 .mostType .whiteBox");
    const mostPopularType = data.mostPopularType;
    mostType.querySelector(".movie-title").innerHTML = mostPopularType.movieName;
    mostType.querySelector(".movie-character").innerHTML = mostPopularType.characterName;
    mostType.querySelector("img").src = mostPopularType.imageUrl;
    mostTypePercentage = mostPopularType.percentage;

    // ----------- recommendedMovies -----------
    const movieList = document.querySelectorAll(".b3 .m1 .m2 li img:nth-child(n)");
    const recommendedMovies = mbtiResult.recommendedMovies;
    for (let i = 0; i < movieList.length; i++) {
        movieList[i].src = recommendedMovies[i].url;
    }

    getNamebyMBTI(mainText, mbtiResult.mbti);
}

// =========================== Graph ===========================

// result.html에서 그래프 2개를 가져와서 애니메이션을 실행한다.
const showAnimation = function () {
    circulars.forEach((circular) => {
        const circle = circular.querySelector('.circle');
        const numb = circular.querySelector(".numb");

        if (!circle.classList.contains('show')) {
            if (0 > chemistry.getBoundingClientRect().top) {
                circle.classList.add('show');
                toggleShow(circle);

                let drawing = setInterval(() => {
                    // id에 따라서 다른 숫자를 보여준다.
                    if (circular.id == "likeMe") {
                        if (likeMeCounter == likeMePercentage) {
                            toggleShow(circle);
                            clearInterval(drawing);
                        } else {
                            likeMeCounter += 1;
                            numb.textContent = `${likeMeCounter}%`;
                        }
                    }
                    else {
                        if (mostTypeCounter == mostTypePercentage) {
                            toggleShow(circle);
                            clearInterval(drawing);
                        } else {
                            mostTypeCounter += 1;
                            numb.textContent = `${mostTypeCounter}%`;
                        }
                    }
                }, 40); // 숫자가 작을수록 빠르다.
            }
        }
    });
}

// .show를 toggle한다. 처음엔 없다가 보여주고 숫자에 다다르면 애니메이션을 종료한다.
function toggleShow(item) {
    const leftProgress = item.querySelector(".circle .left .progress");
    const rightProgress = item.querySelector(".circle .right .progress");
    const dot = item.querySelector(".circle .dot");

    leftProgress.classList.toggle("show");
    rightProgress.classList.toggle("show");
    dot.classList.toggle("show");
}

window.addEventListener('scroll', showAnimation);