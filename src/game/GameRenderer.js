// 游戏渲染器类，负责处理画布渲染
import { GameConfig } from './GameConfig'

export class GameRenderer {
  constructor(canvas, config) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.gridSize = config.gridSize
    this.cellSize = config.cellSize
    
    // 从GameConfig获取颜色配置
    this.colors = GameConfig.COLORS
  }

  updateCellSize(newSize) {
    this.cellSize = newSize
  }

  clear() {
    if (!this.ctx) return
    this.ctx.fillStyle = this.colors.background
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawSnake(snake) {
    if (!this.ctx) return
    this.ctx.fillStyle = this.colors.snake
    snake.forEach(segment => {
      this.ctx.fillRect(
        segment.x * this.cellSize,
        segment.y * this.cellSize,
        this.cellSize - 1,
        this.cellSize - 1
      )
    })
  }

  drawFood(food) {
    if (!this.ctx) return
    this.ctx.fillStyle = this.colors.food
    this.ctx.fillRect(
      food.x * this.cellSize,
      food.y * this.cellSize,
      this.cellSize - 1,
      this.cellSize - 1
    )
  }

  render(gameState) {
    this.clear()
    this.drawSnake(gameState.snake)
    this.drawFood(gameState.food)
  }
}