---
title: "How to construct an RK method of any order? - The GBS method"
createTime: 2025/11/24 20:43:42
permalink: /article/s5lpmere/
---

We have seen the power of Richardson extrapolation in this previous article [](https://blog.junyuanhe.com/article/02konsuj/). This time, we will show an even more powerful application —— constructing Runge--Kutta methods for arbitrary (even) order $p$.



Ah, you're asking about the **underlying Runge-Kutta (RK) tableau** of the **Gragg-Bulirsch-Stoer (GBS) extrapolation algorithm**, which is a bit subtle because GBS is an **extrapolation method** based on the **modified midpoint rule**, not a conventional RK method. But yes, you *can* write it as an RK method with an explicit tableau. Let’s go step by step.

---

### 1. **Start with the modified midpoint method**

The GBS algorithm uses the **modified midpoint method** for a single step of size $H$ subdivided into $n$ substeps $(h = H/n)$:

$$
y_0 = y(t_0), \quad y_1 = y_0 + h f(t_0, y_0)
$$

$$
y_{k+1} = y_{k-1} + 2h f(t_0 + k h, y_k), \quad k = 1, \dots, n-1
$$

After $n$ substeps, you get $y_n$, which is **2nd-order accurate**. Then the extrapolation step is applied to increase the order.

---

### 2. **Richardson extrapolation**

GBS constructs a table of approximations using **step numbers (n_1 < n_2 < \dots < n_m)**. The approximations (y(H, n_i)) are extrapolated to zero step size:

[
y_{\text{extrapolated}} = \sum_{i} c_i , y(H, n_i)
]

This is analogous to **Aitken-Neville extrapolation** or **Richardson extrapolation**.

---

### 3. **Expressing GBS as a single RK method**

Every extrapolation method can be rewritten as a **dense RK scheme** because it's a **linear combination of evaluations of (f(t, y)) at specific points**.

* Let (f_0 = f(t_0, y_0)), (f_1 = f(t_0 + h, y_1)), etc.
* Each modified midpoint sequence produces intermediate values (y_k) as linear combinations of (y_0) and the (f_j)'s.
* Then, the extrapolation is a linear combination of these (y_n) values, which themselves are linear combinations of (y_0) and all (f_j)'s.

Hence, the **final extrapolated value** can be written as:

[
y_{n+1} = y_0 + H \sum_i b_i f(t_0 + c_i H, Y_i)
]

where (Y_i) are stage values depending on previous (f_j) (so it fits the RK form).

---

### 4. **How to compute the tableau**

Let’s outline the practical steps:

1. **Choose the sequence of substeps** (n_1, n_2, \dots, n_m) (usually (n_i = 2i) or similar).
2. **Write the modified midpoint formula** for each (n_i) as a set of linear combinations of (y_0) and (f_j).
3. **Apply extrapolation formula** (Richardson / Neville) to combine the (y(H, n_i)) into (y_{n+1}).
4. **Express the final formula as a sum over all (f_j)**.
5. The coefficients of (f_j) are your (b_i) (last row of RK tableau).
6. The times (c_i) are the positions where each (f_j) is evaluated.
7. **Solve recursively** for the (a_{ij}) entries from the linear system:

[
Y_i = y_0 + H \sum_{j=1}^{i-1} a_{ij} f_j
]

---

### 5. **Important notes**

* There is **no unique RK tableau**: the number of stages is **equal to the total number of function evaluations in all substeps**.
* The tableau is usually **dense** because each extrapolated stage depends on many previous stages.
* For low-order extrapolation (say (n=2,4)), it’s feasible to compute manually. For higher orders, it’s easier to **compute numerically**.

---

### 6. **References / Formulas**

1. Hairer, Nørsett, Wanner — *Solving Ordinary Differential Equations I: Nonstiff Problems* (2nd edition), Section II.7.

   * Table II.7.1 gives RK tableaus for GBS extrapolation of small orders.
2. Deuflhard — *Numerical Analysis in Modern Scientific Computing* discusses expressing extrapolation methods as RK methods.
