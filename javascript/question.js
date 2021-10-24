const select_btns = document.querySelectorAll(".select_btn");

select_btns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        e.currentTarget.classList.add("active");
    });
});

// https://www.phpschool.com/gnuboard4/bbs/board.php?bo_table=qna_html&wr_id=288964
function fnMove(seq) {
    var offset = $("#div" + seq).offset();
    $('html, body').animate({ scrollTop: offset.top + 120 }, 400);
}