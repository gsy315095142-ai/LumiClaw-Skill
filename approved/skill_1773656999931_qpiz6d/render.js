const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Users\\31509\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new'
    });
    
    const page = await browser.newPage();
    
    // Set viewport for HD screenshot with high DPI
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 3  // Retina-like quality
    });
    
    // Load the HTML file
    const htmlPath = 'file:///C:/Users/31509/clawd/Project/运营复盘/宁波项目运营复盘.html';
    await page.goto(htmlPath, { waitUntil: 'networkidle0' });
    
    // Wait for all fonts to load
    await page.evaluate(async () => {
        await document.fonts.ready;
    });
    
    // Wait for images and external resources
    await new Promise(r => setTimeout(r, 3000));
    
    // Get the full page height
    const bodyHeight = await page.evaluate(() => {
        return document.body.scrollHeight;
    });
    
    // Set viewport to full page height
    await page.setViewport({
        width: 1920,
        height: bodyHeight,
        deviceScaleFactor: 3
    });
    
    // Additional wait for layout recalculation
    await new Promise(r => setTimeout(r, 2000));
    
    // Take full page screenshot
    const outputPath = 'C:/Users/31509/clawd/Project/运营复盘/宁波项目运营复盘.png';
    await page.screenshot({
        path: outputPath,
        fullPage: true
    });
    
    console.log('Screenshot saved to:', outputPath);
    console.log('Page height:', bodyHeight);
    await browser.close();
})();
