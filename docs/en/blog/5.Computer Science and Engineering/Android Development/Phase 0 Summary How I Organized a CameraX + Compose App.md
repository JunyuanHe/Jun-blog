---
title: "Phase 0 Summary: How I Organized a CameraX + Compose App"
createTime: 2025/12/23 15:02:42
permalink: /blog/fv3v737c_en/
tags:
  - Android
---

(I used AI to help me organize the key points from Phase 0 so I could review them later.)

## 1. Why write a separate article about project structure?

When learning Android, especially Compose + CameraX, one common problem for me was:

> **I could write the code at the time, but I could not understand it anymore a few days later.**

The issue was usually not complexity. It was structure:

- I did not know **why a file was placed where it was**
- I did not understand **the responsibility boundary of each file**
- I mixed together logic and UI, or state and view

So after finishing Phase 0, I felt it was worth writing a dedicated project structure note.

## 2. The overall project structure of Phase 0

This is a standard Android Studio + Compose project:

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

In Phase 0, the three files that really matter are:

1. `AndroidManifest.xml`
2. `MainActivity.kt`
3. `CameraPreview`

## 3. `AndroidManifest.xml`

Its job is not to hold logic. It declares what capabilities the app needs:

- camera permission
- camera hardware dependency

```xml
<uses-permission android:name="android.permission.CAMERA" />

<uses-feature
    android:name="android.hardware.camera.any"
    android:required="true" />
```

> **Manifest ≠ permission request**

The Manifest says the app is allowed to use the camera if authorized. Runtime code is what actually asks the user.

## 4. `MainActivity.kt`

`MainActivity.kt` is the state and flow hub.

Its core responsibility is:

> **Decide what state the app is currently in, and what UI should be shown**

### Responsibility boundaries

| Responsibility | Belongs to MainActivity |
| --- | --- |
| Permission state management | ✔ |
| Permission request flow | ✔ |
| UI switching logic | ✔ |
| CameraX implementation details | ✘ |
| UI layout details | ✘ |

### Core structure

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

One sentence summary:

> **Callbacks only modify state, and the UI only reads state**

## 5. `CameraPreview`

`CameraPreview` only does three things:

1. create `PreviewView`
2. initialize `CameraProvider`
3. bind the lifecycle and show the preview

It does **not** handle permissions, buttons, or UI switching.

`AndroidView` is the bridge between Compose and traditional `View`-based widgets:

```kotlin
AndroidView(
    factory = { ctx ->
        val previewView = PreviewView(ctx)
        ...
        previewView
    }
)
```

Lifecycle binding is also a major point:

```kotlin
cameraProvider.bindToLifecycle(
    activity,
    CameraSelector.DEFAULT_BACK_CAMERA,
    preview
)
```

This means the camera opens when the activity is visible and gets released automatically when it is not.

## 6. `NoPermissionView`

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

Its value is that:

- UI stays fully decoupled from logic
- it communicates outward through a callback
- styles can change without touching core flow

## 7. The full mental model of Phase 0

```text
User action
   ↓
Asynchronous system event (permission / CameraX)
   ↓
Callback
   ↓
Update Compose state
   ↓
UI automatically recomposes
```

This same model will show up again in later stages.

## 8. Closing note

The success of Phase 0 is not just that the camera image appeared.

It is that I built the right Android + Compose + async mental model, and I now know where each piece of code belongs and why it exists.
