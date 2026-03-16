# ComfyUI 图片生成 Skill

## 描述
调用本地 ComfyUI 服务生成图片，适用于需要 AI 生成图像的场景。

## 使用场景
- 用户要求"生成一张xx的图片"
- 需要为内容配图
- 创意图像生成

## 前置条件
- ComfyUI 服务必须已启动 (http://localhost:8188)
- 模型文件已下载 (v1-5-pruned-emaonly.safetensors)

## 执行流程

### Step 1: 检查服务状态
```python
from comfyui_api import check_server
if not check_server():
    return "❌ ComfyUI 服务未运行，请先启动服务"
```

### Step 2: 生成图片
```python
from comfyui_api import generate_image
result = generate_image(
    prompt=用户输入的提示词,
    width=512,
    height=512,
    steps=30
)
```

### Step 3: 等待并获取结果
- 图片生成是异步的
- 生成完成后图片保存在 ComfyUI/output/ 目录
- 返回生成参数和图片路径

### Step 4: 发送图片给用户
- 读取生成的图片文件
- 通过消息工具发送给用户
- 附上生成参数信息

## 参数说明

| 参数 | 默认值 | 说明 |
|------|--------|------|
| prompt | 必填 | 正向提示词 |
| negative_prompt | "" | 负向提示词 |
| width | 512 | 图片宽度 (推荐512) |
| height | 512 | 图片高度 (推荐512) |
| steps | 30 | 采样步数 (20-50) |

## 输出目录
生成的图片保存在: `ComfyUI/output/`

## 注意事项
- 首次生成可能需要加载模型，耗时较长
- 8GB 显存建议保持 512x512 分辨率
- 如果服务未启动，会返回错误提示
