<script setup>
/**
 * 游戏结束弹窗组件
 * 负责展示游戏结束时的相关信息，包括：
 * - 得分显示
 * - 游戏结束原因
 * - 当前游戏设置信息
 * - 重新开始和关闭按钮
 * - 游戏记录保存功能
 */
import { ref } from 'vue'
import { GameStorage } from '../game/GameStorage'
import GameRecord from '../game/GameRecord'
import BaseModal from './BaseModal.vue'
import GameRecordModal from './GameRecordModal.vue'

const playerName = ref('')
const showRecordList = ref(false)

const props = defineProps({
  // 游戏得分
  score: {
    type: Number,
    required: true
  },
  // 游戏结束原因
  gameOverMessage: {
    type: String,
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
  }
})

const emit = defineEmits(['restart', 'close'])

// 保存游戏记录
const saveRecord = () => {
  if (!playerName.value.trim()) {
    alert('请输入玩家名称')
    return
  }
  
  const record = new GameRecord(
    playerName.value,
    props.score,
    props.boundaryMode,
    props.speedPercentage
  )

  if (GameStorage.saveRecord(record)) {
      playerName.value = ''
      alert('游戏记录保存成功！')
  } else {
    alert('游戏记录保存失败，请检查浏览器本地存储空间')
  }
}

// 打开记录列表
const openRecordList = () => {
  showRecordList.value = true
}

// 关闭记录列表
const closeRecordList = () => {
  showRecordList.value = false
}
</script>

<template>
  <BaseModal :show="true" title="游戏结束" @close="$emit('close')">
      <div class="modal-message">分数: <span class="modal-score">{{ score }}</span></div>
      <div class="modal-message">{{ gameOverMessage }}</div>
      <div class="modal-message modal-game-setting">
        {{ boundaryMode ? '边界模式：有边界(撞墙结束)' : '边界模式：无边界(循环穿墙)' }}
        <br>游戏速度：{{ speedPercentage }}%
      </div>
      <div class="save-record">
        <div class="save-form">
          <input
            type="text"
            v-model="playerName"
            placeholder="请输入玩家名称"
            class="player-name-input"
            @keyup.enter="saveRecord"
          >
          <div class="modal-buttons">
            <button class="modal-button save-record" @click="saveRecord">保存记录</button>
            <button class="modal-button view-record" @click="openRecordList">查看记录</button>
          </div>
        </div>
      </div>
      <div class="modal-buttons">
        <button class="modal-button primary" @click="$emit('restart')">重新开始</button>
        <button class="modal-button secondary" @click="$emit('close')">关闭</button>
      </div>
  </BaseModal>

  <GameRecordModal v-if="showRecordList" @close="closeRecordList" />
</template>
<style scoped>
.modal-score {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #e74c3c;
}

.modal-button.save-record, .modal-button.view-record  {
    background-color: #1768c5;
    color: white;
}

.player-name-input {
    width: 12em;
    padding: 10px;
    margin: auto;
    border: 2px solid #1768c5;
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 0.1);
    color: #2980b9;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.player-name-input:focus {
    outline: none;
    border-color: #2980b9;
    box-shadow: 0 0 8px rgba(23, 104, 197, 0.4);
    background-color: rgba(255, 255, 255, 0.15);
}

.player-name-input::placeholder {
    color: rgba(22, 22, 22, 0.6);
}
</style>
