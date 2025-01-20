// 游戏状态管理模块，负责管理游戏的所有状态
import { GameConfig } from './GameConfig'

export class GameState {
  constructor() {
    this.score = 0
    this.gameOver = false
    this.isPaused = false
    this.snake = [GameConfig.INITIAL_SNAKE_POSITION]
    this.direction = GameConfig.INITIAL_DIRECTION
    this.food = GameConfig.INITIAL_FOOD_POSITION
    this.boundaryMode = true
  }

  reset() {
    this.score = 0
    this.gameOver = false
    this.isPaused = false
    this.snake = [GameConfig.INITIAL_SNAKE_POSITION]
    this.direction = GameConfig.INITIAL_DIRECTION
    this.generateFood()
  }

  togglePause() {
    this.isPaused = !this.isPaused
    return this.isPaused
  }

  setBoundaryMode(mode) {
    this.boundaryMode = mode
  }

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

  updateScore() {
    this.score += GameConfig.SCORE_INCREMENT
  }

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

  getState() {
    return {
      snake: this.snake,
      food: this.food,
      score: this.score,
      gameOver: this.gameOver,
      isPaused: this.isPaused,
      direction: this.direction,
      boundaryMode: this.boundaryMode
    }
  }
}