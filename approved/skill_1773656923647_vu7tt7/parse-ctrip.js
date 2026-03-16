/**
 * 解析携程酒店详情页文本，提取关键字段
 * @param {string} text - web_fetch 返回的文本内容
 * @returns {object} 提取的酒店信息
 */
function parseCtripHotelData(text) {
  const result = {
    address: '',
    brand: '',
    totalRooms: 0,
    hasFamilyRoom: false,
    familyRoomCount: 0
  };

  // 提取地址 - 从酒店简介中查找位置描述
  const addressPatterns = [
    /位于[：:]?\s*([^，。]+)/,
    /地址[：:]?\s*([^，。]+)/,
    /地处[：:]?\s*([^，。]+)/,
    /坐落于[：:]?\s*([^，。]+)/
  ];
  
  for (const pattern of addressPatterns) {
    const match = text.match(pattern);
    if (match) {
      result.address = match[1].trim();
      break;
    }
  }

  // 提取总房数
  const roomPatterns = [
    /客房数[：:]\s*(\d+)/,
    /(\d+)\s*间客房/,
    /拥有\s*(\d+)\s*间/,
    /共\s*(\d+)\s*间客房/
  ];
  
  for (const pattern of roomPatterns) {
    const match = text.match(pattern);
    if (match) {
      result.totalRooms = parseInt(match[1]);
      break;
    }
  }

  // 检测是否有亲子房
  const familyKeywords = ['亲子', '家庭房', '儿童', 'kids', 'family'];
  result.hasFamilyRoom = familyKeywords.some(kw => 
    text.toLowerCase().includes(kw.toLowerCase())
  );

  return result;
}

/**
 * 从酒店名称中提取品牌
 * @param {string} hotelName - 酒店全称
 * @returns {string} 品牌名称
 */
function extractBrandFromName(hotelName) {
  const brandMappings = {
    '香格里拉': '香格里拉',
    '洲际': '洲际酒店',
    '万豪': '万豪酒店',
    '希尔顿': '希尔顿',
    '喜来登': '喜来登',
    '凯悦': '凯悦',
    '威斯汀': '威斯汀',
    '皇冠假日': '皇冠假日',
    '假日酒店': '假日酒店',
    '丽思卡尔顿': '丽思卡尔顿',
    '四季': '四季酒店',
    '柏悦': '柏悦',
    '君悦': '君悦',
    '康莱德': '康莱德',
    '艾美': '艾美',
    '万丽': '万丽',
    'JW万豪': 'JW万豪',
    'W酒店': 'W酒店',
    '瑞吉': '瑞吉',
    '宝格丽': '宝格丽',
    '安缦': '安缦',
    '文华东方': '文华东方',
    '半岛': '半岛酒店',
    '瑰丽': '瑰丽酒店',
    '丽晶': '丽晶酒店',
    '悦榕庄': '悦榕庄',
    '费尔蒙': '费尔蒙',
    '莱佛士': '莱佛士',
    '索菲特': '索菲特',
    '铂尔曼': '铂尔曼',
    '美爵': '美爵',
    '诺富特': '诺富特',
    '宜必思': '宜必思',
    '全季': '全季',
    '亚朵': '亚朵',
    '桔子': '桔子酒店',
    '如家': '如家',
    '汉庭': '汉庭',
    '7天': '7天酒店',
    '锦江': '锦江',
    '维也纳': '维也纳'
  };

  for (const [keyword, brand] of Object.entries(brandMappings)) {
    if (hotelName.includes(keyword)) {
      return brand;
    }
  }
  
  return '';
}

/**
 * 格式化地址，确保包含省份
 * @param {string} address - 原始地址
 * @param {string} province - 省份名称
 * @returns {string} 格式化后的地址
 */
function formatAddress(address, province) {
  // 如果地址已包含省份，直接返回
  if (address.includes('省') || address.includes(province)) {
    return address;
  }
  
  // 否则在前面加上省份
  return `${province}${address}`;
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    parseCtripHotelData,
    extractBrandFromName,
    formatAddress
  };
}
