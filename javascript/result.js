const loading = document.querySelector(".loading");
const block = document.querySelector(".block");

block.style.display = "none";

window.onload = function () {
    loading.style.display = "none";
    block.style.display = "flex";
}