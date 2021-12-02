/* 설명: 현재까지 테스트에 참여한 사람의 수를 보여줍니다. */

"use strict";

const count = document.querySelector(".count");

fetch("https://mbti-test.herokuapp.com/test")
    .then((response) => response.json())
    .then((info) => {
        count.textContent = info.data.testCount;
    }
    );