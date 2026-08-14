---
title: Flask 快速入门
createTime: 2026/08/14 10:37:04
permalink: /blog/4wu91552/
---

可以。Flask 很适合快速写 **Python Web 后端 / REST API**。下面用一个最小项目，让你在大约 20 分钟内掌握最核心的部分。当前 Flask 官方稳定文档是 3.1.x。([Flask][1])

## 1. Flask 到底是什么？

你可以把 Flask 理解成：

> **HTTP 请求 → Python 函数 → HTTP 响应**

例如浏览器访问：

```text
GET http://localhost:5000/hello
```

Flask 找到对应 Python 函数：

```python
@app.route("/hello")
def hello():
    return "Hello"
```

然后把 `"Hello"` 作为 HTTP Response 返回。

这就是 Flask 最核心的模型。

---

## 2. 安装

建议创建虚拟环境：

```bash
mkdir flask-demo
cd flask-demo

python -m venv .venv
source .venv/bin/activate
```

macOS / Linux 都是上面的激活方式。

然后：

```bash
pip install flask
```

这是 Flask 官方推荐的基本安装方式。([Flask][2])

创建：

```text
flask-demo/
└── app.py
```

---

## 3. 第一个 Flask 程序

`app.py`：

```python
from flask import Flask

app = Flask(__name__)


@app.route("/")
def index():
    return "Hello Flask!"


if __name__ == "__main__":
    app.run(debug=True)
```

运行：

```bash
python app.py
```

然后访问：

```text
http://127.0.0.1:5000/
```

看到：

```text
Hello Flask!
```

Flask 官方的最小应用本质上就是 `Flask(__name__) + @app.route + view function`。([Flask][1])

这里最重要的是：

```python
app = Flask(__name__)
```

创建 Web 应用。

而：

```python
@app.route("/")
```

表示：

> HTTP 请求访问 `/` 时，调用下面这个函数。

因此：

```python
@app.route("/")
def index():
    return "Hello Flask!"
```

可以理解成映射：

```text
GET /
  ↓
index()
  ↓
"Hello Flask!"
```

---

## 4. Route：定义 API

可以定义很多地址：

```python
@app.route("/")
def index():
    return "Home"


@app.route("/hello")
def hello():
    return "Hello"


@app.route("/about")
def about():
    return "About"
```

于是：

```text
GET /
GET /hello
GET /about
```

分别调用不同函数。

---

### URL 参数

例如：

```python
@app.route("/user/<name>")
def user(name):
    return f"Hello {name}"
```

访问：

```text
http://localhost:5000/user/alice
```

返回：

```text
Hello alice
```

也可以限定类型：

```python
@app.route("/user/<int:user_id>")
def user(user_id):
    return f"user id = {user_id}"
```

访问：

```text
/user/123
```

Flask 会自动得到：

```python
user_id == 123
```

---

## 5. GET 参数

假设请求：

```text
GET /search?q=flask&page=2
```

Flask 使用：

```python
from flask import request
```

读取：

```python
@app.route("/search")
def search():
    q = request.args.get("q")
    page = request.args.get("page", default=1, type=int)

    return {
        "query": q,
        "page": page
    }
```

请求：

```bash
curl "http://localhost:5000/search?q=python&page=2"
```

返回：

```json
{
  "page": 2,
  "query": "python"
}
```

这里可以记住：

```python
request.args
```

就是 URL 中：

```text
?key=value&key2=value2
```

这些参数。

---

## 6. POST + JSON：最重要

现在后端开发最常见的是：

```text
前端
 ↓ JSON
Flask API
 ↓
Python
```

例如：

```python
from flask import Flask, request

app = Flask(__name__)


@app.route("/add", methods=["POST"])
def add():
    data = request.get_json()

    a = data["a"]
    b = data["b"]

    return {
        "result": a + b
    }
```

运行之后：

```bash
curl -X POST \
  http://localhost:5000/add \
  -H "Content-Type: application/json" \
  -d '{"a": 10, "b": 20}'
```

返回：

```json
{
  "result": 30
}
```

这个模式非常重要。

你以后绝大多数 AI / 算法后端其实都是：

```python
@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    x = data["input"]

    result = model.predict(x)

    return {
        "result": result
    }
```

---

## 7. 一个真正像 API 的例子

例如做一个简单文本分析 API：

```python
from flask import Flask, request

app = Flask(__name__)


@app.route("/health")
def health():
    return {
        "status": "ok"
    }


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()

    text = data.get("text")

    if not text:
        return {
            "error": "text is required"
        }, 400

    result = {
        "text": text,
        "length": len(text),
        "words": len(text.split())
    }

    return result


if __name__ == "__main__":
    app.run(debug=True)
```

请求：

```bash
curl -X POST \
  http://127.0.0.1:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "hello flask world"}'
```

返回：

```json
{
  "length": 17,
  "text": "hello flask world",
  "words": 3
}
```

这里：

```python
return result
```

Flask 可以把 `dict` 转成 JSON response。

而：

```python
return {
    "error": "text is required"
}, 400
```

表示：

```text
Response Body
+
HTTP Status Code 400
```

---

## 8. HTTP Method

最常用的四个：

| Method | 意义      | 例子   |
| ------ | ------- | ---- |
| GET    | 获取数据    | 获取用户 |
| POST   | 创建/提交数据 | 推理请求 |
| PUT    | 更新      | 修改用户 |
| DELETE | 删除      | 删除用户 |

例如：

```python
@app.route("/users", methods=["GET"])
def get_users():
    pass
```

```python
@app.route("/users", methods=["POST"])
def create_user():
    pass
```

```python
@app.route("/users/<int:id>", methods=["DELETE"])
def delete_user(id):
    pass
```

于是构成：

```text
GET    /users
POST   /users
DELETE /users/123
```

这就是 REST API 最基础的设计方式。

---

## 9. request 是什么？

Flask 里非常重要：

```python
from flask import request
```

它表示**当前 HTTP 请求**。

常用内容：

```python
request.method
```

例如：

```text
GET
POST
```

URL query：

```python
request.args
```

JSON body：

```python
request.get_json()
```

Form：

```python
request.form
```

上传文件：

```python
request.files
```

HTTP Header：

```python
request.headers
```

Flask 会在处理请求期间建立 request context，所以你可以直接使用这个 `request` 代理对象。([Flask][3])

---

## 10. 返回 Response

最简单：

```python
return "hello"
```

JSON：

```python
return {
    "name": "Alice",
    "age": 20
}
```

状态码：

```python
return {
    "error": "Not found"
}, 404
```

自定义 header：

```python
return {
    "result": "ok"
}, 200, {
    "X-Test": "hello"
}
```

所以可以粗略理解成：

```python
return body, status_code, headers
```

---

## 11. HTML 页面

Flask 不仅能做 API，也可以直接返回 HTML：

```python
@app.route("/")
def index():
    return """
    <html>
        <body>
            <h1>Hello Flask</h1>
        </body>
    </html>
    """
```

但实际项目一般使用模板。

目录：

```text
flask-demo/
├── app.py
└── templates/
    └── index.html
```

`index.html`：

```html
<!DOCTYPE html>
<html>
<body>

<h1>Hello {{ name }}</h1>

</body>
</html>
```

Python：

```python
from flask import render_template


@app.route("/user/<name>")
def user(name):
    return render_template(
        "index.html",
        name=name
    )
```

Flask 默认集成 Jinja 模板引擎。([Flask][4])

---

## 12. Flask 项目最初可以非常简单

一开始：

```text
project/
└── app.py
```

完全没问题。

但项目越来越大时：

```text
project/
├── app.py
├── routes/
│   ├── user.py
│   └── model.py
├── services/
│   └── model_service.py
├── templates/
├── static/
└── requirements.txt
```

官方教程也建议随着项目增长，从单文件逐渐转向 Python package / application factory 等结构。([Flask][5])

但**刚学 Flask 时先不要折腾 Blueprint、Factory、ORM**。

先把：

```text
route
request
response
JSON
GET/POST
```

五件事搞懂。

---

## 13. 你真正应该形成的心智模型

看到：

```python
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    result = model(data["input"])

    return {
        "result": result
    }
```

脑子里应该直接变成：

```text
Client
   │
   │ POST /predict
   │ {"input": ...}
   ▼
Flask
   │
   ▼
predict()
   │
   ├── request.get_json()
   │
   ├── model(...)
   │
   ▼
{"result": ...}
   │
   ▼
HTTP Response
```

**Flask 本质上就是把 HTTP 世界和你的 Python 函数连接起来。**

---

## 14. 建议你亲手完成这 5 个小练习

按顺序写：

```text
1. GET /hello
   返回 "Hello World"

2. GET /square?x=5
   返回
   {"result": 25}

3. POST /add
   输入
   {"a": 3, "b": 4}
   返回
   {"result": 7}

4. POST /statistics
   输入
   {"numbers": [1,2,3,4]}
   返回
   {
       "sum": 10,
       "mean": 2.5,
       "max": 4
   }

5. POST /predict
   输入
   {"x": [1,2,3]}
   调用一个 Python predict() 函数
   返回预测结果
```

如果这五个你都能不查资料写出来，**Flask 作为算法/AI 后端所需的核心内容基本就已经入门了**。

另外，`app.run(debug=True)` / Flask 自带开发服务器适合本地开发；生产环境应该使用正式的 WSGI server，而不是直接拿开发服务器上线。([Flask][6])

**给 Python/AI 模型写后端接口**，值得学习的链路是：`文件上传 → CORS → Blueprint → 数据库 → 部署`，而不是先系统学习前端。

[1]: https://flask.palletsprojects.com/en/stable/quickstart/?utm_source=chatgpt.com "Quickstart — Flask Documentation (3.1.x)"
[2]: https://flask.palletsprojects.com/en/stable/installation/?utm_source=chatgpt.com "Installation — Flask Documentation (3.1.x)"
[3]: https://flask.palletsprojects.com/en/stable/reqcontext/?utm_source=chatgpt.com "The Request Context — Flask Documentation (3.1.x)"
[4]: https://flask.palletsprojects.com/en/stable/templating/?utm_source=chatgpt.com "Templates — Flask Documentation (3.1.x)"
[5]: https://flask.palletsprojects.com/en/stable/tutorial/factory/?utm_source=chatgpt.com "Application Setup — Flask Documentation (3.1.x)"
[6]: https://flask.palletsprojects.com/en/stable/deploying/?utm_source=chatgpt.com "Deploying to Production — Flask Documentation (3.1.x)"

