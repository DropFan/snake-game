<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { GameEngine } from './game/GameEngine'
import { GameController } from './game/GameController'
import { GameRenderer } from './game/GameRenderer'

// 游戏状态
const score = ref(0)
const gameOver = ref(false)
const isPaused = ref(false)
const boundaryMode = ref(true)

// 游戏配置
const GRID_SIZE = 20
const GAME_SPEED = 100
const DIRECTION_COOLDOWN = 100

// 初始化画布
const canvas = ref(null)
const canvasSize = ref(Math.min(window.innerWidth * 0.9, window.innerHeight * 0.8, 600))
const CELL_SIZE = ref(20)

// 游戏实例
let gameEngine
let gameController
let gameRenderer

// 更新单元格大小
const updateCellSize = () => {
  CELL_SIZE.value = Math.floor(canvasSize.value / GRID_SIZE)
  if (gameRenderer) {
    gameRenderer.updateCellSize(CELL_SIZE.value)
  }
}

// 监听窗口大小变化
const updateCanvasSize = () => {
  canvasSize.value = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.8, 600)
  updateCellSize()
}

// 处理关闭模态框
const handleCloseModal = () => {
  gameOver.value = false
  if (gameEngine) gameEngine.stop()
  gameEngine = null
}

// 游戏主循环
const startGame = () => {
  if (gameEngine) gameEngine.stop()
  
  // 重置游戏状态
  gameOver.value = false
  score.value = 0
  isPaused.value = false
  
  // 初始化游戏引擎
  gameEngine = new GameEngine({
    gridSize: GRID_SIZE,
    gameSpeed: GAME_SPEED,
    boundaryMode: boundaryMode.value
  })
  
  // 设置游戏状态更新回调
  gameEngine.onUpdate = (state) => {
    score.value = state.score
    gameOver.value = state.gameOver
    gameRenderer.render(state)
  }
  
  // 初始化控制器
  if (!gameController) {
    gameController = new GameController({
      directionCooldown: DIRECTION_COOLDOWN
    })
    
    gameController.onDirectionChange = (direction) => {
      if (gameEngine) gameEngine.setDirection(direction)
    }
    
    gameController.onPause = () => {
      if (gameEngine) {
        gameEngine.pause()
        isPaused.value = !isPaused.value
      }
    }
    
    gameController.init()
  }
  
  // 初始化渲染器
  if (!gameRenderer) {
    gameRenderer = new GameRenderer(canvas.value, {
      gridSize: GRID_SIZE,
      cellSize: CELL_SIZE.value
    })
  }
  
  // 开始游戏
  gameEngine.start()
}

// 组件挂载和卸载
onMounted(() => {
  updateCellSize()
  window.addEventListener('resize', updateCanvasSize)
})

onUnmounted(() => {
  if (gameEngine) gameEngine.stop()
  if (gameController) gameController.destroy()
  window.removeEventListener('resize', updateCanvasSize)
})
</script>

<template>
  <div class="game-container">
    <div class="game-title">
      <h1>贪吃蛇 <span class="version">v1.0</span></h1>
    </div>
    <canvas
      ref="canvas"
      :width="canvasSize"
      :height="canvasSize"
      class="game-canvas"
    ></canvas>
    
    <div class="game-controls">
      <div class="score">得分: {{ score }}</div>
      <div class="button-group">
        <button @click="startGame" :disabled="gameEngine && !gameOver">开始游戏</button>
        <label class="mode-option">
          <input type="checkbox" v-model="boundaryMode" :disabled="gameEngine && !gameOver">
          <span class="checkbox-text">启用边界模式（撞墙结束游戏）</span>
        </label>
        <button @click="gameEngine?.pause()" :disabled="!gameEngine || gameOver">
          {{ isPaused ? '继续' : '暂停' }}
        </button>
      </div>
    </div>
    
    <!-- 游戏结束弹窗 -->
    <div v-if="gameOver" class="modal-overlay">
      <div class="modal-content">
        <h2 class="modal-title">游戏结束</h2>
        <div class="modal-score">得分: {{ score }}</div>
        <div class="modal-buttons">
          <button class="modal-button primary" @click="startGame">重新开始</button>
          <button class="modal-button secondary" @click="handleCloseModal">关闭</button>
        </div>
      </div>
    </div>
    
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
  </div>
</template>

<style scoped>
@import './styles/canvas.css';
@import './styles/controls.css';
@import './styles/instructions.css';
@import './styles/modal.css';
</style>
