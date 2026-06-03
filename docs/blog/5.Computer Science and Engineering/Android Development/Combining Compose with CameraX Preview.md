---
title: Combining Compose with CameraX Preview
createTime: 2025/12/23 14:43:46
permalink: /blog/pxexkzn5/
tags:
  - Android
---

## 1. Background

After permission is granted, the next step is to show a **live rear camera preview**.

CameraX officially recommends using **PreviewView** as the preview widget, but Jetpack Compose does not yet provide a native camera container.

So we need to embed a traditional Android `View` inside Compose using **AndroidView**.

> This note focuses on integrating CameraX preview with Compose UI.

## 2. `PreviewView` and `AndroidView`

### 1. `PreviewView`

- CameraX’s official preview widget
- renders camera frame data
- must be bound to a CameraX `Preview` use case

### 2. `AndroidView`

```kotlin
AndroidView(
    factory = { context -> 
        // return a traditional Android View
    },
    modifier = Modifier.fillMaxSize()
)
```

`AndroidView` allows Compose to host any traditional Android view, including `PreviewView`.

## 3. CameraX initialization and callback

```kotlin
val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)

cameraProviderFuture.addListener({
    val cameraProvider = cameraProviderFuture.get()

    val preview = Preview.Builder().build().also {
        it.setSurfaceProvider(previewView.surfaceProvider)
    }

    val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA

    try {
        cameraProvider.unbindAll()
        cameraProvider.bindToLifecycle(
            activity,
            cameraSelector,
            preview
        )
    } catch (e: Exception) {
        e.printStackTrace()
    }

}, ContextCompat.getMainExecutor(ctx))
```

### Key points

1. `ProcessCameraProvider.getInstance(ctx)` gets a CameraX provider asynchronously
2. `addListener({ ... }, executor)` runs a callback when it is ready
3. `setSurfaceProvider` binds preview output to `PreviewView`
4. `bindToLifecycle` ties the use case to the activity lifecycle
5. `unbindAll()` clears old bindings

## 4. Full `CameraPreview` example

```kotlin
@Composable
fun CameraPreview(activity: ComponentActivity) {
    val context = LocalContext.current

    AndroidView(
        factory = { ctx ->
            val previewView = PreviewView(ctx)

            val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)
            cameraProviderFuture.addListener({
                val cameraProvider = cameraProviderFuture.get()

                val preview = Preview.Builder().build().also {
                    it.setSurfaceProvider(previewView.surfaceProvider)
                }

                val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA

                try {
                    cameraProvider.unbindAll()
                    cameraProvider.bindToLifecycle(
                        activity,
                        cameraSelector,
                        preview
                    )
                } catch (e: Exception) {
                    e.printStackTrace()
                }

            }, ContextCompat.getMainExecutor(ctx))

            previewView
        },
        modifier = Modifier.fillMaxSize()
    )
}
```

### Summary

- `AndroidView + PreviewView` embeds CameraX preview into Compose
- callbacks handle asynchronous initialization
- lifecycle binding lets CameraX manage the camera automatically

## 5. What I learned

1. `AndroidView` is the bridge between Compose and traditional Views
2. `Preview`, `CameraProvider`, and `CameraSelector` are the core CameraX concepts
3. Callbacks are how async CameraX initialization fits into Compose
