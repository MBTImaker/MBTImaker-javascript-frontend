const loading = document.querySelector(".loading");
const block = document.querySelector(".block");

block.style.display = "none";

window.onload = function () {
    loading.style.display = "none";
    block.style.display = "flex";
}

// 댓글 작성
function comment() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
             alert(this.responseText);
         }
    };

    const nickname = document.getElementById("nickname").value;
    const content = document.getElementById("comment-area").value;
    const password = document.getElementById("password").value;
    
    xhttp.open("POST", "https://virtserver.swaggerhub.com/seonpilKim/MBTI/1.0.0/comment", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send("{\"content\": \"+content+ \",\"mbti\": \"ISTJ\",\"name\": \"+nickname+\",\"password\": \"+password+\"}");



}