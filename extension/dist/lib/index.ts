/**
 * Library exports for Bureaucracy Autopilot extension
 */

// Profile Schema
export {
  // Types
  type AutofillPolicy,
  type FieldMeta,
  type PersonalInfoModule,
  type ContactModule,
  type AddressModule,
  type IdentityDocumentsModule,
  type DemographicsModule,
  type EmploymentModule,
  type EducationModule,
  type EmergencyContactModule,
  type ProfileV1,
  type Profile,
  type ModuleDefinition as ProfileModuleDefinition,
  type FormType as ProfileFormType,
  type ProfileCompletionResult,
  // Constants
  CURRENT_PROFILE_VERSION,
  NEVER_AUTOFILL_FIELDS,
  CONFIRM_AUTOFILL_FIELDS,
  PROFILE_MODULES as PROFILE_SCHEMA_MODULES,
  FORM_TYPE_REQUIREMENTS,
  // Functions
  createField,
  emptyField,
  createEmptyProfileV1,
  isNeverAutofillField,
  isConfirmAutofillField,
  getDefaultPolicy,
  calculateProfileCompletion,
} from "./profileSchema";

// Onboarding Config
export {
  // Types
  type FormType,
  type FormTypeDefinition,
  type SensitivityLevel,
  type ModuleDefinition,
  type FormTypeModuleMapping,
  type OnboardingStep,
  // Constants
  FORM_TYPES,
  PROFILE_MODULES,
  FORM_TYPE_MODULES,
  ONBOARDING_STEPS,
  // Functions
  getFormType,
  getSensitivityDescription,
  getModule,
  getAlwaysShowModules,
  getFormTypeMapping,
  getRequiredModulesForFormTypes,
  getRecommendedModulesForFormTypes,
  getModulesForFormTypes,
  getOnboardingStepsForFormTypes,
  getNextStep,
  getPreviousStep,
  calculateOnboardingProgress,
  estimateCompletionTime,
} from "./onboardingConfig";

// Storage
export {
  // Types
  type ExtensionSettings,
  type StorageProvider,
  type OnboardingState,
  // Constants
  STORAGE_KEYS,
  DEFAULT_SETTINGS,
  DEFAULT_ONBOARDING_STATE,
  // Classes
  MemoryStorageProvider,
  // Functions - Storage Provider
  setStorageProvider,
  getStorageProvider,
  // Functions - Profile
  getProfile,
  saveProfile,
  updateProfileField,
  // Functions - Settings
  getSettings,
  saveSettings,
  isEnabled,
  toggleEnabled,
  // Functions - Form Types
  getSelectedFormTypes,
  saveSelectedFormTypes,
  addFormType,
  removeFormType,
  toggleFormType,
  // Functions - Onboarding
  getOnboardingState,
  saveOnboardingState,
  completeOnboardingStep,
  setCurrentOnboardingStep,
  completeOnboarding,
  skipOnboarding,
  resetOnboarding,
  isOnboardingComplete,
  getOnboardingResumePoint,
  // Functions - Utility
  clearAllData,
  exportProfile,
  importProfile,
  runSanityChecks,
} from "./storage";

// Autofill Engine
export {
  // Types
  type FieldPattern,
  type Profile as AutofillProfile,
  type AutofillSettings,
  type SkipReason,
  type MatchResult,
  type FilledField,
  type SkippedField,
  type AutofillResult,
  // Constants
  FIELD_PATTERNS,
  BLOCKED_PATTERNS,
  DEFAULT_SETTINGS as AUTOFILL_DEFAULT_SETTINGS,
  // Functions
  autofill,
  analyzeForm,
  matchField,
  isBlockedField,
  fillInput,
  highlightField,
  dispatchInputEvents,
  getFieldLabel,
  debugFieldMatch,
} from "./autofillEngine";
