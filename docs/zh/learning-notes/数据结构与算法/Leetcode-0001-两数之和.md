---
title: "Leetcode 1: 两数之和"
createTime: 2026/07/20 20:33:53
permalink: /zh/learning-notes/iwaodjkr/
---

## 题目描述

给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出 和为目标值 `target`  的那 两个 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。

你可以按任意顺序返回答案。

 

**示例 1：**
```:no-line-numbers
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
```

**示例 2：**
```:no-line-numbers
输入：nums = [3,2,4], target = 6
输出：[1,2]
```

**示例 3：**
```:no-line-numbers
输入：nums = [3,3], target = 6
输出：[0,1]
```

**数据范围：**

```:no-line-numbers
2 <= nums.length <= 104
-109 <= nums[i] <= 109
-109 <= target <= 109
```
且只会存在一个有效答案
 

**进阶：**你可以想出一个时间复杂度小于 $O(n^2)$ 的算法吗？


## 解题思路

### 方法一：暴力搜索

使用双重循环遍历这个数组。显然，复杂度是 O(n^2)，不符合进阶要求。

### 方法二：哈希表

使用哈希表存储已经遍历过的元素及其索引。对于每个元素，检查目标值与当前元素的差值是否在哈希表中。如果在，则找到了两个数；否则，将当前元素和其索引存入哈希表。时间复杂度为 O(n)，空间复杂度为 O(n)。

```python
def twoSum(self, nums: List[int], target: int) -> List[int]:
        ht = dict()
        for idx, num in enumerate(nums):
            if target - num in ht:
                return [idx, ht[target - num]]
            ht[num] = idx
        return []
```
