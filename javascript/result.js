const loading = document.querySelector(".loading");
const block = document.querySelector(".block");

block.style.display = "none";

window.onload = function () {
    loading.style.display = "none";
    block.style.display = "flex";
}

// 댓글 작성
function commentInit() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
             alert(this.responseText);
         }
    };

    const nickname = document.getElementById("nickname").value;
    const content = document.getElementById("comment-area").value;
    const password = document.getElementById("password").value;

    const commentJson = '{\"content\":\"' + content + '\",\"mbti\": \"ISTJ\",' + '\"nickname\": \"' + nickname + '\", \"password\": \"' + password + '\"}';
    const sendParams = JSON.parse(commentJson);
    console.log(sendParams);

    xhttp.open("POST", "https://virtserver.swaggerhub.com/seonpilKim/MBTI/1.0.0/comment", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(sendParams);
}

function dateToStr(date) {
    const dateStr = date.toISOString();
    const dateStr = dateStr.substring(0,10) + " " + dateStr.substring(11,19);
    return dateToString;
}

// function makeCommentTable() {
//     const newCommentEl = document.getElementById("comment-area").value;
//     const newComment = newCommentEl.value.trim();

//     const dateEl = document.createElement('span');
//     dateEl.classList.add('date');
//     const dateStr = dateToStr(new Date());
//     dateEl.innerText = dateStr;

//     const contentEl = document.createElement('span');
//     contentEl.classList.add('comment-text');
//     contentEl.innerText = newComment;

//     const commentEl = document.createElement('span');
//     commentEl.classList.add('comment-row');
//     commentEl.appendChild(dateEl);
//     commentEl.appendChild(contentEl);

//     document.getElementById('')
// }
