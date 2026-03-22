---
title: What to Do Locally After a GitHub Pull Request Is Merged
createTime: 2025/12/26 20:15:26
permalink: /blog/y3o3vq5s_en/
---

```git
git checkout main
git pull
git branch -d feature/xxx
git fetch --prune
```

The commands above do four things:

1. Switch back to the main branch
2. Sync with the remote
3. Delete the local feature branch
4. Clean up remote branch references that have already been deleted
