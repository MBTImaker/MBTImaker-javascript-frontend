"use strict";

const questionList = [
    { // 01
        num: "../imgs/question_num/Q1_Frame900.png",
        qTop: "오늘은 크리스마스 홈파티 하는 날.<br>방을 어떻게 꾸밀까?",
        qBottom: "고민하는 나는?",
        btnTop: "오늘은 특별한 날 화려하게 꾸민다.",
        btnBottom: "그래도 단순한 게 좋다.<br>미니멀하게 꾸민다."
    },
    { // 02
        num: "../imgs/question_num/Q2_Frame901.png",
        qTop: "오늘은<br>크리스마스",
        qBottom: "집에 있는 나는?",
        btnTop: "친구들에게 연락해 약속을 잡는다.",
        btnBottom: "오늘은 그냥 평범한 하루,<br>집에서 쉰다."
    },
    { // 03
        num: "../imgs/question_num/Q3_Frame902.png",
        qTop: "내가 영화 속<br>히어로라면",
        qBottom: "나는?",
        btnTop: "불의를 못 참고,<br>바로 행동에 나서는 히어로.",
        btnBottom: "계획을 세우고 이후에<br>행동 개시하는 히어로."
    },
    { // 04
        num: "../imgs/question_num/Q4_Frame903.png",
        qTop: "지금 밖에<br>눈이 내린다.",
        qBottom: "옆 사람에게 나는?",
        btnTop: "\"눈이 2cm 정도 왔네. 길이 미끄러워보여.<br>갈 때 조심해야겠다.\" 라고 말한다.",
        btnBottom: "\"눈이 많이 왔네.집 갈 때 조심해야겠다.\"<br>라고 말한다."
    },
    { // 05
        num: "../imgs/question_num/Q5_Frame904.png",
        qTop: "크리스마스에<br>재밌는 영화를 보았다.",
        qBottom: "친구에게 묘사하는 나는?",
        btnTop: "\"주인공이...\" 스토리부터 길고 상세하게<br>구체적으로 설명한다.",
        btnBottom: "\"재밌게 볼만하더라.\" 라고 짧게<br>설명한다."
    },
    { // 06
        num: "../imgs/question_num/Q6_Frame905.png",
        qTop: "영화를 선택하려는데<br>평점이 생각보다 낮았다.",
        qBottom: "그러면 나는?",
        btnTop: "\"평점이 낮다면 재미없을 게 뻔해.\" 라며<br>다른 걸 찾아본다.",
        btnBottom: "\"평점이 낮지만 내용이 끌리는데,<br>한 번 봐볼까?\" 라며 영화를 감상한다."
    },
    { // 07
        num: "../imgs/question_num/Q7_Frame906.png",
        qTop: "크리스마스 데이트하는 날,<br>사고가 나 상대방이 늦었다.",
        qBottom: "그때 나는?",
        btnTop: "\"괜찮아? 놀랐겠다ㅠㅠ\" 라고 말한다.",
        btnBottom: "\"무슨 사고? 병원 가야하는거아니야?\"<br>라고 말한다."
    },
    { // 08
        num: "../imgs/question_num/Q8_Frame907.png",
        qTop: "크리스마스에<br>선물을 받았다.",
        qBottom: "자랑하는 친구에게 나는?",
        btnTop: "\"진짜? 기분 좋겠다!\"라고 말한다.",
        btnBottom: "\"뭐 받았어? 봐봐!\" 라고 말한다."
    },
    { // 09
        num: "../imgs/question_num/Q9_Frame908.png",
        qTop: "영화를<br>볼 때,",
        qBottom: "나는?",
        btnTop: "주인공에게 감정을 이입해서 본다.",
        btnBottom: "상황이 어떻게 흘러가는지,<br>논리적으로 사고하면서 본다."
    },
    { // 10
        num: "../imgs/question_num/Q10_Frame909.png",
        qTop: "크리스마스 아침에<br>일어나서",
        qBottom: "나는?",
        btnTop: "오늘 할 일을 세세하게 계획한다.",
        btnBottom: "할 일을 대강 정해두었지만,<br>변경 가능성은 있다."
    },
    { // 11
        num: "../imgs/question_num/Q11_Frame910.png",
        qTop: "크리스마스<br>홈 파티가 끝나고,",
        qBottom: "나는?",
        btnTop: "어지러진 것들을 바로 치운다.",
        btnBottom: "친구들이 떠난 후, 치운다."
    },
    { // 12
        num: "../imgs/question_num/Q12_Frame899.png",
        qTop: "영화관에서 영화를 보려는데,<br>자리가 없다..",
        qBottom: "그때 나는?",
        btnTop: "\"오늘은 날이 아닌가보다. 다음에 봐야지\"<br>라며 돌아간다.",
        btnBottom: "\"그러면 지금 하는 다른 걸 볼까?\" 하며<br>다른 걸 본다."
    }
];

const body = document.querySelector("body");

// window.addEventListener('DOMContentLoaded', function () {
// });

// body 안에 질문들을 보여준다.
// html이 반복되어 사용되어 js를 사용하였다.

displayQuestion(questionList);

function displayQuestion(question) {
    let innerQuestion = question.map(function (q) {

        return `
        <div class="block">
            <div class="q-num" style="background-image: url('${q.num}');"></div>
            <span class="q-title top">${q.qTop}</span>
            <span class="q-title bottom">${q.qBottom}</span>
        
            <div class="two-btns">
                <button class="select_btn top">${q.btnTop}</button>
                <button class="select_btn bottom">${q.btnBottom}</button>
            </div>
        </div>
        `;
    });

    // string -> html
    innerQuestion = innerQuestion.join("");

    // innerHTML
    body.innerHTML += innerQuestion;
}


// --------------------------------------------------------------------

const selectBtns = document.querySelectorAll(".select_btn");
const nextBtn = document.querySelector(".next");
const blocks = document.querySelectorAll(".block:nth-child(n)");
const next = document.querySelector(".next");

let questionNum = 1;
const questionNumMax = questionList.length;

// nextBtn을 누르면 다음 문제로 이동한다.
nextBtn.addEventListener("click", () => {
    if (questionNum < questionNumMax) {
        scrollToNextQuestion(document.documentElement, blocks[questionNum].offsetTop, 700);
        questionNum += 1;
    }
});

function scrollToNextQuestion(element, nextQuestion, duration) {
    let start = element.scrollTop, change = nextQuestion - start - vh(10), currentTime = 0, increment = 20; // 153

    let animateScroll = function () {
        currentTime += increment;
        let movement = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = movement;

        if (currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    }

    let leftQuestion = questionNumMax - questionNum - 1;
    if (leftQuestion > 0) {
        next.textContent = `${leftQuestion}개의 항목이 남았습니다. (총 ${questionNumMax}문항)`;
    }
    else {
        next.textContent = `나랑 비슷한 영화 캐릭터 결과 보기`;
        next.onclick = function () {
            location.href = 'result.html';
        }
        next.classList.remove('next');
        next.classList.add('showResult');
        // nextText.style.backgroundImage = "url('../imgs/showResult_Frame61.png')";
    }
    animateScroll();
}

// t = current time,  b = start value, c = change in value, d = duration
Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
};

function vh(v) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (v * h) / 100;
}

// ------------------------

selectBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        e.currentTarget.classList.add("active");
    });
});