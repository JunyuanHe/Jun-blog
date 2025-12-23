---
title: 网络摄像头应用 Phase 0 总结：我是如何组织一个 CameraX + Compose 应用的
createTime: 2025/12/23 15:02:42
permalink: /blog/fv3v737c/
tags:
    - Android
---


（我使用AI帮我整理了 Phase 0 的关键点，以便我日后回顾。）

---

## 一、为什么要专门写一篇「项目结构」博文？

在学习 Android（尤其是 Compose + CameraX）时，对我来说一个非常常见的问题是：

> **代码当时写得出来，但过几天完全看不懂了。**

原因通常不是代码复杂，而是：

* 不清楚 **文件为什么放在这里**
* 不明白 **每个文件的职责边界**
* 逻辑和 UI、状态和视图混在一起理解

因此，在 Phase 0 完成后，我觉得有必要单独整理一篇：**“项目结构认知文档”**

它回答的是三个核心问题：

1. 这个项目一共有哪几类文件？
2. 每个文件负责什么？
3. 我以后要改功能，应该从哪里下手？



## 二、Phase 0 的整体项目结构

这是一个**标准 Android Studio + Compose 项目**，目录如下：

```text
MobileCam/
├── app/
│   ├── src/main/
│   │   ├── AndroidManifest.xml
│   │   ├── java/com/example/mobilecam/
│   │   │   ├── MainActivity.kt
│   │   │   └── ui/theme/
│   │   │       ├── Color.kt
│   │   │       ├── Theme.kt
│   │   │       └── Type.kt
│   │   └── res/
│   │       ├── values/
│   │       └── xml/
│   └── build.gradle.kts
└── build.gradle.kts
```

在 Phase 0 中，**真正需要理解的文件只有三个**：

1. `AndroidManifest.xml`
2. `MainActivity.kt`
3. `CameraPreview（Composable）`

其余文件暂时可以当作“基础设施”。



## 三、AndroidManifest.xml：权限与能力声明层

### 1️⃣ 它的职责是什么？

`AndroidManifest.xml` 的作用不是写逻辑，而是：

> **向系统声明：这个 App 需要什么能力**

在 Phase 0 中，它只负责两件事：

* 声明 Camera 权限
* 声明依赖摄像头硬件

### 2️⃣ Phase 0 的 Manifest 内容

```xml
<uses-permission android:name="android.permission.CAMERA" />

<uses-feature
    android:name="android.hardware.camera.any"
    android:required="true" />
```

### 3️⃣ 一个非常重要的认知

> **Manifest ≠ 请求权限**

* Manifest：声明“我有资格使用相机”
* Runtime（运行时）：真正向用户请求授权

如果不写 Manifest：

* 系统会直接拒绝 CameraX
* 权限弹窗根本不会出现



## 四、MainActivity.kt：应用的「状态与流程中枢」

`MainActivity.kt` 是 Phase 0 的**绝对核心文件**。

你可以把它理解为：

> **“当前应用处于什么状态，应该显示什么界面”**



### 1️⃣ MainActivity 的职责边界

| 职责           | 是否属于 MainActivity |
| ------------ | ----------------- |
| 权限状态管理       | ✔                 |
| 权限请求流程       | ✔                 |
| UI 显示分流      | ✔                 |
| CameraX 具体实现 | ✘                 |
| UI 细节布局      | ✘                 |

这是一种**刻意的职责隔离设计**。



### 2️⃣ MainActivity 的核心结构

```kotlin
class MainActivity : ComponentActivity() {

    private lateinit var cameraPermissionLauncher: ActivityResultLauncher<String>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val hasCameraPermission = mutableStateOf(...)

        cameraPermissionLauncher = registerForActivityResult(
            ActivityResultContracts.RequestPermission()
        ) { granted ->
            hasCameraPermission.value = granted
        }

        setContent {
            if (hasCameraPermission.value) {
                CameraPreview(activity = this)
            } else {
                NoPermissionView {
                    cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
                }
            }
        }
    }
}
```



### 3️⃣ 这段结构在做什么？

可以用一句话概括：

> **回调只修改状态，UI 只读取状态**

* 权限变化 → 修改 `hasCameraPermission`
* Compose 自动重组 UI
* 没有手动跳转、没有 if-else 嵌套逻辑

这是 **Compose 推荐的“状态驱动 UI”模式**。



## 五、CameraPreview：CameraX 的技术实现层

### 1️⃣ 它的职责非常单一

`CameraPreview` 只负责：

1. 创建 CameraX 官方的 `PreviewView`
2. 初始化 CameraProvider
3. 绑定生命周期并显示预览

它**不关心权限、不关心按钮、不关心 UI 切换**。



### 2️⃣ 为什么一定要用 AndroidView？

事实是：

* CameraX 官方只支持 `PreviewView`
* Compose 目前没有原生摄像头组件
* `AndroidView` 是 Google 官方推荐的桥接方式

```kotlin
AndroidView(
    factory = { ctx ->
        val previewView = PreviewView(ctx)
        ...
        previewView
    }
)
```

> **AndroidView = Compose 与传统 View 世界的桥梁**



### 3️⃣ CameraX 生命周期绑定的意义

```kotlin
cameraProvider.bindToLifecycle(
    activity,
    CameraSelector.DEFAULT_BACK_CAMERA,
    preview
)
```

这行代码的意义是：

* Activity 可见 → 摄像头打开
* Activity 不可见 → 摄像头自动释放
* 不需要手动管理 onResume / onPause

这是 CameraX 的核心优势之一。



## 六、NoPermissionView：纯 UI 组件示例

```kotlin
@Composable
fun NoPermissionView(onRequestPermission: () -> Unit) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Button(
            modifier = Modifier.width(200.dp).height(60.dp),
            onClick = onRequestPermission
        ) {
            Text("请求相机权限")
        }
    }
}
```

这个组件的价值在于：

* UI 与逻辑完全解耦
* 通过回调与外部通信
* 可以随时替换样式，不影响逻辑



## 七、Phase 0 的「完整思维模型」

在 Phase 0 中真正掌握的不是 CameraX API，而是这个模型：

```
用户操作
   ↓
异步系统事件（权限 / CameraX）
   ↓
回调函数
   ↓
更新 Compose 状态
   ↓
UI 自动重组
```

这个模型在后续阶段会反复出现：

* 变焦 Slider
* 拍照
* 推流
* 网络传输



## 八、结语：为什么我认为 Phase 0 非常成功

Phase 0 的成功不在于：

* “我显示了摄像头画面”

而在于：

* 建立了 **正确的 Android + Compose + 异步认知结构**
* 已经在用 **正确的思维** 写代码
* 知道每一段代码“属于哪里、为什么存在”

这比多写十个 Demo 都重要。

