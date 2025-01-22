import { GameConfig } from './GameConfig'
import { GameState } from './GameState'
import { AudioManager } from './AudioManager'

/**
 * 游戏引擎类
 * 负责处理游戏的核心逻辑，包括：
 * - 游戏循环控制（开始、暂停、停止）
 * - 蛇的移动和碰撞检测
 * - 食物生成和得分更新
 * - 音频效果控制
 */
export class GameEngine {
  /**
   * 创建游戏引擎实例
   * @param {Object} config - 游戏配置对象
   * @param {number} config.gameSpeed - 游戏速度（毫秒/帧）
   * @param {boolean} config.boundaryMode - 边界模式（true: 撞墙死亡，false: 穿墙）
   */
  constructor(config) {
    this.gameSpeed = config.gameSpeed || GameConfig.GAME_SPEED
    this.gameState = new GameState()
    this.gameState.setBoundaryMode(config.boundaryMode)
    
    this.gameLoop = null // 游戏循环定时器
    this.onUpdate = null // 游戏状态更新回调函数
    this.audioManager = new AudioManager()
  }

  /**
   * 开始游戏
   * 初始化游戏状态，启动游戏循环，播放背景音乐
   */
  start() {
    if (this.gameLoop) return
    
    this.gameState.reset()
    this.audioManager.playBackgroundMusic()
    
    this.gameLoop = setInterval(() => this.update(), this.gameSpeed)
  }

  /**
   * 暂停/继续游戏
   * 切换游戏的暂停状态，控制背景音乐的播放
   */
  pause() {
    const isPaused = this.gameState.togglePause()
    if (isPaused) {
      this.audioManager.stopBackgroundMusic()
    } else {
      this.audioManager.playBackgroundMusic()
    }
    if (this.onUpdate) {
      this.onUpdate(this.gameState.getState())
    }
  }

  /**
   * 停止游戏
   * 清除游戏循环，确保最终状态被更新
   */
  stop() {
    if (this.gameLoop) {
      clearInterval(this.gameLoop)
      this.gameLoop = null
      
      if (this.onUpdate) {
        this.onUpdate(this.gameState.getState())
      }
    }
  }

  /**
   * 设置蛇的移动方向
   * @param {string} newDirection - 新的方向（'up'|'down'|'left'|'right'）
   */
  setDirection(newDirection) {
    this.gameState.setDirection(newDirection)
  }

  /**
   * 设置游戏速度
   * @param {number} newSpeed - 新的游戏速度（毫秒/帧）
   */
  setSpeed(newSpeed) {
    this.gameSpeed = newSpeed
    if (this.gameLoop) {
      clearInterval(this.gameLoop)
      this.gameLoop = setInterval(() => this.update(), this.gameSpeed)
    }
  }

  /**
   * 游戏更新函数
   * 处理每一帧的游戏逻辑：
   * 1. 更新蛇的位置
   * 2. 检查碰撞
   * 3. 处理食物吃取
   * 4. 更新游戏状态
   */
  update() {
    const state = this.gameState.getState()
    if (state.gameOver || state.isPaused) return
    
    // 计算蛇头的新位置
    const head = { ...state.snake[0] }
    
    switch (state.direction) {
      case 'up': head.y--; break
      case 'down': head.y++; break
      case 'left': head.x--; break
      case 'right': head.x++; break
    }
    
    // 检查碰撞
    if (this.checkCollision(head)) {
      this.gameState.setGameOver(true)
      this.audioManager.playSound('gameOver')
      this.audioManager.stopBackgroundMusic()
      this.stop()
      return
    }
    
    // 更新蛇的位置
    this.gameState.snake.unshift(head)
    
    // 处理食物吃取
    if (head.x === this.gameState.food.x && head.y === this.gameState.food.y) {
      this.gameState.updateScore()
      this.gameState.generateFood()
      this.audioManager.playSound('eat')
    } else {
      this.gameState.snake.pop()
    }
    
    // 通知状态更新
    if (this.onUpdate) {
      this.onUpdate(this.gameState.getState())
    }
  }

  /**
   * 检查碰撞
   * @param {Object} head - 蛇头位置
   * @param {number} head.x - 横坐标
   * @param {number} head.y - 纵坐标
   * @returns {boolean} 是否发生碰撞
   */
  checkCollision(head) {
    // 非边界模式：穿墙
    if (!this.gameState.boundaryMode) {
      if (head.x < 0) head.x = GameConfig.GRID_SIZE - 1
      if (head.x >= GameConfig.GRID_SIZE) head.x = 0
      if (head.y < 0) head.y = GameConfig.GRID_SIZE - 1
      if (head.y >= GameConfig.GRID_SIZE) head.y = 0
    }

    // 边界模式：检查是否撞墙
    if (this.gameState.boundaryMode && (
      head.x < 0 ||
      head.x >= GameConfig.GRID_SIZE ||
      head.y < 0 ||
      head.y >= GameConfig.GRID_SIZE
    )) {
      return true
    }

    // 检查是否撞到自己
    return this.gameState.snake.some(segment => 
      segment.x === head.x && segment.y === head.y
    )
  }
}