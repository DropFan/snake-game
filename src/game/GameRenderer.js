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

    // 添加舌头动画相关属性
    this.tongueAnimationFrame = 0
    this.tongueAnimationSpeed = 0.1
    this.maxTongueExtension = 1.2
    this.lastAnimationTimestamp = 0
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
    
    // 绘制蛇身
    snake.forEach((segment, index) => {
      // 绘制略小于单元格的方块，留出间隙以区分各个段落
      this.ctx.fillRect(
        segment.x * this.cellSize,
        segment.y * this.cellSize,
        this.cellSize - 1,
        this.cellSize - 1
      )

      // 绘制蛇头（蛇头是数组的第一个元素）
      if (index === 0 && snake.length > 1) {
        this.drawSnakeHead(segment, snake[1])
      }
    })
  }

  /**
   * 绘制蛇头
   * 为蛇头添加眼睛和舌头
   * @param {{x: number, y: number}} head - 蛇头坐标
   * @param {{x: number, y: number}} neck - 蛇颈坐标
   * @returns {void}
   */
  drawSnakeHead(head, neck) {
    if (!this.ctx) return
    
    // 更新动画时间
    const now = performance.now()
    const deltaTime = now - this.lastAnimationTimestamp
    this.lastAnimationTimestamp = now
    this.tongueAnimationFrame += this.tongueAnimationSpeed * deltaTime / 16.67 // 60fps基准
    
    // 计算眼睛大小的动画效果
    const baseEyeRadius = this.cellSize / 8
    const eyeScale = Math.sin(this.tongueAnimationFrame) * 0.2 + 1.2 // 在1.0到1.4之间变化
    const eyeRadius = baseEyeRadius * eyeScale
    const eyeOffset = this.cellSize / 4
    
    // 根据蛇头和蛇颈的位置确定方向
    let direction
    if (head.x > neck.x) direction = 'right'
    else if (head.x < neck.x) direction = 'left'
    else if (head.y > neck.y) direction = 'down'
    else direction = 'up'

    // 设置眼睛位置
    let leftEye = { x: 0, y: 0 }
    let rightEye = { x: 0, y: 0 }
    const centerX = head.x * this.cellSize + this.cellSize / 2
    const centerY = head.y * this.cellSize + this.cellSize / 2

    switch (direction) {
      case 'right':
        leftEye = { x: centerX + eyeOffset, y: centerY - eyeOffset }
        rightEye = { x: centerX + eyeOffset, y: centerY + eyeOffset }
        break
      case 'left':
        leftEye = { x: centerX - eyeOffset, y: centerY - eyeOffset }
        rightEye = { x: centerX - eyeOffset, y: centerY + eyeOffset }
        break
      case 'up':
        leftEye = { x: centerX - eyeOffset, y: centerY - eyeOffset }
        rightEye = { x: centerX + eyeOffset, y: centerY - eyeOffset }
        break
      case 'down':
        leftEye = { x: centerX - eyeOffset, y: centerY + eyeOffset }
        rightEye = { x: centerX + eyeOffset, y: centerY + eyeOffset }
        break
    }

    // 绘制眼睛
    this.ctx.fillStyle = '#FFFFFF'
    this.ctx.beginPath()
    this.ctx.arc(leftEye.x, leftEye.y, eyeRadius, 0, Math.PI * 2)
    this.ctx.arc(rightEye.x, rightEye.y, eyeRadius, 0, Math.PI * 2)
    this.ctx.fill()

    // 计算舌头伸缩的动画效果
    const tongueExtension = Math.sin(this.tongueAnimationFrame) * 0.2 + 1 // 在0.8到1.2之间变化

    // 绘制舌头
    const tongueWidth = this.cellSize * 0.1 // 舌头的宽度
    const baseTongueLength = this.cellSize * 0.4 // 减小舌头的基础长度
    const tongueLength = baseTongueLength * (Math.sin(this.tongueAnimationFrame) * 0.5 + 1) // 增加伸缩幅度
    const forkLength = tongueLength * 0.3 // 分叉部分的长度
    const forkAngle = Math.PI / 6 // 分叉的角度

    // 根据方向计算舌头的起点和控制点
    let startX = centerX
    let startY = centerY
    let endX = centerX
    let endY = centerY
    let controlX = centerX
    let controlY = centerY

    switch (direction) {
      case 'right':
        startX = centerX + this.cellSize * 0.3
        endX = startX + tongueLength
        controlX = startX + tongueLength * 0.6
        break
      case 'left':
        startX = centerX - this.cellSize * 0.3
        endX = startX - tongueLength
        controlX = startX - tongueLength * 0.6
        break
      case 'up':
        startY = centerY - this.cellSize * 0.3
        endY = startY - tongueLength
        controlY = startY - tongueLength * 0.6
        break
      case 'down':
        startY = centerY + this.cellSize * 0.3
        endY = startY + tongueLength
        controlY = startY + tongueLength * 0.6
        break
    }

    // 绘制舌头主干
    this.ctx.fillStyle = '#f44336'
    this.ctx.beginPath()
    this.ctx.moveTo(startX, startY)

    // 计算分叉点
    const forkStartX = (endX + controlX) / 2
    const forkStartY = (endY + controlY) / 2

    // 计算分叉的两个端点
    let angle = 0
    switch (direction) {
      case 'right': angle = 0; break
      case 'left': angle = Math.PI; break
      case 'up': angle = -Math.PI/2; break
      case 'down': angle = Math.PI/2; break
    }

    const fork1EndX = forkStartX + Math.cos(angle - forkAngle) * forkLength
    const fork1EndY = forkStartY + Math.sin(angle - forkAngle) * forkLength
    const fork2EndX = forkStartX + Math.cos(angle + forkAngle) * forkLength
    const fork2EndY = forkStartY + Math.sin(angle + forkAngle) * forkLength

    // 绘制分叉
    this.ctx.quadraticCurveTo(controlX, controlY, forkStartX, forkStartY)
    this.ctx.lineTo(fork1EndX, fork1EndY)
    this.ctx.moveTo(forkStartX, forkStartY)
    this.ctx.lineTo(fork2EndX, fork2EndY)

    this.ctx.lineWidth = tongueWidth
    this.ctx.strokeStyle = '#f44336'
    this.ctx.stroke()

    // 恢复默认填充颜色
    this.ctx.fillStyle = this.colors.snake
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