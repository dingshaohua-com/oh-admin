# Shadcn
对比完整的框架antd，shadcn/ui是一个代码库，它 无运行时依赖，基于Tailwind CSS，极致的定制自由。"你自己的组件库"理念：源码在手，随意修改，深度定制无限制。

shadcn/ui：只包含你实际使用的组件代码； Ant Design：包含完整库，即使只用一个按钮

关键决策点：你想要完全的设计控制权（shadcn）还是开箱即用的完整方案（Ant Design）？

## 抽离
提取到子包 `shadcn-comps`中，注意安装对应的依赖
```sh
pnpm add lucide-react class-variance-authority clsx tailwind-merge
pnpm add --D react react-dom
```

其它 直接参考项目配置吧，比如 tsconfig.json、package.json 和 components.json

使用的时候，直接在 `apps/admin`引入即可
```tsx
import { Button } from "@repo/shadcn-comps/button";

export default function Demo() {
  return (
    <div className="demo-page">
      <div className="text-2xl font-bold">这是一个shadcn 的按钮：</div>
      <Button>测试</Button>
    </div>
  );
}

```