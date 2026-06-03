---
title: Installing flash-attn on an RTX 5080
createTime: 2025/11/24 20:58:06
permalink: /article/o0lqcpqr/
tags:
  - LLM
---

First, I have to thank MinChoi0129 for the information shared in this [issue](https://github.com/Dao-AILab/flash-attention/issues/2016).

As a beginner trying to build the `flash-attn` package for the first time, I ran into the same failures as many other people. If your Python version, PyTorch version, and CUDA version are not chosen carefully, the install falls back to build-from-source mode. That mode not only consumes a huge amount of memory (~40 GB) and a lot of time (30 minutes to 1 hour), but also often ends in a failed build.

So here is one version combination that worked for me.

Hardware:

- GPU: RTX 5080

System:

- WSL 2 (Ubuntu 22.04.5)

Software:

- Python = 3.10
- CUDA = 12.8
- torch = 2.7.1  
  (`pip install torch==2.7.1 torchvision==0.22.1 torchaudio==2.7.1 --index-url https://download.pytorch.org/whl/cu128`)

Flash Attention version:

- `flash-attn = 2.8.3`

Installation command:

```bash
pip install flash-attn torch==2.7.1 --no-build-isolation
```

With this combination, memory usage was almost unchanged and the installation succeeded in about one minute.
