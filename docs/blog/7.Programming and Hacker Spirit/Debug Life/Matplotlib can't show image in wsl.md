---
title: "Matplotlib can't show image in WSL"
createTime: 2026/07/28 20:22:22
permalink: /blog/7wcf0uqb/
---

It is a common problem on WSL that GUI based applications cannot be displayed. For example, when you try to use `matplotlib` to show an image, it may not work as expected. This is because WSL does not have a native display server.

Luckily, current WSL 2 supports Linux GUI applications through WSLg on Windows 10 build 19044+ and Windows 11. From an administrator PowerShell terminal, update and restart WSL:

```powershell
wsl --update
wsl --shutdown
```

Then reopen WSL and test:

```bash
sudo apt update
sudo apt install x11-apps -y
xeyes
```

If xeyes opens normally, GUI forwarding is working. Then we should be able to use `matplotlib` to show images in WSL. 


It is probably a better solution to save the image to a file:

```python highlight:2
import matplotlib.pyplot as plt
plt.savefig('output.png')  # Save the plot as a PNG file
```

Or you can use `plt.imsave` to save an image array directly:

```python highlight:6
import matplotlib.pyplot as plt
import numpy as np

# Create a sample image array
image_array = np.random.rand(100, 100, 3)  # Random RGB image
plt.imsave('output_image.png', image_array)  # Save the image array
```

If we are using Jupyter Notebook or Jupyter Lab, we can use the `%matplotlib inline` magic command to display plots directly in the notebook:

```python highlight:1
%matplotlib inline
import matplotlib.pyplot as plt
import numpy as np
# Create a sample image array
image_array = np.random.rand(100, 100, 3)  # Random RGB image
plt.imshow(image_array)  # Display the image
plt.axis('off')  # Turn off axis
plt.show()  # Show the plot
```


