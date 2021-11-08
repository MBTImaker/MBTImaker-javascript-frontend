const loading = document.querySelector(".loading");
const block = document.querySelector(".block");
const showComment = document.querySelector(".show-comment");

const chkCommentInit = document.querySelector(".wrtie-comment-btn");
const chkcommentArea = document.querySelector(".comment-area");

block.style.display = "none";

window.onload = function () {
    loading.style.display = "none";
    block.style.display = "flex";
    showComment.style.display = "none";
}

const chkRstName = document.querySelector('.rstName');  // 댓글이 하나도 없는 경우 댓글 화면을 보여주지 못하므로 해당 값 체크

function dateToStr(date) {  // ex) 11.08 22:49:51
    var today = new Date();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);
    var hours = ('0' + today.getHours()).slice(-2); 
    var minutes = ('0' + today.getMinutes()).slice(-2);
    var seconds = ('0' + today.getSeconds()).slice(-2); 

    var dateToString = month  + '.' + day + " " + hours + ':' + minutes  + ':' + seconds;
    return dateToString;
}

// 댓글 작성
const commentInit = () => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
             alert(this.responseText);
         }
    };

    let nickname = document.getElementById("nickname").value;
    let content = document.getElementById("comment-area").value;
    let password = document.getElementById("password").value;

    let commentJson = '{\"content\":\"' + content + '\",\"mbti\": \"ISTJ\",' + '\"nickname\": \"' + nickname + '\", \"password\": \"' + password + '\"}';
    let sendParams = JSON.parse(commentJson);
    console.log(sendParams);

    xhttp.open("POST", "https://virtserver.swaggerhub.com/seonpilKim/MBTI/1.0.0/comment", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(sendParams);

    // 신규 댓글 생성
    let comment = document.createElement('div');
    comment.classList.add('show-comment');

    let newComment = document.createElement('div'); // comment-01
    newComment.classList.add('comment-01');
    let newCommentInfo = document.createElement('div'); // info
    newCommentInfo.classList.add('info');
    let newCommentUser = document.createElement('span'); // name
    newCommentUser.classList.add('name');
    newCommentUser.innerText = nickname;
    let newCommentdate = document.createElement('span');  // date
    newCommentdate.classList.add('date');
    const dateStr = dateToStr(new Date());
    newCommentdate.innerText = dateStr;

    let makePointLine = document.createElement('div'); // point-line
    makePointLine.classList.add('point-line');
    let newCommentText = document.createElement('span'); // comment-text
    newCommentText.classList.add('comment-text');
    newCommentText.innerText = content;

    let newAddReply = document.createElement('div');
    newAddReply.classList.add('add-reply');
    let newReplyArea = document.createElement('textarea');
    newReplyArea.classList.add('comment-reply-area');
    newReplyArea.rows = 18;
    let newReplyBtn = document.createElement('button');
    newReplyBtn.classList.add('write-reply-btn');

    let newShowReply = document.createElement('div');
    newShowReply.classList.add('show-reply');
    let newShowReplyInfo = document.createElement('div');
    newShowReplyInfo.classList.add('info');
    let newShowReplyName = document.createElement('span');
    newShowReplyName.classList.add('name');
    let newShowReplyDate = document.createElement('span');
    newShowReplyDate.classList.add('date');

    let newCommentDiv = comment.appendChild(newComment);
    let newComInfo = newCommentDiv.appendChild(newCommentInfo);
    newComInfo.appendChild(newCommentUser);
    newComInfo.appendChild(newCommentdate);
    newCommentDiv.appendChild(makePointLine);
    newCommentDiv.appendChild(newCommentText);
    let addReply = newCommentDiv.appendChild(newAddReply);
    addReply.appendChild(newReplyArea);
    addReply.appendChild(newReplyBtn);
    let showReply = newCommentDiv.appendChild(newShowReply);
    let showReplyInfo = showReply.appendChild(newShowReplyInfo);
    showReplyInfo.appendChild(newShowReplyName);
    showReplyInfo.appendChild(newShowReplyDate);

    document.getElementById("rstName").innerText = nickname;
    document.getElementById("rstDate").innerText = dateStr;
    document.getElementById("rstcomment-text").innerText = content;
};

chkCommentInit.addEventListener('click', () => {
    commentInit();

    
    showComment.style.display = "flex";
});
