---
title: Mathematica Linear Algebra Basics
createTime: 2025/09/14 12:43:23
permalink: /en/article/qqizy8hm/
tags:
  - Mathematica
---

## Mathematica Symbolic Matrix and Vector Operations

Mathematica is very strong at symbolic matrix and vector operations. Let us go through the basics step by step.

### 1. Define vectors and matrices

In Mathematica:

- A vector is a list.
- A matrix is a list of lists.

```mathematica
v = {x, y, z}
A = {{a, b}, {c, d}}
```

You can inspect dimensions with `Dimensions`:

```mathematica
Dimensions[v]
Dimensions[A]
```

### 2. Matrix operations

- **Transpose**

```mathematica
Transpose[A]
```

- **Matrix multiplication** uses the dot operator `.`

```mathematica
A.v
A.A
```

- **Hadamard product**

```mathematica
A*B
```

> For linear algebra operations, do not use `*` in place of `.`.

- **Determinant and inverse**

```mathematica
Det[A]
Inverse[A]
```

- **Identity matrix**

```mathematica
IdentityMatrix[3]
```

### 3. Symbolic linear algebra

Mathematica can also handle symbolic linear algebra:

- **Eigenvalues and eigenvectors**

```mathematica
Eigenvalues[A]
Eigenvectors[A]
```

- **Characteristic polynomial**

```mathematica
CharacteristicPolynomial[A, λ]
```

- **Solve a linear system** $Ax=b$

```mathematica
Solve[A.{x1, x2} == {1, 0}, {x1, x2}]
```

### 4. Basic vector operations

For symbolic vectors:

- **Dot product**

```mathematica
Dot[v, v]
v.v
```

- **Cross product**

```mathematica
Cross[{x1, x2, x3}, {y1, y2, y3}]
```

- **Norm**

```mathematica
Norm[v]
```

### 5. Better output formatting

You can use `MatrixForm` to display matrices more clearly:

```mathematica
A // MatrixForm
```
