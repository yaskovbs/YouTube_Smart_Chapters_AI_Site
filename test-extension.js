const puppeteer = require('puppeteer');
const path = require('path');

// Get the absolute path to the extension directory
const extensionPath = path.resolve(__dirname, 'client', 'public');

// Main testing function
async function testExtension() {
  console.log('Starting extension test with Puppeteer...');
  console.log(`Loading extension from: ${extensionPath}`);

  try {
    // Launch browser with the extension loaded
    const browser = await puppeteer.launch({
      headless: false, // Set to true for headless mode, false to see the browser
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ],
      defaultViewport: null // Use default viewport size
    });

    // Open a new page
    const page = await browser.newPage();
    
    // Navigate to a YouTube video page
    console.log('Navigating to YouTube video...');
    await page.goto('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
      waitUntil: 'networkidle2',
      timeout: 60000 // Increase timeout to 60 seconds
    });

    // Wait for video player to be loaded
    console.log('Waiting for video player to load...');
    await page.waitForSelector('video', { timeout: 60000 });
    
    // Check if video is playing
    console.log('Video loaded. Checking if extension is active...');
    
    // Wait a moment for extension to initialize
    // Using setTimeout with a promise as a replacement for waitForTimeout
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // You can add more specific checks here based on your extension's behavior
    // For example, you might look for elements your extension adds to the page:
    
    const extensionElementExists = await page.evaluate(() => {
      // Look for any elements that your extension might add to the page
      // This is a generic check, you'll need to adjust based on your extension
      const extensionButtons = document.querySelectorAll('button');
      
      // Log what buttons are found on the page
      console.log('Found buttons on page:');
      extensionButtons.forEach((btn, i) => {
        console.log(`Button ${i}: ${btn.textContent || 'No text'}`);
      });
      
      // Return true if there's any extension element detected
      return true;
    });
    
    if (extensionElementExists) {
      console.log('Extension appears to be working!');
    } else {
      console.log('Extension elements not detected');
    }

    // Example of interacting with the page
    console.log('Taking a screenshot...');
    await page.screenshot({ path: 'youtube-with-extension.png' });
    
    // Keep the browser open for manual inspection
    console.log('\nBrowser will remain open for manual testing.');
    console.log('Press Ctrl+C in the terminal to close the browser when finished.');
    
    // Uncomment the line below to close the browser automatically
    // await browser.close();
  } catch (error) {
    console.error('Error during testing:', error);
  }
}

// Run the test
testExtension();
