const loading = document.querySelector(".loading");
const block = document.querySelector(".block");
const shareLink2 = "https://mbtimaker.github.io/MBTImaker-javascript-frontend/html/result.html/";
const shareLink = "https://mbtimaker.github.io/MBTImaker-javascript-frontend/html/result.html";
const shareText = "크리스마스";

// loading 보여주기
block.style.display = "none";

const showComment = document.querySelector(".show-comment");

const chkCommentInit = document.querySelector(".wrtie-comment-btn");
const chkcommentArea = document.querySelector(".comment-area");


const chkRstName = document.querySelector('.rstName');  // 댓글이 하나도 없는 경우 댓글 화면을 보여주지 못하므로 해당 값 체크

window.onload = function () {
    loading.style.display = "none";
    block.style.display = "flex";
    showComment.style.display = "none";
}

// 댓글 작성 날짜 작성( ex) 11.08 22:49:51 )
function dateToStr(date) { 
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

Kakao.init('KAKAO_JAVASCRIPT_KEY');
console.log(Kakao.isInitialized());

function shareKakaotalk() {
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: 'christmas MBTI',
            description: '#MBTI #christmas #크리스마스 #연말 #난코딩하고있는데 #어디가',
            imageUrl:
                'http://graphics8.nytimes.com/images/2012/02/19/us/19whitney-span/19whitney-span-articleLarge.jpg',
            link: {
                mobileWebUrl: 'https://mbtimaker.github.io/MBTImaker-javascript-frontend/html/home.html',
                webUrl: 'https://mbtimaker.github.io/MBTImaker-javascript-frontend/html/home.html',
            },
        },
        // 카카오톡 미설치 시 카카오톡 설치 경로이동
        installTalk: true,
    })
}

// facebook
function shareFacebook() {
    window.open("http://www.facebook.com/sharer/sharer.php?u=" + shareLink);
}

// twitter
function shareTwitter() {
    window.open("https://twitter.com/intent/tweet?text=" + shareText + "&url=" + shareLink);
}

function format() {
    let args = Array.prototype.slice.call(arguments, 1);
    return arguments[0].replace(/\{(\d+)\}/g, function (match, index) {
        return args[index];
    });
}

// band
function shareBand() {
    let encodeBody = encodeURIComponent(format('{0}\n{1}', shareText, shareLink));
    let encodeRoute = encodeURIComponent(window.location.href);
    let link = format('http://band.us/plugin/share?body={0}&route={1}', encodeBody, encodeRoute);
    window.open(link, 'share', 'width=500, height=500');
}

// Instagram
function shareInstagram() {
    window.open("hhttps://www.instagram.com/?url=https://www.drdrop.co/" + shareLink);
}
