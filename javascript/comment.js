// =========================== Comment ===========================

const showComment = document.querySelector(".show-comment");
const chkCommentInit = document.querySelector(".wrtie-comment-btn");
const chkcommentArea = document.querySelector(".comment-area");

let isDeleteCheck = false;  // 해당 값이 true 일 경우, delete -> display 할 때 기존 댓글 목록들 전체를 지워줌
//let isFirst = false;
let isIndexCheck = false;  // index가 1234567812345678 이런 식으로 발생해서 구분 하기 위해 생성

let errorMsg = '';  // 에러메시지 안내
let userMBTI;   // 서버의 response 로 오는 값인 'INTP..' 값들을 저장

/* displayComment() 함수의 index 부분에서 사용 */
let page = 1;   // 조회 할 페이지
let size = 3;   // 해당 페이지에서 보여 줄 댓글의 수
let currentPage = 1; // 현재 페이지


window.onload = function () {
    searchComment(page, size);  // 처음에 댓글 작성하지 않아도 댓글 보이게 하도록 댓글 조회 함수 호출
    // isFirst = 'true';
}

// 댓글 작성 날짜 작성( ex) 11.08 22:49:51 )
function dateToStr(svrDate) {
    // 서버에서 보내주는 값: 2021-11-23T13:04:59.610937
    let [month, day, times] = [svrDate.substring(5, 7), svrDate.substring(8, 10), svrDate.substring(11, 19)];
    let dateToString = month + '.' + day + " " + times;

    return dateToString;
}

function searchComment(page, size) {  // 댓글 페이징 조회

    let tmpURL = 'https://mbti-test.herokuapp.com/comment';
    let reqURL = tmpURL + '?page=' + page + '&' + 'size=' + size;  // ex) https://mbti-test.herokuapp.com/comment?page=1&size=5

    fetch(reqURL)
        .then((response) => {   // http 통신 요청과 응답에서 응답의 정보를 담고 있는 객체. 응답 JSON 데이터를 사용하기 위해 return 해줌.
            return response.json();
        })
        .then(response => {
            isIndexCheck = true;
            displayComment(response, size);
        })
        .catch((error) => console.log(error));
}

function commentWrite() {

    let nickname = document.getElementById("nickname").value;
    let content = document.getElementById("comment-area").value;
    let password = document.getElementById("password").value;

    // 서버로 보낼 데이터 셋팅
    let commentJson = { 'content': content, 'mbti': MBTI, 'name': nickname, 'password': password };

    // 서버에서 받은 값 저장
    let recvID; // 각 댓글의 id 값
    let recvParentId; // 각 댓글의 부모id 값

    runFetch("POST", 'https://mbti-test.herokuapp.com/comment', commentJson)
        .then((response) => {
            alert("댓글 작성 성공!");
            console.log(response.data);  // 성공 시 데이터 확인. (테스트 시에만 사용 하고 지울 예정)
            searchComment(page, size);  // 댓글 조회 함수 호출
        })
        .catch((error) => console.log("error: ", error));
}

function displayComment(comment, size) {

    let comments = [];
    let innerComment = '';  // 각 댓글의 전체 창을 만듦
    let innerCommentIndex = '';  // 인덱스의 버튼 태그들을 만듦
    let totalPages = comment.data.totalPages;  // 사이즈 수로 나눈 총 페이지 수
    let mainTextSplit;  // mainText 앞 부분인 "나의 영화 캐릭터 유형은? " 이 부분 제거 후 ' 여기 부터 끝까지 잘라온다
    let charWithMovieName; // '' 를 기준으로 각 댓글 당 "영화 이름+영화 주인공" 을 값을 가져온다.
    const commentIndex = document.querySelector(".block .communication .comment-pages");

    let j = 1;  // 각 댓글의 mbti 값을 가져올 때 사용.

    if (isDeleteCheck || isIndexCheck) {
        showComment.innerHTML = '';
        commentIndex.innerHTML = '';
    }

    for (let i = 0; i < size; i++) {
        // size 가 3인데, 댓글이 2개만 있는 경우엔 아래 코드가 실행 되지 않아서 2개만 보여주게 추가해줌.
        if (comment.data.content[i] == null) break;

        // 서버의 response 값으로 mbti 값들은 'INTP' 와 같이 옴. 이를 영화 주인공 이름으로 변형 하기 위해 mbti 값을 변형 시켜 줌.
        userMBTI = comment.data.content[i].mbti;

        let namebyMBTI = { "text": "" };
        getNamebyMBTI(namebyMBTI, userMBTI);
        charWithMovieName = namebyMBTI.text.split("의 ");
        charWithMovieName = charWithMovieName[charWithMovieName.length - 1]; // 캐릭터 이름'
        charWithMovieName = charWithMovieName.substring(0, charWithMovieName.length - 1); // 맨 마지막에 있는 '를 지움.

        comments.push({
            content: `${comment.data.content[i].content}`,
            mbti: `${charWithMovieName}`,
            name: `${comment.data.content[i].name}`,
            password: `${comment.data.content[i].password}`,
            id: `${comment.data.content[i].id}`,  // 해당 댓글의 id(서버에서 보관)
            parentId: `${comment.data.content[i].parentId}`,  // 해당 댓글의 부모 id(서버에서 보관)
            createdDate: `${comment.data.content[i].createdDate}`,
        });

        j += 2;
    }

    innerComment = comments.map(function (c) {

        let changeCreatedDate = dateToStr(c.createdDate);

        return `
        <div class="comment" id="comment-${c.id}">
            <div class="comment_header">
                <div class="info">
                    <span id="commentNickname" class="commentNickname">${c.name}</span>
                    <span id="commentMBTI" class="commentMBTI">${c.mbti}</span>
                </div>
                <div class="btn">
                    <button type="submit" class="del-reply-btn" id="commentDelete" name="commentDelete" onclick="commentDelete(${c.id}, '${c.name}', '${c.password}')" ></button>
                    <button type="submit" class="report-reply-btn" id="report-reply-btn" name="report-reply-btn" onclick="openReportModal(${c.id})"></button>
                </div>
            
            </div>
            <div class="comment_content">             
                <span id="content" class="content">${c.content}</span>
                <span id="createdDate" class="createdDate">${changeCreatedDate}</span>
            </div>
            
            
        </div>
        `;
    });

    innerComment = innerComment.join("");
    showComment.innerHTML += innerComment;


    // =========================== 페이지 번호 표시 ===========================

    let b_pageNum_list = 3;  // 블럭에 나타낼 페이지 번호 갯수

    let block = Math.ceil(currentPage / b_pageNum_list);   //현재 리스트의 블럭 구하기
    let b_start_page = ((block - 1) * b_pageNum_list) + 1;  //현재 블럭에서 시작페이지 번호
    let b_end_page = b_start_page + b_pageNum_list - 1; //현재 블럭에서 마지막 페이지 번호

    if (b_end_page > totalPages) b_end_page = totalPages;  // 블럭의 마지막 페이지가 총 페이지 수보다 클 때 두 숫자를 같게 해줌.


    // =========================== '이전' 버튼 만들기 ===========================
    if (currentPage == 1) {  // 현재 페이지가 1 이면, 링크 없이 이전 버튼만 보여지게 함.
        innerCommentIndex += `
        <button type="submit" class="index" id="index_left_btn_not_active" value="1"></button>
      `;
    } else { // 현재 페이지가 1보다 크면, 이전 페이지로 갈 수 있도록 이전 버튼 생성
        innerCommentIndex += `
        <button type="submit" class="index" id="index_left_btn_active" onclick="searchComment(${currentPage - 1}, ${size})" value="${currentPage - 1}"></button>
      `;
    }

    for (let i = b_start_page; i <= b_end_page; i++) {
        if (currentPage == i) {  // 현재 페이지 이면 그냥 현재 페이지만 출력
            innerCommentIndex += `
                <button type="submit" class="index" id="index" style="color:#E10017;" value="${i}">${i}</button>
            `;
        } else {    // 현재 페이지를 제외한 나머지 페이지 번호들에 링크 달아서 출력
            innerCommentIndex += `
                <button type="submit" class="index" id="index" onclick="searchComment(${i}, ${size})" value="${i}">${i}</button>
            `;
        }
    }

    let total_block = Math.ceil(totalPages / b_pageNum_list);   // block 의 총 갯수

    // =========================== '다음' 버튼 만들기 ===========================
    if (currentPage >= totalPages) {  // block 과 총 block 갯수와 값이 같다면, 맨 마지막 블럭이므로 다음 링크버튼이 필요없으므로 보여주지 않는다.
        innerCommentIndex += `
        <button type="submit" class="index" id="index_right_btn_not_active" value="${currentPage + 1}"></button>
      `;
    } else {    // 그게 아니면 다음 링크 버튼을 걸어서 보여준다.
        innerCommentIndex += `
        <button type="submit" class="index" id="index_right_btn_active" onclick="searchComment(${currentPage + 1}, ${size})" value="${currentPage + 1}"></button>
      `;
    }

    commentIndex.innerHTML += innerCommentIndex;    // index 부분을 찾아서 1번부터 totalPages 까지 span 으로 추가함

    const indexBtns = document.querySelectorAll(".index");

    // 생성된 인덱스 버튼들이 몇 페이지 인지 인식한 뒤 currentPage 변수에 저장
    indexBtns.forEach((idxbtn) => {
        idxbtn.addEventListener("click", (e) => {
            currentPage = Number(e.target.value);  // Number 로 형변환 해주지 않으니 String 으로 맘대로 변환돼서 처리해줌.
        });
    });
}

function commentDelete(id, name, password) {

    // 해당 로그들은 테스트 시에만 사용 *************************************************
    console.log("DELETE__id: " + id);
    console.log("DELETE__name: " + name);
    console.log("DELETE__password: " + password);
    //**************************************************************************

    let pwPrompt = prompt("비밀번호를 입력해주세요.");

    if (pwPrompt !== password) alert("비밀번호가 일치하지 않습니다.");
    else {
        // 서버로 보낼 데이터 셋팅
        let commentJson = { 'id': id, 'name': name, 'password': password };

        runFetch("PATCH", 'https://mbti-test.herokuapp.com/comment', commentJson)
            .then((response) => {
                alert("댓글 삭제 성공!");

                // 삭제 함수(commentDelete)를 호출했을 경우, 해당 값을 true 로 변경 후 댓글을 보여주는 함수 (displayComment)로 넘긴다.
                isDeleteCheck = 'true';

                // 댓글 삭제에 성공할 경우, 조회 함수(searchComment)를 호출하여 화면에 띄울 댓글들의 목록을 조회해온다.
                searchComment(page, size);
            })
            .catch((error) => console.log("error: ", error));
    }
}