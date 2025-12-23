---
title: Compose布局基础与UI控制
createTime: 2025/12/23 14:46:40
permalink: /blog/1m2k6hme/
---



## 一、背景

在实践中，我们发现当权限未授予时，“请求相机权限”按钮会**铺满整个屏幕**，这显然不符合设计需求。那么代码的问题出在哪里呢？

为了实现**居中显示、固定大小的按钮**，我们需要理解 Compose 的**布局容器、对齐方式和修饰符 Modifier**。

> 本篇主要讲如何用 Compose 控制布局和 UI 元素大小。


## 二、Surface 容器

```kotlin
Surface(
    modifier = Modifier.fillMaxSize(),
    color = MaterialTheme.colorScheme.background
)
```

* **作用**：Material3 容器，用于承载 UI 元素
* **modifier.fillMaxSize()**：让 Surface 占满父容器（整个屏幕）
* **color**：设置背景颜色，通常使用 Material3 主题色

> 小结：Surface 是 Compose UI 的根容器，负责背景和大小。



## 三、Box 容器与对齐

```kotlin
Box(
    modifier = Modifier.fillMaxSize(),        // 父容器占满屏幕
    contentAlignment = Alignment.Center       // 子元素居中
)
```

* **Box**：Compose 中最灵活的容器之一

  * 可以放置一个或多个子元素
  * 支持重叠布局
* **contentAlignment = Alignment.Center**

  * 控制 Box 内所有子元素的对齐方式
  * 常用于居中显示按钮、文本等

> 小结：使用 Box + contentAlignment 可以轻松实现居中布局。



## 四、按钮布局与 Modifier

```kotlin
Button(
    onClick = onRequestPermission,
    modifier = Modifier
        .width(200.dp)   // 固定宽度
        .height(60.dp)   // 固定高度
)
{
    Text("请求相机权限")
}
```

### 关键点

1. **onClick**

   * 按钮点击事件回调
   * 在 Phase 0 中用于触发权限请求

2. **Modifier.width / height**

   * 控制按钮固定尺寸
   * 避免按钮默认铺满父容器

3. **组合 Modifier**

   * Modifier 可以链式组合，例如 `.width().height().padding()`
   * 顺序无关紧要，但要保证逻辑清晰



## 五、完整 NoPermissionView 示例

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

### 分析

* **Box**：居中父容器
* **Button**：固定大小
* **Text**：按钮显示文字

> 现在按钮不会铺满屏幕，而是固定大小居中显示，用户体验更好。



## 六、学习重点

1. **Surface 是根容器**

   * 用于背景、占满屏幕
2. **Box + contentAlignment = Alignment.Center**

   * 容器内居中布局
3. **Modifier 灵活组合**

   * width / height / fillMaxSize / padding
   * 控制子控件尺寸和位置
4. **Compose 布局思路**

   * 父容器决定子控件布局
   * 子控件通过 Modifier 精细控制尺寸和位置
5. **实际效果**

   * 权限未授予 → 居中按钮
   * 权限已授予 → CameraPreview 占满屏幕

