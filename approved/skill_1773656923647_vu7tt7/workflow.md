# 酒店信息自动填充 - 详细工作流程

## 完整代码示例

### 步骤1：连接浏览器并读取酒店信息

```javascript
// 获取 Chrome Extension 连接的标签页
const tabs = await browser({ action: "tabs", profile: "chrome" });
const targetId = tabs[0].targetId; // 项目系统页面

// 获取页面快照
const snapshot = await browser({ 
  action: "snapshot", 
  targetId, 
  refs: "aria" 
});
```

### 步骤2：进入酒店编辑页面

```javascript
// 点击"查看/编辑植物信息"按钮
await browser({
  action: "act",
  targetId,
  request: { kind: "click", ref: "e590" } // 根据实际情况调整ref
});
```

### 步骤3：读取携程链接

从页面快照中找到携程链接字段的textbox，提取URL。

### 步骤4：抓取携程数据

```javascript
// 使用 web_fetch 抓取酒店详情
const hotelData = await web_fetch({
  url: "https://hotels.ctrip.com/hotels/detail/?hotelId=9118583",
  extractMode: "markdown",
  maxChars: 15000
});
```

### 步骤5：解析关键字段

```javascript
// 从抓取的内容中提取信息
const extracted = {
  address: extractAddress(hotelData.text),      // 从简介中提取
  brand: extractBrand(hotelData.text),          // 从名称或品牌信息提取
  totalRooms: extractRoomCount(hotelData.text), // 提取"客房数：325"
  hasFamilyRoom: checkFamilyRoom(hotelData.text) // 检查是否有亲子房关键词
};
```

**解析规则：**
- **地址**：搜索关键词"位于"、"地址"、"地处"后面的内容
- **品牌**：从酒店名称提取（如"香格里拉"、"洲际"）
- **总房数**：搜索"客房数"后面的数字
- **亲子房**：搜索"亲子"、"家庭"、"儿童"等关键词

### 步骤6：填写回项目系统

```javascript
// 填写客户地址
await browser({
  action: "act",
  targetId,
  request: { 
    kind: "type", 
    ref: "e785",  // 地址字段的ref
    text: extracted.address 
  }
});

// 填写品牌方
await browser({
  action: "act",
  targetId,
  request: { 
    kind: "type", 
    ref: "e792",  // 品牌方字段的ref
    text: extracted.brand 
  }
});

// 填写总房数
await browser({
  action: "act",
  targetId,
  request: { 
    kind: "type", 
    ref: "e796",  // 总房数字段的ref
    text: extracted.totalRooms.toString() 
  }
});

// 业主方（通常不公开）
await browser({
  action: "act",
  targetId,
  request: { 
    kind: "type", 
    ref: "e789",  // 业主方字段的ref
    text: "未公开" 
  }
});
```

### 步骤7：保存修改

```javascript
// 点击保存按钮
await browser({
  action: "act",
  targetId,
  request: { kind: "click", ref: "e879" }  // 保存按钮的ref
});
```

## 批量处理模式

```javascript
// 1. 获取所有酒店列表
const hotels = await getHotelList();

// 2. 筛选需要处理的酒店
const needProcessing = hotels.filter(h => 
  h.ctripLink && // 有携程链接
  (!h.address || !h.brand || !h.totalRooms) // 关键字段为空
);

// 3. 逐个处理
for (const hotel of needProcessing) {
  try {
    const data = await scrapeCtrip(hotel.ctripLink);
    await fillHotelInfo(hotel.id, data);
    console.log(`✅ ${hotel.name} 处理完成`);
  } catch (err) {
    console.error(`❌ ${hotel.name} 处理失败: ${err.message}`);
  }
}
```

## 常见问题处理

### Q1: web_fetch 返回内容为空？
- 检查链接是否有效
- 增加 `maxChars` 参数值
- 确认链接不需要登录态（直接使用酒店详情页链接）

### Q2: 解析不到某些字段？
- 不同酒店页面结构可能不同
- 检查是否有反爬机制（如验证码）
- 考虑使用更通用的正则表达式匹配

### Q3: Browser Relay 连接断开？
- 确保页面已手动 attach
- 避免在操作过程中刷新页面
- 如断开，需要重新获取 targetId

## 数据质量检查清单

- [ ] 地址是否包含省份和城市？
- [ ] 品牌方是否为常见酒店品牌？
- [ ] 总房数是否在合理范围（20-1000）？
- [ ] 亲子房数量是否需要人工核实？
- [ ] 是否有字段被意外覆盖？
