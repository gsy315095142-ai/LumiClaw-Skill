# Web Search Skill (联网搜索)

## 目的
当需要联网搜索信息时，使用浏览器自动化访问搜索引擎，提取搜索结果。

## 使用场景
- 获取最新资讯（早报、新闻）
- 查询实时信息（天气、股价、比赛结果）
- 搜索技术文档、教程
- 验证事实、查找资料

## 搜索流程

### 标准执行步骤

1. **打开搜索引擎**
   ```
   browser open https://duckduckgo.com
   ```
   - 首选 DuckDuckGo（无需登录，无反爬限制）
   - 备选 Google（结果更全面，但可能有验证）

2. **输入搜索词**
   ```
   browser type [搜索框ref] "关键词"
   ```
   - 使用英文关键词（结果更准确）
   - 如需中文，直接使用中文

3. **提交搜索**
   ```
   browser press Enter
   或
   browser click [搜索按钮ref]
   ```

4. **等待结果加载**
   ```
   browser wait 3s
   ```

5. **提取搜索结果**
   ```
   browser snapshot
   ```
   - 提取前 5-10 个结果标题和链接
   - 如需详细内容，点击链接进入并抓取

6. **关闭浏览器**
   ```
   browser close
   ```

### 备选方案：直接访问已知 URL

如果已知信息来源网址：
```
browser open [url]
browser snapshot
```

## 注意事项

### ⚠️ 效率提醒
- 浏览器搜索比 API 慢（需 5-15 秒）
- 不适合高频搜索（如批量查询）
- 适合一次性、重要的搜索任务

## ⚠️ Chrome 扩展模式注意事项

使用 Chrome 扩展（`profile="chrome"`）进行搜索时，**必须复用已连接的页面**，不要打开新标签页。

> 📖 **详细说明见**: `skills/agent-browser/SKILL.md` → "Chrome 扩展连接重要经验"

**关键原则**：
- ✅ 使用 `browser snapshot --targetId <id>` 操作现有页面
- ❌ 避免使用 `browser open`（会打开新标签页，导致扩展失效）

### ⚠️ 结果处理
- 提取的信息必须注明来源
- 多源交叉验证重要信息
- 注明信息获取时间

### ⚠️ 失败处理
- 如遇验证码/CAPTCHA，停止并告知用户
- 如页面加载失败，重试 1 次后报告

## 使用示例

### 示例 1：搜索最新 AI 新闻
```
1. 打开 https://duckduckgo.com
2. 输入 "latest AI news 2026"
3. 提交搜索
4. 等待加载
5. 提取结果
6. 关闭浏览器
```

### 示例 2：查询特定技术文档
```
1. 打开 https://google.com
2. 输入 "OpenClaw web_search configuration"
3. 提交搜索
4. 点击第一个结果
5. 提取页面内容
6. 关闭浏览器
```

## 关联工具

- `web_fetch` - 直接抓取已知 URL 的内容（比浏览器快）
- `agent-browser` - 底层浏览器自动化工具

## 何时不使用

- ❌ 已知确切 URL → 直接用 `web_fetch`
- ❌ 需要批量搜索 → 建议申请 API
- ❌ 对速度要求极高 → 建议申请 API

---

**创建时间**: 2026-02-15
**优先级**: 高（替代缺失的 web_search API）
