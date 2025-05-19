// Handle DOM content loaded events
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're in extension context
    if (typeof chrome === 'undefined' || !chrome.runtime) {
        document.querySelector('.non-react-ui').style.display = 'flex';
    }
    
    // After a short timeout, if root is empty, show the non-React UI
    setTimeout(function() {
        if (document.getElementById('root').childNodes.length === 0) {
            document.querySelector('.non-react-ui').style.display = 'flex';
        }
    }, 1000);
});
