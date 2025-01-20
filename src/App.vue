<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 游戏状态
const score = ref(0)
const gameOver = ref(false)
const isPaused = ref(false)
const boundaryMode = ref(true) // true 表示边界模式，false 表示无边界模式

// 方向控制相关
const lastDirectionChange = ref(0)
const DIRECTION_COOLDOWN = 100 // 方向变化冷却时间（毫秒）

// 蛇的数据
const snake = ref([
  { x: 10, y: 10 }
])
const direction = ref('right')
const food = ref({ x: 5, y: 5 })

// 游戏配置
const GRID_SIZE = 20
const GAME_SPEED = 100

// 动态计算单元格大小
const CELL_SIZE = ref(20)
const updateCellSize = () => {
  CELL_SIZE.value = Math.floor(canvasSize.value / GRID_SIZE)
}

let gameLoop

// 初始化画布
const canvas = ref(null)
const ctx = ref(null)

// 游戏主循环
const startGame = () => {
  if (gameLoop) return
  gameOver.value = false
  score.value = 0
  snake.value = [{ x: 10, y: 10 }]
  direction.value = 'right'
  generateFood()
  gameLoop = setInterval(update, GAME_SPEED)
}

// 更新游戏状态
const update = () => {
  if (gameOver.value || isPaused.value) return
  
  const head = { ...snake.value[0] }
  
  switch (direction.value) {
    case 'up': head.y--; break
    case 'down': head.y++; break
    case 'left': head.x--; break
    case 'right': head.x++; break
  }
  
  // 检查碰撞
  if (checkCollision(head)) {
    gameOver.value = true
    clearInterval(gameLoop)
    gameLoop = null
    return
  }
  
  snake.value.unshift(head)
  
  // 检查是否吃到食物
  if (head.x === food.value.x && head.y === food.value.y) {
    score.value += 10
    generateFood()
  } else {
    snake.value.pop()
  }
  
  draw()
}

// 生成食物
const generateFood = () => {
  let newFood
  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
    // 检查新生成的食物是否与蛇的身体重叠
  } while (snake.value.some(segment => segment.x === newFood.x && segment.y === newFood.y))
  
  food.value = newFood
}

// 检查碰撞
const checkCollision = (head) => {
  // 处理无边界模式下的穿墙
  if (!boundaryMode.value) {
    if (head.x < 0) head.x = GRID_SIZE - 1
    if (head.x >= GRID_SIZE) head.x = 0
    if (head.y < 0) head.y = GRID_SIZE - 1
    if (head.y >= GRID_SIZE) head.y = 0
  }

  // 边界模式下检查是否撞墙
  if (boundaryMode.value && (
    head.x < 0 ||
    head.x >= GRID_SIZE ||
    head.y < 0 ||
    head.y >= GRID_SIZE
  )) {
    return true
  }

  // 检查是否撞到自己
  return snake.value.some(segment => segment.x === head.x && segment.y === head.y)
}

// 绘制游戏画面
const draw = () => {
  if (!ctx.value) return
  
  // 清空画布
  ctx.value.fillStyle = '#000'
  ctx.value.fillRect(0, 0, canvasSize.value, canvasSize.value)
  
  // 绘制蛇
  ctx.value.fillStyle = '#4CAF50'
  snake.value.forEach(segment => {
    ctx.value.fillRect(
      segment.x * CELL_SIZE.value,
      segment.y * CELL_SIZE.value,
      CELL_SIZE.value - 1,
      CELL_SIZE.value - 1
    )
  })
  
  // 绘制食物
  ctx.value.fillStyle = '#FF5722'
  ctx.value.fillRect(
    food.value.x * CELL_SIZE.value,
    food.value.y * CELL_SIZE.value,
    CELL_SIZE.value - 1,
    CELL_SIZE.value - 1
  )
}

// 键盘控制
const handleKeydown = (e) => {
  const now = Date.now()
  if (now - lastDirectionChange.value < DIRECTION_COOLDOWN) return

  switch (e.key) {
    case 'ArrowUp':
      if (gameLoop) e.preventDefault()
      if (direction.value !== 'down') {
        direction.value = 'up'
        lastDirectionChange.value = now
      }
      break
    case 'ArrowDown':
      if (gameLoop) e.preventDefault()
      if (direction.value !== 'up') {
        direction.value = 'down'
        lastDirectionChange.value = now
      }
      break
    case 'ArrowLeft':
      if (gameLoop) e.preventDefault()
      if (direction.value !== 'right') {
        direction.value = 'left'
        lastDirectionChange.value = now
      }
      break
    case 'ArrowRight':
      if (gameLoop) e.preventDefault()
      if (direction.value !== 'left') {
        direction.value = 'right'
        lastDirectionChange.value = now
      }
      break
    case ' ':
      if (gameLoop) e.preventDefault()
      isPaused.value = !isPaused.value
      break
  }
}

// 触摸控制相关变量
const touchStartX = ref(0)
const touchStartY = ref(0)

// 触摸事件处理
const handleTouchStart = (e) => {
  if (gameLoop) e.preventDefault()
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
}

const handleTouchMove = (e) => {
  if (gameLoop) e.preventDefault()
  if (!gameLoop || gameOver.value) return

  const now = Date.now()
  if (now - lastDirectionChange.value < DIRECTION_COOLDOWN) return
  
  const touchEndX = e.touches[0].clientX
  const touchEndY = e.touches[0].clientY
  
  const deltaX = touchEndX - touchStartX.value
  const deltaY = touchEndY - touchStartY.value
  
  // 判断滑动方向
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // 水平滑动
    if (deltaX > 0 && direction.value !== 'left') {
      direction.value = 'right'
      lastDirectionChange.value = now
    } else if (deltaX < 0 && direction.value !== 'right') {
      direction.value = 'left'
      lastDirectionChange.value = now
    }
  } else {
    // 垂直滑动
    if (deltaY > 0 && direction.value !== 'up') {
      direction.value = 'down'
      lastDirectionChange.value = now
    } else if (deltaY < 0 && direction.value !== 'down') {
      direction.value = 'up'
      lastDirectionChange.value = now
    }
  }
  
  // 更新起始点
  touchStartX.value = touchEndX
  touchStartY.value = touchEndY
}

// 组件挂载和卸载
// 计算画布实际尺寸
const canvasSize = ref(Math.min(window.innerWidth * 0.9, window.innerHeight * 0.8, 600))

// 监听窗口大小变化
const updateCanvasSize = () => {
  canvasSize.value = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.8, 600)
  updateCellSize()
}

onMounted(() => {
  ctx.value = canvas.value.getContext('2d')
  updateCellSize()
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('touchstart', handleTouchStart)
  window.addEventListener('touchmove', handleTouchMove)
  window.addEventListener('resize', updateCanvasSize)
})

onUnmounted(() => {
  if (gameLoop) clearInterval(gameLoop)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchmove', handleTouchMove)
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
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
    ></canvas>
    
    <div class="game-controls">
      <div class="score">得分: {{ score }}</div>
      <div class="button-group">
        <button @click="startGame" :disabled="gameLoop">开始游戏</button>
        <label class="mode-option">
          <input type="checkbox" v-model="boundaryMode" :disabled="gameLoop">
          <span class="checkbox-text">启用边界模式（撞墙结束游戏）</span>
        </label>
        <button @click="isPaused = !isPaused" :disabled="!gameLoop || gameOver">
          {{ isPaused ? '继续' : '暂停' }}
        </button>
      </div>
      <div v-if="gameOver" class="game-over">游戏结束!</div>
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
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: #f5f5f5;
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

.game-title {
  width: 100%;
  text-align: center;
  margin: 20px 0;
}

.game-title h1 {
  font-size: 28px;
  color: #333;
  margin: 0;
}

.game-title .version {
  font-size: 16px;
  color: #666;
}

.game-canvas {
  border: 2px solid #333;
  background-color: #000;
  margin: 10px auto;
  display: block;
  touch-action: none;
}

.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  background-color: #f5f5f5;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}

.game-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 400px;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.mode-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  color: #333;
}

.mode-option input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.mode-option input[type="checkbox"]:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.checkbox-text {
  font-size: 16px;
}

.score {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

button {
  padding: 12px 24px;
  font-size: 18px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  min-width: 120px;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

.game-over {
  font-size: 24px;
  color: #f44336;
  font-weight: bold;
  margin-top: 10px;
}

.game-instructions {
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.game-instructions h2 {
  color: #333;
  font-size: 20px;
  margin-bottom: 15px;
  text-align: center;
}

.instruction-content {
  color: #666;
  line-height: 1.5;
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
}

.control-item strong {
  color: #333;
  display: block;
  margin-bottom: 10px;
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
}

@media (max-width: 480px) {
  .game-container {
    padding: 5px;
  }
  
  button {
    padding: 10px 20px;
    font-size: 16px;
    min-width: 100px;
  }
  
  .score {
    font-size: 20px;
  }
  
  .game-over {
    font-size: 20px;
  }
}
</style>
