---
title: "Want to get high order? —— A Detailed Guide to Richardson Extrapolation and Romberg Integration"
createTime: 2025/11/17 16:43:00
permalink: /article/02konsuj/
---

Numerical approximation methods often introduce errors that depend systematically on a **step size** $h$.
If we understand *how* the error depends on $h$, we can combine multiple approximations to eliminate the dominant error term — often leading to dramatic accuracy improvements at almost no additional cost.

Two celebrated techniques that exploit this idea are **Richardson extrapolation** and **Romberg integration**.
Both ultimately trace back to the structure of the **Euler–Maclaurin formula**.

This article provides a detailed, mathematically explicit guide to all three.


## 1. Richardson Extrapolation (With Derivation)

Suppose a numerical method produces approximations $A(h)$ to some exact value $A$, and that:

$$
\boxed{A(h) = A + C h^p + D h^{p+1} + O(h^{p+2})}
$$

for some unknown constants $C, D$ and known order $p > 0$.

The key observation is that the **leading error term** $C h^p$ appears in both $A(h)$ and $A(h/2)$:

$$
A(h/2) = A + C\left(\frac{h}{2}\right)^p + D\left(\frac{h}{2}\right)^{p+1} + \cdots
$$

Let’s eliminate the common $C h^p$ term.

### 1.1 Eliminating the leading error term

Write:

$$
A(h) = A + C h^p + O(h^{p+1})
$$
$$
A(h/2) = A + C \frac{h^p}{2^p} + O(h^{p+1})
$$

Multiply the second equation by $2^p$:

$$
2^p A(h/2) = 2^p A + C h^p + O(h^{p+1})
$$

Now subtract:

$$
2^p A(h/2) - A(h)
= (2^p - 1)A + O(h^{p+1})
$$

Solve for $A$:

$$
A = \frac{2^p A(h/2) - A(h)}{2^p - 1} + O(h^{p+1})
$$

This is the **Richardson extrapolation formula**:

$$
\boxed{
R(h) = \frac{2^p A(h/2) - A(h)}{2^p - 1}
}
$$

Richardson extrapolation increases accuracy by **at least one order**, and often by **two full orders** for symmetric methods (because symmetric methods have error expansions only involving even powers of $h$).


### 1.2 Repeated Richardson Extrapolation

Once we have the basic Richardson formula:

$$
R(h) = \frac{2^p A(h/2) - A(h)}{2^p - 1},
$$

we can apply it **repeatedly** to further reduce the error.

Suppose we have a sequence of approximations at step sizes $h, h/2, h/4, \dots$.
We can construct a table of extrapolated values:

$$
\begin{aligned}
R_{0,0} &= A(h),\\
R_{1,0} &= A(h/2),\\
R_{2,0} &= A(h/4), \dots
\end{aligned}
$$

Then apply Richardson recursively along the "columns":

$$
\boxed{
R_{k,j} = \frac{2^{p j} R_{k,j-1} - R_{k-1,j-1}}{2^{p j} - 1}, \quad j = 1,2,\dots,k
}
$$

* $R_{k,1}$ eliminates the first leading error term.
* $R_{k,2}$ eliminates the next term, and so on.

This process forms a Richardson extrapolation table:
$$
\begin{array}{ccccc}
R_{0,0} &         &         &         &      \\
R_{1,0} & R_{1,1} &         &         &      \\
R_{2,0} & R_{2,1} & R_{2,2} &         &      \\
\vdots  & \vdots  & \vdots  & \ddots  &      \\
R_{k,0} & R_{k,1} & R_{k,2} & \cdots  & R_{k,k} 
\end{array}
$$

This repeated extrapolation **systematically cancels successive error terms**, dramatically improving accuracy without additional derivations of new formulas.


## 2. Romberg Integration (Richardson Applied Iteratively)

Romberg integration exactly follows the idea of Richardson extrapolation applied to th composite trapezoidal rule: a repeated Richardson extrapolation that eliminates successive terms in the trapezoidal error expansion.


The definite integral

$$
I = \int_a^b f(x)\,dx
$$

is approximated using the composite trapezoidal rule with step $h = (b-a)/n$:

$$
T(h) = h\Bigg[\frac{f(a)+f(b)}{2} + \sum_{k=1}^{n-1} f(a + kh)\Bigg].
$$

### 2.1 Error expansion of the trapezoidal rule

The trapezoidal rule has a beautiful asymptotic expansion:

$$
T(h) = I + C_1 h^2 + C_2 h^4 + C_3 h^6 + \cdots
$$

This fact is *not* an accident — it comes directly from the Euler–Maclaurin formula (discussed later).
Crucially:

* only **even powers** appear,
* the leading accuracy order is $p=2$.

### 2.2 Romberg Recursion

**First Richardson step (4th-order integration)**

Apply Richardson with $p = 2$:

$$
R_{1}(h)
= \frac{4T(h/2) - T(h)}{3}.
$$

This eliminates the $C_1 h^2$ term and yields a **4th-order approximation**.

**Second Richardson step (6th-order)**

$$
R_{2}(h)
= \frac{16R_{1}(h/2) - R_{1}(h)}{15}.
$$

This cancels the $C_2 h^4$ term and yields a **6th-order method**.

**General Romberg recursion**

Let:

* $R_{k,0} = T\left(\dfrac{b-a}{2^k}\right)$
* $R_{k,j}$ be the result after $j$ Richardson steps

Then:

$$
\boxed{
R_{k,j} =
\frac{4^{j} R_{k,j-1} - R_{k-1,j-1}}{4^{j} - 1}
}
$$

The Romberg tableau emerges:
$$
\begin{array}{cccccc}
R_{0,0} &         &         &         &         &      \\
R_{1,0} & R_{1,1} &         &         &         &      \\
R_{2,0} & R_{2,1} & R_{2,2} &         &         &      \\
\vdots  & \vdots  & \vdots  & \ddots  &         &      \\
R_{k,0} & R_{k,1} & R_{k,2} & \cdots  & R_{k,k} &      \\
\vdots  & \vdots  & \vdots  &         & \vdots  & \ddots
\end{array}
$$

Diagonal entries $R_{k,k}$ converge extremely quickly.


## 3. The Euler–Maclaurin Formula: The Theoretical Backbone

The Euler–Maclaurin summation formula states:

$$
\int_a^b f(x),dx
=
h\Bigg[
\frac{f(a)+f(b)}{2}
 + \sum_{k=1}^{n-1} f(a+kh)
  \Bigg]
- \sum_{m=1}^{\infty}
  \frac{B_{2m}}{(2m)!} h^{2m}
  \left(f^{(2m-1)}(b) - f^{(2m-1)}(a)\right),
$$

where $B_{2m}$ are Bernoulli numbers.

The bracketed part is exactly the composite trapezoidal formula $T(h)$. This formula gives an explicit error expansion of the composite trapezoidal rule. Thus:

$$
T(h) = I + C_1 h^2 + C_2 h^4 + C_3 h^6 + \cdots,
$$

with explicit

$$
C_m =
-\frac{B_{2m}}{(2m)!} \bigl(f^{(2m-1)}(b) - f^{(2m-1)}(a)\bigr).
$$

This structure (even powers, smooth coefficient behavior) is what makes Romberg so effective.


## 4. Summary: How Euler–Maclaurin, Richardson, and Romberg Fit Together

**Why Romberg Works: Eliminating Euler–Maclaurin Terms**

Euler–Maclaurin shows:

$$
T(h) = I + C_1 h^2 + C_2 h^4 + C_3 h^6 + \cdots.
$$

Each Richardson step in Romberg cancels one of these terms:

* $R_{k,0}$: error $O(h^2)$
* $R_{k,1}$: error $O(h^4)$
* $R_{k,2}$: error $O(h^6)$
* $R_{k,3}$: error $O(h^8)$

Thus:

$$
\text{Romberg} = \text{Richardson extrapolation} + \text{trapezoidal rule}
$$
driven by
$$
\text{Euler–Maclaurin error structure}.
$$

This "error peeling" explains Romberg's rapid convergence.

**When Romberg Succeeds (Euler–Maclaurin Validity)**

Romberg performs exceptionally well when Euler–Maclaurin applies cleanly — that is, when:

* $f$ is smooth on $[a,b]$,
* derivatives exist and are well-behaved at endpoints,
* the integrand is non-oscillatory,
* the interval is finite.

In such cases, error terms behave predictably and Romberg approaches machine precision quickly.

**When Romberg Struggles or Fails**

Romberg falters precisely in situations where Euler–Maclaurin fails:

* endpoint singularities (e.g., $f(x)=\sqrt{x}$),
* highly oscillatory functions,
* functions with discontinuities or corners,
* improper integrals or infinite intervals.

In these cases, the even-power expansion breaks down, preventing Richardson from eliminating error terms cleanly.

**Summary**

Romberg integration works because Euler–Maclaurin provides a clean even-power error expansion for the trapezoidal rule, and Richardson extrapolation cancels these terms systematically.
