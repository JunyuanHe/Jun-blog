---
title: 实现GPT：多头注意力机制
createTime: 2025/10/30 15:56:17
permalink: /article/fzl8flqb/
tags:
    - LLM
draft: true
---

现代LLM的核心是Transformer架构，而Transformer的核心是（多头）注意力机制。

下面我们来分析如何实现多头注意力机制的代码。

PyTorch 中一个典型的多头注意力（Multi-Head Self-Attention）实现代码如下：

```python
class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        assert d_model % n_heads == 0
        self.n_heads = n_heads
        self.head_dim = d_model // n_heads
        self.qkv = nn.Linear(d_model, 3 * d_model)
        self.proj = nn.Linear(d_model, d_model)

    def forward(self, x):
        B, T, C = x.shape
        qkv = self.qkv(x).view(B, T, 3, self.n_heads, self.head_dim)
        q, k, v = qkv.unbind(dim=2)
        att = (q @ k.transpose(-2, -1)) / math.sqrt(self.head_dim)
        mask = torch.tril(torch.ones(T, T, device=x.device))
        att = att.masked_fill(mask == 0, float('-inf'))
        att = F.softmax(att, dim=-1)
        out = att @ v
        out = out.transpose(1, 2).contiguous().view(B, T, C)
        return self.proj(out)
```

---

## 1. 概念说明

**多头注意力机制（Multi-Head Attention）**是 Transformer 模型的核心模块之一。
它的主要作用是：

1. 将输入序列映射为 **查询（Q）**、**键（K）**、**值（V）**。
2. 计算注意力分数，让每个位置的表示关注序列中不同位置的信息。
3. 将每个注意力头的输出进行合并，并线性映射回原始维度。

**参数说明**：

- `d_model`：输入 embedding 的维度。
- `n_heads`：注意力头的数量。
- 每个头的维度：`head_dim = d_model // n_heads`。

---

## 2. 代码分析

### 2.1 初始化（`__init__` 方法）

```python
assert d_model % n_heads == 0
self.n_heads = n_heads
self.head_dim = d_model // n_heads
self.qkv = nn.Linear(d_model, 3 * d_model)
self.proj = nn.Linear(d_model, d_model)
```

- `qkv`：一次性将输入映射为 Q、K、V，输出维度是 `3*d_model`。
- `proj`：将多头注意力的输出重新投影回原始维度 `d_model`。
- `head_dim`：每个头的维度，保证能均分 `d_model`。

---

### 2.2 前向传播（`forward` 方法）

#### 1) 输入形状

```python
B, T, C = x.shape
```

* `B`：batch size（一次同时处理多少个序列）
* `T`：Time steps / Sequence Length 时间步长 / 序列长度（一个序列中有多少个token）
* `C`：Channels / Embedding dimension 通道数 / 嵌入维度（每个token用多少维的向量表示）

---

#### 2) 生成 Q、K、V

```python
qkv = self.qkv(x).view(B, T, 3, self.n_heads, self.head_dim)
q, k, v = qkv.unbind(dim=2)
```

* `self.qkv(x)` 输出 `(B, T, 3*d_model)`。
* `.view(B, T, 3, n_heads, head_dim)` 将其维度重构，原来的最后一个维度分为三部分。
* `unbind(dim=2)` 拆分为 `q, k, v` 三个张量，每个张量形状为 `(B, T, n_heads, head_dim)`。

---

#### 3) 计算注意力分数

```python
att = (q @ k.transpose(-2, -1)) / math.sqrt(self.head_dim)
```

* Q 和 K 的点积表示相关性。
* 除以 `sqrt(head_dim)` 进行缩放，防止数值过大导致 softmax 梯度消失。
* 输出形状：`(B, n_heads, T, T)`。

---

#### 4) 施加因果掩码（Causal Mask）

```python
mask = torch.tril(torch.ones(T, T, device=x.device))
att = att.masked_fill(mask == 0, float('-inf'))
```

* 下三角掩码保证每个位置只能关注**当前位置及之前的 token**。
* 这是自回归生成模型（如 GPT）的必要步骤。

---

#### 5) Softmax 归一化

```python
att = F.softmax(att, dim=-1)
```

* 将注意力分数转换为概率分布。
* 注意力矩阵每行的和为 1。

---

#### 6) 应用注意力权重到 V

```python
out = att @ v
```

* 输出形状 `(B, n_heads, T, head_dim)`。
* 每个头的输出是对序列中值的加权求和。

---

#### 7) 合并头并线性映射

```python
out = out.transpose(1, 2).contiguous().view(B, T, C)
return self.proj(out)
```

* `transpose` 调整维度为 `(B, T, n_heads, head_dim)`。
* `view(B, T, C)` 将多头拼接成原始维度。
* `proj` 将拼接后的输出映射回 `d_model`，作为最终输出。

---

## 3. 总结

多头注意力机制的核心流程可以概括为：

1. **线性映射生成 Q、K、V**
2. **计算缩放点积注意力**
3. **施加掩码（可选）**
4. **Softmax 获得注意力权重**
5. **将注意力权重应用于 V**
6. **合并多头输出并投影**

> 通过多头注意力，模型可以在不同子空间捕捉序列中不同位置的依赖关系，增强表示能力。

