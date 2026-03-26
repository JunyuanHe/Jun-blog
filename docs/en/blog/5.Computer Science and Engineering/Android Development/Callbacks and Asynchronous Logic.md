---
title: Callbacks and Asynchronous Logic
createTime: 2025/12/23 14:55:51
permalink: /en/blog/lz6n4fua/
tags:
  - Android
---

## 1. Background

So far, we have already completed:

1. Permission checking and dynamic permission requests
2. Real-time CameraX preview
3. Compose state-driven UI

Behind all of these features, there is one core mechanism: **callbacks + asynchronous logic**.

Understanding callbacks is essential for understanding modern Android asynchronous programming and Compose state-driven UI.

## 2. What is a callback?

A **callback** is essentially this:

> I write a function, hand it to the system or a library, and when a certain event finishes, that function gets called automatically.

### Analogy

- You place a food delivery order, leave your phone number, and the delivery person calls you when the order arrives.
- That “phone call” is the callback.

## 3. Callback examples from Phase 0

### 1. Permission request callback

```kotlin
cameraPermissionLauncher = registerForActivityResult(
    ActivityResultContracts.RequestPermission()
) { granted ->
    hasCameraPermission.value = granted
}
```

- `registerForActivityResult` registers a permission request
- The lambda `{ granted -> ... }` is the callback
- After the user chooses “allow” or “deny,” the callback fires
- Updating `hasCameraPermission.value` automatically triggers Compose recomposition

```text
Tap button -> system dialog -> user choice -> callback -> UI update
```

### 2. CameraX initialization callback

```kotlin
val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)

cameraProviderFuture.addListener({
    val cameraProvider = cameraProviderFuture.get()

    val preview = Preview.Builder().build().also {
        it.setSurfaceProvider(previewView.surfaceProvider)
    }

    val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA

    cameraProvider.unbindAll()
    cameraProvider.bindToLifecycle(activity, cameraSelector, preview)

}, ContextCompat.getMainExecutor(ctx))
```

- `addListener({ ... }, executor)`: register a callback
- After CameraProvider is ready asynchronously, the callback runs
- Inside the callback, Preview is bound and rendered
- The callback runs on the main thread with `ContextCompat.getMainExecutor(ctx)` so UI operations stay safe

```text
CameraX initialization -> async completion -> callback binds Preview -> preview appears
```

## 4. Asynchronous vs synchronous

- **Synchronous**: code runs in order, and slow operations block the main thread
- **Asynchronous**: slow work runs in the background, and the main thread gets notified later through a callback

In Phase 0:

1. The permission dialog is asynchronous
2. CameraProvider initialization is asynchronous
3. Callbacks + Compose state make the UI update automatically

> The benefit is that the UI stays responsive and avoids lag or ANR.

## 5. Compose + async + state

```kotlin
if (hasCameraPermission.value) {
    CameraPreview(activity = this)
} else {
    NoPermissionView(onRequestPermission = {
        cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
    })
}
```

- No permission -> show a button
- User taps the button -> request permission asynchronously -> callback fires
- Update `hasCameraPermission.value` -> UI automatically switches to `CameraPreview`

> Core idea: **asynchronous events + state-driven UI = reactive Compose programming**

## 6. Key takeaways

1. **Callbacks are the core of asynchronous logic**
2. **Async operations decouple UI from slow tasks**
3. **Compose state + callbacks = reactive UI**

```text
User action -> asynchronous task -> callback -> state update -> automatic UI refresh
```
