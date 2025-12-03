<template>
    <div class="ghost_mark">
        <div class="main_container">
            <img src="@/assets/ghost.svg" alt="" class="main">
            <img src="@/assets/hat.svg" alt="" class="hat">
            <img src="@/assets/guai.svg" alt="" class="guai">
            <img src="@/assets/beard.svg" alt="" class="beard">
            <img src="@/assets/tree.svg" alt="" class="tree">
            <img src="@/assets/nangua.svg" alt="" class="nangua">
            <img src="@/assets/zhizhu.svg" alt="" class="zhizhu">
        </div>
    </div>
  </template>
<script setup>
/* eslint-disable */
import { onMounted } from 'vue'
</script>
<style scoped>
.ghost_mark {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: dark 10s ease-out infinite;
}
.main_container {
    position: relative;
    transform-style: preserve-3d;
}
.ghost_mark .main,
.ghost_mark .hat {
    width: 80px;
    height: 80px;
    animation: move 2s linear infinite;
}
.ghost_mark .hat {
    width: 60px;
    height: 60px;
    position: absolute;
    top: 0;
    left: 0;
    animation: move2 2s linear infinite;
}
.ghost_mark .tree {
    width: 100px;
    height: 100px;
    position: absolute;
    top: -20px;
    left: 0;
    z-index: -1;
    animation: tree 3s linear infinite;
}
.ghost_mark .nangua {
    width: 50px;
    height: 50px;
    position: absolute;
    top: 38px;
    left: 50px;
    z-index: -1;
    animation: tree 3s linear infinite;
}
.ghost_mark .beard {
    width: 40px;
    height: 30px;
    position: absolute;
    top: 32px;
    left: 25px;
    animation: move4 2s linear infinite;
}
.ghost_mark .guai {
    width: 50px;
    height: 50px;
    position: absolute;
    top: 40px;
    left: 0;
    transform: rotateY(180deg);
    z-index: 3;
    animation: move3 2s linear infinite;
}
.ghost_mark .zhizhu {
    width: 50px;
    height: 50px;
    position: absolute;
    top: -40px;
    right: -50px;
    animation: zhizhu 1.5s ease-out infinite;
}
@keyframes move {
    0%, 50%, 100% {
        transform: translateY(0);
    }
    25% {
        transform: translateY(-10%);
    }
    75% {
        transform: translateY(10%);
    }
}
@keyframes move2 {
    0%, 50%, 100% {
        transform: translateY(-50%);
    }
    25% {
        transform: translateY(-60%);
    }
    75% {
        transform: translateY(-30%);
    }
}
@keyframes move3 {
    0% {
        transform: rotateZ(0) rotateY(180deg) translateY(0);
    }
    25% {
        transform: rotateZ(20deg) rotateY(180deg) translateY(-10%);
    }
    50% {
        transform: rotateZ(-380deg) rotateY(180deg) translateY(0);
    }
    75% {
        transform: rotateZ(-360deg) rotateY(180deg) translateY(10%);
    }
    100% {
        transform: rotateZ(0) rotateY(180deg) translateY(0);
    }
}
@keyframes move4 {
    0%, 50%, 100% {
        transform: translateY(0);
    }
    25% {
        transform: translateY(-30%);
    }
    75% {
        transform: translateY(30%);
    }
}
@keyframes dark {
    0%, 8%, 19%, 32%, 44%, 60%, 77%, 85%, 98%, 100% {
        background-color: rgba(122, 122, 122, 0.363);
    }
    2%, 15%, 27%, 34%, 50%, 69%, 80%, 95% {
        background-color: transparent;
    }
}
@keyframes tree {
    0%, 100% {
        transform: translateX(0);
        opacity: 1;
    }
    50% {
        transform: translateX(-150px);
        opacity: 0;
    }
    70% {
        transform: translateX(100px);
        opacity: 0;
    }

}
@keyframes zhizhu {
    0%, 100% {
        transform: translateY(0);
    }
    30% {
        transform: translateY(20%);
    }
    40% {
        transform: translateY(15%);
    }
    50% {
        transform: translateY(13%);
    }
    60% {
        transform: translateY(10%);
    }
    70% {
        transform: translateY(15%);
    }
    80% {
        transform: translateY(20%);
    }
}
</style>