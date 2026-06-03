---
title: Android权限管理与Compose状态驱动
createTime: 2025/12/23 14:17:20
permalink: /zh/blog/cd7mkots/
tags: 
    - Android
---


## 一、背景

这是我初次接触原生安卓应用开发。我想要开发的应用需要使用摄像头，像摄像头、麦克风、存储等敏感权限，Android 6.0（API 23）及以上必须在**运行时动态请求权限**。

在我们的项目中，需要获取 **CAMERA 权限**，才能在 Compose 应用中显示 CameraX 后置摄像头预览。



## 二、Manifest 权限声明

在 `AndroidManifest.xml` 中声明摄像头权限：

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera.any" android:required="true"/>
```

* `uses-permission`：告诉系统 App 需要 CAMERA 权限
* `uses-feature`：声明应用需要摄像头硬件，`required="true"` 表示没有摄像头无法安装
* 注意：声明权限**不等于授权**，必须在运行时请求（一开始我只声明了，但未请求权限，导致用户必须手动在设置中开放权限才能正常运行）



## 三、运行时权限申请

现代 Android 推荐使用 **Activity Result API**，配合 Compose 状态管理。

### 1. 注册权限 Launcher

```kotlin
// 声明权限启动器
private lateinit var cameraPermissionLauncher: ActivityResultLauncher<String>

// 在 onCreate 中注册
cameraPermissionLauncher = registerForActivityResult(
    ActivityResultContracts.RequestPermission()
) { granted -> // 回调函数
    hasCameraPermission.value = granted // 更新 Compose 状态
}
```

* `registerForActivityResult`：注册权限请求和回调，只注册一次
* `ActivityResultContracts.RequestPermission`：系统提供的单个权限请求契约
* 回调参数 `granted: Boolean` 表示用户是否允许
* 更新状态 `hasCameraPermission.value` 会触发 Compose UI 自动重组

### 2. 发起权限请求

```kotlin
cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
```

* 调用 `launch()` 弹出系统权限请求弹窗
* 用户选择允许或拒绝 → 回调被触发 → 更新状态



## 四、Compose 状态驱动 UI

在 Compose 中，我们用状态控制 UI 展示不同内容：

```kotlin
val hasCameraPermission = mutableStateOf(
    ContextCompat.checkSelfPermission(
        this,
        Manifest.permission.CAMERA
    ) == PackageManager.PERMISSION_GRANTED
)
```

* `mutableStateOf` 创建一个可观察状态
* `hasCameraPermission.value` 为 `true` → 显示 CameraPreview
* 为 `false` → 显示请求权限按钮

示例 UI：

```kotlin
Surface(
    modifier = Modifier.fillMaxSize(),
    color = MaterialTheme.colorScheme.background
) {
    if (hasCameraPermission.value) {
        CameraPreview(activity = this)
    } else {
        NoPermissionView(
            onRequestPermission = {
                cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
            }
        )
    }
}
```

> 小结：Compose 的状态驱动 UI 可以自动响应权限变化，无需手动刷新界面。


## 五、NoPermissionView 示例

```kotlin
@Composable
fun NoPermissionView(onRequestPermission: () -> Unit) {
    Box(
        modifier = Modifier.fillMaxSize(),        // 父容器占满屏幕
        contentAlignment = Alignment.Center       // 内容居中
    ) {
        Button(
            onClick = onRequestPermission,       // 点击按钮发起权限请求
            modifier = Modifier.width(200.dp).height(60.dp) // 固定按钮大小
        ) {
            Text("请求相机权限")
        }
    }
}
```

* `Box`：容器布局，可以控制子元素对齐
* `contentAlignment = Alignment.Center`：让按钮居中显示
* `Button` + `onClick`：触发权限请求 Launcher



## 六、我学到了什么？

1. **权限声明 vs 运行时授权**

   * Manifest 声明只是告知系统
   * 运行时必须主动请求，否则无法使用摄像头

2. **ActivityResultLauncher + Compose 状态**

   * 注册一次 Launcher
   * 点击按钮调用 `.launch()`
   * 回调更新 Compose 状态 → UI 自动刷新

3. **状态驱动 UI 的优势**

   * Compose 依赖状态驱动，不需要手动 findViewById
   * 异步事件（用户选择权限）自动触发界面重组

4. **回调函数理解**

   * 用户操作完成后回调触发
   * 允许异步逻辑与 UI 解耦



