---
title: Mathematica线性代数入门
createTime: 2025/09/14 12:43:23
permalink: /zh/article/qqizy8hm/
tags:
    - Mathematica
---


## Mathematica 矩阵与向量符号运算

Mathematica 符号矩阵和向量运算非常强大。下面我们一步步介绍基本操作。


### 1. **定义向量与矩阵**

在 Mathematica 中：

* 向量就是列表。
* 矩阵是列表的列表。

```mathematica
v = {x, y, z}       (* 一个符号向量 *)
A = {{a, b}, {c, d}}   (* 一个 2x2 符号矩阵 *)
```

可以用 `Dimensions` 查看维度：

```mathematica
Dimensions[v]
Dimensions[A]
```


### 2. **矩阵操作**

* **转置**：

```mathematica
Transpose[A]
```

* **矩阵乘法** 使用点号 `.`：

```mathematica
A.v     (* 矩阵乘向量 *)
A.A     (* 矩阵平方 *)
```

* **Hadamard积**

```mathematica
A*B      (* 每个对应元素相乘，不是矩阵乘法 *)
```

> 对于线性代数运算，千万不要用 `*` 替代 `.`。

* **行列式与逆矩阵**：

```mathematica
Det[A]
Inverse[A]
```

* **单位矩阵**：

```mathematica
IdentityMatrix[3]   (* 3x3 单位矩阵 *)
```


### 3. **符号线性代数**

Mathematica 可以处理符号运算：

* **特征值与特征向量**：

```mathematica
Eigenvalues[A]
Eigenvectors[A]
```

* **特征多项式**：

```mathematica
CharacteristicPolynomial[A, λ]
```

* **求解线性方程组** $A x = b$：

```mathematica
Solve[A.{x1, x2} == {1, 0}, {x1, x2}]
```

### 4. **向量运算基础**

对于符号向量：

* **点积**：

```mathematica
Dot[v, v]   (* 输出 x^2 + y^2 + z^2 *)
v.v   (* 简便写法 *)
```

* **叉积**：

```mathematica
Cross[{x1, x2, x3}, {y1, y2, y3}]
```

* **范数**：

```mathematica
Norm[v]
```

---

### 5. **美观输出**

为了用传统数学形式显示矩阵，可以使用 `MatrixForm`：

```mathematica
A // MatrixForm
```

上面的后缀写法和如下写法等价：

```mathematica
MatrixForm[A]
```

> ⚠️ 注意：`MatrixForm` 仅用于显示，不用于计算。

---

上面我们讲了：

* 定义向量/矩阵
* 进行符号代数运算
* 求解线性系统
* 计算特征值/特征向量




## 定义任意维度的符号向量与矩阵

Mathematica 的符号能力非常强，你可以不必写出所有元素，就能定义一般的 $n$ 维向量或 $n \times n$ 矩阵。


### 1. **长度为 n 的符号向量**

```mathematica
v = Array[x, n]    (* 生成 {x[1], x[2], ..., x[n]} *)
```

示例：$n=5$

```mathematica
Array[x, 5]
(* {x[1], x[2], x[3], x[4], x[5]} *)
```


### 2. **n×n 符号矩阵**

```mathematica
A = Array[a, {n, n}]
```

生成：

$$
\{ \{a[1,1], a[1,2], \dots \}, \dots, \{a[n,1], \dots, a[n,n]\} \}
$$

例如 $n=3$：

```mathematica
Array[a, {3, 3}] // MatrixForm
```


### 3. **符号运算示例**

你可以做：

* **矩阵乘向量**：

```mathematica
A.v
```

* **求行列式**：

```mathematica
Det[A]
```

* **特征多项式**：

```mathematica
CharacteristicPolynomial[A, λ]
```


### 4. **常用预定义符号矩阵**

* **单位矩阵**：

```mathematica
IdentityMatrix[n]
```

* **零矩阵**：

```mathematica
ConstantArray[0, {n, n}]
```

* **对角矩阵**：

```mathematica
DiagonalMatrix[Array[d, n]]   (* 对角元素为 d[1], ..., d[n] *)
```


### 5. **维度假设**

有时希望告诉 Mathematica $n$ 是正整数：

```mathematica
Assuming[n ∈ Integers && n > 0, Simplify[...]]
```

这在简化涉及 $n \times n$ 矩阵的符号表达式时非常有用。




