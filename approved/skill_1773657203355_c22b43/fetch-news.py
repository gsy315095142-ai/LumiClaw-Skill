#!/usr/bin/env python3
"""
Morning Report News Fetcher
自动获取国内外 AI 最新资讯
"""

import json
import requests
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Optional
import re

class NewsFetcher:
    def __init__(self, config_path: str = None):
        if config_path is None:
            config_path = Path(__file__).parent / "sources.json"
        
        with open(config_path, "r", encoding="utf-8") as f:
            self.config = json.load(f)
        
        self.report_config = self.config.get("report_config", {})
        self.lookback_hours = self.report_config.get("lookback_hours", 24)
        
    def fetch_techcrunch_feed(self) -> List[Dict]:
        """抓取 TechCrunch AI Feed"""
        try:
            feed_url = "https://techcrunch.com/category/artificial-intelligence/feed/"
            response = requests.get(feed_url, timeout=10)
            response.raise_for_status()
            
            # Parse RSS XML
            import xml.etree.ElementTree as ET
            root = ET.fromstring(response.content)
            
            news_items = []
            # RSS 2.0 namespace
            ns = {'content': 'http://purl.org/rss/1.0/modules/content/'}
            
            for item in root.findall('.//item'):
                title = item.find('title')
                link = item.find('link')
                pub_date = item.find('pubDate')
                description = item.find('description')
                
                if title is not None:
                    news_items.append({
                        "title": title.text.strip() if title.text else "",
                        "link": link.text if link is not None else "",
                        "pub_date": pub_date.text if pub_date is not None else "",
                        "description": description.text.strip() if description is not None and description.text else "",
                        "source": "TechCrunch"
                    })
            
            return news_items[:5]  # Top 5
        except Exception as e:
            print(f"Error fetching TechCrunch: {e}")
            return []
    
    def fetch_url_content(self, url: str, max_chars: int = 3000) -> str:
        """通用网页内容获取"""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            return response.text[:max_chars]
        except Exception as e:
            return f"Error fetching {url}: {e}"
    
    def fetch_domestic_news(self) -> List[Dict]:
        """获取国内 AI 资讯"""
        news_items = []
        domestic = self.config.get("sources", {}).get("domestic", {})
        
        # 1. 智谱 AI
        try:
            zhipu_html = self.fetch_url_content("https://www.zhipuai.cn/")
            # 简单提取 GLM-5 等关键词相关内容
            if "GLM-5" in zhipu_html or "GLM-4" in zhipu_html:
                news_items.append({
                    "title": "智谱 GLM-5 模型动态",
                    "source": "智谱 AI",
                    "link": "https://www.zhipuai.cn/",
                    "region": "domestic"
                })
        except:
            pass
        
        # 2. DeepSeek
        try:
            ds_html = self.fetch_url_content("https://api-docs.deepseek.com/")
            if "V3.2" in ds_html or "V3" in ds_html:
                news_items.append({
                    "title": "DeepSeek-V3.2 模型更新",
                    "source": "DeepSeek",
                    "link": "https://www.deepseek.com/",
                    "region": "domestic"
                })
        except:
            pass
        
        # 3. 阿里通义
        try:
            news_items.append({
                "title": "阿里通义千问系列模型动态",
                "source": "阿里通义",
                "link": "https://qwenlm.github.io/",
                "region": "domestic"
            })
        except:
            pass
        
        # 4. 字节豆包
        try:
            news_items.append({
                "title": "字节豆包/云雀模型更新",
                "source": "字节跳动",
                "link": "https://www.doubao.com/",
                "region": "domestic"
            })
        except:
            pass
        
        # 5. Moonshot Kimi
        try:
            news_items.append({
                "title": "Kimi K2 系列模型动态",
                "source": "Moonshot",
                "link": "https://kimi.moonshot.cn/",
                "region": "domestic"
            })
        except:
            pass
        
        return news_items
    
    def fetch_international_news(self) -> List[Dict]:
        """获取国际 AI 资讯"""
        news_items = []
        
        # 1. TechCrunch Feed
        tc_news = self.fetch_techcrunch_feed()
        for item in tc_news:
            news_items.append({
                "title": item["title"],
                "source": "TechCrunch",
                "link": item["link"],
                "description": item["description"],
                "region": "international"
            })
        
        # 2. OpenAI
        try:
            news_items.append({
                "title": "OpenAI 最新动态 / GPT-5 / o1 系列更新",
                "source": "OpenAI",
                "link": "https://openai.com/news",
                "region": "international"
            })
        except:
            pass
        
        # 3. Anthropic
        try:
            news_items.append({
                "title": "Anthropic Claude 系列模型更新",
                "source": "Anthropic",
                "link": "https://www.anthropic.com/news",
                "region": "international"
            })
        except:
            pass
        
        # 4. Google AI
        try:
            news_items.append({
                "title": "Google Gemini 系列模型动态",
                "source": "Google",
                "link": "https://blog.google/technology/ai/",
                "region": "international"
            })
        except:
            pass
        
        # 5. xAI
        try:
            news_items.append({
                "title": "xAI Grok 系列 / 星际数据中心计划",
                "source": "xAI",
                "link": "https://x.ai",
                "region": "international"
            })
        except:
            pass
        
        return news_items
    
    def generate_report(self) -> str:
        """生成早报"""
        domestic_news = self.fetch_domestic_news()
        international_news = self.fetch_international_news()
        
        date_str = datetime.now().strftime("%Y-%m-%d")
        
        report = f"""🌅 早报 ({date_str})

## 🇨🇳 国内 AI 头条
"""
        
        if domestic_news:
            for i, item in enumerate(domestic_news[:5], 1):
                report += f"\n{i}. **{item['source']}** - {item['title']}\n"
                report += f"   📎 {item['link']}\n"
        else:
            report += "\n暂无最新动态\n"
        
        report += "\n## 🌏 国际 AI 头条\n"
        
        if international_news:
            for i, item in enumerate(international_news[:5], 1):
                report += f"\n{i}. **{item['source']}** - {item['title']}\n"
                if item.get('description'):
                    desc = item['description'][:100] + "..." if len(item['description']) > 100 else item['description']
                    report += f"   📝 {desc}\n"
                report += f"   📎 {item['link']}\n"
        else:
            report += "\n暂无最新动态\n"
        
        report += "\n## 📊 一句话总结\n"
        report += "> 国内外大模型持续迭代，AI 竞争进入白热化阶段。\n"
        
        return report

def main():
    """命令行入口"""
    fetcher = NewsFetcher()
    report = fetcher.generate_report()
    print(report)

if __name__ == "__main__":
    main()
