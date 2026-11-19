const DARK_CSS = `
  html {
    filter: invert(0.92) hue-rotate(180deg) !important;
    background-color: #111 !important;
  }
  img, video, picture, canvas, [style*="background-image"] {
    filter: invert(1) hue-rotate(180deg) !important;
  }
`;

const LIGHT_CSS = `
  html {
    filter: none !important;
    background-color: #ffffff !important;
  }
  body, div, section, article, main, header, footer, nav, aside {
    background-color: #ffffff !important;
    color: #0f172a !important;
  }
  a {
    color: #1d4ed8 !important;
  }
  img, video, picture, canvas {
    filter: none !important;
  }
`;

async function applyTheme(mode) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [mode, DARK_CSS, LIGHT_CSS],
    func: (selectedMode, darkRules, lightRules) => {
      const styleId = "surface-shift-theme";
      let styleEl = document.getElementById(styleId);

      // Remove existing override if resetting
      if (selectedMode === "reset") {
        if (styleEl) styleEl.remove();
        return;
      }

      // Create the <style> tag if it doesn't exist yet
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }

      styleEl.textContent = selectedMode === "dark" ? darkRules : lightRules;
    }
  });
}

document.getElementById("darkBtn").addEventListener("click", () => applyTheme("dark"));
document.getElementById("lightBtn").addEventListener("click", () => applyTheme("light"));
document.getElementById("resetBtn").addEventListener("click", () => applyTheme("reset"));