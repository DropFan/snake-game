/**
 * 游戏控制器类
 * 负责处理键盘和触摸事件，实现游戏的方向控制和暂停功能
 * 支持键盘箭头键和触摸屏滑动操作
 */
export class GameController {
  /**
   * 创建游戏控制器实例
   * @param {Object} config - 控制器配置对象
   * @param {number} [config.directionCooldown=100] - 方向改变的冷却时间（毫秒）
   */
  constructor(config) {
    this.directionCooldown = config.directionCooldown || 100
    this.lastDirectionChange = 0
    this.onDirectionChange = null
    this.onPause = null
    
    this.touchStartX = 0
    this.touchStartY = 0
    
    // 绑定方法到实例
    this.handleKeydown = this.handleKeydown.bind(this)
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
  }

  /**
   * 初始化控制器
   * 绑定键盘和触摸事件监听器
   */
  init() {
    window.addEventListener('keydown', this.handleKeydown)
    window.addEventListener('touchstart', this.handleTouchStart)
    window.addEventListener('touchmove', this.handleTouchMove)
  }

  /**
   * 销毁控制器
   * 移除所有事件监听器
   */
  destroy() {
    window.removeEventListener('keydown', this.handleKeydown)
    window.removeEventListener('touchstart', this.handleTouchStart)
    window.removeEventListener('touchmove', this.handleTouchMove)
  }

  /**
   * 处理键盘按键事件
   * 支持方向键控制和空格键暂停
   * @param {KeyboardEvent} e - 键盘事件对象
   */
  handleKeydown(e) {
    const now = Date.now()
    if (now - this.lastDirectionChange < this.directionCooldown) return

    let newDirection = null

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        newDirection = 'up'
        break
      case 'ArrowDown':
        e.preventDefault()
        newDirection = 'down'
        break
      case 'ArrowLeft':
        e.preventDefault()
        newDirection = 'left'
        break
      case 'ArrowRight':
        e.preventDefault()
        newDirection = 'right'
        break
      case ' ':
        e.preventDefault()
        if (this.onPause) this.onPause()
        break
    }

    if (newDirection && this.onDirectionChange) {
      this.onDirectionChange(newDirection)
      this.lastDirectionChange = now
    }
  }

  /**
   * 处理触摸开始事件
   * 记录触摸起始坐标
   * @param {TouchEvent} e - 触摸事件对象
   */
  handleTouchStart(e) {
    e.preventDefault()
    this.touchStartX = e.touches[0].clientX
    this.touchStartY = e.touches[0].clientY
  }

  /**
   * 处理触摸移动事件
   * 根据滑动方向改变蛇的移动方向
   * @param {TouchEvent} e - 触摸事件对象
   */
  handleTouchMove(e) {
    e.preventDefault()
    
    const now = Date.now()
    if (now - this.lastDirectionChange < this.directionCooldown) return

    const touchEndX = e.touches[0].clientX
    const touchEndY = e.touches[0].clientY

    const deltaX = touchEndX - this.touchStartX
    const deltaY = touchEndY - this.touchStartY

    let newDirection = null

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 水平滑动
      newDirection = deltaX > 0 ? 'right' : 'left'
    } else {
      // 垂直滑动
      newDirection = deltaY > 0 ? 'down' : 'up'
    }

    if (newDirection && this.onDirectionChange) {
      this.onDirectionChange(newDirection)
      this.lastDirectionChange = now
    }

    this.touchStartX = touchEndX
    this.touchStartY = touchEndY
  }
}