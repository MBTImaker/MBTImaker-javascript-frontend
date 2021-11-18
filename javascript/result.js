// =========================== Variables ===========================

// loading
const loading = document.querySelector(".loading");
const block = document.querySelector(".block");

// graph
const numb = document.querySelector(".numb");
const circle = document.querySelector('.circle');
const leftProgress = document.querySelector(".circle .left .progress");
const rightProgress = document.querySelector(".circle .right .progress");
const dot = document.querySelector(".circle .dot");

// share
const shareLink2 = "https://mbtimaker.github.io/MBTImaker-javascript-frontend/html/result.html/";
const shareLink = "https://mbtimaker.github.io/MBTImaker-javascript-frontend/html/result.html";
const shareText = "크리스마스";

// graph
const showMargin = 950;

let percentage = 89;
let counter = 0;

// =========================== Loading ===========================

block.style.display = "none";

// =========================== Graph ===========================

const showAnimation = function () {
    if (!circle.classList.contains('show')) {
        if (window.innerHeight > circle.getBoundingClientRect().top + showMargin) {
            circle.classList.add('show');
            toggleShow();

            let drawing = setInterval(() => {
                if (counter == percentage) {
                    toggleShow();
                    clearInterval(drawing);
                } else {
                    counter += 1;
                    numb.textContent = `${counter}%`;
                }
            }, 40);
        }
    }
}

function toggleShow() {
    leftProgress.classList.toggle("show");
    rightProgress.classList.toggle("show");
    dot.classList.toggle("show");
}


window.addEventListener('load', showAnimation);
window.addEventListener('scroll', showAnimation);

// =========================== Comment ===========================
// 정문님 파이팅 ><

const showComment = document.querySelector(".show-comment");

const chkCommentInit = document.querySelector(".wrtie-comment-btn");
const chkcommentArea = document.querySelector(".comment-area");


const chkRstName = document.querySelector('.rstName');  // 댓글이 하나도 없는 경우 댓글 화면을 보여주지 못하므로 해당 값 체크
let isDeleteCheck = false;  // 해당 값이 true 일 경우, delete -> display 할 때 기존 댓글 목록들 전체를 지워줌



window.onload = function () {
    loading.style.display = "none";
    block.style.display = "flex";
    showComment.style.display = "none";
}

// 댓글 작성 날짜 작성( ex) 11.08 22:49:51 )
function dateToStr(svrDate) {

    let today = new Date();
    let month = ('0' + (today.getMonth() + 1)).slice(-2);
    let day = ('0' + today.getDate()).slice(-2);
    let hours = ('0' + today.getHours()).slice(-2);
    let minutes = ('0' + today.getMinutes()).slice(-2);
    let seconds = ('0' + today.getSeconds()).slice(-2);

    let dateToString = month + '.' + day + " " + hours + ":" + minutes + ":" + seconds;
    return dateToString;
}

// 댓글 작성
function commentWrite() {

    showComment.style.display = "flex";

    // 사용자가 입력 한 값을 받아온다.
    let nickname = document.getElementById("nickname").value;
    let content = document.getElementById("comment-area").value;
    let password = document.getElementById("password").value;

    // 서버로 보낼 데이터 셋팅
    let commentJson = {};
    commentJson['content'] = content;
    commentJson['mbti'] = 'ISTJ';
    commentJson['name'] = nickname;
    commentJson['password'] = password;

    // 서버로 부터 받은 값 저장
    let recvID; // 각 댓글의 id 값
    let recvParentId; // 각 댓글의 부모id 값

    fetch('https://mbti-test.herokuapp.com/comment', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Accept': '*',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'https://mbti-test.herokuapp.com/comment',
            'Origin': 'https://mbti-test.herokuapp.com',
            'Referer': 'https://mbti-test.herokuapp.com'
        },
        body: JSON.stringify(commentJson),
    })
        .then((response) => {   // http 통신 요청과 응답에서 응답의 정보를 담고 있는 객체. 응답 JSON 데이터를 사용하기 위해 return 해줌.
            console.log(response);
            return response.json();
        })
        .then(response => {
            if (response.status == 200) {
                alert("댓글 작성 성공!");
                console.log(response.data);  // 성공 시 데이터 확인. (테스트 시에만 사용 하고 지울 예정)

                searchComment();  // 댓글 조회 함수 호출
            } else {
                alert("오류 입니다.");
            }
        })
        .catch((error) => console.log("error:", error));

}

// 화면에 댓글을 보여주기 위해 HTML 코드를 리턴하는 함수
function displayComment(comment, size) {

    let comments = [];  // 배열 선언
    let innerComment = '';

    if (isDeleteCheck) {     // 댓글 삭제 후 해당 함수를 호출 할 경우, 새로운 화면을 띄워줘야 하므로 아래의 값들을 초기화 해줌
        for (let i = 0; i < size; i++) {
            comments.length = 0;
            innerComment = '';
            showComment.innerHTML = '';
        }
    }

    for (let i = 0; i < size; i++) {
        comments.push({  //각 댓글마다 아래 항목들을 추가함
            content: `${comment.data.content[i].content}`,  // 댓글 내용
            mbti: "ISTJ",  // MBTI 유형
            name: `${comment.data.content[i].name}`,  // 작성자 이름
            password: `${comment.data.content[i].password}`,  // 작성자 비밀번호
            id: `${comment.data.content[i].id}`,  // 해당 댓글의 id(서버에서 보관)
            parentId: `${comment.data.content[i].parentId}`,  // 해당 댓글의 부모 id(서버에서 보관)
            createdDate: `${comment.data.content[i].createdDate}`,  // 해당 댓글 작성 시간
        });
    }


    innerComment = comments.map(function (c) {  // 각 댓글별로 html 코드 작성

        let changeCreatedDate = dateToStr(c.createdDate);

        return `
        <div class="comment" id="comment-${c.id}">
            <div class="info">
                <span id="rstName" class="rstName">${c.name}</span>
                <span id="rstDate" class="rstDate">${changeCreatedDate}</span>
                <button type="submit" class="del-reply-btn" id="commentDelete" name="commentDelete" onclick="commentDelete(${c.id}, ${c.name}, ${c.password})" ></button>
            </div>

                <div class="point-line-reply"></div>

            <span id="rstcomment-text" class="rstcomment-text">${c.content}</span>

            <div class="add-reply">
                <textarea name="comment-reply-area" class="comment-reply-area" id="comment-reply-area" rows="18" placeholder="답글을 달아주세요"></textarea>
                <button class="write-reply-btn"></button>
            </div>
        
        </div>
        `;
    });


    // string -> html
    innerComment = innerComment.join("");

    // innerHTML
    showComment.innerHTML += innerComment;

    console.log(showComment);  //받아온 댓글 리스트 들이 정상적으로 나오는지 콘솔 로그 확인 (삭제 예정)

}

function commentDelete(id, name, password) {  // 댓글 삭제

    // 해당 로그들은 테스트 시에만 사용 *************************************************
    console.log("DELETE__id: " + id);
    console.log("DELETE__name: " + name);
    console.log("DELETE__password: " + password);
    //**************************************************************************

    let pwPrompt = prompt("비밀번호를 입력해주세요.");

    if (pwPrompt == password) {
        // 서버로 보낼 데이터 셋팅
        let commentJson = {};
        commentJson['id'] = id;
        commentJson['name'] = name;
        commentJson['password'] = password;


        fetch('https://mbti-test.herokuapp.com/comment', {
            method: 'DELETE',
            cache: 'no-cache',
            headers: {
                'Accept': '*',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://mbti-test.herokuapp.com/comment',
                'Origin': 'https://mbti-test.herokuapp.com',
                'Referer': 'https://mbti-test.herokuapp.com'
            },
            body: JSON.stringify(commentJson),
        })
            .then((response) => {   // http 통신 요청과 응답에서 응답의 정보를 담고 있는 객체. 응답 JSON 데이터를 사용하기 위해 return 해줌.
                console.log(response);
                return response.json(); ㄴ
            })
            .then(response => {
                if (response.status == 200) {
                    alert("댓글 삭제 성공!");

                    // 댓글 삭제에 성공할 경우, 조회 함수(searchComment)를 호출하여 화면에 띄울 댓글들의 목록을 조회해온다.
                    searchComment();

                    // 삭제 함수(commentDelete)를 호출했을 경우, 해당 값을 true 로 변경 후 댓글을 보여주는 함수 (displayComment)로 넘긴다.
                    isDeleteCheck = 'true';
                } else {
                    alert("오류 입니다.");
                }
            })
            .catch((error) => console.log("error:", error));

    } else {  // 비밀번호 입력에 실패했을 경우
        alert("비밀번호가 일치하지 않습니다.");
    }
}


function searchComment() {  // 댓글 페이징 조회

    // 화면 크기 별로 해당 값들이 달라질 수 있으니 변수 처리
    let page = '1';  // 조회 할 페이지
    let size = '3';  // 해당 페이지에서 보여 줄 댓글의 수

    let tmpURL = 'https://mbti-test.herokuapp.com/comment';
    let reqURL = tmpURL + '?page=' + page + '&' + 'size=' + size;  // ex) https://mbti-test.herokuapp.com/comment?page=1&size=5

    // 서버로 부터 받은 값 저장
    fetch(reqURL)
        .then((response) => {   // http 통신 요청과 응답에서 응답의 정보를 담고 있는 객체. 응답 JSON 데이터를 사용하기 위해 return 해줌.
            console.log(response);
            return response.json();
        })
        .then(response => {
            if (response.status == 200) {
                displayComment(response, size);
            } else {
                alert("오류 입니다.");
            }
        })
        .catch((error) => console.log("error:", error));
}

// =========================== Share ===========================

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
