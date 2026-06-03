---
title: Outline - CV
createTime: 2025/08/08 15:50:09
permalink: /learning-notes/ysgkbdum/
draft: true
---

现代计算机视觉（Computer Vision, CV）领域发展迅速，应用广泛（如自动驾驶、人脸识别、医学影像、工业检测、AR/VR 等），要系统掌握其核心内容，可以从以下几个层次进行学习和理解：

---

## 一、基础知识（必备）

### 1. 图像基础

* 数字图像的表示（RGB, 灰度图，通道等）
* 图像坐标系与几何变换（仿射变换、投影变换）
* 常见图像处理操作（滤波、边缘检测、直方图均衡）

### 2. 传统图像处理与特征提取

* OpenCV 使用
* 特征提取：SIFT, SURF, ORB, HOG
* 特征匹配与几何估计（RANSAC, 单应性矩阵）
* 分割、边缘检测（Canny、GrabCut、分水岭）

---

## 二、深度学习与神经网络基础（计算机视觉转向深度学习后必学）

### 1. 基础模型结构

* CNN（卷积神经网络）：卷积、池化、激活函数、BatchNorm
* 网络结构设计：ResNet、DenseNet、EfficientNet 等

### 2. 常见训练技巧

* 数据增强（Data Augmentation）
* 损失函数（Cross-Entropy, Focal Loss, IoU Loss 等）
* 优化器（SGD, Adam, 学习率调度）

---

## 三、核心任务与方法

计算机视觉的核心任务可以分为几个典型方向：

### 1. 图像分类（Image Classification）

* 标准分类任务（ImageNet、CIFAR-10）
* 网络结构：AlexNet, VGG, ResNet, EfficientNet
* 迁移学习与微调（Fine-tuning）

### 2. 目标检测（Object Detection）

* Two-stage：R-CNN, Fast R-CNN, Faster R-CNN
* One-stage：YOLO 系列, SSD, RetinaNet
* Anchor-based 与 Anchor-free 方法（如 CenterNet）

### 3. 图像分割（Image Segmentation）

* 语义分割（Semantic）：FCN, U-Net, DeepLab 系列, SegFormer
* 实例分割（Instance）：Mask R-CNN, SOLO, YOLACT
* 全景分割（Panoptic Segmentation）

### 4. 关键点检测与姿态估计（Keypoint & Pose Estimation）

* 人体姿态估计（OpenPose, HRNet）
* 面部关键点检测、手势识别

### 5. 图像生成与编辑（Generative Models）

* GAN（生成对抗网络）及其变种（Pix2Pix, CycleGAN）
* Diffusion Models（Stable Diffusion, ControlNet）
* 图像修复、超分辨率、图像合成

### 6. 多模态学习与视觉语言模型

* 图文匹配（CLIP）、图像问答（BLIP, OFA）、多模态大模型（GPT-4V, LLaVA）
* 基于 Transformer 的模型架构（ViT, Swin Transformer）

### 7. 视频理解（Video Understanding）

* 视频分类（SlowFast, TimeSformer）
* 动作识别、视频目标检测与分割
* 时空特征建模（3D CNN, ConvLSTM）

---

## 四、前沿方向

### 1. Vision Transformer 系列（纯 Transformer 模型）

* ViT, Swin Transformer, DeiT, BEiT
* 优点：统一模型结构、可与 NLP 融合

### 2. 多任务模型（Foundation Models）

* Segment Anything Model（SAM）
* DINO, DINOv2（自监督视觉表征）
* CLIP, BLIP 等开放领域图像理解模型

### 3. 3D 计算机视觉

* 点云处理（PointNet, Point Transformer）
* 三维重建、SLAM、NeRF（神经辐射场）

### 4. 自监督与无监督学习

* SimCLR, MoCo, BYOL, DINO

### 5. AIGC（AI生成内容）方向

* 文生图、图生图（Stable Diffusion, Midjourney）
* 视频生成（AnimateDiff, Sora）

---

## 五、工具与实战能力

* Python + OpenCV + PyTorch（或 TensorFlow）
* 图像/视频数据预处理与标注（LabelMe, CVAT）
* 训练框架：MMDetection, Detectron2, YOLOv8
* 模型部署：ONNX, TensorRT, OpenVINO, Web 部署

---

## 六、推荐学习路径（逐层推进）

1. 学习图像处理基础 + OpenCV 编程
2. 学习深度学习基本知识 + PyTorch 框架
3. 从图像分类入门，逐步学习检测、分割、关键点等任务
4. 理解 Transformer 与 Vision Transformer
5. 探索多模态与生成模型（如 CLIP, Diffusion）
6. 做 2-3 个完整项目或比赛，提高实战经验

---

如果你告诉我你的背景（比如是 CS 还是数学出身，是否学过深度学习、想做研究还是工程等），我可以为你量身定制一套学习计划。






