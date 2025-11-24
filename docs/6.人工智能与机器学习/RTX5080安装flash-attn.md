---
title: RTX5080 显卡安装 flash-attn
createTime: 2025/11/24 20:58:06
permalink: /article/o0lqcpqr/
---

首先，必须要感谢 MinChoi0129 在这个[issue](https://github.com/Dao-AILab/flash-attention/issues/2016)中提供的信息。链接已附上供参考。

作为第一次 build flash-attn 这个包的新手，和大家一样，一开始也是失败的。GitHub也有无数的人尝试了无数次都不成功。其实，如果 Python 版本，PyTorch 版本和 CUDA 版本选的不好，就会进入 build from source 的模式，不仅占用内存巨大(~40GB)，耗时巨长 (30min~1h)，而且结果往往是编译失败告终。

我在此也来分享一下成功的版本选择。

硬件方面：显卡是 RTX 5080

系统方面：WSL 2 (Ubuntu 22.04.5)

软件方面：
- Python=3.10
- CUDA=12.8
- torch=2.7.1 (`pip install torch==2.7.1 torchvision==0.22.1 torchaudio==2.7.1 --index-url https://download.pytorch.org/whl/cu128`)

安装的 Flash Attention 版本：flash-attn=2.8.3

安装时使用如下命令：
```bash
pip install flash-attn torch==2.7.1 --no-build-isolation
```
内存几乎无额外占用，耗时约 1 min，就安装成功了。希望大家可以不用像我一样踩坑。