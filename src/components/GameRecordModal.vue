<script setup>
/**
 * 游戏记录列表模态框组件
 * 负责展示历史游戏记录，支持按时间排序和记录删除
 */
import { ref, onMounted } from 'vue'
import { GameStorage } from '../game/GameStorage'
import BaseModal from './BaseModal.vue'

defineOptions({
  name: 'GameRecordModal'
})

const records = ref([])

// 加载游戏记录
const loadRecords = () => {
  records.value = GameStorage.loadRecords()
  // 按时间倒序排序
  records.value.sort((a, b) => b.timestamp - a.timestamp)
}

// 清除所有记录
const clearAllRecords = () => {
  if (confirm('确定要清除所有游戏记录吗？')) {
    GameStorage.clearRecords()
    records.value = []
  }
}

// 组件挂载时加载记录
onMounted(() => {
  loadRecords()
})

// 格式化日期时间
const formatDateTime = (timestamp) => {
  const date = new Date(timestamp)
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  const timeStr = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  return `${dateStr} ${timeStr}`
}
</script>

<template>
  <BaseModal :show="true" title="游戏记录" @close="$emit('close')">
    <div class="records-panel">
      <div class="modal-message">
        注：当前只有本地保存的游戏记录
      </div>
      <div class="records-content" v-if="records.length > 0">
        <table class="records-table">
          <thead>
            <tr>
              <th>玩家</th>
              <th>得分</th>
              <th>游戏模式</th>
              <th>游戏速度</th>
              <th>时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in records" :key="record.timestamp">
              <td>{{ record.playerName }}</td>
              <td>{{ record.score }}</td>
              <td>{{ record.boundaryMode ? '有边界' : '无边界' }}</td>
              <td>{{ record.speedPercentage }}%</td>
              <td>{{ formatDateTime(record.timestamp) }}</td>
            </tr>
          </tbody>
        </table>
    </div>
    <div v-else class="no-records">
      暂无游戏记录
    </div>
    <div class="modal-buttons">
      <button v-if="records.length > 0" class="modal-button clear-button" @click="clearAllRecords">
          清除记录
      </button>
      <button class="modal-button secondary" @click="$emit('close')">关闭</button>
    </div>
  </div>
  </BaseModal>
</template>

<style scoped>
.records-panel {
  margin: 0px auto;
  padding: 5px;
  background: transparent;
}

.records-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* border-bottom: 1px solid rgba(255, 255, 255, 0.1); */
}

.records-header h3 {
  margin: 0;
  color: #fff;
  font-size: 1.2em;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.clear-button {
  padding: 5px 10px;
  background: linear-gradient(to bottom right, #ff4757, #ff6b81);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.clear-button:hover {
  background: linear-gradient(to bottom right, #ff6b81, #ff8fa3);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.no-records {
  text-align: center;
  color: rgba(25, 25, 25, 0.5);
  padding: 2rem;
  font-style: italic;
}
.records-content {
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;
}

.records-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(40, 44, 52, 0.95);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.records-table th,
.records-table td {
  min-width: 4em;
  padding: 0.4rem 0.4rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.records-table th {
  background: rgba(61, 90, 254, 0.2);
  color: rgba(255, 255, 255, 0.95);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9em;
  letter-spacing: 0.05em;
  position: sticky;
  top: 0;
  z-index: 1;
}

.records-table tr:nth-child(even) {
  background: rgba(255, 255, 255, 0.05);
}

.records-table tr:hover {
  background: rgba(61, 90, 254, 0.1);
}

.records-table td {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95em;
}

</style>