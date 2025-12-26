---
title: GitHub Pull Request 合并后本地仓库的操作流程
createTime: 2025/12/26 20:15:26
permalink: /blog/y3o3vq5s/
---

```git
git checkout main
git pull
git branch -d feature/xxx
git fetch --prune
```

上面的代码做了这几件事：

1. 切换回主分支
2. 同步远端
3. 删除本地功能分支
4. 清理已经被删除的远端分支引用