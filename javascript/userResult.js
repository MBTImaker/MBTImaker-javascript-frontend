// =========================== Variables ===========================

// loading
const loading = document.querySelector(".loading");
const block = document.querySelector(".block");

// graph
const circulars = document.querySelectorAll('.circular');

// graph
const showMargin = 970;

let likeMePercentage = 89;
let mostTypePercentage = 20;

let likeMeCounter = 0;
let mostTypeCounter = 0;

// =========================== Loading ===========================

block.style.display = "none";
loading.style.display = "none";
block.style.display = "flex";

// window.onload = function () {
// }



// ========================= MBTI Result =========================

let result = location.href.split("=")[1];

result = result.slice(0, 3) + '-' + result.slice(2, 5) + '-' + result.slice(4, 7) + '-' + result.slice(6, 9);
console.log(`user clicked: ${result}`);


fetch("https://mbti-test.herokuapp.com/test", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        "testCode": result
    }),
}).then((response) => response.json())
    .then((info) => {
        showResult(info.data);
    });


function showResult(data) {
    const mbtiResult = data.mbtiResult;
    console.log(`user MBTI: ${mbtiResult.mbti}`);

    const movieTitle = document.querySelector(".block .result-character .textAndImg .movie-title");
    // movieTitle.style.content = "url('mbtiResult.character.movieName.url')";
    // console.log(movieTitle.style.content);
    // console.log(movieTitle);
    // console.log(mbtiResult.character.movieName.url);


    // ---------------- conclusion ----------------
    const conclusion = document.querySelector(".block .result-character .conclusion");
    conclusion.innerHTML = mbtiResult.character.representativePersonality;

    const features = document.querySelectorAll(".block .result-character .feature:nth-child(n)");
    for (let i = 0; i < features.length; i++) {
        features[i].innerHTML = mbtiResult.character.personalities[i];
    }

    // ---------------- chemistry ----------------
    const goodChemi = document.querySelector(".block .result-character .chemistry .good"); // 
    goodChemi.querySelector(".movie-title").innerHTML = mbtiResult.bestChemistry.movieName;
    goodChemi.querySelector(".movie-character").innerHTML = mbtiResult.bestChemistry.characterName;
    goodChemi.querySelector(".character-img").style.content = "url('mbtiResult.bestChemistry.imageUrl')";

    const badChemi = document.querySelector(".block .result-character .chemistry .bad"); // 
    badChemi.querySelector(".movie-title").innerHTML = mbtiResult.worstChemistry.movieName;
    badChemi.querySelector(".movie-character").innerHTML = mbtiResult.worstChemistry.characterName;
    badChemi.querySelector(".character-img").style.content = "url('mbtiResult.worstChemistry.imageUrl')";
}

// =========================== Graph ===========================

const showAnimation = function () {
    circulars.forEach((circular) => {
        const circle = circular.querySelector('.circle');
        const numb = circular.querySelector(".numb");

        if (!circle.classList.contains('show')) {
            if (window.innerHeight > circle.getBoundingClientRect().top + showMargin) {
                circle.classList.add('show');
                toggleShow(circle);

                let drawing = setInterval(() => {
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
                }, 40);
            }
        }
    });
}

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