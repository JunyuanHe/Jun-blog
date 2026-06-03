---
title: BPE Tokenizer Implementation
createTime: 2025/10/22 19:28:57
permalink: /article/dirq0u1t/
tags:
  - LLM
---

Byte-Pair Encoding, or **BPE**, is one of the most widely used tokenizer families in modern language models. In this note, I walk through the core idea of BPE and the basic structure of a simple implementation.

## Subword tokenization and the BPE idea

Deep learning models operate on tensors, not raw text. So before a model can process language, we need to turn text into integer sequences. This is the purpose of **tokenization**.

Before subword methods became dominant, two common strategies were:

- **word-level tokenization**: split on spaces; simple, but the vocabulary grows without bound and unknown words become a problem;
- **character-level tokenization**: split into characters; robust, but the sequence becomes too long and the semantic unit is often too small.

BPE finds a useful middle ground. It starts from basic symbols and repeatedly merges the most frequent adjacent pair. In this way it learns useful **subword units** from data.

That gives BPE several advantages:

- it controls vocabulary size;
- it balances vocabulary size and sequence length;
- it handles rare words and unseen words much more gracefully.

## The core idea of the algorithm

The algorithm is simple:

1. start from the smallest symbols;
2. count adjacent symbol pairs;
3. merge the most frequent pair;
4. repeat until the target vocabulary size is reached.

## A toy example

Suppose our tiny corpus is:

```text
low low lower newest newest widest widest widest
```

We begin with symbols such as:

```text
l, o, w, e, r, n, s, t, i, d, </w>
```

Then we pre-tokenize the corpus into words and count their frequencies. After that we repeatedly merge frequent pairs:

- merge `("s", "t")` into `"st"`
- merge `("e", "st")` into `"est"`
- merge `("o", "w")` into `"ow"`

and so on.

## Implementation structure

In practice, a BPE tokenizer usually has three stages:

1. **training**
2. **encoding**
3. **decoding**

### 1. Pre-tokenization

Before the BPE merge loop, it is common to use a regex-based pre-tokenizer. A widely used example is the GPT-2 style pattern:

```python
PAT = r"""'(?:[sdmt]|ll|ve|re)| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+"""
```

### 2. Training

The training loop can be organized like this:

```python
from collections import Counter, defaultdict

def train_bpe_naive(text: str, num_merges: int):
    vocab = {i: bytes([i]) for i in range(256)}
    vocab[256] = "<|endoftext|>".encode("utf-8")
    merges = []

    freq_table = Counter(m.group() for m in re.finditer(PAT, text))
    freq_table_tuple = {
        tuple(bytes([x]) for x in key.encode("utf-8")): value
        for key, value in freq_table.items()
    }

    for i in range(num_merges):
        pair_stats = defaultdict(int)
        for key, value in freq_table_tuple.items():
            for j in range(len(key) - 1):
                pair_stats[(key[j], key[j + 1])] += value

        best_pair = max(pair_stats, key=lambda k: (pair_stats[k], k))
        vocab[257 + i] = b"".join(best_pair)
        freq_table_tuple = merge_pair_in_table(freq_table_tuple, best_pair)
        merges.append(best_pair)

    return vocab, merges
```

The main steps are:

- initialize the vocabulary with all byte values;
- pre-tokenize the corpus;
- count adjacent pair frequencies;
- merge the best pair;
- update the vocabulary and the tokenized frequency table.

### 3. Encoding and decoding

Once training is done, encoding applies the learned merges in the learned order. Decoding maps token ids back to bytes and then decodes them into text.

## Final remarks

The main point of BPE is not that the algorithm is complicated. It is the opposite:

> BPE is powerful precisely because it turns tokenization into a simple data-driven compression-like process.
