---
title: Mathematica中Table的用法
createTime: 2025/09/15 12:55:22
permalink: /zh/article/uv6aw37b/
tags:
    - Mathematica
---

`Table` 是 Mathematica 中非常核心的生成数据和矩阵的方法，它既可以生成数值矩阵，也可以生成符号矩阵，非常灵活。


## **1. 基本用法**

`Table` 的基本语法是：

```mathematica
Table[expr, {i, imax}]
```

* `expr`：表达式，可以是数值、符号或函数
* `i`：循环变量
* `imax`：循环上限（默认从 1 开始）

示例：

```mathematica
Table[i^2, {i, 5}]
```

输出：

```
{1, 4, 9, 16, 25}
```

> 相当于生成 `i=1..5` 的平方列表。


## **2. 指定起始值和步长**

语法：

```mathematica
Table[expr, {i, imin, imax, step}]
```

* `imin`：起始值
* `imax`：结束值
* `step`：步长（可选，默认步长为 1）

示例：

```mathematica
Table[2 i, {i, 1, 5, 2}]
```

输出：

```
{2, 6, 10}
```

> 循环 i = 1, 3, 5。


## **3. 生成二维矩阵**

要生成 n×m 矩阵，可以嵌套两个循环：

```mathematica
Table[a[i, j], {i, n}, {j, m}]
```

示例：生成 3×3 矩阵

```mathematica
Table[a[i, j], {i, 3}, {j, 3}] // MatrixForm
```

输出：

$$
\begin{pmatrix}
a[1,1] & a[1,2] & a[1,3] \\
a[2,1] & a[2,2] & a[2,3] \\
a[3,1] & a[3,2] & a[3,3]
\end{pmatrix}
$$

* 外层循环 `{i, 3}` → 行
* 内层循环 `{j, 3}` → 列


## **4. 符号矩阵示例**

假设你想生成 n×n 的符号矩阵：

```mathematica
n = 4;
A = Table[a[i, j], {i, n}, {j, n}]
A // MatrixForm
```

输出：

$$
\begin{pmatrix}
a[1,1] & a[1,2] & a[1,3] & a[1,4] \\
a[2,1] & a[2,2] & a[2,3] & a[2,4] \\
a[3,1] & a[3,2] & a[3,3] & a[3,4] \\
a[4,1] & a[4,2] & a[4,3] & a[4,4]
\end{pmatrix}
$$

> 结合 `Table`，你可以生成任意复杂符号矩阵，比如上三角矩阵、下三角矩阵、对角矩阵等等。


## **5. 带条件生成矩阵**

`Table` 可以加 `If` 或条件生成特定元素：

* 生成上三角矩阵：

```mathematica
n = 4;
UpperTri = Table[If[j >= i, a[i, j], 0], {i, n}, {j, n}] // MatrixForm
```

输出：

$$
\begin{pmatrix}
a[1,1] & a[1,2] & a[1,3] & a[1,4] \\
0 & a[2,2] & a[2,3] & a[2,4] \\
0 & 0 & a[3,3] & a[3,4] \\
0 & 0 & 0 & a[4,4]
\end{pmatrix}
$$

* 类似方法可以生成下三角、对称矩阵等。


## **6. 嵌套循环示例（复杂表达式）**

你可以在 `expr` 中使用循环变量做任意运算：

```mathematica
Table[i + j^2, {i, 3}, {j, 3}]
```

输出：

```
{{2, 5, 10}, 
 {3, 6, 11}, 
 {4, 7, 12}}
```

* 每个元素是 `i + j^2`
* Mathematica 会自动按照行列生成列表的列表（矩阵形式）


## **7. 总结 Table 用法**

| 功能     | 示例                                     | 说明              |
| ------ | -------------------------------------- | --------------- |
| 生成一维列表 | `Table[i^2, {i, 5}]`                   | 生成 i=1..5 的平方列表 |
| 指定步长   | `Table[2 i, {i, 1, 5, 2}]`             | 循环 i=1,3,5      |
| 生成矩阵   | `Table[a[i,j],{i,3},{j,3}]`            | 外层 i 行，内层 j 列   |
| 条件生成   | `Table[If[j>=i,a[i,j],0],{i,4},{j,4}]` | 上三角矩阵           |
| 嵌套表达式  | `Table[i+j^2,{i,3},{j,3}]`             | 元素可自定义复杂表达式     |


