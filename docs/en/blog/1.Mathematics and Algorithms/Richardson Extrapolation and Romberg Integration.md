---
title: "Want to Get High Order? A Detailed Guide to Richardson Extrapolation and Romberg Integration"
createTime: 2025/11/17 16:43:00
permalink: /en/article/02konsuj/
tags:
  - Numerical Analysis
---

Numerical approximation methods often introduce errors that depend systematically on a step size $h$. If we understand how the error depends on $h$, we can combine several approximations to eliminate the dominant error term, often obtaining a dramatic increase in accuracy at very low extra cost.

Two classic techniques built on this idea are **Richardson extrapolation** and **Romberg integration**. Both ultimately rely on the structure revealed by the **Euler-Maclaurin formula**.

## 1. Richardson extrapolation

Suppose a numerical method produces approximations $A(h)$ to an exact value $A$, and that

$$
A(h) = A + C h^p + D h^{p+1} + O(h^{p+2}),
$$

where $p>0$ is known and $C,D$ are unknown constants.

The key observation is that the leading error term appears in both $A(h)$ and $A(h/2)$:

$$
A(h/2) = A + C \left(\frac{h}{2}\right)^p + D \left(\frac{h}{2}\right)^{p+1} + \cdots
$$

Multiply the second equation by $2^p$ and subtract $A(h)$:

$$
2^p A(h/2) - A(h) = (2^p - 1)A + O(h^{p+1}).
$$

So we obtain the Richardson formula

$$
\boxed{
R(h)=\frac{2^p A(h/2)-A(h)}{2^p-1}
}
$$

which removes the leading error term.

## 2. Why this is powerful

Richardson extrapolation works whenever we know the asymptotic error structure of a base method. It is especially efficient for **symmetric methods**, because their error expansions contain only even powers of $h$:

$$
A(h)=A+C_1 h^2 + C_2 h^4 + C_3 h^6 + \cdots
$$

In that setting, one extrapolation step can increase the order by two rather than one.

## 3. Romberg integration

Romberg integration applies Richardson extrapolation to the composite trapezoidal rule.

Let

$$
T(h)
$$

denote the trapezoidal approximation with mesh width $h$. The Euler-Maclaurin formula shows that

$$
T(h)=I + c_1 h^2 + c_2 h^4 + c_3 h^6 + \cdots,
$$

where $I$ is the exact integral. Since the expansion contains only even powers, repeated Richardson extrapolation becomes especially natural.

Set

$$
R_{k,1}=T(h_k), \qquad h_k=\frac{b-a}{2^{k-1}}.
$$

Then define the Romberg table recursively by

$$
R_{k,j}
=
R_{k,j-1}
+
\frac{R_{k,j-1}-R_{k-1,j-1}}{4^{j-1}-1}.
$$

Each new column eliminates one more even-power error term.

## 4. Final remarks

The philosophy behind both methods is worth remembering:

> If you understand the shape of the error, you can often cancel it systematically instead of merely refining the mesh blindly.

Richardson extrapolation is the general idea. Romberg integration is one of its cleanest and most beautiful realizations.
