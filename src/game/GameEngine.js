import { GameConfig } from './GameConfig'
import { GameState } from './GameState'

// 游戏引擎类，负责处理游戏核心逻辑
export class GameEngine {
  constructor(config) {
    this.gameSpeed = config.gameSpeed || GameConfig.GAME_SPEED
    this.gameState = new GameState()
    this.gameState.setBoundaryMode(config.boundaryMode)
    
    this.gameLoop = null
    this.onUpdate = null
  }

  start() {
    if (this.gameLoop) return
    
    this.gameState.reset()
    
    this.gameLoop = setInterval(() => this.update(), this.gameSpeed)
  }

  pause() {
    this.gameState.togglePause()
  }

  stop() {
    if (this.gameLoop) {
      clearInterval(this.gameLoop)
      this.gameLoop = null
      
      // 确保在停止时更新最终状态
      if (this.onUpdate) {
        this.onUpdate(this.gameState.getState())
      }
    }
  }

  setDirection(newDirection) {
    this.gameState.setDirection(newDirection)
  }

  update() {
    const state = this.gameState.getState()
    if (state.gameOver || state.isPaused) return
    
    const head = { ...state.snake[0] }
    
    switch (state.direction) {
      case 'up': head.y--; break
      case 'down': head.y++; break
      case 'left': head.x--; break
      case 'right': head.x++; break
    }
    
    if (this.checkCollision(head)) {
      this.gameState.gameOver = true
      this.stop()
      return
    }
    
    this.gameState.snake.unshift(head)
    
    if (head.x === this.gameState.food.x && head.y === this.gameState.food.y) {
      this.gameState.updateScore()
      this.gameState.generateFood()
    } else {
      this.gameState.snake.pop()
    }
    
    if (this.onUpdate) {
      this.onUpdate(this.gameState.getState())
    }
  }

  checkCollision(head) {
    if (!this.gameState.boundaryMode) {
      if (head.x < 0) head.x = GameConfig.GRID_SIZE - 1
      if (head.x >= GameConfig.GRID_SIZE) head.x = 0
      if (head.y < 0) head.y = GameConfig.GRID_SIZE - 1
      if (head.y >= GameConfig.GRID_SIZE) head.y = 0
    }

    if (this.gameState.boundaryMode && (
      head.x < 0 ||
      head.x >= GameConfig.GRID_SIZE ||
      head.y < 0 ||
      head.y >= GameConfig.GRID_SIZE
    )) {
      return true
    }

    return this.gameState.snake.some(segment => 
      segment.x === head.x && segment.y === head.y
    )
  }
}