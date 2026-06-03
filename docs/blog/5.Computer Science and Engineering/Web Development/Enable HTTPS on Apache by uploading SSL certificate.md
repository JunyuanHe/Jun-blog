---
title: Enable HTTPS on Apache by uploading SSL certificate
tags: 
  - Apache
createTime: 2025/03/05 14:31:17
permalink: /article/gbz2h1s7/
---

## Enable HTTPS by uploading SSL certificate

```
sudo cp mathcs.cn.crt /etc/pki/tls/certs/
sudo cp mathcs.cn.key /etc/pki/tls/private/
sudo cp mathcs.cn.csr /etc/pki/tls/private/

```

Alter the apache ssl config file:

```bash
sudo vi /etc/httpd/conf.d/ssl.conf
```

Change the line

```
SSLCertificateFile /etc/pki/tls/certs/mathcs.cn.crt
SSLCertificateKeyFile /etc/pki/tls/private/mathcs.cn.key
```

where the filename is changed into the newly copied file.
