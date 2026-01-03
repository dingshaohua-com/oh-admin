## 外部继承限制
include、exclude 和 files 不能通过 extends 被继承，这是 Ts 的一个设计限制。
所以本包就不再对这几个字段进行抽离了，反正外部还要再定义，主要抽离的是 `compilerOptions`！



## 怎么抽离法？
根留 tsconfig.base.json（我这里是rsbuld-app.json） 放公共规则；
受限于此规则，子项目必须有自己的 `tsconfig.json`，然后再考虑继承 base，只补差异（outDir、paths、target 等）。

如果根目录不涉及到代码，这是组织文件，则无需给根项目配置！