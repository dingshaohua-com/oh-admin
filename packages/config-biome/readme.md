 ## 外部继承限制
 Biome 的 extends 配置不支持像 npm 包那样的模块解析（如 @repo/config-biome），它需要一个直接的文件路径。


 ## 怎么抽离法？
Biome / Prettier / ESLint：只放在根目录，一份配置管全仓，子项目基本零差异。