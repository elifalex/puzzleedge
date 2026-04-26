const fs = require('fs');
const path = require('path');

// Path to the generated index.html
const indexPath = path.join(__dirname, '../dist/index.html');

// AdSense script to inject
const adsenseScript = `
    <!-- Google AdSense Verification & Setup -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6082551497006632"
         crossorigin="anonymous"></script>`;

try {
  // Read the generated HTML
  let html = fs.readFileSync(indexPath, 'utf8');

  // Check if AdSense script is already present
  if (html.includes('pagead2.googlesyndication.com')) {
    console.log('✓ AdSense script already present in HTML');
    process.exit(0);
  }

  // Inject the AdSense script right after the opening <head> tag
  html = html.replace('<head>', '<head>' + adsenseScript);

  // Write the modified HTML back
  fs.writeFileSync(indexPath, html, 'utf8');

  console.log('✓ Successfully injected AdSense script into dist/index.html');
} catch (error) {
  console.error('✗ Error injecting AdSense script:', error.message);
  process.exit(1);
}
