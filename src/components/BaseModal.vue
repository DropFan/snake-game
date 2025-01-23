<script setup>
/**
 * 基础模态框组件
 * 提供通用的模态框结构和样式，包括：
 * - 遮罩层
 * - 内容容器
 * - 基础样式
 * - 关闭事件处理
 */
const props = defineProps({
  // 是否显示模态框
  show: {
    type: Boolean,
    required: true
  },
  // 模态框标题
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <h2 v-if="title" class="modal-title">{{ title }}</h2>
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  width: 22rem;
}

.modal-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.modal-message {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  color: #666;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  margin: 1rem;
  justify-content: center;
}



.modal-button {
  min-width: 100px;
  padding: 0.8rem 1.2rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.modal-button.primary {
  background-color: #4CAF50;
  color: white;
}

.modal-button.primary:hover {
  background-color: #4dae60;
}

.modal-button.secondary {
  background-color: #333;
  color: #eee;
}

.modal-button.secondary:hover {
  background-color: #111;
}

</style>