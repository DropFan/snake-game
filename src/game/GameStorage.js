/**
 * 游戏存储管理类
 * 负责管理游戏配置的本地存储，包括：
 * - 边界模式设置
 * - 游戏速度
 * - 音频设置
 */
import GameRecord from './GameRecord'

export class GameStorage {
  static STORAGE_KEY_SETTINGS = 'snake_game_settings'
  static STORAGE_KEY_RECORDS = 'snake_game_records'

  /**
   * 保存游戏设置到本地存储
   * @param {Object} settings - 游戏设置对象
   * @param {boolean} settings.boundaryMode - 边界模式
   * @param {number} settings.speedPercentage - 游戏速度百分比
   * @param {boolean} settings.bgMusicEnabled - 背景音乐开关
   * @param {boolean} settings.soundEffectsEnabled - 音效开关
   * @returns {boolean} 是否保存成功
   */
  static saveSettings(settings) {
    try {
      localStorage.setItem(this.STORAGE_KEY_SETTINGS, JSON.stringify(settings))
      return true
    } catch (error) {
      console.error('保存游戏设置失败:', error)
      return false
    }
  }

  /**
   * 从本地存储加载游戏设置
   * @returns {Object|null} 游戏设置对象，如果没有保存过设置则返回null
   */
  static loadSettings() {
    try {
      const settings = localStorage.getItem(this.STORAGE_KEY_SETTINGS)
      return settings ? JSON.parse(settings) : null
    } catch (error) {
      console.error('加载游戏设置失败:', error)
      return null
    }
  }

  /**
   * 清除保存的游戏设置
   */
  static clearSettings() {
    try {
      localStorage.removeItem(this.STORAGE_KEY_SETTINGS)
    } catch (error) {
      console.error('清除游戏设置失败:', error)
    }
  }

  /**
   * 保存游戏记录
   * @param {GameRecord} record - 游戏记录对象
   * @returns {boolean} 是否保存成功
   */
  static saveRecord(record) {
    try {
      let records = this.loadRecords()
      records.push(record)
      localStorage.setItem(this.STORAGE_KEY_RECORDS, JSON.stringify(records))
      console.log('保存游戏记录:', records)
      return true
    } catch (error) {
      console.error('保存游戏记录失败:', error)
      return false
    }
  }

  /**
   * 加载所有游戏记录
   * @returns {Array<GameRecord>} 游戏记录数组
   */
  static loadRecords() {
    try {
      const records = localStorage.getItem(this.STORAGE_KEY_RECORDS)
      let result = records ? JSON.parse(records).map(record => GameRecord.fromJSON(record)) : []
      console.log('加载游戏记录:', result)
      return result
    } catch (error) {
      console.error('加载游戏记录失败:', error)
      return []
    }
  }

  /**
   * 清除所有游戏记录
   */
  static clearRecords() {
    try {
      localStorage.removeItem(this.STORAGE_KEY_RECORDS)
    } catch (error) {
      console.error('清除游戏记录失败:', error)
    }
  }
}