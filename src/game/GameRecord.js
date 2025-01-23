/**
 * 游戏记录类
 * 负责管理游戏记录的数据结构和相关操作
 */
class GameRecord {
  constructor(playerName, score, boundaryMode, speedPercentage, timestamp = Date.now()) {
    this.playerName = playerName
    this.score = score
    this.boundaryMode = boundaryMode
    this.speedPercentage = speedPercentage
    this.timestamp = timestamp
  }

  /**
   * 将游戏记录转换为显示文本
   * @returns {string} 格式化的游戏记录文本
   */
  toDisplayText() {
    const date = new Date(this.timestamp)
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const timeStr = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    const modeStr = this.boundaryMode ? '有边界' : '无边界'
    return `${this.playerName} - ${this.score}分 - ${modeStr}模式 (速度${this.speedPercentage}%) - ${dateStr} ${timeStr}`
  }

  /**
   * 从JSON对象创建游戏记录实例
   * @param {Object} json - JSON对象
   * @returns {GameRecord} 游戏记录实例
   */
  static fromJSON(json) {
    return new GameRecord(
      json.playerName,
      json.score,
      json.boundaryMode,
      json.speedPercentage,
      json.timestamp
    )
  }
}

export default GameRecord