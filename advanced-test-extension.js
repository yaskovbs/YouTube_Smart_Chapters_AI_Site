const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Get the absolute path to the extension directory
const extensionPath = path.resolve(__dirname, 'client', 'public');

// Main testing function with more detailed checks
async function testExtensionAdvanced() {
  console.log('Starting advanced extension test with Puppeteer...');
  console.log(`Loading extension from: ${extensionPath}`);
  
  // Create a directory for test results if it doesn't exist
  const resultsDir = path.join(__dirname, 'test-results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
  }

  try {
    // Launch browser with the extension loaded
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--window-size=1366,768'
      ],
      defaultViewport: {
        width: 1366,
        height: 768
      }
    });

    // Wait for extension to be loaded
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get all open pages
    const pages = await browser.pages();
    let page = pages[0];
    
    // Sometimes extensions open their own pages, close any extras
    if (pages.length > 1) {
      for (let i = 1; i < pages.length; i++) {
        await pages[i].close();
      }
    }
    
    // Navigate to a YouTube video
    const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    console.log(`Navigating to YouTube video: ${videoUrl}`);
    
    await page.goto(videoUrl, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // Wait for video player to be loaded
    console.log('Waiting for video player to load...');
    await page.waitForSelector('video', { timeout: 60000 });
    
    // Take screenshot of the initial page
    await page.screenshot({ 
      path: path.join(resultsDir, '01-youtube-page-loaded.png'),
      fullPage: true
    });
    
    console.log('Video loaded. Waiting for extension to initialize...');
    await page.waitForTimeout(5000);
    
    // ===== TEST 1: Check if extension icon is in Chrome toolbar =====
    console.log('\nTEST 1: Looking for extension in toolbar (indirect test)');
    // We can't directly access the Chrome UI with Puppeteer, but we can check if popup works
    
    // Take another screenshot after extension should be loaded
    await page.screenshot({ 
      path: path.join(resultsDir, '02-extension-loaded.png'),
      fullPage: true
    });
    
    // ===== TEST 2: Check if content script injects elements =====
    console.log('\nTEST 2: Checking for injected UI elements from contentScript.js');

    const injectedElements = await page.evaluate(() => {
      const results = {
        allButtons: [],
        extensionSpecificElements: false,
        youtubeControls: false,
        descriptionSection: false
      };
      
      // Get all buttons on the page - debug info
      document.querySelectorAll('button').forEach(btn => {
        if (btn.textContent) {
          results.allButtons.push(btn.textContent.trim());
        }
      });
      
      // Look for common YouTube elements to confirm we're on a video page
      results.youtubeControls = !!document.querySelector('#movie_player');
      results.descriptionSection = !!document.querySelector('#description');
      
      // Look for specific elements that our extension might inject
      // (These are guesses based on typical extension behavior - adjust as needed)
      const possibleSelectors = [
        '.youtube-smart-chapters-container',
        '.yt-smart-chapters-element',
        '[data-extension-id="youtube-smart-chapters"]',
        'button[data-extension="youtube-smart-chapters"]',
        // Add more selectors that might match elements your extension creates
      ];
      
      for (const selector of possibleSelectors) {
        if (document.querySelector(selector)) {
          results.extensionSpecificElements = true;
          break;
        }
      }
      
      return results;
    });
    
    console.log('YouTube player controls detected:', injectedElements.youtubeControls);
    console.log('YouTube description section detected:', injectedElements.descriptionSection);
    console.log('Extension-specific elements detected:', injectedElements.extensionSpecificElements);
    console.log('Found buttons on page:', injectedElements.allButtons.length);
    
    // Sample of buttons found (first 5)
    if (injectedElements.allButtons.length > 0) {
      console.log('Sample buttons:', injectedElements.allButtons.slice(0, 5));
    }
    
    // Take a screenshot
    await page.screenshot({ 
      path: path.join(resultsDir, '03-content-script-check.png'),
      fullPage: true
    });
    
    // ===== TEST 3: Attempt to interact with video controls =====
    console.log('\nTEST 3: Interacting with video page');
    
    try {
      // Scroll down to description
      await page.evaluate(() => {
        const descriptionSection = document.querySelector('#description');
        if (descriptionSection) {
          descriptionSection.scrollIntoView();
        }
      });
      
      await page.waitForTimeout(1000);
      
      // Take a screenshot of the description section
      await page.screenshot({ 
        path: path.join(resultsDir, '04-description-section.png'),
        fullPage: false
      });
      
      console.log('Successfully scrolled to video description');
    } catch (error) {
      console.error('Error interacting with video page:', error.message);
    }
    
    // ===== TEST 4: Check console logs for extension activity =====
    console.log('\nTEST 4: Checking console logs for extension activity');
    
    // Set up console log listener
    page.on('console', msg => {
      const text = msg.text();
      // Filter for logs that might come from our extension
      if (text.includes('extension') || 
          text.includes('chapters') || 
          text.includes('youtube')) {
        console.log('Extension console log:', text);
      }
    });
    
    // Wait a bit longer to gather console logs
    await page.waitForTimeout(5000);
    
    // ===== Summary =====
    console.log('\n===== Test Summary =====');
    console.log('- YouTube video page loaded successfully:', injectedElements.youtubeControls);
    console.log('- Extension specific elements detected:', injectedElements.extensionSpecificElements);
    console.log('- Screenshots saved to the test-results directory');
    
    console.log('\nBrowser will remain open for manual testing.');
    console.log('Press Ctrl+C in the terminal to close the browser when finished.');
    
    // Uncomment to close the browser automatically
    // await browser.close();
    
  } catch (error) {
    console.error('Error during testing:', error);
  }
}

// Run the test
testExtensionAdvanced();
