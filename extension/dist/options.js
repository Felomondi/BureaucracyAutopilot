// Options/Settings script for Bureaucracy Autopilot

const DEFAULT_PROFILE = {
  fullName: '',
  email: '',
  phone: '',
  addressLine1: '',
  city: '',
  state: '',
  zip: ''
};

const PROFILE_FIELDS = ['fullName', 'email', 'phone', 'addressLine1', 'city', 'state', 'zip'];

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('profile-form');
  const resetBtn = document.getElementById('reset-btn');
  const saveStatus = document.getElementById('save-status');

  // Load saved profile
  await loadProfile();

  // Save handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const profile = {};
    PROFILE_FIELDS.forEach(field => {
      profile[field] = document.getElementById(field).value.trim();
    });

    try {
      await chrome.storage.local.set({ profile });
      showStatus('Profile saved successfully!', 'success');
    } catch (error) {
      console.error('Save error:', error);
      showStatus('Failed to save profile', 'error');
    }
  });

  // Reset handler
  resetBtn.addEventListener('click', async () => {
    if (confirm('Reset profile to defaults? This will clear all saved data.')) {
      try {
        await chrome.storage.local.set({ profile: DEFAULT_PROFILE });
        populateForm(DEFAULT_PROFILE);
        showStatus('Profile reset to defaults', 'success');
      } catch (error) {
        console.error('Reset error:', error);
        showStatus('Failed to reset profile', 'error');
      }
    }
  });

  async function loadProfile() {
    try {
      const { profile = DEFAULT_PROFILE } = await chrome.storage.local.get('profile');
      populateForm(profile);
    } catch (error) {
      console.error('Load error:', error);
      populateForm(DEFAULT_PROFILE);
    }
  }

  function populateForm(profile) {
    PROFILE_FIELDS.forEach(field => {
      const input = document.getElementById(field);
      if (input) {
        input.value = profile[field] || '';
      }
    });
  }

  function showStatus(message, type) {
    saveStatus.textContent = message;
    saveStatus.className = `save-status ${type}`;
    
    setTimeout(() => {
      saveStatus.textContent = '';
      saveStatus.className = 'save-status';
    }, 3000);
  }
});
