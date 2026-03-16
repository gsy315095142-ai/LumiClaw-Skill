# 云端图片生成 Skill

## 描述
调用 Pollinations.ai 免费云端 API 生成图片，无需本地 GPU。

## 触发方式
用户发送：`生成图片 [提示词]` 或 `画一张 [描述]`

## 技术方案
- **API**: Pollinations.ai (完全免费，无需注册)
- **调用方式**: HTTP GET 请求
- **响应**: 直接返回 PNG 图片

## 执行流程

### Step 1: 解析提示词
提取用户的图片描述，支持中英文。

### Step 2: 调用云端 API
```python
url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=512&height=512"
```

### Step 3: 下载保存图片
- 保存到: `ComfyUI/output/cloud_gen_YYYYMMDD_HHMMSS.png`
- 同时返回图片数据

### Step 4: 发送给用户
- 通过飞书发送图片
- 附带生成参数信息

## 参数配置

| 参数 | 默认值 | 范围 | 说明 |
|------|--------|------|------|
| width | 512 | 256-1024 | 图片宽度 |
| height | 512 | 256-1024 | 图片高度 |
| seed | random | - | 随机种子 |
| nologo | true | - | 无水印 |

## 使用示例

**用户输入**:
```
生成图片 一只可爱的猫咪，毛茸茸的，大眼睛
```

**Agent 执行**:
```python
result = generate_image_cloud("一只可爱的猫咪，毛茸茸的，大眼睛")
```

**返回结果**:
- 图片文件
- 生成参数: 512x512, seed=xxx

## 特点
- ✅ 完全免费
- ✅ 无需 API Key
- ✅ 无需注册
- ✅ 响应快速 (5-10秒)
- ✅ 支持中英文提示词

## 限制
- 生成时间: 约 5-10 秒
- 图片尺寸: 最大 1024x1024
- 网络依赖: 需要联网

## 文件位置
- 脚本: `Project/comfyui-setup/cloud_image_api.py`
- 输出: `Project/comfyui-setup/ComfyUI/output/`
