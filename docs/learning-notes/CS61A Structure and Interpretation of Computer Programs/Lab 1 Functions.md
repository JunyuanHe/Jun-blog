---
title: Lab 1 Functions
createTime: 2026/07/23 10:47:31
permalink: /learning-notes/36i7h2tz/
draft: true
---

## Q3: Pick a Digit

Implement digit, which takes positive integers `n` and `k` and has only a single return statement as its body. It returns the digit of `n` that is `k` positions to the left of the rightmost digit (the one's digit). If `k` is `0`, return the rightmost digit. If there is no digit of `n` that is `k` positions to the left of the rightmost digit, return `0`.

Hint: Use `//` and `%` and the built-in pow function to isolate a particular digit of `n`.

```python
def digit(n, k):
    """Return the digit that is k from the right of n for positive integers n and k.

    >>> digit(3579, 2)
    5
    >>> digit(3579, 0)
    9
    >>> digit(3579, 10)
    0
    """
    return ____
```