 # Biome
 Biome 格式化代码、修复错误，不止于此，就在一瞬间！
 用于取代 Eslint+Prettier 。
 本体使用 rust 编写，速度是上边的几十倍！
 
 ## 外部继承限制
 Biome 的 extends 配置不支持像 npm 包那样的模块解析（如 @repo/config-biome），它需要一个直接的文件路径。


 ## 怎么抽离法？
将Biome的配置做为子包抽离为 `@repo/config-biome`   
Biome / Prettier / ESLint：只放在根目录起作用，一份配置管全仓，子项目基本零差异不用单独配置。
