---
title: Using Table in Mathematica
createTime: 2025/09/15 12:55:22
permalink: /article/uv6aw37b/
tags:
  - Mathematica
---

`Table` is one of the core tools in Mathematica for generating data and matrices. It can create both numeric matrices and symbolic matrices, which makes it very flexible.

## 1. Basic syntax

```mathematica
Table[expr, {i, imax}]
```

- `expr`: an expression
- `i`: the loop variable
- `imax`: the upper limit of the loop

Example:

```mathematica
Table[i^2, {i, 5}]
```

Output:

```text
{1, 4, 9, 16, 25}
```

## 2. Specify a starting value and step size

```mathematica
Table[expr, {i, imin, imax, step}]
```

Example:

```mathematica
Table[2 i, {i, 1, 5, 2}]
```

Output:

```text
{2, 6, 10}
```

## 3. Generate a 2D matrix

To generate an `n × m` matrix, nest two loops:

```mathematica
Table[a[i, j], {i, n}, {j, m}]
```

Example:

```mathematica
Table[a[i, j], {i, 3}, {j, 3}] // MatrixForm
```

## 4. Symbolic matrix example

```mathematica
n = 4;
A = Table[a[i, j], {i, n}, {j, n}]
A // MatrixForm
```

With `Table`, you can build symbolic matrices of almost any structure, including upper triangular, lower triangular, and diagonal matrices.

## 5. Conditional matrix generation

`Table` can be combined with `If` or other conditions:

```mathematica
Table[If[i == j, 1, 0], {i, 4}, {j, 4}] // MatrixForm
```

This generates a 4×4 identity matrix.
