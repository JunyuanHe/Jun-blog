---
title: "How to construct an RK method of any order? —— The GBS method"
createTime: 2025/11/25 14:03:42
permalink: /article/s5lpmere/
tags:
    - Numerical Analysis
    - RK
---

We have seen the power of Richardson extrapolation in this previous article: [Want to get high order?](https://blog.junyuanhe.com/article/02konsuj/). This time, we will show an even more powerful application —— constructing Runge-Kutta methods for arbitrary (even) order $p$. This is what we call the **Gragg-Bulirsch-Stoer (GBS) extrapolation algorithm**.

The construction of Runge-Kutta methods for arbitrary order $p$ is a well-known difficult problem. But the GBS algorithm gives an elegant way to do this, and gives an upper-bound on the lowest stages number estimate, which has not been successfully improved in 60 years since this method was given in 1964.


## 1. **Start with the modified midpoint method**

The GBS algorithm uses the **modified midpoint method** for a single step of size $H$ subdivided into $n$ substeps ($h = H/n$):

$$
y_0 = y(t_0), \quad y_1 = y_0 + h f(t_0, y_0)
$$

$$
y_{k+1} = y_{k-1} + 2h f(t_0 + k h, y_k), \quad k = 1, \dots, n-1 
$$

After $n$ substeps, you get $y_n$, which is 2nd-order accurate. Then the extrapolation step is applied to increase the order.


::: card title="Theorem"

The error of the above modified midpoint method can be expanded as a series of $h^2$.

---

***Proof*** (Stetter). Let $h^* = 2h$, $x_k^* = x_0+kh^*$. $u_0 = v_0 = y_0$. Let 
$$
u_k = y_{2k}
$$ 
and
$$
\begin{align*}
v_k &= y_{2k+1} - hf(x_{2k}, y_{2k}) \\
&= \tfrac{1}{2} y_{2k+1} + \tfrac{1}{2} y_{2k-1} + h f(x_{2k}, y_{2k}) - h f(x_{2k}, y_{2k}) \\
&= \tfrac{1}{2} (y_{2k+1} + y_{2k-1}).
\end{align*}
$$

In this way, the modified midpoint method can be written as the following vector-formed one step method:

$$
\begin{pmatrix} u_{k+1} \\ v_{k+1} \end{pmatrix}
= \begin{pmatrix} u_{k} \\ v_{k} \end{pmatrix}
+ h^* \begin{pmatrix}  
f(x_k^* + \frac{h^*}{2}, v_k + \frac{h^*}{2} f(x_k^*, u_k)) \\
\frac{1}{2} [f(x_k^*+h^*, u_{k+1}) + f(x_k^*, u_k)]
\end{pmatrix}.
$$

It is a symmetric one-step method, since one can verify that when exchanging: $u_{k} \to u_{k+1}$, $v_{k} \to v_{k+1}$, $u_{k+1} \to u_{k}$, $v_{k+1} \to v_{k}$, $x_k^* \to x_k^* + h^*$, $h^* \to -h^*$, the formula for the method is invariant. Therefore, in the error expansion of this method, all coefficients for odd powers of $h^*$ are zero. This implies that the original modified midpoint method has an error expansion as a series of $h^2$. 

:::



## 2. **Richardson extrapolation**

GBS constructs a table of approximations using **step numbers $n_1 < n_2 < \dots < n_m$**. The approximations $y(H, n_i)$ are extrapolated to zero step size:

$$
y_{\text{extrapolated}} = \sum_{i} c_i \, y(H, n_i)
$$

This is analogous to Richardson extrapolation.



### 2.1. Setup: Approximations with different substeps

Suppose we want to integrate from $t_0$ to $t_0 + H$. You compute approximations using the **modified midpoint rule** with different numbers of substeps:

$$
n_1 < n_2 < \dots < n_m
$$

Let’s denote the approximations by:

$$
T_{i,1} = y(H, n_i), \quad i = 1,2,\dots,m
$$

Here:

* $n_i$ = number of substeps in the modified midpoint method.
* $T_{i,1}$ = approximation using $n_i$ substeps (order 2, since modified midpoint is 2nd-order).


### 2.2. Extrapolation formula

The idea of **Richardson extrapolation** is:

$$
y_{\text{exact}} = y(H, n_i) + C \cdot \left(\frac{H}{n_i}\right)^2 + \mathcal{O}\left(\left(\frac{H}{n_i}\right)^4\right)
$$

* $C$ is an unknown constant.
* The leading error term is proportional to $(H/n_i)^2$ (since midpoint is 2nd-order).

You can eliminate the $(H/n_i)^2$ error by combining two approximations:

$$
T_{i,2} = T_{i,1} + \frac{T_{i,1} - T_{i-1,1}}{(n_i/n_{i-1})^2 - 1}, \quad i = 2, \dots, m
$$

* This gives a **4th-order approximation** $T_{i,2}$.
* The denominator $(n_i/n_{i-1})^2 - 1$ comes from the error scaling.


### 2.3. Recursive Neville table

For higher orders, we construct a **table recursively**:

$$
T_{i,k} = T_{i,k-1} + \frac{T_{i,k-1} - T_{i-1,k-1}}{(n_i/n_{i-k+1})^{2k} - 1}, \quad k = 2,3,\dots,i
$$

* $T_{i,k}$ = approximation with order $2k$ (because modified midpoint is 2nd-order and each extrapolation increases order by 2).
* $T_{i,k}$ is computed from the previous column in the table.
* The **last entry in the last column** $T_{m,m}$ is the final GBS result: **highest-order extrapolated approximation**.


### 2.4. Explicit formula

From the recursive formula, we can derive a general formula that writes the **final extrapolated value $T_{m,m}$** as a **linear combination of the original approximations** $T_{1,1}, \dots, T_{m,1}$ (the values computed with different numbers of substeps).

The method comes from the **Neville / Lagrange interpolation point of view**. 


#### Notation

* Let $T_{i,1} = y(H, n_i)$ be the modified midpoint approximations.
* The final extrapolated value $T_{m,m}$ can be written as a **weighted sum**:

$$
T_{m,m} = \sum_{i=1}^{m} w_i \, T_{i,1}
$$

* The weights $w_i$ depend only on the **extrapolation nodes** $x_i = (1/n_i)^2$. i.e. $w_i = \ell_i(0)$, where $\ell_i(x)$ is the lagrange basis with respect to the $i^\text{th}$ node $x_i$.
* Why $(1/n_i)^2$? Because the error in $T_{i,1}$ is proportional to $(H/n_i)^2$.


#### Formula via Lagrange interpolation

This idea is as follows:

* Consider the function $F(x) = y(H, n)$ as a function of $x = (1/n)^2$.
* $T_{i,1} = F(x_i) \approx F(0) + \mathcal{O}(x_i)$, where $F(0)$ is the exact solution.
* Then the **extrapolated value** $T_{m,m}$ is **the value of the Lagrange interpolating polynomial at $x=0$**:

$$
T_{m,m} = \sum_{i=1}^{m} T_{i,1} \prod_{\substack{j=1 \ j \neq i}}^{m} \frac{0 - x_j}{x_i - x_j}
= \sum_{i=1}^{m} T_{i,1} \prod_{\substack{j=1 \ j \neq i}}^{m} \frac{-x_j}{x_i - x_j}
$$

* This is exactly a **Lagrange interpolation formula**, where we interpolate $F(x)$ at nodes $x_1, \dots, x_m$ and evaluate at $x=0$.

We omit the rigorous proof here, which can be done either use mathematical induction to show the equivalence to the recursive formula, or using the exactness of Lagrange interpolation on polynomials.


#### Explicitly in terms of $n_i$

* Recall $x_i = (1/n_i)^2$. Then:

$$
T_{m,m} = \sum_{i=1}^{m} T_{i,1} \prod_{\substack{j=1 \ j \neq i}}^{m} \frac{-(1/n_j)^2}{(1/n_i)^2 - (1/n_j)^2}
= \sum_{i=1}^{m} T_{i,1} \prod_{\substack{j=1 \ j \neq i}}^{m} \frac{-n_i^2}{n_j^2 - n_i^2}
$$

That is the **general formula** for the final extrapolated value in terms of the nodes $n_i$.







### 2.5. **Example: simple 3-step extrapolation**

Suppose $n_1 = 2$, $n_2 = 4$, $n_3 = 6$ substeps.

1. Compute $T_{1,1}, T_{2,1}, T_{3,1}$ using the modified midpoint method.
2. First extrapolation column:

$$
T_{2,2} = T_{2,1} + \frac{T_{2,1} - T_{1,1}}{(4/2)^2 - 1} = T_{2,1} + \frac{T_{2,1} - T_{1,1}}{3}
$$

$$
T_{3,2} = T_{3,1} + \frac{T_{3,1} - T_{2,1}}{(6/4)^2 - 1} = T_{3,1} + \frac{T_{3,1} - T_{2,1}}{5/4} = T_{3,1} + 0.8 (T_{3,1} - T_{2,1})
$$

3. Second extrapolation column (higher order):

$$
T_{3,3} = T_{3,2} + \frac{T_{3,2} - T_{2,2}}{(6/2)^4 - 1} = T_{3,2} + \frac{T_{3,2} - T_{2,2}}{80}
$$

* $T_{3,3}$ is now **8th-order accurate**.



## 3. **Expressing GBS as a single RK method**

Every extrapolation method can be rewritten as a **dense RK scheme** because it's a **linear combination of evaluations of $f(t, y)$ at specific points**.

* Let $f_0 = f(t_0, y_0)$, $f_1 = f(t_0 + h, y_1)$, etc.
* Each modified midpoint sequence produces intermediate values $y_k$ as linear combinations of $y_0$ and the $f_j$'s.
* Then, the extrapolation is a linear combination of these $y_n$ values, which themselves are linear combinations of $y_0$ and all $f_j$'s.

Hence, the **final extrapolated value** can be written as:

$$
y_{n+1} = y_0 + h \sum_i b_i f(t_0 + c_i h, Y_i)
$$

where $Y_i$ are stage values depending on previous $f_j$ (so it fits the RK form).

### 3.1 Example: simple 3-step extrapolation

Let resume with the example in the last section. We want to express it as an RK method. 

Of course, we need
$$
T_{1,1} = y(h, n_i), \quad i = 1,2,3
$$
which are computed via $n_i$ steps respectively. All three start at $Y_1 = y_0$. 
- $T_{i,1}$ used 2 steps: $Y_2$ as the intermediate step and $T_{1,1}$ is the final result
$$
\begin{align*}
Y_2 &= y_0 + H_1 f(Y_1) \\
T_{1,1} = Y_1 + 2 H_1 f(Y_2) &= y_0 + 2 H_1 f(Y_2)
\end{align*}
$$
where $H_1 = \frac{1}{2} h$.

- $T_{2,1}$ used 4 steps: we arrange $Y_3$ to $Y_5$ for the 3 intermediate steps
$$
\begin{align*}
Y_3 &= y_0 + H_2 f(Y_1) \\
Y_4 = Y_1 + 2H_2 f(Y_3) &= y_0 + 2H_2 f(Y_3) \\
Y_5 = Y_3 + 2H_2 f(Y_4) &= y_0 + H_2 [f(Y_1) + 2 f(Y_4)] \\
T_{2,1} = Y_4 + 2H_2 f(Y_5) &= y_0 + H_2 [2 f(Y_3) + 2 f(Y_5)] 
\end{align*}
$$
where $H_2 = \frac{1}{4} h$.

- $T_{3,1}$ used 6 steps: arrange $Y_6$ to $Y_10$ for the 5 intermediate steps
$$
\begin{align*}
Y_6 &= y_0 + H_3 f(Y_1) \\
Y_7 = Y_1 + 2 H_3 f(Y_6) &= y_0 + 2 H_3 f(Y_6) \\
Y_8 = Y_6 + 2 H_3 f(Y_7) &= y_0 + H_3 [f(Y_1) + 2 f(Y_7)] \\
Y_9 = Y_7 + 2 H_3 f(Y_8) &= y_0 + H_3 [2 f(Y_6) + 2 f(Y_8)] \\
Y_{10} = Y_8 + 2 H_3 f(Y_9) &= y_0 + H_3 [f(Y_1) + 2 f(Y_7) + 2 f(Y_9)] \\
T_{3,1} = Y_9 + 2 H_3 f(Y_{10}) &= y_0 + H_3 [2 f(Y_6) + 2 f(Y_8) + 2 f(Y_{10})]
\end{align*}
$$
where $H_3 = \frac{1}{6} h$.

Next, apply the explicit formula to compute $T_{3,3}$:

$$
T_{3,3}
= \sum_{i=1}^{3} T_{i,1} \prod_{\substack{j=1 \ j \neq i}}^{3} \frac{-n_i^2}{n_j^2 - n_i^2}
= \frac{1}{24} T_{1,1} - \frac{16}{15} T_{2,1} + \frac{81}{40} T_{3,1}
$$
which can be expressed as 
$$
y_1 = T_{3,3} = y_0 + h \sum_{i=1}^{10} b_i f(Y_i)
$$
where the value of $b_i$ can be obtained by a simple substitution. This is an $8^\text{th}$ order RK method of $10$ stages.



## 5. **Important notes**

* the number of stages is **equal to the total number of function evaluations in all substeps**.
* The tableau is usually **sparse** because each extrapolated stage depends on limited previous stages.
* We can construct many different RK tableaus using this method, but choosing $\{n_i^*\}$ in the vector representation as the harmonic sequence $1,2,3,\dots$ (which yield $\{n_i\}$ as $2,4,6,\dots$) with the modified midpoint (which has error expansion associated with $h^2$) seemed optimal.
* For low-order extrapolation (say $n=2,4$), it’s feasible to compute manually. For higher orders, it’s easier to compute numerically.



## 6. **References**

1. Hairer, Nørsett, Wanner — *Solving Ordinary Differential Equations I: Nonstiff Problems* (2nd edition), Section II.9.

    Section II.9 gives detailed explanation of GBS extrapolation methods.

