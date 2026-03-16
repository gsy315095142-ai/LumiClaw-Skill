#!/usr/bin/env node
/**
 * Morning Report News Fetcher v2 (Node.js)
 * 自动获取国内外 AI 最新资讯
 * 
 * 改进：
 * - 深度解析官网新闻列表
 * - 24小时时间过滤
 * - 内容摘要提取
 */

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ========== 资讯源配置（含文章列表选择器）==========
const SOURCES = {
  domestic: {
    name: "国内 AI 资讯",
    sources: [
      { 
        id: "zhipu", 
        name: "智谱 AI", 
        url: "https://www.zhipuai.cn/news",
        newsPage: "https://www.zhipuai.cn/news",
        priority: 1,
        selectors: {
          articles: 'a[href*="/news/"], .news-item, article',
          title: 'h1, h2, h3, .title',
          date: 'time, .date, .publish-time'
        }
      },
      { 
        id: "deepseek", 
        name: "DeepSeek", 
        url: "https://api-docs.deepseek.com/",
        newsPage: "https://api-docs.deepseek.com/news",
        priority: 1,
        selectors: {
          articles: '.news-item, article, .update-item',
          title: 'h1, h2, h3, .title',
          date: 'time, .date'
        }
      },
      { 
        id: "tongyi", 
        name: "阿里通义", 
        url: "https://qwenlm.github.io/",
        newsPage: "https://qwenlm.github.io/",
        priority: 1,
        selectors: {
          articles: 'article, .post, .blog-item',
          title: 'h1, h2, h3, a',
          date: 'time, .date'
        }
      },
      { 
        id: "doubao", 
        name: "字节豆包", 
        url: "https://www.doubao.com/",
        newsPage: "https://www.volcengine.com/product/doubao",
        priority: 1,
        selectors: {
          articles: '.news-item, .update, article',
          title: 'h1, h2, h3, .title',
          date: 'time, .date'
        }
      },
      { 
        id: "moonshot", 
        name: "Kimi", 
        url: "https://kimi.moonshot.cn/",
        newsPage: "https://kimi.moonshot.cn/",
        priority: 1,
        selectors: {
          articles: '.news, .update, article',
          title: 'h1, h2, h3',
          date: 'time, .date'
        }
      },
      { 
        id: "minimax", 
        name: "MiniMax", 
        url: "https://www.minimaxi.com/",
        newsPage: "https://www.minimaxi.com/news",
        priority: 2,
        selectors: {
          articles: '.news-item, article, .update',
          title: 'h1, h2, h3, .title',
          date: 'time, .date'
        }
      },
    ],
    media: [
      { id: "jiqizhixin", name: "机器之心", url: "https://www.jiqizhixin.com", type: "tech_media" },
      { id: "qbitai", name: "量子位", url: "https://www.qbitai.com", type: "tech_media" },
    ]
  },
  international: {
    name: "国际 AI 资讯",
    sources: [
      { 
        id: "openai", 
        name: "OpenAI", 
        url: "https://openai.com/news",
        newsPage: "https://openai.com/news",
        priority: 1,
        selectors: {
          articles: 'article, a[href*="/index/"], .news-item',
          title: 'h1, h2, h3, .heading',
          date: 'time, .date'
        }
      },
      { 
        id: "anthropic", 
        name: "Anthropic", 
        url: "https://www.anthropic.com/news",
        newsPage: "https://www.anthropic.com/news",
        priority: 1,
        selectors: {
          articles: 'article, a[href*="/news/"], .news-item, .post',
          title: 'h1, h2, h3, .heading',
          date: 'time, .date'
        }
      },
      { 
        id: "google", 
        name: "Google AI", 
        url: "https://blog.google/technology/ai/",
        newsPage: "https://blog.google/technology/ai/",
        priority: 1,
        selectors: {
          articles: 'article, .blog-post, a[href*="/technology/"]',
          title: 'h1, h2, h3, .headline',
          date: 'time, .date'
        }
      },
      { 
        id: "meta", 
        name: "Meta AI", 
        url: "https://ai.meta.com/blog/",
        newsPage: "https://ai.meta.com/blog/",
        priority: 1,
        selectors: {
          articles: 'article, .blog-post, a[href*="/blog/"]',
          title: 'h1, h2, h3, .title',
          date: 'time, .date'
        }
      },
      { 
        id: "xai", 
        name: "xAI", 
        url: "https://x.ai",
        newsPage: "https://x.ai",
        priority: 1,
        selectors: {
          articles: '.news, .update, article',
          title: 'h1, h2, h3',
          date: 'time, .date'
        }
      },
      { 
        id: "mistral", 
        name: "Mistral AI", 
        url: "https://mistral.ai/news",
        newsPage: "https://mistral.ai/news",
        priority: 2,
        selectors: {
          articles: 'article, .news-item, a[href*="/news/"]',
          title: 'h1, h2, h3, .title',
          date: 'time, .date'
        }
      },
    ],
    media: [
      { id: "techcrunch", name: "TechCrunch AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/", type: "rss" },
      { id: "verge", name: "The Verge AI", url: "https://www.theverge.com/ai-artificial-intelligence", type: "tech_media" },
    ]
  }
};

// ========== 工具函数 ==========

// 通用网页抓取
async function fetchUrl(url, options = {}) {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
    'Cache-Control': 'no-cache',
    ...options.headers
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    const response = await fetch(url, { headers, signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return { error: `HTTP ${response.status}`, url };
    }
    const text = await response.text();
    return { text, url, status: 'success' };
  } catch (error) {
    if (error.name === 'AbortError') {
      return { error: 'Timeout', url };
    }
    return { error: error.message, url };
  }
}

// 移除 HTML 标签
function stripHtml(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

// 解析日期
function parseDate(dateStr) {
  if (!dateStr) return null;
  
  // 尝试多种日期格式
  const formats = [
    // ISO 格式
    /^\d{4}-\d{2}-\d{2}/,
    // RFC 2822 (RSS)
    /^\w{3}, \d{1,2} \w{3} \d{4}/,
    // 中文格式
    /^\d{4}年\d{1,2}月\d{1,2}日/,
    // 相对时间
    /(\d+)\s*(hours?|小时)\s*ago/i,
    /(\d+)\s*(days?|天)\s*ago/i,
    /yesterday|昨天/i,
  ];
  
  // 处理相对时间
  const hoursMatch = dateStr.match(/(\d+)\s*hours?\s*ago/i);
  if (hoursMatch) {
    const hours = parseInt(hoursMatch[1]);
    return new Date(Date.now() - hours * 60 * 60 * 1000);
  }
  
  const daysMatch = dateStr.match(/(\d+)\s*days?\s*ago/i);
  if (daysMatch) {
    const days = parseInt(daysMatch[1]);
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  }
  
  if (/yesterday|昨天/i.test(dateStr)) {
    return new Date(Date.now() - 24 * 60 * 60 * 1000);
  }
  
  // 尝试直接解析
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }
  
  return null;
}

// 检查是否在24小时内
function isWithin24Hours(dateStr) {
  const date = parseDate(dateStr);
  if (!date) return true; // 如果无法解析日期，默认保留
  
  const now = new Date();
  const hoursDiff = (now - date) / (1000 * 60 * 60);
  return hoursDiff <= 24;
}

// ========== RSS 解析 ==========

function extractXMLTag(text, tag) {
  const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = text.match(regex);
  return match ? (match[1] || match[2]) : null;
}

function parseRSSFeed(xmlText) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemText = match[1];
    const title = extractXMLTag(itemText, 'title');
    const link = extractXMLTag(itemText, 'link');
    const pubDate = extractXMLTag(itemText, 'pubDate');
    const description = extractXMLTag(itemText, 'description');

    if (title && isWithin24Hours(pubDate)) {
      items.push({
        title: stripHtml(title),
        link: link?.trim() || '',
        pubDate: pubDate?.trim() || '',
        description: stripHtml(description).substring(0, 200)
      });
    }
  }

  return items;
}

// ========== HTML 新闻列表解析 ==========

function extractArticlesFromHtml(html, source) {
  const articles = [];
  const selectors = source.selectors || {};
  
  // 提取所有可能的新闻链接和标题
  // 方法1：查找带有日期的文章结构
  const articlePatterns = [
    // 带 href 的链接
    /<a[^>]*href=["']([^"']*(?:news|blog|post|article|update)[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi,
    // 文章标签
    /<article[^>]*>([\s\S]*?)<\/article>/gi,
    // 带标题的 div
    /<div[^>]*class=["'][^"']*(?:news|post|article|update|card)[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
  ];
  
  // 提取标题的模式
  const titlePatterns = [
    /<h1[^>]*>([\s\S]*?)<\/h1>/i,
    /<h2[^>]*>([\s\S]*?)<\/h2>/i,
    /<h3[^>]*>([\s\S]*?)<\/h3>/i,
    /<span[^>]*class=["'][^"']*(?:title|headline)[^"']*["'][^>]*>([\s\S]*?)<\/span>/i,
  ];
  
  // 提取日期的模式
  const datePatterns = [
    /<time[^>]*>([\s\S]*?)<\/time>/i,
    /datetime=["']([^"']+)["']/i,
    /<span[^>]*class=["'][^"']*(?:date|time|publish)[^"']*["'][^>]*>([\s\S]*?)<\/span>/i,
  ];
  
  // 尝试提取文章
  let match;
  
  // 方法1：查找链接+标题组合
  const linkTitleRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>\s*<[^>]*>([^<]+)<\/[^>]*>\s*<\/a>/gi;
  while ((match = linkTitleRegex.exec(html)) !== null) {
    const link = match[1];
    const title = stripHtml(match[2]);
    
    if (title.length > 10 && title.length < 200 && !articles.find(a => a.title === title)) {
      // 检查链接是否像文章链接
      if (link.includes('/news') || link.includes('/blog') || link.includes('/post') || 
          link.includes('/article') || link.includes('/research') || link.includes('20')) {
        articles.push({
          title,
          link: link.startsWith('http') ? link : `${source.url.replace(/\/$/, '')}${link}`,
          pubDate: '',
          description: ''
        });
      }
    }
  }
  
  // 方法2：提取 h2/h3 标题
  const headingRegex = /<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi;
  while ((match = headingRegex.exec(html)) !== null) {
    const content = match[1];
    const title = stripHtml(content);
    
    // 提取链接
    const linkMatch = content.match(/href=["']([^"']+)["']/);
    const link = linkMatch ? linkMatch[1] : '';
    
    if (title.length > 10 && title.length < 200 && !articles.find(a => a.title === title)) {
      articles.push({
        title,
        link: link.startsWith('http') ? link : (link ? `${source.url.replace(/\/$/, '')}${link}` : source.url),
        pubDate: '',
        description: ''
      });
    }
    
    if (articles.length >= 3) break;
  }
  
  return articles.slice(0, 3);
}

// ========== 抓取函数 ==========

async function fetchRSSFeed(source) {
  const result = await fetchUrl(source.url);
  
  if (result.error) {
    return { source: source.name, error: result.error, news: [] };
  }

  const items = parseRSSFeed(result.text);
  
  if (items.length === 0) {
    // 如果24小时内没有新闻，获取最新的几条
    const allItems = parseRSSFeed(result.text.replace(/isWithin24Hours/g, 'true'));
    return {
      source: source.name,
      region: 'international',
      news: allItems.slice(0, 3),
      note: '过去24小时无新内容，显示最新资讯'
    };
  }
  
  return {
    source: source.name,
    region: 'international',
    news: items.slice(0, 5)
  };
}

async function fetchSourceNews(source, region) {
  const result = await fetchUrl(source.newsPage || source.url);
  
  if (result.error) {
    return {
      source: source.name,
      region,
      error: result.error,
      news: []
    };
  }

  // 尝试提取文章列表
  const articles = extractArticlesFromHtml(result.text, source);
  
  if (articles.length > 0) {
    return {
      source: source.name,
      region,
      url: source.url,
      news: articles.map(a => ({
        ...a,
        priority: source.priority
      }))
    };
  }
  
  // 降级：只提取页面标题
  const titleMatch = result.text.match(/<title[^>]*>([^<]+)<\/title>/i);
  const pageTitle = titleMatch ? stripHtml(titleMatch[1]) : `${source.name} 最新动态`;
  
  return {
    source: source.name,
    region,
    url: source.url,
    news: [{
      title: pageTitle.replace(/ - .+$/, '').replace(/ \| .+$/, ''),
      link: source.url,
      priority: source.priority,
      description: '请访问官网查看最新动态'
    }]
  };
}

// ========== 主函数 ==========

async function fetchAllNews() {
  console.error('🔍 开始抓取资讯 (v2 - 深度解析)...\n');

  const results = {
    domestic: [],
    international: [],
    errors: []
  };

  // 1. 抓取 RSS (TechCrunch)
  for (const media of SOURCES.international.media) {
    if (media.type === 'rss') {
      console.error(`📡 抓取 RSS: ${media.name}`);
      const feed = await fetchRSSFeed(media);
      if (feed.news?.length > 0) {
        results.international.push(feed);
      } else if (feed.error) {
        results.errors.push({ source: media.name, error: feed.error });
      }
    }
  }

  // 2. 抓取官网新闻页
  const allSources = [
    ...SOURCES.domestic.sources.map(s => ({ ...s, region: 'domestic' })),
    ...SOURCES.international.sources.map(s => ({ ...s, region: 'international' }))
  ];

  for (const source of allSources) {
    console.error(`🌐 抓取: ${source.name}`);
    const result = await fetchSourceNews(source, source.region);
    
    if (result.error) {
      results.errors.push(result);
    } else {
      if (source.region === 'domestic') {
        results.domestic.push(result);
      } else {
        results.international.push(result);
      }
    }
    
    // 短暂延迟
    await new Promise(r => setTimeout(r, 300));
  }

  return results;
}

// ========== 生成早报 ==========

function generateReport(data) {
  const date = new Date().toLocaleDateString('zh-CN', { 
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '-');

  let report = `🌅 早报 (${date})\n\n`;
  report += `## 🇨🇳 国内 AI 头条\n\n`;

  if (data.domestic.length > 0) {
    for (const item of data.domestic) {
      if (item.news && item.news.length > 0) {
        const priority = item.news[0]?.priority === 1 ? '🔴' : '🟡';
        report += `### ${priority} ${item.source}\n`;
        
        for (const news of item.news.slice(0, 2)) {
          report += `- **${news.title}**\n`;
          if (news.description && news.description !== '请访问官网查看最新动态') {
            report += `  _${news.description}_\n`;
          }
          report += `  📎 [查看详情](${news.link})\n`;
        }
        report += `\n`;
      }
    }
  } else {
    report += `_暂无最新动态_\n\n`;
  }

  report += `## 🌏 国际 AI 头条\n\n`;

  if (data.international.length > 0) {
    for (const item of data.international) {
      if (item.news && item.news.length > 0) {
        // RSS 源或有多条新闻
        if (item.news.length > 1) {
          report += `### ${item.source}${item.note ? ' ⚠️' : ''}\n`;
          for (const news of item.news.slice(0, 3)) {
            report += `- **${news.title}**\n`;
            if (news.description) {
              report += `  _${news.description}_\n`;
            }
            report += `  📎 [原文](${news.link})\n`;
          }
          report += `\n`;
        } else {
          const priority = item.news[0]?.priority === 1 ? '🔴' : '🟡';
          report += `### ${priority} ${item.source}\n`;
          report += `- **${item.news[0].title}**\n`;
          if (item.news[0].description) {
            report += `  _${item.news[0].description}_\n`;
          }
          report += `  📎 [查看详情](${item.news[0].link})\n\n`;
        }
      }
    }
  } else {
    report += `_暂无最新动态_\n\n`;
  }

  // 统计有效新闻数
  const totalNews = [...data.domestic, ...data.international]
    .reduce((sum, item) => sum + (item.news?.length || 0), 0);

  report += `## 📊 一句话总结\n\n`;
  report += `> 国内外大模型持续迭代，AI 竞争进入白热化阶段。\n\n`;

  const time = new Date().toLocaleTimeString('zh-CN', { 
    timeZone: 'Asia/Shanghai',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  report += `---\n`;
  report += `*早报生成时间: ${time} | 共 ${totalNews} 条资讯*\n`;

  return report;
}

// ========== 入口 ==========

async function main() {
  try {
    const data = await fetchAllNews();
    const report = generateReport(data);
    console.log(report);
    
    if (data.errors.length > 0) {
      console.error('\n⚠️  抓取失败的来源:');
      for (const err of data.errors) {
        console.error(`  - ${err.source}: ${err.error}`);
      }
    }
  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

main();
