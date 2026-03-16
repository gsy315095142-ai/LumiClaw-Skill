---
name: file-delete
description: 安全删除指定文件。当需要删除工作区中的文件（如清理临时文件、删除重复文件、移除过期文档等）时使用此 Skill。支持验证删除结果，确保操作成功。
---

# 文件删除 Skill

用于安全删除指定文件，并验证删除结果。

## 适用场景

- 删除临时生成的文件
- 清理重复的文档
- 移除不再需要的文件
- 删除已备份的过期文件

## 使用方法

### 方法 1：使用 Python 脚本（推荐）

**步骤 1：创建删除脚本**
```python
import os

file_path = r'要删除的文件路径'

if os.path.exists(file_path):
    try:
        os.remove(file_path)
        if not os.path.exists(file_path):
            print(f"✅ 已删除: {file_path}")
        else:
            print(f"❌ 删除失败: {file_path}")
    except Exception as e:
        print(f"❌ 错误: {e}")
else:
    print(f"⚠️ 文件不存在: {file_path}")
```

**步骤 2：执行脚本**
- 使用 `write` 工具保存脚本到 `temp/delete_script.py`
- 请用户手动运行：`python temp/delete_script.py`
- 或使用 subagent 执行（有延迟但可靠）

### 方法 2：使用 subagent（自动化）

适用于不需要即时反馈的场景：

```
sessions_spawn:
- task: "删除文件: C:\\path\\to\\file.txt"
- model: zai/glm-5
```

**优点**：
- 完全自动化
- 可验证删除结果
- 有执行报告

**缺点**：
- 有约 30 秒启动延迟

### 方法 3：使用内置脚本

使用本 Skill 提供的脚本：

```bash
python C:\Users\31509\clawd\skills\file-delete\scripts\delete_file.py "文件路径"
```

## 最佳实践

### 删除前确认清单

删除文件前，必须确认：
- [ ] 文件路径正确
- [ ] 文件可以被删除（不是系统关键文件）
- [ ] 如有需要，已创建备份
- [ ] 用户明确授权删除

### 删除后验证

删除操作完成后，必须验证：
```python
import os
if not os.path.exists(file_path):
    print("✅ 删除成功")
else:
    print("❌ 删除失败，文件仍然存在")
```

## 注意事项

### ❌ 禁止删除的文件

- 系统文件（Windows 系统目录下的文件）
- 正在使用的文件（被其他程序打开）
- 没有备份的重要文件

### ⚠️ 谨慎删除的文件

- 配置文件（.json, .yaml, .conf）
- 数据库文件（.db, .sqlite）
- 大型项目文件（>100MB）

## 关联 Skill

- `list-local-files` - 列出目录文件，帮助确认要删除的文件
- `execution-standards/SKILL.md` - 任务执行通用规范

---
*创建时间: 2026-02-18*
*最后更新: 2026-02-18*
