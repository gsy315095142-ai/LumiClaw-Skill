# SKILL: Local Video Analysis (Frames Extraction)

## Description
Analyze local video content by extracting frames and using vision models.
Activate when user asks to "watch", "describe", or "analyze" a local video file (mp4, etc.).

## Prerequisite: Runtime Dependencies & Install
This skill relies on local Node.js libraries to handle video processing without requiring a system-wide ffmpeg installation.

**First Run Setup:**
If `node_modules` is missing in the project folder, run:
```bash
npm install fluent-ffmpeg @ffmpeg-installer/ffmpeg @ffprobe-installer/ffmpeg
```

## Procedure (Step-by-Step)

### 1. Extraction Script
Create/Run a Node.js script to extract frames.
**Key Configuration:**
- Use `@ffmpeg-installer/ffmpeg` and `@ffprobe-installer/ffprobe` to provide binaries.
- Extract ~10 frames uniformly distributed (or use Scene Change Detection if advanced).
- Resize frames (e.g. `1280x?`) to keep token usage reasonable while maintaining HD detail.

**Template (`extract.js`):**
```javascript
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

// ... (Input/Output config) ...

ffmpeg(INPUT_VIDEO)
  .screenshots({
    count: 10,
    folder: OUTPUT_DIR,
    filename: 'thumb-%i.png',
    size: '1280x?'
  });
```

### 2. Vision Analysis
- Select 2-3 representative frames (e.g., thumb-3.png, thumb-7.png).
- Send to Vision Model (e.g. `openrouter/google/gemini-3-pro-image-preview`).
- **Prompt**: "Describe the scene, action, UI elements, and overall vibe."

### 3. Synthesis
- Summarize the findings into a cohesive report.
- Mention visual style, gameplay mechanics (if game), or key events.

## Limitations
- No audio analysis (currently vision only).
- No temporal continuity (can't detect "speed" exactly, only motion blur).
