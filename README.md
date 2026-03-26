# 个人知识管理系统

基于 React + TypeScript + OpenSpec 规范驱动开发的知识管理应用。

## 功能特性

- ✅ **笔记管理** - 创建、编辑、删除 Markdown 笔记
- ✅ **实时预览** - Markdown 编辑与预览切换
- ✅ **标签系统** - 为笔记添加标签，按标签筛选
- ✅ **全文搜索** - 标题和内容搜索
- ✅ **自动保存** - 1秒延迟自动保存
- ✅ **暗黑模式** - 支持亮色/暗色主题
- ✅ **数据持久化** - LocalStorage 本地存储
- ✅ **代码高亮** - 支持多种编程语言

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (状态管理)
- react-markdown + remark-gfm
- Prism.js (代码高亮)
- date-fns (日期格式化)
- Lucide React (图标)

## 项目结构

```
src/
├── components/          # 组件
│   ├── Sidebar.tsx      # 侧边栏（文件夹、标签）
│   ├── NoteList.tsx     # 笔记列表
│   ├── NoteEditor.tsx   # 笔记编辑器
│   └── SearchBar.tsx    # 搜索栏
├── stores/              # 状态管理
│   └── noteStore.ts     # 笔记状态
├── types/               # TypeScript 类型
│   └── index.ts         # 类型定义
├── App.tsx              # 主应用
├── main.tsx             # 入口
└── App.css              # 样式
```

## 开发规范

本项目使用 OpenSpec 进行规范驱动开发：

```bash
# 查看变更状态
openspec list

# 验证规范
openspec validate knowledge-base

# 归档变更
openspec archive knowledge-base
```

## 使用方法

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 预览
npm run preview
```

## 界面说明

- **左侧边栏**：文件夹列表、标签云、回收站
- **中间栏**：笔记列表、搜索、筛选
- **右侧**：Markdown 编辑器、实时预览

## 快捷键

- `Ctrl/Cmd + N` - 新建笔记
- `Ctrl/Cmd + S` - 手动保存
- `Ctrl/Cmd + F` - 搜索

## 数据导入/导出

数据存储在浏览器 LocalStorage 中，可通过以下方式备份：

```javascript
// 导出
const data = localStorage.getItem('knowledge-base-storage');

// 导入
localStorage.setItem('knowledge-base-storage', data);
```

## 许可证

MIT
