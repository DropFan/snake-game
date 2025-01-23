<script setup>
/**
 * 游戏设置组件
 * 负责管理游戏的各项设置，包括：
 * - 边界模式设置
 * - 游戏速度调节
 * - 音频控制（背景音乐和音效）
 */
import { onMounted, watch } from 'vue'
import { GameStorage } from '../game/GameStorage'

const props = defineProps({
  // 游戏运行状态
  gameRunning: {
    type: Boolean,
    required: true
  },
  // 边界模式
  boundaryMode: {
    type: Boolean,
    required: true
  },
  // 游戏速度百分比
  speedPercentage: {
    type: Number,
    required: true
  },
  // 背景音乐开关状态
  bgMusicEnabled: {
    type: Boolean,
    required: true
  },
  // 音效开关状态
  soundEffectsEnabled: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits([
  'update:boundaryMode',
  'update:speedPercentage',
  'update:bgMusicEnabled',
  'update:soundEffectsEnabled',
  'speedChange'
])

/**
 * 更新游戏速度
 * @param {Event} event - 输入事件
 */
const handleSpeedChange = (event) => {
  const value = Number(event.target.value)
  emit('update:speedPercentage', value)
  emit('speedChange', value)
  saveSettings()
}

// 保存所有游戏设置到本地存储
const saveSettings = () => {
  const settings = {
    boundaryMode: props.boundaryMode,
    speedPercentage: props.speedPercentage,
    bgMusicEnabled: props.bgMusicEnabled,
    soundEffectsEnabled: props.soundEffectsEnabled
  }
  GameStorage.saveSettings(settings)
}

// 监听所有设置的变更
watch(() => props.boundaryMode, () => saveSettings())
watch(() => props.bgMusicEnabled, () => saveSettings())
watch(() => props.soundEffectsEnabled, () => saveSettings())

// 组件挂载时加载保存的设置
onMounted(() => {
  const savedSettings = GameStorage.loadSettings()
  if (savedSettings) {
    emit('update:boundaryMode', savedSettings.boundaryMode)
    emit('update:speedPercentage', savedSettings.speedPercentage)
    emit('update:bgMusicEnabled', savedSettings.bgMusicEnabled)
    emit('update:soundEffectsEnabled', savedSettings.soundEffectsEnabled)
    emit('speedChange', savedSettings.speedPercentage)
  }
});

</script>

<template>
  <div class="settings-panel">
    <div class="settings-section">
      <h3>游戏设置</h3>
      <label class="setting-item">
        <input
          type="checkbox"
          :checked="boundaryMode"
          @change="$emit('update:boundaryMode', $event.target.checked)"
          :disabled="gameRunning"
        >
        <span class="setting-text">启用边界模式（撞墙结束游戏）</span>
      </label>
      <div class="setting-item speed-setting">
        <span class="setting-text">游戏速度</span>
        <input
          type="range"
          :value="speedPercentage"
          :min="0"
          :max="100"
          :step="1"
          @input="handleSpeedChange"
          :disabled="gameRunning"
        >
        <span class="speed-value">{{ speedPercentage }}%</span>
      </div>
    </div>

    <div class="settings-section">
      <h3>音频设置</h3>
      <label class="setting-item">
        <input
          type="checkbox"
          :checked="bgMusicEnabled"
          @change="$emit('update:bgMusicEnabled', $event.target.checked)"
        >
        <span class="setting-text">🔊 背景音乐</span>
      </label>
      <label class="setting-item">
        <input
          type="checkbox"
          :checked="soundEffectsEnabled"
          @change="$emit('update:soundEffectsEnabled', $event.target.checked)"
        >
        <span class="setting-text">🔊 音效</span>
      </label>
    </div>
  </div>
</template>


<style scoped>
@import '../styles/settings.css';
</style>