"use strict";

/* 설명: 사용자가 선택한 값에 따라 MBTI 결과값을 서버에서 가져와 화면에 보여줍니다. */

// [developer id: hotbreakb] 신고버튼이 눌렸을 때 신고 모달을 띄운다.

let commentId = 0;

function openReportModal(id) {
    const reportModal = document.querySelector(".report-modal");
    reportModal.classList.add("open-modal");
    commentId = id;
}

function sendReport() {
    const reportSubject = document.getElementsById("subject");
    const reportDescription = document.querySelector("#description");

    fetch("https://mbti-test.herokuapp.com/report", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "commentId": commentId,
            "description": reportDescription,
            "subject": reportSubject
        }),
    }).then((response) => response.json())
        .then((info) => {
            console.log(info);
        });
}

function cancleReport() {
    console.log("cancleReport");
    const reportModal = document.querySelector(".report-modal");
    reportModal.classList.remove("open-modal");
}