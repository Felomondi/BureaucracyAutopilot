/**
 * Autofill Engine for Bureaucracy Autopilot
 * 
 * A shared engine that handles form field detection, matching, and filling.
 * Used by both the content script and the lab/test environments.
 */

// ============================================================================
// Constants
// ============================================================================

const FIELD_PATTERNS = {
  fullName: {
    names: ['name', 'full_name', 'fullname', 'full-name', 'your_name', 'your-name', 'yourname', 'complete_name'],
    labels: ['full name', 'name', 'your name', 'complete name'],
    placeholders: ['full name', 'name', 'your name', 'enter your name', 'enter name', 'john doe']
  },
  firstName: {
    names: ['first_name', 'firstname', 'first-name', 'fname', 'given_name', 'givenname', 'first'],
    labels: ['first name', 'given name', 'first'],
    placeholders: ['first name', 'given name', 'john']
  },
  lastName: {
    names: ['last_name', 'lastname', 'last-name', 'lname', 'surname', 'family_name', 'familyname', 'last'],
    labels: ['last name', 'surname', 'family name', 'last'],
    placeholders: ['last name', 'surname', 'family name', 'doe']
  },
  email: {
    names: ['email', 'e-mail', 'email_address', 'emailaddress', 'user_email', 'useremail', 'mail'],
    labels: ['email', 'e-mail', 'email address', 'your email'],
    placeholders: ['email', 'e-mail', 'your email', 'email address', 'user@example.com'],
    types: ['email']
  },
  phone: {
    names: ['phone', 'telephone', 'tel', 'phone_number', 'phonenumber', 'mobile', 'cell', 'phone_no'],
    labels: ['phone', 'telephone', 'phone number', 'mobile', 'cell', 'contact number'],
    placeholders: ['phone', 'telephone', 'phone number', 'mobile number', '(555) 123-4567'],
    types: ['tel']
  },
  addressLine1: {
    names: ['address', 'address1', 'address_1', 'address-1', 'street', 'street_address', 'addressline1', 'street1'],
    labels: ['address', 'street address', 'address line 1', 'address 1', 'street'],
    placeholders: ['address', 'street address', 'address line 1', '123 main st', 'street address']
  },
  city: {
    names: ['city', 'town', 'locality', 'city_name'],
    labels: ['city', 'town', 'city/town'],
    placeholders: ['city', 'town', 'san francisco', 'new york']
  },
  state: {
    names: ['state', 'province', 'region', 'state_province', 'state_code'],
    labels: ['state', 'province', 'state/province', 'region'],
    placeholders: ['state', 'province', 'ca', 'ny', 'california']
  },
  zip: {
    names: ['zip', 'zipcode', 'zip_code', 'postal', 'postal_code', 'postalcode', 'postcode'],
    labels: ['zip', 'zip code', 'postal code', 'postcode'],
    placeholders: ['zip', 'zip code', 'postal code', '12345', '90210']
  },
  country: {
    names: ['country', 'country_code', 'nation'],
    labels: ['country', 'nation'],
    placeholders: ['country', 'united states', 'usa']
  },
  currentEmployer: {
    names: ['employer', 'company', 'company_name', 'organization', 'org', 'current_employer', 'employer_name'],
    labels: ['employer', 'company', 'organization', 'current employer', 'company name'],
    placeholders: ['employer', 'company name', 'organization', 'acme inc']
  },
  jobTitle: {
    names: ['job_title', 'jobtitle', 'title', 'position', 'role', 'job_position', 'occupation'],
    labels: ['job title', 'title', 'position', 'role', 'occupation'],
    placeholders: ['job title', 'position', 'software engineer', 'manager']
  },
  workEmail: {
    names: ['work_email', 'workemail', 'business_email', 'professional_email', 'office_email'],
    labels: ['work email', 'business email', 'professional email'],
    placeholders: ['work email', 'business email', 'john@company.com']
  },
  schoolName: {
    names: ['school', 'university', 'college', 'institution', 'school_name', 'university_name', 'alma_mater'],
    labels: ['school', 'university', 'college', 'institution', 'school name'],
    placeholders: ['school', 'university name', 'harvard university']
  },
  degree: {
    names: ['degree', 'qualification', 'education_level', 'highest_degree'],
    labels: ['degree', 'qualification', 'education level', 'highest degree'],
    placeholders: ['degree', 'bachelor', 'master', 'phd']
  }
};

// Fields to NEVER fill (security sensitive)
const BLOCKED_PATTERNS = [
  'password', 'pass', 'pwd', 'secret', 'passwd',
  'ssn', 'social_security', 'socialsecurity', 'social-security',
  'credit_card', 'creditcard', 'card_number', 'cardnumber', 'cc_number',
  'cvv', 'cvc', 'security_code', 'securitycode', 'card_security',
  'account_number', 'accountnumber', 'routing', 'routing_number',
  'pin', 'token', 'auth', 'api_key', 'apikey',
  'bank_account', 'bankaccount', 'iban', 'swift'
];

// Confidence scores for different match types
const CONFIDENCE_SCORES = {
  name_exact: 95,
  name_partial: 80,
  id_exact: 90,
  id_partial: 75,
  autocomplete: 100,
  type: 85,
  label_exact: 70,
  label_partial: 55,
  placeholder_exact: 60,
  placeholder_partial: 45
};

const DEFAULT_SETTINGS = {
  enabled: true,
  confidenceThreshold: 50,
  highlightFilled: true,
  dispatchEvents: true,
  skipFilledFields: true
};

// ============================================================================
// Core Engine
// ============================================================================

/**
 * Main autofill function - scans DOM and fills matching fields
 * @param {Document|Element} root - DOM root to scan
 * @param {Object} profile - Profile data
 * @param {Object} settings - Autofill settings
 * @returns {Object} AutofillResult
 */
function autofill(root, profile, settings = {}) {
  const config = { ...DEFAULT_SETTINGS, ...settings };
  
  const filledFields = [];
  const skippedFields = [];

  // Early exit if disabled
  if (!config.enabled) {
    return {
      success: false,
      filledFields,
      skippedFields,
      totalInputs: 0,
      message: 'Extension is disabled'
    };
  }

  // Check if profile has any data
  const hasProfileData = Object.values(profile || {}).some(v => v && String(v).trim());
  if (!hasProfileData) {
    return {
      success: false,
      filledFields,
      skippedFields,
      totalInputs: 0,
      message: 'No profile data. Configure in Settings.'
    };
  }

  // Find all inputs
  const inputs = root.querySelectorAll('input, textarea');
  const totalInputs = inputs.length;

  inputs.forEach(input => {
    const skipReason = shouldSkipField(input, config);
    
    if (skipReason) {
      skippedFields.push({
        element: input,
        reason: skipReason,
        details: getSkipDetails(input, skipReason)
      });
      return;
    }

    // Try to match field
    const match = matchField(input, profile, config.confidenceThreshold);
    
    if (!match) {
      skippedFields.push({
        element: input,
        reason: 'no_match',
        details: `No pattern matched for ${getFieldIdentifier(input)}`
      });
      return;
    }

    if (match.confidence < config.confidenceThreshold) {
      skippedFields.push({
        element: input,
        reason: 'low_confidence',
        details: `Confidence ${match.confidence}% < threshold ${config.confidenceThreshold}%`
      });
      return;
    }

    if (!match.profileValue) {
      skippedFields.push({
        element: input,
        reason: 'no_profile_value',
        details: `No profile value for ${match.fieldKey}`
      });
      return;
    }

    // Fill the field
    fillInput(input, match.profileValue, config);

    filledFields.push({
      element: input,
      fieldKey: match.fieldKey,
      value: match.profileValue,
      confidence: match.confidence,
      matchedBy: match.matchedBy
    });
  });

  const success = filledFields.length > 0;
  let message;
  
  if (filledFields.length === 0) {
    message = 'No matching fields found';
  } else {
    message = `Filled ${filledFields.length} field${filledFields.length !== 1 ? 's' : ''}`;
  }

  return {
    success,
    filledFields,
    skippedFields,
    totalInputs,
    message
  };
}

// ============================================================================
// Field Analysis
// ============================================================================

/**
 * Determine if a field should be skipped
 */
function shouldSkipField(input, settings) {
  // Hidden fields
  if (input.type === 'hidden') {
    return 'hidden';
  }

  // Disabled or readonly
  if (input.disabled) {
    return 'disabled';
  }
  
  if (input.readOnly) {
    return 'readonly';
  }

  // Already filled (if setting enabled)
  if (settings.skipFilledFields && input.value && input.value.trim() !== '') {
    return 'already_filled';
  }

  // Blocked field types
  if (isBlockedField(input)) {
    return 'blocked_field';
  }

  // Invalid input types
  const validTypes = ['text', 'email', 'tel', 'url', 'search', ''];
  if (input.tagName === 'INPUT' && !validTypes.includes(input.type)) {
    return 'invalid_type';
  }

  return null;
}

/**
 * Check if field is in the blocked list (security)
 */
function isBlockedField(input) {
  const name = (input.name || '').toLowerCase();
  const id = (input.id || '').toLowerCase();
  const type = (input.type || '').toLowerCase();
  const autocomplete = (input.autocomplete || '').toLowerCase();

  // Password type is always blocked
  if (type === 'password') return true;

  // Check against blocked patterns
  const combined = `${name} ${id} ${autocomplete}`;
  return BLOCKED_PATTERNS.some(pattern => combined.includes(pattern));
}

/**
 * Try to match a field to a profile key with confidence scoring
 */
function matchField(input, profile, minConfidence = 0) {
  const name = (input.name || '').toLowerCase();
  const id = (input.id || '').toLowerCase();
  const type = (input.type || '').toLowerCase();
  const placeholder = (input.placeholder || '').toLowerCase();
  const label = getFieldLabel(input).toLowerCase();
  const autocomplete = (input.autocomplete || '').toLowerCase();

  let bestMatch = null;

  for (const [fieldKey, patterns] of Object.entries(FIELD_PATTERNS)) {
    let profileValue = getProfileValue(fieldKey, profile);
    
    if (!profileValue) continue;

    // Check autocomplete attribute (highest confidence)
    if (autocomplete) {
      const autocompleteMap = {
        'name': 'fullName',
        'given-name': 'firstName',
        'family-name': 'lastName',
        'email': 'email',
        'tel': 'phone',
        'street-address': 'addressLine1',
        'address-line1': 'addressLine1',
        'address-level2': 'city',
        'address-level1': 'state',
        'postal-code': 'zip',
        'country': 'country',
        'organization': 'currentEmployer',
        'organization-title': 'jobTitle'
      };
      
      if (autocompleteMap[autocomplete] === fieldKey) {
        const confidence = CONFIDENCE_SCORES.autocomplete;
        if (confidence >= minConfidence && (!bestMatch || confidence > bestMatch.confidence)) {
          bestMatch = {
            fieldKey,
            profileValue,
            confidence,
            matchedBy: 'autocomplete',
            matchedPattern: autocomplete
          };
        }
      }
    }

    // Check name/id matches
    if (patterns.names) {
      for (const pattern of patterns.names) {
        // Exact match
        if (name === pattern || id === pattern) {
          const confidence = name === pattern ? CONFIDENCE_SCORES.name_exact : CONFIDENCE_SCORES.id_exact;
          if (confidence >= minConfidence && (!bestMatch || confidence > bestMatch.confidence)) {
            bestMatch = {
              fieldKey,
              profileValue,
              confidence,
              matchedBy: name === pattern ? 'name' : 'id',
              matchedPattern: pattern
            };
          }
        }
        // Partial match
        else if (name.includes(pattern) || id.includes(pattern)) {
          const confidence = name.includes(pattern) ? CONFIDENCE_SCORES.name_partial : CONFIDENCE_SCORES.id_partial;
          if (confidence >= minConfidence && (!bestMatch || confidence > bestMatch.confidence)) {
            bestMatch = {
              fieldKey,
              profileValue,
              confidence,
              matchedBy: name.includes(pattern) ? 'name' : 'id',
              matchedPattern: pattern
            };
          }
        }
      }
    }

    // Check type matches
    if (patterns.types && patterns.types.includes(type)) {
      const confidence = CONFIDENCE_SCORES.type;
      if (confidence >= minConfidence && (!bestMatch || confidence > bestMatch.confidence)) {
        bestMatch = {
          fieldKey,
          profileValue,
          confidence,
          matchedBy: 'type',
          matchedPattern: type
        };
      }
    }

    // Check label matches
    if (patterns.labels) {
      for (const pattern of patterns.labels) {
        if (label === pattern) {
          const confidence = CONFIDENCE_SCORES.label_exact;
          if (confidence >= minConfidence && (!bestMatch || confidence > bestMatch.confidence)) {
            bestMatch = {
              fieldKey,
              profileValue,
              confidence,
              matchedBy: 'label',
              matchedPattern: pattern
            };
          }
        } else if (label.includes(pattern)) {
          const confidence = CONFIDENCE_SCORES.label_partial;
          if (confidence >= minConfidence && (!bestMatch || confidence > bestMatch.confidence)) {
            bestMatch = {
              fieldKey,
              profileValue,
              confidence,
              matchedBy: 'label',
              matchedPattern: pattern
            };
          }
        }
      }
    }

    // Check placeholder matches
    if (patterns.placeholders) {
      for (const pattern of patterns.placeholders) {
        if (placeholder === pattern) {
          const confidence = CONFIDENCE_SCORES.placeholder_exact;
          if (confidence >= minConfidence && (!bestMatch || confidence > bestMatch.confidence)) {
            bestMatch = {
              fieldKey,
              profileValue,
              confidence,
              matchedBy: 'placeholder',
              matchedPattern: pattern
            };
          }
        } else if (placeholder.includes(pattern)) {
          const confidence = CONFIDENCE_SCORES.placeholder_partial;
          if (confidence >= minConfidence && (!bestMatch || confidence > bestMatch.confidence)) {
            bestMatch = {
              fieldKey,
              profileValue,
              confidence,
              matchedBy: 'placeholder',
              matchedPattern: pattern
            };
          }
        }
      }
    }
  }

  return bestMatch;
}

/**
 * Get the profile value for a field key, handling derived values and multi-entry modules
 */
function getProfileValue(fieldKey, profile) {
  let value = profile[fieldKey];

  // Handle first/last name derived from fullName
  if (fieldKey === 'firstName' && !value && profile.fullName) {
    const parts = profile.fullName.trim().split(/\s+/);
    value = parts[0] || '';
  }
  
  if (fieldKey === 'lastName' && !value && profile.fullName) {
    const parts = profile.fullName.trim().split(/\s+/);
    value = parts.slice(1).join(' ') || '';
  }

  // Handle zip/zipCode alias
  if (fieldKey === 'zip' && !value && profile.zipCode) {
    value = profile.zipCode;
  }

  // Handle multi-entry address fields
  const addressFields = ['addressLine1', 'city', 'state', 'zipCode', 'zip', 'country'];
  if (!value && addressFields.includes(fieldKey) && profile.addresses && profile.addresses.length > 0) {
    const primaryAddress = getPrimaryEntryFromArray(profile.addresses);
    if (primaryAddress) {
      const actualFieldKey = fieldKey === 'zip' ? 'zipCode' : fieldKey;
      value = primaryAddress[actualFieldKey] || '';
    }
  }

  // Handle multi-entry employment fields
  const employmentFields = ['currentEmployer', 'jobTitle', 'startDate', 'endDate', 'workEmail'];
  if (!value && employmentFields.includes(fieldKey) && profile.employments && profile.employments.length > 0) {
    const primaryEmployment = getPrimaryEntryFromArray(profile.employments);
    if (primaryEmployment) {
      value = primaryEmployment[fieldKey] || '';
    }
  }

  // Handle multi-entry education fields
  const educationFields = ['schoolName', 'degree', 'graduationYear', 'fieldOfStudy'];
  if (!value && educationFields.includes(fieldKey) && profile.educations && profile.educations.length > 0) {
    const primaryEducation = getPrimaryEntryFromArray(profile.educations);
    if (primaryEducation) {
      value = primaryEducation[fieldKey] || '';
    }
  }

  return value || '';
}

/**
 * Get the primary entry from an array of entries (or first if no primary)
 */
function getPrimaryEntryFromArray(entries) {
  if (!entries || entries.length === 0) return null;
  return entries.find(e => e.isPrimary) || entries[0];
}

/**
 * Get all entries for a multi-entry module
 */
function getAllEntriesForModule(profile, moduleType) {
  if (moduleType === 'address') return profile.addresses || [];
  if (moduleType === 'employment') return profile.employments || [];
  if (moduleType === 'education') return profile.educations || [];
  return [];
}

/**
 * Get profile value with fallback to secondary entries
 */
function getProfileValueWithFallback(fieldKey, profile, entryIndex = null) {
  // If specific entry requested
  if (entryIndex !== null) {
    const addressFields = ['addressLine1', 'city', 'state', 'zipCode', 'zip', 'country'];
    const employmentFields = ['currentEmployer', 'jobTitle', 'startDate', 'endDate', 'workEmail'];
    const educationFields = ['schoolName', 'degree', 'graduationYear', 'fieldOfStudy'];

    if (addressFields.includes(fieldKey) && profile.addresses) {
      const entry = profile.addresses[entryIndex];
      if (entry) {
        const actualFieldKey = fieldKey === 'zip' ? 'zipCode' : fieldKey;
        return entry[actualFieldKey] || '';
      }
    }

    if (employmentFields.includes(fieldKey) && profile.employments) {
      const entry = profile.employments[entryIndex];
      if (entry) return entry[fieldKey] || '';
    }

    if (educationFields.includes(fieldKey) && profile.educations) {
      const entry = profile.educations[entryIndex];
      if (entry) return entry[fieldKey] || '';
    }
  }

  // Default behavior
  return getProfileValue(fieldKey, profile);
}

/**
 * Get the label text for an input field
 */
function getFieldLabel(input) {
  // Try explicit label via for attribute
  if (input.id) {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) return label.textContent?.trim() || '';
  }

  // Try parent label
  const parentLabel = input.closest('label');
  if (parentLabel) {
    // Get text content but exclude the input's value
    const clone = parentLabel.cloneNode(true);
    const inputs = clone.querySelectorAll('input, textarea, select');
    inputs.forEach(el => el.remove());
    return clone.textContent?.trim() || '';
  }

  // Try aria-label
  const ariaLabel = input.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  // Try aria-labelledby
  const labelledBy = input.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelEl = document.getElementById(labelledBy);
    if (labelEl) return labelEl.textContent?.trim() || '';
  }

  // Try previous sibling text
  const prevSibling = input.previousElementSibling;
  if (prevSibling && prevSibling.tagName !== 'INPUT') {
    return prevSibling.textContent?.trim() || '';
  }

  return '';
}

/**
 * Get a human-readable identifier for a field
 */
function getFieldIdentifier(input) {
  if (input.name) return `name="${input.name}"`;
  if (input.id) return `id="${input.id}"`;
  if (input.placeholder) return `placeholder="${input.placeholder}"`;
  return input.tagName.toLowerCase();
}

/**
 * Get details for why a field was skipped
 */
function getSkipDetails(input, reason) {
  const identifier = getFieldIdentifier(input);
  
  switch (reason) {
    case 'hidden': return `Hidden field: ${identifier}`;
    case 'disabled': return `Disabled field: ${identifier}`;
    case 'readonly': return `Readonly field: ${identifier}`;
    case 'already_filled': return `Already has value: ${identifier}`;
    case 'blocked_field': return `Security-blocked field: ${identifier}`;
    case 'invalid_type': return `Invalid input type "${input.type}": ${identifier}`;
    default: return identifier;
  }
}

// ============================================================================
// Field Filling
// ============================================================================

/**
 * Fill an input field and dispatch appropriate events
 */
function fillInput(input, value, settings = {}) {
  const config = { ...DEFAULT_SETTINGS, ...settings };

  // Set value using native setter for React compatibility
  const descriptor = Object.getOwnPropertyDescriptor(
    input.tagName === 'TEXTAREA' 
      ? window.HTMLTextAreaElement.prototype 
      : window.HTMLInputElement.prototype,
    'value'
  );
  
  if (descriptor?.set) {
    descriptor.set.call(input, value);
  } else {
    input.value = value;
  }

  // Dispatch events for framework compatibility
  if (config.dispatchEvents) {
    dispatchInputEvents(input);
  }

  // Highlight effect
  if (config.highlightFilled) {
    highlightField(input);
  }
}

/**
 * Dispatch input/change/blur events for framework compatibility
 */
function dispatchInputEvents(input) {
  // Input event (for React, Vue, etc.)
  input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
  
  // Change event
  input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
  
  // Blur event (triggers validation in some frameworks)
  input.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));

  // For some React versions, we need to trigger with InputEvent
  try {
    input.dispatchEvent(new InputEvent('input', { 
      bubbles: true, 
      cancelable: true,
      inputType: 'insertText',
      data: input.value
    }));
  } catch (e) {
    // InputEvent not supported in some environments
  }
}

/**
 * Apply highlight effect to a filled field
 */
function highlightField(input, duration = 2000) {
  const originalOutline = input.style.outline;
  const originalBoxShadow = input.style.boxShadow;
  const originalTransition = input.style.transition;

  input.style.transition = 'outline 0.2s, box-shadow 0.2s';
  input.style.outline = '2px solid #2d4a3e';
  input.style.boxShadow = '0 0 0 4px rgba(45, 74, 62, 0.2)';

  setTimeout(() => {
    input.style.outline = originalOutline;
    input.style.boxShadow = originalBoxShadow;
    
    setTimeout(() => {
      input.style.transition = originalTransition;
    }, 200);
  }, duration);
}

// ============================================================================
// Analysis Utilities
// ============================================================================

/**
 * Analyze a form without filling - returns what would be filled
 */
function analyzeForm(root, profile, confidenceThreshold = 50) {
  const matchedFields = [];
  const unmatchedFields = [];
  const blockedFields = [];

  const inputs = root.querySelectorAll('input, textarea');

  inputs.forEach(input => {
    // Skip hidden
    if (input.type === 'hidden') return;

    // Check if blocked
    if (isBlockedField(input)) {
      blockedFields.push({
        element: input,
        identifier: getFieldIdentifier(input)
      });
      return;
    }

    // Try to match
    const match = matchField(input, profile, 0); // No threshold for analysis
    
    if (match && match.confidence >= confidenceThreshold) {
      matchedFields.push({
        element: input,
        fieldKey: match.fieldKey,
        confidence: match.confidence,
        matchedBy: match.matchedBy
      });
    } else {
      unmatchedFields.push({
        element: input,
        identifier: getFieldIdentifier(input)
      });
    }
  });

  return { matchedFields, unmatchedFields, blockedFields };
}

/**
 * Get field matching details for debugging
 */
function debugFieldMatch(input, profile) {
  const inputInfo = {
    name: input.name || '',
    id: input.id || '',
    type: input.type || '',
    placeholder: input.placeholder || '',
    label: getFieldLabel(input),
    autocomplete: input.autocomplete || ''
  };

  const blocked = isBlockedField(input);
  let blockReason;
  
  if (blocked) {
    if (input.type === 'password') {
      blockReason = 'Password field';
    } else {
      const combined = `${inputInfo.name} ${inputInfo.id} ${inputInfo.autocomplete}`.toLowerCase();
      const matchedPattern = BLOCKED_PATTERNS.find(p => combined.includes(p));
      blockReason = matchedPattern ? `Matches blocked pattern: ${matchedPattern}` : 'Unknown';
    }
  }

  const matches = [];

  // Try all fields and collect all matches
  for (const [fieldKey] of Object.entries(FIELD_PATTERNS)) {
    const profileValue = getProfileValue(fieldKey, profile);
    if (!profileValue) continue;

    const testProfile = { [fieldKey]: profileValue };
    const match = matchField(input, testProfile, 0);
    if (match) {
      matches.push({
        fieldKey,
        confidence: match.confidence,
        matchedBy: match.matchedBy,
        pattern: match.matchedPattern,
        profileValue
      });
    }
  }

  // Sort by confidence
  matches.sort((a, b) => b.confidence - a.confidence);

  return {
    inputInfo,
    matches,
    isBlocked: blocked,
    blockReason
  };
}

// ============================================================================
// Exports (for use in different contexts)
// ============================================================================

// For content script (global)
if (typeof window !== 'undefined') {
  window.AutofillEngine = {
    autofill,
    analyzeForm,
    matchField,
    isBlockedField,
    fillInput,
    highlightField,
    dispatchInputEvents,
    debugFieldMatch,
    getFieldLabel,
    getProfileValue,
    getProfileValueWithFallback,
    getPrimaryEntryFromArray,
    getAllEntriesForModule,
    FIELD_PATTERNS,
    BLOCKED_PATTERNS,
    CONFIDENCE_SCORES,
    DEFAULT_SETTINGS
  };
}

// For Node.js/testing (CommonJS)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    autofill,
    analyzeForm,
    matchField,
    isBlockedField,
    fillInput,
    highlightField,
    dispatchInputEvents,
    debugFieldMatch,
    getFieldLabel,
    getProfileValue,
    getProfileValueWithFallback,
    getPrimaryEntryFromArray,
    getAllEntriesForModule,
    FIELD_PATTERNS,
    BLOCKED_PATTERNS,
    CONFIDENCE_SCORES,
    DEFAULT_SETTINGS
  };
}
