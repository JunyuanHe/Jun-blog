---
title: Exercises in filter operation
createTime: 2026/07/28 22:12:51
permalink: /blog/jjg066p1/
---

:::note
These exercises are from CMU 16-281 homework 2.
:::

## Problem 

The following exercises demonstrate the practical applications of filters:
1. Design a 3×3 filter that computes the average of the nine pixels it overlaps
with.
2. Create a 3×3 filter that computes the average using the center pixel and its
four neighbors, based on 4-point connectivity.
3. Develop a 3×3 filter that calculates a weighted average of the nine overlapping
pixels, assigning more weight to the center pixel. Ensure all weights sum to 1.
4. Construct a 3×3 filter capable of detecting vertical lines in an image.


## My Solution

```python
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt

def average_kernel():
    return np.ones((3,3), dtype=np.float64) / 9.0

def four_connected_avg_kernel():
    kernel = np.array(
        [
            [0.0, 1.0, 0.0],
            [1.0, 1.0, 1.0],
            [0.0, 1.0, 0.0]
        ]
    )
    return kernel / kernel.sum()

def center_weighted_kernel(center_weight = 4.0):
    kernel = np.ones((3,3), dtype=np.float64)
    kernel[1,1] = center_weight
    return kernel / kernel.sum()

def vertical_line_kernel():
    return np.array(
        [
            [-1.0, 2.0, -1.0],
            [-1.0, 2.0, -1.0],
            [-1.0, 2.0, -1.0],
        ]
    )

def load_grayscale(path):
    return np.asarray(Image.open(path).convert("L"), dtype=np.float64)

def save_grayscale(path, image):
    clipped = np.clip(image, 0, 255).astype(np.uint8)
    Image.fromarray(clipped, mode="L").save(path)

def apply_filter(image, kernel, padding: str = "edge"):
    image = np.asarray(image, dtype=np.float64)
    kernel = np.asarray(kernel, dtype=np.float64)

    if image.ndim != 2:
        raise ValueError("image must be a 2-D grayscale array")
    if kernel.ndim != 2:
        raise ValueError("kernel must be a 2-D array")
    if kernel.shape[0] % 2 == 0 or kernel.shape[1] % 2 == 0:
        raise ValueError("kernel dimensions must be odd")

    pad_y = kernel.shape[0] // 2
    pad_x = kernel.shape[1] // 2
    padded = np.pad(image, ((pad_y, pad_y), (pad_x, pad_x)), mode=padding)
    output = np.empty_like(image, dtype=np.float64)

    for y in range(image.shape[0]):
        for x in range(image.shape[1]):
            patch = padded[y : y + kernel.shape[0], x : x + kernel.shape[1]]
            output[y, x] = np.sum(patch * kernel)

    return output

def main():
    image = load_grayscale("waldoScene1.png")
    save_grayscale("saved_waldoScene1.png", image)

    kernels = {
        "average": average_kernel(),
        "four_connected": four_connected_avg_kernel(),
        "center_weighted": center_weighted_kernel(),
        "vertical_line": vertical_line_kernel(),
    }

    for name, kernel in kernels.items():
        print(f"\n{name}\n{kernel}")
        filterd_image = apply_filter(image, kernel)
        save_grayscale(f"output/filtered_image_{name }.png", filterd_image)

if __name__ == "__main__":
    main()
```
