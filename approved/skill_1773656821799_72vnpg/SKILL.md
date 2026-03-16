# 前端开发常见问题与解决方案

**Skill 用途**：记录 Web 前端开发中遇到的常见问题及解决方案

**创建时间**：2026-02-24

---

## ❌ 失败教训（2026-02-24）file:// 协议下的 AJAX 请求限制

### 问题描述

创建一个静态网页项目，使用 `fetch()` 加载同目录下的 JSON 配置文件：

```html
<!-- index.html -->
<script>
fetch('config.json')
  .then(response => response.json())
  .then(data => console.log(data));
</script>
```

**直接双击打开 HTML 文件时，报错：**
```
Failed to fetch
无法加载 config.json 文件
```

### 根本原因

当直接打开 HTML 文件时，浏览器使用 `file://` 协议：
```
file:///C:/Users/xxx/project/index.html
```

出于**安全限制（CORS 策略）**，浏览器禁止 `file://` 协议下的页面通过 AJAX/Fetch 加载本地文件，即使是同目录下的文件也不行。

这是浏览器的安全特性，防止本地网页随意读取用户文件系统中的其他文件。

### 错误信息示例

- Chrome: `Failed to fetch`
- Firefox: `NetworkError when attempting to fetch resource`
- Edge: `Could not complete the operation due to error 8070000c`

---

## ✅ 解决方案

### 方案 1：嵌入数据（推荐用于纯静态展示）⭐

将 JSON 数据直接嵌入到 HTML 的 `<script>` 标签中：

```html
<!DOCTYPE html>
<html>
<head>
    <script>
        // 直接嵌入配置数据
        const CONFIG = {
            "title": "项目名称",
            "version": "1.0",
            "data": [ /* ... */ ]
        };
    </script>
</head>
<body>
    <script>
        // 直接使用，无需 fetch
        console.log(CONFIG.title);
        renderPage(CONFIG);
    </script>
</body>
</html>
```

**优点**：
- ✅ 双击即用，无需服务器
- ✅ 加载速度最快
- ✅ 无跨域问题

**缺点**：
- ❌ 数据无法热更新（需要修改 HTML）
- ❌ 不适合频繁修改的数据

**适用场景**：
- 剧情展示、静态文档
- 演示 Demo
- 配置不常变动的项目

### 方案 2：使用本地 HTTP 服务器（推荐用于开发）

启动本地服务器，通过 `http://localhost` 访问：

```bash
# Python 3
python -m http.server 8080

# Node.js
npx serve

# PHP
php -S localhost:8080

# VS Code Live Server 插件
```

然后访问：`http://localhost:8080`

**优点**：
- ✅ 支持 fetch/AJAX
- ✅ 支持热更新
- ✅ 模拟真实环境

**缺点**：
- ❌ 需要安装运行环境
- ❌ 多一个启动步骤

**适用场景**：
- 开发调试
- 需要动态加载数据
- 完整的 Web 应用

### 方案 3：使用 FileReader API（读取用户选择的文件）

如果需要读取本地文件，使用 `<input type="file">`：

```html
<input type="file" id="fileInput" accept=".json">
<script>
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const data = JSON.parse(event.target.result);
        console.log(data);
    };
    reader.readAsText(file);
});
</script>
```

**优点**：
- ✅ 可以读取用户指定的本地文件
- ✅ 无需服务器

**缺点**：
- ❌ 需要用户手动选择文件
- ❌ 用户体验不佳

**适用场景**：
- 本地文件处理工具
- 数据导入功能

### 方案 4：使用 Chrome 启动参数（仅开发调试）

启动 Chrome 时添加 `--allow-file-access-from-files` 参数：

```bash
# Windows
"C:\Program Files\Google\Chrome\Application\chrome.exe" --allow-file-access-from-files

# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --allow-file-access-from-files
```

⚠️ **警告**：这会降低浏览器安全性，仅用于开发调试！

---

## 📊 方案对比

| 方案 | 双击即用 | 支持 fetch | 数据热更新 | 安全性 | 适用场景 |
|------|----------|------------|------------|--------|----------|
| 嵌入数据 | ✅ | N/A | ❌ | ✅ | 静态展示 |
| HTTP 服务器 | ❌ | ✅ | ✅ | ✅ | 开发/完整应用 |
| FileReader | ✅ | N/A | 手动 | ✅ | 文件处理工具 |
| Chrome 参数 | ✅ | ✅ | ✅ | ⚠️ 降低 | 临时调试 |

---

## 🎯 最佳实践

### 项目初期（快速原型）
1. 使用**嵌入数据**方案
2. 双击即用，快速验证

### 项目中期（功能完善）
1. 切换到**HTTP 服务器**方案
2. 分离数据和逻辑

### 项目发布（部署上线）
1. 部署到真实服务器
2. 使用 CDN 加速静态资源

---

## 📝 相关概念

### CORS（跨域资源共享）
浏览器安全机制，限制从一个源加载的文档或脚本如何与另一个源的资源进行交互。

### file:// 协议的限制
- 禁止 XMLHttpRequest/fetch 加载本地文件
- 禁止读取本地目录结构
- 禁止访问其他本地文件

### 同源策略（Same-Origin Policy）
浏览器的安全基石，限制不同源之间的交互。
- 协议不同：`http` vs `https`
- 域名不同：`a.com` vs `b.com`
- 端口不同：`localhost:8080` vs `localhost:3000`
- **协议不同：`file://` vs `http://`**

---

## 🔧 调试技巧

### 1. 查看当前协议
```javascript
console.log(window.location.protocol);
// "file:" 或 "http:" 或 "https:"
```

### 2. 检查是否支持 fetch
```javascript
if (window.location.protocol === 'file:') {
    console.warn('Running from file:// protocol. fetch() will not work.');
    // 切换到备用方案
}
```

### 3. 开发环境检测
```javascript
const isLocalFile = window.location.protocol === 'file:';
const isLocalhost = window.location.hostname === 'localhost';

if (isLocalFile) {
    // 使用嵌入数据或提示用户启动服务器
    loadEmbeddedData();
} else {
    // 正常 fetch
    fetch('config.json').then(...);
}
```

---

## 💡 实际案例

### 案例：剧情展示系统

**问题**：创建了 `index.html` + `config.json`，双击打开时无法加载配置。

**解决**：
1. 创建 `index-standalone.html`，将配置嵌入
2. 日常查看使用单机版
3. 需要编辑时，修改 `config.json`，然后更新单机版中的数据

**代码示例**：
```html
<!-- index-standalone.html -->
<script>
// 嵌入的配置数据
const SCRIPT_DATA = {
    "title": "剧情标题",
    "acts": [ /* ... */ ]
};

// 直接使用
renderPage(SCRIPT_DATA);
</script>
```

---

---

## ❌ 失败教训（2026-02-24）JSON 字符串中的引号转义问题

### 问题描述

创建 JSON 配置文件时，字符串内部包含英文双引号 `"`，导致 JSON 解析失败：

```json
{
  "condition": "【若玩家选择"火系"】",
  "content": "（钟声："咚 —— 咚 ——"）"
}
```

**错误信息：**
```
Expected ',' or ']' after property value in JSON at position 3078
```

### 根本原因

JSON 标准规定：
- 字符串必须使用**英文双引号** `"` 包裹
- 如果字符串内部需要包含 `"`，必须**转义**为 `\"`
- 中文引号「」'"' "'" 不需要转义，但不是标准 JSON 字符串分隔符

**常见错误：**
```json
// ❌ 错误：内部双引号未转义
"他说"你好""

// ❌ 错误：使用中文引号包裹
'这是中文引号包裹的字符串'

// ❌ 错误：混用单双引号
"name": 'value'
```

### 解决方案

#### 方案 1：使用转义字符（标准做法）
```json
{
  "condition": "【若玩家选择\"火系\"】",
  "content": "（钟声：\"咚 —— 咚 ——\"）"
}
```

#### 方案 2：使用中文引号（推荐用于中文内容）⭐
```json
{
  "condition": "【若玩家选择「火系」】",
  "content": "（钟声：「咚 —— 咚 ——」）"
}
```

**优点**：
- 无需转义，可读性更好
- 符合中文排版习惯
- 避免视觉混淆

#### 方案 3：使用单引号（仅限 JSON5/非标准 JSON）
```json5
// JSON5 格式（非标准 JSON）
{
  condition: '【若玩家选择"火系"】'
}
```
⚠️ **注意**：标准 JSON 不支持单引号字符串！

### 验证 JSON 格式

**在线工具：**
- [JSONLint](https://jsonlint.com/)
- [JSON Formatter](https://jsonformatter.org/)

**命令行验证：**
```bash
# Python
python -c "import json; json.load(open('config.json')); print('Valid!')"

# Node.js
node -e "JSON.parse(require('fs').readFileSync('config.json')); console.log('Valid!')"

# PowerShell
Get-Content config.json | ConvertFrom-Json
```

### 预防措施

1. **编辑时**：使用支持 JSON 语法高亮的编辑器（VS Code、Sublime Text）
2. **保存前**：使用 JSON 格式化工具检查
3. **自动校验**：在构建流程中添加 JSON 校验步骤
4. **避免手敲**：复杂 JSON 使用工具生成，而非手动编辑

### 常见 JSON 错误对照表

| 错误写法 | 正确写法 | 说明 |
|---------|---------|------|
| `"text"value"` | `"text\"value"` 或 `"text「value」"` | 内部引号必须转义或替换 |
| `'single quoted'` | `"double quoted"` | JSON 只支持双引号 |
| `"trailing comma",` | `"no trailing comma"` | 最后一个元素不能有逗号 |
| `{"key": "value",}` | `{"key": "value"}` | 对象末尾不能有逗号 |
| `undefined` | `null` | JSON 使用 null，不是 undefined |
| `NaN` / `Infinity` | `null` | JSON 不支持特殊数字 |

---

## 📚 参考链接

- [MDN: CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)
- [MDN: Same-origin policy](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)
- [Chrome: Local file restrictions](https://developer.chrome.com/docs/extensions/mv3/xhr/)
- [JSON 标准 (RFC 8259)](https://tools.ietf.org/html/rfc8259)
- [JSON5 - JSON for Humans](https://json5.org/)

---

**记录时间**：2026-02-24  
**记录人**：OpenClaw Agent  
**关联项目**：lumi-script（剧情展示系统）