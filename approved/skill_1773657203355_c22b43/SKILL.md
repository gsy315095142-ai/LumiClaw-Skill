# Morning Report / 早报 Skill

自动获取国内外 AI 最新资讯，生成结构化早报。

---

## 📝 更新日志

### 2026-02-24 更新
**问题**: Brave Search API 已不再提供免费额度  
**影响**: web_search 工具无法直接使用，需要替代方案  
**解决方案**: 
- 使用浏览器自动化 (browser + web_fetch) 作为替代
- 或用户自行申请付费 API Key

### 2026-02-18 重大更新
**问题**: Claude Sonnet 4.6 发布遗漏  
**原因**: 单一官网来源存在缓存延迟  
**解决方案**: 
- 增加多渠道交叉验证（官网 + 技术媒体 + 社交媒体）
- 更新模型对照表（添加 Claude 三档模型说明）
- 改进信息获取流程（优先使用 web_search）

---

## 触发方式

1. **关键词触发**: 用户发送包含「早报」或「morning report」的消息时自动触发
2. **定时任务**: 可通过 cron 配置每天早上自动推送

## 资讯来源

### ⚠️ 信息源问题与教训（2026-02-18 更新）

**问题案例**：Anthropic Claude Sonnet 4.6 于 2026年2月17日发布，但官网 `/news` 页面因缓存/延迟未及时显示，导致早报遗漏。

**根本原因**：
1. 单一官网来源存在缓存延迟（CDN 缓存、发布同步延迟）
2. 官网新闻列表可能只显示"重要"发布，中端型号更新可能被忽略
3. 发布时间以"美东时间"为准时，官网可能按美国工作日更新

**解决方案**：**多渠道交叉验证**，不依赖单一来源。

---

### 🇨🇳 国内 AI 来源

| 公司 | 官网/渠道 | 补充渠道 |
|-----|----------|---------|
| 智谱 AI | zhipuai.cn/news | 微信公众号、知乎 |
| DeepSeek | deepseek.com / GitHub | GitHub Releases、X |
| 阿里通义 | qwenlm.github.io | 阿里云官方博客 |
| 字节跳动 | volcengine.com | 字节技术公众号 |
| 百度文心 | yiyan.baidu.com | 百度 AI 官方号 |
| 讯飞星火 | xinghuo.xfyun.cn | 讯飞开放平台公告 |
| Moonshot | kimi.moonshot.cn | 月之暗面公众号 |
| MiniMax | minimaxi.com | 官方公众号 |
| 零一万物 | 01.ai | 官方公众号 |
| 阶跃星辰 | stepfun.com | 官方公众号 |

**技术媒体（必查）:**
- 机器之心: jiqizhixin.com
- Synced 中文: syncedreview.com
- 量子位: qbitai.com

### 🌏 国外 AI 来源

| 公司 | 官网 | 社交媒体 | 技术媒体 |
|-----|------|----------|---------|
| OpenAI | openai.com/news | X @OpenAI | TechCrunch |
| Anthropic | anthropic.com/news | X @AnthropicAI | The Verge |
| Google AI | blog.google/technology/ai | X @GoogleAI | VentureBeat |
| Meta AI | ai.meta.com/blog | X @AIatMeta | TechCrunch |
| Microsoft | blogs.microsoft.com/ai | X @MSFT_AI | The Verge |
| xAI | x.ai | X @xAI | TechCrunch |
| Mistral | mistral.ai/news | X @MistralAI | VentureBeat |
| Cohere | cohere.com/blog | X @Cohere | The Verge |

**国际技术媒体（必查）:**
- TechCrunch AI: techcrunch.com/category/artificial-intelligence/
- The Verge AI: theverge.com/ai-artificial-intelligence
- VentureBeat AI: venturebeat.com/ai/
- Ars Technica AI: arstechnica.com/ai/

**社区/论坛（辅助验证）:**
- Reddit r/LocalLLaMA: 模型发布第一时间讨论
- Reddit r/ClaudeAI: Anthropic 相关动态
- ProductHunt: AI 产品发布
- Hacker News: 技术社区讨论

## 输出格式

```
🌅 早报 (YYYY-MM-DD)

## 🇨🇳 国内 AI 模型动态

### 🔥 [公司] [模型名]
- **状态**: 新闻内容 / 无新动态
- **亮点**: 如有新闻，简要说明

### [公司] [模型名]
- **今日**: 无新动态

## 🌏 国际 AI 模型动态

### [公司] [模型名]
- **今日**: 无新动态

## 📊 一句话总结
> 今日 AI 领域核心变化一句话概括
```

### 格式规范 (Format Standard) ⭐ **新增**

**采用方案 A：列表式 + Emoji 区分**

```
🌅 **早报** YYYY-MM-DD

**🔥 今日热点**
模型名 — 新闻内容简述

━ ━ ━ ━ ━

**🇨🇳 国内模型 (N家)**
🟢 模型名 (有动态)
⚪ 模型名 · 模型名 · 模型名 (无动态)

━ ━ ━ ━ ━

**🌏 国际模型 (N家)**
🟢 模型名 (有动态)
⚪ 模型名 · 模型名 · 模型名 (无动态)

━ ━ ━ ━ ━

📌 **小结**: 一句话总结今日 AI 动态
```

**排版规则**：
1. **分隔线**: 使用 `━ ━ ━ ━ ━` 分区
2. **Emoji 标记**:
   - 🟢 绿色 = 有24小时内新闻
   - ⚪ 灰色 = 无新动态
3. **模型名称**: 明确标注（如 GLM-5、DeepSeek-V3）
4. **数量标注**: 括号内标注 (N家)
5. **无动态处理**: 多个无动态的模型用 `·` 连接，节省空间

**完整示例**：
```
🌅 **早报** 2026-02-15

**🔥 今日热点**
智谱 GLM-5 — 本周发布新一代模型（记忆/多模态提升）

━ ━ ━ ━ ━

**🇨🇳 国内模型 (10家)**
🟢 智谱 GLM-5
⚪ 百度文心 · 阿里通义 · 字节豆包 · DeepSeek
⚪ 讯飞星火 · Kimi · MiniMax · 零一万物 · 阶跃星辰

━ ━ ━ ━ ━

**🌏 国际模型 (7家)**
⚪ OpenAI GPT-4 · Claude · Gemini · Llama · Grok · Mistral · Cohere

━ ━ ━ ━ ━

📌 **小结**: 周日平静，智谱 GLM-5 本周发布是国产模型最大亮点
```

**目的**：
- 简洁清晰，一目了然
- Emoji 快速区分有/无动态
- 分隔线明确分区
- 节省空间，适合移动端阅读

**模型名称对照表**（2026-02-18 更新）：

| 公司 | 模型名称 | 最新版本 |
|------|----------|----------|
| 智谱 AI | GLM | GLM-5 |
| DeepSeek | DeepSeek | DeepSeek-V3 |
| 阿里 | 通义千问 Qwen | Qwen2.5 |
| 字节 | 豆包 | Doubao-pro |
| 百度 | 文心一言 | ERNIE 4.0 |
| 讯飞 | 星火 | Spark 4.0 |
| Moonshot | Kimi | Kimi k2.5 |
| MiniMax | MiniMax | M2.5 |
| 零一万物 | Yi | Yi-Large |
| 阶跃星辰 | Step | Step-2 |
| **OpenAI** | **GPT** | **GPT-4o / o3** |
| **Anthropic** | **Claude** | **Opus 4.6 / Sonnet 4.6 / Haiku 3.5** |
| Google | Gemini | Gemini 2.0 |
| Meta | Llama | Llama 3.3 |
| Microsoft | Copilot | - |
| xAI | Grok | Grok-2 |
| Mistral | Mistral | Mistral Large 2 |
| Cohere | Command | Command R7B |

> **Claude 系列说明**：Anthropic 有三档模型
> - **Opus** - 旗舰最强（最新 Opus 4.6，2026-02-05 发布）
> - **Sonnet** - 平衡型（最新 Sonnet 4.6，2026-02-17 发布）
> - **Haiku** - 轻量快速（最新 Haiku 3.5）

## 内容筛选规范 (Content Filtering) ⭐ **新增**

### 时间范围
- **只收录过去24小时内的新闻** (昨天 09:00 到今天 09:00)
- **严禁混入过期内容**：即使是重要新闻，超过24小时也不放入早报

### 完整性要求 (Completeness) ⭐ **新增**

**必须列出所有关注的公司/模型**，无论是否有新闻：

| 类型 | 处理方式 |
|------|----------|
| 有24小时内新闻 | 正常展示标题+摘要 |
| 无24小时内新闻 | 标注 **"最近24小时无新闻"** |

**目的**：
- 让用户了解全貌（哪些公司有动静，哪些没有）
- 避免用户猜测"是不是漏了"
- 体现专业性和透明度

### 新闻来源检查清单 ⭐ **2026-02-18 更新：多渠道验证**

**⚠️ 重要原则**：每个公司需检查 **至少2个独立来源**，避免单一来源遗漏。

#### 🇨🇳 国内必须检查 (10家公司)

| 公司 | 官网 | 技术媒体 | 社交媒体 |
|-----|------|----------|----------|
| 智谱 AI | zhipuai.cn/news | 机器之心 | 微信公众号 |
| DeepSeek | deepseek.com | Synced 中文 | GitHub/X |
| 阿里通义 | qwenlm.github.io | 量子位 | 阿里云博客 |
| 字节豆包 | volcengine.com | 机器之心 | 字节技术号 |
| 百度文心 | yiyan.baidu.com | Synced 中文 | 百度 AI 号 |
| 讯飞星火 | xinghuo.xfyun.cn | 量子位 | 讯飞开放平台 |
| Moonshot | kimi.moonshot.cn | 机器之心 | 月之暗面公众号 |
| MiniMax | minimaxi.com | Synced 中文 | 官方公众号 |
| 零一万物 | 01.ai | 量子位 | 官方公众号 |
| 阶跃星辰 | stepfun.com | 机器之心 | 官方公众号 |

#### 🌏 国际必须检查 (8家公司) ⭐ **重点更新**

| 公司 | 官网 | 技术媒体 | 社交媒体/社区 |
|-----|------|----------|--------------|
| OpenAI | openai.com/news | TechCrunch | X @OpenAI |
| **Anthropic** | **anthropic.com/news** ⭐ | **The Verge** ⭐ | **X @AnthropicAI** ⭐ |
| Google AI | blog.google/technology/ai | The Verge | X @GoogleAI |
| Meta AI | ai.meta.com/blog | TechCrunch | X @AIatMeta |
| Microsoft AI | blogs.microsoft.com/ai | VentureBeat | X @MSFT_AI |
| xAI | x.ai | TechCrunch | X @xAI |
| Mistral | mistral.ai/news | VentureBeat | X @MistralAI |
| Cohere | cohere.com/blog | The Verge | X @Cohere |

**⚠️ Anthropic 特殊注意**：
- 官网 `/news` 可能存在缓存延迟
- **必须同时检查**：官网 + X @AnthropicAI + The Verge
- Claude 有三档模型（Opus/Sonnet/Haiku），需分别关注

## 使用方法

### 手动触发
用户发送: `早报` 或 `morning report`

### 定时自动推送
配置 cron job:
```json
{
  "name": "morning-report-daily",
  "schedule": { "kind": "cron", "expr": "0 9 * * *", "tz": "Asia/Shanghai" },
  "payload": { "kind": "systemEvent", "text": "__morning_report_trigger__" }
}
```

## 去重策略

1. **标题相似度检测**: Levenshtein 距离 > 80% 视为重复
2. **时间窗口**: 24 小时内同一事件只保留最早来源
3. **来源优先级**: 官方渠道 > 技术媒体 > 第三方报道

## 文件结构

```
C:\Users\31509\clawd\skills\morning-report/
├── SKILL.md              # 本文件
├── sources.json          # 资讯源配置
├── report-template.md    # 早报模板
└── fetch-news.py         # 抓取脚本
```

## 当前实现状态

- ✅ **SKILL.md** - 技能文档
- ✅ **sources.json** - 17个国内外 AI 来源配置
- ✅ **fetch-news.py** - 新闻抓取脚本（基础版）
- ✅ **report-template.md** - 输出格式模板

## 使用方法 (Agent)

当用户发送「早报」时，Agent 应：

### Step 1: 准备
1. 读取 `sources.json` 获取资讯源列表
2. 检查 `skills/web-search/SKILL.md` 是否可用（优先使用 web_search）

### Step 2: 多渠道获取信息 ⭐ **关键更新**

**方案 A: 使用 web_search（推荐，但需付费 API Key）** ⭐ **2026-02-24 更新：Brave Search API 已不再免费**
```
搜索关键词:
- "Anthropic Claude 最新发布 2026"
- "OpenAI GPT 最新发布 2026"
- "Google Gemini 最新发布 2026"
- "智谱 GLM 最新发布"
- "DeepSeek 最新发布"
- ...（各公司逐一搜索）
```

⚠️ **注意**: Brave Search API 已于近期取消免费额度，如需使用需申请付费 API Key。
替代方案：使用浏览器自动化（见方案 B）

**方案 B: 使用 web_fetch（备用）**
对每个公司，检查至少2个来源：
1. **官网新闻页** `web_fetch https://{company}.com/news`
2. **技术媒体** `web_fetch https://techcrunch.com/category/artificial-intelligence/`
3. **社交媒体**（如有 API 或公开页面）

### Step 3: 交叉验证
- 如果官网无新闻但技术媒体有报道 → **以技术媒体为准**
- 如果官网显示旧新闻 → **检查缓存时间，优先实时来源**
- 如果不同来源有冲突 → **优先官方确认 + 多个来源佐证**

### Step 4: 生成早报
按模板格式生成，确保：
- ✅ 所有18家公司都已检查
- ✅ 有新闻的标注 🟢 + 详细信息
- ✅ 无新闻的标注 ⚪
- ✅ 包含 "今日热点" 和 "小结"

## 配置来源清单

### 🇨🇳 国内 (10家公司 + 3家媒体)
- 智谱 AI、DeepSeek、阿里通义、字节豆包、百度文心
- 讯飞星火、Moonshot、MiniMax、零一万物、阶跃星辰
- 机器之心、Synced 中文、量子位

### 🌏 国际 (8家公司 + 2家媒体)
- OpenAI、Anthropic、Google AI、Meta AI、Microsoft AI
- xAI、Mistral、Cohere
- TechCrunch AI、The Verge AI

## TODO (未来优化)

### 高优先级（解决当前问题）
- [ ] **多渠道信息聚合**：集成至少3个独立信息源（官网+技术媒体+社交媒体）
- [ ] **实时性优化**：使用 web_search 替代单一 web_fetch，避免缓存延迟
- [ ] **Claude 系列细分追踪**：分别监控 Opus/Sonnet/Haiku 三档模型更新

### 中优先级（提升质量）
- [ ] 实现 RSS 订阅自动抓取
- [ ] 实现网页内容爬取 + AI 摘要生成
- [ ] 支持自定义关注的公司列表
- [ ] 添加定时推送功能
- [ ] 实现智能去重算法

### 低优先级（锦上添花）
- [ ] 添加性能基准对比（如 SWE-Bench 分数）
- [ ] 添加价格变动追踪
- [ ] 支持历史趋势分析
