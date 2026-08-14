---
title: Blueprint是什么
createTime: 2026/08/14 15:41:14
permalink: /zh/blog/pelbo0n1/
---
当然。Blueprint（蓝图）是 Flask 用来**拆分和组织大型应用**的核心机制。

你可以先记住一句话：

> **Blueprint = 把一组相关的路由和代码先组织成一个模块，再统一注册到 Flask app 上。**

它本身不是一个独立的 Flask 应用，而更像是“应用的一部分应该如何被注册”的配置集合。([Flask][1])

---

# 1. 为什么需要 Blueprint？

刚开始学 Flask，我们可能只有：

```python
from flask import Flask

app = Flask(__name__)

@app.route("/users")
def users():
    ...

@app.route("/users/<int:id>")
def user(id):
    ...

@app.route("/orders")
def orders():
    ...

@app.route("/orders/<int:id>")
def order(id):
    ...

@app.route("/products")
def products():
    ...

@app.route("/products/<int:id>")
def product(id):
    ...
```

项目小时没问题。

但项目变大以后，一个 `app.py` 可能出现几十甚至几百个路由。Flask 官方也明确建议，大型应用应该拆分成多个模块，而 Blueprint 就是其中主要的组织方式。([Flask][2])

我们希望变成：

```text
project/
├── app.py
├── users.py
├── orders.py
└── products.py
```

或者进一步：

```text
project/
├── app.py
│
├── users/
│   └── routes.py
│
├── orders/
│   └── routes.py
│
└── products/
    └── routes.py
```

Blueprint 就是用来完成这件事的。

---

# 2. 最小 Blueprint 示例

先看没有 Blueprint：

```python
from flask import Flask

app = Flask(__name__)


@app.route("/users")
def get_users():
    return {"users": []}


@app.route("/users/<int:user_id>")
def get_user(user_id):
    return {"id": user_id}
```

现在把用户相关 API 单独拆到：

```text
project/
├── app.py
└── users.py
```

`users.py`：

```python
from flask import Blueprint

users_bp = Blueprint(
    "users",
    __name__
)


@users_bp.route("/users")
def get_users():
    return {
        "users": []
    }


@users_bp.route("/users/<int:user_id>")
def get_user(user_id):
    return {
        "id": user_id
    }
```

然后 `app.py`：

```python
from flask import Flask
from users import users_bp

app = Flask(__name__)

app.register_blueprint(users_bp)


if __name__ == "__main__":
    app.run(debug=True)
```

核心变化只有两个。

以前：

```python
@app.route(...)
```

现在：

```python
@users_bp.route(...)
```

然后把整个 Blueprint：

```python
app.register_blueprint(users_bp)
```

注册到真正的 Flask app 上。官方教程采用的也是这种模式：先把路由注册到 Blueprint，再把 Blueprint 注册到 application。([Flask][3])

---

# 3. 最重要的心智模型

以前：

```text
route
  │
  ▼
Flask app
```

例如：

```python
@app.route("/users")
```

用了 Blueprint 以后：

```text
route
  │
  ▼
Blueprint
  │
  ▼
Flask app
```

也就是：

```python
@users_bp.route("/users")
```

先告诉：

```text
users Blueprint
```

“我这里有一个 `/users` 路由”。

然后：

```python
app.register_blueprint(users_bp)
```

再告诉 Flask：

> 把 `users_bp` 里面定义的东西都加入这个应用。

---

# 4. Blueprint 最实用的功能：`url_prefix`

假设用户模块里所有 URL 都是：

```text
/users
/users/123
/users/456
```

我们不必反复写 `/users`。

可以：

```python
users_bp = Blueprint(
    "users",
    __name__,
    url_prefix="/users"
)
```

然后：

```python
@users_bp.route("/")
def get_users():
    return {"users": []}


@users_bp.route("/<int:user_id>")
def get_user(user_id):
    return {
        "id": user_id
    }
```

最终 URL 仍然是：

```text
GET /users/
GET /users/123
```

也就是：

```text
Blueprint prefix
      +
route path
      =
final URL
```

例如：

```text
/users
   +
/123
   =
/users/123
```

`url_prefix` 是 Blueprint 官方提供的重要组织方式。([Flask][1])

---

# 5. 一个更实际的例子

假设我们正在写一个 AI 服务：

```text
POST /api/users
GET  /api/users/123

POST /api/models/predict
GET  /api/models/status

GET  /api/health
```

可以拆成三个 Blueprint：

```text
project/
├── app.py
│
├── users.py
├── models.py
└── health.py
```

---

## users.py

```python
from flask import Blueprint, request

users_bp = Blueprint(
    "users",
    __name__,
    url_prefix="/api/users"
)


@users_bp.route("/", methods=["GET"])
def get_users():
    return {
        "users": []
    }


@users_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    return {
        "id": user_id,
        "name": "Alice"
    }


@users_bp.route("/", methods=["POST"])
def create_user():
    data = request.get_json()

    return {
        "id": 123,
        "name": data["name"]
    }, 201
```

---

## models.py

```python
from flask import Blueprint, request

models_bp = Blueprint(
    "models",
    __name__,
    url_prefix="/api/models"
)


@models_bp.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    x = data["x"]

    result = sum(x)

    return {
        "result": result
    }


@models_bp.route("/status")
def status():
    return {
        "status": "ready"
    }
```

---

## health.py

```python
from flask import Blueprint

health_bp = Blueprint(
    "health",
    __name__,
    url_prefix="/api"
)


@health_bp.route("/health")
def health():
    return {
        "status": "ok"
    }
```

---

## app.py

```python
from flask import Flask

from users import users_bp
from models import models_bp
from health import health_bp


app = Flask(__name__)

app.register_blueprint(users_bp)
app.register_blueprint(models_bp)
app.register_blueprint(health_bp)


if __name__ == "__main__":
    app.run(debug=True)
```

最终 Flask 得到：

```text
GET  /api/users/
GET  /api/users/123
POST /api/users/

POST /api/models/predict
GET  /api/models/status

GET  /api/health
```

虽然代码散落在三个文件里，但对 Flask 来说，它们最终仍然属于**同一个应用**。

---

# 6. Blueprint 不是“另一个 Flask app”

这个区别非常重要。

你不是在写：

```python
users_app = Flask(...)
models_app = Flask(...)
```

而是：

```python
users_bp = Blueprint(...)
models_bp = Blueprint(...)
```

最后：

```text
users_bp ───────┐
                │
models_bp ──────┼──→ Flask app
                │
health_bp ──────┘
```

Flask 官方特别说明，`Blueprint` 看起来和 `Flask` 对象有些类似，但 Blueprint **并不是 application**。([Flask][1])

---

# 7. Blueprint 的第一个参数是什么？

你会一直看到：

```python
Blueprint("users", __name__)
```

第一个：

```python
"users"
```

是 Blueprint 的**名称**。

例如：

```python
users_bp = Blueprint("users", __name__)
```

Flask 会用这个名字构造 endpoint。

比如：

```python
@users_bp.route("/<int:id>")
def get_user(id):
    ...
```

它的 endpoint 通常是：

```text
users.get_user
```

而不是单纯：

```text
get_user
```

因此以后你如果使用：

```python
url_for(...)
```

一般会看到：

```python
url_for(
    "users.get_user",
    id=123
)
```

Blueprint 的命名空间机制也帮助不同模块避免 view function 名称冲突。([Flask][1])

---

# 8. `__name__` 又是什么？

这里：

```python
Blueprint(
    "users",
    __name__
)
```

和：

```python
Flask(__name__)
```

里的 `__name__` 思路类似。

它告诉 Flask：

> 这个 Blueprint 定义在哪个 Python module/package 中。

Flask 可以据此定位与 Blueprint 相关的资源，例如 templates 和 static files。([Flask][1])

初学阶段不用深究。

直接习惯写：

```python
bp = Blueprint(
    "xxx",
    __name__
)
```

即可。

---

# 9. 更推荐的项目结构

等你的 Flask 项目稍微长大，我会更推荐：

```text
project/
├── app.py
│
├── routes/
│   ├── __init__.py
│   ├── users.py
│   ├── models.py
│   └── health.py
│
├── services/
│   ├── user_service.py
│   └── model_service.py
│
└── models/
    └── user.py
```

这里有一个很重要的职责划分：

```text
routes/
    ↓
处理 HTTP

services/
    ↓
处理业务逻辑

models/
    ↓
处理数据结构 / 数据库
```

例如：

```python
@models_bp.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    result = model_service.predict(data["x"])

    return {
        "result": result
    }
```

而真正的模型代码：

```python
# services/model_service.py

def predict(x):
    ...
```

这样 route 不会越来越肥。

---

# 10. Blueprint + CORS

这正好能和我们上一节连起来。

比如：

```python
from flask import Flask
from flask_cors import CORS

from routes.users import users_bp
from routes.models import models_bp

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "http://localhost:3000"
        }
    }
)

app.register_blueprint(users_bp)
app.register_blueprint(models_bp)
```

于是：

```text
Frontend
localhost:3000
      │
      ▼
     CORS
      │
      ▼
Flask App
      │
      ├── users_bp
      │     ├── GET /api/users
      │     └── POST /api/users
      │
      └── models_bp
            └── POST /api/models/predict
```

Blueprint 负责：

> **代码和路由怎么组织。**

CORS 负责：

> **哪些 Origin 的浏览器前端能访问这些 API。**

它们解决的是两个完全不同的问题。

---

# 11. 再往前一步：Application Factory

你以后很可能还会看到这种代码：

```python
def create_app():
    app = Flask(__name__)

    app.register_blueprint(users_bp)
    app.register_blueprint(models_bp)

    return app
```

而不是：

```python
app = Flask(__name__)
```

直接写在全局。

这个模式叫：

> **Application Factory**

Flask 官方文档把 Blueprint + Application Factory 作为大型应用很常见的组合：Blueprint 拆模块，factory 负责创建并组装整个 app。([Flask][4])

可以理解成：

```text
users_bp ────┐
             │
models_bp ───┼──→ create_app()
             │        │
auth_bp ─────┘        ▼
                   Flask App
```

但**你现在不用急着学 Factory**。

先把 Blueprint 掌握好。

---

# 12. Blueprint 到底解决了什么问题？

你可以用一个类比理解。

没有 Blueprint：

```text
app.py

用户 API
订单 API
模型 API
登录 API
文件 API
数据库 API
...
```

相当于：

> 所有东西全部扔在一个房间里。

有 Blueprint：

```text
Flask App
│
├── users blueprint
│
├── auth blueprint
│
├── orders blueprint
│
└── models blueprint
```

相当于：

> 房子还是一栋房子，但是划分成不同房间。

所以 Blueprint 并没有增加新的 Web 能力。

它主要解决的是：

**模块化。**

---

# 13. 你现在真正需要记住的代码

Blueprint 文件：

```python
from flask import Blueprint

users_bp = Blueprint(
    "users",
    __name__,
    url_prefix="/api/users"
)


@users_bp.route("/")
def get_users():
    return {
        "users": []
    }
```

Flask app：

```python
from flask import Flask
from users import users_bp

app = Flask(__name__)

app.register_blueprint(users_bp)
```

然后记住这个关系：

```text
@app.route(...)
```

变成：

```text
@bp.route(...)
```

最后：

```python
app.register_blueprint(bp)
```

就够了。

---

## 14. 把我们目前学的东西串起来

现在你已经有一个很不错的 Flask 心智模型：

```text
                Browser / Frontend
                        │
                     HTTP
                        │
                ┌───────▼───────┐
                │      CORS     │
                └───────┬───────┘
                        │
                 ┌──────▼──────┐
                 │  Flask App  │
                 └──────┬──────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
      users_bp       model_bp      auth_bp
          │             │             │
       routes          routes        routes
```

其中：

```text
Flask        HTTP 请求 → Python

REST         API 怎么设计

CORS         谁可以跨 Origin 访问 API

Blueprint    怎么组织大量 API
```

这四个概念如果能分清楚，Flask 的基本框架其实已经建立起来了。

按照你原来的路线：

```text
文件上传 → CORS → Blueprint → 数据库 → 部署
```

现在 **CORS 和 Blueprint 都已经过完了**。下一步“数据库”会是明显更大的一块：可以从 **SQLite → SQL → SQLAlchemy → Flask-SQLAlchemy → CRUD → migration** 这条线学，比直接上 ORM 更容易真正理解 Flask 后端的数据层。

[1]: https://flask.palletsprojects.com/en/stable/blueprints/?utm_source=chatgpt.com "Modular Applications with Blueprints"
[2]: https://flask.palletsprojects.com/en/stable/patterns/packages/?utm_source=chatgpt.com "Large Applications as Packages"
[3]: https://flask.palletsprojects.com/en/stable/tutorial/views/?utm_source=chatgpt.com "Blueprints and Views"
[4]: https://flask.palletsprojects.com/en/stable/patterns/appfactories/?utm_source=chatgpt.com "Application Factories — Flask Documentation (3.1.x)"
