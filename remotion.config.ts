import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
// Heavy CSS filters/masks: give each frame time to settle.
Config.setDelayRenderTimeoutInMilliseconds(120000);
Config.setChromiumOpenGlRenderer('angle');

// Use a locally installed Chromium when Remotion's own headless shell can't be downloaded
// (e.g. sandboxed CI). Override with REMOTION_BROWSER=/path/to/chrome.
const localBrowser = process.env.REMOTION_BROWSER ?? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
import fs from 'node:fs';
if (fs.existsSync(localBrowser)) {
  Config.setBrowserExecutable(localBrowser);
}
