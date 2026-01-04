# Turborepo
本项目使用 [Turborepo](https://turborepo.com) 来组织和管理代码结构，Turborepo 是专门为优化 Monorepo 构建性能而设计的工具。

## 使用turbo
安装 ` pnpm add --D -w turbo`，并在根目录下创建 `turbo.json`，一般如下
```js
{
    "$schema": "https://turborepo.com/schema.json",
    "tasks": {
      "build": {
        "dependsOn": ["^build"],
        "inputs": ["$TURBO_DEFAULT$", ".env*"],
        "outputs": ["../../dist/**", "../../dist/docs/**"]
      },
      "lint": {},
      "dev": {
        "cache": false,
        "persistent": true
      }
    }
  }
```
这样就初始化好了 turborepo !

重要说明：是否决定使用 Monorepo or Turborepo，不是看有多少个子项目，[哪怕只有一个 为了解解耦和模块化你依然可以抽离](https://www.cnblogs.com/dingshaohua/p/19435099)，这是一种拉良好的思维习惯！
