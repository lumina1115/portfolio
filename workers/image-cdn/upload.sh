#!/bin/bash
# 将本地图片上传到 R2 存储桶
# 用法: bash upload.sh
# 前提: R2 bucket "portfolio-images" 已创建，wrangler 已登录

SOURCE_DIR="/d/作品集设计报告/矫形鞋"

# 图片映射表: 源文件 -> R2 key
declare -A IMAGES=(
  ["传统医疗支具与本设计的竞品象限对比图.png"]="project-1/competitor-comparison.jpg"
  ["Arduino与FSR传感器电路原理图.png"]="project-1/circuit-schematic.jpg"
  ["电子元器件鞋底堆叠爆炸图.png"]="project-1/exploded-view.jpg"
  ["蓝粉卡扣渐变细节图.png"]="project-1/buckle-detail.jpg"
  ["原始手绘草图1.png"]="project-1/sketch-1.jpg"
  ["原始手绘草图2.png"]="project-1/sketch-2.jpg"
  ["原始手绘草图3.jpg"]="project-1/sketch-3.jpg"
)

echo "=== 上传图片到 R2 ==="

for SOURCE in "${!IMAGES[@]}"; do
  TARGET="${IMAGES[$SOURCE]}"
  SOURCE_PATH="$SOURCE_DIR/$SOURCE"

  if [ -f "$SOURCE_PATH" ]; then
    echo "上传: $SOURCE -> $TARGET"
    npx wrangler r2 object put "portfolio-images/$TARGET" --file "$SOURCE_PATH"
  else
    echo "⚠ 未找到: $SOURCE_PATH"
  fi
done

echo "=== 上传完成 ==="
echo ""
echo "图片可通过以下地址访问："
echo "  https://portfolio-image-cdn.xxx.workers.dev/project-1/competitor-comparison.jpg"
