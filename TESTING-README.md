# Testing YouTube Smart Chapters AI Extension

This folder contains tools for testing the YouTube Smart Chapters AI Chrome extension using Puppeteer, which allows automated browser testing without relying on the Chrome Web Store.

## What is Puppeteer?

[Puppeteer](https://pptr.dev/) is a Node.js library that provides a high-level API to control Chrome/Chromium over the DevTools Protocol. It allows you to:

- Launch a Chrome browser with your extension loaded
- Navigate to websites and interact with them
- Take screenshots and generate PDFs
- Automate form submission, UI testing, keyboard input, etc.

## Test Files

I've created the following files to help you test your extension:

1. **test-extension.js**: A basic Puppeteer script that loads your extension and navigates to a YouTube video
2. **advanced-test-extension.js**: A more detailed test script that creates screenshots and checks for specific elements
3. **run-extension-test.bat**: Windows batch file to run the tests
4. **run-extension-test.sh**: Shell script for Linux/Mac to run the tests
5. **test-package.json**: NPM package configuration for the testing tools

## Running the Tests

### On Windows:

1. Simply double-click `run-extension-test.bat`
2. This will:
   - Install Puppeteer and other dependencies if needed
   - Launch Chrome with your extension loaded
   - Navigate to a YouTube video
   - Take a screenshot
   - Leave the browser open for manual testing

### On Linux/Mac:

1. Make the script executable:
   ```bash
   chmod +x run-extension-test.sh
   ```

2. Run the script:
   ```bash
   ./run-extension-test.sh
   ```

## Advanced Testing

For more detailed testing:

```bash
node advanced-test-extension.js
```

This script:
- Creates a `test-results` directory with multiple screenshots
- Checks if your extension injects elements into the YouTube page
- Reports on extension activity
- Displays more detailed debug information

## Interpreting Results

After running the tests, you'll see:

1. A Chrome window showing a YouTube video with your extension loaded
2. Terminal output indicating if the extension was detected
3. Screenshots saved to your project folder (or the `test-results` folder for advanced tests)

This allows you to verify that:
- Your extension loads properly
- Content scripts run on YouTube pages
- Any UI elements are correctly injected
- The extension behaves as expected

## Customizing Tests

You can edit `test-extension.js` or `advanced-test-extension.js` to test specific behaviors of your extension:

- Change the YouTube video URL
- Add checks for specific elements your extension creates
- Simulate user interactions with your extension's UI
- Test different extension features

## Troubleshooting

If you encounter issues:

1. **Extension not loading**: Make sure the path in the scripts points to your correct extension folder (client/public)
2. **Missing dependencies**: Run `npm install puppeteer path fs` manually
3. **Browser crashes**: Try running with different Puppeteer launch options (see script comments)
4. **Test timeouts**: Increase the timeout values in the test scripts

This testing approach lets you test your extension thoroughly before submitting it to the Chrome Web Store.
