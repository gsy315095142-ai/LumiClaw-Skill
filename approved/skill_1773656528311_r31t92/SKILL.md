# Excel文件读取与处理 Skill

## 用途
当需要读取和分析Excel文件（如设计案、数据表、配置表等）时，使用本Skill指导操作流程。

## 核心经验

### 1. 环境准备

**必须安装的依赖：**
```bash
python -m pip install pandas openpyxl
```

**安装注意事项：**
- 使用 `python -m pip` 而不是直接 `pip`（避免环境变量问题）
- 安装可能需要1-2分钟，包含numpy等依赖

### 2. 首选方案：使用Python + pandas

```python
import pandas as pd

# 读取Excel文件
xl = pd.ExcelFile('file.xlsx')

# 查看所有工作表
print(xl.sheet_names)

# 读取指定工作表（按索引）
df = pd.read_excel('file.xlsx', sheet_name=0)  # 第一个工作表

# 读取指定工作表（按名称）
df = pd.read_excel('file.xlsx', sheet_name='系统框架')

# 打印内容
print(df.to_string())
```

### 3. 常见问题与解决方案

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| `ModuleNotFoundError: No module named 'pandas'` | 未安装依赖 | 运行 `python -m pip install pandas openpyxl` |
| `UnicodeDecodeError` / 中文乱码 | 编码问题 | 使用 `chcp 65001` 设置UTF-8编码 |
| `ValueError: Worksheet named 'xxx' not found` | 工作表名称编码问题 | 使用索引 `sheet_name=1` 而不是名称 |
| 输出显示为乱码 | 终端编码不匹配 | 先执行 `chcp 65001` 再运行Python |

### 4. 标准操作流程

#### Step 1: 设置编码（Windows环境）
```cmd
chcp 65001
```

#### Step 2: 确保依赖已安装
```python
import pandas as pd
from openpyxl import load_workbook
```

#### Step 3: 读取文件
```python
# 方法A：使用pandas（推荐）
xl = pd.ExcelFile('file.xlsx')
print('工作表:', xl.sheetnames)
df = pd.read_excel('file.xlsx', sheet_name=0)

# 方法B：使用openpyxl（更底层控制）
wb = load_workbook('file.xlsx', read_only=True, data_only=True)
ws = wb[wb.sheetnames[0]]
for row in ws.iter_rows(values_only=True):
    print(row)
wb.close()
```

### 5. 最佳实践

**1. 处理编码问题**
- Windows环境先执行 `chcp 65001`
- 避免在Python字符串中使用特殊字符
- 使用英文工作表索引而非中文名称

**2. 读取大文件**
```python
# 使用read_only模式节省内存
wb = load_workbook('large_file.xlsx', read_only=True)

# 限制读取行数
df = pd.read_excel('file.xlsx', nrows=100)
```

**3. 批量处理多个文件**
```python
files = ['file1.xlsx', 'file2.xlsx', 'file3.xlsx']
for file in files:
    df = pd.read_excel(file)
    # 处理逻辑
```

**4. 提取特定内容**
```python
# 读取无表头的数据
df = pd.read_excel('file.xlsx', header=None)

# 只读取特定列
df = pd.read_excel('file.xlsx', usecols='A:C')

# 跳过前N行
df = pd.read_excel('file.xlsx', skiprows=3)
```

### 6. 替代方案

如果Python方案不可用：

**方案A：转换为CSV**
- 用Excel打开 → 另存为CSV → 用 `read` 工具读取

**方案B：转换为PDF**
- 用Excel打开 → 另存为PDF → 用 `pdf` 工具读取

**方案C：用户直接提供**
- 请用户复制关键内容粘贴到对话中

### 7. 完整示例代码

```python
import pandas as pd

# 设置文件路径
file = 'C:\\path\\to\\file.xlsx'

# 读取文件信息
xl = pd.ExcelFile(file)
print(f'工作表列表: {xl.sheetnames}')

# 读取第一个工作表
df = pd.read_excel(file, sheet_name=0, header=None)

# 遍历并打印非空内容
for idx, row in df.iterrows():
    if idx > 50:  # 限制行数
        break
    row_text = ' '.join([str(x) for x in row if pd.notna(x)])
    if row_text.strip():
        print(f'{idx+1}: {row_text[:100]}')  # 限制每行长度
```

### 8. 错误处理原则

根据 `execution-standards` 的**遇阻停顿原则**：
1. 遇到错误先**暂停**
2. **查阅本Skill**找解决方案
3. **自我尝试**所有可行方法（安装依赖、设置编码等）
4. 仍无法解决再**向用户汇报**
5. 提供**2-3个替代方案**
6. 明确给出**推荐方案**

## 版本记录
- v1.0 (2026-03-10): 初始版本，基于吴炳义设计案读取经验
