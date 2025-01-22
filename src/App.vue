<script setup>
/**
 * 贪吃蛇游戏主组件
 * 负责管理游戏状态、用户界面渲染、用户输入控制和游戏设置
 * 整合了游戏引擎、控制器和渲染器三个核心模块
 *
 * 主要功能：
 * - 游戏状态管理：分数、游戏结束、暂停等状态
 * - 画布渲染：自适应大小的游戏画布
 * - 用户输入控制：键盘和触摸控制
 * - 游戏设置：速度、边界模式、音频控制
 */

import { ref, onMounted, onUnmounted } from 'vue'
import { AudioManager } from './game/audioManager'
import { GameEngine } from './game/GameEngine'
import { GameController } from './game/GameController'
import { GameRenderer } from './game/GameRenderer'
import { GameConfig } from './game/GameConfig'
import GameInstructions from './components/GameInstructions.vue'
import GameTitle from './components/GameTitle.vue'

// 游戏状态管理
// 使用Vue的响应式系统来追踪游戏的各种状态
const score = ref(0)                  // 当前游戏得分
const gameRunning = ref(false)        // 游戏是否正在运行
const gameOver = ref(false)           // 游戏是否结束
const isPaused = ref(false)           // 游戏是否暂停
const boundaryMode = ref(true)        // 边界模式：true为撞墙死亡，false为穿墙
const bgMusicEnabled = ref(AudioManager.bgMusicEnabled)      // 背景音乐开关状态
const soundEffectsEnabled = ref(AudioManager.soundEffectsEnabled) // 音效开关状态
const speedPercentage = ref(50)       // 游戏速度百分比，0%最慢，100%最快

// 游戏状态管理函数
const handleGameStateChange = (state) => {
  score.value = state.score
  gameOver.value = state.gameOver
  isPaused.value = state.isPaused
  gameRunning.value = !state.gameOver
}

// 游戏核心配置参数
const GRID_SIZE = 20                  // 游戏网格大小，决定游戏区域的网格数量
const GAME_SPEED = 100                // 基础游戏速度（毫秒），控制蛇移动的频率
const DIRECTION_COOLDOWN = 100        // 方向输入冷却时间（毫秒），防止快速连续按键

// 画布相关配置
const canvas = ref(null)              // 游戏画布DOM引用
const canvasSize = ref(Math.min(window.innerWidth * 0.9, window.innerHeight * 0.8, 600)) // 画布大小，自适应窗口
const CELL_SIZE = ref(20)             // 网格单元格大小，根据画布大小动态计算

// 游戏核心实例
let gameEngine      // 游戏引擎实例，负责游戏核心逻辑
let gameController  // 游戏控制器实例，负责处理用户输入
let gameRenderer    // 游戏渲染器实例，负责画布渲染

/**
 * 更新游戏速度
 * @param {number} percentage - 速度百分比，0%为最慢，100%为最快
 * @description 根据百分比计算实际游戏速度，并更新游戏引擎的速度设置
 */
const updateGameSpeed = (percentage) => {
  if (gameEngine) {
    // 将百分比转换为实际的游戏速度值（0%对应最慢速度200ms，100%对应最快速度50ms）
    const actualSpeed = GameConfig.MIN_GAME_SPEED - (percentage / 100) * (GameConfig.MIN_GAME_SPEED - GameConfig.MAX_GAME_SPEED)
    console.debug('游戏速度更新为：', actualSpeed)
    gameEngine.setSpeed(actualSpeed)
  }
}

/**
 * 更新游戏网格单元格大小
 * @description 根据画布大小和网格数量计算单元格大小，并更新渲染器
 */
const updateCellSize = () => {
  CELL_SIZE.value = Math.floor(canvasSize.value / GRID_SIZE)
  if (gameRenderer) {
    gameRenderer.updateCellSize(CELL_SIZE.value)
  }
}

/**
 * 监听并处理窗口大小变化
 * @description 在窗口调整大小时重新计算画布和单元格大小，确保游戏界面响应式适配
 */
const updateCanvasSize = () => {
  canvasSize.value = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.8, 600)
  updateCellSize()
}

/**
 * 处理游戏结束模态框的关闭事件
 * @description 重置游戏状态并停止游戏引擎，清理相关实例
 */
const handleStopGame = () => {
  gameOver.value = false
  gameRunning.value = false
  if (gameEngine) {
    gameEngine.stop()
    gameEngine = null
  }
}

/**
 * 游戏启动主函数
 * @description 负责初始化游戏引擎、控制器和渲染器，设置游戏参数并启动游戏循环
 * 包括：
 * 1. 重置游戏状态
 * 2. 初始化游戏引擎并设置状态回调
 * 3. 初始化控制器并设置输入处理
 * 4. 初始化渲染器
 * 5. 启动游戏并设置音频状态
 */
const startGame = () => {
  if (gameEngine) gameEngine.stop()

  // 重置游戏状态
  gameOver.value = false
  score.value = 0
  isPaused.value = false

  // 初始化游戏引擎
  gameEngine = new GameEngine({
    gridSize: GRID_SIZE,
    gameSpeed: GameConfig.MIN_GAME_SPEED - (speedPercentage.value / 100) * (GameConfig.MIN_GAME_SPEED - GameConfig.MAX_GAME_SPEED),
    boundaryMode: boundaryMode.value
  })

  // 设置游戏状态更新回调
  gameEngine.onUpdate = (state) => {
    handleGameStateChange(state)
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
      if (gameEngine) gameEngine.pause()
    }

    gameController.onStop = () => {
      if (gameEngine) gameEngine.stop()
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

  gameRunning = true

  // 初始化音频状态
  gameEngine.audioManager.init()
}

// Vue生命周期钩子
// 组件挂载时初始化画布尺寸并添加窗口大小变化监听
onMounted(() => {
  updateCellSize()
  window.addEventListener('resize', updateCanvasSize)
})

// 组件卸载时清理游戏实例和事件监听
onUnmounted(() => {
  if (gameEngine) gameEngine.stop()
  if (gameController) gameController.destroy()
  if (gameRenderer) gameRenderer.clear()
  window.removeEventListener('resize', updateCanvasSize)
})
</script>

<template>
  <!-- 游戏容器：包含标题、画布、控制面板和说明 -->
  <div class="game-container">
    <GameTitle />
    <canvas ref="canvas" :width="canvasSize" :height="canvasSize" class="game-canvas"></canvas>

    <div class="game-controls">
      <div class="score">得分: {{ score }}</div>

      <!-- :disabled="gameEngine && (!gameOver)" -->
      <div class="button-group">
        <button @click="gameRunning ? handleStopGame() : startGame()"
          :class="gameRunning? 'end-game':'start-game'"
        >
          {{ gameRunning ? '结束游戏':'开始游戏' }}
        </button>
        <button @click="gameEngine?.pause()"
          :disabled="!gameEngine || !gameEngine.gameLoop || gameOver"
          :class="isPaused ? 'resume-game' : 'pause-game'"
        >
          {{ isPaused ? '继续' : '暂停' }}
        </button>
      </div>

      <div class="settings-panel">
        <div class="settings-section">
          <h3>游戏设置</h3>
          <label class="setting-item">
            <input type="checkbox" v-model="boundaryMode" :disabled="gameRunning">
            <span class="setting-text">启用边界模式（撞墙结束游戏）</span>
          </label>
          <div class="setting-item speed-setting">
            <span class="setting-text">游戏速度</span>
            <input type="range" v-model="speedPercentage" :min="0" :max="100" :step="1"
              @input="updateGameSpeed(speedPercentage)" :disabled="gameRunning">
            <span class="speed-value">{{ speedPercentage }}%</span>
          </div>
        </div>

        <div class="settings-section">
          <h3>音频设置</h3>
          <label class="setting-item">
            <input type="checkbox" v-model="bgMusicEnabled" @change="() => gameEngine?.audioManager.toggleBackgroundMusic()">
            <span class="setting-text">🔊 背景音乐</span>
          </label>
          <label class="setting-item">
            <input type="checkbox" v-model="soundEffectsEnabled" @change="() => gameEngine?.audioManager.toggleSoundEffects()">
            <span class="setting-text">🔊 音效</span>
          </label>
        </div>
      </div>
    </div>

    <!-- 游戏结束弹窗 -->
    <div v-if="gameOver" class="modal-overlay">
      <div class="modal-content">
        <h2 class="modal-title">游戏结束</h2>
        <div class="modal-score">得分: {{ score }}</div>
        <div class="modal-buttons">
          <button class="modal-button primary" @click="startGame">重新开始</button>
          <button class="modal-button secondary" @click="handleStopGame">关闭</button>
        </div>
      </div>
    </div>

    <GameInstructions />
  </div>
</template>

<style scoped>
@import './styles/game.css';
@import './styles/controls.css';
@import './styles/modal.css';
@import './styles/settings.css';
</style>
