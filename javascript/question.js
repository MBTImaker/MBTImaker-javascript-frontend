"use strict";

const selectBtns = document.querySelectorAll(".select_btn");
const nextBtn = document.querySelector(".next");
const blocks = document.querySelectorAll(".block:nth-child(n)");

let questionNum = 1;
const questionNumMax = 12;

nextBtn.addEventListener("click", () => {
    if (questionNum < questionNumMax) {
        scrollToNextQuestion(document.documentElement, blocks[questionNum].offsetTop, 700);
        questionNum += 1;
    }
});

function scrollToNextQuestion(element, nextQuestion, duration) {
    let start = element.scrollTop, change = nextQuestion - start, currentTime = 0, increment = 20;

    let animateScroll = function () {
        currentTime += increment;
        let movement = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = movement;

        if (currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
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

// ------------------------

selectBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        e.currentTarget.classList.add("active");
    });
});

// https://www.phpschool.com/gnuboard4/bbs/board.php?bo_table=qna_html&wr_id=288964
function fnMove(seq) {
    var offset = $("#div" + seq).offset();
    $('html, body').animate({ scrollTop: offset.top + 120 }, 400);
}