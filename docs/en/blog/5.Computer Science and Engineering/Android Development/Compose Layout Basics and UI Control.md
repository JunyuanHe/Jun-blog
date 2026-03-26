---
title: Compose Layout Basics and UI Control
createTime: 2025/12/23 14:46:40
permalink: /en/blog/1m2k6hme/
tags:
  - Android
---

## 1. Background

In practice, we found that when permission was not granted, the “Request Camera Permission” button would stretch across the whole screen. That clearly did not match the intended design.

To make the button stay centered with a fixed size, we need to understand Compose layout containers, alignment, and the `Modifier`.

> This note focuses on how to control layout and UI element size in Compose.

## 2. The `Surface` container

```kotlin
Surface(
    modifier = Modifier.fillMaxSize(),
    color = MaterialTheme.colorScheme.background
)
```

- `Surface` is a Material3 container for UI elements
- `modifier.fillMaxSize()` makes it fill the whole parent
- `color` sets the background color

> `Surface` is the root container of the Compose UI.

## 3. The `Box` container and alignment

```kotlin
Box(
    modifier = Modifier.fillMaxSize(),
    contentAlignment = Alignment.Center
)
```

- `Box` is one of the most flexible containers in Compose
- it can hold one or multiple children
- it supports overlapping layouts
- `contentAlignment = Alignment.Center` centers the content

> `Box + contentAlignment` makes centered layout very easy.

## 4. Button layout and `Modifier`

```kotlin
Button(
    onClick = onRequestPermission,
    modifier = Modifier
        .width(200.dp)
        .height(60.dp)
)
{
    Text("请求相机权限")
}
```

### Key points

1. `onClick` is the button click callback
2. `Modifier.width / height` gives the button a fixed size
3. `Modifier` can be chained, such as `.width().height().padding()`

## 5. Full `NoPermissionView` example

```kotlin
@Composable
fun NoPermissionView(onRequestPermission: () -> Unit) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Button(
            onClick = onRequestPermission,
            modifier = Modifier
                .width(200.dp)
                .height(60.dp)
        ) {
            Text("请求相机权限")
        }
    }
}
```

### Summary

- `Box`: centers the parent container
- `Button`: fixed size
- `Text`: button label

Now the button no longer fills the whole screen. It stays centered at a fixed size.

## 6. Key takeaways

1. `Surface` is the root container
2. `Box + contentAlignment = Alignment.Center`
3. `Modifier` controls size and position flexibly
4. In Compose, the parent controls layout, while children refine it through `Modifier`
