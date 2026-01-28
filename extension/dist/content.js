// Content script for Bureaucracy Autopilot
// Uses the shared AutofillEngine for form detection and filling

// The AutofillEngine is injected via manifest.json content_scripts
// It exposes window.AutofillEngine with all the autofill functionality

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'FILL_PAGE') {
    handleFillPage(message.options || {}).then(sendResponse);
    return true; // Keep channel open for async response
  }

  if (message.action === 'ANALYZE_PAGE') {
    handleAnalyzePage().then(sendResponse);
    return true;
  }

  if (message.action === 'DEBUG_FIELD') {
    handleDebugField(message.selector).then(sendResponse);
    return true;
  }
});

/**
 * Handle FILL_PAGE request from popup
 */
async function handleFillPage(options = {}) {
  try {
    // Check if engine is available
    if (!window.AutofillEngine) {
      console.error('AutofillEngine not loaded');
      return { success: false, message: 'AutofillEngine not loaded' };
    }

    // Get enabled state and profile from storage
    const { enabled = false, profile = {}, autofillSettings = {} } = 
      await chrome.storage.local.get(['enabled', 'profile', 'autofillSettings']);
    
    if (!enabled) {
      return { success: false, message: 'Extension is disabled' };
    }

    // Merge settings
    const settings = {
      enabled: true,
      confidenceThreshold: options.confidenceThreshold || autofillSettings.confidenceThreshold || 50,
      highlightFilled: options.highlightFilled ?? autofillSettings.highlightFilled ?? true,
      dispatchEvents: options.dispatchEvents ?? autofillSettings.dispatchEvents ?? true,
      skipFilledFields: options.skipFilledFields ?? autofillSettings.skipFilledFields ?? true
    };

    // Run autofill
    const result = window.AutofillEngine.autofill(document, profile, settings);

    // Log results for debugging
    if (result.filledFields.length > 0) {
      console.log('[Bureaucracy Autopilot] Filled fields:', result.filledFields.map(f => ({
        fieldKey: f.fieldKey,
        confidence: f.confidence,
        matchedBy: f.matchedBy
      })));
    }

    if (result.skippedFields.length > 0) {
      console.log('[Bureaucracy Autopilot] Skipped fields:', result.skippedFields.map(f => ({
        reason: f.reason,
        details: f.details
      })));
    }

    return {
      success: result.success,
      message: result.message,
      filledCount: result.filledFields.length,
      skippedCount: result.skippedFields.length,
      totalInputs: result.totalInputs,
      // Include detailed results for popup UI
      filled: result.filledFields.map(f => ({
        fieldKey: f.fieldKey,
        confidence: f.confidence,
        matchedBy: f.matchedBy
      })),
      skipped: result.skippedFields.map(f => ({
        reason: f.reason,
        details: f.details
      }))
    };
  } catch (error) {
    console.error('[Bureaucracy Autopilot] Fill error:', error);
    return { success: false, message: 'An error occurred: ' + error.message };
  }
}

/**
 * Handle ANALYZE_PAGE request - analyze without filling
 */
async function handleAnalyzePage() {
  try {
    if (!window.AutofillEngine) {
      return { success: false, message: 'AutofillEngine not loaded' };
    }

    const { profile = {}, autofillSettings = {} } = 
      await chrome.storage.local.get(['profile', 'autofillSettings']);

    const threshold = autofillSettings.confidenceThreshold || 50;
    const analysis = window.AutofillEngine.analyzeForm(document, profile, threshold);

    return {
      success: true,
      matchedCount: analysis.matchedFields.length,
      unmatchedCount: analysis.unmatchedFields.length,
      blockedCount: analysis.blockedFields.length,
      matched: analysis.matchedFields.map(f => ({
        fieldKey: f.fieldKey,
        confidence: f.confidence,
        matchedBy: f.matchedBy,
        identifier: f.element.name || f.element.id || 'unknown'
      })),
      unmatched: analysis.unmatchedFields.map(f => ({
        identifier: f.identifier
      })),
      blocked: analysis.blockedFields.map(f => ({
        identifier: f.identifier
      }))
    };
  } catch (error) {
    console.error('[Bureaucracy Autopilot] Analyze error:', error);
    return { success: false, message: 'An error occurred: ' + error.message };
  }
}

/**
 * Handle DEBUG_FIELD request - get detailed match info for a specific field
 */
async function handleDebugField(selector) {
  try {
    if (!window.AutofillEngine) {
      return { success: false, message: 'AutofillEngine not loaded' };
    }

    const input = document.querySelector(selector);
    if (!input) {
      return { success: false, message: 'Field not found' };
    }

    const { profile = {} } = await chrome.storage.local.get(['profile']);
    const debug = window.AutofillEngine.debugFieldMatch(input, profile);

    return {
      success: true,
      ...debug
    };
  } catch (error) {
    console.error('[Bureaucracy Autopilot] Debug error:', error);
    return { success: false, message: 'An error occurred: ' + error.message };
  }
}

// Log that content script is loaded
console.log('[Bureaucracy Autopilot] Content script loaded');
