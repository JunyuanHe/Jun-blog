---
title: Determining focal length geometrically
createTime: 2026/07/29 11:12:23
permalink: /blog/1yrkxefy/
---

:::note
These exercise is from CMU 16-281 homework 2.
:::

Imagine you are working with a robot equipped with a Raspberry Pi Camera Module 3 that requires characterization. You aim to determine the distance between the lens and the image sensor (commonly referred to as the focal length) to use this information for future experiments involving distance estimation.

To approach this, you conduct an experiment:

- You position a one-inch cube exactly 12 inches (30.48 cm) away from the camera, ensuring the cube is centered in the camera’s field of view.
- After capturing an image, you threshold and segment the image, counting the number of pixels corresponding to the cube’s width.
- Repeating this process 10 times, you calculate an average width of 120 pixels for the one-inch cube.
- The camera’s sensor resolution is known to be 4608 × 2592 pixels (horizontal and vertical respectively), with a sensor size of 6.45 mm horizontally.

Using this information, what is the focal length of the camera in millimeters? Please include at least one symbolic equation that you used with your answer.

## My Solution

Let $w_s$ be the object's width on the sensor, $Z$ be the distance from the camera to the object, and $W$ be the actual width of the object. Then
$$
\frac{w_s}{f} = \frac{W}{Z},
$$
so $f = w_s \frac{Z}{W}$, where
$$
w_s = \text{sensor width in mm} \times \frac{\text{object width in px}}{\text{horizontal resolution in px}}
$$

The corresponding Python code to calculate the focal length is as follows:

```python
def estimate_focal_length(
    *,
    object_width_mm: float,
    object_distance_mm: float,
    object_pixels: int,
    sensor_resolution: int,
    sensor_size_mm: float
) -> float:
    projected_width_mm = sensor_size_mm * object_pixels / sensor_resolution
    focal_length_mm = projected_width_mm * object_distance_mm / object_width_mm
    return focal_length_mm
```