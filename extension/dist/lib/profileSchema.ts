/**
 * Profile Schema v1 for Bureaucracy Autopilot
 * 
 * Defines the structure for user profile data with field-level metadata
 * including autofill policies, verification status, and timestamps.
 */

// ============================================================================
// Autofill Policy
// ============================================================================

/**
 * Autofill policy determines how a field is handled during form filling:
 * - "never": Never autofill this field automatically
 * - "confirm": Show in review drawer, require explicit confirmation
 * - "on_click": Fill only when user clicks "Fill this page"
 * - "bulk_ok": Can be filled in bulk without individual confirmation
 */
export type AutofillPolicy = "never" | "confirm" | "on_click" | "bulk_ok";

// ============================================================================
// Field Metadata
// ============================================================================

/**
 * Metadata wrapper for any profile field value
 */
export interface FieldMeta<T> {
  /** The actual field value */
  value: T;
  /** ISO timestamp of last update */
  lastUpdated: string;
  /** Whether this value has been verified (e.g., from document) */
  verified: boolean;
  /** How this field should be handled during autofill */
  autofillPolicy: AutofillPolicy;
  /** Optional source of the value (manual, document, import) */
  source?: "manual" | "document" | "import";
  /** Optional notes about this field */
  notes?: string;
}

/**
 * Create a new field with default metadata
 */
export function createField<T>(
  value: T,
  policy: AutofillPolicy = "bulk_ok"
): FieldMeta<T> {
  return {
    value,
    lastUpdated: new Date().toISOString(),
    verified: false,
    autofillPolicy: policy,
    source: "manual",
  };
}

/**
 * Create an empty field with default metadata
 */
export function emptyField<T>(
  defaultValue: T,
  policy: AutofillPolicy = "bulk_ok"
): FieldMeta<T> {
  return createField(defaultValue, policy);
}

// ============================================================================
// Profile Modules
// ============================================================================

/**
 * Personal identification - basic identity info
 */
export interface PersonalInfoModule {
  firstName: FieldMeta<string>;
  middleName: FieldMeta<string>;
  lastName: FieldMeta<string>;
  suffix: FieldMeta<string>; // Jr., Sr., III, etc.
  preferredName: FieldMeta<string>;
  dateOfBirth: FieldMeta<string>; // ISO date string
  gender: FieldMeta<string>;
  pronouns: FieldMeta<string>;
}

/**
 * Contact information
 */
export interface ContactModule {
  email: FieldMeta<string>;
  emailSecondary: FieldMeta<string>;
  phone: FieldMeta<string>;
  phoneSecondary: FieldMeta<string>;
  phoneType: FieldMeta<string>; // mobile, home, work
}

/**
 * Physical address
 */
export interface AddressModule {
  addressLine1: FieldMeta<string>;
  addressLine2: FieldMeta<string>;
  city: FieldMeta<string>;
  state: FieldMeta<string>;
  zipCode: FieldMeta<string>;
  country: FieldMeta<string>;
  addressType: FieldMeta<string>; // home, mailing, work
}

/**
 * Sensitive identity documents - default to "confirm" or "never"
 */
export interface IdentityDocumentsModule {
  ssn: FieldMeta<string>; // Social Security Number - SENSITIVE
  ssnLast4: FieldMeta<string>; // Last 4 of SSN - less sensitive
  passportNumber: FieldMeta<string>; // SENSITIVE
  passportExpiry: FieldMeta<string>;
  passportCountry: FieldMeta<string>;
  driversLicense: FieldMeta<string>; // SENSITIVE
  driversLicenseState: FieldMeta<string>;
  driversLicenseExpiry: FieldMeta<string>;
  stateId: FieldMeta<string>;
}

/**
 * Demographics - often optional, sensitive
 */
export interface DemographicsModule {
  ethnicity: FieldMeta<string>;
  race: FieldMeta<string>;
  veteranStatus: FieldMeta<string>;
  disabilityStatus: FieldMeta<string>;
  citizenship: FieldMeta<string>;
  immigrationStatus: FieldMeta<string>;
}

/**
 * Employment information
 */
export interface EmploymentModule {
  currentEmployer: FieldMeta<string>;
  jobTitle: FieldMeta<string>;
  employmentStatus: FieldMeta<string>; // employed, unemployed, self-employed, student
  workPhone: FieldMeta<string>;
  workEmail: FieldMeta<string>;
  workAddress: FieldMeta<string>;
  startDate: FieldMeta<string>;
  annualIncome: FieldMeta<string>; // SENSITIVE
  employerEin: FieldMeta<string>; // Employer ID Number
}

/**
 * Education information
 */
export interface EducationModule {
  highestDegree: FieldMeta<string>;
  schoolName: FieldMeta<string>;
  fieldOfStudy: FieldMeta<string>;
  graduationYear: FieldMeta<string>;
  gpa: FieldMeta<string>;
  studentId: FieldMeta<string>;
}

/**
 * Emergency contact
 */
export interface EmergencyContactModule {
  name: FieldMeta<string>;
  relationship: FieldMeta<string>;
  phone: FieldMeta<string>;
  email: FieldMeta<string>;
}

// ============================================================================
// Profile V1
// ============================================================================

export const CURRENT_PROFILE_VERSION = 1;

/**
 * Complete profile schema version 1
 */
export interface ProfileV1 {
  /** Schema version for migration support */
  version: 1;
  /** Profile creation timestamp */
  createdAt: string;
  /** Last modification timestamp */
  updatedAt: string;
  /** Profile modules */
  personal: PersonalInfoModule;
  contact: ContactModule;
  address: AddressModule;
  mailingAddress?: AddressModule; // Optional separate mailing address
  identityDocuments: IdentityDocumentsModule;
  demographics: DemographicsModule;
  employment: EmploymentModule;
  education: EducationModule;
  emergencyContact: EmergencyContactModule;
}

// ============================================================================
// Sensitive Field Configuration
// ============================================================================

/**
 * Fields that should default to "never" autofill policy
 */
export const NEVER_AUTOFILL_FIELDS: string[] = [
  "identityDocuments.ssn",
  "identityDocuments.passportNumber",
];

/**
 * Fields that should default to "confirm" autofill policy
 */
export const CONFIRM_AUTOFILL_FIELDS: string[] = [
  "identityDocuments.ssnLast4",
  "identityDocuments.driversLicense",
  "identityDocuments.stateId",
  "demographics.ethnicity",
  "demographics.race",
  "demographics.veteranStatus",
  "demographics.disabilityStatus",
  "demographics.immigrationStatus",
  "employment.annualIncome",
  "personal.dateOfBirth",
  "personal.gender",
];

/**
 * Check if a field path is in the sensitive "never" list
 */
export function isNeverAutofillField(fieldPath: string): boolean {
  return NEVER_AUTOFILL_FIELDS.includes(fieldPath);
}

/**
 * Check if a field path is in the sensitive "confirm" list
 */
export function isConfirmAutofillField(fieldPath: string): boolean {
  return CONFIRM_AUTOFILL_FIELDS.includes(fieldPath);
}

/**
 * Get default autofill policy for a field path
 */
export function getDefaultPolicy(fieldPath: string): AutofillPolicy {
  if (isNeverAutofillField(fieldPath)) return "never";
  if (isConfirmAutofillField(fieldPath)) return "confirm";
  return "bulk_ok";
}

// ============================================================================
// Default Profile Factory
// ============================================================================

/**
 * Create empty personal info module with appropriate policies
 */
function createEmptyPersonalInfo(): PersonalInfoModule {
  return {
    firstName: emptyField("", "bulk_ok"),
    middleName: emptyField("", "bulk_ok"),
    lastName: emptyField("", "bulk_ok"),
    suffix: emptyField("", "bulk_ok"),
    preferredName: emptyField("", "bulk_ok"),
    dateOfBirth: emptyField("", "confirm"),
    gender: emptyField("", "confirm"),
    pronouns: emptyField("", "bulk_ok"),
  };
}

/**
 * Create empty contact module
 */
function createEmptyContact(): ContactModule {
  return {
    email: emptyField("", "bulk_ok"),
    emailSecondary: emptyField("", "bulk_ok"),
    phone: emptyField("", "bulk_ok"),
    phoneSecondary: emptyField("", "bulk_ok"),
    phoneType: emptyField("mobile", "bulk_ok"),
  };
}

/**
 * Create empty address module
 */
function createEmptyAddress(): AddressModule {
  return {
    addressLine1: emptyField("", "bulk_ok"),
    addressLine2: emptyField("", "bulk_ok"),
    city: emptyField("", "bulk_ok"),
    state: emptyField("", "bulk_ok"),
    zipCode: emptyField("", "bulk_ok"),
    country: emptyField("USA", "bulk_ok"),
    addressType: emptyField("home", "bulk_ok"),
  };
}

/**
 * Create empty identity documents module with sensitive policies
 */
function createEmptyIdentityDocuments(): IdentityDocumentsModule {
  return {
    ssn: emptyField("", "never"),
    ssnLast4: emptyField("", "confirm"),
    passportNumber: emptyField("", "never"),
    passportExpiry: emptyField("", "confirm"),
    passportCountry: emptyField("", "bulk_ok"),
    driversLicense: emptyField("", "confirm"),
    driversLicenseState: emptyField("", "bulk_ok"),
    driversLicenseExpiry: emptyField("", "bulk_ok"),
    stateId: emptyField("", "confirm"),
  };
}

/**
 * Create empty demographics module with confirm policies
 */
function createEmptyDemographics(): DemographicsModule {
  return {
    ethnicity: emptyField("", "confirm"),
    race: emptyField("", "confirm"),
    veteranStatus: emptyField("", "confirm"),
    disabilityStatus: emptyField("", "confirm"),
    citizenship: emptyField("", "bulk_ok"),
    immigrationStatus: emptyField("", "confirm"),
  };
}

/**
 * Create empty employment module
 */
function createEmptyEmployment(): EmploymentModule {
  return {
    currentEmployer: emptyField("", "bulk_ok"),
    jobTitle: emptyField("", "bulk_ok"),
    employmentStatus: emptyField("", "bulk_ok"),
    workPhone: emptyField("", "bulk_ok"),
    workEmail: emptyField("", "bulk_ok"),
    workAddress: emptyField("", "bulk_ok"),
    startDate: emptyField("", "bulk_ok"),
    annualIncome: emptyField("", "confirm"),
    employerEin: emptyField("", "bulk_ok"),
  };
}

/**
 * Create empty education module
 */
function createEmptyEducation(): EducationModule {
  return {
    highestDegree: emptyField("", "bulk_ok"),
    schoolName: emptyField("", "bulk_ok"),
    fieldOfStudy: emptyField("", "bulk_ok"),
    graduationYear: emptyField("", "bulk_ok"),
    gpa: emptyField("", "bulk_ok"),
    studentId: emptyField("", "bulk_ok"),
  };
}

/**
 * Create empty emergency contact module
 */
function createEmptyEmergencyContact(): EmergencyContactModule {
  return {
    name: emptyField("", "bulk_ok"),
    relationship: emptyField("", "bulk_ok"),
    phone: emptyField("", "bulk_ok"),
    email: emptyField("", "bulk_ok"),
  };
}

/**
 * Create a new empty ProfileV1 with all default values and policies
 */
export function createEmptyProfileV1(): ProfileV1 {
  const now = new Date().toISOString();
  return {
    version: 1,
    createdAt: now,
    updatedAt: now,
    personal: createEmptyPersonalInfo(),
    contact: createEmptyContact(),
    address: createEmptyAddress(),
    identityDocuments: createEmptyIdentityDocuments(),
    demographics: createEmptyDemographics(),
    employment: createEmptyEmployment(),
    education: createEmptyEducation(),
    emergencyContact: createEmptyEmergencyContact(),
  };
}

// ============================================================================
// Profile Completion
// ============================================================================

/**
 * Module definition for completion calculation
 */
export interface ModuleDefinition {
  name: string;
  displayName: string;
  fields: string[];
  requiredFields: string[];
}

/**
 * Define which fields belong to which modules and which are required
 */
export const PROFILE_MODULES: ModuleDefinition[] = [
  {
    name: "personal",
    displayName: "Personal Information",
    fields: ["firstName", "middleName", "lastName", "suffix", "preferredName", "dateOfBirth", "gender", "pronouns"],
    requiredFields: ["firstName", "lastName"],
  },
  {
    name: "contact",
    displayName: "Contact Information",
    fields: ["email", "emailSecondary", "phone", "phoneSecondary", "phoneType"],
    requiredFields: ["email", "phone"],
  },
  {
    name: "address",
    displayName: "Address",
    fields: ["addressLine1", "addressLine2", "city", "state", "zipCode", "country", "addressType"],
    requiredFields: ["addressLine1", "city", "state", "zipCode"],
  },
  {
    name: "identityDocuments",
    displayName: "Identity Documents",
    fields: ["ssn", "ssnLast4", "passportNumber", "passportExpiry", "passportCountry", "driversLicense", "driversLicenseState", "driversLicenseExpiry", "stateId"],
    requiredFields: [], // None required by default
  },
  {
    name: "demographics",
    displayName: "Demographics",
    fields: ["ethnicity", "race", "veteranStatus", "disabilityStatus", "citizenship", "immigrationStatus"],
    requiredFields: [], // None required by default
  },
  {
    name: "employment",
    displayName: "Employment",
    fields: ["currentEmployer", "jobTitle", "employmentStatus", "workPhone", "workEmail", "workAddress", "startDate", "annualIncome", "employerEin"],
    requiredFields: [],
  },
  {
    name: "education",
    displayName: "Education",
    fields: ["highestDegree", "schoolName", "fieldOfStudy", "graduationYear", "gpa", "studentId"],
    requiredFields: [],
  },
  {
    name: "emergencyContact",
    displayName: "Emergency Contact",
    fields: ["name", "relationship", "phone", "email"],
    requiredFields: [],
  },
];

/**
 * Form type presets that define which fields are required
 */
export type FormType = 
  | "job_application"
  | "government_form"
  | "insurance"
  | "school_enrollment"
  | "hr_onboarding"
  | "basic_contact";

/**
 * Required fields by form type
 */
export const FORM_TYPE_REQUIREMENTS: Record<FormType, string[]> = {
  basic_contact: [
    "personal.firstName",
    "personal.lastName",
    "contact.email",
    "contact.phone",
  ],
  job_application: [
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
  government_form: [
    "personal.firstName",
    "personal.lastName",
    "personal.dateOfBirth",
    "contact.email",
    "contact.phone",
    "address.addressLine1",
    "address.city",
    "address.state",
    "address.zipCode",
    "identityDocuments.ssn",
    "demographics.citizenship",
  ],
  insurance: [
    "personal.firstName",
    "personal.lastName",
    "personal.dateOfBirth",
    "contact.email",
    "contact.phone",
    "address.addressLine1",
    "address.city",
    "address.state",
    "address.zipCode",
    "employment.currentEmployer",
  ],
  school_enrollment: [
    "personal.firstName",
    "personal.lastName",
    "personal.dateOfBirth",
    "contact.email",
    "contact.phone",
    "address.addressLine1",
    "address.city",
    "address.state",
    "address.zipCode",
    "emergencyContact.name",
    "emergencyContact.phone",
  ],
  hr_onboarding: [
    "personal.firstName",
    "personal.lastName",
    "personal.dateOfBirth",
    "contact.email",
    "contact.phone",
    "address.addressLine1",
    "address.city",
    "address.state",
    "address.zipCode",
    "identityDocuments.ssn",
    "employment.startDate",
    "emergencyContact.name",
    "emergencyContact.phone",
  ],
};

/**
 * Result of profile completion calculation
 */
export interface ProfileCompletionResult {
  /** Overall completion percentage (0-100) */
  overallPercent: number;
  /** Completion percentage per module */
  moduleCompletion: Record<string, {
    percent: number;
    filled: number;
    total: number;
    displayName: string;
  }>;
  /** Missing required fields for a given form type */
  missingRequired: string[];
  /** Total fields filled */
  totalFilled: number;
  /** Total fields available */
  totalFields: number;
}

/**
 * Get a field value from a nested path like "personal.firstName"
 */
function getFieldValue(profile: ProfileV1, path: string): string {
  const parts = path.split(".");
  if (parts.length !== 2) return "";
  
  const [moduleName, fieldName] = parts;
  const module = profile[moduleName as keyof ProfileV1];
  
  if (!module || typeof module !== "object") return "";
  
  const field = (module as Record<string, FieldMeta<string>>)[fieldName];
  if (!field || typeof field.value !== "string") return "";
  
  return field.value;
}

/**
 * Check if a field has a non-empty value
 */
function isFieldFilled(profile: ProfileV1, moduleName: string, fieldName: string): boolean {
  const module = profile[moduleName as keyof ProfileV1];
  if (!module || typeof module !== "object") return false;
  
  const field = (module as Record<string, FieldMeta<unknown>>)[fieldName];
  if (!field) return false;
  
  const value = field.value;
  if (typeof value === "string") return value.trim() !== "";
  if (typeof value === "number") return true;
  if (typeof value === "boolean") return true;
  
  return false;
}

/**
 * Calculate profile completion statistics
 */
export function calculateProfileCompletion(
  profile: ProfileV1,
  formType?: FormType
): ProfileCompletionResult {
  const moduleCompletion: ProfileCompletionResult["moduleCompletion"] = {};
  let totalFilled = 0;
  let totalFields = 0;

  // Calculate per-module completion
  for (const moduleDef of PROFILE_MODULES) {
    let filled = 0;
    const total = moduleDef.fields.length;

    for (const fieldName of moduleDef.fields) {
      if (isFieldFilled(profile, moduleDef.name, fieldName)) {
        filled++;
      }
    }

    moduleCompletion[moduleDef.name] = {
      percent: total > 0 ? Math.round((filled / total) * 100) : 0,
      filled,
      total,
      displayName: moduleDef.displayName,
    };

    totalFilled += filled;
    totalFields += total;
  }

  // Calculate missing required fields for form type
  const missingRequired: string[] = [];
  if (formType) {
    const requiredFields = FORM_TYPE_REQUIREMENTS[formType] || [];
    for (const fieldPath of requiredFields) {
      const value = getFieldValue(profile, fieldPath);
      if (!value || value.trim() === "") {
        missingRequired.push(fieldPath);
      }
    }
  }

  return {
    overallPercent: totalFields > 0 ? Math.round((totalFilled / totalFields) * 100) : 0,
    moduleCompletion,
    missingRequired,
    totalFilled,
    totalFields,
  };
}

// ============================================================================
// Type Exports
// ============================================================================

export type Profile = ProfileV1;
