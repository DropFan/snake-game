/**
 * 游戏存储管理类
 * 负责管理游戏配置的本地存储，包括：
 * - 边界模式设置
 * - 游戏速度
 * - 音频设置
 */
export class GameStorage {
  static STORAGE_KEY_SETTINGS = 'snake_game_settings'

  /**
   * 保存游戏设置到本地存储
   * @param {Object} settings - 游戏设置对象
   * @param {boolean} settings.boundaryMode - 边界模式
   * @param {number} settings.speedPercentage - 游戏速度百分比
   * @param {boolean} settings.bgMusicEnabled - 背景音乐开关
   * @param {boolean} settings.soundEffectsEnabled - 音效开关
   */
  static saveSettings(settings) {
    try {
      localStorage.setItem(this.STORAGE_KEY_SETTINGS, JSON.stringify(settings))
    } catch (error) {
      console.error('保存游戏设置失败:', error)
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
}