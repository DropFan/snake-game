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
      <p>使用键盘方向键或触摸滑动控制蛇的移动方向，吃到食物可以得分。</p>
      <div class="controls-info">
        <div class="control-item">
          <strong>键盘控制：</strong>
          <ul>
            <li>↑ 向上移动</li>
            <li>↓ 向下移动</li>
            <li>← 向左移动</li>
            <li>→ 向右移动</li>
            <li>空格键 暂停/继续</li>
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
/* @import '../styles/instructions.css'; */
.game-instructions {
  width: 90%;
  max-width: 600px;
  margin-top: 20px;
  padding: 25px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.game-instructions h2 {
  color: #2c3e50;
  font-size: 22px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 600;
}

.instruction-content {
  color: #4a5568;
  line-height: 1.6;
  font-size: 15px;
}

.controls-info {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 15px;
}

.control-item {
  flex: 1;
  min-width: 200px;
  background-color: rgba(76, 175, 80, 0.05);
  padding: 15px;
  border-radius: 8px;
}

.control-item strong {
  color: #2c3e50;
  display: block;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
}

.control-item ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.control-item li {
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
}

.control-item li:before {
  content: "•";
  position: absolute;
  left: 5px;
  color: #4CAF50;
  font-size: 18px;
  line-height: 1;
}
</style>