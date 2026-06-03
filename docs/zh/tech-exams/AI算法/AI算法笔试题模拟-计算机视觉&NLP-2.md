---
title: AI算法笔试题模拟-计算机视觉&NLP-2
createTime: 2025/09/15 17:03:40
permalink: /zh/tech-exams/fg8qhvp6/
---



# 📘 模块四：计算机视觉 & NLP 扩展题（50题）

### **计算机视觉 - 图像分类 & 特征提取（1–10）**

**Q1.** 在图像分类任务中，常用的损失函数是：
- A. MSE
- B. 交叉熵损失
- C. Hinge 损失
- D. KL 散度

✅ 答案：B

**Q2.** AlexNet 引入了哪项关键技术推动深度学习发展？
- A. 注意力机制
- B. Dropout + ReLU + GPU 训练
- C. 残差连接
- D. Transformer

✅ 答案：B

**Q3.** VGG 的主要特点是：
- A. 使用大卷积核
- B. 使用多层小卷积核堆叠
- C. 使用循环结构
- D. 使用 Transformer

✅ 答案：B

**Q4.** Batch Normalization 在图像分类网络中的主要作用是：
- A. 提高泛化
- B. 加快收敛并稳定训练
- C. 替代卷积层
- D. 减少参数

✅ 答案：B

**Q5.** ImageNet 比赛中的重大突破主要依赖于：
- A. 小模型
- B. 大规模标注数据集 + GPU 训练 + 深层网络
- C. 决策树
- D. 强化学习

✅ 答案：B

**Q6.** Swin Transformer 在图像分类中的特点是：
- A. 全局注意力
- B. 层次化局部注意力（shifted window）
- C. 卷积结构
- D. 循环网络

✅ 答案：B

**Q7.** 在图像分类中，数据增强的主要作用是：
- A. 提高推理速度
- B. 增强泛化能力
- C. 增加网络层数
- D. 替代卷积

✅ 答案：B

**Q8.** 图像分类中常用的正则化方法包括：
- A. Dropout、数据增强、Label Smoothing
- B. SGD
- C. 卷积
- D. 池化

✅ 答案：A

**Q9.** EfficientNet 的核心思想是：
- A. 使用 RNN
- B. 复合缩放（depth, width, resolution）
- C. 全连接层加深
- D. 对比学习

✅ 答案：B

**Q10.** Vision Transformer (ViT) 处理图像的方式是：
- A. CNN 卷积
- B. 将图像切分为 patch 并输入 Transformer
- C. 逐像素输入
- D. RNN 序列输入

✅ 答案：B

---

### **目标检测（11–20）**

**Q11.** Faster R-CNN 的核心创新是：
- A. 使用 RNN 提取特征
- B. 引入 Region Proposal Network (RPN)
- C. 使用 GAN
- D. 使用全连接层代替卷积

✅ 答案：B

**Q12.** YOLO 的主要优势是：
- A. 检测速度快（单阶段检测）
- B. 精度比两阶段更高
- C. 参数更少
- D. 使用 RNN

✅ 答案：A

**Q13.** SSD 检测器的特点是：
- A. 单阶段检测 + 多尺度特征图预测
- B. 使用注意力机制
- C. 使用全连接层检测
- D. 使用 RNN

✅ 答案：A

**Q14.** Anchor 的作用是：
- A. 提高计算效率
- B. 提供预定义的候选框
- C. 替代分类器
- D. 减少训练时间

✅ 答案：B

**Q15.** NMS (非极大值抑制) 的主要作用是：
- A. 提高召回率
- B. 去除冗余检测框
- C. 增加训练速度
- D. 减少梯度消失

✅ 答案：B

**Q16.** YOLOv5 相比 YOLOv3 的改进包括：
- A. Transformer backbone
- B. 更高效的数据增强与更轻量结构
- C. 使用 GAN
- D. 使用 CNN-RNN 混合

✅ 答案：B

**Q17.** DETR 的关键创新是：
- A. 使用 CNN
- B. 使用 Transformer 直接进行端到端检测
- C. 使用 GAN
- D. 使用强化学习

✅ 答案：B

**Q18.** 在目标检测中，mAP 衡量的是：
- A. 平均检测时间
- B. 平均精度均值
- C. 平均 IOU
- D. 平均梯度

✅ 答案：B

**Q19.** RetinaNet 提出的 Focal Loss 主要解决：
- A. 类别不平衡问题
- B. 过拟合问题
- C. 梯度消失问题
- D. 参数过多问题

✅ 答案：A

**Q20.** Anchor-free 检测方法（如 CenterNet）的主要思想是：
- A. 放弃候选框，直接预测目标中心点和大小
- B. 增加更多 Anchor
- C. 使用 GAN
- D. 使用多尺度特征

✅ 答案：A

---

### **语义分割 & 图像生成（21–30）**

**Q21.** FCN (全卷积网络) 的核心是：
- A. 使用全连接层
- B. 将全连接替换为卷积以进行像素级预测
- C. 使用 Transformer
- D. 使用循环网络

✅ 答案：B

**Q22.** U-Net 结构广泛用于医学图像分割的原因是：
- A. 使用 GAN
- B. 编码器-解码器结构 + 跳跃连接
- C. 仅使用卷积
- D. 仅使用 RNN

✅ 答案：B

**Q23.** Mask R-CNN 相比 Faster R-CNN 的改进是：
- A. 增加一个分割分支
- B. 使用注意力机制
- C. 使用 GAN
- D. 使用强化学习

✅ 答案：A

**Q24.** 语义分割和实例分割的区别是：
- A. 实例分割区分不同目标个体
- B. 语义分割区分不同类别，不区分个体
- C. 二者无区别
- D. 都依赖 RNN

✅ 答案：A + B

**Q25.** StyleGAN 的核心优势是：
- A. 高分辨率、逼真图像生成
- B. 实例分割
- C. 检测速度快
- D. 对比学习

✅ 答案：A

**Q26.** CycleGAN 的主要应用是：
- A. 图像到图像的风格迁移
- B. 语义分割
- C. 目标检测
- D. NLP 文本生成

✅ 答案：A

**Q27.** Diffusion 模型在图像生成中的核心思想是：
- A. 逐步向噪声加扰动并学习反向过程
- B. 使用 GAN 判别器
- C. 使用 Transformer
- D. 使用 RNN

✅ 答案：A

**Q28.** 图像分割评估指标 IoU 的定义是：
- A. 交并比 (Intersection over Union)
- B. 精度
- C. 召回率
- D. F1 分数

✅ 答案：A

**Q29.** 超分辨率模型 SRGAN 的主要目标是：
- A. 提高图像分辨率
- B. 实例分割
- C. 文本分类
- D. 增加训练速度

✅ 答案：A

**Q30.** 图像描述（Image Captioning）通常使用的模型结构是：
- A. CNN + RNN/Transformer
- B. RNN + GAN
- C. 仅 CNN
- D. 仅 Transformer

✅ 答案：A

---

### **NLP - 词向量 & 基础模型（31–40）**

**Q31.** Word2Vec 的 Skip-gram 模型的目标是：
- A. 预测当前词
- B. 根据当前词预测上下文词
- C. 根据上下文预测当前词
- D. 预测句子长度

✅ 答案：B

**Q32.** GloVe 的主要思想是：
- A. 基于共现矩阵和矩阵分解得到词向量
- B. 使用 Transformer
- C. 使用 RNN
- D. 使用对比学习

✅ 答案：A

**Q33.** One-hot 编码的主要缺点是：
- A. 过拟合
- B. 高维稀疏，无法表达词义相似性
- C. 低维密集
- D. 训练过快

✅ 答案：B

**Q34.** 在 NLP 中，OOV（Out of Vocabulary）问题的常见解决方法是：
- A. 使用子词分词（BPE、SentencePiece）
- B. 使用全连接层
- C. 使用 CNN
- D. 使用 GAN

✅ 答案：A

**Q35.** RNN 处理文本的主要缺点是：
- A. 无法建模上下文
- B. 长序列训练难，梯度消失/爆炸
- C. 参数过少
- D. 计算太快

✅ 答案：B

**Q36.** Seq2Seq 模型通常用于：
- A. 机器翻译
- B. 图像分类
- C. 目标检测
- D. 分割

✅ 答案：A

**Q37.** Attention 机制在 NLP 中的优势是：
- A. 捕捉长程依赖关系
- B. 减少梯度消失
- C. 提高并行能力
- D. 以上全部

✅ 答案：D

**Q38.** Transformer 相比 RNN 的主要优势是：
- A. 并行训练效率高
- B. 更强的长程依赖建模能力
- C. 训练更稳定
- D. 以上全部

✅ 答案：D

**Q39.** BERT 的输入使用了哪种分词方式？
- A. Word-level
- B. Subword-level (WordPiece)
- C. Sentence-level
- D. Character-level

✅ 答案：B

**Q40.** GPT 模型在训练时的目标函数是：
- A. 预测下一个词（自回归语言模型）
- B. Masked Language Model
- C. Seq2Seq
- D. 对比学习

✅ 答案：A

---

### **NLP - 预训练 &应用（41–50）**

**Q41.** BERT 的训练任务之一 NSP (Next Sentence Prediction) 的作用是：
- A. 预测句子长度
- B. 学习句间关系
- C. 预测下一个词
- D. 学习图像特征

✅ 答案：B

**Q42.** RoBERTa 相比 BERT 的改进包括：
- A. 移除 NSP，使用更大数据和更长训练
- B. 使用 CNN
- C. 使用 RNN
- D. 使用 GAN

✅ 答案：A

**Q43.** T5 (Text-to-Text Transfer Transformer) 的核心思想是：
- A. 将所有 NLP 任务统一为文本到文本
- B. 使用 GAN
- C. 使用卷积
- D. 使用对比学习

✅ 答案：A

**Q44.** XLNet 的改进是：
- A. 使用自回归 + 自编码结合的训练方式
- B. 使用 CNN
- C. 使用强化学习
- D. 使用稀疏注意力

✅ 答案：A

**Q45.** ALBERT 相比 BERT 的主要改进是：
- A. 参数共享，降低模型规模
- B. 使用 RNN
- C. 使用 GAN
- D. 使用 CNN

✅ 答案：A

**Q46.** ChatGPT 属于：
- A. Encoder-only 模型
- B. Decoder-only 模型（GPT 系列）
- C. Encoder-Decoder 模型
- D. CNN 模型

✅ 答案：B

**Q47.** NLP 中文本分类任务常用的损失函数是：
- A. MSE
- B. 交叉熵损失
- C. KL 散度
- D. Hinge 损失

✅ 答案：B

**Q48.** BLEU 常用于评价：
- A. 图像分割
- B. 机器翻译质量
- C. 文本分类准确率
- D. 文本相似度
✅ 答案：B

**Q49.** ROUGE 常用于评价：
- A. 文本摘要质量
- B. 图像分类
- C. 文本情感分析
- D. 图像检测

✅ 答案：A

**Q50.** 在问答系统中，Retriever-Reader 结构的作用是：
- A. Retriever 负责检索文档，Reader 负责答案抽取
- B. Retriever 负责翻译，Reader 负责生成
- C. Retriever 负责分词，Reader 负责编码
- D. Retriever 负责优化，Reader 负责训练

✅ 答案：A

