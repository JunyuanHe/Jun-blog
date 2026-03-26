---
title: "How to Construct an RK Method of Any Order? The GBS Method"
createTime: 2025/11/25 14:03:42
permalink: /en/article/s5lpmere/
tags:
  - Numerical Analysis
  - RK
---

We have already seen the power of Richardson extrapolation in the previous article: [Want to get high order?](https://blog.junyuanhe.com/article/02konsuj/). This time we look at an even stronger application: constructing Runge-Kutta methods of arbitrary even order $p$. This is the **Gragg-Bulirsch-Stoer (GBS) extrapolation algorithm**.

Designing Runge-Kutta methods of arbitrary order is a classic difficult problem. The GBS algorithm gives an elegant construction route and, historically, an upper bound on the minimal number of stages that has remained essentially unbeaten since the method appeared in 1964.

## 1. Start with the modified midpoint method

The GBS algorithm starts from the **modified midpoint method** for one large step of size $H$, divided into $n$ substeps ($h = H/n$):

$$
y_0 = y(t_0), \quad y_1 = y_0 + h f(t_0, y_0)
$$

$$
y_{k+1} = y_{k-1} + 2h f(t_0 + k h, y_k), \quad k = 1, \dots, n-1.
$$

After $n$ substeps we obtain $y_n$, which is second-order accurate. The extrapolation step is then used to systematically raise the order.

::: card title="Theorem"
The error expansion of the modified midpoint method contains only even powers of $h$.

This is the structural reason why Richardson extrapolation becomes especially powerful here: if the error is already a series in $h^2$, each extrapolation step jumps the order by two.
:::

## 2. Richardson extrapolation on the midpoint table

Choose a sequence of substep counts

$$
n_1 < n_2 < \cdots < n_m
$$

and compute the corresponding midpoint approximations

$$
T_{i,1} = y(H, n_i).
$$

Since the modified midpoint method has an expansion of the form

$$
T_{i,1} = y(H) + c_1 n_i^{-2} + c_2 n_i^{-4} + c_3 n_i^{-6} + \cdots,
$$

we can eliminate the leading error terms column by column using Richardson extrapolation:

$$
T_{i,j}
=
T_{i,j-1}
+
\frac{T_{i,j-1} - T_{i-1,j-1}}
{\left(\frac{n_i}{n_{i-j+1}}\right)^2 - 1}.
$$

Each new column removes one more even-power term from the error expansion.

## 3. Why this produces high-order RK formulas

The remarkable point is that this extrapolation process can be reinterpreted as a Runge-Kutta-type one-step method. Once the tableau is fixed by the chosen sequence $n_1, n_2, \dots, n_m$, the final extrapolated value has order

$$
2m.
$$

So, by increasing the number of extrapolation levels, we obtain a family of one-step methods of arbitrarily high even order.

## 4. Final remarks

The main lesson is simple:

> High order does not always need to be designed all at once. Sometimes it can be built by stacking structure on top of a very simple core method.

That is exactly what GBS does: midpoint stepping plus Richardson extrapolation, organized in a way that produces arbitrarily high even-order one-step schemes.
