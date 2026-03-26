# 个人知识管理系统 (Personal Knowledge Base)

## 概述
创建一个功能完善的个人知识管理系统，帮助用户收集、整理、检索知识内容。支持 Markdown 编辑、标签分类、全文搜索等功能。

## 目标
- 建立个人知识库，沉淀学习和工作成果
- 支持多种内容格式（Markdown、代码片段、链接）
- 提供高效的检索和分类能力
- 数据本地存储，保护隐私

## 功能需求

### 核心功能
- [ ] **笔记管理**
  - 创建、编辑、删除笔记
  - 支持 Markdown 语法
  - 实时预览
  - 自动保存

- [ ] **标签系统**
  - 为笔记添加多个标签
  - 按标签筛选笔记
  - 标签云展示

- [ ] **全文搜索**
  - 标题搜索
  - 内容搜索
  - 标签搜索
  - 搜索结果高亮

- [ ] **分类管理**
  - 创建文件夹/笔记本
  - 拖拽排序
  - 层级结构

- [ ] **数据管理**
  - 本地存储（IndexedDB）
  - 导入/导出功能
  - 自动备份

### 高级功能
- [ ] **代码高亮**
  - 支持多种编程语言
  - 行号显示
  - 复制按钮

- [ ] **链接收藏**
  - 保存网页链接
  - 自动抓取标题和描述
  - 缩略图预览

- [ ] **快速笔记**
  - 快捷键创建
  - 悬浮输入框
  - 模板选择

- [ ] **暗黑模式**
  - 自动切换
  - 手动切换

## 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **构建**: Vite
- **样式**: Tailwind CSS
- **编辑器**: Monaco Editor / CodeMirror
- **Markdown 渲染**: react-markdown + remark-gfm
- **代码高亮**: Prism.js
- **状态管理**: Zustand
- **存储**: IndexedDB (via idb)

### 工具
- **图标**: Lucide React
- **日期**: date-fns
- **搜索**: Fuse.js
- **拖拽**: @dnd-kit

## 验收标准

1. **功能完整性**
   - 所有核心功能正常运行
   - 无明显 Bug

2. **性能要求**
   - 首屏加载 < 2s
   - 搜索响应 < 500ms
   - 支持 1000+ 笔记流畅运行

3. **用户体验**
   - 界面美观简洁
   - 操作流畅自然
   - 错误提示友好

4. **数据安全**
   - 数据本地存储
   - 支持导出备份
   - 导入不丢失数据

## 文件结构

```
knowledge-base/
├── src/
│   ├── components/          # 组件
│   │   ├── Editor/          # 编辑器组件
│   │   ├── Sidebar/         # 侧边栏
│   │   ├── Search/          # 搜索组件
│   │   ├── TagCloud/        # 标签云
│   │   └── NoteList/        # 笔记列表
│   ├── hooks/               # 自定义 Hooks
│   ├── stores/              # 状态管理
│   ├── utils/               # 工具函数
│   ├── types/               # TypeScript 类型
│   ├── db/                  # 数据库操作
│   └── App.tsx              # 主应用
├── public/                  # 静态资源
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 数据库设计

### Note (笔记)
```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  folderId: string | null;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
```

### Folder (文件夹)
```typescript
interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  order: number;
}
```

### Tag (标签)
```typescript
interface Tag {
  id: string;
  name: string;
  color: string;
}
```

## 界面设计

### 布局
- 左侧：文件夹树 + 标签列表
- 中间：笔记列表（可搜索筛选）
- 右侧：编辑器 + 预览

### 配色
- 主色：蓝色 (#3b82f6)
- 背景：白色/深色模式
- 文字：灰色系

## 实现步骤

### 第一阶段：基础架构
1. 初始化 React + Vite 项目
2. 配置 Tailwind CSS
3. 设置 IndexedDB 数据库
4. 创建基础组件结构

### 第二阶段：核心功能
1. 实现笔记 CRUD
2. 集成 Markdown 编辑器
3. 实现标签系统
4. 添加搜索功能

### 第三阶段：增强功能
1. 代码高亮
2. 暗黑模式
3. 导入/导出
4. 快捷键支持

### 第四阶段：优化完善
1. 性能优化
2. 错误处理
3. 用户引导
4. 文档编写

## 开发规范

- 使用 TypeScript 严格模式
- 组件使用函数式 + Hooks
- 状态管理使用 Zustand
- 样式使用 Tailwind CSS
- 代码注释清晰

## 参考项目

- Notion
- Obsidian
- Bear
- Simplenote
