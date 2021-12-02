"use strict";

// =========================== Comment ===========================
// 정문님 개발 능력 수직 상승
// 커밋이 안 뜬다

const showComment = document.querySelector(".show-comment");

const chkCommentInit = document.querySelector(".wrtie-comment-btn");
const chkcommentArea = document.querySelector(".comment-area");


let isDeleteCheck = false;  // 해당 값이 true 일 경우, delete -> display 할 때 기존 댓글 목록들 전체를 지워줌
let isFirst = false;
let isIndexCheck = false;

let errorMsg = '';  // 에러메시지 안내
let tmpMBTI = '';
let userMBTI;

let page = 1;   // 조회 할 페이지
let size = 3;   // 해당 페이지에서 보여 줄 댓글의 수
let currentPage = 1; // 현재 페이지


window.onload = function () {
    searchComment(page, size);  // 처음에 댓글 작성하지 않아도 댓글 보이게 하도록 댓글 조회 함수 호출
    isFirst = 'true';

}

// 댓글 작성 날짜 작성( ex) 11.08 22:49:51 )
function dateToStr(svrDate) {
    // 서버에서 보내주는 값: 2021-11-23T13:04:59.610937
    let month = svrDate.substring(5, 7);
    let day = svrDate.substring(8, 10);
    let times = svrDate.substring(11, 19);

    let dateToString = month + '.' + day + " " + times;
    
    return dateToString;
}

// 댓글 작성
function commentWrite() {

    showComment.style.display = "flex";

    setMaintext(MBTI);  // share.js 파일의 setMaintext() 함수를 통해 MBTI 유형 값을 받아옴

    // 사용자가 입력 한 값을 받아온다.
    let nickname = document.getElementById("nickname").value;
    let content = document.getElementById("comment-area").value;
    let password = document.getElementById("password").value;

    // 서버로 보낼 데이터 셋팅
    let commentJson = {};
    commentJson['content'] = content;
    commentJson['mbti'] = MBTI;
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

                
                searchComment(page, size);  // 댓글 조회 함수 호출
            } else {
                // 오류 발생 시 alert 로 메시지 표출
                for(let i=0; i<response.errors.length; i++){
                    errorMsg += response.errors[i].reason + '\n';
                }
                alert(errorMsg);
                errorMsg = '';  // 에러메시지 안내 후 에러메시지 초기화
                
            }
        })
        .catch((error) => console.log("error: ", error));

}

// 화면에 댓글을 보여주기 위해 HTML 코드를 리턴하는 함수
function displayComment(comment, size) {

    let comments = [];  // 배열 선언
    let innerComment = '';
    let commentPages = '';
    let commentIndex = document.querySelector(".block .communication .show-comment .comment-pages .index");
    let innerCommentIndex = '';
    let totalPages = comment.data.totalPages;  // 사이즈 수로 나눈 총 페이지 수
    let characterNameForReply = '';

    let j = 1;  // mainText 를 split 한 뒤, 댓글에 표시하기 위한 인덱스
 

   if (isDeleteCheck || isFirst || isIndexCheck) {     // 댓글 삭제 후 해당 함수를 호출 할 경우, 새로운 화면을 띄워줘야 하므로 아래의 값들을 초기화 해줌
       for (let i = 0; i < size; i++) {
            comments.length = 0;
            innerComment = '';
            showComment.innerHTML = '';

            // index 부분에서 1페이지, 2페이지를 누를 때 마다 index가 1234567812345678 이런식으로 계속 생겨서 초기화 해 줌
            innerCommentIndex = '';
            commentIndex.innerHTML = '';
        }
    }

    for (let i = 0; i < size; i++) {
        // 서버의 response 값으로 mbti 값들은 'INTP' 와 같이 옴. 이를 영화 주인공 이름으로 변형 하기 위해 mbti 값을 변형 시켜 줌.
        userMBTI = comment.data.content[i].mbti; 
        setMaintext(userMBTI);

console.log(mainText);
        let splitMainText = mainText.split('\'');   // ' 를 기준으로 mainText 값들을 분리
console.log(splitMainText);
        let characterNameForReply = splitMainText[j].slice(splitMainText[j].lastIndexOf("의 ")+2, splitMainText[j].length);
        console.log("characterNameForReply["+i+"]:::"+characterNameForReply);
        //==========================================================================================

        comments.push({  //각 댓글마다 아래 항목들을 추가함
            content: `${comment.data.content[i].content}`,  // 댓글 내용
            mbti: `${characterNameForReply}`,  // MBTI 유형
            name: `${comment.data.content[i].name}`,  // 작성자 이름
            password: `${comment.data.content[i].password}`,  // 작성자 비밀번호
            id: `${comment.data.content[i].id}`,  // 해당 댓글의 id(서버에서 보관)
            parentId: `${comment.data.content[i].parentId}`,  // 해당 댓글의 부모 id(서버에서 보관)
            createdDate: `${comment.data.content[i].createdDate}`,  // 해당 댓글 작성 시간
        });

        j += 2;
    }


    innerComment = comments.map(function (c) {  // 각 댓글별로 html 코드 작성

        let changeCreatedDate = dateToStr(c.createdDate);

        return `
        <div class="comment" id="comment-${c.id}">
            <div class="comment_header">
                <div class="info">
                    <span id="commentNickname" class="commentNickname">${c.name}</span>
                    <span id="commentMBTI" class="commentMBTI">${c.mbti}</span>
                </div>
                <div class="btn">
                    <button type="submit" class="del-reply-btn" id="commentDelete" name="commentDelete" onclick="commentDelete(${c.id}, ${c.name}, ${c.password})" ></button>
                    <button type="submit" class="report-reply-btn" id="report-reply-btn" name="report-reply-btn"></button>
                </div>
            
            </div>
            <div class="comment_content">             
                <span id="content" class="content">${c.content}</span>
                <span id="createdDate" class="createdDate">${changeCreatedDate}</span>
            </div>
            
            
        </div>
        `;
    });

    // string -> html
    innerComment = innerComment.join("");

    // innerHTML
    showComment.innerHTML += innerComment;


    commentPages = `
                <div class="comment-pages">
                    <div class="left-btn"></div>
                    <div class="right-btn"></div>
                </div>
                `;

    showComment.innerHTML += commentPages;

    // for(let i=1; i<totalPages+1; i++){
    for(let i=1; i<11; i++){
        innerCommentIndex += `
            <button type="submit" class="index" id="index" onclick="searchComment(${i}, ${size})" value="${i}">${i}</button>
        `;

    }

    commentIndex.innerHTML += innerCommentIndex;    // index 부분을 찾아서 1번부터 totalPages 까지 span 으로 추가함

    // left-btn 뒤에 기존 방법 처럼 인덱스 부분을 넣고 싶었으나 실패하여 after 를 이용하여 넣음
    let commentLeftBtn = document.querySelector(".left-btn");
    commentLeftBtn.after(commentIndex);
console.log(commentIndex);




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

                return response.json();

            })
            .then(response => {
                if (response.status == 200) {
                    alert("댓글 삭제 성공!");

                    // 댓글 삭제에 성공할 경우, 조회 함수(searchComment)를 호출하여 화면에 띄울 댓글들의 목록을 조회해온다.
                    searchComment(page, size);

                    // 삭제 함수(commentDelete)를 호출했을 경우, 해당 값을 true 로 변경 후 댓글을 보여주는 함수 (displayComment)로 넘긴다.
                    isDeleteCheck = 'true';
                } else {
                    // 오류 발생 시 alert 로 메시지 표출
                    for(let i=0; i<response.errors.length; i++){
                        errorMsg += response.errors[i].reason + '\n';
                    }
                    alert(errorMsg);
                    }
            })
            .catch((error) => console.log("error:", error));

    } else {  // 비밀번호 입력에 실패했을 경우
        alert("비밀번호가 일치하지 않습니다.");
    }
}


function searchComment(page, size) {  // 댓글 페이징 조회

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
console.log(response.data);

isIndexCheck = true;
                displayComment(response, size);
            } else {
                alert("오류 입니다.");
            }
        })
        .catch((error) => console.log("error:", error));
}
