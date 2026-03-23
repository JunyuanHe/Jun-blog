---
title: Web Fundamentals
createTime: 2025/09/09 09:02:02
permalink: /article/3rpn8e6z_en/
tags:
  - Web
---

## URLs, Domains, and DNS

### 1. Domain names

A **domain name** is a human-friendly identifier used on the Internet in place of an IP address such as `192.168.1.1` or `2001:db8::1`.

Take `www.example.com` as an example:

- `.com` is the **top-level domain (TLD)**;
- `example` is the **second-level domain**;
- `www` is a **subdomain**.

One domain name can map to one or more IP addresses. That mapping is handled by DNS.

### 2. DNS

**DNS (Domain Name System)** translates domain names into IP addresses. You can think of it as the Internet's phone book.

When you visit `www.baidu.com`, the browser roughly goes through this process:

1. check whether the IP is already in the local cache;
2. if not, ask the local DNS resolver;
3. the resolver walks up the hierarchy: root server, TLD server, authoritative server;
4. finally, it returns the IP address of the target server.

Only after this step can the browser communicate with the server.

### 3. URL

A **URL (Uniform Resource Locator)** tells the browser where and how to access a resource.

For example:

```text
https://www.example.com:443/path/page.html?user=abc#section1
```

This URL contains:

- protocol: `https`
- host: `www.example.com`
- port: `443`
- path: `/path/page.html`
- query string: `?user=abc`
- fragment: `#section1`

## Protocols and ports

### 1. HTTP and HTTPS

**HTTP** is the protocol used for transferring web pages and related resources.

**HTTPS** is HTTP over TLS/SSL. In practice, it adds encryption, identity verification, and integrity protection.

### 2. Common ports

Some common default ports:

- `80`: HTTP
- `443`: HTTPS
- `22`: SSH
- `3306`: MySQL
- `5432`: PostgreSQL

A port is not a website. It is a communication endpoint on a machine.

## From browser input to page rendering

When you type a URL into the browser and press Enter, the process is roughly:

1. parse the URL;
2. resolve the domain with DNS;
3. establish a connection with the server;
4. send the HTTP request;
5. receive the HTTP response;
6. render the HTML and request additional assets such as CSS, JavaScript, and images.

## Request and response

An HTTP request usually contains:

- request line, such as `GET /index.html HTTP/1.1`
- headers
- optional request body

An HTTP response usually contains:

- status line, such as `HTTP/1.1 200 OK`
- headers
- response body

Common status codes:

- `200 OK`
- `301/302`
- `404 Not Found`
- `500 Internal Server Error`

## TCP and the three-way handshake

Underneath HTTP, the browser usually relies on TCP.

Before data transmission starts, TCP establishes the connection through the classic **three-way handshake**:

1. client sends `SYN`
2. server replies `SYN-ACK`
3. client sends `ACK`

## Final remarks

These concepts are basic, but they form the foundation of all web development:

- domains make addresses human-readable;
- DNS maps names to IPs;
- URLs describe where a resource is;
- HTTP defines how browsers and servers talk;
- TCP provides the transport layer beneath that communication.

