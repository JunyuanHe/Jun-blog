---
title: SAM
createTime: 2025/08/08 09:32:46
permalink: /en/article/abqjh4xj/
tags:
  - ViT
---

These are my notes on the **Segment Anything Model (SAM)**.

Reference: *Kirillov et al., Segment Anything, arXiv:2304.02643*

## 1. Introduction

The **Segment Anything Model (SAM)** is an important milestone in image segmentation. It was designed as a general-purpose **foundation model** for **prompt-based image segmentation**, with strong **zero-shot generalization**. In other words, it aims to segment previously unseen objects without task-specific retraining.

SAM introduces a key idea: **promptable segmentation**. Instead of directly outputting a full segmentation map for an image, the model receives a prompt, such as a click, a box, or an initial mask, and returns the mask corresponding to that prompt.

The model is trained on the large-scale SA-1B dataset, which is the main reason it generalizes across domains and downstream tasks.

## 2. Core ideas and design principles

### 2.1 Promptable segmentation

SAM reformulates segmentation as a **conditional task**.

Supported prompt types include:

- **points**: foreground or background clicks
- **boxes**
- **masks**: optional coarse masks

This design brings several practical advantages:

- it supports **interactive segmentation**;
- it is highly **composable** and easy to integrate into larger systems;
- it enables strong **zero-shot transfer**.

### 2.2 Foundation-model perspective

SAM borrows the training philosophy behind models such as BERT and GPT:

- pretrain once on large and diverse data;
- generalize to many tasks without fine-tuning;
- keep the system modular and extensible.

In that sense, SAM is positioned as a **general segmentation engine**, not as a single-task model.

### 2.3 Decoupled design

SAM deliberately separates image processing from prompt processing:

- the **image encoder** extracts reusable image features;
- the **prompt encoder** handles the input prompt;
- the **mask decoder** fuses both sources of information and produces the output mask.

This decoupling matters because image features can be reused across many prompts, making interactive use much more efficient.

## 3. Model architecture

SAM consists of three major modules:

| Module | Role |
| --- | --- |
| Image Encoder | Produces dense image features |
| Prompt Encoder | Encodes points, boxes, masks, and other spatial prompts |
| Mask Decoder | Combines image and prompt features to generate masks |

### 3.1 Image encoder

SAM uses **ViT-Huge (ViT-H)** as the image backbone.

- input resolution: `1024 x 1024`
- output: a `64 x 64` grid of patch features

The image encoder only needs to run once per image, which is crucial for interactive scenarios.

### 3.2 Prompt encoder

The prompt encoder converts user prompts into embeddings. It supports:

- positive and negative points;
- bounding boxes;
- low-resolution mask inputs.

The main ingredients are positional encoding and learnable prompt embeddings.

### 3.3 Mask decoder

The mask decoder is a lightweight Transformer-style decoder.

Inputs:

- dense image features;
- sparse prompt tokens.

Outputs:

- **three candidate masks**;
- a quality score for each mask.

Producing multiple candidate masks is useful because user prompts can be ambiguous.

## 4. Inference flow

Given an image and a prompt:

1. the image encoder extracts image features;
2. the prompt encoder turns the prompt into prompt embeddings;
3. the mask decoder combines both and outputs candidate masks;
4. the user or downstream system picks the most suitable result.

## 5. Final remarks

My main takeaway is that SAM succeeds not only because of scale, but also because of **problem formulation**:

> Instead of asking the model to solve one fixed segmentation task, SAM asks it to respond to prompts.

That shift makes segmentation more interactive, more modular, and more reusable.
