/**
 * Onboarding Wizard for Bureaucracy Autopilot
 */

// Form type definitions with detailed info
const FORM_TYPES = [
  {
    id: "job_applications",
    title: "Job Applications",
    description: "Employment portals, career sites, recruiter forms",
    examples: "LinkedIn, Greenhouse, Workday, Lever",
    icon: "💼",
    modulesUnlocked: ["Employment", "Education"],
    timeSaved: "15-30 min per application",
  },
  {
    id: "government_services",
    title: "Government Services",
    description: "Federal, state, and local government forms",
    examples: "DMV, IRS, Social Security, Passport",
    icon: "🏛️",
    modulesUnlocked: ["Identity Documents", "Demographics"],
    timeSaved: "20-45 min per form",
  },
  {
    id: "insurance",
    title: "Insurance",
    description: "Health, auto, home, and life insurance applications",
    examples: "Quotes, enrollment, claims",
    icon: "🛡️",
    modulesUnlocked: ["Employment", "Emergency Contact"],
    timeSaved: "10-20 min per quote",
  },
  {
    id: "education_admissions",
    title: "Education & Admissions",
    description: "School applications, course registration, student forms",
    examples: "College apps, FAFSA, transcripts",
    icon: "🎓",
    modulesUnlocked: ["Education", "Demographics"],
    timeSaved: "30-60 min per application",
  },
  {
    id: "healthcare_intake",
    title: "Healthcare Intake",
    description: "Medical forms, patient registration, health history",
    examples: "New patient, pharmacy, specialists",
    icon: "🏥",
    modulesUnlocked: ["Emergency Contact"],
    timeSaved: "10-15 min per visit",
  },
  {
    id: "leasing_utilities",
    title: "Leasing & Utilities",
    description: "Rental applications, utility setup, property management",
    examples: "Apartments, electric, internet, gas",
    icon: "🏠",
    modulesUnlocked: ["Employment", "Identity Documents"],
    timeSaved: "15-25 min per application",
  },
  {
    id: "banking_onboarding",
    title: "Banking & Finance",
    description: "Bank accounts, credit applications, financial services",
    examples: "Checking, credit cards, loans",
    icon: "🏦",
    modulesUnlocked: ["Employment", "Identity Documents"],
    timeSaved: "10-20 min per account",
  },
  {
    id: "travel_visa",
    title: "Travel & Visa",
    description: "Visa applications, travel forms, customs declarations",
    examples: "Visa, ESTA, Global Entry, TSA PreCheck",
    icon: "✈️",
    modulesUnlocked: ["Identity Documents", "Employment"],
    timeSaved: "30-60 min per application",
  },
];

// Steps configuration
const STEPS = [
  { id: "welcome", title: "Welcome", index: 0 },
  { id: "form-types", title: "Form Types", index: 1 },
  { id: "build-profile", title: "Build Profile", index: 2 },
  { id: "review", title: "Review", index: 3 },
  { id: "test", title: "Test", index: 4 },
  { id: "finish", title: "Finish", index: 5 },
];

// Module visibility based on form types
const FORM_TYPE_MODULES = {
  job_applications: ["employment", "education", "voluntaryIdentity"],
  government_services: ["employment", "governmentIds"],
  insurance: ["employment", "governmentIds"],
  education_admissions: ["education"],
  healthcare_intake: ["governmentIds"],
  leasing_utilities: ["employment", "governmentIds"],
  banking_onboarding: ["employment", "governmentIds"],
  travel_visa: ["employment", "education", "governmentIds"],
};

// Module definitions for the profile builder
const PROFILE_MODULES = [
  {
    id: "contact",
    name: "Contact",
    icon: "📧",
    required: true,
    fields: [
      { id: "fullName", label: "Full Name", required: true },
      { id: "email", label: "Email", required: true },
      { id: "phone", label: "Phone", required: true },
    ],
  },
  {
    id: "address",
    name: "Address",
    icon: "🏠",
    required: true,
    fields: [
      { id: "addressLine1", label: "Street Address", required: true },
      { id: "city", label: "City", required: true },
      { id: "state", label: "State", required: true },
      { id: "zipCode", label: "ZIP Code", required: true },
      { id: "country", label: "Country", required: false },
    ],
  },
  {
    id: "employment",
    name: "Employment",
    icon: "💼",
    required: false,
    conditional: true,
    fields: [
      { id: "currentEmployer", label: "Employer", required: false },
      { id: "jobTitle", label: "Job Title", required: false },
      { id: "startDate", label: "Start Date", required: false },
      { id: "workEmail", label: "Work Email", required: false },
    ],
  },
  {
    id: "education",
    name: "Education",
    icon: "🎓",
    required: false,
    conditional: true,
    fields: [
      { id: "schoolName", label: "School", required: false },
      { id: "degree", label: "Degree", required: false },
      { id: "graduationYear", label: "Grad Year", required: false },
      { id: "fieldOfStudy", label: "Field of Study", required: false },
    ],
  },
  {
    id: "governmentIds",
    name: "Government IDs",
    icon: "🔒",
    required: false,
    conditional: true,
    sensitive: true,
    sensitivityLevel: "high",
    defaultPolicy: "confirm",
    fields: [
      { id: "ssn", label: "SSN", required: false, defaultPolicy: "confirm" },
      { id: "passportNumber", label: "Passport", required: false, defaultPolicy: "confirm" },
      { id: "driversLicenseNumber", label: "Driver's License", required: false, defaultPolicy: "confirm" },
    ],
  },
  {
    id: "voluntaryIdentity",
    name: "Voluntary Identity",
    icon: "🛡️",
    required: false,
    conditional: true,
    sensitive: true,
    sensitivityLevel: "critical",
    defaultPolicy: "never",
    fields: [
      { id: "raceEthnicity", label: "Race/Ethnicity", required: false, defaultPolicy: "never" },
      { id: "genderIdentity", label: "Gender Identity", required: false, defaultPolicy: "never" },
      { id: "disabilityStatus", label: "Disability Status", required: false, defaultPolicy: "never" },
      { id: "veteranStatus", label: "Veteran Status", required: false, defaultPolicy: "never" },
    ],
  },
];

// Modules that support multiple entries
const MULTI_ENTRY_MODULES = ['address', 'employment', 'education'];

// State
let state = {
  currentStep: 0,
  completedSteps: [],
  selectedFormTypes: [],
  currentModule: "contact",
  reviewBlocked: false,
  moduleCompletion: {
    contact: 0,
    address: 0,
    employment: 0,
    education: 0,
    governmentIds: 0,
    voluntaryIdentity: 0,
  },
  skippedModules: [],
  // Current entry index for multi-entry modules
  currentEntryIndex: {
    address: 0,
    employment: 0,
    education: 0,
  },
  // Primary entry index for multi-entry modules
  primaryEntryIndex: {
    address: 0,
    employment: 0,
    education: 0,
  },
  // Sensitive module opt-in state
  moduleOptIn: {
    governmentIds: false,
    voluntaryIdentity: false,
  },
  // Field-level autofill policies
  fieldPolicies: {
    governmentIds: {
      ssn: "confirm",
      passportNumber: "confirm",
      driversLicenseNumber: "confirm",
    },
    voluntaryIdentity: {
      raceEthnicity: "never",
      genderIdentity: "never",
      disabilityStatus: "never",
      veteranStatus: "never",
    },
  },
  // Site allowlists per module
  moduleAllowlists: {
    governmentIds: [],
    voluntaryIdentity: [],
  },
  profileV1: {
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    contact: {
      fullName: "",
      email: "",
      phone: "",
    },
    // Multi-entry modules store arrays with entries
    addresses: [
      {
        id: "addr_1",
        label: "Home",
        isPrimary: true,
        addressLine1: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
      },
    ],
    employments: [
      {
        id: "emp_1",
        label: "Current",
        isPrimary: true,
        currentEmployer: "",
        jobTitle: "",
        startDate: "",
        endDate: "",
        workEmail: "",
        isCurrent: true,
      },
    ],
    educations: [
      {
        id: "edu_1",
        label: "Highest",
        isPrimary: true,
        schoolName: "",
        degree: "",
        graduationYear: "",
        fieldOfStudy: "",
      },
    ],
    // Legacy single-entry format (for backwards compat)
    address: {
      addressLine1: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    },
    employment: {
      currentEmployer: "",
      jobTitle: "",
      startDate: "",
      workEmail: "",
    },
    education: {
      schoolName: "",
      degree: "",
      graduationYear: "",
      fieldOfStudy: "",
    },
    governmentIds: {
      ssn: "",
      passportNumber: "",
      driversLicenseNumber: "",
    },
    voluntaryIdentity: {
      raceEthnicity: "",
      genderIdentity: "",
      disabilityStatus: "",
      veteranStatus: "",
    },
  },
  // Legacy flat profile for backwards compatibility
  profile: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    zipCode: "",
    currentEmployer: "",
    jobTitle: "",
    schoolName: "",
    highestDegree: "",
  },
};

// DOM Elements
let elements = {};

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  cacheElements();
  await loadState();
  renderFormTypes();
  renderModuleSidebar();
  updateUI();
  bindEvents();
  bindModuleEvents();
  bindSensitiveModuleEvents();
});

function cacheElements() {
  elements = {
    stepCounter: document.getElementById("step-counter"),
    progressFill: document.getElementById("progress-fill"),
    timeEstimate: document.getElementById("time-estimate"),
    prevBtn: document.getElementById("prev-btn"),
    nextBtn: document.getElementById("next-btn"),
    exitBtn: document.getElementById("exit-btn"),
    formTypesGrid: document.getElementById("form-types-grid"),
    selectionSummary: document.getElementById("selection-summary"),
    reviewSections: document.getElementById("review-sections"),
    fillTestBtn: document.getElementById("fill-test-btn"),
    testResult: document.getElementById("test-result"),
    editProfileBtn: document.getElementById("edit-profile-btn"),
    fieldsFilled: document.getElementById("fields-filled"),
    formTypesCount: document.getElementById("form-types-count"),
    stepNavItems: document.querySelectorAll(".step-nav-item"),
    stepContents: document.querySelectorAll(".step-content"),
    // Module builder elements
    moduleList: document.getElementById("module-list"),
    moduleForms: document.getElementById("module-forms"),
    overallCompletionFill: document.getElementById("overall-completion-fill"),
    overallCompletionPercent: document.getElementById("overall-completion-percent"),
  };
}

async function loadState() {
  try {
    // Load from chrome.storage
    const result = await chrome.storage.local.get([
      "onboardingState",
      "selectedFormTypes",
      "profile",
      "profileV1",
      "skippedModules",
      "moduleCompletion",
      "moduleOptIn",
      "fieldPolicies",
      "moduleAllowlists",
      "currentEntryIndex",
      "primaryEntryIndex",
    ]);

    if (result.onboardingState) {
      const saved = result.onboardingState;
      state.completedSteps = saved.completedStepIds || [];
      
      // Resume from last step
      if (saved.lastStepId) {
        const stepIndex = STEPS.findIndex((s) => s.id === saved.lastStepId);
        if (stepIndex !== -1) {
          state.currentStep = stepIndex;
        }
      }
    }

    if (result.selectedFormTypes) {
      state.selectedFormTypes = result.selectedFormTypes;
    }

    if (result.skippedModules) {
      state.skippedModules = result.skippedModules;
    }

    if (result.moduleCompletion) {
      state.moduleCompletion = { ...state.moduleCompletion, ...result.moduleCompletion };
    }

    // Load multi-entry state
    if (result.currentEntryIndex) {
      state.currentEntryIndex = { ...state.currentEntryIndex, ...result.currentEntryIndex };
    }

    if (result.primaryEntryIndex) {
      state.primaryEntryIndex = { ...state.primaryEntryIndex, ...result.primaryEntryIndex };
    }

    // Load sensitive module state
    if (result.moduleOptIn) {
      state.moduleOptIn = { ...state.moduleOptIn, ...result.moduleOptIn };
    }

    if (result.fieldPolicies) {
      state.fieldPolicies = { ...state.fieldPolicies, ...result.fieldPolicies };
    }

    if (result.moduleAllowlists) {
      state.moduleAllowlists = { ...state.moduleAllowlists, ...result.moduleAllowlists };
    }

    // Load profileV1 if it exists
    if (result.profileV1) {
      state.profileV1 = { ...state.profileV1, ...result.profileV1 };
      updateLegacyProfile();
    } else if (result.profile) {
      // Migrate from legacy flat profile
      const p = result.profile;
      if (p.version === 1) {
        // New structured profile from lib/profileSchema
        state.profile.firstName = p.personal?.firstName?.value || "";
        state.profile.lastName = p.personal?.lastName?.value || "";
        state.profile.email = p.contact?.email?.value || "";
        state.profile.phone = p.contact?.phone?.value || "";
        state.profile.addressLine1 = p.address?.addressLine1?.value || "";
        state.profile.city = p.address?.city?.value || "";
        state.profile.state = p.address?.state?.value || "";
        state.profile.zipCode = p.address?.zipCode?.value || "";
        state.profile.currentEmployer = p.employment?.currentEmployer?.value || "";
        state.profile.jobTitle = p.employment?.jobTitle?.value || "";
        state.profile.schoolName = p.education?.schoolName?.value || "";
        state.profile.highestDegree = p.education?.highestDegree?.value || "";
      } else {
        // Legacy flat profile - migrate to profileV1
        const fullName = p.fullName || "";
        state.profileV1.contact.fullName = fullName;
        state.profileV1.contact.email = p.email || "";
        state.profileV1.contact.phone = p.phone || "";
        state.profileV1.address.addressLine1 = p.addressLine1 || "";
        state.profileV1.address.city = p.city || "";
        state.profileV1.address.state = p.state || "";
        state.profileV1.address.zipCode = p.zip || "";
        
        // Update legacy profile
        state.profile.firstName = fullName.split(" ")[0] || "";
        state.profile.lastName = fullName.split(" ").slice(1).join(" ") || "";
        state.profile.email = p.email || "";
        state.profile.phone = p.phone || "";
        state.profile.addressLine1 = p.addressLine1 || "";
        state.profile.city = p.city || "";
        state.profile.state = p.state || "";
        state.profile.zipCode = p.zip || "";
      }
    }

    // Populate form fields
    populateFormFields();
    
    // Load profile data into new module forms
    setTimeout(() => {
      loadProfileIntoForms();
    }, 100);
  } catch (error) {
    console.error("Error loading state:", error);
  }
}

async function saveState() {
  try {
    const onboardingState = {
      completedStepIds: state.completedSteps,
      lastStepId: STEPS[state.currentStep].id,
      startedAt: new Date().toISOString(),
      isComplete: state.currentStep === STEPS.length - 1,
      wasSkipped: false,
    };

    await chrome.storage.local.set({
      onboardingState,
      selectedFormTypes: state.selectedFormTypes,
    });
  } catch (error) {
    console.error("Error saving state:", error);
  }
}

async function saveProfile() {
  try {
    // Read form fields
    readFormFields();

    // Save as legacy format for now (compatible with existing content script)
    const legacyProfile = {
      fullName: `${state.profile.firstName} ${state.profile.lastName}`.trim(),
      email: state.profile.email,
      phone: state.profile.phone,
      addressLine1: state.profile.addressLine1,
      city: state.profile.city,
      state: state.profile.state,
      zip: state.profile.zipCode,
    };

    await chrome.storage.local.set({ profile: legacyProfile });
  } catch (error) {
    console.error("Error saving profile:", error);
  }
}

function populateFormFields() {
  const fields = [
    "firstName", "lastName", "email", "phone",
    "addressLine1", "city", "state", "zipCode",
    "currentEmployer", "jobTitle", "schoolName", "highestDegree",
  ];

  fields.forEach((field) => {
    const input = document.getElementById(field);
    if (input && state.profile[field]) {
      input.value = state.profile[field];
    }
  });
}

function readFormFields() {
  const fields = [
    "firstName", "lastName", "email", "phone",
    "addressLine1", "city", "state", "zipCode",
    "currentEmployer", "jobTitle", "schoolName", "highestDegree",
  ];

  fields.forEach((field) => {
    const input = document.getElementById(field);
    if (input) {
      state.profile[field] = input.value.trim();
    }
  });
}

function renderFormTypes() {
  if (!elements.formTypesGrid) return;

  elements.formTypesGrid.innerHTML = FORM_TYPES.map((ft) => `
    <div class="form-type-card ${state.selectedFormTypes.includes(ft.id) ? 'selected' : ''}" data-form-type="${ft.id}">
      <div class="form-type-main">
        <span class="form-type-icon">${ft.icon}</span>
        <div class="form-type-info">
          <h4 class="form-type-title">${ft.title}</h4>
          <p class="form-type-desc">${ft.description}</p>
          <p class="form-type-examples">${ft.examples}</p>
        </div>
        <div class="form-type-check">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
      </div>
      <div class="form-type-meta">
        <span class="form-type-modules" title="Profile sections unlocked">
          <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          ${ft.modulesUnlocked.length > 0 ? '+' + ft.modulesUnlocked.join(', +') : 'Basic fields only'}
        </span>
        <span class="form-type-time" title="Estimated time saved per form">
          <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          ${ft.timeSaved}
        </span>
      </div>
    </div>
  `).join("");

  // Bind click events
  document.querySelectorAll(".form-type-card").forEach((card) => {
    card.addEventListener("click", () => {
      const formType = card.dataset.formType;
      toggleFormType(formType);
    });
  });
}

function toggleFormType(formType) {
  const index = state.selectedFormTypes.indexOf(formType);
  if (index === -1) {
    state.selectedFormTypes.push(formType);
  } else {
    state.selectedFormTypes.splice(index, 1);
  }

  // Update UI
  document.querySelectorAll(".form-type-card").forEach((card) => {
    const isSelected = state.selectedFormTypes.includes(card.dataset.formType);
    card.classList.toggle("selected", isSelected);
  });

  updateSelectionSummary();
  updateConditionalModules();
  updateNextButton();
  saveState();
}

function updateSelectionSummary() {
  if (!elements.selectionSummary) return;

  const count = state.selectedFormTypes.length;
  
  // Calculate unique modules unlocked
  const modulesUnlocked = new Set();
  state.selectedFormTypes.forEach((ftId) => {
    const ft = FORM_TYPES.find((f) => f.id === ftId);
    if (ft && ft.modulesUnlocked) {
      ft.modulesUnlocked.forEach((m) => modulesUnlocked.add(m));
    }
  });
  
  // Build summary HTML
  if (count === 0) {
    elements.selectionSummary.innerHTML = `
      <div class="summary-empty">
        <svg class="summary-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v4M12 16h.01"/>
        </svg>
        <span class="summary-text">Select at least one form type to continue</span>
      </div>
    `;
    elements.selectionSummary.classList.remove("has-selection");
  } else {
    const modulesList = modulesUnlocked.size > 0 
      ? Array.from(modulesUnlocked).join(", ") 
      : "Basic contact info";
    
    elements.selectionSummary.innerHTML = `
      <div class="summary-selected">
        <div class="summary-count">
          <svg class="summary-icon success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <path d="M22 4L12 14.01l-3-3"/>
          </svg>
          <span class="summary-text has-selection">${count} form type${count > 1 ? 's' : ''} selected</span>
        </div>
        <div class="summary-modules">
          <span class="summary-label">Your profile will include:</span>
          <span class="summary-value">Personal, Contact, Address${modulesUnlocked.size > 0 ? ', ' + modulesList : ''}</span>
        </div>
        <p class="summary-note">This customizes which profile sections you'll fill out next.</p>
      </div>
    `;
    elements.selectionSummary.classList.add("has-selection");
  }
}

function updateConditionalModules() {
  // Determine which modules to show based on selected form types
  const modulesToShow = new Set();
  
  state.selectedFormTypes.forEach((ft) => {
    const modules = FORM_TYPE_MODULES[ft] || [];
    modules.forEach((m) => modulesToShow.add(m));
  });

  // Update visibility for old-style modules
  document.querySelectorAll(".profile-module.conditional").forEach((module) => {
    const moduleId = module.dataset.module;
    module.classList.toggle("visible", modulesToShow.has(moduleId));
  });

  // Update visibility for new module forms
  document.querySelectorAll(".module-form.conditional").forEach((form) => {
    const moduleId = form.dataset.module;
    form.classList.toggle("visible", modulesToShow.has(moduleId));
  });

  // Update visibility for module list items
  document.querySelectorAll(".module-list-item.conditional").forEach((item) => {
    const moduleId = item.dataset.module;
    item.classList.toggle("visible", modulesToShow.has(moduleId));
  });

  // Update time estimate
  let baseMinutes = 3; // Personal + Address
  if (modulesToShow.has("employment")) baseMinutes += 2;
  if (modulesToShow.has("education")) baseMinutes += 2;
  
  if (elements.timeEstimate) {
    elements.timeEstimate.textContent = `~${baseMinutes} minutes`;
  }
}

// ============================================================================
// Module Sidebar & Forms
// ============================================================================

function renderModuleSidebar() {
  if (!elements.moduleList) return;

  // Get which conditional modules should be visible
  const visibleConditionalModules = new Set();
  state.selectedFormTypes.forEach((ft) => {
    const modules = FORM_TYPE_MODULES[ft] || [];
    modules.forEach((m) => visibleConditionalModules.add(m));
  });

  elements.moduleList.innerHTML = PROFILE_MODULES.map((mod) => {
    const isConditional = mod.conditional;
    const isVisible = !isConditional || visibleConditionalModules.has(mod.id);
    const isActive = state.currentModule === mod.id;
    const completion = state.moduleCompletion[mod.id] || 0;
    const isCompleted = completion === 100;
    const isSkipped = state.skippedModules.includes(mod.id);
    const isSensitive = mod.sensitive || false;
    const isOptedIn = state.moduleOptIn[mod.id] || false;

    let statusText;
    if (isSensitive && !isOptedIn) {
      statusText = "Disabled";
    } else if (isSkipped) {
      statusText = "Skipped";
    } else if (isCompleted) {
      statusText = "Complete";
    } else if (completion > 0) {
      statusText = `${completion}%`;
    } else if (mod.required) {
      statusText = "Required";
    } else if (isSensitive) {
      statusText = "Sensitive";
    } else {
      statusText = "Optional";
    }

    const sensitiveClass = isSensitive ? 'sensitive' : '';
    const optedInClass = isSensitive && isOptedIn ? 'opted-in' : '';

    return `
      <button class="module-list-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isSkipped ? 'skipped' : ''} ${isConditional ? 'conditional' : ''} ${isVisible ? 'visible' : ''} ${sensitiveClass} ${optedInClass}" 
              data-module="${mod.id}">
        <span class="module-list-icon">${mod.icon}</span>
        <div class="module-list-info">
          <div class="module-list-name">${mod.name}</div>
          <div class="module-list-status">${statusText}</div>
        </div>
        ${isCompleted ? '<span class="module-list-completion complete">✓</span>' : ''}
      </button>
    `;
  }).join("");

  // Bind click events
  document.querySelectorAll(".module-list-item").forEach((item) => {
    item.addEventListener("click", () => {
      const moduleId = item.dataset.module;
      switchToModule(moduleId);
    });
  });

  // Update overall completion
  updateOverallCompletion();
}

function switchToModule(moduleId) {
  state.currentModule = moduleId;

  // Update sidebar
  document.querySelectorAll(".module-list-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.module === moduleId);
  });

  // Update form visibility
  document.querySelectorAll(".module-form").forEach((form) => {
    form.classList.toggle("active", form.dataset.module === moduleId);
  });
}

function calculateModuleCompletion(moduleId) {
  const mod = PROFILE_MODULES.find((m) => m.id === moduleId);
  if (!mod) return 0;

  let moduleData;
  
  // Handle multi-entry modules - use primary entry
  if (MULTI_ENTRY_MODULES.includes(moduleId)) {
    const primaryEntry = getPrimaryEntry(moduleId);
    moduleData = primaryEntry || {};
  } else {
    moduleData = state.profileV1[moduleId] || {};
  }

  let filledCount = 0;
  let totalCount = mod.fields.length;

  mod.fields.forEach((field) => {
    const value = moduleData[field.id];
    if (value && value.toString().trim() !== "") {
      filledCount++;
    }
  });

  return totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 0;
}

function updateModuleCompletion(moduleId) {
  const completion = calculateModuleCompletion(moduleId);
  state.moduleCompletion[moduleId] = completion;

  // Update the completion bar in the form header
  const fillEl = document.getElementById(`${moduleId}-completion-fill`);
  const textEl = document.getElementById(`${moduleId}-completion-text`);
  
  if (fillEl) {
    fillEl.style.width = `${completion}%`;
  }
  if (textEl) {
    textEl.textContent = `${completion}% complete`;
  }

  // Update sidebar
  renderModuleSidebar();
}

function updateOverallCompletion() {
  // Calculate overall completion across visible modules
  const visibleConditionalModules = new Set();
  state.selectedFormTypes.forEach((ft) => {
    const modules = FORM_TYPE_MODULES[ft] || [];
    modules.forEach((m) => visibleConditionalModules.add(m));
  });

  let totalCompletion = 0;
  let moduleCount = 0;

  PROFILE_MODULES.forEach((mod) => {
    const isVisible = !mod.conditional || visibleConditionalModules.has(mod.id);
    if (isVisible) {
      totalCompletion += state.moduleCompletion[mod.id] || 0;
      moduleCount++;
    }
  });

  const overallPercent = moduleCount > 0 ? Math.round(totalCompletion / moduleCount) : 0;

  if (elements.overallCompletionFill) {
    elements.overallCompletionFill.style.width = `${overallPercent}%`;
  }
  if (elements.overallCompletionPercent) {
    elements.overallCompletionPercent.textContent = `${overallPercent}%`;
  }
}

function bindModuleEvents() {
  // Save on blur for all module inputs
  document.querySelectorAll(".module-form input").forEach((input) => {
    input.addEventListener("blur", () => {
      const moduleId = input.dataset.module;
      const fieldId = input.dataset.field;
      
      if (moduleId && fieldId) {
        saveFieldValue(moduleId, fieldId, input.value);
      }
    });

    // Clear error on input
    input.addEventListener("input", () => {
      input.classList.remove("error");
      const errorEl = document.getElementById(`${input.id}-error`);
      if (errorEl) {
        errorEl.textContent = "";
      }
    });
  });

  // Save module buttons
  document.querySelectorAll(".save-module-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const moduleId = btn.dataset.module;
      await saveModule(moduleId);
    });
  });

  // Skip module buttons
  document.querySelectorAll(".skip-module-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const moduleId = btn.dataset.module;
      skipModule(moduleId);
    });
  });
}

function saveFieldValue(moduleId, fieldId, value) {
  // Handle entry label separately for multi-entry modules
  if (fieldId === 'entryLabel' && MULTI_ENTRY_MODULES.includes(moduleId)) {
    const currentIndex = state.currentEntryIndex[moduleId] || 0;
    updateEntryLabel(moduleId, currentIndex, value.trim());
    return;
  }

  // Handle multi-entry modules
  if (MULTI_ENTRY_MODULES.includes(moduleId)) {
    saveCurrentEntryFromForm(moduleId);
    state.profileV1.updatedAt = new Date().toISOString();
    updateLegacyProfile();
    updateModuleCompletion(moduleId);
    return;
  }

  // Single-entry modules
  if (!state.profileV1[moduleId]) {
    state.profileV1[moduleId] = {};
  }
  state.profileV1[moduleId][fieldId] = value.trim();
  state.profileV1.updatedAt = new Date().toISOString();

  // Update legacy profile for backwards compatibility
  updateLegacyProfile();

  // Update completion
  updateModuleCompletion(moduleId);
}

function updateLegacyProfile() {
  // Map profileV1 to legacy flat profile
  const contact = state.profileV1.contact || {};
  const address = state.profileV1.address || {};
  const employment = state.profileV1.employment || {};
  const education = state.profileV1.education || {};

  // Parse fullName into first/last
  const nameParts = (contact.fullName || "").trim().split(/\s+/);
  state.profile.firstName = nameParts[0] || "";
  state.profile.lastName = nameParts.slice(1).join(" ") || "";
  
  state.profile.email = contact.email || "";
  state.profile.phone = contact.phone || "";
  state.profile.addressLine1 = address.addressLine1 || "";
  state.profile.city = address.city || "";
  state.profile.state = address.state || "";
  state.profile.zipCode = address.zipCode || "";
  state.profile.currentEmployer = employment.currentEmployer || "";
  state.profile.jobTitle = employment.jobTitle || "";
  state.profile.schoolName = education.schoolName || "";
  state.profile.highestDegree = education.degree || "";
}

function validateModule(moduleId) {
  const mod = PROFILE_MODULES.find((m) => m.id === moduleId);
  if (!mod) return { valid: true, errors: [] };

  const errors = [];
  const moduleData = state.profileV1[moduleId] || {};

  mod.fields.forEach((field) => {
    if (field.required) {
      const value = moduleData[field.id];
      if (!value || value.toString().trim() === "") {
        errors.push({ fieldId: field.id, message: `${field.label} is required` });
      }
    }
  });

  return { valid: errors.length === 0, errors };
}

async function saveModule(moduleId) {
  // Read all fields from the form
  document.querySelectorAll(`.module-form[data-module="${moduleId}"] input`).forEach((input) => {
    const fieldId = input.dataset.field;
    if (fieldId) {
      saveFieldValue(moduleId, fieldId, input.value);
    }
  });

  // Validate required fields
  const mod = PROFILE_MODULES.find((m) => m.id === moduleId);
  const validation = validateModule(moduleId);

  if (!validation.valid && mod?.required) {
    // Show errors
    validation.errors.forEach((err) => {
      const input = document.querySelector(`input[data-field="${err.fieldId}"]`);
      if (input) {
        input.classList.add("error");
      }
      const errorEl = document.getElementById(`${err.fieldId}-error`);
      if (errorEl) {
        errorEl.textContent = err.message;
      }
    });

    showSaveStatus(moduleId, "Please fill required fields", "error");
    return false;
  }

  // Save to storage
  try {
    await saveProfileV1ToStorage();
    showSaveStatus(moduleId, "Saved!", "success");

    // Move to next module if current is complete
    const completion = calculateModuleCompletion(moduleId);
    if (completion === 100) {
      const nextModule = getNextVisibleModule(moduleId);
      if (nextModule) {
        setTimeout(() => switchToModule(nextModule.id), 500);
      }
    }

    return true;
  } catch (error) {
    console.error("Error saving module:", error);
    showSaveStatus(moduleId, "Error saving", "error");
    return false;
  }
}

function skipModule(moduleId) {
  if (!state.skippedModules.includes(moduleId)) {
    state.skippedModules.push(moduleId);
  }

  showSaveStatus(moduleId, "Skipped", "success");

  // Move to next module
  const nextModule = getNextVisibleModule(moduleId);
  if (nextModule) {
    setTimeout(() => switchToModule(nextModule.id), 300);
  }

  renderModuleSidebar();
}

function getNextVisibleModule(currentModuleId) {
  const visibleConditionalModules = new Set();
  state.selectedFormTypes.forEach((ft) => {
    const modules = FORM_TYPE_MODULES[ft] || [];
    modules.forEach((m) => visibleConditionalModules.add(m));
  });

  const visibleModules = PROFILE_MODULES.filter((mod) => {
    return !mod.conditional || visibleConditionalModules.has(mod.id);
  });

  const currentIndex = visibleModules.findIndex((m) => m.id === currentModuleId);
  if (currentIndex !== -1 && currentIndex < visibleModules.length - 1) {
    return visibleModules[currentIndex + 1];
  }
  return null;
}

function showSaveStatus(moduleId, message, type) {
  const statusEl = document.getElementById(`${moduleId}-save-status`);
  if (statusEl) {
    statusEl.textContent = message;
    statusEl.className = `save-status ${type}`;

    setTimeout(() => {
      statusEl.textContent = "";
      statusEl.className = "save-status";
    }, 3000);
  }
}

async function saveProfileV1ToStorage() {
  // Sync multi-entry primary to legacy single-entry format
  syncMultiEntryToLegacy();

  // Save profileV1 structure with sensitive module metadata
  await chrome.storage.local.set({
    profileV1: state.profileV1,
    skippedModules: state.skippedModules,
    moduleCompletion: state.moduleCompletion,
    moduleOptIn: state.moduleOptIn,
    fieldPolicies: state.fieldPolicies,
    moduleAllowlists: state.moduleAllowlists,
    currentEntryIndex: state.currentEntryIndex,
    primaryEntryIndex: state.primaryEntryIndex,
  });

  // Also save legacy format for content script compatibility
  const legacyProfile = buildLegacyProfile();
  await chrome.storage.local.set({ profile: legacyProfile });
}

function buildLegacyProfile() {
  // Build legacy flat profile using primary entries
  const primaryAddress = getPrimaryEntry('address');
  const primaryEmployment = getPrimaryEntry('employment');
  const primaryEducation = getPrimaryEntry('education');

  return {
    fullName: `${state.profile.firstName} ${state.profile.lastName}`.trim(),
    email: state.profile.email,
    phone: state.profile.phone,
    addressLine1: primaryAddress?.addressLine1 || state.profile.addressLine1,
    city: primaryAddress?.city || state.profile.city,
    state: primaryAddress?.state || state.profile.state,
    zip: primaryAddress?.zipCode || state.profile.zipCode,
    currentEmployer: primaryEmployment?.currentEmployer || state.profile.currentEmployer,
    jobTitle: primaryEmployment?.jobTitle || state.profile.jobTitle,
    schoolName: primaryEducation?.schoolName || state.profile.schoolName,
    degree: primaryEducation?.degree || state.profile.highestDegree,
  };
}

function syncMultiEntryToLegacy() {
  // Sync primary entries to legacy single-entry format for backwards compat
  const primaryAddress = getPrimaryEntry('address');
  if (primaryAddress) {
    state.profileV1.address = {
      addressLine1: primaryAddress.addressLine1 || '',
      city: primaryAddress.city || '',
      state: primaryAddress.state || '',
      zipCode: primaryAddress.zipCode || '',
      country: primaryAddress.country || 'United States',
    };
  }

  const primaryEmployment = getPrimaryEntry('employment');
  if (primaryEmployment) {
    state.profileV1.employment = {
      currentEmployer: primaryEmployment.currentEmployer || '',
      jobTitle: primaryEmployment.jobTitle || '',
      startDate: primaryEmployment.startDate || '',
      workEmail: primaryEmployment.workEmail || '',
    };
  }

  const primaryEducation = getPrimaryEntry('education');
  if (primaryEducation) {
    state.profileV1.education = {
      schoolName: primaryEducation.schoolName || '',
      degree: primaryEducation.degree || '',
      graduationYear: primaryEducation.graduationYear || '',
      fieldOfStudy: primaryEducation.fieldOfStudy || '',
    };
  }
}

function loadProfileIntoForms() {
  // Load profileV1 data into form fields
  PROFILE_MODULES.forEach((mod) => {
    if (MULTI_ENTRY_MODULES.includes(mod.id)) {
      // Multi-entry module: load current entry
      loadMultiEntryModuleIntoForm(mod.id);
    } else {
      // Single-entry module
      const moduleData = state.profileV1[mod.id] || {};
      
      mod.fields.forEach((field) => {
        const input = document.querySelector(`input[data-module="${mod.id}"][data-field="${field.id}"]`);
        if (input && moduleData[field.id]) {
          input.value = moduleData[field.id];
        }
      });
    }

    // Update completion
    updateModuleCompletion(mod.id);
  });

  // Render multi-entry tabs
  MULTI_ENTRY_MODULES.forEach(moduleId => {
    renderEntryTabs(moduleId);
  });

  // Load sensitive module states
  loadSensitiveModuleStates();
}

// ============================================================================
// Multi-Entry Module Handling
// ============================================================================

function getEntriesArray(moduleId) {
  const arrayKey = moduleId === 'address' ? 'addresses' : 
                   moduleId === 'employment' ? 'employments' : 
                   moduleId === 'education' ? 'educations' : null;
  if (!arrayKey) return [];
  return state.profileV1[arrayKey] || [];
}

function setEntriesArray(moduleId, entries) {
  const arrayKey = moduleId === 'address' ? 'addresses' : 
                   moduleId === 'employment' ? 'employments' : 
                   moduleId === 'education' ? 'educations' : null;
  if (arrayKey) {
    state.profileV1[arrayKey] = entries;
  }
}

function getCurrentEntry(moduleId) {
  const entries = getEntriesArray(moduleId);
  const index = state.currentEntryIndex[moduleId] || 0;
  return entries[index] || null;
}

function getPrimaryEntry(moduleId) {
  const entries = getEntriesArray(moduleId);
  return entries.find(e => e.isPrimary) || entries[0] || null;
}

function generateEntryId(moduleId) {
  const prefix = moduleId === 'address' ? 'addr' : 
                 moduleId === 'employment' ? 'emp' : 
                 moduleId === 'education' ? 'edu' : 'entry';
  return `${prefix}_${Date.now()}`;
}

function createEmptyEntry(moduleId) {
  const id = generateEntryId(moduleId);
  const entries = getEntriesArray(moduleId);
  const entryNum = entries.length + 1;

  if (moduleId === 'address') {
    return {
      id,
      label: `Address ${entryNum}`,
      isPrimary: entries.length === 0,
      addressLine1: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    };
  } else if (moduleId === 'employment') {
    return {
      id,
      label: `Job ${entryNum}`,
      isPrimary: entries.length === 0,
      currentEmployer: '',
      jobTitle: '',
      startDate: '',
      endDate: '',
      workEmail: '',
      isCurrent: false,
    };
  } else if (moduleId === 'education') {
    return {
      id,
      label: `Education ${entryNum}`,
      isPrimary: entries.length === 0,
      schoolName: '',
      degree: '',
      graduationYear: '',
      fieldOfStudy: '',
    };
  }
  return { id, label: `Entry ${entryNum}`, isPrimary: false };
}

function addEntry(moduleId) {
  const entries = getEntriesArray(moduleId);
  const newEntry = createEmptyEntry(moduleId);
  entries.push(newEntry);
  setEntriesArray(moduleId, entries);

  // Switch to new entry
  state.currentEntryIndex[moduleId] = entries.length - 1;

  // Update UI
  renderEntryTabs(moduleId);
  loadMultiEntryModuleIntoForm(moduleId);
  updateModuleCompletion(moduleId);

  // Save
  saveProfileV1ToStorage();
}

function removeEntry(moduleId, entryIndex) {
  const entries = getEntriesArray(moduleId);
  
  if (entries.length <= 1) {
    // Can't remove the last entry
    return;
  }

  const removedEntry = entries[entryIndex];
  entries.splice(entryIndex, 1);

  // If we removed the primary, make the first entry primary
  if (removedEntry.isPrimary && entries.length > 0) {
    entries[0].isPrimary = true;
    state.primaryEntryIndex[moduleId] = 0;
  }

  // Adjust current index if needed
  if (state.currentEntryIndex[moduleId] >= entries.length) {
    state.currentEntryIndex[moduleId] = entries.length - 1;
  }

  setEntriesArray(moduleId, entries);

  // Update UI
  renderEntryTabs(moduleId);
  loadMultiEntryModuleIntoForm(moduleId);
  updateModuleCompletion(moduleId);

  // Save
  saveProfileV1ToStorage();
}

function switchToEntry(moduleId, entryIndex) {
  // Save current entry first
  saveCurrentEntryFromForm(moduleId);

  // Switch
  state.currentEntryIndex[moduleId] = entryIndex;

  // Load new entry
  loadMultiEntryModuleIntoForm(moduleId);
  renderEntryTabs(moduleId);
}

function setPrimaryEntry(moduleId, entryIndex) {
  const entries = getEntriesArray(moduleId);
  
  // Clear all isPrimary
  entries.forEach((e, i) => {
    e.isPrimary = (i === entryIndex);
  });

  state.primaryEntryIndex[moduleId] = entryIndex;
  setEntriesArray(moduleId, entries);

  // Update UI
  renderEntryTabs(moduleId);

  // Save
  saveProfileV1ToStorage();
}

function updateEntryLabel(moduleId, entryIndex, label) {
  const entries = getEntriesArray(moduleId);
  if (entries[entryIndex]) {
    entries[entryIndex].label = label;
    setEntriesArray(moduleId, entries);
    renderEntryTabs(moduleId);
    saveProfileV1ToStorage();
  }
}

function saveCurrentEntryFromForm(moduleId) {
  const entries = getEntriesArray(moduleId);
  const index = state.currentEntryIndex[moduleId] || 0;
  const entry = entries[index];
  
  if (!entry) return;

  const mod = PROFILE_MODULES.find(m => m.id === moduleId);
  if (!mod) return;

  mod.fields.forEach((field) => {
    const input = document.querySelector(`input[data-module="${moduleId}"][data-field="${field.id}"]`);
    if (input) {
      entry[field.id] = input.value.trim();
    }
  });

  setEntriesArray(moduleId, entries);
  state.profileV1.updatedAt = new Date().toISOString();
}

function loadMultiEntryModuleIntoForm(moduleId) {
  const entry = getCurrentEntry(moduleId);
  const mod = PROFILE_MODULES.find(m => m.id === moduleId);
  
  if (!entry || !mod) return;

  mod.fields.forEach((field) => {
    const input = document.querySelector(`input[data-module="${moduleId}"][data-field="${field.id}"]`);
    if (input) {
      input.value = entry[field.id] || '';
    }
  });

  // Update label input if exists
  const labelInput = document.querySelector(`input[data-module="${moduleId}"][data-field="entryLabel"]`);
  if (labelInput) {
    labelInput.value = entry.label || '';
  }
}

function renderEntryTabs(moduleId) {
  const container = document.getElementById(`${moduleId}-entry-tabs`);
  if (!container) return;

  const entries = getEntriesArray(moduleId);
  const currentIndex = state.currentEntryIndex[moduleId] || 0;

  container.innerHTML = `
    <div class="entry-tabs-list">
      ${entries.map((entry, index) => `
        <button class="entry-tab ${index === currentIndex ? 'active' : ''} ${entry.isPrimary ? 'primary' : ''}"
                data-module="${moduleId}" data-index="${index}">
          <span class="entry-tab-label">${entry.label || `Entry ${index + 1}`}</span>
          ${entry.isPrimary ? '<span class="primary-badge">Primary</span>' : ''}
        </button>
      `).join('')}
      <button class="entry-tab add-entry-btn" data-module="${moduleId}" title="Add entry">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
    </div>
    <div class="entry-actions">
      ${entries.length > 1 ? `
        <button class="entry-action-btn set-primary-btn ${entries[currentIndex]?.isPrimary ? 'is-primary' : ''}" 
                data-module="${moduleId}" data-index="${currentIndex}"
                ${entries[currentIndex]?.isPrimary ? 'disabled' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          ${entries[currentIndex]?.isPrimary ? 'Primary' : 'Set as Primary'}
        </button>
        <button class="entry-action-btn remove-entry-btn" data-module="${moduleId}" data-index="${currentIndex}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          Remove
        </button>
      ` : ''}
    </div>
  `;

  // Bind events
  container.querySelectorAll('.entry-tab:not(.add-entry-btn)').forEach(btn => {
    btn.addEventListener('click', () => {
      switchToEntry(moduleId, parseInt(btn.dataset.index, 10));
    });
  });

  container.querySelectorAll('.add-entry-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      addEntry(moduleId);
    });
  });

  container.querySelectorAll('.set-primary-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setPrimaryEntry(moduleId, parseInt(btn.dataset.index, 10));
    });
  });

  container.querySelectorAll('.remove-entry-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Remove this entry? This cannot be undone.')) {
        removeEntry(moduleId, parseInt(btn.dataset.index, 10));
      }
    });
  });
}

// ============================================================================
// Sensitive Module Handling
// ============================================================================

function loadSensitiveModuleStates() {
  // Apply opt-in states
  PROFILE_MODULES.filter(m => m.sensitive).forEach((mod) => {
    const isOptedIn = state.moduleOptIn[mod.id] || false;
    
    if (isOptedIn) {
      showSensitiveModuleContent(mod.id);
    }

    // Update opt-in checkbox
    const checkbox = document.getElementById(`${mod.id}-optin`);
    if (checkbox) {
      checkbox.checked = isOptedIn;
    }

    // Load field policies
    const policies = state.fieldPolicies[mod.id] || {};
    Object.keys(policies).forEach((fieldId) => {
      const select = document.querySelector(`select[data-module="${mod.id}"][data-field="${fieldId}"]`);
      if (select) {
        select.value = policies[fieldId];
      }
    });

    // Load allowlist
    renderAllowlistChips(mod.id);
  });
}

function showSensitiveModuleContent(moduleId) {
  const gate = document.getElementById(`${moduleId}-gate`);
  const content = document.getElementById(`${moduleId}-content`);
  
  if (gate) gate.style.display = 'none';
  if (content) content.style.display = 'block';
}

function hideSensitiveModuleContent(moduleId) {
  const gate = document.getElementById(`${moduleId}-gate`);
  const content = document.getElementById(`${moduleId}-content`);
  
  if (gate) gate.style.display = 'block';
  if (content) content.style.display = 'none';
}

function handleOptInToggle(moduleId, isOptedIn) {
  state.moduleOptIn[moduleId] = isOptedIn;
  
  if (isOptedIn) {
    showSensitiveModuleContent(moduleId);
  } else {
    hideSensitiveModuleContent(moduleId);
  }
  
  // Update sidebar
  renderModuleSidebar();
  
  // Save state
  saveProfileV1ToStorage();
}

function handleRevealToggle(fieldId) {
  const input = document.getElementById(fieldId);
  const btn = document.querySelector(`.reveal-btn[data-field="${fieldId}"]`);
  
  if (input && btn) {
    const isRevealed = input.type === 'text';
    input.type = isRevealed ? 'password' : 'text';
    input.classList.toggle('revealed', !isRevealed);
    btn.classList.toggle('active', !isRevealed);
  }
}

function handlePolicyChange(moduleId, fieldId, policy) {
  if (!state.fieldPolicies[moduleId]) {
    state.fieldPolicies[moduleId] = {};
  }
  state.fieldPolicies[moduleId][fieldId] = policy;
  
  // Save immediately
  saveProfileV1ToStorage();
}

function addToAllowlist(moduleId, domain) {
  // Normalize domain
  domain = domain.trim().toLowerCase();
  
  // Remove protocol if present
  domain = domain.replace(/^https?:\/\//, '');
  
  // Remove path if present
  domain = domain.split('/')[0];
  
  if (!domain) return;
  
  if (!state.moduleAllowlists[moduleId]) {
    state.moduleAllowlists[moduleId] = [];
  }
  
  if (!state.moduleAllowlists[moduleId].includes(domain)) {
    state.moduleAllowlists[moduleId].push(domain);
    renderAllowlistChips(moduleId);
    saveProfileV1ToStorage();
  }
}

function removeFromAllowlist(moduleId, domain) {
  if (!state.moduleAllowlists[moduleId]) return;
  
  const index = state.moduleAllowlists[moduleId].indexOf(domain);
  if (index > -1) {
    state.moduleAllowlists[moduleId].splice(index, 1);
    renderAllowlistChips(moduleId);
    saveProfileV1ToStorage();
  }
}

function renderAllowlistChips(moduleId) {
  const container = document.getElementById(`${moduleId}-allowlist-chips`);
  if (!container) return;
  
  const domains = state.moduleAllowlists[moduleId] || [];
  
  container.innerHTML = domains.map((domain) => `
    <span class="allowlist-chip">
      ${domain}
      <button type="button" class="chip-remove" data-module="${moduleId}" data-domain="${domain}">×</button>
    </span>
  `).join('');
  
  // Bind remove events
  container.querySelectorAll('.chip-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeFromAllowlist(btn.dataset.module, btn.dataset.domain);
    });
  });
}

function disableAndClearSensitiveModule(moduleId) {
  // Clear all field values
  const mod = PROFILE_MODULES.find(m => m.id === moduleId);
  if (mod) {
    mod.fields.forEach((field) => {
      if (state.profileV1[moduleId]) {
        state.profileV1[moduleId][field.id] = '';
      }
      
      const input = document.getElementById(field.id);
      if (input) {
        input.value = '';
      }
    });
  }
  
  // Clear allowlist
  state.moduleAllowlists[moduleId] = [];
  
  // Reset policies to defaults
  if (mod) {
    mod.fields.forEach((field) => {
      if (state.fieldPolicies[moduleId]) {
        state.fieldPolicies[moduleId][field.id] = field.defaultPolicy || mod.defaultPolicy || 'confirm';
      }
    });
  }
  
  // Disable opt-in
  state.moduleOptIn[moduleId] = false;
  
  const checkbox = document.getElementById(`${moduleId}-optin`);
  if (checkbox) {
    checkbox.checked = false;
  }
  
  hideSensitiveModuleContent(moduleId);
  
  // Update completion
  updateModuleCompletion(moduleId);
  renderModuleSidebar();
  
  // Save
  saveProfileV1ToStorage();
  
  showSaveStatus(moduleId, 'Cleared and disabled', 'success');
}

function bindSensitiveModuleEvents() {
  // Opt-in checkboxes
  document.querySelectorAll('.optin-checkbox').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      handleOptInToggle(checkbox.dataset.module, checkbox.checked);
    });
  });
  
  // Reveal buttons
  document.querySelectorAll('.reveal-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      handleRevealToggle(btn.dataset.field);
    });
  });
  
  // Policy selects
  document.querySelectorAll('.policy-select').forEach((select) => {
    select.addEventListener('change', () => {
      handlePolicyChange(select.dataset.module, select.dataset.field, select.value);
    });
  });
  
  // Allowlist add buttons
  document.querySelectorAll('.add-allowlist-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const moduleId = btn.dataset.module;
      const input = document.getElementById(`${moduleId}-allowlist-input`);
      if (input && input.value.trim()) {
        addToAllowlist(moduleId, input.value);
        input.value = '';
      }
    });
  });
  
  // Allowlist input enter key
  document.querySelectorAll('.allowlist-input').forEach((input) => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const moduleId = input.id.replace('-allowlist-input', '');
        if (input.value.trim()) {
          addToAllowlist(moduleId, input.value);
          input.value = '';
        }
      }
    });
  });
  
  // Disable & Clear buttons
  document.querySelectorAll('[id$="-disable-btn"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (confirm('This will clear all data in this module and disable it. Continue?')) {
        disableAndClearSensitiveModule(btn.dataset.module);
      }
    });
  });
}

function updateUI() {
  const step = STEPS[state.currentStep];
  const totalSteps = STEPS.length;
  const progress = ((state.currentStep + 1) / totalSteps) * 100;

  // Update progress
  if (elements.stepCounter) {
    elements.stepCounter.textContent = `Step ${state.currentStep + 1} of ${totalSteps}`;
  }
  if (elements.progressFill) {
    elements.progressFill.style.width = `${progress}%`;
  }

  // Update step navigation
  elements.stepNavItems.forEach((item, index) => {
    const stepId = item.dataset.step;
    const isActive = stepId === step.id;
    const isCompleted = state.completedSteps.includes(stepId);
    const isLocked = index > state.currentStep && !isCompleted;

    item.classList.toggle("active", isActive);
    item.classList.toggle("completed", isCompleted);
    item.classList.toggle("locked", isLocked);
  });

  // Update step content
  elements.stepContents.forEach((content) => {
    const isActive = content.dataset.step === step.id;
    content.classList.toggle("active", isActive);
  });

  // Update navigation buttons
  updateNavButtons();

  // Step-specific updates
  if (step.id === "form-types") {
    updateSelectionSummary();
    updateConditionalModules();
  } else if (step.id === "review") {
    renderReview();
  } else if (step.id === "finish") {
    renderFinishStats();
  }
}

function updateNavButtons() {
  const step = STEPS[state.currentStep];
  
  // Previous button
  elements.prevBtn.disabled = state.currentStep === 0;

  // Next button
  if (state.currentStep === STEPS.length - 1) {
    elements.nextBtn.innerHTML = `
      Done
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <path d="M22 4L12 14.01l-3-3"/>
      </svg>
    `;
  } else {
    elements.nextBtn.innerHTML = `
      Next
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    `;
  }

  updateNextButton();
}

function updateNextButton() {
  const step = STEPS[state.currentStep];
  
  // Disable next if form types not selected
  if (step.id === "form-types") {
    elements.nextBtn.disabled = state.selectedFormTypes.length === 0;
  } else if (step.id === "review") {
    // Block if there are critical issues
    elements.nextBtn.disabled = state.reviewBlocked === true;
  } else {
    elements.nextBtn.disabled = false;
  }
}

function renderReview() {
  readFormFields();

  // Run quality checks
  const issues = runProfileQualityChecks();
  
  // Render readiness score
  renderReadinessScore(issues);
  
  // Render issues checklist
  renderIssuesChecklist(issues);
  
  // Render data summary
  renderDataSummary();
  
  // Update blocking state
  updateReviewBlockingState(issues);
}

// ============================================================================
// Review Step: Quality Checks
// ============================================================================

function runProfileQualityChecks() {
  const issues = {
    critical: [],  // Missing required fields
    warning: [],   // Format issues
    info: [],      // Suggestions/conflicts
  };

  // Get visible modules based on selected form types
  const visibleConditionalModules = new Set();
  state.selectedFormTypes.forEach((ft) => {
    const modules = FORM_TYPE_MODULES[ft] || [];
    modules.forEach((m) => visibleConditionalModules.add(m));
  });

  // Check required fields for each visible module
  PROFILE_MODULES.forEach((mod) => {
    const isVisible = !mod.conditional || visibleConditionalModules.has(mod.id);
    if (!isVisible) return;

    // Skip sensitive modules that aren't opted in
    if (mod.sensitive && !state.moduleOptIn[mod.id]) return;

    const moduleData = state.profileV1[mod.id] || {};

    mod.fields.forEach((field) => {
      const value = (moduleData[field.id] || '').toString().trim();

      // Check required fields
      if (field.required && !value) {
        issues.critical.push({
          type: 'missing_required',
          moduleId: mod.id,
          moduleName: mod.name,
          fieldId: field.id,
          fieldLabel: field.label,
          title: `${field.label} is required`,
          description: `Missing in ${mod.name} module`,
          icon: mod.icon,
        });
      }

      // Check format issues
      if (value) {
        const formatIssue = checkFieldFormat(field.id, value, mod);
        if (formatIssue) {
          issues.warning.push({
            type: 'format_warning',
            moduleId: mod.id,
            moduleName: mod.name,
            fieldId: field.id,
            fieldLabel: field.label,
            ...formatIssue,
            icon: mod.icon,
          });
        }
      }
    });
  });

  // Check for suggestions (stub for future conflict detection)
  if (state.selectedFormTypes.length > 3) {
    issues.info.push({
      type: 'suggestion',
      moduleId: null,
      fieldId: null,
      title: 'Many form types selected',
      description: 'Consider narrowing your form types for a more focused profile',
      icon: '💡',
    });
  }

  return issues;
}

function checkFieldFormat(fieldId, value, mod) {
  // Email validation
  if (fieldId === 'email' || fieldId === 'workEmail') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return {
        title: 'Invalid email format',
        description: `"${value}" doesn't look like a valid email`,
      };
    }
  }

  // Phone validation
  if (fieldId === 'phone') {
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      return {
        title: 'Phone number too short',
        description: 'Should be at least 10 digits',
      };
    }
    if (digitsOnly.length > 15) {
      return {
        title: 'Phone number too long',
        description: 'Should be no more than 15 digits',
      };
    }
  }

  // ZIP code validation (US)
  if (fieldId === 'zipCode') {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(value)) {
      return {
        title: 'Invalid ZIP code format',
        description: 'Should be 5 digits (or 5+4 format)',
      };
    }
  }

  // SSN validation
  if (fieldId === 'ssn') {
    const ssnRegex = /^\d{3}-?\d{2}-?\d{4}$/;
    if (!ssnRegex.test(value)) {
      return {
        title: 'Invalid SSN format',
        description: 'Should be XXX-XX-XXXX or 9 digits',
      };
    }
  }

  // Graduation year validation
  if (fieldId === 'graduationYear') {
    const year = parseInt(value, 10);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1900 || year > currentYear + 10) {
      return {
        title: 'Invalid graduation year',
        description: `Should be between 1900 and ${currentYear + 10}`,
      };
    }
  }

  return null;
}

function renderReadinessScore(issues) {
  const readinessCircle = document.getElementById('readiness-progress');
  const readinessPercent = document.getElementById('readiness-percent');
  const readinessStatus = document.getElementById('readiness-status');
  const readinessModules = document.getElementById('readiness-modules');

  if (!readinessCircle || !readinessPercent) return;

  // Calculate overall readiness
  const visibleConditionalModules = new Set();
  state.selectedFormTypes.forEach((ft) => {
    const modules = FORM_TYPE_MODULES[ft] || [];
    modules.forEach((m) => visibleConditionalModules.add(m));
  });

  let totalPercent = 0;
  let moduleCount = 0;
  const moduleReadiness = [];

  PROFILE_MODULES.forEach((mod) => {
    const isVisible = !mod.conditional || visibleConditionalModules.has(mod.id);
    if (!isVisible) return;

    // Skip sensitive modules that aren't opted in (count as complete for readiness)
    if (mod.sensitive && !state.moduleOptIn[mod.id]) {
      moduleReadiness.push({ mod, percent: 100, skipped: true });
      totalPercent += 100;
      moduleCount++;
      return;
    }

    const percent = state.moduleCompletion[mod.id] || 0;
    moduleReadiness.push({ mod, percent, skipped: false });
    totalPercent += percent;
    moduleCount++;
  });

  const overallPercent = moduleCount > 0 ? Math.round(totalPercent / moduleCount) : 0;

  // Adjust for critical issues
  const hasCritical = issues.critical.length > 0;
  const effectivePercent = hasCritical ? Math.min(overallPercent, 75) : overallPercent;

  // Update circle
  const circumference = 2 * Math.PI * 45; // r=45
  const offset = circumference - (effectivePercent / 100) * circumference;
  readinessCircle.style.strokeDashoffset = offset;

  // Update color based on score
  readinessCircle.classList.remove('warning', 'critical');
  if (effectivePercent < 50) {
    readinessCircle.classList.add('critical');
  } else if (effectivePercent < 80) {
    readinessCircle.classList.add('warning');
  }

  // Update percent text
  readinessPercent.textContent = `${effectivePercent}%`;

  // Update status text
  if (hasCritical) {
    readinessStatus.textContent = `${issues.critical.length} required field${issues.critical.length > 1 ? 's' : ''} missing`;
    readinessStatus.className = 'readiness-status critical';
  } else if (issues.warning.length > 0) {
    readinessStatus.textContent = `${issues.warning.length} format warning${issues.warning.length > 1 ? 's' : ''} to review`;
    readinessStatus.className = 'readiness-status warning';
  } else if (effectivePercent >= 80) {
    readinessStatus.textContent = 'Ready for form filling!';
    readinessStatus.className = 'readiness-status ready';
  } else {
    readinessStatus.textContent = 'Profile is partially complete';
    readinessStatus.className = 'readiness-status';
  }

  // Render module readiness bars
  if (readinessModules) {
    readinessModules.innerHTML = moduleReadiness.map(({ mod, percent, skipped }) => {
      let fillClass = '';
      if (percent < 50) fillClass = 'low';
      else if (percent < 80) fillClass = 'medium';

      return `
        <div class="readiness-module">
          <div class="readiness-module-header">
            <span class="readiness-module-name">${mod.icon} ${mod.name}</span>
            <span class="readiness-module-percent">${skipped ? 'Skipped' : `${percent}%`}</span>
          </div>
          <div class="readiness-module-bar">
            <div class="readiness-module-fill ${fillClass}" style="width: ${percent}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }
}

function renderIssuesChecklist(issues) {
  const criticalGroup = document.getElementById('critical-issues-group');
  const criticalList = document.getElementById('critical-issues-list');
  const criticalCount = document.getElementById('critical-count');
  
  const warningGroup = document.getElementById('warning-issues-group');
  const warningList = document.getElementById('warning-issues-list');
  const warningCount = document.getElementById('warning-count');
  
  const infoGroup = document.getElementById('info-issues-group');
  const infoList = document.getElementById('info-issues-list');
  const infoCount = document.getElementById('info-count');
  
  const issuesClear = document.getElementById('issues-clear');
  const issuesCountEl = document.getElementById('issues-count');

  const totalIssues = issues.critical.length + issues.warning.length + issues.info.length;

  // Update issues count
  if (issuesCountEl) {
    issuesCountEl.textContent = `${totalIssues} issue${totalIssues !== 1 ? 's' : ''}`;
    issuesCountEl.classList.remove('has-issues', 'has-critical');
    if (issues.critical.length > 0) {
      issuesCountEl.classList.add('has-critical');
    } else if (totalIssues > 0) {
      issuesCountEl.classList.add('has-issues');
    }
  }

  // Render critical issues
  if (criticalGroup && criticalList) {
    if (issues.critical.length > 0) {
      criticalGroup.style.display = 'block';
      criticalCount.textContent = issues.critical.length;
      criticalList.innerHTML = issues.critical.map((issue) => renderIssueItem(issue, 'critical')).join('');
      bindIssueFixButtons(criticalList);
    } else {
      criticalGroup.style.display = 'none';
    }
  }

  // Render warning issues
  if (warningGroup && warningList) {
    if (issues.warning.length > 0) {
      warningGroup.style.display = 'block';
      warningCount.textContent = issues.warning.length;
      warningList.innerHTML = issues.warning.map((issue) => renderIssueItem(issue, 'warning')).join('');
      bindIssueFixButtons(warningList);
    } else {
      warningGroup.style.display = 'none';
    }
  }

  // Render info issues
  if (infoGroup && infoList) {
    if (issues.info.length > 0) {
      infoGroup.style.display = 'block';
      infoCount.textContent = issues.info.length;
      infoList.innerHTML = issues.info.map((issue) => renderIssueItem(issue, 'info')).join('');
    } else {
      infoGroup.style.display = 'none';
    }
  }

  // Show all clear if no issues
  if (issuesClear) {
    issuesClear.style.display = totalIssues === 0 ? 'flex' : 'none';
  }
}

function renderIssueItem(issue, severity) {
  const fixButton = issue.moduleId && issue.fieldId
    ? `<button class="issue-fix-btn" data-module="${issue.moduleId}" data-field="${issue.fieldId}">Fix</button>`
    : '';

  return `
    <div class="issue-item ${severity}">
      <div class="issue-icon">${issue.icon}</div>
      <div class="issue-content">
        <div class="issue-title">${issue.title}</div>
        <div class="issue-description">${issue.description}</div>
      </div>
      ${fixButton}
    </div>
  `;
}

function bindIssueFixButtons(container) {
  container.querySelectorAll('.issue-fix-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const moduleId = btn.dataset.module;
      const fieldId = btn.dataset.field;
      
      // Go back to build-profile step
      const buildProfileIndex = STEPS.findIndex((s) => s.id === 'build-profile');
      if (buildProfileIndex !== -1) {
        state.currentStep = buildProfileIndex;
        updateUI();
        saveState();
        
        // Switch to the right module
        setTimeout(() => {
          switchToModule(moduleId);
          
          // Focus the field
          setTimeout(() => {
            const input = document.getElementById(fieldId);
            if (input) {
              input.focus();
              input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
        }, 100);
      }
    });
  });
}

function renderDataSummary() {
  if (!elements.reviewSections) return;

  const sections = [
    {
      title: "Contact Information",
      module: "contact",
      fields: [
        { label: "Full Name", key: "fullName" },
        { label: "Email", key: "email" },
        { label: "Phone", key: "phone" },
      ],
    },
    {
      title: "Address",
      module: "address",
      fields: [
        { label: "Street", key: "addressLine1" },
        { label: "City", key: "city" },
        { label: "State", key: "state" },
        { label: "ZIP Code", key: "zipCode" },
        { label: "Country", key: "country" },
      ],
    },
  ];

  // Add conditional sections
  const modulesToShow = new Set();
  state.selectedFormTypes.forEach((ft) => {
    const modules = FORM_TYPE_MODULES[ft] || [];
    modules.forEach((m) => modulesToShow.add(m));
  });

  if (modulesToShow.has("employment")) {
    sections.push({
      title: "Employment",
      module: "employment",
      fields: [
        { label: "Employer", key: "currentEmployer" },
        { label: "Job Title", key: "jobTitle" },
        { label: "Start Date", key: "startDate" },
        { label: "Work Email", key: "workEmail" },
      ],
    });
  }

  if (modulesToShow.has("education")) {
    sections.push({
      title: "Education",
      module: "education",
      fields: [
        { label: "School", key: "schoolName" },
        { label: "Degree", key: "degree" },
        { label: "Graduation Year", key: "graduationYear" },
        { label: "Field of Study", key: "fieldOfStudy" },
      ],
    });
  }

  // Add sensitive modules if opted in
  if (modulesToShow.has("governmentIds") && state.moduleOptIn.governmentIds) {
    sections.push({
      title: "Government IDs",
      module: "governmentIds",
      sensitive: true,
      fields: [
        { label: "SSN", key: "ssn", mask: true },
        { label: "Passport", key: "passportNumber", mask: true },
        { label: "Driver's License", key: "driversLicenseNumber", mask: true },
      ],
    });
  }

  elements.reviewSections.innerHTML = sections.map((section) => {
    const moduleData = state.profileV1[section.module] || {};
    
    return `
      <div class="review-section">
        <div class="review-section-header">${section.title}</div>
        <div class="review-fields">
          ${section.fields.map((field) => {
            let value = moduleData[field.key] || '';
            if (field.mask && value) {
              value = '••••' + value.slice(-4);
            }
            return `
              <div class="review-field">
                <span class="review-field-label">${field.label}</span>
                <span class="review-field-value ${!value ? 'empty' : ''}">${value || 'Not provided'}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function updateReviewBlockingState(issues) {
  const blockingMessage = document.getElementById('blocking-message');
  const hasCritical = issues.critical.length > 0;

  if (blockingMessage) {
    blockingMessage.style.display = hasCritical ? 'flex' : 'none';
  }

  // Store blocking state for navigation
  state.reviewBlocked = hasCritical;
}

function renderFinishStats() {
  readFormFields();

  // Count filled fields
  const filledCount = Object.values(state.profile).filter((v) => v.trim()).length;
  
  if (elements.fieldsFilled) {
    elements.fieldsFilled.textContent = filledCount;
  }
  if (elements.formTypesCount) {
    elements.formTypesCount.textContent = state.selectedFormTypes.length;
  }
}

function bindEvents() {
  // Navigation
  elements.prevBtn.addEventListener("click", goToPrevStep);
  elements.nextBtn.addEventListener("click", goToNextStep);
  elements.exitBtn.addEventListener("click", saveAndExit);

  // Sidebar navigation
  elements.stepNavItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (item.classList.contains("locked")) return;
      
      const stepId = item.dataset.step;
      const stepIndex = STEPS.findIndex((s) => s.id === stepId);
      if (stepIndex !== -1 && stepIndex <= getMaxAllowedStep()) {
        goToStep(stepIndex);
      }
    });
  });

  // Edit profile button
  if (elements.editProfileBtn) {
    elements.editProfileBtn.addEventListener("click", () => {
      goToStep(2); // Go to build-profile step
    });
  }

  // Fill test button
  if (elements.fillTestBtn) {
    elements.fillTestBtn.addEventListener("click", fillTestForm);
  }

  // Auto-save form fields on input
  document.querySelectorAll(".profile-module input").forEach((input) => {
    input.addEventListener("blur", () => {
      readFormFields();
      saveProfile();
    });
  });
}

function getMaxAllowedStep() {
  // Allow navigation to completed steps + 1
  let maxStep = 0;
  for (let i = 0; i < STEPS.length; i++) {
    if (state.completedSteps.includes(STEPS[i].id)) {
      maxStep = i + 1;
    }
  }
  return Math.max(maxStep, state.currentStep);
}

async function goToNextStep() {
  const currentStepId = STEPS[state.currentStep].id;

  // Mark current step as completed
  if (!state.completedSteps.includes(currentStepId)) {
    state.completedSteps.push(currentStepId);
  }

  // Save profile when leaving build-profile step
  if (currentStepId === "build-profile") {
    await saveProfile();
  }

  // Move to next step or finish
  if (state.currentStep < STEPS.length - 1) {
    state.currentStep++;
    await saveState();
    updateUI();
  } else {
    // Finish
    await completeOnboarding();
  }
}

function goToPrevStep() {
  if (state.currentStep > 0) {
    state.currentStep--;
    saveState();
    updateUI();
  }
}

function goToStep(index) {
  state.currentStep = index;
  saveState();
  updateUI();
}

async function saveAndExit() {
  await saveProfile();
  await saveState();
  window.close();
}

async function completeOnboarding() {
  try {
    await saveProfile();
    
    const onboardingState = {
      completedStepIds: state.completedSteps,
      lastStepId: "finish",
      completedAt: new Date().toISOString(),
      isComplete: true,
      wasSkipped: false,
    };

    // Enable the extension
    await chrome.storage.local.set({
      onboardingState,
      selectedFormTypes: state.selectedFormTypes,
      enabled: true,
    });

    // Close after a short delay
    setTimeout(() => {
      window.close();
    }, 2000);
  } catch (error) {
    console.error("Error completing onboarding:", error);
  }
}

function fillTestForm() {
  readFormFields();

  const testFields = {
    "test-name": `${state.profile.firstName} ${state.profile.lastName}`.trim(),
    "test-email": state.profile.email,
    "test-phone": state.profile.phone,
    "test-city": state.profile.city,
  };

  let filledCount = 0;

  Object.entries(testFields).forEach(([id, value]) => {
    const input = document.getElementById(id);
    if (input && value) {
      input.value = value;
      input.classList.add("filled");
      filledCount++;
    }
  });

  // Show result
  if (elements.testResult) {
    if (filledCount > 0) {
      elements.testResult.innerHTML = `<p>✓ Filled ${filledCount} field${filledCount > 1 ? 's' : ''} from your profile!</p>`;
      elements.testResult.classList.add("success");
    } else {
      elements.testResult.innerHTML = `<p>No matching profile data. Fill in your profile first.</p>`;
      elements.testResult.classList.remove("success");
    }
  }
}
