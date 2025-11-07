<template>
    <div class="tiktok_mark">
        <div class="mark_container">
            <div class="small_main">
                <div class="top"></div>
                <div class="bottom"></div>
                <div class="left"></div>
                <div class="right"></div>
                <div class="front"></div>
                <div class="back"></div>
            </div>
            <div class="big_main">
                <div class="top"></div>
                <div class="bottom"></div>
                <div class="left"></div>
                <div class="right"></div>
                <div class="front"></div>
                <div class="back"></div>
            </div>
        </div>
    </div>
  </template>
<script setup>
/* eslint-disable */
import { onMounted } from 'vue'
// 监听tk的广告
let listenTikTokMax = () => {
        // 我来啦
        chrome.runtime.sendMessage({
        message: 'listenTk'
        })
    }
</script>
<style scoped>
.tiktok_mark {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #e1dadaf2;
    z-index: 9999;
}
.mark_container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    transform-style: preserve-3d;
    transform: rotateX(-34deg) rotateY(46deg);
}
.small_main {
    width: 50px;
    height: 50px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform-style: preserve-3d;
    transform: translate(-50%,-50%);
    animation: small 2s ease-in-out infinite;
}
.small_main div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(238, 135, 135, 0.5);
    border: 1px solid #ffffff80;
}
.small_main .top {
    transform: rotateX(90deg) translateZ(25px);
}
.small_main .bottom {
    transform: rotateX(-90deg) translateZ(25px);
}
.small_main .left {
    transform: translateZ(-25px);
}
.small_main .right {
    transform: translateZ(25px);
}
.small_main .front {
    transform: rotateY(-90deg) translateZ(-25px);
}
.small_main .back {
    transform: rotateY(90deg) translateZ(-25px);
}
.big_main {
    width: 100px;
    height: 100px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform-style: preserve-3d;
    transform: translate(-50%,-50%);
    animation: big 2s ease-in-out infinite;
}
.big_main div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(238, 135, 135, 0.5);
    border: 1px solid #ffffff80;
}
.big_main .top {
    transform: rotateX(90deg) translateZ(50px);
}
.big_main .bottom {
    transform: rotateX(-90deg) translateZ(50px);
}
.big_main .left {
    transform: translateZ(-50px);
}
.big_main .right {
    transform: translateZ(50px);
}
.big_main .front {
    transform: rotateY(-90deg) translateZ(-50px);
}
.big_main .back {
    transform: rotateY(90deg) translateZ(-50px);
}
@keyframes small {
    0% {
        transform: translate(-50%,-50%) rotateY(0);
    }
    100% {
        transform: translate(-50%,-50%) rotateY(360deg);
    }
}
@keyframes big {
    0% {
        transform: translate(-50%,-50%) rotateY(360deg);
    }
    100% {
        transform: translate(-50%,-50%) rotateY(0);
    }
}
</style>