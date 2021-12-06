"use strict";

/* 설명: 모든 페이지에 적용되는 사항입니다. */

window.onload = function () {
    setTimeout(function () {
        scrollTo(0, 0);
    }, 100);
}

// (1) vh값을 css에서 정의된 값이 아닌 새로운 값을 사용한다.
let vHeight = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vHeight}px`);

// (2) head tag 안에 favicon(타이틀 왼쪽에 들어가는 이미지)을 넣는다.
const head = document.getElementsByTagName("head")[0];

const favicon = function () {
    return `<link rel="shortcut icon" href="../favicon/favicon.ico">
    <link rel="apple-touch-icon" sizes="57x57" href="../favicon/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="../favicon/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="../favicon/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="../favicon/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="../favicon/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="../favicon/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="../favicon/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="../favicon/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="../favicon/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192" href="../favicon/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="../favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="../favicon/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../favicon/favicon-16x16.png">
    <link rel="manifest" href="../favicon/manifest.json">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="../favicon/ms-icon-144x144.png">
    <meta name="theme-color" content="#ffffff">`;
}

head.innerHTML += favicon();

// (3) post
async function runFetch(method, postURL, body) {
    const options = {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    };
    const res = await fetch(postURL, options);
    const data = await res.json();
    if (res.ok) {
        return data;
    } else {
        throw Error(data);
    }
}