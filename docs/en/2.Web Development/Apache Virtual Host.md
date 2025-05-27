---
title: Apache Virtual Host
createTime: 2025/05/27 14:35:53
permalink: /article/afq0czul_en/

---

## Requirements

Host multiple websites on the same server using Apache. Each website should have its own isolated space and be accessed using a different domain name.

## Solution

Set up Virtual Hosts in Apache. Here's how:

### 1. Create Configuration Files

I'm using `httpd` (commonly found on Red Hat-based systems such as CentOS, Fedora, etc). The configuration files are generally located at:

- Main configuration file: `/etc/httpd/conf/httpd.conf`

This file is used for global server settings.

- Virtual Host configuration: `/etc/httpd/conf.d/`

This directory usually contains additional configuration files for virtual hosts, such as `yourdomain1.com.conf` and `yourdomain2.com.conf`. You can either configure all virtual hosts in one file or create a separate file for each — the choice depends on your personal preference.

Assuming your domain is `yourdomain1.com`, create a new configuration file:  
`/etc/httpd/conf.d/yourdomain1.com.conf`.

### 2. Add Configuration

```conf
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
    ServerAlias www.yourdomain1.com
    Redirect permanent / https://yourdomain1.com/
</VirtualHost>
```

### 3. Enable Site Configuration and Restart Apache

Enable the site configuration:

```bash
sudo a2ensite yourdomain1.com.conf
```

Restart Apache:

```bash
sudo systemctl restart apache2
```

### 4. Point the Domain to Your Server

Update DNS records at your domain registrar by adding an A record to point the domain to your server’s public IP. Apache will automatically use the corresponding virtual host configuration based on the accessed domain.

