# 快速开始

欢迎使用 **oh-admin** —— 一个开箱即用的现代化中后台解决方案。

## 简介

oh-admin 是一个基于现代前端技术栈构建的中后台模板，旨在提供：

- 🚀 **极致的开发体验** - 快速的热更新和构建速度
- 📦 **模块化架构** - 清晰的项目结构，易于扩展
- 🎨 **精美的 UI** - 现代化的界面设计
- 🛠️ **最佳实践** - 内置代码规范和类型检查

## 技术栈

| 技术 | 说明 |
| --- | --- |
| [Rsbuild](https://rsbuild.dev/) | 字节跳动出品的新一代构建工具，基于 Rspack |
| [Turborepo](https://turbo.build/) | 高性能的 Monorepo 构建系统 |
| [TailwindCSS](https://tailwindcss.com/) | 原子化 CSS 框架 |
| [shadcn/ui](https://ui.shadcn.com/) | 高度可定制的 React 组件库 |
| [TypeScript](https://www.typescriptlang.org/) | JavaScript 的超集，提供类型安全 |
| [Biome](https://biomejs.dev/) | 高性能的代码格式化与 lint 工具 |

## 项目结构

```
oh-admin/
├── apps/
│   ├── admin/          # 中后台主应用
│   └── docs/           # 项目文档
├── packages/
│   ├── config-biome/   # Biome 配置包
│   └── config-ts/      # TypeScript 配置包
├── turbo.json          # Turborepo 配置
├── pnpm-workspace.yaml # pnpm 工作区配置
└── package.json        # 根 package.json
```

## 环境要求

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/oh-admin.git
cd oh-admin
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 启动开发服务器

```bash
# 启动所有应用
pnpm dev

# 只启动 admin 应用
pnpm --filter admin dev

# 只启动文档
pnpm --filter docs dev
```

### 4. 构建项目

```bash
# 构建所有应用
pnpm build

# 只构建 admin 应用
pnpm --filter admin build
```

## 核心特性

### ⚡ Rsbuild 构建

基于字节跳动的 Rsbuild 构建工具，底层使用 Rspack（Rust 版 Webpack），提供：

- 极速的冷启动和热更新
- 开箱即用的配置
- 完善的插件生态

```ts title="rsbuild.config.ts"
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
});
```

### 📦 Turborepo 管理

使用 Turborepo 进行 Monorepo 管理，支持：

- 增量构建和缓存
- 并行任务执行
- 依赖拓扑排序

```json title="turbo.json"
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### 🎨 TailwindCSS 样式

采用 TailwindCSS 原子化 CSS 方案：

- 快速构建响应式布局
- 无需编写自定义 CSS
- 自动清除未使用样式

```tsx
// 使用 Tailwind 类名
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
</div>
```

### 🧩 shadcn/ui 组件

使用 shadcn/ui 组件库，特点：

- 组件代码完全可控
- 基于 Radix UI 无障碍组件
- 支持主题定制

```tsx
import { Button } from '@/components/ui/button';

function App() {
  return (
    <Button variant="outline" size="lg">
      点击我
    </Button>
  );
}
```

### 🛡️ TypeScript 类型安全

全面采用 TypeScript：

- 完整的类型推导
- 编译时类型检查
- 更好的 IDE 支持

### ✨ Biome 代码规范

使用 Biome 替代 ESLint + Prettier：

- 更快的执行速度
- 统一的配置
- 内置格式化和 lint

```bash
# 格式化代码
pnpm biome format --write .

# 检查代码
pnpm biome check .

# 自动修复
pnpm biome check --write .
```

## 下一步

- 查看 [组件文档](/components/) 了解可用组件
- 阅读 [配置指南](/config/) 了解如何自定义配置
- 参考 [最佳实践](/best-practices/) 学习推荐的开发模式
