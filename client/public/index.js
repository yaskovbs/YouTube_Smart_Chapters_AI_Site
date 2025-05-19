// Popup script for YouTube Smart Chapters AI extension

document.addEventListener('DOMContentLoaded', function() {
  console.log('Extension popup loaded');
  
  // Get reference to the analyze button
  const analyzeButton = document.getElementById('analyzeCurrentVideo');
  
  // Add click event listener
  if (analyzeButton) {
    analyzeButton.addEventListener('click', function() {
      // Get the current active tab
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentTab = tabs[0];
        
        // Check if this is a YouTube video page
        if (currentTab && currentTab.url && currentTab.url.includes('youtube.com/watch')) {
          // Notify the user that analysis is starting
          analyzeButton.textContent = 'Analyzing...';
          analyzeButton.disabled = true;
          
          // Send message to background script to start processing
          chrome.runtime.sendMessage(
            { 
              type: 'PROCESS_YOUTUBE_VIDEO',
              videoId: new URL(currentTab.url).searchParams.get('v'),
              url: currentTab.url
            }, 
            function(response) {
              if (response && response.success) {
                analyzeButton.textContent = 'Processing Started!';
                
                // Display notification that processing has started
                setTimeout(() => {
                  analyzeButton.textContent = 'Analyze Current Video';
                  analyzeButton.disabled = false;
                }, 3000);
              } else {
                analyzeButton.textContent = 'Error - Try Again';
                analyzeButton.disabled = false;
              }
            }
          );
        } else {
          // If not on a YouTube video page
          analyzeButton.textContent = 'Not a YouTube Video';
          setTimeout(() => {
            analyzeButton.textContent = 'Analyze Current Video';
          }, 2000);
        }
      });
    });
  }
  
  // Check if there's an active processing job and update UI accordingly
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    if (currentTab && currentTab.url && currentTab.url.includes('youtube.com/watch')) {
      const videoId = new URL(currentTab.url).searchParams.get('v');
      
      // Check status with background script
      chrome.runtime.sendMessage(
        { 
          type: 'GET_PROCESSING_STATUS',
          videoId: videoId
        }, 
        function(response) {
          if (response && response.success && response.status) {
            if (response.status.status === 'processing') {
              analyzeButton.textContent = 'Processing...';
              analyzeButton.disabled = true;
            } else if (response.status.status === 'completed') {
              analyzeButton.textContent = 'View Results';
              // Could add code here to immediately display results
            }
          }
        }
      );
    }
  });
});
