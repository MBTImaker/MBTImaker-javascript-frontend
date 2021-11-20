const count = document.querySelector(".count");

fetch("https://mbti-test.herokuapp.com/test")
    .then((response) => response.json())
    .then((info) => {
        count.textContent = info.data.testCount;
    }
    );