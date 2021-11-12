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

let commentTagName = "comment-01";

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
    showComment.style.display = "flex";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
             alert(this.responseText);
         }
    };


    let nickname = document.getElementById("nickname").value;
    let content = document.getElementById("comment-area").value;
    let password = document.getElementById("password").value;
console.log("nickname: "+nickname);
console.log("content: "+content);
console.log("password: "+password);

    let commentJson = '{\"content\":\"' + content + '\",\"mbti\": \"ISTJ\",' + '\"nickname\": \"' + nickname + '\", \"password\": \"' + password + '\"}';
    // var commentJson = {
    //     "content": "우와 신기해요!",
    //     "mbti": "ISTJ",
    //     "name": "만두",
    //     "password": "1234"
    //   };
    const url = 'https://mbti-test.herokuapp.com/comment';
    xhttp.open('POST', 'https://mbti-test.herokuapp.com/comment');

    fetch('https://mbti-test.herokuapp.com/comment', {
        method: 'POST',
        mode: 'no-cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'omit', // include, *same-origin, omit
        headers: {
            'Accept': '*',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'https://mbti-test.herokuapp.com/comment',
            'Origin': 'https://mbti-test.herokuapp.com',
            'Referer': 'https://mbti-test.herokuapp.com'
          },
        body: JSON.stringify(commentJson),
        // redirect: 'follow', // manual, *follow, error
        // referrer: 'no-referrer', // no-referrer, *client

      })
      .then(res => res.json())
      .then(response => console.log('Success:', JSON.stringify(response)))
      .catch(error => console.error('Error:', error));


     

    // let sendParams = JSON.parse(commentJson);   // string 객체를 json 객체로 변환
    // let str = JSON.stringify(sendParams); // json 객체를 String 객체로 변환
    // console.log("str::"+str);

    // xhttp.open("POST", "https://mbti-test.herokuapp.com/comment", true);
    // xhttp.setRequestHeader("accept", "*/*");
    // xhttp.setRequestHeader("Content-type", "application/json");
    // xhttp.send(sendParams);

    // 댓글 창 생성하기
    let newComment = document.createElement('div'); // comment-01
    newComment.className = commentTagName;
    tmp = showComment.appendChild(newComment); 

    //comment-01 스타일 속성
    tmp.style.background = "#FFFFFF";
    tmp.style.width = "89%";
    tmp.style.height = "100%";
    tmp.style.marginTop = "11.5%";
    tmp.style.border = "0.125rem solid " + getComputedStyle(document.querySelector(':root')).getPropertyValue('--point-line-color');
    tmp.style.boxSizing = "border-box";
    tmp.style.borderRadius = "10px";
    tmp.style.display = "flex";
    tmp.style.flexDirection = "column";


    let newCommentInfo = document.createElement('div'); // info
    newCommentInfo.className = 'info';
    tmp2 = tmp.appendChild(newCommentInfo);
    // info 스타일 속성
    tmp2.style.display = "flex";
    tmp2.style.justifyContent = "space-between";
    tmp2.style.alignItems = "center";
    tmp2.style.height = "22.6%";


    let newCommentUser = document.createElement('span'); // rstName
    newCommentUser.className = 'rstName';
    newCommentUser.innerText = nickname;
    tmp3 = tmp2.appendChild(newCommentUser);
    tmp3.style.width = "40%";
    tmp3.style.height = "83%";
    tmp3.style.color = getComputedStyle(document.querySelector(':root')).getPropertyValue('--chemi-movie-title-mobile-font-color');
    tmp3.style.fontSize = getComputedStyle(document.querySelector(':root')).getPropertyValue('--chemi-movie-title-mobile-font-size')
    tmp3.style.margin = "0.4375rem 1.3125rem 0rem 1.25rem";
    tmp3.style.display = "flex";
    tmp3.style.justifyContent = "flex-start";
    tmp3.style.alignItems = "center";


    let newCommentdate = document.createElement('span');  // rstDate
    newCommentdate.className = 'rstDate';
    const dateStr = dateToStr(new Date());
    newCommentdate.innerText = dateStr;
    tmp4 = tmp2.appendChild(newCommentdate);
    tmp4.style.width = "37%";
    tmp4.style.height = "83%";
    tmp4.style.color = getComputedStyle(document.querySelector(':root')).getPropertyValue('--comment-created-font-color');
    tmp4.style.fontSize = getComputedStyle(document.querySelector(':root')).getPropertyValue('--comment-created-font-size');
    tmp4.style.margin = "0.375rem 1.25rem 0rem 0rem";
    tmp4.style.display = "flex";
    tmp4.style.justifyContent = "flex-end";
    tmp4.style.alignItems = "center";

    let newDelBtn = document.createElement('button');
    newDelBtn.className = 'del-reply-btn';
    tmp5 = tmp2.appendChild(newDelBtn);
    tmp5.style.width = "13%";
    tmp5.style.height = "47%";
    tmp5.style.display = "flex";
    tmp5.style.justifyContent = "flex-end";
    tmp5.style.alignItems = "center";
    tmp5.style.backgroundImage = "url(\"../imgs/replyDeleteBtn_Frame896.png\")";
    tmp5.style.backgroundSize = "100% 100%";
    tmp5.style.backgroundColor = getComputedStyle(document.querySelector(':root')).getPropertyValue('--section-background-color');

    let makePointLine = document.createElement('div'); // point-line
    makePointLine.className = 'point-line-reply';
    tmp6 = tmp.appendChild(makePointLine);

    tmp6.style.width = "100%";
    tmp6.style.height = "0.625rem";
    tmp6.style.backgroundImage = "linear-gradient\(to right, "
        + getComputedStyle(document.querySelector(':root')).getPropertyValue('--point-line-color') + "50%, rgba(255, 255, 255, 0) 0%)";
    tmp6.style.backgroundPosition = "bottom";
    tmp6.style.backgroundSize = "16px 2px";
    tmp6.style.backgroundRepeat = "repeat-x";
    tmp6.style.marginTop = "0.25rem";

    let newCommentText = document.createElement('span'); // rstcomment-text
    newCommentText.className = 'rstcomment-text';
    newCommentText.innerText = content;
    tmp7 = tmp.appendChild(newCommentText);

    tmp7.style.width = "85.6%";
    tmp7.style.height = "19.3%";
    tmp7.style.fontSize = getComputedStyle(document.querySelector(':root')).getPropertyValue('--chemi-movie-character-mobile-font-size');
    tmp7.style.display = "inline-block";
    tmp7.style.margin = "1.25rem 0rem 1.125rem 0rem";


    let newAddReply = document.createElement('div');
    newAddReply.className = 'add-reply';
    tmp8 = tmp.appendChild(newAddReply);
    tmp8.style.width = "100%";
    tmp8.style.height = "52%";
    tmp8.style.backgroundColor = getComputedStyle(document.querySelector(':root')).getPropertyValue('--comment-reply-background-color');
    tmp8.style.border = " 0.125rem solid " + getComputedStyle(document.querySelector(':root')).getPropertyValue('--section-border-color');
    tmp8.style.boxSizing = "border-box";
    tmp8.style.borderRadius = "0rem 0rem 0.5rem 0.5rem";
    tmp8.style.borderLeftWidth = "0px";
    tmp8.style.borderRightWidth = "0px";


    let newReplyArea = document.createElement('textarea');
    newReplyArea.className = 'comment-reply-area';
    newReplyArea.rows = 18;
    tmp9 = tmp8.appendChild(newReplyArea);
    tmp9.style.width = "85.6%";
    tmp9.style.height = "34.5%";
    tmp9.style.margin = "0.6875rem 1.25rem 0.625rem 0.625rem";
    tmp9.style.border = "0.125rem solid " + getComputedStyle(document.querySelector(':root')).getPropertyValue('--comment-reply-border-color');
    tmp9.style.boxSizing = "border-box";
    tmp9.style.borderRadius = "0.625rem";


    let newReplyBtn = document.createElement('button');
    newReplyBtn.className = 'write-reply-btn';
    tmp10 = tmp8.appendChild(newReplyBtn);

    tmp10.style.width = "85.6%";
    tmp10.style.height = "34.5%";
    tmp10.style.backgroundImage = "url(\"../imgs/replyBtn_Frame139.png\")";
    tmp10.style.backgroundSize = "100% 100%";
    tmp10.style.backgroundColor = getComputedStyle(document.querySelector(':root')).getPropertyValue('--section-background-color');


    console.log(tmp);
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
