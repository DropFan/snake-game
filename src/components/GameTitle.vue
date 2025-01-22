<template>
    <div class="game-title">
        <svg class="snake-logo" width="40" height="40" viewBox="0 0 40 40">
            <!-- 蛇身 -->
            <rect x="8" y="8" width="8" height="8" rx="2" fill="#4CAF50" />
            <rect x="16" y="8" width="8" height="8" rx="2" fill="#4CAF50" />
            <rect x="24" y="8" width="8" height="8" rx="2" fill="#4CAF50" />
            <!-- 蛇头 -->
            <rect x="24" y="16" width="8" height="8" rx="2" fill="#388E3C" />
            <!-- 蛇眼睛 -->
            <circle cx="27" cy="19" r="1" fill="white" />
            <!-- 食物 -->
            <rect x="8" y="24" width="8" height="8" rx="2" fill="#FF5722" />
        </svg>
        <h1>贪吃蛇 <span class="version">v1.0</span></h1>
    </div>
</template>

<script setup>
/**
 * 游戏标题组件
 * 包含游戏Logo和标题文本
 */
</script>

<style scoped>
.game-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
}


.game-title {
    width: 100%;
    text-align: center;
    margin: 20px 0;
}


.snake-logo {
    width: 40px;
    height: 40px;
}

.snake-logo {
    animation: wiggle 2s ease-in-out infinite;
}

@keyframes wiggle {
    0%, 100% {transform: rotate(-5deg);}
    50% {transform: rotate(5deg);}
}

.game-title h1 {
    font-size: 28px;
    color: #333;
    margin: 0;
}

.game-title .version {
    font-size: 0.8em;
    color: #666;
}
</style>