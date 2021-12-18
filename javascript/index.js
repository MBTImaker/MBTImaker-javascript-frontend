/* 설명: 현재까지 테스트에 참여한 사람의 수를 보여줍니다. */

"use strict";

const participants = document.querySelector(".participants");
const b1 = document.querySelector(".b1");

fetch("https://mbti-test.herokuapp.com/test")
    .then((response) => response.json())
    .then((info) => {
        b1.innerHTML = `<button class="b2" onclick="location.href='question.html'"></button>
        <span class="t1">현재 총 ${info.data.testCount}명이 참여했어요.</span>`;
    }
    );