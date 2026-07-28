---
title: Use PIL (Pillow) to load and save images
createTime: 2026/07/28 21:27:57
permalink: /blog/qgkjf50b/
---

PIL originally meant Python Imaging Library, a library for opening, converting, and manipulating images. The original PIL project is no longer maintained; its modern replacement is Pillow, a compatible fork.

We install Pillow:

```bash
pip install pillow
```

but import it using the historical module name:

```python
from PIL import Image
```

Python’s standard library does not contain a general-purpose image-processing package capable of conveniently decoding and manipulating formats such as PNG and JPEG. It can read the raw file bytes, but interpreting those bytes requires an external library.

Common choices are:

- Pillow: basic image loading, saving, cropping, resizing, and pixel manipulation.
- OpenCV: computer vision and more advanced image processing.
- scikit-image: scientific image-processing algorithms.
- imageio: straightforward image and video input/output.

Here is an example of loading a grayscale image, converting it to a NumPy array, and saving it back to disk:

```python
from PIL import Image
import numpy as np

# Load an image
image = Image.open('input_image.png')  # Replace with your image file path

# Convert to grayscale
image_gray = image.convert('L')

# Convert to NumPy array
image_array = np.array(image_gray)

# Code to manipulate the image_array if needed
# For example, you could perform operations like:
# image_array = image_array * 1.5  # Increase brightness
# image_array = np.clip(image_array, 0, 255)  # Clamp values to valid range

# Save the manipulated image
image_array = np.clip(image_array, 0, 255).astype(np.uint8)  # Ensure values are in the valid range
image_gray = Image.fromarray(image_array)
image_gray.save('output_image.png')  # Save the image to a new file
```
