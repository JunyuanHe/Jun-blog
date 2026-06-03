---
title: Copy onto web server from local machine
tags:
  - Linux
createTime: 2025/03/04 21:34:04
permalink: /article/vdl76kbr/
---

Copy directory

```bash
scp -r ./dist lighthouse@88.888.888.888:/home/lighthouse/mySite
```

Copy file

```bash
scp ./dist/index.html lighthouse@88.888.888.888:/home/lighthouse/mySite/a.html
```
