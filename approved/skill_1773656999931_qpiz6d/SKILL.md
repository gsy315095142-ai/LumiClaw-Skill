# SKILL: HTML to Image Conversion (Research)

## Description
Research and best practices for converting HTML pages to high-quality images.
Activate when user wants to snapshot/export webpages as images or fix blurry screenshots.

## Proven Solution: Puppeteer Core + Local Chrome
**Status:** ✅ **SUCCESS**
Achieved 4K/Retina quality by using a custom Node.js script with `puppeteer-core`.

### Why it works
- **DPI Control:** `deviceScaleFactor: 3` simulates a high-density display (Apple Retina-like), forcing the browser to render fonts and SVG/CSS shapes at 3x resolution.
- **Viewport:** Setting a fixed HD viewport (1920x1080) ensures desktop layout logic is triggered.
- **Full Page:** `fullPage: true` captures the entire scrollable area.

### Implementation Pattern (Plan C)
1.  **Install:** `npm install puppeteer-core` (lightweight, uses local Chrome).
2.  **Script (`render_hd.js`):**
    ```javascript
    const puppeteer = require('puppeteer-core');
    await puppeteer.launch({ executablePath: 'PATH_TO_EXISTING_CHROME' });
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 3 });
    await page.goto('file://...');
    await page.screenshot({ fullPage: true });
    ```
3.  **Result:** Crystal clear text and UI.

## Critical Issue: Partial Content Rendering (2026-02-11)
**Problem:** Screenshot missing sections (e.g., "第1次出差" content invisible while "第2次出差" showed up).

**Root Cause:** CSS layouts and web fonts need additional time to fully render after DOM is ready. `networkidle0` alone doesn't guarantee complete visual layout.

**Solution:** 
```javascript
// Wait for fonts to fully load
await page.evaluate(async () => {
    await document.fonts.ready;
});

// Wait for layout stabilization
await new Promise(r => setTimeout(r, 3000));

// Get actual page height and resize viewport
const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
await page.setViewport({ width: 1920, height: bodyHeight, deviceScaleFactor: 3 });

// Additional wait for layout recalculation
await new Promise(r => setTimeout(r, 2000));
```

**Key Insight:** `fullPage: true` only captures the viewport area. If viewport height is smaller than actual content, content gets cut off. Must manually set viewport to full content height before screenshot.

## Critical Issue: Correct Sequence for High-Resolution Capture ⭐ **2026-02-17**

**Problem:** Screenshots are blank or contain repeated partial content.

**Root Cause:** Incorrect operation sequence. If you wait first then scale up, the page reloads at the new scale but gets captured before content renders.

### Correct Sequence (MANDATORY)

```
Step 1: Set scale FIRST (e.g., deviceScaleFactor: 3)
    ↓
Step 2: Load the page
    ↓
Step 3: WAIT for content to render (CRITICAL!)
    ↓
Step 4: Take screenshot
```

**Wrong Sequence (❌ DO NOT DO THIS):**
```javascript
// ❌ BAD: Wait first, then scale
await page.goto(url);
await page.waitForTimeout(10000);  // Wait here is wasted!
await page.setViewport({ deviceScaleFactor: 3 });  // Page reloads!
await page.screenshot();  // Captures blank/reloading page
```

**Correct Sequence (✅ DO THIS):**
```javascript
// ✅ GOOD: Scale first, then wait, then capture
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080, deviceScaleFactor: 3 }  // Scale FIRST
});

await page.goto('file://...');

// Wait for content to render at the scaled resolution
await page.waitForTimeout(10000);  // WAIT after scaling!

await page.screenshot({ fullPage: true });
```

### Wait Time Guidelines

| Content Complexity | Recommended Wait Time | Example |
|-------------------|----------------------|---------|
| Simple pages | 3 seconds | Login forms, simple text pages |
| Medium complexity | 5-7 seconds | Dashboards, standard web pages |
| **Heavy content** | **10+ seconds** | **Long documentation, complex layouts** |
| With animations/fonts | +2-3 seconds extra | Pages with CSS animations, web fonts |

**Rule of Thumb:**
- If screenshot is blank → Increase wait time
- If content is cut off/repeated → Check viewport height and wait time
- When in doubt, wait longer (10-15s for complex pages)

### Real-World Example (2026-02-17)

**Scenario:** Capturing a 14,000px tall programming tutorial page.

**Failed Attempt:**
```javascript
await page.goto(url);
await page.waitForTimeout(3000);
await page.setViewport({ deviceScaleFactor: 3 });  // Too late!
// Result: Blank screenshot
```

**Successful Attempt:**
```javascript
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080, deviceScaleFactor: 3 }
});

await page.goto(url);
await page.waitForTimeout(10000);  // Wait 10s for heavy content

await page.screenshot({ fullPage: true });
// Result: Perfect full-page capture
```

## History (Failed Attempts)
- **Method A (Browser Tool):** Blurry because it defaults to `deviceScaleFactor: 1`. Good for functional testing, bad for marketing assets.
