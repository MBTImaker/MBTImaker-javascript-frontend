"use strict";

/* 설명: 사용자가 선택한 값에 따라 MBTI 결과값을 서버에서 가져와 화면에 보여줍니다. */

// =========================== Variables ===========================

let commentId = 0;

// =========================== Functions ===========================

// 신고한 댓글 아이디를 가져오고 모달을 연다.
function openReportModal(id) {
    const reportModal = document.querySelector(".report-modal");
    reportModal.classList.add("open-modal");
    commentId = id;
}

// 서버에 댓글 신고 보내기
function sendReport() {
    const reportSubject = document.querySelector("#subject");
    const reportSubjectValue = reportSubject.options[reportSubject.selectedIndex].value;
    const reportDescriptionValue = document.querySelector("#description").value;

    post("https://mbti-test.herokuapp.com/report", {
        body: {
            "commentId": commentId,
            "description": reportDescriptionValue,
            "subject": reportSubjectValue
        },
    })
        .then((data) => {
            if (data.status != 200) {
                throw "유효하지 않은 신고 유형입니다.";
            }
            cancleReport();
        })
        .catch(err => { alert(err); });

    // fetch("https://mbti-test.herokuapp.com/report", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //         "commentId": commentId,
    //         "description": reportDescriptionValue,
    //         "subject": reportSubjectValue
    //     }),
    // }).then((response) => { return response.json(); })
    //     .then((response) => {
    //         if (response.status != 200) {
    //             throw "유효하지 않은 신고 유형입니다.";
    //         }
    //         cancleReport();
    //     }).catch(err => {
    //         alert(err);
    //     });
}

// 모달 창 닫기
function cancleReport() {
    const reportModal = document.querySelector(".report-modal");
    reportModal.classList.remove("open-modal");
}