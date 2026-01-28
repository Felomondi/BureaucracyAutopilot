/**
 * Storage helpers for Bureaucracy Autopilot Chrome Extension
 * 
 * Provides typed access to chrome.storage.local with migration support
 * and version management.
 */

import {
  ProfileV1,
  createEmptyProfileV1,
  CURRENT_PROFILE_VERSION,
} from "./profileSchema";

import { FormType } from "./onboardingConfig";

// ============================================================================
// Storage Keys
// ============================================================================

export const STORAGE_KEYS = {
  PROFILE: "profile",
  PROFILE_VERSION: "profileVersion",
  SETTINGS: "settings",
  ENABLED: "enabled",
  SELECTED_FORM_TYPES: "selectedFormTypes",
  ONBOARDING_STATE: "onboardingState",
} as const;

// ============================================================================
// Settings Interface
// ============================================================================

export interface ExtensionSettings {
  /** Whether the extension is enabled for autofill */
  enabled: boolean;
  /** Show confirmation dialog before bulk fill */
  confirmBeforeFill: boolean;
  /** Highlight fields after filling */
  highlightFilled: boolean;
  /** Highlight duration in milliseconds */
  highlightDuration: number;
  /** Auto-detect forms on page load */
  autoDetectForms: boolean;
  /** Show badge with field count */
  showFieldBadge: boolean;
  /** Keyboard shortcut enabled */
  keyboardShortcutEnabled: boolean;
}

/**
 * Default extension settings
 */
export const DEFAULT_SETTINGS: ExtensionSettings = {
  enabled: false,
  confirmBeforeFill: false,
  highlightFilled: true,
  highlightDuration: 2000,
  autoDetectForms: true,
  showFieldBadge: true,
  keyboardShortcutEnabled: true,
};

// ============================================================================
// Onboarding State
// ============================================================================

/**
 * Tracks user's progress through the onboarding flow
 */
export interface OnboardingState {
  /** IDs of completed onboarding steps */
  completedStepIds: string[];
  /** ID of the last step the user was on (for resuming) */
  lastStepId: string | null;
  /** Timestamp when onboarding was started */
  startedAt: string | null;
  /** Timestamp when onboarding was completed */
  completedAt: string | null;
  /** Whether onboarding has been completed */
  isComplete: boolean;
  /** Whether user skipped onboarding */
  wasSkipped: boolean;
}

/**
 * Default onboarding state
 */
export const DEFAULT_ONBOARDING_STATE: OnboardingState = {
  completedStepIds: [],
  lastStepId: null,
  startedAt: null,
  completedAt: null,
  isComplete: false,
  wasSkipped: false,
};

// ============================================================================
// Storage Wrapper (for testing/mocking)
// ============================================================================

/**
 * Storage interface for dependency injection
 */
export interface StorageProvider {
  get(keys: string | string[]): Promise<Record<string, unknown>>;
  set(items: Record<string, unknown>): Promise<void>;
  remove(keys: string | string[]): Promise<void>;
  clear(): Promise<void>;
}

/**
 * Chrome storage implementation
 */
class ChromeStorageProvider implements StorageProvider {
  async get(keys: string | string[]): Promise<Record<string, unknown>> {
    return new Promise((resolve) => {
      chrome.storage.local.get(keys, (result) => {
        resolve(result);
      });
    });
  }

  async set(items: Record<string, unknown>): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set(items, () => {
        resolve();
      });
    });
  }

  async remove(keys: string | string[]): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.remove(keys, () => {
        resolve();
      });
    });
  }

  async clear(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.clear(() => {
        resolve();
      });
    });
  }
}

/**
 * In-memory storage for testing
 */
export class MemoryStorageProvider implements StorageProvider {
  private data: Record<string, unknown> = {};

  async get(keys: string | string[]): Promise<Record<string, unknown>> {
    const keyArray = Array.isArray(keys) ? keys : [keys];
    const result: Record<string, unknown> = {};
    for (const key of keyArray) {
      if (key in this.data) {
        result[key] = this.data[key];
      }
    }
    return result;
  }

  async set(items: Record<string, unknown>): Promise<void> {
    Object.assign(this.data, items);
  }

  async remove(keys: string | string[]): Promise<void> {
    const keyArray = Array.isArray(keys) ? keys : [keys];
    for (const key of keyArray) {
      delete this.data[key];
    }
  }

  async clear(): Promise<void> {
    this.data = {};
  }

  // For testing: get all data
  getData(): Record<string, unknown> {
    return { ...this.data };
  }
}

// Default to Chrome storage, can be overridden for testing
let storageProvider: StorageProvider = new ChromeStorageProvider();

/**
 * Set the storage provider (useful for testing)
 */
export function setStorageProvider(provider: StorageProvider): void {
  storageProvider = provider;
}

/**
 * Get the current storage provider
 */
export function getStorageProvider(): StorageProvider {
  return storageProvider;
}

// ============================================================================
// Migration Support
// ============================================================================

/**
 * Legacy profile format (from before versioning)
 */
interface LegacyProfile {
  fullName?: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  zip?: string;
}

/**
 * Check if profile is legacy format
 */
function isLegacyProfile(profile: unknown): profile is LegacyProfile {
  if (!profile || typeof profile !== "object") return false;
  const p = profile as Record<string, unknown>;
  // Legacy profile has flat structure with these keys
  return (
    ("fullName" in p || "email" in p || "phone" in p) &&
    !("version" in p)
  );
}

/**
 * Migrate legacy profile to V1
 */
function migrateLegacyToV1(legacy: LegacyProfile): ProfileV1 {
  const profile = createEmptyProfileV1();
  
  // Parse full name into first/last
  if (legacy.fullName) {
    const parts = legacy.fullName.trim().split(/\s+/);
    profile.personal.firstName.value = parts[0] || "";
    profile.personal.lastName.value = parts.slice(1).join(" ") || "";
    profile.personal.firstName.lastUpdated = new Date().toISOString();
    profile.personal.lastName.lastUpdated = new Date().toISOString();
  }
  
  // Map other fields
  if (legacy.email) {
    profile.contact.email.value = legacy.email;
    profile.contact.email.lastUpdated = new Date().toISOString();
  }
  if (legacy.phone) {
    profile.contact.phone.value = legacy.phone;
    profile.contact.phone.lastUpdated = new Date().toISOString();
  }
  if (legacy.addressLine1) {
    profile.address.addressLine1.value = legacy.addressLine1;
    profile.address.addressLine1.lastUpdated = new Date().toISOString();
  }
  if (legacy.city) {
    profile.address.city.value = legacy.city;
    profile.address.city.lastUpdated = new Date().toISOString();
  }
  if (legacy.state) {
    profile.address.state.value = legacy.state;
    profile.address.state.lastUpdated = new Date().toISOString();
  }
  if (legacy.zip) {
    profile.address.zipCode.value = legacy.zip;
    profile.address.zipCode.lastUpdated = new Date().toISOString();
  }
  
  return profile;
}

/**
 * Migrate profile to latest version
 */
async function migrateProfile(data: unknown): Promise<ProfileV1> {
  // No data - create fresh profile
  if (!data) {
    return createEmptyProfileV1();
  }
  
  // Legacy format - migrate to V1
  if (isLegacyProfile(data)) {
    console.log("[Storage] Migrating legacy profile to V1");
    const migrated = migrateLegacyToV1(data);
    await storageProvider.set({
      [STORAGE_KEYS.PROFILE]: migrated,
      [STORAGE_KEYS.PROFILE_VERSION]: CURRENT_PROFILE_VERSION,
    });
    return migrated;
  }
  
  // Already V1 format
  const profile = data as ProfileV1;
  if (profile.version === 1) {
    return profile;
  }
  
  // Unknown format - return as-is but log warning
  console.warn("[Storage] Unknown profile format, returning as-is:", profile);
  return profile as ProfileV1;
}

// ============================================================================
// Profile Storage
// ============================================================================

/**
 * Get the current user profile, migrating if necessary
 */
export async function getProfile(): Promise<ProfileV1> {
  const result = await storageProvider.get([
    STORAGE_KEYS.PROFILE,
    STORAGE_KEYS.PROFILE_VERSION,
  ]);
  
  const storedProfile = result[STORAGE_KEYS.PROFILE];
  const storedVersion = result[STORAGE_KEYS.PROFILE_VERSION] as number | undefined;
  
  // Check if migration is needed
  if (!storedVersion || storedVersion < CURRENT_PROFILE_VERSION) {
    return migrateProfile(storedProfile);
  }
  
  // Return existing profile or create new one
  if (storedProfile) {
    return storedProfile as ProfileV1;
  }
  
  // Initialize new profile
  const newProfile = createEmptyProfileV1();
  await saveProfile(newProfile);
  return newProfile;
}

/**
 * Save the user profile
 */
export async function saveProfile(profile: ProfileV1): Promise<void> {
  // Update timestamp
  const updatedProfile: ProfileV1 = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };
  
  await storageProvider.set({
    [STORAGE_KEYS.PROFILE]: updatedProfile,
    [STORAGE_KEYS.PROFILE_VERSION]: CURRENT_PROFILE_VERSION,
  });
}

/**
 * Update a specific field in the profile
 */
export async function updateProfileField<T>(
  moduleName: keyof Omit<ProfileV1, "version" | "createdAt" | "updatedAt">,
  fieldName: string,
  value: T
): Promise<ProfileV1> {
  const profile = await getProfile();
  const module = profile[moduleName] as Record<string, { value: T; lastUpdated: string }>;
  
  if (module && fieldName in module) {
    module[fieldName].value = value;
    module[fieldName].lastUpdated = new Date().toISOString();
    await saveProfile(profile);
  }
  
  return profile;
}

// ============================================================================
// Settings Storage
// ============================================================================

/**
 * Get extension settings
 */
export async function getSettings(): Promise<ExtensionSettings> {
  const result = await storageProvider.get([
    STORAGE_KEYS.SETTINGS,
    STORAGE_KEYS.ENABLED,
  ]);
  
  const storedSettings = result[STORAGE_KEYS.SETTINGS] as Partial<ExtensionSettings> | undefined;
  const legacyEnabled = result[STORAGE_KEYS.ENABLED] as boolean | undefined;
  
  // Merge with defaults
  const settings: ExtensionSettings = {
    ...DEFAULT_SETTINGS,
    ...storedSettings,
  };
  
  // Handle legacy 'enabled' key
  if (legacyEnabled !== undefined && !storedSettings?.enabled) {
    settings.enabled = legacyEnabled;
  }
  
  return settings;
}

/**
 * Save extension settings
 */
export async function saveSettings(settings: Partial<ExtensionSettings>): Promise<ExtensionSettings> {
  const current = await getSettings();
  const updated = { ...current, ...settings };
  
  await storageProvider.set({
    [STORAGE_KEYS.SETTINGS]: updated,
    // Also update legacy key for backwards compatibility
    [STORAGE_KEYS.ENABLED]: updated.enabled,
  });
  
  return updated;
}

/**
 * Get just the enabled flag (quick access)
 */
export async function isEnabled(): Promise<boolean> {
  const settings = await getSettings();
  return settings.enabled;
}

/**
 * Toggle the enabled flag
 */
export async function toggleEnabled(): Promise<boolean> {
  const settings = await getSettings();
  const newEnabled = !settings.enabled;
  await saveSettings({ enabled: newEnabled });
  return newEnabled;
}

// ============================================================================
// Form Types Storage
// ============================================================================

/**
 * Get selected form types
 */
export async function getSelectedFormTypes(): Promise<FormType[]> {
  const result = await storageProvider.get(STORAGE_KEYS.SELECTED_FORM_TYPES);
  const stored = result[STORAGE_KEYS.SELECTED_FORM_TYPES] as FormType[] | undefined;
  return stored || [];
}

/**
 * Save selected form types
 */
export async function saveSelectedFormTypes(formTypes: FormType[]): Promise<void> {
  await storageProvider.set({
    [STORAGE_KEYS.SELECTED_FORM_TYPES]: formTypes,
  });
}

/**
 * Add a form type to the selection
 */
export async function addFormType(formType: FormType): Promise<FormType[]> {
  const current = await getSelectedFormTypes();
  if (!current.includes(formType)) {
    const updated = [...current, formType];
    await saveSelectedFormTypes(updated);
    return updated;
  }
  return current;
}

/**
 * Remove a form type from the selection
 */
export async function removeFormType(formType: FormType): Promise<FormType[]> {
  const current = await getSelectedFormTypes();
  const updated = current.filter((ft) => ft !== formType);
  await saveSelectedFormTypes(updated);
  return updated;
}

/**
 * Toggle a form type in the selection
 */
export async function toggleFormType(formType: FormType): Promise<{
  formTypes: FormType[];
  isSelected: boolean;
}> {
  const current = await getSelectedFormTypes();
  const isCurrentlySelected = current.includes(formType);
  
  if (isCurrentlySelected) {
    const updated = current.filter((ft) => ft !== formType);
    await saveSelectedFormTypes(updated);
    return { formTypes: updated, isSelected: false };
  } else {
    const updated = [...current, formType];
    await saveSelectedFormTypes(updated);
    return { formTypes: updated, isSelected: true };
  }
}

// ============================================================================
// Onboarding State Storage
// ============================================================================

/**
 * Get the current onboarding state
 */
export async function getOnboardingState(): Promise<OnboardingState> {
  const result = await storageProvider.get(STORAGE_KEYS.ONBOARDING_STATE);
  const stored = result[STORAGE_KEYS.ONBOARDING_STATE] as OnboardingState | undefined;
  return stored || { ...DEFAULT_ONBOARDING_STATE };
}

/**
 * Save onboarding state
 */
export async function saveOnboardingState(state: Partial<OnboardingState>): Promise<OnboardingState> {
  const current = await getOnboardingState();
  const updated = { ...current, ...state };
  await storageProvider.set({
    [STORAGE_KEYS.ONBOARDING_STATE]: updated,
  });
  return updated;
}

/**
 * Mark an onboarding step as complete
 */
export async function completeOnboardingStep(stepId: string): Promise<OnboardingState> {
  const current = await getOnboardingState();
  
  // Start onboarding if not started
  const startedAt = current.startedAt || new Date().toISOString();
  
  // Add step to completed list if not already there
  const completedStepIds = current.completedStepIds.includes(stepId)
    ? current.completedStepIds
    : [...current.completedStepIds, stepId];
  
  const updated: OnboardingState = {
    ...current,
    completedStepIds,
    lastStepId: stepId,
    startedAt,
  };
  
  await storageProvider.set({
    [STORAGE_KEYS.ONBOARDING_STATE]: updated,
  });
  
  return updated;
}

/**
 * Set the current onboarding step (for resuming later)
 */
export async function setCurrentOnboardingStep(stepId: string): Promise<OnboardingState> {
  return saveOnboardingState({
    lastStepId: stepId,
    startedAt: (await getOnboardingState()).startedAt || new Date().toISOString(),
  });
}

/**
 * Complete the entire onboarding process
 */
export async function completeOnboarding(): Promise<OnboardingState> {
  return saveOnboardingState({
    isComplete: true,
    completedAt: new Date().toISOString(),
  });
}

/**
 * Skip the onboarding process
 */
export async function skipOnboarding(): Promise<OnboardingState> {
  return saveOnboardingState({
    isComplete: true,
    wasSkipped: true,
    completedAt: new Date().toISOString(),
  });
}

/**
 * Reset onboarding state (for testing or re-onboarding)
 */
export async function resetOnboarding(): Promise<OnboardingState> {
  const fresh = { ...DEFAULT_ONBOARDING_STATE };
  await storageProvider.set({
    [STORAGE_KEYS.ONBOARDING_STATE]: fresh,
  });
  return fresh;
}

/**
 * Check if onboarding is complete
 */
export async function isOnboardingComplete(): Promise<boolean> {
  const state = await getOnboardingState();
  return state.isComplete;
}

/**
 * Get onboarding resume point
 */
export async function getOnboardingResumePoint(): Promise<{
  shouldResume: boolean;
  lastStepId: string | null;
  completedStepIds: string[];
}> {
  const state = await getOnboardingState();
  
  return {
    shouldResume: !state.isComplete && state.lastStepId !== null,
    lastStepId: state.lastStepId,
    completedStepIds: state.completedStepIds,
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Clear all extension data
 */
export async function clearAllData(): Promise<void> {
  await storageProvider.clear();
}

/**
 * Export profile as JSON string
 */
export async function exportProfile(): Promise<string> {
  const profile = await getProfile();
  return JSON.stringify(profile, null, 2);
}

/**
 * Import profile from JSON string
 */
export async function importProfile(jsonString: string): Promise<ProfileV1> {
  const parsed = JSON.parse(jsonString);
  
  // Validate it has expected structure
  if (!parsed.version || parsed.version !== 1) {
    throw new Error("Invalid profile format: missing or unsupported version");
  }
  
  await saveProfile(parsed as ProfileV1);
  return parsed as ProfileV1;
}

// ============================================================================
// Sanity Checks / Runtime Validation
// ============================================================================

/**
 * Runtime sanity checks for the storage system
 * Returns true if all checks pass, throws on failure
 */
export async function runSanityChecks(): Promise<{ passed: boolean; results: string[] }> {
  const results: string[] = [];
  
  try {
    // Test 1: Create and save a new profile
    const testProfile = createEmptyProfileV1();
    if (testProfile.version !== 1) {
      throw new Error("Profile version should be 1");
    }
    results.push("✓ Profile creation: version is 1");
    
    // Test 2: Check sensitive field policies
    if (testProfile.identityDocuments.ssn.autofillPolicy !== "never") {
      throw new Error("SSN should have 'never' autofill policy");
    }
    results.push("✓ SSN field: autofillPolicy is 'never'");
    
    if (testProfile.identityDocuments.driversLicense.autofillPolicy !== "confirm") {
      throw new Error("Driver's license should have 'confirm' autofill policy");
    }
    results.push("✓ Driver's license field: autofillPolicy is 'confirm'");
    
    if (testProfile.demographics.ethnicity.autofillPolicy !== "confirm") {
      throw new Error("Ethnicity should have 'confirm' autofill policy");
    }
    results.push("✓ Demographics fields: autofillPolicy is 'confirm'");
    
    // Test 3: Check non-sensitive fields have bulk_ok
    if (testProfile.contact.email.autofillPolicy !== "bulk_ok") {
      throw new Error("Email should have 'bulk_ok' autofill policy");
    }
    results.push("✓ Email field: autofillPolicy is 'bulk_ok'");
    
    // Test 4: Verify field metadata structure
    const emailField = testProfile.contact.email;
    if (typeof emailField.value !== "string") {
      throw new Error("Field value should be string");
    }
    if (typeof emailField.lastUpdated !== "string") {
      throw new Error("Field lastUpdated should be string");
    }
    if (typeof emailField.verified !== "boolean") {
      throw new Error("Field verified should be boolean");
    }
    results.push("✓ Field metadata structure: valid");
    
    // Test 5: Profile completion calculation
    const { calculateProfileCompletion } = await import("./profileSchema");
    const completion = calculateProfileCompletion(testProfile);
    if (typeof completion.overallPercent !== "number") {
      throw new Error("Completion overallPercent should be number");
    }
    if (completion.overallPercent !== 0) {
      throw new Error("Empty profile should have 0% completion");
    }
    results.push("✓ Profile completion: 0% for empty profile");
    
    // Test 6: Module completion tracking
    if (!completion.moduleCompletion.personal) {
      throw new Error("Module completion should include personal");
    }
    if (!completion.moduleCompletion.contact) {
      throw new Error("Module completion should include contact");
    }
    results.push("✓ Module completion: all modules tracked");
    
    // Test 7: Form type requirements
    const completionWithFormType = calculateProfileCompletion(testProfile, "job_application");
    if (!Array.isArray(completionWithFormType.missingRequired)) {
      throw new Error("Missing required should be array");
    }
    if (completionWithFormType.missingRequired.length === 0) {
      throw new Error("Empty profile should have missing required fields for job application");
    }
    results.push("✓ Form type requirements: missing fields detected");
    
    return { passed: true, results };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    results.push(`✗ FAILED: ${message}`);
    return { passed: false, results };
  }
}
