/**
 * 音频管理类 - 负责处理游戏中的所有音频效果
 *
 * 使用单例模式确保全局只有一个音频管理实例
 * 实现了背景音乐和音效的加载、播放、暂停等功能
 * 支持音频的开关控制，包括全局静音、背景音乐开关和音效开关
 */
export class AudioManager {
  /** @type {AudioManager} 单例实例 */
  static instance = null;
  /** @type {AudioContext} Web Audio API的音频上下文 */
  static audioContext = null;
  /** @type {Map<string, AudioBuffer>} 存储已加载的音频buffer */
  static sounds = new Map();
  /** @type {boolean} 标记音频资源是否正在加载中 */
  static isLoading = false;
  /** @type {boolean} 标记音频管理器是否已初始化 */
  static isInitialized = false;

  /** 音频设置相关项 */
  /** @type {boolean} 全局静音开关*/
  static isMuted = false;
  /** @type {boolean} 背景音乐开关 */
  static bgMusicEnabled = true;
  /** @type {boolean} 音效开关 */
  static soundEffectsEnabled= true;

  /**
   * 获取AudioManager的单例实例
   * @returns {AudioManager} AudioManager的单例实例
   */
  static getInstance() {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }
  /**
   * 构造函数 - 初始化音频管理器
   * 如果实例已存在则返回已有实例（单例模式）
   * 否则初始化音频上下文和加载音频资源
   */
  constructor(settings = {
    isMuted: false,
    bgMusicEnabled: true,
    soundEffectsEnabled: true
  }) {
    if (AudioManager.instance) {
      return AudioManager.instance;
    }

    this.bgMusic = null;
    this.isMuted = settings.isMuted;
    this.bgMusicEnabled = settings.bgMusicEnabled;
    this.soundEffectsEnabled = settings.soundEffectsEnabled;

    if (!AudioManager.isInitialized) {
      this.initAudioContext();
      this.loadSounds();
      AudioManager.isInitialized = true;
    }
  }

  /**
   * 初始化Web Audio API的音频上下文
   * 处理浏览器兼容性，并确保在用户交互后恢复音频播放
   * @private
   */
  initAudioContext() {
    if (AudioManager.audioContext) return;

    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      AudioManager.audioContext = new AudioContext();
      AudioManager.audioContext.resume().catch(console.error);

      // 如果AudioContext处于suspended状态，等待用户交互时恢复
      if (AudioManager.audioContext.state === 'suspended') {
        const resumeAudioContext = () => {
          AudioManager.audioContext.resume();
          document.removeEventListener('click', resumeAudioContext);
          document.removeEventListener('keydown', resumeAudioContext);
          document.removeEventListener('touchstart', resumeAudioContext);
        };

        document.addEventListener('click', resumeAudioContext);
        document.addEventListener('keydown', resumeAudioContext);
        document.addEventListener('touchstart', resumeAudioContext);
      }
    } catch (e) {
      console.warn('Web Audio API不受支持');
    }
  }

  /**
   * 加载所有音频资源
   * 使用fetch API异步加载音频文件，并解码为AudioBuffer
   * @private
   * @async
   */
  async loadSounds() {
    if (AudioManager.sounds.size > 0 || AudioManager.isLoading) return;

    AudioManager.isLoading = true;
    try {
      const soundFiles = {
        background: './sounds/background.mp3',
        eat: './sounds/eat.mp3',
        gameOver: './sounds/gameover.mp3'
      };

      const loadAudio = async (url) => {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return await AudioManager.audioContext.decodeAudioData(arrayBuffer);
      };

      for (const [name, path] of Object.entries(soundFiles)) {
        try {
          const buffer = await loadAudio(path);
          AudioManager.sounds.set(name, buffer);
          console.debug(`音频文件 ${name} 加载成功`);
        } catch (error) {
          console.error(`加载音频文件 ${name} 失败:`, error);
        }
      }
    } catch (error) {
      console.error('加载音频资源失败:', error);
    } finally {
      AudioManager.isLoading = false;
    }
  }

  /**
   * 播放指定的音效
   * @param {string} name - 要播放的音效名称
   */
  playSound(name) {
    if (!AudioManager.audioContext || !this.soundEffectsEnabled || this.isMuted || AudioManager.isLoading) return;

    const buffer = AudioManager.sounds.get(name);
    if (buffer) {
      const source = AudioManager.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(AudioManager.audioContext.destination);
      source.start(0);
    }
  }

  /**
   * 播放背景音乐
   * 创建一个循环播放的音频源
   */
  playBackgroundMusic() {
    if (!AudioManager.audioContext || !this.bgMusicEnabled || this.isMuted || AudioManager.isLoading) return;

    const buffer = AudioManager.sounds.get('background');
    if (buffer && !this.bgMusic) {
      this.bgMusic = AudioManager.audioContext.createBufferSource();
      this.bgMusic.buffer = buffer;
      this.bgMusic.loop = true;
      this.bgMusic.connect(AudioManager.audioContext.destination);
      this.bgMusic.start(0);
    }
  }

  /**
   * 停止背景音乐播放
   */
  stopBackgroundMusic() {
    if (this.bgMusic) {
      this.bgMusic.stop();
      this.bgMusic = null;
    }
  }

  /**
   * 切换全局静音状态
   * @returns {boolean} 当前的静音状态
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBackgroundMusic();
    } else if (this.bgMusicEnabled) {
      this.playBackgroundMusic();
    }
    return this.isMuted;
  }

  /**
   * 切换背景音乐的启用状态
   * @returns {boolean} 当前背景音乐的启用状态
   */
  toggleBackgroundMusic() {
    this.bgMusicEnabled = !this.bgMusicEnabled;
    if (!this.bgMusicEnabled) {
      this.stopBackgroundMusic();
    } else if (!this.isMuted) {
      this.playBackgroundMusic();
    }
    return this.bgMusicEnabled;
  }

  /**
   * 切换音效的启用状态
   * @returns {boolean} 当前音效的启用状态
   */
  toggleSoundEffects() {
    this.soundEffectsEnabled = !this.soundEffectsEnabled;
    return this.soundEffectsEnabled;
  }
}

AudioManager.getInstance();