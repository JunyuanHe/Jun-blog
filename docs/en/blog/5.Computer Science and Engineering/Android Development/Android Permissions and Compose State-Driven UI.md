---
title: Android Permissions and Compose State-Driven UI
createTime: 2025/12/23 14:17:20
permalink: /blog/cd7mkots_en/
tags:
  - Android
---

## 1. Background

This was my first time working with native Android app development. The app I wanted to build needed camera access, and Android 6.0 (API 23) and above requires **runtime permission requests** for sensitive permissions such as camera, microphone, or storage.

In our project, we needed the **CAMERA permission** to display the rear CameraX preview inside a Compose app.

## 2. Declaring permissions in the Manifest

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera.any" android:required="true"/>
```

- `uses-permission`: tells the system that the app needs the CAMERA permission
- `uses-feature`: declares a dependency on camera hardware
- Declaring a permission is **not** the same as having it granted

## 3. Runtime permission requests

Modern Android recommends the **Activity Result API** together with Compose state.

### 1. Register the permission launcher

```kotlin
private lateinit var cameraPermissionLauncher: ActivityResultLauncher<String>

cameraPermissionLauncher = registerForActivityResult(
    ActivityResultContracts.RequestPermission()
) { granted ->
    hasCameraPermission.value = granted
}
```

- `registerForActivityResult` registers the request and callback
- `ActivityResultContracts.RequestPermission` is the built-in contract for a single permission
- `granted: Boolean` tells you whether the user allowed it
- Updating state triggers Compose recomposition automatically

### 2. Launch the permission request

```kotlin
cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
```

## 4. Compose state-driven UI

```kotlin
val hasCameraPermission = mutableStateOf(
    ContextCompat.checkSelfPermission(
        this,
        Manifest.permission.CAMERA
    ) == PackageManager.PERMISSION_GRANTED
)
```

- `true` -> show `CameraPreview`
- `false` -> show the permission request button

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

> Compose state-driven UI responds to permission changes automatically.

## 5. `NoPermissionView` example

```kotlin
@Composable
fun NoPermissionView(onRequestPermission: () -> Unit) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Button(
            onClick = onRequestPermission,
            modifier = Modifier.width(200.dp).height(60.dp)
        ) {
            Text("请求相机权限")
        }
    }
}
```

## 6. What I learned

1. Manifest declaration and runtime authorization are different things
2. `ActivityResultLauncher + Compose state` is a clean pattern
3. State-driven UI removes the need for manual refresh logic
4. Callbacks help keep asynchronous logic separate from rendering
