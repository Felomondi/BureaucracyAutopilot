// Popup script for Bureaucracy Autopilot

document.addEventListener('DOMContentLoaded', async () => {
  const enabledToggle = document.getElementById('enabled-toggle');
  const statusBadge = document.getElementById('status-badge');
  const fillBtn = document.getElementById('fill-btn');
  const fillStatus = document.getElementById('fill-status');

  // Load current state
  const { enabled = false } = await chrome.storage.local.get('enabled');
  updateUI(enabled);

  // Toggle handler
  enabledToggle.addEventListener('change', async (e) => {
    const enabled = e.target.checked;
    await chrome.storage.local.set({ enabled });
    updateUI(enabled);
  });

  // Fill button handler
  fillBtn.addEventListener('click', async () => {
    const { enabled = false } = await chrome.storage.local.get('enabled');
    
    if (!enabled) {
      showFillStatus('Enable autofill first', 'error');
      return;
    }

    try {
      // Get active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab?.id) {
        showFillStatus('No active tab found', 'error');
        return;
      }

      // Send message to content script
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'FILL_PAGE' });
      
      if (response?.success) {
        showFillStatus(`Filled ${response.filledCount} field(s)`, 'success');
      } else {
        showFillStatus(response?.message || 'No fields found', 'error');
      }
    } catch (error) {
      console.error('Fill error:', error);
      showFillStatus('Could not fill this page', 'error');
    }
  });

  function updateUI(enabled) {
    enabledToggle.checked = enabled;
    fillBtn.disabled = !enabled;
    
    if (enabled) {
      statusBadge.textContent = 'Enabled';
      statusBadge.className = 'status-badge status-enabled';
    } else {
      statusBadge.textContent = 'Disabled';
      statusBadge.className = 'status-badge status-disabled';
    }
  }

  function showFillStatus(message, type) {
    fillStatus.textContent = message;
    fillStatus.className = `fill-status ${type}`;
    
    setTimeout(() => {
      fillStatus.textContent = '';
      fillStatus.className = 'fill-status';
    }, 3000);
  }
});
