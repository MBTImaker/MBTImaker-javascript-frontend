"use strict";

/* 설명: 사용자가 선택한 값에 따라 MBTI 결과값을 서버에서 가져와 화면에 보여줍니다. */

// =========================== Variables ===========================

// loading
const loading = document.querySelector(".loading");
const block = document.querySelector(".block");

// graph
const circulars = document.querySelectorAll('.circular');

// graph
const showMargin = 900;

let likeMePercentage = 0;
let mostTypePercentage = 0;

let likeMeCounter = 0;
let mostTypeCounter = 0;

// userResult.js
let MBTI = "";

// =========================== Loading ===========================

// block.style.display = "none";
loading.style.display = "none";
block.style.display = "flex";


// ========================= MBTI Result =========================

// 000000000000 -> 000-000-000-000
let result = location.href.split("=")[1];

result = result.slice(0, 3) + '-' + result.slice(2, 5) + '-' + result.slice(4, 7) + '-' + result.slice(6, 9);
console.log(`user clicked: ${result}`);

// 결과값을 보내면 파이어베이스에서 텍스트와 이미지를 가져온다.
runFetch("POST", "https://mbti-test.herokuapp.com/test", {
    "testCode": result,
})
    .then((info) => {
        showResult(info.data);
        KAKAO_JAVASCRIPT_KEY = info.data.kakao_JAVASCRIPT_KEY;
    })
    .then(() => {
        // 시크릿키 받아와 저장한 이후에 설정한다.
        Kakao.init(KAKAO_JAVASCRIPT_KEY);
        console.log("kakao : " + Kakao.isInitialized());
    })
    .catch(err => { alert("카카오 공유가 불가능합니다. 관리자에게 문의해 주세요.") });


// 가져온 것들을 html에 설정한다.
function showResult(data) {
    const mbtiResult = data.mbtiResult;

    console.log(`user MBTI: ${mbtiResult.mbti}`);
    MBTI = mbtiResult.mbti;
    getNamebyMBTI(mainText, MBTI);

    const textAndImg = document.querySelector(".block .result-character .textAndImg");
    textAndImg.querySelector(".movie-title").src = mbtiResult.character.movieName.url;
    textAndImg.querySelector(".movie-character").src = mbtiResult.character.name.url;
    textAndImg.querySelector(".character-img").src = mbtiResult.character.image.url;

    // ---------------- conclusion ----------------
    const conclusion = document.querySelector(".block .result-character .conclusion");
    conclusion.innerHTML = mbtiResult.character.representativePersonality;

    const features = document.querySelectorAll(".block .result-character .feature:nth-child(n)");
    for (let i = 0; i < features.length; i++) {
        features[i].innerHTML = mbtiResult.character.personalities[i];
    }

    // ---------------- chemistry ----------------
    const goodChemi = document.querySelector(".block .result-character .chemistry .good");
    goodChemi.querySelector(".movie-title").innerHTML = mbtiResult.bestChemistry.movieName;
    goodChemi.querySelector(".movie-character").innerHTML = mbtiResult.bestChemistry.characterName;
    goodChemi.querySelector(".character-img").src = mbtiResult.bestChemistry.imageUrl;

    const badChemi = document.querySelector(".block .result-character .chemistry .bad");
    badChemi.querySelector(".movie-title").innerHTML = mbtiResult.worstChemistry.movieName;
    badChemi.querySelector(".movie-character").innerHTML = mbtiResult.worstChemistry.characterName;
    badChemi.querySelector(".character-img").src = mbtiResult.worstChemistry.imageUrl;

    // ------------------ graph -----------------
    const likeMe = document.querySelector(".block .likeMe .whiteBox");
    const sameType = data.sameType;
    likeMe.querySelector(".movie-title").innerHTML = sameType.movieName;
    likeMe.querySelector(".movie-character").innerHTML = sameType.characterName;
    likeMe.querySelector("img").src = sameType.imageUrl;
    likeMePercentage = sameType.percentage;

    const mostType = document.querySelector(".block .mostType .whiteBox");
    const mostPopularType = data.mostPopularType;
    mostType.querySelector(".movie-title").innerHTML = mostPopularType.movieName;
    mostType.querySelector(".movie-character").innerHTML = mostPopularType.characterName;
    mostType.querySelector("img").src = mostPopularType.imageUrl;
    mostTypePercentage = mostPopularType.percentage;
    console.log(`likeMePercentage, mostTypePercentage : ${likeMePercentage}, ${mostTypePercentage}`);

    // ----------- recommendedMovies -----------
    const movieList = document.querySelectorAll(".block .movies .movie-list li img:nth-child(n)");
    const recommendedMovies = mbtiResult.recommendedMovies;
    for (let i = 0; i < movieList.length; i++) {
        movieList[i].src = recommendedMovies[i].url;
    }
}

// =========================== Graph ===========================

// result.html에서 그래프 2개를 가져와서 애니메이션을 실행한다.
const showAnimation = function () {
    circulars.forEach((circular) => {
        const circle = circular.querySelector('.circle');
        const numb = circular.querySelector(".numb");

        if (!circle.classList.contains('show')) {
            if (window.innerHeight > circle.getBoundingClientRect().top + showMargin) {
                circle.classList.add('show');
                toggleShow(circle);

                let drawing = setInterval(() => {
                    // id에 따라서 다른 숫자를 보여준다.
                    if (circular.id == "likeMe") {
                        if (likeMeCounter == likeMePercentage) {
                            toggleShow(circle);
                            circle.classList.remove('show');
                            clearInterval(drawing);
                        } else {
                            likeMeCounter += 1;
                            numb.textContent = `${likeMeCounter}%`;
                        }
                    }
                    else {
                        if (mostTypeCounter == mostTypePercentage) {
                            toggleShow(circle);
                            circle.classList.remove('show');
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

window.addEventListener('load', showAnimation);
window.addEventListener('scroll', showAnimation);