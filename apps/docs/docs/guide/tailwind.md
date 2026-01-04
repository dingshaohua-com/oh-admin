# Tailwind
Tailwind是原子化的 css 样式集合，它会按需打包 class 样式，并智能解决class冲突等问题！


## 抽离
将 tailwind 抽离到 `@repo/config-tailwind`中，并增加以下文件

```
base-styles.css 入口文件
layers/config/themes 一些tailwind配置
```

最后在 `apps/admin`项目的 style.css 引用即可
```css
@import "@repo/config-tailwind";
```


## 关于PostCSS
不同于 Vite，在 Rsbuild 中 Tailwind CSS v4 需要通过 PostCSS 插件来来注册 Tailwind CSS 的 PostCSS 插件。

虽然你在 @repo/config-tailwind 包里已经配置好了 PostCSS，但 Rsbuild 需要在当前项目目录下找到 postcss.config.js 文件才能正确加载这些配置。