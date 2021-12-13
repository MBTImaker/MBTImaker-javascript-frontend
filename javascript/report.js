"use strict";

/* 설명: 사용자가 선택한 값에 따라 MBTI 결과값을 서버에서 가져와 화면에 보여줍니다. */

// =========================== Variables ===========================

let commentId = 0;

const reportModal = document.querySelector(".report-modal");
const reportSubject = document.querySelector("#subject");
const reportDescription = document.querySelector("#description");

// =========================== Functions ===========================

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
                cancleReport();
            })
            .catch(err => { alert("신고 유형을 선택해 주세요.") });
    }
}

// 모달 창 닫기
function cancleReport() {
    // 사용자가 입력한 값 초기화
    [reportSubject.selectedIndex, reportDescription.value] = [0, null];
    reportModal.classList.remove("open-modal");
}