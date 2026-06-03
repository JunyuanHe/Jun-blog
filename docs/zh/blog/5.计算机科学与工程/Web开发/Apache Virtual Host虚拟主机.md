---
title: Apache Virtual Host虚拟主机
tags: 
  - Apache
createTime: 2025/03/06 17:35:53
permalink: /zh/article/afq0czul/
---

## 需求

同一个服务器中用Apache部署多个网站，每个网站的空间互相独立，各自使用不同域名访问。

## 方案

在Apache中设置虚拟主机。方法：

1. 创建配置文件

我使用的是 httpd (常见于基于Red Hat的系统，如CentOS, Fedora等), 配置文件的位置一般在:

- 主配置文件: `/etc/httpd/conf/httpd.conf`

在主配置文件中，你可以对服务器进行全局性的设置。

- 虚拟主机（Virtual Host）配置: `/etc/httpd/conf.d/`

这个目录通常包含了虚拟主机的额外配置文件，如`yourdomain1.com.conf`和`yourdomain2.com.conf`. 当然，它们也可以放在同一个文件中。在同一个文件中配置所有虚拟主机或每个虚拟主机新建一个配置文件位置都是可以的，取决于你的习惯。

假设我们的域名为`yourdomain1.com`，新建一个配置文件`/etc/httpd/conf.d/yourdomain1.com.conf`.

2. 添加配置

```apache
<VirtualHost *:443>
    ServerAdmin webmaster@yourdomain1.com
    ServerName yourdomain1.com
    ServerAlias www.yourdomain1.com
    DocumentRoot /var/www/yourdomain1.com/html

    SSLEngine on
    SSLCertificateFile /etc/pki/tls/certs/yourdomain1.com.crt
    SSLCertificateKeyFile /etc/pki/tls/private/yourdomain1.com.key
    
    <Directory /var/www/yourdomain1.com/html>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog /var/log/httpd/error.log
    CustomLog /var/log/httpd/access.log combined
</VirtualHost>

# Redirect HTTP to HTTPS
<VirtualHost *:80>
    ServerName yourdomain1.com
    ServerAlias yourdomain1.com
    Redirect permanent / https://yourdomain1.com/
</VirtualHost>
```

3. 启用站点配置，重启httpd

启用站点配置
```bash
sudo a2ensite yourdomain1.com.conf
```

重启httpd
```bash
sudo systemctl restart apache2
```

4. 在域名服务商处将域名解析到服务器

更新DNS记录，添加A记录将域名解析至服务器的公网IP. Apache会根据所访问的域名自动使用到该域名对应的虚拟主机配置。