// =========================== Comment ===========================

const showComment = document.querySelector(".show-comment");
const chkCommentInit = document.querySelector(".wrtie-comment-btn");
const chkcommentArea = document.querySelector(".comment-area");
const commentIndex = document.querySelector(".b3 .communication .comment-pages");

let isWriteCheck = true;  // write 함수에서 왔는지 확인하는 값. Write 함수를 호출했을 경우 true.
let isDeleteCheck = false;  // 해당 값이 true 일 경우, delete -> display 할 때 기존 댓글 목록들 전체를 지워줌.
let isFirst = false;
let isIndexCheck = false;  // index가 1234567812345678 이런 식으로 발생해서 구분 하기 위해 생성
let chkeckWrite = true; // wrtie-comment-btn 을 눌렀을 경우, 해당 댓글의 mbti 유형값을 따로 저장하기 위해 사용. display 해서 나오는 mbti 와 구분하기 위해 사용.

let errorMsg = '';  // 에러메시지 안내
let userMBTI;   // 서버의 response 로 오는 값인 'INTP..' 값들을 저장
let displayFuncText = { "text": "나의 영화 캐릭터 유형은? " };  // displayComment() 함수에서 getNamebyMBTI() 함수를 호출 할 때 따로 쓸 변수

/* displayComment() 함수의 index 부분에서 사용 */
let page = 1;   // 조회 할 페이지
let size = 3;   // 해당 페이지에서 보여 줄 댓글의 수
let currentPage = 1; // 현재 페이지

/* 패스워드 노출 방지를 위해 패스워드 암,복호화 함수 사용시 사용함. AES 256 방식 사용. */
let aes256SecretKey = crypto.getRandomValues(new Uint32Array(2)).join('');   // 암호화 키 값으로 랜덤의 32바이트 필요.
let aes256Iv = crypto.getRandomValues(new Uint16Array(4)).join(''); // 초기벡터 값으로, 랜덤의 16 바이트.
let aes256EncodeData = "";
let aes256DecodeData = "";
let localObj;   // 암호화 된 패스워드를 복호화 하는 함수(dec) 에서 댓글ID 값을 가져오기 위해 저장함
let tmpUseEnc;    // 해당 과정을 진행해야, 후에 enc() 함수에서 값을 불러와서 사용 할 수 있음. 각각의 값은 댓글 id 별 pw, name 값을 저장함.
let errObj = {}; // 에러메시지를 object 형식으로 받아오기 위해 선언

/* 해당 값이 true 일 경우, countCommentByte() 함수 부분에서 사용 */
let checkIsNickname = String(false); // 댓글 작성자 영역인지 확인
let checkIsComment = String(false);   // 댓글 본문 영역인지 확인
let checkIsPW = String(false);  // 댓글 비밀번호 영역인지 확인
let checkIsReport = String(false);  // 신고 부분 신고 내용 영역인지 확인
let commentCount = document.getElementById("comment_count");  // 작성한 댓글의 글자수 세기 (countCommentByte() 함수에서 사용)
let reportCount = document.getElementById("report_count");  // 신고 내용의 글자수 세기 (countCommentByte() 함수에서 사용)

window.addEventListener('load', searchComment(page, size));

// 댓글 작성, 삭제 시 호스트 명을 개발, 운영으로 구분하기 위해 사용
let reqHOST = '';
let reqURL = '';
let checkHostName = String(document.location.hostname);    // 댓글 작성, 삭제 시 호스트 명을 개발, 운영으로 구분하기 위해 사용
let checkIsDevReal = 'DEV'; // default: DVE(개발) 아닐 경우 REAL(운영)
if(checkIsDevReal == 'mbtimaker.github.io') {   // 운영
    checkIsDevReal = 'REAL';
    reqHOST = 'http://ec2-52-78-177-150.ap-northeast-2.compute.amazonaws.com:8080';
    reqURL = reqHOST + "/comment";
} else {
    checkIsDevReal = 'DEV';
    reqHOST = 'https://mbti-test.herokuapp.com';
    reqURL = reqHOST + "/comment";
}

// 댓글 닉네임, 댓글 본문, 댓글 비밀번호 입력시 입력값 검증 함수
function checkInput(userInput, isNickname, isComment, checkIsPW, checkIsReport) {
    let chk = /^[a-z|A-Z|0-9|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|<>?:{}|\s|\s+$]*$/g;    // 영어소문자,대문자,숫자,한글,특수문자 구분하는 정규식
    let modInput;  // 정규식에 해당지 않는 문자를 입력했을 경우 이를 삭제한 뒤 문자열 저장.
    let chkInput;   // 검증해야 할 입력값
    let eachMaxByte;    // 댓글 작성자, 댓글 본문 마다 최대 입력값이 다르므로 따로 설정해줌

    let chkPWReg = /^[0-9]*$/g;    // 숫자를 입력하지 않았을 경우를 찾는 정규식. 댓글 닉네임, 댓글 본문과는 조건이 달라서 따로 설정.
    let modPW;  // 숫자가 아닌 문자를 입력했을 경우 이를 삭제하고 숫자만 남김.

    // 댓글 작성자 부분 인지, 댓글 본문 부분인지 확인 후 각각의 값 셋팅
    if (isNickname == true) {    // 댓글 작성자 부분 로직 검증시
        // 검증해야 할 값은 댓글 작성자 값. 댓글 작성자, 비밀번호는 글자 수 체킹
        chkInput = document.getElementById("nickname").value;
        eachMaxByte = Number(10);
        checkIsNickname = true;
        checkIsComment = false;
        checkIsPW = false;
        checkIsReport = false;
    } else if (isComment == true || checkIsReport == true) {  // 댓글 본문, 신고 내용 부분 로직 검증시 
        // 나머지 값은 동일하게 셋팅
        eachMaxByte = Number(500);
        checkIsNickname = false;
        checkIsPW = false;

        if (isComment == true) {
            // 검증해야 할 값은 댓글 본문 값.
            chkInput = document.getElementById("comment-area").value;
            checkIsComment = true;
            checkIsReport = false;
        } else {
            // 검증해야 할 값은 신고 내용 본문 값.
            chkInput = document.getElementById("description").value;
            checkIsComment = false;
            checkIsReport = true;
        }

    } else {    // 댓글 비밀번호 부분 로직 검증시
        chkInput = document.getElementById("password").value;
        eachMaxByte = Number(20);
        checkIsNickname = false;
        checkIsComment = false;
        checkIsPW = true;
        checkIsReport = false;

        if (chkPWReg.test(userInput)) {
            document.getElementById("password").value = userInput;
            countCommentByte(userInput, eachMaxByte, checkIsNickname, checkIsComment, checkIsPW, checkIsReport);
        } else {    // 숫자가 아닌 문자를 입력했을 경우
            alert("작성자 비밀번호는 4자 이상 20자 이하 숫자만 입력해주세요.");
            modPW = userInput.replace(/[^0-9]*$/g, '')   // 숫자가 아닌 문자 삭제
            document.getElementById("password").value = modPW;  // 사용자의 input 값에도 삭제한 패스워드 문자열 반영
            countCommentByte(modPW, eachMaxByte, checkIsNickname, checkIsComment, checkIsPW, checkIsReport);
        }
    }

    // 입력값 검증. 댓글 작성자와 댓글은 정규식이 같으므로 여기서 따로 입력값 검증.
    if (checkIsNickname == true || checkIsComment == true || checkIsReport == true) {
        if (chk.test(userInput)) {
            chkInput = userInput;
            countCommentByte(chkInput, eachMaxByte, checkIsNickname, checkIsComment, checkIsPW, checkIsReport);
        } else {    // 위의 정규식이 아닌 문자를 입력했을 경우
            modInput = userInput.replace(!chk, '')   // 숫자가 아닌 문자 삭제
            chkInput = modInput;  // 사용자의 input 값에도 삭제한 패스워드 문자열 반영
            countCommentByte(chkInput, eachMaxByte, checkIsNickname, checkIsComment, checkIsPW, checkIsReport);
        }
    }
}

// 댓글 작성자, 댓글 내용, 댓글 비밀번호 의 자릿수를 체크하는 함수
function countCommentByte(input, maxBytes, checkIsNickname, checkIsComment, checkIsPW, checkIsReport) {
    let text_val = String(input);
    let text_len = text_val.length; // 입력한 문자수
    let maxByte = Number(maxBytes); // 최대 입력 가능한 바이트 수
    let mod_text = "";   // maxBytes 바이트 넘었을 경우 문자열을 자른 뒤 내용 저장하는 변수

    let commentArea = document.getElementById("comment-area").value;  // 500 글자 이상 작성시 내용 자르기 위해 사용
    let commentCountStr = text_len + "/500";

    let reportArea = document.getElementById("description").value;  // 500 글자 이상 작성시 내용 자르기 위해 사용
    let reportCountStr = text_len + "/500";

    if (text_len > maxByte) {    // 입력한 댓글이 500자 이상일 경우
        //alert("잘못된 입력 입니다. 다시 한번 입력해주세요.");
        alert("1자 이상 500자 이하로 입력해주세요.");
        mod_text = text_val.substring(0, maxByte); // 초과한 자리수 만큼 제거
        text_val = mod_text;

        if (checkIsNickname == true) {    // 댓글 닉네임 일 경우
            document.getElementById("nickname").value = text_val;
        } else if (checkIsComment == true) {     // 댓글 본문 일 경우
            commentArea.innerHTML += text_val;
            document.getElementById("comment-area").value = text_val;

            // 댓글 본문 일 경우, 글자수를 동적으로 보여주기 위해 500자 이상의 경우 글자수 표시
            commentCountStr = maxByte + "/500";
            commentCount.innerText = commentCountStr;
            commentCount.style.color = "green";
            document.getElementById("comment-area").value = text_val;
        } else if (checkIsPW == true) {    // 댓글 비밀번호 일 경우
            document.getElementById("password").value = text_val;
        } else {    // 신고 내용 부분일 경우
            reportArea.innerHTML += text_val;
            document.getElementById("description").value = text_val;

            // 댓글 본문 일 경우, 글자수를 동적으로 보여주기 위해 500자 이상의 경우 글자수 표시
            reportCountStr = maxByte + "/500";
            reportCount.innerText = reportCountStr;
            reportCount.style.color = "green";
            document.getElementById("description").value = text_val;
        }

    } else {    // 해당 값이 허용한 범위 내에서 입력 됐을 경우
        // 댓글 본문 일 경우에만, 글자수를 동적으로 보여줌
        if (checkIsComment == true) {
            commentCountStr = text_len + "/500";
            commentCount.innerText = commentCountStr;
            commentCount.style.color = "green";
        } else if (checkIsReport == true) {   // 신고 내용일 경우
            reportCountStr = text_len + "/500";
            reportCount.innerText = reportCountStr;
            reportCount.style.color = "green";
        }
    }

}

// 패스워드를 AES 256 방식으로 암호화 해주는 함수. 
function enc(isWriteCheck, isDeleteCheck, commentID) {
    let secretKey = aes256SecretKey;
    let Iv = aes256Iv;
    let data;

    if (isWriteCheck == true) {
        isDeleteCheck = false;

        data = document.getElementById("password").value;   // write 함수 일 때

        let encJson = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
        let encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson));
        aes256EncodeData = encData;

        dec(aes256SecretKey, "", aes256EncodeData, isWriteCheck, isDeleteCheck);   // 인코딩 된 패스워드를 다시 디코딩 해줌

    } else if (isDeleteCheck == true) {
        localObj = JSON.parse(localStorage.getItem(commentID));
        commentDelete(localObj.id, localObj.name, localObj.pw);
    }
};

// 암호화 된 스워드를 AES 256 방식으로 복호화 해주는 함수. 
function dec(secretKey, Iv, data, isWriteCheck, isDeleteCheck) {
    secretKey = aes256SecretKey;
    Iv = aes256Iv;

    let decData = CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
    let bytes = CryptoJS.AES.decrypt(decData, secretKey).toString(CryptoJS.enc.Utf8);
    aes256DecodeData = JSON.parse(bytes);

    /* 디코딩 된 패스워드 값을 댓글 작성 함수(commentWrite), 댓글 삭제 함수(commentDelete) 의 인자값으로 넘겨줌 */
    if (isWriteCheck == true) {
        commentWrite(aes256DecodeData);
    }
};


// 댓글 작성 날짜 작성 (ex) 11.08 22:49:51
function dateToStr(svrDate) {
    // 서버에서 보내주는 값: 2021-11-23T13:04:59.610937
    let month = svrDate.substring(5, 7);
    let day = svrDate.substring(8, 10);
    let times = svrDate.substring(11, 19);

    let dateToString = month + '.' + day + " " + times;

    return dateToString;
}

// 댓글 작성
function commentWrite(aes256DecodeData) {

    showComment.style.display = "flex";

    // 사용자가 입력 한 값을 받아온다.
    let nickname = document.getElementById("nickname").value;
    let content = document.getElementById("comment-area").value;
    let password = aes256DecodeData;  // AES256 방식으로 인코딩 한 뒤, 디코딩 한 패스워드 값을 가져온다.

    // 서버로 보낼 데이터 셋팅
    let commentJson = { 'content': content, 'mbti': MBTI, 'name': nickname, 'password': password };

    fetch(reqURL, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Accept': '*',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': reqURL,
            'Origin': reqHOST,
            'Referer': reqHOST
        },
        body: JSON.stringify(commentJson),
    })
        .then((response) => {   // http 통신 요청과 응답에서 응답의 정보를 담고 있는 객체. 응답 JSON 데이터를 사용하기 위해 return 해줌.
            return response.json();
        })
        .then(response => {
            if (response.status == 200) {
                alert("댓글이 정상적으로 작성 되었습니다.");

                // 댓글 작성 후 해당 필드 빈값 처리
                document.getElementById("nickname").value = "";
                document.getElementById("comment-area").value = "";
                document.getElementById("password").value = "";
                commentCount.innerText = "(0/500)";

                searchComment(page, size);  // 댓글 조회 함수 호출
            } 
            else {
                // 오류 발생 시 alert 로 메시지 표출
                for (let i = 0; i < response.errors.length; i++) {
                    errorMsg += response.errors[i].reason + '\n';
                }
                alert(errorMsg);
                errorMsg = '';  // 에러메시지 안내 후 에러메시지 초기화

            }
        })
        .catch((error) => alert("error: ", error));

}

// function commentWrite() {
//     // 사용자가 입력 한 값을 받아온다.
//     let nickname = document.getElementById("nickname").value;
//     let content = document.getElementById("comment-area").value;
//     // let password = document.getElementById("password").value;
//     let password = aes256DecodeData;  // AES256 방식으로 인코딩 한 뒤, 디코딩 한 패스워드 값을 가져온다.

//     // 서버로 보낼 데이터 셋팅
//     let commentJson = { 'content': content.value, 'mbti': MBTI, 'name': nickname.value, 'password': password.value };

//     // 서버에서 받은 값 저장
//     runFetch("POST", 'https://mbti-test.herokuapp.com/comment', commentJson)
//         .then((response) => {
//             alert("댓글 작성 성공!");
//             searchComment(page, size);  // 댓글 조회 함수 호출
//             [content.value, nickname.value, password.value] = [null, null, null];
//         })
//         .catch((error) => {
//             //console.log(error);
//             alert(JSON.stringify(error.errors));
//             //alert(JSON.parse(error));
//         })
// }




// 화면에 댓글을 보여주기 위해 HTML 코드를 리턴하는 함수
function displayComment(comment, size) {

    let comments = [];  // 배열 선언
    let innerComment = '';  // 각 댓글의 전체 창을 만듬
    let innerCommentIndex = '';  // 인덱스의 버튼 태그들을 만듬
    let totalPages = comment.data.totalPages;  // 사이즈 수로 나눈 총 페이지 수
    let displayFuncTextSplit;  // mainText 앞 부분인 "나의 영화 캐릭터 유형은? " 이 부분 제거 후 ' 여기 부터 끝까지 잘라온다
    let charWithMovieName; // '' 를 기준으로 각 댓글 당 "영화 이름+영화 주인공" 을 값을 가져온다.

    let displayFuncStr = '';

    //    if (isDeleteCheck || isIndexCheck) { 
    if (isDeleteCheck || isFirst || isIndexCheck) {     // 댓글 삭제 후 해당 함수를 호출 할 경우, 새로운 화면을 띄워줘야 하므로 아래의 값들을 초기화 해줌
        for (let i = 0; i < size; i++) {
            comments.length = 0;
            innerComment = '';
            showComment.innerHTML = '';

            // index 부분에서 1페이지, 2페이지를 누를 때 마다 index가 1234567812345678 이런식으로 계속 생겨서 초기화 해 줌
            innerCommentIndex = '';
            commentIndex.innerHTML = '';
            displayFuncText = { "text": "나의 영화 캐릭터 유형은? " };  // 새로운 페이지 클릭 시 해당 문자열에 계속 이어져서 초기화 작업해줌.
        }
    }

    for (let i = 0; i < size; i++) {
        //size 가 3인데, 댓글이 2개만 있는 경우엔 아래 코드가 실행 되지 않아서 2개만 보여주게 추가해줌.
        if (comment.data.content[i] == null) {
            break;
        }

        // 서버의 response 값으로 mbti 값들은 'INTP' 와 같이 옴. 이를 영화 주인공 이름으로 변형 하기 위해 mbti 값을 변형 시켜 줌.
        userMBTI = comment.data.content[i].mbti;
        getNamebyMBTI(displayFuncText, userMBTI);

        displayFuncStr = displayFuncText.text;

        displayFuncTextSplit = displayFuncStr.substring(displayFuncStr.indexOf("?") + 3);   // ? 문자 3번째 뒤 부터 영화이름+영화주인공이름 시작

        charWithMovieName = displayFuncTextSplit.split("''");

        comments.push({  //각 댓글마다 아래 항목들을 추가함
            content: `${comment.data.content[i].content}`,  // 댓글 내용
            mbti: `${charWithMovieName[i].substring(charWithMovieName[i].lastIndexOf("의 ") + 2, charWithMovieName[i].length - 1)}`,  // MBTI 유형
            name: `${comment.data.content[i].name}`,  // 작성자 이름
            password: `${comment.data.content[i].password}`,  // 작성자 비밀번호
            id: `${comment.data.content[i].id}`,  // 해당 댓글의 id(서버에서 보관)
            parentId: `${comment.data.content[i].parentId}`,  // 해당 댓글의 부모 id(서버에서 보관)
            createdDate: `${comment.data.content[i].createdDate}`,  // 해당 댓글 작성 시간
        });
    }

    innerComment = comments.map(function (c) {  // 각 댓글별로 html 코드 작성
        /* 해당 과정을 진행해야, 후에 enc() 함수에서 값을 불러와서 사용 할 수 있음. 각각의 값은 댓글 id 별 pw, name 값을 저장함. */
        tmpUseEnc = { id: `${c.id}`, pw: `${c.password}`, name: `${c.name}` };
        localStorage.setItem(`${c.id}`, JSON.stringify(tmpUseEnc));

        let changeCreatedDate = dateToStr(c.createdDate);

        return `
        <div class="comment" id="comment-${c.id}">
            <div class="comment_header">
                <div class="info">
                    <span id="commentNickname" class="commentNickname">${c.name}</span>
                    <span id="commentMBTI" class="commentMBTI">${c.mbti}</span>
                </div>
                <div class="btn">
                    <button type="submit" class="del-reply-btn" id="commentDelete" name="commentDelete" onclick="enc(false, true, ${c.id})" ></button>
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

    // string -> html
    innerComment = innerComment.join("");

    // innerHTML
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

    const indexBtns = document.querySelectorAll(".index:nth-child(n)");

    // 생성된 인덱스 버튼들이 몇 페이지 인지 인식한 뒤 currentPage 변수에 저장
    indexBtns.forEach((idxbtn) => {
        idxbtn.addEventListener("click", (e) => {
            currentPage = Number(e.target.value);  // Number 로 형변환 해주지 않으니 String 으로 맘대로 변환 되서 처리해줌.
        });
    });
}

// 댓글 삭제
function commentDelete(id, name, password) {
    // 서버로 보낼 데이터 셋팅
    let commentJson = { 'id': id, 'name': name, 'password': password };

    let pwPrompt = prompt("비밀번호를 입력해주세요.");

    if (pwPrompt == null) {  // 취소를 누를 경우
        return false;   // 아무런 알람 띄우지 않음
    } else {
        if (pwPrompt == password) {
            runFetch("PATCH", reqURL, commentJson)
                .then((response) => {
                    if (response.status == 200) {
                        alert("댓글 삭제 성공!");

                        // 삭제 함수(commentDelete)를 호출했을 경우, 해당 값을 true 로 변경 후 댓글을 보여주는 함수 (displayComment)로 넘긴다.
                        isDeleteCheck = 'true';

                        // 댓글 삭제에 성공할 경우, 조회 함수(searchComment)를 호출하여 화면에 띄울 댓글들의 목록을 조회해온다.
                        searchComment(page, size);

                    } else {
                        // 오류 발생 시 alert 로 메시지 표출
                        for (let i = 0; i < response.errors.length; i++) {
                            errorMsg += response.errors[i].reason + '\n';
                        }
                        alert(errorMsg);
                    }


                    [content.value, nickname.value, password.value] = [null, null, null];
                })
                .catch((error) => alert("error: ", error));
        } else if (pwPrompt != password) {   // 비밀번호 입력에 실패했을 경우
            alert("비밀번호가 일치하지 않습니다.");
        }
    }
}


function searchComment(page, size) {  // 댓글 페이징 조회

    let tmpURL = reqURL;
    let reqURL = tmpURL + '?page=' + page + '&' + 'size=' + size;  // ex) https://mbti-test.herokuapp.com/comment?page=1&size=5

    // 서버로 부터 받은 값 저장
    fetch(reqURL)
        .then((response) => {   // http 통신 요청과 응답에서 응답의 정보를 담고 있는 객체. 응답 JSON 데이터를 사용하기 위해 return 해줌.
            return response.json();
        })
        .then(response => {
            if (response.status == 200) {
                isIndexCheck = true;
                displayComment(response, size);
            } else {
                alert("오류 입니다.");
            }
        })
        .catch((error) => alert("error:", error));
}
