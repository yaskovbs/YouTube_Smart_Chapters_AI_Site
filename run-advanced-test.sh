#!/bin/bash

echo "===== YouTube Smart Chapters AI Advanced Extension Tester ====="
echo "This script will run the advanced test with detailed screenshots"
echo ""

# Run the regular test script with "advanced" parameter
./run-extension-test.sh advanced

if [ $? -ne 0 ]; then
    echo ""
    echo "Advanced test failed. Please see error message above."
    exit 1
fi

echo ""
echo "Advanced testing completed successfully!"
echo "Screenshots saved in the test-results directory."
echo ""
