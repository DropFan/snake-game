# Snake-game
<div class="app-desc" style="text-align:center" align="center">
    <a href="https://snake-game.v2dl.net/?from=github-readme" target="_blank"><img src="./snake.png" width=128 height=128 alt="贪吃蛇 By Tiger https://github.com/DropFan" /></a>
    <h1>贪吃蛇</h1>
    <p>一个使用现代 Web 前端技术开发的经典贪吃蛇游戏。</p>
    <p>支持键盘和触摸控制，支持不同游戏模式和设置，支持背景音乐和游戏音效。</p>
    <p>这是一个现代化的 Web 游戏实现，采用响应式设计，可以在各种设备上流畅运行。</p>
    <p>由 <a href="https://github.com/DropFan">Tiger</a> 开发并开源至<a href="https://github.com/DropFan/snake-game/">Github</a></p>
</div>

## 功能特点

- 流畅的游戏体验和现代化的界面设计
- 响应式设计，完美适配各种屏幕尺寸
- 支持键盘方向键和触摸滑动控制
- 实时得分显示和游戏状态反馈
- 暂停/继续功能
- 可选的边界模式（撞墙结束）和无边界模式（穿墙）
- 游戏速度调节（0-100%可调）
- 完整的音频系统，支持背景音乐和音效控制
- 游戏结束弹窗显示最终得分和结束原因
- 游戏设置本地存储功能
- 游戏记录保存与历史排名

## 游戏玩法

### 键盘控制
- ↑ 向上移动
- ↓ 向下移动
- ← 向左移动
- → 向右移动
- 空格键 暂停/继续
- Esc 键 结束游戏

### 触摸控制
- 向上滑动 - 向上移动
- 向下滑动 - 向下移动
- 向左滑动 - 向左移动
- 向右滑动 - 向右移动

### 游戏设置
- 边界模式：可选择撞墙结束或穿墙模式
- 游戏速度：滑动条调节，范围0-100%
- 音频控制：可分别开关背景音乐和音效
- 设置自动保存：游戏设置会自动保存到本地存储

## 开发者指南

### 技术栈

- Vue 3 - 现代化的响应式框架
- Vite - 下一代前端构建工具
- Canvas API - 高性能的图形渲染
- Web Audio API - 音频处理
- Local Storage API - 本地数据存储

### 安装步骤

1. 克隆项目到本地：
   ```bash
   git clone https://github.com/DropFan/web-snake-game.git
   cd web-snake-game
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

4. 构建生产版本：
   ```bash
   npm run build
   ```

## 项目结构

```
src/
├── App.vue         # App 主程序
├── game/           # 游戏核心逻辑
│   ├── GameEngine.js    # 游戏引擎
│   ├── GameState.js     # 游戏状态管理
│   ├── GameController.js # 输入控制
│   ├── GameRenderer.js  # 画布渲染
│   ├── GameConfig.js    # 游戏配置
│   ├── GameStorage.js   # 本地存储管理
│   ├── GameRecord.js    # 游戏记录管理
│   └── AudioManager.js  # 音频管理
├── components/     # Vue组件
│   ├── GameTitle.vue    # 游戏标题组件
│   ├── GameSettings.vue # 游戏设置组件
│   ├── GameInstructions.vue # 游戏说明组件
│   ├── GameOverModal.vue    # 游戏结束弹窗
│   ├── GameRecordModal.vue  # 游戏记录弹窗
│   └── BaseModal.vue        # 基础弹窗组件
├── styles/         # CSS样式文件
│   ├── game.css        # 游戏主样式
│   ├── controls.css    # 控制面板样式
│   ├── modal.css       # 弹窗样式
│   ├── settings.css    # 设置面板样式
│   └── instructions.css # 说明样式
├── assets/         # 静态资源
public/
└── sounds/        # 音频资源
    ├── background.mp3  # 背景音乐
    ├── eat.mp3         # 吃食物音效
    └── gameover.mp3    # 游戏结束音效
```

## 核心功能实现

### 游戏引擎 (GameEngine)
- 游戏循环控制
- 碰撞检测
- 食物生成
- 分数计算
- 游戏结束判定

### 状态管理 (GameState)
- 蛇的位置和方向
- 食物位置
- 游戏分数
- 暂停/结束状态
- 游戏结束原因记录

### 输入控制 (GameController)
- 键盘事件处理
- 触摸事件处理
- 方向控制逻辑

### 渲染模块 (GameRenderer)
- Canvas渲染
- 响应式布局
- 动画效果

### 音频模块 (AudioManager)
- Web Audio API集成
- 背景音乐控制
- 音效管理
- 音频状态持久化

### 存储模块 (GameStorage)
- 游戏设置本地存储
- 设置自动加载
- 数据持久化处理

### 记录模块 (GameRecord)
- 游戏记录保存
- 历史记录查看
- 最高分排行榜
- 记录数据持久化

## 贡献

欢迎提交问题和改进建议！如果您想为项目做出贡献，请：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详细信息

