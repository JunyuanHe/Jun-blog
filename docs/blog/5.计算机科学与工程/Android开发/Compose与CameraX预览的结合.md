---
title: Compose与CameraX预览的结合
createTime: 2025/12/23 14:43:46
permalink: /blog/pxexkzn5/
tags:
    - Android
---



## 一、背景

权限申请完成后，下一步是显示 **后置摄像头实时预览**。
CameraX 官方推荐使用 **PreviewView** 作为摄像头预览控件，但 Jetpack Compose 目前没有原生摄像头容器。

因此，我们需要用 **AndroidView** 将传统 View 嵌入 Compose UI 中，实现 CameraX 与 Compose 的融合。

> 这一篇笔记主要解决 **CameraX 预览与 Compose UI** 的集成问题。



## 二、PreviewView 与 AndroidView

### 1. PreviewView

* CameraX 官方控件，用于显示摄像头预览
* 负责渲染摄像头帧数据
* 必须绑定 CameraX `Preview` 输出

### 2. AndroidView

Compose 提供的工具函数：

```kotlin
AndroidView(
    factory = { context -> 
        // 返回一个传统 Android View
    },
    modifier = Modifier.fillMaxSize()
)
```

* `factory` lambda：必须返回一个 Android View
* `modifier`：控制 View 在 Compose 布局中的大小与位置

核心：AndroidView 让 Compose 可以嵌入任何传统 Android View，包括 CameraX PreviewView、MapView 等。



## 三、CameraX 初始化与回调

CameraX 初始化是异步的，需要回调函数处理：

```kotlin
val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)

cameraProviderFuture.addListener({
    val cameraProvider = cameraProviderFuture.get() // 获取 CameraProvider

    val preview = Preview.Builder().build().also {
        it.setSurfaceProvider(previewView.surfaceProvider) // 绑定到 PreviewView
    }

    val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA

    try {
        cameraProvider.unbindAll() // 清除之前的绑定
        cameraProvider.bindToLifecycle(
            activity, // 生命周期对象
            cameraSelector,
            preview
        )
    } catch (e: Exception) {
        e.printStackTrace()
    }

}, ContextCompat.getMainExecutor(ctx)) // 主线程执行回调
```

### 关键点解释

1. `ProcessCameraProvider.getInstance(ctx)`

   * 异步获取 CameraX 提供器

2. `addListener({ ... }, executor)`

   * 回调函数，CameraProvider 准备好后执行
   * `ContextCompat.getMainExecutor(ctx)` 确保在主线程操作 UI

3. `Preview.Builder()` + `setSurfaceProvider`

   * 将 Preview 输出绑定到 PreviewView
   * CameraX 自动渲染摄像头帧

4. `bindToLifecycle(activity, cameraSelector, preview)`

   * 将 CameraX Use Case 绑定到 Activity 生命周期
   * CameraX 会根据 Activity 生命周期自动开启/关闭摄像头

5. `unbindAll()`

   * 清理之前绑定，防止多次绑定导致异常



## 四、完整 CameraPreview 示例

```kotlin
@Composable
fun CameraPreview(activity: ComponentActivity) {
    val context = LocalContext.current

    AndroidView(
        factory = { ctx ->
            val previewView = PreviewView(ctx) // 创建 CameraX 官方预览控件

            // 异步获取 CameraProvider
            val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)
            cameraProviderFuture.addListener({
                val cameraProvider = cameraProviderFuture.get()

                // 创建预览对象并绑定到 PreviewView
                val preview = Preview.Builder().build().also {
                    it.setSurfaceProvider(previewView.surfaceProvider)
                }

                val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA

                try {
                    cameraProvider.unbindAll() // 解绑旧的 Use Case
                    cameraProvider.bindToLifecycle(
                        activity, 
                        cameraSelector, 
                        preview
                    )
                } catch (e: Exception) {
                    e.printStackTrace()
                }

            }, ContextCompat.getMainExecutor(ctx))

            previewView // 返回 View 给 AndroidView
        },
        modifier = Modifier.fillMaxSize() // 让预览全屏显示
    )
}
```

### 小结

* AndroidView + PreviewView 实现了 **Compose 内嵌 CameraX 预览**
* 回调函数用于异步初始化 CameraProvider
* 生命周期绑定保证 CameraX 自动管理摄像头
* Modifier.fillMaxSize 控制布局尺寸

---

## 五、我学到了什么

1. **AndroidView 是 Compose 与传统 View 的桥梁**

   * 可以嵌入任何 View，例如 PreviewView、MapView 等

2. **CameraX 的核心概念**

   * Preview：预览 Use Case
   * CameraProvider：管理摄像头生命周期
   * CameraSelector：选择前置/后置摄像头

3. **回调函数理解**

   * 异步初始化 CameraProvider
   * 绑定 Use Case → 自动渲染到 PreviewView

4. **Compose 状态与异步操作结合**

   * CameraPreview 可以直接放在权限状态判断中
   * Compose 自动根据状态刷新 UI

