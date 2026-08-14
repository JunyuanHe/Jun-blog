---
title: 快速理解CORS
createTime: 2026/08/14 15:40:30
permalink: /zh/blog/93vludzd/
---

CORS 是你做“前端 + Flask 后端”时几乎一定会遇到的东西。

最简单地说：

> **CORS（Cross-Origin Resource Sharing，跨源资源共享）是一套浏览器安全机制，用来决定：一个网页能不能访问另一个 Origin 的服务器。**

---

## 1. 什么叫“跨域”？

假设你的前端运行在：

```text
http://localhost:3000
```

Flask 后端运行在：

```text
http://localhost:5000
```

前端写：

```javascript
fetch("http://localhost:5000/api/users")
```

这就是一个**跨源请求**。

因为浏览器判断 Origin 时看三个东西：

```text
协议 + 域名 + 端口
```

所以：

```text
http://localhost:3000
http://localhost:5000
```

虽然都是 `localhost`，但端口不同，因此 Origin 不同。浏览器默认受 Same-Origin Policy 限制；CORS 是服务器明确告诉浏览器“哪些其他 Origin 可以访问我”的机制。([MDN Web Docs][1])

---

# 2. 你会怎么遇到 CORS 错误？

例如 Flask：

```python
from flask import Flask

app = Flask(__name__)


@app.route("/api/hello")
def hello():
    return {"message": "hello"}


app.run(port=5000)
```

然后你的前端在：

```text
http://localhost:3000
```

执行：

```javascript
fetch("http://localhost:5000/api/hello")
    .then(res => res.json())
    .then(data => console.log(data))
```

你可能看到：

```text
Access to fetch at 'http://localhost:5000/api/hello'
from origin 'http://localhost:3000'
has been blocked by CORS policy
```

注意一个非常重要的点：

> **通常不是 Flask 拒绝了请求，而是浏览器不允许你的 JavaScript 读取响应。**

这也是为什么：

```bash
curl http://localhost:5000/api/hello
```

通常完全正常。

Postman 也可能正常。

但浏览器里的 JavaScript：

```javascript
fetch(...)
```

却报错。

因为 **CORS 主要是浏览器执行的安全策略**。([MDN Web Docs][2])

---

# 3. Flask 怎么解决？

最常见的办法是安装：

```bash
pip install flask-cors
```

然后：

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

CORS(app)


@app.route("/api/hello")
def hello():
    return {"message": "hello"}


if __name__ == "__main__":
    app.run(debug=True)
```

这样 Flask-CORS 会给响应加入相应的 CORS Header。其默认配置非常宽松，可以对所有路由启用跨源访问。([flask-cors.readthedocs.io][3])

于是：

```text
localhost:3000
      │
      │ fetch()
      ▼
localhost:5000
```

就可以工作了。

---

# 4. Flask-CORS 实际干了什么？

本质上它只是帮你添加 HTTP Header。

例如浏览器请求：

```http
GET /api/hello
Origin: http://localhost:3000
```

服务器可能返回：

```http
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:3000
```

浏览器看到：

```text
Access-Control-Allow-Origin
```

就知道：

> 服务器允许 `http://localhost:3000` 这个网页读取响应。

这个 Header 是 CORS 最核心的东西。([MDN Web Docs][1])

---

# 5. `CORS(app)` 为什么开发时很好用？

最简单：

```python
CORS(app)
```

相当于非常宽松地开启 CORS。

你也经常会看到：

```python
CORS(app, origins="*")
```

`*` 表示：

```text
任何 Origin
```

都可以访问。

比如：

```text
http://localhost:3000
http://localhost:5173
https://abc.com
https://xyz.com
```

对于**没有 credentials 的公开 API**，`Access-Control-Allow-Origin: *` 是合法的。([MDN Web Docs][1])

本地开发时这样很方便。

---

# 6. 生产环境最好限定 Origin

假设你的正式前端是：

```text
https://myapp.com
```

建议：

```python
CORS(
    app,
    origins=["https://myapp.com"]
)
```

那么：

```text
https://myapp.com
        ↓
      Flask
        ✓
```

但是：

```text
https://evil.com
        ↓
      Flask
        ✗
```

Flask-CORS 支持通过 `origins` 精确指定允许的 Origin；Origin 中需要包含协议和必要的端口。([flask-cors.readthedocs.io][4])

开发时也可以：

```python
CORS(
    app,
    origins=[
        "http://localhost:3000",
        "http://localhost:5173"
    ]
)
```

比如 React 常见：

```text
localhost:3000
```

Vite 常见：

```text
localhost:5173
```

---

# 7. 最推荐的配置方式

如果你的 API 都放在：

```text
/api/...
```

可以只开放 API：

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://localhost:3000"
            ]
        }
    }
)
```

然后：

```python
@app.route("/api/users")
def users():
    return {"users": []}


@app.route("/")
def index():
    return "Homepage"
```

现在 CORS 只应用于：

```text
/api/*
```

而不是整个 Flask 网站。

Flask-CORS 官方 API 支持按 resource/path 单独配置 CORS。([flask-cors.readthedocs.io][4])

这种结构我比较推荐：

```text
前端
 │
 ├── GET  /api/users
 ├── POST /api/login
 └── POST /api/predict
          │
          ▼
        Flask
```

---

# 8. 一个稍微奇怪的东西：OPTIONS

以后你可能会看到浏览器突然请求：

```text
OPTIONS /api/users
```

然后你会想：

> 我明明发的是 POST，怎么突然多了一个 OPTIONS？

这就是：

> **CORS Preflight（预检请求）**

某些跨源请求真正发送之前，浏览器会先问服务器：

> “我来自 `localhost:3000`，我准备发送一个 POST，而且要带 `Content-Type` 等 Header，你允许吗？”

这次询问就是一个 `OPTIONS` 请求。([MDN Web Docs][5])

例如：

```http
OPTIONS /api/users

Origin: http://localhost:3000
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type
```

服务器回答：

```http
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: Content-Type
```

浏览器：

```text
可以发送
   ↓
POST /api/users
```

所以完整流程可能是：

```text
Browser
   │
   │ OPTIONS /api/users
   ▼
Flask
   │
   │ 允许 POST
   ▼
Browser
   │
   │ POST /api/users
   ▼
Flask
```

Flask-CORS 会替你处理绝大多数这种情况。([flask-cors.readthedocs.io][4])

---

# 9. 为什么有些 GET 不需要 OPTIONS？

因为 CORS 区分：

```text
simple request
non-simple request
```

某些简单请求可以直接：

```text
GET
 ↓
server
```

而一些请求需要：

```text
OPTIONS
   ↓
确认权限
   ↓
POST / PUT / PATCH / DELETE ...
```

例如带某些自定义 Header 或某些 `Content-Type` 的请求就可能触发 preflight。([MDN Web Docs][1])

你刚开始不需要背规则。

只需要知道：

> **浏览器突然发 OPTIONS 通常不是 bug，而是在做 CORS 预检。**

---

# 10. Cookie / 登录时要特别注意

假设你用 Flask Session：

```python
session["user_id"] = 123
```

前端跨域访问，并希望携带 Cookie。

这时候 Flask 需要：

```python
CORS(
    app,
    origins=["http://localhost:3000"],
    supports_credentials=True
)
```

前端：

```javascript
fetch("http://localhost:5000/api/me", {
    credentials: "include"
})
```

这里不能简单写：

```python
CORS(
    app,
    origins="*",
    supports_credentials=True
)
```

因为 credentialed CORS 不能使用 `Access-Control-Allow-Origin: *`；必须指定允许的 Origin。([flask-cors.readthedocs.io][4])

而且 cookie 跨站访问还会涉及：

```text
SameSite
Secure
CSRF
```

这些等真正做到登录系统再学即可。Flask-CORS 文档也特别提醒，跨域 Cookie/凭证场景需要考虑 CSRF 等安全问题。([flask-cors.readthedocs.io][3])

---

# 11. 一个你现在可以直接记住的模板

假设：

```text
React / Vue
http://localhost:3000

        ↓ HTTP

Flask
http://localhost:5000
```

Flask：

```python
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "http://localhost:3000"
        }
    }
)


@app.route("/api/hello")
def hello():
    return {
        "message": "Hello!"
    }


@app.route("/api/add", methods=["POST"])
def add():
    data = request.get_json()

    return {
        "result": data["a"] + data["b"]
    }


if __name__ == "__main__":
    app.run(debug=True)
```

前端：

```javascript
const response = await fetch(
    "http://localhost:5000/api/add",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            a: 10,
            b: 20
        })
    }
)

const data = await response.json()

console.log(data)
```

输出：

```javascript
{
    result: 30
}
```

---

# 12. 最后形成这个心智模型

CORS **不是 Flask 特有的东西**。

它发生在：

```text
JavaScript
   │
   │ 跨 Origin HTTP Request
   ▼
Browser
   │
   │ “这个服务器允许这个网页访问吗？”
   ▼
Server
   │
   │ CORS Response Headers
   ▼
Browser
   │
   ├── 允许 → JavaScript 得到响应
   │
   └── 不允许 → CORS Error
```

而 Flask-CORS 做的事情就是：

```python
CORS(app)
```

↓

自动帮 Flask 添加：

```http
Access-Control-Allow-Origin
Access-Control-Allow-Methods
Access-Control-Allow-Headers
...
```

所以你目前只需要牢牢记住三个东西：

```text
CORS = 浏览器对跨 Origin 请求的访问控制

Origin = scheme + host + port

Flask:
from flask_cors import CORS
CORS(app, origins=["你的前端地址"])
```

这就已经足够应付大多数 Flask 初学项目了。

[1]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS?utm_source=chatgpt.com "Cross-Origin Resource Sharing (CORS) - MDN Web Docs"
[2]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSMissingAllowOrigin?utm_source=chatgpt.com "Reason: CORS header 'Access-Control-Allow-Origin' missing"
[3]: https://flask-cors.readthedocs.io/en/latest/api.html?utm_source=chatgpt.com "API Docs — Flask-Cors 3.0.10 documentation"
[4]: https://flask-cors.readthedocs.io/en/latest/configuration.html?utm_source=chatgpt.com "Configuration — Flask-Cors 3.0.10 documentation"
[5]: https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request?utm_source=chatgpt.com "Preflight request - Glossary - MDN Web Docs"
