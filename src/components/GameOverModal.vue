<script setup>
/**
 * 游戏结束弹窗组件
 * 负责展示游戏结束时的相关信息，包括：
 * - 得分显示
 * - 游戏结束原因
 * - 当前游戏设置信息
 * - 重新开始和关闭按钮
 */

const props = defineProps({
  // 游戏得分
  score: {
    type: Number,
    required: true
  },
  // 游戏结束原因
  gameOverMessage: {
    type: String,
    required: true
  },
  // 边界模式
  boundaryMode: {
    type: Boolean,
    required: true
  },
  // 游戏速度百分比
  speedPercentage: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['restart', 'close'])
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h2 class="modal-title">游戏结束</h2>
      <div class="modal-score">得分: {{ score }}</div>
      <div class="modal-message">{{ gameOverMessage }}</div>
      <div class="modal-message modal-game-setting">
        {{ boundaryMode ? '边界模式：有边界(撞墙结束)' : '边界模式：无边界(循环穿墙)' }}
        <br>游戏速度：{{ speedPercentage }}%
      </div>
      <div class="modal-buttons">
        <button class="modal-button primary" @click="$emit('restart')">重新开始</button>
        <button class="modal-button secondary" @click="$emit('close')">关闭</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/modal.css';
</style>