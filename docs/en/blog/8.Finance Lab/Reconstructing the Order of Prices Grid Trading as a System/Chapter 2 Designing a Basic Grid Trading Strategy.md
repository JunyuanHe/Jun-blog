---
title: Chapter 2 Designing a Basic Grid Trading Strategy
createTime: 2025/10/07 13:13:48
permalink: /article/jtaacs8s_en/
tags:
  - Grid Trading
---

## 1. From volatility harvesting to parameter design

In the previous chapter, the core idea of grid trading was stated very simply:

> use price fluctuations to repeatedly buy low and sell high, and collect structural spread income.

This chapter asks the next practical question:

> How do we quantify and design that structure?

## 2. Price range, number of grids, and spacing

A standard grid system can be abstracted as:

| Parameter | Symbol | Meaning |
| --- | --- | --- |
| Upper bound | $P_{\text{max}}$ | highest price in the grid range |
| Lower bound | $P_{\text{min}}$ | lowest price in the grid range |
| Number of grids | $N$ | number of grid layers |
| Grid spacing | $\Delta P$ | distance between adjacent levels |

### Arithmetic grid

For an arithmetic grid:

$$
\Delta P = \frac{P_{\text{max}} - P_{\text{min}}}{N}
$$

### Geometric grid

For a geometric grid:

$$
r = \left(\frac{P_{\text{max}}}{P_{\text{min}}}\right)^{1/N},\quad P_i=P_{\text{min}}r^i
$$

### Choosing the range

A useful rule of thumb is to let the range cover roughly **95% of the expected fluctuation zone**.

- a range that is too narrow triggers often but is easy to break out of;
- a range that is too wide spreads capital too thin and dilutes return density.

## 3. Arithmetic vs geometric grids

An arithmetic grid is intuitive and easy to compute. A geometric grid is often better when volatility scales with price.

The choice is not purely mathematical. It reflects how the market actually moves.

## 4. Initial position building

Two common starting modes are:

- **aggressive start**: build a meaningful base position immediately;
- **gradual start**: let the system accumulate inventory step by step.

In practice, many systems use a hybrid form.

## 5. A simple return and drawdown view

If the grid spacing is $\Delta P$ and the trade size per execution is $q$, then the profit of one completed buy-sell cycle is approximately

$$
\text{Profit}_1 = q \cdot \Delta P.
$$

This makes the basic trade-off very clear:

> tighter spacing improves trading frequency, but wider exposure increases path risk.

## Final remarks

A basic grid system is not just a set of orders. It is a parameterized structure.

Its performance depends on whether the chosen range, spacing, layer count, and capital allocation are aligned with the volatility characteristics of the traded asset.

