---
title: Installation and configuration of Apache
tags: 
  - Apache
createTime: 2025/03/04 21:41:50
permalink: /article/f8pj1hl6_en/
---

install httpd apache service:

```bash
sudo dnf install httpd
```

Start apache service

```bash
sudo systemctl start httpd.service
```

The default rootdirectory for apache `/var/www/html/`. We change this by modifying the config file `/etc/httpd/conf/httpd.conf`. The root directory for apache is now altered to another directory `/var/www/billiard-scoreboard/`

Restart Apache:

```bash
sudo systemctl restart httpd.service
```

