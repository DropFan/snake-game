// 游戏配置模块，集中管理所有游戏相关的配置参数
export const GameConfig = {
  // 游戏核心配置
  GRID_SIZE: 20,
  GAME_SPEED: 100,
  MIN_GAME_SPEED: 200,  // 最慢速度（毫秒）
  MAX_GAME_SPEED: 50,   // 最快速度（毫秒）
  DIRECTION_COOLDOWN: 100,

  // 画布配置
  MIN_CANVAS_SIZE: 300,
  MAX_CANVAS_SIZE: 600,
  CANVAS_SCALE: 0.9,

  // 初始状态配置
  INITIAL_SNAKE_POSITION: { x: 10, y: 10 },
  INITIAL_DIRECTION: 'right',
  INITIAL_FOOD_POSITION: { x: 5, y: 5 },

  // 游戏分数配置
  SCORE_INCREMENT: 10,

  // 颜色配置
  COLORS: {
    background: '#333',
    snake: '#4CAF50',
    food: '#FF5722'
  }
}