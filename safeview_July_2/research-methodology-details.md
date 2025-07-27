# NSFW Content Detection: Research Methodology & Supporting Evidence

## Executive Summary

This research proposal builds upon our previous semester's work with **Inception V2** for NSFW content classification, extending into cutting-edge approaches using **Vision Transformers (ViT)** and **Object Detection (YOLO)**. Our literature review of 10+ recent papers demonstrates compelling evidence for exploring these advanced architectures.

## Key Research Questions

1. **Can Vision Transformers outperform traditional CNNs for NSFW detection?**
   - **Evidence**: ViT-DualAtt achieved **97.2% accuracy** vs **94.5%** for best CNN (RepVGG-SimAM)
   - **Mechanism**: Self-attention captures global context better than CNN receptive fields

2. **How can Object Detection improve upon classification-only approaches?**
   - **Evidence**: YOLO-based systems provide **localization + classification** in single pass
   - **Benefit**: Can identify and mask specific inappropriate regions, not just classify entire image

3. **What is the optimal transfer learning strategy across architectures?**
   - **Evidence**: Transfer learning reduces training time by **60-80%** with **4.3% performance gain**
   - **Innovation**: Compare transfer learning effectiveness across CNN, ViT, and YOLO

## Methodology Framework

### Phase 1: CNN Baseline Extension (Building on Previous Work)
- **Previous**: Inception V2 with standard transfer learning
- **Extension**: Compare with InceptionV3, ResNet, MobileNetV2, DenseNet
- **Expected Outcome**: Establish robust CNN baseline (target: ~95% accuracy)

### Phase 2: Vision Transformer Implementation
- **Primary Model**: ViT-base-patch16-224 (proven by Falconsai: 98.04% accuracy)
- **Advanced Model**: ViT-DualAtt architecture (CNN-Transformer hybrid)
- **Innovation**: Multi-head attention visualization for interpretability

### Phase 3: Object Detection Integration
- **Architecture**: YOLOv5/YOLOv8 for real-time detection
- **Classes**: 5 sensitive object categories (as per EraX-NSFW-V1.0)
- **Pipeline**: YOLO detection → CNN/ViT classification

### Phase 4: Hybrid Architecture Development
- **Novel Approach**: CNN feature extraction + ViT global attention
- **Inspiration**: ViT-DualAtt's hierarchical structure
- **Target**: Combine local and global feature strengths

## Technical Advantages

### Why Vision Transformers?
1. **Global Context Understanding**: Self-attention mechanism processes entire image simultaneously
2. **Transfer Learning Excellence**: Pre-trained on ImageNet-21K (14M images)
3. **Attention Interpretability**: Can visualize which image regions influence decisions
4. **Scalability**: Performance improves with dataset size (unlike CNNs that plateau)

### Why Object Detection?
1. **Localization Capability**: Identifies WHERE inappropriate content appears
2. **Real-time Processing**: YOLO processes images in single forward pass
3. **Multi-instance Detection**: Can detect multiple sensitive objects per image
4. **Practical Deployment**: Enables selective blurring/masking instead of blocking entire content

### Why Transfer Learning Focus?
1. **Computational Efficiency**: Reduces training time from weeks to hours
2. **Data Efficiency**: Works well with limited NSFW datasets
3. **Domain Adaptation**: Leverages general visual knowledge for specific task
4. **Comparative Analysis**: Fair comparison across architectures with same pre-training

## Dataset Strategy

### Primary Datasets
- **LSPD Dataset**: Standard benchmark for pornography image detection
- **Pornography 2k**: Binary classification dataset
- **Custom Dataset**: Self-collected diverse NSFW/Safe images

### Evaluation Metrics
- **Classification**: Accuracy, Precision, Recall, F1-Score, ROC-AUC
- **Detection**: mAP@0.5, mAP@0.5:0.95, Precision, Recall
- **Efficiency**: Inference time, Memory usage, FLOPs
- **Robustness**: Cross-dataset evaluation, Adversarial testing

