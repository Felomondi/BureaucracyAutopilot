/**
 * Onboarding Configuration for Bureaucracy Autopilot
 * 
 * Defines form types, module definitions, and mappings to tailor
 * which profile sections appear based on user's form-filling needs.
 */

// ============================================================================
// Form Types
// ============================================================================

/**
 * Types of forms the user commonly fills out.
 * Used to determine which profile modules to show/prioritize.
 */
export type FormType =
  | "job_applications"
  | "government_services"
  | "insurance"
  | "education_admissions"
  | "healthcare_intake"
  | "leasing_utilities"
  | "banking_onboarding"
  | "travel_visa";

/**
 * All available form types with metadata
 */
export interface FormTypeDefinition {
  id: FormType;
  title: string;
  description: string;
  icon: string; // Emoji or icon identifier
  examples: string[];
}

export const FORM_TYPES: FormTypeDefinition[] = [
  {
    id: "job_applications",
    title: "Job Applications",
    description: "Employment applications, career portals, recruiter forms",
    icon: "💼",
    examples: ["LinkedIn Easy Apply", "Greenhouse", "Lever", "Workday"],
  },
  {
    id: "government_services",
    title: "Government Services",
    description: "Federal, state, and local government forms",
    icon: "🏛️",
    examples: ["DMV", "IRS", "Social Security", "Passport renewal"],
  },
  {
    id: "insurance",
    title: "Insurance",
    description: "Health, auto, home, and life insurance applications",
    icon: "🛡️",
    examples: ["Health insurance enrollment", "Auto quotes", "Claims"],
  },
  {
    id: "education_admissions",
    title: "Education & Admissions",
    description: "School applications, course registrations, student forms",
    icon: "🎓",
    examples: ["College applications", "FAFSA", "Course registration"],
  },
  {
    id: "healthcare_intake",
    title: "Healthcare Intake",
    description: "Medical forms, patient registration, health history",
    icon: "🏥",
    examples: ["New patient forms", "Medical history", "Pharmacy"],
  },
  {
    id: "leasing_utilities",
    title: "Leasing & Utilities",
    description: "Rental applications, utility setup, property management",
    icon: "🏠",
    examples: ["Apartment applications", "Electric/gas setup", "Internet"],
  },
  {
    id: "banking_onboarding",
    title: "Banking & Finance",
    description: "Bank accounts, credit applications, financial services",
    icon: "🏦",
    examples: ["New account", "Credit card", "Loan applications"],
  },
  {
    id: "travel_visa",
    title: "Travel & Visa",
    description: "Visa applications, travel forms, customs declarations",
    icon: "✈️",
    examples: ["Visa applications", "ESTA", "Global Entry", "TSA PreCheck"],
  },
];

/**
 * Get form type definition by ID
 */
export function getFormType(id: FormType): FormTypeDefinition | undefined {
  return FORM_TYPES.find((ft) => ft.id === id);
}

// ============================================================================
// Sensitivity Levels
// ============================================================================

/**
 * Sensitivity level for profile modules
 * Affects default autofill policies and UI warnings
 */
export type SensitivityLevel = "low" | "medium" | "high" | "critical";

/**
 * Get description for sensitivity level
 */
export function getSensitivityDescription(level: SensitivityLevel): string {
  switch (level) {
    case "low":
      return "General information, safe for bulk autofill";
    case "medium":
      return "Personal details, review recommended";
    case "high":
      return "Sensitive data, confirmation required";
    case "critical":
      return "Highly sensitive, manual entry recommended";
  }
}

// ============================================================================
// Module Definitions
// ============================================================================

/**
 * A profile module that can be shown/hidden based on form types
 */
export interface ModuleDefinition {
  /** Unique identifier matching ProfileV1 keys */
  id: string;
  /** Display title */
  title: string;
  /** Brief description of what this module contains */
  description: string;
  /** List of field names in this module */
  fields: string[];
  /** Sensitivity level affecting autofill behavior */
  sensitivity: SensitivityLevel;
  /** Estimated time to complete (minutes) */
  estimatedMinutes: number;
  /** Whether this module is always shown regardless of form types */
  alwaysShow: boolean;
}

/**
 * All profile modules with their definitions
 */
export const PROFILE_MODULES: ModuleDefinition[] = [
  {
    id: "personal",
    title: "Personal Information",
    description: "Your name, date of birth, and basic identity details",
    fields: [
      "firstName",
      "middleName",
      "lastName",
      "suffix",
      "preferredName",
      "dateOfBirth",
      "gender",
      "pronouns",
    ],
    sensitivity: "medium",
    estimatedMinutes: 2,
    alwaysShow: true,
  },
  {
    id: "contact",
    title: "Contact Information",
    description: "Email addresses and phone numbers",
    fields: [
      "email",
      "emailSecondary",
      "phone",
      "phoneSecondary",
      "phoneType",
    ],
    sensitivity: "low",
    estimatedMinutes: 1,
    alwaysShow: true,
  },
  {
    id: "address",
    title: "Address",
    description: "Your primary residential address",
    fields: [
      "addressLine1",
      "addressLine2",
      "city",
      "state",
      "zipCode",
      "country",
      "addressType",
    ],
    sensitivity: "low",
    estimatedMinutes: 2,
    alwaysShow: true,
  },
  {
    id: "identityDocuments",
    title: "Identity Documents",
    description: "SSN, passport, driver's license, and other IDs",
    fields: [
      "ssn",
      "ssnLast4",
      "passportNumber",
      "passportExpiry",
      "passportCountry",
      "driversLicense",
      "driversLicenseState",
      "driversLicenseExpiry",
      "stateId",
    ],
    sensitivity: "critical",
    estimatedMinutes: 3,
    alwaysShow: false,
  },
  {
    id: "demographics",
    title: "Demographics",
    description: "Ethnicity, veteran status, disability, citizenship",
    fields: [
      "ethnicity",
      "race",
      "veteranStatus",
      "disabilityStatus",
      "citizenship",
      "immigrationStatus",
    ],
    sensitivity: "high",
    estimatedMinutes: 2,
    alwaysShow: false,
  },
  {
    id: "employment",
    title: "Employment",
    description: "Current employer, job title, work history",
    fields: [
      "currentEmployer",
      "jobTitle",
      "employmentStatus",
      "workPhone",
      "workEmail",
      "workAddress",
      "startDate",
      "annualIncome",
      "employerEin",
    ],
    sensitivity: "medium",
    estimatedMinutes: 3,
    alwaysShow: false,
  },
  {
    id: "education",
    title: "Education",
    description: "Schools attended, degrees, academic history",
    fields: [
      "highestDegree",
      "schoolName",
      "fieldOfStudy",
      "graduationYear",
      "gpa",
      "studentId",
    ],
    sensitivity: "low",
    estimatedMinutes: 2,
    alwaysShow: false,
  },
  {
    id: "emergencyContact",
    title: "Emergency Contact",
    description: "Someone to contact in case of emergency",
    fields: ["name", "relationship", "phone", "email"],
    sensitivity: "low",
    estimatedMinutes: 1,
    alwaysShow: false,
  },
];

/**
 * Get module definition by ID
 */
export function getModule(id: string): ModuleDefinition | undefined {
  return PROFILE_MODULES.find((m) => m.id === id);
}

/**
 * Get all modules that are always shown
 */
export function getAlwaysShowModules(): ModuleDefinition[] {
  return PROFILE_MODULES.filter((m) => m.alwaysShow);
}

// ============================================================================
// Form Type to Module Mappings
// ============================================================================

/**
 * Mapping of which modules are recommended/required for each form type
 */
export interface FormTypeModuleMapping {
  /** Form type ID */
  formType: FormType;
  /** Modules that are required for this form type */
  requiredModules: string[];
  /** Modules that are recommended but optional */
  recommendedModules: string[];
  /** Specific fields that are commonly needed */
  commonFields: string[];
}

/**
 * Complete mapping of form types to modules
 */
export const FORM_TYPE_MODULES: FormTypeModuleMapping[] = [
  {
    formType: "job_applications",
    requiredModules: ["personal", "contact", "address", "employment", "education"],
    recommendedModules: ["demographics"],
    commonFields: [
      "personal.firstName",
      "personal.lastName",
      "contact.email",
      "contact.phone",
      "address.addressLine1",
      "address.city",
      "address.state",
      "address.zipCode",
      "employment.currentEmployer",
      "employment.jobTitle",
      "education.highestDegree",
      "education.schoolName",
    ],
  },
  {
    formType: "government_services",
    requiredModules: ["personal", "contact", "address", "identityDocuments"],
    recommendedModules: ["demographics", "employment"],
    commonFields: [
      "personal.firstName",
      "personal.lastName",
      "personal.dateOfBirth",
      "identityDocuments.ssn",
      "identityDocuments.driversLicense",
      "demographics.citizenship",
    ],
  },
  {
    formType: "insurance",
    requiredModules: ["personal", "contact", "address", "employment"],
    recommendedModules: ["identityDocuments", "emergencyContact"],
    commonFields: [
      "personal.firstName",
      "personal.lastName",
      "personal.dateOfBirth",
      "contact.email",
      "contact.phone",
      "address.addressLine1",
      "employment.currentEmployer",
      "employment.annualIncome",
    ],
  },
  {
    formType: "education_admissions",
    requiredModules: ["personal", "contact", "address", "education"],
    recommendedModules: ["demographics", "emergencyContact"],
    commonFields: [
      "personal.firstName",
      "personal.lastName",
      "personal.dateOfBirth",
      "contact.email",
      "education.highestDegree",
      "education.schoolName",
      "education.gpa",
    ],
  },
  {
    formType: "healthcare_intake",
    requiredModules: ["personal", "contact", "address", "emergencyContact"],
    recommendedModules: ["identityDocuments", "employment"],
    commonFields: [
      "personal.firstName",
      "personal.lastName",
      "personal.dateOfBirth",
      "personal.gender",
      "contact.phone",
      "emergencyContact.name",
      "emergencyContact.phone",
    ],
  },
  {
    formType: "leasing_utilities",
    requiredModules: ["personal", "contact", "address", "employment"],
    recommendedModules: ["identityDocuments"],
    commonFields: [
      "personal.firstName",
      "personal.lastName",
      "contact.email",
      "contact.phone",
      "address.addressLine1",
      "employment.currentEmployer",
      "employment.annualIncome",
      "identityDocuments.ssn",
    ],
  },
  {
    formType: "banking_onboarding",
    requiredModules: ["personal", "contact", "address", "identityDocuments", "employment"],
    recommendedModules: [],
    commonFields: [
      "personal.firstName",
      "personal.lastName",
      "personal.dateOfBirth",
      "identityDocuments.ssn",
      "identityDocuments.driversLicense",
      "employment.currentEmployer",
      "employment.annualIncome",
    ],
  },
  {
    formType: "travel_visa",
    requiredModules: ["personal", "contact", "address", "identityDocuments"],
    recommendedModules: ["employment", "education"],
    commonFields: [
      "personal.firstName",
      "personal.lastName",
      "personal.dateOfBirth",
      "identityDocuments.passportNumber",
      "identityDocuments.passportExpiry",
      "identityDocuments.passportCountry",
      "demographics.citizenship",
    ],
  },
];

/**
 * Get module mapping for a form type
 */
export function getFormTypeMapping(formType: FormType): FormTypeModuleMapping | undefined {
  return FORM_TYPE_MODULES.find((m) => m.formType === formType);
}

/**
 * Get all required modules for a set of form types
 */
export function getRequiredModulesForFormTypes(formTypes: FormType[]): string[] {
  const modules = new Set<string>();
  
  for (const formType of formTypes) {
    const mapping = getFormTypeMapping(formType);
    if (mapping) {
      for (const moduleId of mapping.requiredModules) {
        modules.add(moduleId);
      }
    }
  }
  
  return Array.from(modules);
}

/**
 * Get all recommended modules for a set of form types
 */
export function getRecommendedModulesForFormTypes(formTypes: FormType[]): string[] {
  const required = new Set(getRequiredModulesForFormTypes(formTypes));
  const recommended = new Set<string>();
  
  for (const formType of formTypes) {
    const mapping = getFormTypeMapping(formType);
    if (mapping) {
      for (const moduleId of mapping.recommendedModules) {
        // Only add if not already required
        if (!required.has(moduleId)) {
          recommended.add(moduleId);
        }
      }
    }
  }
  
  return Array.from(recommended);
}

/**
 * Get modules to show for selected form types
 * Returns modules in priority order: always-show, required, recommended
 */
export function getModulesForFormTypes(formTypes: FormType[]): {
  required: ModuleDefinition[];
  recommended: ModuleDefinition[];
  hidden: ModuleDefinition[];
} {
  const requiredIds = new Set(getRequiredModulesForFormTypes(formTypes));
  const recommendedIds = new Set(getRecommendedModulesForFormTypes(formTypes));
  
  const required: ModuleDefinition[] = [];
  const recommended: ModuleDefinition[] = [];
  const hidden: ModuleDefinition[] = [];
  
  for (const module of PROFILE_MODULES) {
    if (module.alwaysShow || requiredIds.has(module.id)) {
      required.push(module);
    } else if (recommendedIds.has(module.id)) {
      recommended.push(module);
    } else {
      hidden.push(module);
    }
  }
  
  return { required, recommended, hidden };
}

// ============================================================================
// Onboarding Steps
// ============================================================================

/**
 * An onboarding step definition
 */
export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  /** Module IDs this step configures (empty for non-module steps) */
  moduleIds: string[];
  /** Whether this step can be skipped */
  skippable: boolean;
  /** Order in the onboarding flow */
  order: number;
}

/**
 * Default onboarding steps
 */
export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome",
    description: "Introduction to Bureaucracy Autopilot",
    moduleIds: [],
    skippable: false,
    order: 0,
  },
  {
    id: "form_types",
    title: "Form Types",
    description: "Select the types of forms you commonly fill out",
    moduleIds: [],
    skippable: false,
    order: 1,
  },
  {
    id: "personal",
    title: "Personal Information",
    description: "Your name and basic details",
    moduleIds: ["personal"],
    skippable: false,
    order: 2,
  },
  {
    id: "contact",
    title: "Contact Information",
    description: "Email and phone numbers",
    moduleIds: ["contact"],
    skippable: false,
    order: 3,
  },
  {
    id: "address",
    title: "Address",
    description: "Your residential address",
    moduleIds: ["address"],
    skippable: false,
    order: 4,
  },
  {
    id: "identity",
    title: "Identity Documents",
    description: "SSN, passport, and other IDs",
    moduleIds: ["identityDocuments"],
    skippable: true,
    order: 5,
  },
  {
    id: "employment",
    title: "Employment",
    description: "Current job and work history",
    moduleIds: ["employment"],
    skippable: true,
    order: 6,
  },
  {
    id: "education",
    title: "Education",
    description: "Schools and degrees",
    moduleIds: ["education"],
    skippable: true,
    order: 7,
  },
  {
    id: "review",
    title: "Review & Finish",
    description: "Review your profile and complete setup",
    moduleIds: [],
    skippable: false,
    order: 8,
  },
];

/**
 * Get onboarding steps filtered by selected form types
 * Only includes module steps that are required/recommended
 */
export function getOnboardingStepsForFormTypes(formTypes: FormType[]): OnboardingStep[] {
  const { required, recommended } = getModulesForFormTypes(formTypes);
  const relevantModuleIds = new Set([
    ...required.map((m) => m.id),
    ...recommended.map((m) => m.id),
  ]);
  
  return ONBOARDING_STEPS.filter((step) => {
    // Always include non-module steps
    if (step.moduleIds.length === 0) {
      return true;
    }
    // Include if any of the step's modules are relevant
    return step.moduleIds.some((id) => relevantModuleIds.has(id));
  }).sort((a, b) => a.order - b.order);
}

/**
 * Get the next step after the current one
 */
export function getNextStep(
  currentStepId: string,
  formTypes: FormType[]
): OnboardingStep | null {
  const steps = getOnboardingStepsForFormTypes(formTypes);
  const currentIndex = steps.findIndex((s) => s.id === currentStepId);
  
  if (currentIndex === -1 || currentIndex >= steps.length - 1) {
    return null;
  }
  
  return steps[currentIndex + 1];
}

/**
 * Get the previous step before the current one
 */
export function getPreviousStep(
  currentStepId: string,
  formTypes: FormType[]
): OnboardingStep | null {
  const steps = getOnboardingStepsForFormTypes(formTypes);
  const currentIndex = steps.findIndex((s) => s.id === currentStepId);
  
  if (currentIndex <= 0) {
    return null;
  }
  
  return steps[currentIndex - 1];
}

/**
 * Calculate onboarding progress
 */
export function calculateOnboardingProgress(
  completedStepIds: string[],
  formTypes: FormType[]
): {
  completedCount: number;
  totalCount: number;
  percentComplete: number;
  isComplete: boolean;
} {
  const steps = getOnboardingStepsForFormTypes(formTypes);
  const completedSet = new Set(completedStepIds);
  
  const completedCount = steps.filter((s) => completedSet.has(s.id)).length;
  const totalCount = steps.length;
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  // Complete if all non-skippable steps are done or all steps are done
  const requiredSteps = steps.filter((s) => !s.skippable);
  const allRequiredDone = requiredSteps.every((s) => completedSet.has(s.id));
  const isComplete = allRequiredDone && completedSet.has("review");
  
  return {
    completedCount,
    totalCount,
    percentComplete,
    isComplete,
  };
}

// ============================================================================
// Estimated Time Calculation
// ============================================================================

/**
 * Calculate estimated time to complete profile based on form types
 */
export function estimateCompletionTime(formTypes: FormType[]): {
  totalMinutes: number;
  breakdown: { moduleId: string; title: string; minutes: number }[];
} {
  const { required, recommended } = getModulesForFormTypes(formTypes);
  const allModules = [...required, ...recommended];
  
  const breakdown = allModules.map((m) => ({
    moduleId: m.id,
    title: m.title,
    minutes: m.estimatedMinutes,
  }));
  
  const totalMinutes = breakdown.reduce((sum, m) => sum + m.minutes, 0);
  
  return { totalMinutes, breakdown };
}
