// Background service worker for Bureaucracy Autopilot

// Initialize default values on install
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // Set default values
    await chrome.storage.local.set({
      enabled: false,
      profile: {
        fullName: '',
        email: '',
        phone: '',
        addressLine1: '',
        city: '',
        state: '',
        zip: ''
      }
    });
    
    console.log('Bureaucracy Autopilot installed. Default settings initialized.');
  }
});

// Handle extension icon click (opens popup by default, but we can add context here)
chrome.action.onClicked.addListener((tab) => {
  // Popup handles this, but we could add logic here if needed
});

// Listen for messages from content scripts if needed
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'GET_STATE') {
    chrome.storage.local.get(['enabled', 'profile']).then(sendResponse);
    return true;
  }
});
