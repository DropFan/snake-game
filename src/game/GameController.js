// 游戏控制器类，负责处理键盘和触摸事件
export class GameController {
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

  init() {
    window.addEventListener('keydown', this.handleKeydown)
    window.addEventListener('touchstart', this.handleTouchStart)
    window.addEventListener('touchmove', this.handleTouchMove)
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKeydown)
    window.removeEventListener('touchstart', this.handleTouchStart)
    window.removeEventListener('touchmove', this.handleTouchMove)
  }

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

  handleTouchStart(e) {
    e.preventDefault()
    this.touchStartX = e.touches[0].clientX
    this.touchStartY = e.touches[0].clientY
  }

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