/**
 * 游戏状态管理类
 * 负责管理贪吃蛇游戏的所有状态数据，包括：
 * - 蛇的位置和方向
 * - 食物的位置
 * - 游戏分数
 * - 游戏状态（暂停、结束等）
 * - 边界模式设置
 */
import { GameConfig } from './GameConfig'

export class GameState {
  /**
   * 初始化游戏状态
   * @constructor
   */
  constructor() {
    this.score = 0                                     // 游戏得分
    this.gameOver = false                             // 游戏是否结束
    this.isPaused = false                             // 游戏是否暂停
    this.snake = [GameConfig.INITIAL_SNAKE_POSITION]  // 蛇身体位置数组，第一个元素为蛇头
    this.direction = GameConfig.INITIAL_DIRECTION      // 蛇的移动方向
    this.food = GameConfig.INITIAL_FOOD_POSITION      // 食物位置
    this.boundaryMode = true                          // 边界模式：true为撞墙死亡，false为穿墙
  }

  /**
   * 重置游戏状态
   * 将所有游戏数据恢复到初始状态，用于开始新游戏
   */
  reset() {
    this.score = 0
    this.gameOver = false
    this.isPaused = false
    this.snake = [GameConfig.INITIAL_SNAKE_POSITION]
    this.direction = GameConfig.INITIAL_DIRECTION
    this.generateFood()
  }

  /**
   * 切换游戏暂停状态
   * @returns {boolean} 切换后的暂停状态
   */
  togglePause() {
    this.isPaused = !this.isPaused
    return this.isPaused
  }

  /**
   * 设置边界模式
   * @param {boolean} mode - true为撞墙死亡模式，false为穿墙模式
   */
  setBoundaryMode(mode) {
    this.boundaryMode = mode
  }

  /**
   * 设置游戏结束状态
   * @param {boolean} value - 游戏是否结束
   */
  setGameOver(value) {
    this.gameOver = value
  }

  /**
   * 设置蛇的移动方向
   * 防止蛇直接向反方向移动（例如向右移动时不能直接向左转向）
   * @param {string} newDirection - 新的移动方向（'up'|'down'|'left'|'right'）
   */
  setDirection(newDirection) {
    const oppositeDirections = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left'
    }
    
    if (oppositeDirections[newDirection] !== this.direction) {
      this.direction = newDirection
    }
  }

  /**
   * 更新游戏分数
   * 当蛇吃到食物时增加分数
   */
  updateScore() {
    this.score += GameConfig.SCORE_INCREMENT
  }

  /**
   * 生成新的食物
   * 随机生成一个不在蛇身上的位置作为新的食物位置
   */
  generateFood() {
    let newFood
    do {
      newFood = {
        x: Math.floor(Math.random() * GameConfig.GRID_SIZE),
        y: Math.floor(Math.random() * GameConfig.GRID_SIZE)
      }
    } while (this.snake.some(segment => 
      segment.x === newFood.x && segment.y === newFood.y
    ))
    
    this.food = newFood
  }

  /**
   * 获取当前游戏状态
   * @returns {Object} 包含所有游戏状态数据的对象
   */
  getState() {
    return {
      snake: this.snake,          // 蛇的位置数组
      food: this.food,            // 食物位置
      score: this.score,          // 当前分数
      gameOver: this.gameOver,    // 游戏是否结束
      isPaused: this.isPaused,    // 游戏是否暂停
      direction: this.direction,   // 蛇的移动方向
      boundaryMode: this.boundaryMode  // 边界模式
    }
  }
}