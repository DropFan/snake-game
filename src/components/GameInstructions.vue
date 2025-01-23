<script setup>
/**
 * 游戏玩法说明组件
 * 展示游戏的键盘控制和触摸控制说明
 */
</script>

<template>
  <div class="game-instructions">
    <h2>玩法说明</h2>
    <div class="instruction-content">
      <p>
        贪吃蛇游戏是一个经典的益智类游戏，玩家控制一条蛇在一个方格网格中移动，通过吃掉食物来增加自身长度获得分数，同时避免碰到障碍物或自己的身体。
        <br>
      </p>
      <p>使用键盘方向键控制蛇的移动方向，触摸屏设备可以在游戏区域内触摸滑动控制。
        <br>
      </p>
      <div class="controls-info">
        <div class="control-item">
          <strong>键盘控制：</strong>
          <ul>
            <li>↑ 向上移动</li>
            <li>↓ 向下移动</li>
            <li>← 向左移动</li>
            <li>→ 向右移动</li>
            <li>空格键 暂停/继续</li>
            <li>Esc 结束游戏</li>
          </ul>
        </div>
        <div class="control-item">
          <strong>触摸控制：</strong>
          <ul>
            <li>向上滑动 - 向上移动</li>
            <li>向下滑动 - 向下移动</li>
            <li>向左滑动 - 向左移动</li>
            <li>向右滑动 - 向右移动</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/instructions.css';
</style>