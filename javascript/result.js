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
    let today = new Date();
    let month = ('0' + (today.getMonth() + 1)).slice(-2);
    let day = ('0' + today.getDate()).slice(-2);
    let hours = ('0' + today.getHours()).slice(-2); 
    let minutes = ('0' + today.getMinutes()).slice(-2);
    let seconds = ('0' + today.getSeconds()).slice(-2); 

    let dateToString = month  + '.' + day + " " + hours + ':' + minutes  + ':' + seconds;
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

                recvID = response.data.id;
                recvParentId = response.data.parentId;

                displayComment(commentJson, recvID, recvParentId);

            } else {
                alert("오류 입니다.");
            }
          })
        .catch((error) => console.log("error:", error));
    
}


function displayComment(comment, id, parentId) {

console.log("In FUNC displayComment__id::"+id);
console.log("In FUNC displayComment__parentId::"+parentId);

    let result = [];  // 배열 선언
    let obj = new Object();
    obj.content = comment.content;
    obj.mbti = "ISTJ";
    obj.name = comment.name;
    obj.password = comment.password;
    obj.id = id;
    obj.parentId = parentId;
    result.push(obj);


    console.log("result: "+result);

    let innerComment = result.map(function (c) {

    const dateStr = dateToStr(new Date());
    let rstDate = dateStr;

        return `
        <div class="comment" id="comment-${id}">
            <div class="info">
                <span id="rstName" class="rstName">${c.name}</span>
                <span id="rstDate" class="rstDate">${dateStr}</span>
                <button type="submit" class="del-reply-btn" id="commentDelete" name="commentDelete" onclick="commentDelete()" ></button>
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

    console.log(showComment);
}

function commentDelete(id, name, password) {  // 댓글 삭제
//     let id = '1475';
//     let name = '1234';
//     let password = '123123123';

// console.log("DELETE__id: "+id);
// console.log("DELETE__name: "+name);
// console.log("DELETE__password: "+password);


    
//         // 서버로 보낼 데이터 셋팅
//         let commentJson = {};
//         commentJson['id'] = id;
//         commentJson['name'] = name;
//         commentJson['password'] = password;
    
//         // 서버로 부터 받은 값 저장

    
//         fetch('https://mbti-test.herokuapp.com/comment', {
//             method: 'DELETE',
//             cache: 'no-cache',
//             headers: {
//                 'Accept': '*',
//                 'Content-Type': 'application/json',
//                 'Access-Control-Allow-Origin': 'https://mbti-test.herokuapp.com/comment',
//                 'Origin': 'https://mbti-test.herokuapp.com',
//                 'Referer': 'https://mbti-test.herokuapp.com'
//                 },
//             body: JSON.stringify(commentJson),
//         })
//             .then((response) => {   // http 통신 요청과 응답에서 응답의 정보를 담고 있는 객체. 응답 JSON 데이터를 사용하기 위해 return 해줌.
//                 console.log(response);
//                 return response.json();
//             })
//             .then(response => {
//                 if (response.status == 200) {
//                     alert("댓글 삭제 성공!");
    
//                     recvID = response.data.id;
//                     recvParentId = response.data.parentId;
    
//                     //displayComment(commentJson, recvID, recvParentId);
    
//                 } else {
//                     alert("오류 입니다.");
//                 }
//               })
//             .catch((error) => console.log("error:", error));
}


function searchComment() {  // 댓글 페이징 조회

}








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
