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

::: tip 疑难代码解答
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

在分词器训练中增加对用户预先自定义的特殊token的支持：

用户预先自定义的这些特殊token应当被添加到vocab中，但不应参与BPE分词过程。

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


#### 解码

``` python
def decode(self, ids: list[int]) -> str:
    '''
    Decode a sequence of token IDs into text.
    '''
    byte_seq = b"".join(self.id2token[id] for id in ids)
    return byte_seq.decode("utf-8", errors="replace")
```

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