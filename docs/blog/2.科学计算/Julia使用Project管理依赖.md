---
title: Julia使用Project管理依赖
createTime: 2025/11/19 19:30:37
permalink: /article/j0qau56n/
tags:
    - Julia
---

## 一、如何创建一个 Julia 项目（Project）

Julia 使用内置的 **Pkg** 包管理器来组织项目与依赖。推荐在每个项目中使用独立环境，即使用 Julia 项目，避免包冲突并保证可复现性。本文将详细讲述如何创建以及使用项目。

本文的代码基于 Julia 1.12.1 版本测试通过。

### 1. 初始化 Julia 项目 (generate)

进入 Julia REPL，执行：

```julia
using Pkg
Pkg.generate("MyPackage")
```

或者按下 `]` 键，会看见命令指示符从 `julia>` 变为 `pkg>`，然后执行

```julia
generate MyPackage
```

上面两种写法是等价的。

此时会生成：

```bash
Generating  project MyPackage:
    MyPackage\Project.toml
    MyPackage\src\MyPackage.jl
```
* 文件夹 `MyPackage`
* `MyPackage\Project.toml`：记录依赖包名称与版本兼容范围
* `MyPackage\src\MyPackage.jl`：使用包的示例代码
* `Manifest.toml`：记录所有依赖及其精确版本（确保环境可复现）

现在，切换到刚刚新建的项目文件夹：

```bash
cd MyPackage
```

### 2. 激活项目 (activate)

在项目文件夹中，按下 `]`，切换到 `pkg>` 模式，执行

```
activate .
```
激活当前文件夹为项目。此时应该看见 `pkg>` 前面的版本号变为已激活的项目名称。这样就成功激活了项目。

### 3. 添加依赖

像往常一样添加依赖，示例：

```julia
using Pkg
Pkg.add("Plots")
Pkg.add("DataFrames")
```

依赖会写入 `Project.toml`，同时 `Manifest.toml` 会被更新。如果是首次添加该项目的依赖，`Manifest.toml` 文件会自动新建。

### 4. 删除依赖

在 Julia 中删除依赖（package）非常简单，只需要使用 `Pkg.rm()` 或在 Pkg 模式下用 `rm 包名`。

例如删除 Plots:

```julia
Pkg.rm("Plots")
```
Julia 会自动更新 `Project.toml` 和 `Manifest.toml`.


### 5. 项目基本结构示例

```
MyPackage/
│
├── src/
│   └── MyPackage.jl
│
├── Project.toml
└── Manifest.toml
```

## 二、他人克隆你的项目后如何安装依赖

他人使用 Git 克隆你的项目：

```bash
git clone https://github.com/yourname/MyPackage.git
cd MyPackage
```

然后在 Julia REPL 中：

```julia
using Pkg
Pkg.activate(".")      # 激活项目环境
Pkg.instantiate()      # 安装项目所需的全部依赖
```

其中：

* **`Pkg.instantiate()`** 会根据 `Project.toml` 和 `Manifest.toml` 自动安装所有依赖及其精确版本，确保环境完全一致。

之后即可正常运行项目代码。


## 三、常用命令总结

| 目的          | 命令                       |
| ----------- | ------------------------ |
| 初始化项目       | `Pkg.generate("ProjectName")`             |
| 激活项目环境      | `Pkg.activate(path)`     |
| 添加依赖        | `Pkg.add("PackageName")` |
| 安装依赖（他人克隆后） | `Pkg.instantiate()`      |
| 更新依赖        | `Pkg.update()`           |
| 删除依赖        | `Pkg.rm("PackageName")`  |



## 四、关键点总结

* Julia 推荐为每个项目创建独立环境。
* 使用 `Project.toml` 与 `Manifest.toml` 确保依赖可复现。
* 他人只需执行 `Pkg.activate(".")` 与 `Pkg.instantiate()` 即可自动安装所有依赖。

这套流程可确保我们的 Julia 项目结构清晰、依赖可控、协作方便。同时，创建出的项目是符合Julia包发布的规范的，为以后将项目发布为包做好了准备。

