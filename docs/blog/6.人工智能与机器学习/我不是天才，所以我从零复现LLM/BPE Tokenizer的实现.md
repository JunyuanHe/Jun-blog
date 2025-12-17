---
title: BPE Tokenizer的实现
createTime: 2025/10/22 19:28:57
permalink: /article/dirq0u1t/
---

<!-- ## 专栏序言

本专栏将完整记录我如何从一行行代码开始，复现一个现代语言模型的全部过程。这里没有魔法，只有PyTorch/TensorFlow、数学公式、无数的Bug和解决问题的喜悦。我将分享全量代码、核心知识图解、踩坑实录和调参心得，旨在与所有对LLM底层原理好奇的朋友一起，亲手揭开大模型的神秘面纱。 -->

Byte-Pair Encoding Tokenizer，简称BPE tokenizer，是现代大模型中普遍采用的分词器类型。在本篇笔记中，我们将一起实现一个BPE分词器。

## 子词分词与BPE算法

深度学习模型是一个数学模型，其输入和输出都只能是张量，它无法直接处理文本数据。为了让深度学习模型处理文本类型的输入，我们需要首先将文本转化为数字。分词（Tokenization），指的就是将字符串唯一对应到一个整数序列的过程。

在深度学习之前，常见的分词方法有：

- 按词分词： 将文本按空格分割。问题：词汇表会无限膨胀，且无法处理未登录词。

- 按字符分词： 将文本拆分成单个字符。问题：序列长度过长，单个字符的语义信息很弱。

BPE 聪明地找到了一个折中点。它通过一种数据驱动的、统计的方式，自动地在“词”和“字符”之间找到最有信息量的子词单元（Subword Units）。这使得它能够：

- 有效控制词汇表大小。

- 平衡词汇量和序列长度。

优雅地处理未知词和罕见词（例如，"unhappiness" 可以被拆分为 "un" + "happi" + "ness"）。

## BPE算法的核心思想

BPE 的核心思想异常简单：从最基础的字符开始，迭代地合并出现频率最高的相邻符号对，直到达到预定的词汇表大小。

这个过程就像搭乐高：

开始时，你只有一堆最基础的积木块（字符）。你观察哪些积木块最常被并排使用，然后把它们粘在一起，形成一个新的、更大的积木块。重复这个过程，直到你拥有了所有你需要的、不同大小的积木块。

### 用一个例子看明白BPE算法

假设我们有如下小型语料库：
`"low low lower newest newest widest widest widest"`

**步骤 1：初始化基础词汇**
分词器的词汇表是一个从字节串到整数ID的一一映射，在实现时通常使用一个字典表示。由于 BPE 处理的是字节序列，所以，首先我们将文本转换成 Unicode 编码（如 UTF-8）得到对应的字节序列。基础词汇取为单个字节能够表示的所有元素的集合，外加一些预先指定的特殊符号。由于单个字节有 256 个可能的值，所以基础词汇表的大小为 (256+预定义的特殊符号的数量) 。

但为了在概念上讲解这一过程，我们可以先简单地将每个单词拆分成字符（每个字符视为一个字节），并使用一个特殊符号 `</w>` 来标记空格。初始词汇也只取语料库中出现过的字符。

初始词汇：`l, o, w, e, r, n, s, t, i, d, </w>`

其字典表示为：`{"l":1, "o":2, "w":3, "e":4, "r":5, "n":6, "s":7, "t":8, "i":9, "d":10, "</w>":11}`

**步骤 2：预分词**

我们首先进行预分词，将单词按照空格与标点切分，并统计不同单词出现的频率。这样可以降低后续BPE合并的复杂度，并且避免跨单词边界的合并以及单词与标点的合并。

| 单词 | 符号表示（初始） | 频率 |
| :--- | :--- | :--- |
| `low` | `("l", "o", "w")` | 1 |
| `</w>low` | `("</w>", "l", "o", "w")` | 1 |
| `</w>lower` | `("</w>", "l", "o", "w", "e", "r")` | 1 |
| `</w>newest` | `("</w>", "n", "e", "w", "e", "s", "t")` | 2 |
| `</w>widest` | `("</w>", "w", "i", "d", "e", "s", "t")` | 3 |

**步骤 3：迭代合并**
现在，我们开始合并最频繁的符号对。

-   **第一轮合并：** 找出频率最高的符号对。`("e", "s")`, `("s", "t")` 均出现了 5 次。但出现平局时，我们选取按字典序最大的符号对进行合并。
    *   更新词汇表：`{"l":1, "o":2, "w":3, "e":4, "r":5, "n":6, "s":7, "t":8, "i":9, "d":10, "</w>":11, "st":12}`
    *   更新单词表示：
        *   `</w>newest`： `("</w>", "n", "e", "w", "e", "s", "t")` -> `("</w>", "n", "e", "w", "e", "st")`
        *   `</w>widest`： `("</w>", "w", "i", "d", "e", "s", "t")` -> `("</w>", "w", "i", "d", "e", "st")`

-   **第二轮合并：** 现在，`("e", "st")` 出现了 5 次。合并为 `"est"`。
    *   更新词汇表：`{"l":1, "o":2, "w":3, "e":4, "r":5, "n":6, "s":7, "t":8, "i":9, "d":10, "</w>":11, "st":12, "est":13}`
    *   更新单词表示：
        *   `</w>newest`： `("</w>", "n", "e", "w", "e", "st")` -> `("</w>", "n", "e", "w", "est")`
        *   `</w>widest`： `("</w>", "w", "i", "d", "e", "st")` -> `("</w>", "w", "i", "d", "est")`

-   **第三轮合并：** `("l", "o")` 和 `("o", "w")` 均出现了 3 次（在 `low` 和 `lower` 中）。选择字典序较大的合并为 `"ow"`。
    *   更新词汇表：`{"l":1, "o":2, "w":3, "e":4, "r":5, "n":6, "s":7, "t":8, "i":9, "d":10, "</w>":11, "st":12, "est":13, "ow":14}`
    *   更新单词表示：
        *   `low`： `("l", "o", "w")` -> `("l", "ow")`
        *   `</w>low`: `("</w>", "l", "o", "w")` -> `("</w>", "l", "ow")`
        *   `</w>lower`： `("</w>", "l", "o", "w", "e", "r")` -> `("</w>", "l", "ow", "e", "r")`

... 如此继续，直到达到我们设定的合并次数或词汇表大小。最终我们可能会得到像 `lo`, `w`, `est`, `low`, `new`, `est` 等有意义的子词。


## 手把手实现BPE算法

BPE算法分为三个模块：训练、编码、解码

### 训练

在正式编码之前，我们首先关注一下预分词器。原始BPE的实现（Sennrich et al. [2016]）中，预分词只是简单地按照空格分词，即 `s.split(" ")`. 其缺点是明显的，空格丢失了，也并未将单词与标点分开。此处我们采用基于正则表达式的预分词器（GPT-2使用的版本; Radford et al., 2019），详见[](github.com/openai/tiktoken/pull/234/files): 

``` python
PAT = r"""'(?:[sdmt]|ll|ve|re)| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+"""
```

建议在python命令行中尝试这个正则表达式的效果，如：

``` python
>>> # requires `regex` package
>>> import regex as re
>>> re.findall(PAT, "some text that i'll pre-tokenize")
['some', ' text', ' that', ' i', "'ll", ' pre', '-', 'tokenize']
```

分词器训练：

```python
from collections import Counter, defaultdict

def train_bpe_naive(text: str, num_merges: int) -> tuple[ dict[int, bytes], list[tuple[bytes, bytes]] ]:
    # initialize vocab and merges
    vocab = {i: bytes([i]) for i in range(256)}
    vocab[256] = "<|endoftext|>".encode("utf-8")
    merges = [] # (index1, index2)

    # pre-tokenization
    # freq_table = Counter(re.findall(PAT, text)) # list version
    freq_table = Counter(m.group() for m in re.finditer(PAT, text)) # iterator version
    freq_table_tuple = {tuple(bytes([x]) for x in key.encode("utf-8")): value for key, value in freq_table.items()} # gives dict[tuple[bytes], int]
    # freq_table_tuple = {key.encode("utf-8"): value for key, value in freq_table.items()} # gives dict[bytes, int]
    print(freq_table_tuple)
    
    # merges
    for i in range(num_merges):
        # Get stats for each adjacent pair
        pair_stats = defaultdict(int)
        for key, value in freq_table_tuple.items():
            for i in range(len(key)-1):
                pair_stats[(key[i], key[i+1])] += value

        # get the most frequent pair
        # best_pair = max(pair_stats, key=pair_stats.get) # will pick out the first key with maximum val
        best_pair = max(pair_stats, key=lambda k: (pair_stats[k], k)) # when multiple keys have the same maximum val, will pick out the one with the lexicographically largest key
        vocab[257 + i] = b''.join(best_pair)
        

        # merge in the freqency table
        freq_table_tuple = merge_pair_in_table(freq_table_tuple, best_pair)
        merges.append(best_pair)

    return vocab, merges
```

::: details 疑难代码解答：Counter，re.finditer(), m.group()
```python
freq_table = Counter(m.group() for m in re.finditer(PAT, text))  # iterator version
```

这行代码的作用是：
**在字符串 `text` 中查找所有匹配正则表达式 `PAT` 的内容，并统计每个匹配结果出现了多少次，存入一个 `Counter` 频率表中。**

1. `re.finditer(PAT, text)`

   * 这是 Python `re`/`regex` 模块中的一个函数。
   * 功能是：在字符串 `text` 中查找所有匹配正则表达式 `PAT` 的位置。
   * **返回一个迭代器**，每个元素是一个 `Match` 对象。

    比如：`PAT = r'\w+'`，`text = "hello world hello"`. `re.finditer(PAT, text)` 会产出三个 Match：`"hello"`, `"world"`, `"hello"`。

2. `m.group() for m in re.finditer(PAT, text)`

   * 这是一个生成器表达式（generator expression）。
   * 对每个 Match 对象 `m`，调用 `m.group()` 获取匹配到的字符串内容。
   * 生成序列：`"hello"`, `"world"`, `"hello"`。

3. `Counter(...)`

   * `Counter` 是 `collections` 模块中的一个类，用于计数。
   * 它会对生成器中的字符串进行统计，返回一个字典类似的对象，键为字符串，值为出现次数。

    对于刚才的例子，最后结果为：

    ```python
    Counter({'hello': 2, 'world': 1})
    ```

一个示例：

```python
import re
from collections import Counter

PAT = r'\w+'
text = "hello world hello"

freq_table = Counter(m.group() for m in re.finditer(PAT, text))
print(freq_table)
```

输出：

```python
Counter({'hello': 2, 'world': 1})
```

:::


::: details 疑难代码解答：逐字节拆分

```python
tuple(bytes([x]) for x in key.encode("utf-8"))
```
这段代码的总体作用：**将字符串 `key` 先按 UTF-8 编码为字节序列，然后将每个字节单独包装为一个长度为1的 `bytes` 对象，并最终组成一个 `tuple`。**

---

分步骤讲解

假设：

```python
key = "ABC"
```

1. `key.encode("utf-8")`

   * 将字符串 `key` 转为 UTF-8 字节序列。
   * `"ABC"` → `b'ABC'`
   * `"你好"` → `b'\xe4\xbd\xa0\xe5\xa5\xbd'`

2. `for x in key.encode("utf-8")`

   * 遍历字节序列中**每一个字节（整数形式）**。
   * 例如 `"ABC"` → `65, 66, 67`
   * `"你好"` → `228, 189, 160, 229, 165, 189`

3. `bytes([x])`

   * `x` 是一个整数，`bytes([x])` 会将其转换成**长度为1的字节对象**。
   * 举例：
     * `bytes([65]) → b'A'`
     * `bytes([228]) → b'\xe4'`

4. `tuple(...)`

   * 把生成的所有 `bytes([x])` 结果收集成一个元组。

---

示例：

1. 英文字符串

```python
key = "ABC"
result = tuple(bytes([x]) for x in key.encode("utf-8"))
print(result)
```

输出：

```python
(b'A', b'B', b'C')
```

2. 中文字符串：

```python
key = "你好"
result = tuple(bytes([x]) for x in key.encode("utf-8"))
print(result)
```

输出：

```python
(b'\xe4', b'\xbd', b'\xa0', b'\xe5', b'\xa5', b'\xbd')
```

:::

::: details 疑难代码解答：defaultdict

代码片段回顾

```python
from collections import defaultdict

pair_stats = defaultdict(int)
for key, value in freq_table_tuple.items():
    for i in range(len(key)-1):
        pair_stats[(key[i], key[i+1])] += value
```

---
这段代码的目的：统计所有“相邻元素对”出现的频率。

* `freq_table_tuple` 是一个字典，表示某些“序列（key）”出现的次数（value）。
* 代码取出每个序列中相邻元素 `(key[i], key[i+1])`
* 然后将这个相邻对的出现次数累加到 `pair_stats` 中。

---

 `defaultdict(int)` 起到的作用是什么？它会自动为不存在的键提供默认值 `0`。

这样当我们第一次遇到一个 pair（如 `(b'a', b'b')`）时，代码：

```python
pair_stats[(key[i], key[i+1])] += value
```

等价于：

```python
pair_stats[(key[i], key[i+1])] = pair_stats.get((key[i], key[i+1]), 0) + value
```

但使用 `defaultdict(int)` 就**不需要手动判断键是否已存在**，避免了繁琐的 `if` 检查或 `.get()` 方法。

---

如果不用 defaultdict，会怎样？

可能需要写成：

```python
pair_stats = {}
for key, value in freq_table_tuple.items():
    for i in range(len(key)-1):
        pair = (key[i], key[i+1])
        if pair not in pair_stats:
            pair_stats[pair] = 0
        pair_stats[pair] += value
```

或者：

```python
pair_stats = {}
...
pair_stats[pair] = pair_stats.get(pair, 0) + value
```

显然不如 `defaultdict(int)` 简洁优雅。

:::

::: details 疑难代码解答：挑选value最大的key，若有多个平局，则选择其中按字典序最大的key

代码回顾

```python
best_pair = max(pair_stats, key=lambda k: (pair_stats[k], k))
# 当多个 key 有相同的最大值时，取字典序(lexicographically)最大的那个 key
```

---

这段代码的作用：从 `pair_stats`（一个字典）中，**找出出现次数（即 value）最大的键（key）**。
如果多个 key 的 value 一样大，则选择**字典序最大的 key**。

---

理解 `max(iterable, key=...)` 的用法：

```python
max(iterable, key=函数)
```

* `iterable`：可迭代对象，比如列表、元组、字典等。
* 默认情况下，`max()` 比较的是可迭代对象中的迭代元素。对于字典，比较的是键而不是值，返回的内容也是键而不是值。
* `key=函数`：指定一个函数——用于将 iterable 中的每个元素“映射”为一个用于比较的值。

---

结合代码理解：

`pair_stats` 是一个字典，迭代它时默认迭代的是它的 **key**，即：

```python
max(pair_stats, key=...)
```

等价于：

```python
for k in pair_stats.keys():
    ...
```

接着看 lambda：

```python
lambda k: (pair_stats[k], k)
```

对于每个 key `k`，映射为一个二元组 `(pair_stats[k], k)`：

| k         | pair_stats[k] | key(k) 的结果     |
| --------- | ------------- | -------------- |
| ('a','b') | 5             | (5, ('a','b')) |
| ('c','d') | 5             | (5, ('c','d')) |
| ('x','y') | 3             | (3, ('x','y')) |

`max()` 会：

1. 先按 `pair_stats[k]` 排序（次数最大优先）
2. 如果次数相同，再按 key（元组）按字典序比较，选字典序**最大的**

---

实例演示：

```python
pair_stats = {('a','b'): 5, ('c','d'): 5, ('x','y'): 3}

best_pair = max(pair_stats, key=lambda k: (pair_stats[k], k))
print(best_pair)
```

输出：

```
('c', 'd')
```

因为 ('a','b') 和 ('c','d') 的次数都是 5，但 ('c','d') 在字典序中更大。

---

总结：

> `max(pair_stats, key=lambda k: (pair_stats[k], k))` 的意思是：
> **按 value 最大排序，若有并列，则按 key 的字典序选择最大的 key。**

:::

::: details 拓展延伸：max()函数在字典中的用法

1. 默认情况：比较字典的键

```python
# 默认比较字典的键
my_dict = {'a': 3, 'b': 1, 'c': 2, 'd': 5}
max_key = max(my_dict)
print(max_key)  # 输出: 'd' (按字母顺序最大)

# 等价于
max_key = max(my_dict.keys())
print(max_key)  # 输出: 'd'
```

2. 比较字典的值

```python
my_dict = {'a': 3, 'b': 1, 'c': 2, 'd': 5}

# 获取值最大的键
max_key_by_value = max(my_dict, key=my_dict.get)
print(max_key_by_value)  # 输出: 'd' (对应的值5最大)

# 直接获取最大值
max_value = max(my_dict.values())
print(max_value)  # 输出: 5
```

3. 获取键值对

```python
my_dict = {'a': 3, 'b': 1, 'c': 2, 'd': 5}

# 获取值最大的键值对
max_item = max(my_dict.items(), key=lambda x: x[1])
print(max_item)  # 输出: ('d', 5)

# 获取键最大的键值对
max_item_by_key = max(my_dict.items())
print(max_item_by_key)  # 输出: ('d', 5)
```

4. 复杂字典的比较

```python
# 字典值为复杂结构
students = {
    'Alice': {'age': 20, 'score': 85},
    'Bob': {'age': 22, 'score': 92},
    'Charlie': {'age': 19, 'score': 78}
}

# 按分数找最高分的学生
max_score_student = max(students, key=lambda x: students[x]['score'])
print(max_score_student)  # 输出: 'Bob'

# 按年龄找最大的学生
max_age_student = max(students, key=lambda x: students[x]['age'])
print(max_age_student)  # 输出: 'Bob'

# 获取完整的最高分学生信息
max_student_info = max(students.items(), key=lambda x: x[1]['score'])
print(max_student_info)  # 输出: ('Bob', {'age': 22, 'score': 92})
```

5. 多条件比较

```python
# 当值相同时，可以添加第二个比较条件
data = {'a': 10, 'b': 20, 'c': 20, 'd': 15}

# 值相同的情况下，比较键
max_item = max(data.items(), key=lambda x: (x[1], x[0]))
print(max_item)  # 输出: ('c', 20) - 值相同，键'c'比'b'大
```

6. 处理空字典的情况

```python
empty_dict = {}

# 处理空字典的max调用
try:
    result = max(empty_dict)
except ValueError as e:
    print(f"错误: {e}")  # 输出: 错误: max() arg is an empty sequence

# 安全的方式
if empty_dict:
    result = max(empty_dict)
else:
    result = None
print(result)  # 输出: None

# 另一种安全的方式：使用default参数
result = max(empty_dict, default=0)
print(result)  # 输出: 0，不会产生错误，但无法区分到底字典是空子典还是字典最大值确实为0.
```

7. 自定义比较函数

```python
# 使用自定义比较函数
words = {'apple': 5, 'banana': 6, 'cherry': 6, 'date': 4}

# 按单词长度比较，长度相同按字母顺序
max_word = max(words, key=lambda x: (len(x), x))
print(max_word)  # 输出: 'banana' (长度6，比'cherry'字母顺序靠前)

# 按值的奇偶性和大小比较
max_by_custom = max(words.items(), key=lambda x: (x[1] % 2, x[1]))
print(max_by_custom)  # 输出: ('banana', 6) 或 ('cherry', 6)
```

8. 实际应用示例

```python
# 统计词频并找出最高频词
text = "apple banana apple cherry banana apple date"
words = text.split()

# 统计词频
word_count = {}
for word in words:
    word_count[word] = word_count.get(word, 0) + 1

print("词频统计:", word_count)

# 找出出现次数最多的单词
most_frequent = max(word_count, key=word_count.get)
print(f"最常出现的单词: '{most_frequent}', 出现次数: {word_count[most_frequent]}")

# 如果出现次数相同，选择字母顺序靠后的
most_frequent_tiebreak = max(word_count.items(), key=lambda x: (x[1], x[0]))
print(f"考虑平局的最常出现单词: {most_frequent_tiebreak}")
```

总结:

- **默认行为**：比较字典的键
- **比较值**：使用`key=dict.get`参数
- **获取键值对**：使用`dict.items()`配合`key`参数
- **复杂比较**：使用lambda函数定义比较规则
- **多条件**：在lambda中返回元组实现多级排序
- **错误处理**：注意空字典的情况，需要事先检查

:::


上述代码中使用了如下的辅助函数，来执行合并过程：

``` python
def merge_pair_in_table(table: dict[tuple[bytes], int], pair: tuple[bytes]) -> dict[tuple[bytes], int]:
    return {merge_pair(key, pair): value for key, value in table.items()}
    

def merge_pair(tup: tuple[bytes], pair: tuple[bytes]) -> tuple[bytes]:
    result = []
    i = 0
    while i < len(tup):
        if tup[i:i+2] == pair:
            result.append(b''.join(pair))
            i += 2
        else:
            result.append(tup[i])
            i += 1
    return tuple(result)
```

::: details 切片的安全性
提问：上述 `merge_pair` 函数执行 `tup[i:i+2]` 是否有索引越界风险？

我们来分析一下：

```python
if tup[i:i+2] == pair:
```

这里使用的是**切片操作**而不是直接索引，因此**不会发生索引越界**。

---

**为什么不会越界？**

切片写法：`tup[i:i+2]`

* 在 Python 中，**切片不会抛出 IndexError**，即使 `i+2 > len(tup)`。
* 比如当 `i == len(tup) - 1` 时，`tup[i:i+2]` 会返回一个只有 1 个元素的元组。当 `i == len(tup)` 时，`tup[i:i+2]` 会返回空元组 `()`。

所以程序依然安全。

---

**整体流程为何安全？**

循环条件是：

```python
while i < len(tup):
```

因此：

* `i` 永远不会达到 `len(tup)` 以上。
* 当 `i == len(tup)-1` 时仍然进入循环，但 `tup[i:i+2]` 只取出最后一个元素进行比较。
* 如果不匹配，执行：

  ```python
  result.append(tup[i])
  i += 1
  ```

  并退出循环。

---

**若改为 `if tup[i] == ...` 就会出问题**

比如错误写法：

```python
if tup[i] == pair[0] and tup[i+1] == pair[1]:
```

当 `i == len(tup)-1` 时，访问 `tup[i+1]` 就会导致 **IndexError: tuple index out of range**。

---

**结论**: 这段代码没有元组索引越界的风险，因为使用了安全的切片 `tup[i:i+2]`。Python 的切片机制保证了安全性。

:::


### Tokenizer类

我们已经有了tokenizer训练的代码，对于每一个语料库，我们可以训练一个tokenizer. 我们可以设计一个Tokenizer类，根据每一个训练好的分词器都可以创建该类的一个实例，如果在该类中实现编码、解码功能，那么就可以在实例中调用。

``` python
class Tokenizer:
    def __init__(self, vocab: dict[int, bytes], merges: list[tuple[bytes, bytes]], special_tokens: list[str] | None = None):
        '''
        Initialize member variables according to parameters.
        '''
        pass

    def encode(self, text: str) -> list[int]:
        '''
        Encode an input text into a sequence of token IDs.
        '''
        pass
    
    def decode(self, ids: list[int]) -> str:
        '''
        Decode a sequence of token IDs into text.
        '''
        pass

```

#### 初始化

``` python
def __init__(self, vocab: dict[int, bytes], merges: list[tuple[bytes, bytes]], special_tokens: list[str] | None = None):
    self.id2token: dict[int, bytes] = vocab.copy()  # copy to avoid mutating input
    self.token2id: dict[bytes, int] = {v: k for k, v in vocab.items()}
    self.merges = merges
    self.special_tokens = special_tokens

    # Handle special tokens
    if special_tokens:
        next_id = max(self.id2token.keys(), default=-1) + 1
        for tok in special_tokens:
            tok_b = tok.encode("utf-8")  # Convert to bytes
            if tok_b not in self.token2id:
                self.id2token[next_id] = tok_b
                self.token2id[tok_b] = next_id
                next_id += 1
```

若用户指定了 `special_tokens`，则我们需要将vocab中原来没有的special_token加入vocab. 关于用户添加的特殊token对编码过程的影响我们将在下一节讲解。本节中，为了简单起见，我们默认 `special_tokens = None`.

::: details 代码注意点：传参时的可变对象共享问题

代码回顾：

```python
self.id2token: dict[int, bytes] = vocab.copy()  # copy to avoid mutating input
```

---

为什么使用 `vocab.copy()`？

因为传入的 `vocab` 是一个 **可变字典**，如果直接做：

```python
self.id2token = vocab
```

那么 `self.id2token` 和 `vocab` 会指向**同一个字典对象**。

一旦后续对 `self.id2token` 进行任何修改（比如新增 token 或删除 token），**外部传进来的 `vocab` 也会被无意间修改**，造成不可预测的问题。这可能导致外部逻辑出错，以及影响后续其它对象中使用的 `vocab`。

:::


#### 编码

``` python
def encode_without_special_tokens(self, text: str) -> list[int]:
    '''
    Encode an input text into a sequence of token IDs.
    '''
    
    # pre-tokenize
    pretokens = re.finditer(PAT, text) # iterator version
    # freq_table_tuple = {tuple(bytes([x]) for x in key.encode("utf-8")): value for key, value in freq_table.items()} # gives dict[tuple[bytes], int]
    encoded = []

    for m in pretokens:
        # Apply the merges
        pretoken_tuple = tuple(bytes([x]) for x in m.group().encode("utf-8"))
        for pair in merges:
            pretoken_tuple = merge_pair(pretoken_tuple, pair)
        
        for token in pretoken_tuple:
            # Lookup ids
            token_id = self.token2id.get(token)
            if token_id is None:
                raise ValueError(f"Unknown token: {token}")
            encoded.append(token_id)
    return encoded
```




#### 解码

``` python
def decode(self, ids: list[int]) -> str:
    '''
    Decode a sequence of token IDs into text.
    '''
    byte_seq = b"".join(self.id2token[id] for id in ids)
    return byte_seq.decode("utf-8", errors="replace")
```

::: tip 在解码（decode）过程中如何安全地将 token ID 转换为字符串

用户输入的 token ID 序列**可能并不对应合法的 UTF-8 字节序列**，如果直接解码，可能会导致程序崩溃（抛出 `UnicodeDecodeError`）。

在使用 `byte_seq.decode("utf-8")` 时，**必须加上 `errors="replace"`**，这样如果遇到非法字节，就会自动替换为 **Unicode 官方的替换字符 `U+FFFD`（显示为 �）**，避免错误。

:::

### 在主函数中进行测试

``` python
if __name__ == '__main__':
    text = "low low low lower lower widest widest newest"
    # vocab, merges = train_bpe_naive(text, 5)
    vocab, merges = train_bpe(text, 5, special_tokens=["<|endoftext|>", "<|sometoken|>"])
    print(vocab)
    print(merges)
    tokenizer = Tokenizer(vocab=vocab, merges=merges, special_tokens=["你"])
    text2 = "the cat ate 你✔"
    encoded = tokenizer.encode(text2)
    print(encoded)
    decoded = tokenizer.decode(encoded)
    print(decoded)
```


## 完善我们的BPE算法：支持用户自定义的特殊token

### 训练阶段

在分词器训练中我们想要增加对预先定义的特殊token的支持，如 `<|endoftext|>`. 下面我们具体分析当引入特殊token后，代码需要做哪些修改。

**核心问题**

在 BPE 训练中，如果文本中存在特殊 token（如 `<|endoftext|>`），必须保证：

1. **特殊 token 不会被拆分或合并**；
2. **不会跨特殊 token 合并相邻字符**；
3. **最终词表中包含这些特殊 token，作为原子单位存在**。

否则可能导致：

* 跨文档合并，破坏语料边界；
* 特殊 token 被拆分，无法正确识别。

---

**对训练流程的修改要点**

（1）初始化词表

* 原始词表：`0~255` 对应单字节。
* 添加特殊 token：

  * 编码为 UTF-8 bytes。
  * 作为新的词表项加入。
  * 在 BPE 合并中不允许拆分。

```python
vocab = {i: bytes([i]) for i in range(256)}
next_id = 256
for tok in special_tokens:
    tok_b = tok.encode("utf-8")
    vocab[next_id] = tok_b
    next_id += 1
```

（2）切分语料

* 在做预分词（pre-tokenization）前，**先按特殊 token 切分语料**。
* 保证特殊 token 独立，非特殊 token 才做正则预分词。
* 可以使用正则 `re.split`：

```python
split_pat = "(" + "|".join(re.escape(tok) for tok in special_tokens) + ")"
segments = re.split(split_pat, text)
```

切分后得到的片段：
  * 特殊 token： 直接作为一个整体；
  * 其他文本： 用正则 PAT 做 pre-tokenization。


（3）构建频率表

对每个 segment：
  1. 如果是特殊 token → 加入频率表，作为单元素 tuple，不参与合并。
  2. 其他 segment → 正则分词后，将每个 token 转为 bytes tuple，再统计频率。

```python
for seg in segments:
    if seg in special_tokens:
        freq_table_tuple[(seg.encode("utf-8"),)] += 1
    else:
        for m in re.finditer(PAT, seg):
            bt = tuple(bytes([x]) for x in m.group().encode("utf-8"))
            freq_table_tuple[bt] += 1
```

（4）BPE 合并循环

对频率表中**非特殊 token 的 byte tuples**做两两合并。特殊 token 的 byte tuple 长度为 1，自然不会参与合并。

合并步骤保持原有逻辑：
  * 统计最频繁 pair；
  * 加入词表；
  * 更新频率表。

---

**关键效果**

* 特殊 token 被保留，作为原子单位；
* 不会跨特殊 token 进行合并；
* 正常 token 仍可进行 BPE 合并；
* 最终词表中包含特殊 token + 所有 BPE 合并结果；
* 下游编码/解码器可直接使用。

---

完整代码如下：

```python
def train_bpe(text: str, num_merges: int, special_tokens: list[str]) -> tuple[ dict[int, bytes], list[tuple[bytes, bytes]] ]:
    # initialize vocab and merges
    vocab = {i: bytes([i]) for i in range(256)}
    vocab[256] = "<|endoftext|>".encode("utf-8")
    

    # Add special tokens if given
    next_id = 256
    special_token_ids = set()
    if special_tokens:
        for tok in special_tokens:
            tok_b = tok.encode("utf-8")
            vocab[next_id] = tok_b
            special_token_ids.add(next_id)
            next_id += 1

    # Split text on special tokens
    if special_tokens:
        tok_pattern = "(" + "|".join(re.escape(tok) for tok in special_tokens) + ")"
        segments = re.split(tok_pattern, text)
    else:
        segments = [text]

    # 4. Pre-tokenization: Build initial frequency table
    freq_table_tuple = Counter()

    for seg in segments:
        if seg in (special_tokens or []):
            # special token → directly add as single byte tuple
            tok_b = seg.encode("utf-8")
            # treat entire token as a single entry: tuple of one item
            freq_table_tuple[(tok_b,)] += 1
        else:
            # normal segment → pre-tokenize and break into byte tuples
            for m in re.finditer(PAT, seg):
                bt = tuple(bytes([x]) for x in m.group().encode("utf-8"))
                freq_table_tuple[bt] += 1
    
    # merges
    merges: list[tuple[bytes, bytes]] = []
    for _ in range(num_merges):
        # Get stats for each adjacent pair
        pair_stats = defaultdict(int)
        for key, value in freq_table_tuple.items():
            for i in range(len(key)-1):
                pair_stats[(key[i], key[i+1])] += value

        if not pair_stats:
            break  # nothing to merge

        # get the most frequent pair
        # best_pair = max(pair_stats, key=pair_stats.get) # will pick out the first key with maximum val
        best_pair = max(pair_stats, key=lambda k: (pair_stats[k], k)) # when multiple keys have the same maximum val, will pick out the one with the lexicographically largest key
        merges.append(best_pair)
        # vocab[257 + i] = b''.join(best_pair)
        
        # add new entry to vocab (join the bytes from the pair)
        new_token = best_pair[0] + best_pair[1]
        vocab[next_id] = new_token
        next_id += 1

        # merge best_pair in the frequency table
        freq_table_tuple = merge_pair_in_table(freq_table_tuple, best_pair)

    return vocab, merges
```

::: details 为何使用 `re.split()` 而不是 `str.split()` ?

之所以不使用 `str.split()`，是因为它不会保留分隔符（特殊 token），并且只支持按单个分隔符切分，不能一次处理多个不同的特殊 token（或模式）。我们来逐步解释。


**问题 1：`str.split()` 不会保留特殊 token**

示例：

```python
text = "Hello<|endoftext|>World"
segments = text.split("<|endoftext|>")
```

结果：

```python
["Hello", "World"]
```

特殊 token `<|endoftext|>` 丢失了！但我们需要保留它，因为它必须被计数并完整地保留进词表中。

---

**问题 2：`str.split()` 只能接受一个分隔符（不支持多个）**

如果你有：

```python
special_tokens = ["<|endoftext|>", "<|pad|>", "<bos>"]
```

你不能这样写：

```python
text.split(special_tokens)  # 类型错误
```

你只能手动链式或循环多次 split，但这不仅麻烦，而且仍然会遇到问题 1（丢失 token）。

---

**`re.split()` 的优势**

`re.split()` 支持：
✔ 多个分隔符；
✔ 捕获组（使用括号），即可保留分隔符在结果中

示例：

```python
import re
special_tokens = ["<|endoftext|>", "<|pad|>"]
pattern = "(" + "|".join(re.escape(tok) for tok in special_tokens) + ")"
segments = re.split(pattern, "Hello<|endoftext|>World<|pad|>Again")
```

结果：

```python
["Hello", "<|endoftext|>", "World", "<|pad|>", "Again"]
```

这样，特殊 token 被完整保留，各段内容也被清晰分开

---

:::


### 编码阶段

增加处理用户指定的特殊token的版本：

``` python
def encode(self, text: str) -> list[int]:
    '''
    Encode an input text into a sequence of token IDs.
    '''

    tokens = []
    
    # 1. Split on special tokens
    if self.special_tokens:
        split_pat = "(" + "|".join(re.escape(tok) for tok in self.special_tokens) + ")"
        segments = re.split(split_pat, text)
    else:
        segments = [text]
    
    
    # 2. pre-tokenize
    for seg in segments:
        if seg in self.special_tokens:
            # Special token → direct ID lookup
            tok_b = seg.encode("utf-8")
            tokens.append(self.token2id[tok_b])
        else:
            # Regular text → apply PAT pre-tokenization
            for m in re.finditer(PAT, seg):
                pretoken_tuple = tuple(bytes([x]) for x in m.group().encode("utf-8"))

                # Apply merges
                for pair in self.merges:
                    pretoken_tuple = merge_pair(pretoken_tuple, pair)

                for token in pretoken_tuple:
                    # Lookup ids
                    token_id = self.token2id.get(token)
                    if token_id is None:
                        raise ValueError(f"Unknown token: {token}")
                    tokens.append(token_id)
    
    return tokens
```