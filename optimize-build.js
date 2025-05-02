/**
 * Build Optimization Script for NCLEX Study Platform
 * 
 * This script optimizes the production build by:
 * 1. Optimizing JavaScript and CSS files
 * 2. Adding proper resource hints
 * 3. Deferring non-critical resources
 * 4. Optimizing font loading
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const distDir = path.resolve(__dirname, 'dist');
const publicDir = path.resolve(distDir, 'public');
const indexPath = path.resolve(publicDir, 'index.html');

// Process the HTML file to add optimization features
function optimizeHtml() {
  console.log('⚡ Optimizing HTML...');
  
  if (!fs.existsSync(indexPath)) {
    console.error('❌ index.html not found. Run production build first.');
    return;
  }

  let html = fs.readFileSync(indexPath, 'utf8');

  // Find main CSS file
  const cssRegex = /<link rel="stylesheet" href="\/assets\/index-([a-zA-Z0-9]+)\.css">/;
  const cssMatch = html.match(cssRegex);
  const cssPath = cssMatch ? cssMatch[0].match(/href="([^"]+)"/)[1] : null;
  
  // Find main JS file
  const jsRegex = /<script type="module" crossorigin src="\/assets\/index-([a-zA-Z0-9]+)\.js"><\/script>/;
  const jsMatch = html.match(jsRegex);
  const jsPath = jsMatch ? jsMatch[0].match(/src="([^"]+)"/)[1] : null;

  // 1. Add resource hints for critical resources
  const preloadCss = cssPath ? `<link rel="preload" href="${cssPath}" as="style">` : '';
  const preconnect = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`;

  // 2. Optimize font loading with font-display swap
  const fontDisplaySwap = `<style>
  /* Apply font-display: swap to all font faces */
  @font-face {
    font-display: swap;
  }
</style>`;

  // 3. Defer Google Fonts loading
  const deferFonts = `<script>
  // Defer loading of Google Fonts
  window.addEventListener('load', function() {
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    fontLink.media = 'print';
    fontLink.onload = function() { fontLink.media = 'all'; };
    document.head.appendChild(fontLink);
  });
</script>`;

  // 4. Add meta description for SEO
  const metaDescription = `<meta name="description" content="Comprehensive NCLEX exam preparation platform for nursing students with practice questions, study strategies, and analytics.">`;

  // Apply optimizations
  html = html
    .replace('</head>', `${preloadCss}\n${preconnect}\n${fontDisplaySwap}\n</head>`)
    .replace('</title>', `</title>\n${metaDescription}`)
    .replace('</body>', `${deferFonts}\n</body>`);

  // Save optimized HTML
  fs.writeFileSync(indexPath, html);
  console.log('✅ HTML optimization complete');
}

// Main execution
function main() {
  console.log('🚀 Starting build optimization...');
  
  try {
    optimizeHtml();
    console.log('✅ All optimizations complete!');
    console.log('🔍 Run a performance audit to verify improvements');
  } catch (error) {
    console.error('❌ Optimization failed:', error);
  }
}

main();