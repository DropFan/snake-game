/**
 * 游戏渲染器类
 * 负责处理游戏画布的渲染，包括蛇身、食物的绘制以及画布的清理
 * 使用HTML5 Canvas API进行2D渲染
 */
import { GameConfig } from './GameConfig'

export class GameRenderer {
  /**
   * 创建游戏渲染器实例
   * @param {HTMLCanvasElement} canvas - 游戏画布元素
   * @param {Object} config - 渲染配置对象
   * @param {number} config.gridSize - 游戏网格大小
   * @param {number} config.cellSize - 单个网格单元的像素大小
   */
  constructor(canvas, config) {
    this.canvas = canvas
    // 获取2D渲染上下文
    this.ctx = canvas.getContext('2d')
    this.gridSize = config.gridSize
    this.cellSize = config.cellSize
    
    // 从GameConfig获取颜色配置
    this.colors = GameConfig.COLORS
  }

  /**
   * 更新网格单元的大小
   * @param {number} newSize - 新的网格单元像素大小
   */
  updateCellSize(newSize) {
    this.cellSize = newSize
  }

  /**
   * 清空画布
   * 使用背景色填充整个画布区域
   */
  clear() {
    if (!this.ctx) return
    this.ctx.fillStyle = this.colors.background
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  /**
   * 绘制蛇身
   * 将蛇的每个身体段落绘制为方块
   * @param {Array<{x: number, y: number}>} snake - 蛇身体段落的坐标数组
   */
  drawSnake(snake) {
    if (!this.ctx) return
    this.ctx.fillStyle = this.colors.snake
    snake.forEach(segment => {
      // 绘制略小于单元格的方块，留出间隙以区分各个段落
      this.ctx.fillRect(
        segment.x * this.cellSize,
        segment.y * this.cellSize,
        this.cellSize - 1,
        this.cellSize - 1
      )
    })
  }

  /**
   * 绘制食物
   * 在指定位置绘制食物方块
   * @param {{x: number, y: number}} food - 食物的坐标
   */
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

  /**
   * 渲染游戏状态
   * 按顺序执行：清空画布、绘制蛇身、绘制食物
   * @param {Object} gameState - 当前游戏状态
   * @param {Array<{x: number, y: number}>} gameState.snake - 蛇身坐标数组
   * @param {{x: number, y: number}} gameState.food - 食物坐标
   */
  render(gameState) {
    this.clear()
    this.drawSnake(gameState.snake)
    this.drawFood(gameState.food)
  }
}