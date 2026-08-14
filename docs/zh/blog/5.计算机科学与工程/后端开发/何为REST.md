---
title: 何为 REST
createTime: 2026/08/14 15:38:15
permalink: /zh/blog/p9ssb2qn/
---

REST API 是一种**设计 Web API 的常见风格**。

你可以先把它理解成：

> 用 URL 表示“资源”，用 HTTP Method 表示“对资源做什么”。

例如我们有一个“用户”资源：

```text
/users
/users/123
```

那么可以设计成：

```text
GET    /users        获取用户列表
GET    /users/123    获取 123 号用户
POST   /users        创建用户
PUT    /users/123    修改 123 号用户
DELETE /users/123    删除 123 号用户
```

这里 URL 尽量表达的是**东西是什么**，而不是动作。

比如 REST 风格通常更喜欢：

```text
DELETE /users/123
```

而不是：

```text
POST /deleteUser?id=123
```

---

REST 的核心思想可以抓住三个点：

1. **Resource（资源）**
   用户、文章、订单、模型任务等都可以看作资源：

```text
/users
/articles
/orders
```

2. **HTTP Method 表示操作**

```text
GET     查询
POST    创建
PUT     整体更新
PATCH   部分更新
DELETE  删除
```

3. **服务器尽量无状态（stateless）**
   每次请求应该携带完成这次请求所需要的信息，而不是依赖“服务器记得上一次请求发生了什么”。

例如：

```http
GET /users/123
Authorization: Bearer xxx
```

服务器根据这一次请求本身就能处理它。

在 Flask 中，一个 REST API 可能长这样：

```python
from flask import Flask, request

app = Flask(__name__)


@app.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    return {
        "id": user_id,
        "name": "Alice"
    }


@app.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()

    return {
        "id": 123,
        "name": data["name"]
    }, 201
```

对应：

```text
GET /users/123
```

返回：

```json
{
  "id": 123,
  "name": "Alice"
}
```

以及：

```text
POST /users

{
  "name": "Alice"
}
```

创建一个用户。

需要注意：**REST API 不等于 API，也不等于 HTTP API。**

关系大致是：

```text
API
└── Web / HTTP API
    ├── REST API
    ├── GraphQL API
    ├── RPC 风格 API
    └── ...
```

所以当别人说：

> “我们用 Flask 写一个 REST API。”

通常就是指：

> 用 Flask 写 HTTP 接口，并按照资源 + HTTP Method 这种 REST 风格来组织 URL 和行为。

对于学习 Flask，实际上先掌握：

```text
URL
HTTP Method
Request
Response
JSON
HTTP Status Code
```

就足够了。REST 只是告诉你**这些东西应该怎样组织得比较规范**。
