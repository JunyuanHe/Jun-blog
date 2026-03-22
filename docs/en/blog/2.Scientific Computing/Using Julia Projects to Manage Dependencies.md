---
title: Using Julia Projects to Manage Dependencies
createTime: 2025/11/19 19:30:37
permalink: /article/j0qau56n_en/
tags:
  - Julia
---

## 1. How to Create a Julia Project

Julia uses the built-in **Pkg** package manager to organize projects and dependencies. It is recommended to use an isolated environment for each project so that you can avoid package conflicts and keep the environment reproducible. This article explains how to create and use a Julia project.

The code in this article was tested with Julia 1.12.1.

### 1. Initialize a Julia project (`generate`)

Enter the Julia REPL and run:

```julia
using Pkg
Pkg.generate("MyPackage")
```

Or press `]` to switch from the `julia>` prompt to `pkg>`, then run:

```julia
generate MyPackage
```

The two forms above are equivalent.

This generates:

```bash
Generating  project MyPackage:
    MyPackage\Project.toml
    MyPackage\src\MyPackage.jl
```

- The `MyPackage` folder
- `MyPackage\Project.toml`: records dependency names and compatibility ranges
- `MyPackage\src\MyPackage.jl`: example package source code
- `Manifest.toml`: records all dependencies and exact versions to make the environment reproducible

Now switch to the newly created project folder:

```bash
cd MyPackage
```

### 2. Activate the project (`activate`)

Inside the project folder, press `]` to enter `pkg>` mode and run:

```text
activate .
```

This activates the current folder as a Julia project. You should see the project name appear in the prompt. At that point the project is active.

### 3. Add dependencies

Add dependencies as usual. For example:

```julia
using Pkg
Pkg.add("Plots")
Pkg.add("DataFrames")
```

The dependencies will be written into `Project.toml`, and `Manifest.toml` will also be updated. If this is the first dependency added to the project, `Manifest.toml` will be created automatically.

### 4. Remove dependencies

Removing a package in Julia is straightforward. You can use `Pkg.rm()` or use `rm package_name` in Pkg mode.

For example, to remove `Plots`:

```julia
Pkg.rm("Plots")
```

Julia will automatically update both `Project.toml` and `Manifest.toml`.

### 5. Basic project structure

```text
MyPackage/
│
├── src/
│   └── MyPackage.jl
│
├── Project.toml
└── Manifest.toml
```

## 2. How Others Install Dependencies After Cloning Your Project

If someone clones your project with Git:

```bash
git clone https://github.com/yourname/MyPackage.git
cd MyPackage
```

Then in the Julia REPL:

```julia
using Pkg
Pkg.activate(".")
Pkg.instantiate()
```

`Pkg.instantiate()` installs every dependency and exact version according to `Project.toml` and `Manifest.toml`, ensuring the environment matches yours.

## 3. Summary of Common Commands

- `generate MyPackage`: create a new project
- `activate .`: activate the current project
- `add PackageName`: add a dependency
- `rm PackageName`: remove a dependency
- `instantiate`: install all dependencies listed in the project files
