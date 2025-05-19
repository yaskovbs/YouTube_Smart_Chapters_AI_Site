#!/bin/bash

echo "===== YouTube Smart Chapters AI Extension Tester ====="
echo "This script will test your Chrome extension using Puppeteer"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if puppeteer is specifically installed
echo "Checking if puppeteer is installed..."
if ! node -e "try { require.resolve('puppeteer'); console.log('Puppeteer is installed'); } catch(e) { console.log('Puppeteer is NOT installed'); process.exit(1); }" &> /dev/null; then
    echo "Installing puppeteer and other dependencies..."
    echo "This may take a minute or two..."
    npm install puppeteer path fs
    if [ $? -ne 0 ]; then
        echo "Error: Failed to install dependencies."
        exit 1
    fi
    echo "Dependencies installed successfully."
else
    echo "Puppeteer is already installed."
fi

echo ""
echo "Starting extension test..."
echo "A Chrome browser window will open with your extension loaded."
echo "The test will navigate to a YouTube video to check extension functionality."
echo "When finished, close the browser window or press Ctrl+C in this terminal."
echo ""

# Create test-results directory if using advanced test
if [[ "$1" == "advanced" ]]; then
    mkdir -p test-results
fi

# Run the test script
if [[ "$1" == "advanced" ]]; then
    node advanced-test-extension.js
else
    node test-extension.js
fi

# Check if test succeeded
if [ $? -ne 0 ]; then
    echo ""
    echo "Test failed. Please see error message above."
    exit 1
fi

echo ""
echo "Test completed successfully!"
echo "A screenshot was saved as youtube-with-extension.png"
if [[ "$1" == "advanced" ]]; then
    echo "Additional screenshots saved in the test-results directory."
fi
echo ""
