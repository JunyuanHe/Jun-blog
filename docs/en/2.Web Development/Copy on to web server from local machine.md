---
title: Copy on to web server from local machine
createTime: 2025/05/27 14:26:59
permalink: /article/vdl76kbr_en/
---

Copy directory

```bash
scp -r ./dist lighthouse@88.888.888.888:/home/lighthouse/mySite
```

Copy file

```bash
scp ./dist/index.html lighthouse@88.888.888.888:/home/lighthouse/mySite/a.html
```

