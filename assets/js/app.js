/**
 * Engineering AI Profile & Skill Builder
 * Pure Client-Side Application Logic - Zero Runtime External Dependencies
 * MIT License - Hossein Golshan
 */

(() => {
  'use strict';

  // Constants & Storage Keys
  const STORAGE_KEY_STATE = 'eng_ai_builder_state_v1';
  const STORAGE_KEY_LANG = 'eng_ai_builder_lang';
  const STORAGE_KEY_THEME = 'eng_ai_builder_theme';
  const SCHEMA_VERSION = 1;

  // Maximum character lengths for safe handling
  const LIMITS = {
    profileName: 120,
    jobTitle: 120,
    department: 120,
    additionalContext: 600,
    customText: 1000,
  };

  // Option whitelists for strict validation during JSON import
  const WHITELISTS = {
    experienceLevels: ['junior', 'mid', 'senior', 'principal', 'manager'],
    disciplines: [
      'civil', 'mechanical', 'electrical', 'process', 'piping',
      'instrumentation', 'hvac', 'project_eng', 'construction',
      'procurement', 'planning', 'doc_control'
    ],
    industries: [
      'steel_making', 'aluminum_smelting', 'metal_production',
      'mineral_processing', 'industrial_plants', 'utilities_offsites',
      'greenfield', 'brownfield', 'epc_epcm'
    ],
    projectStages: [
      'conceptual', 'basic_eng', 'detailed_eng', 'procurement_phase',
      'construction_phase', 'commissioning', 'operation_maint'
    ],
    responsibilities: [
      'calc_notes', 'specs_datasheets', 'drawings_review', 'vendor_eval',
      'crs_handling', 'site_supervision', 'interdisciplinary', 'code_compliance'
    ],
    deliverables: [
      'design_criteria', 'calc_books', 'tech_specs', 'equipment_datasheets',
      'drawings_sld_pid', 'tbe_reports', 'punch_lists', 'boq_mto'
    ],
    software: [
      'autocad', 'navisworks', 'inventor', 'pdms', 'e3d',
      'sap2000', 'etabs', 'safe', 'tekla', 'idea_statica',
      'rhino', 'solidworks', 'etap', 'eplan', 'excel', 'word', 'powerpoint'
    ],
    generalSkills: [
      'tech_writing', 'ms_word', 'ms_excel', 'ms_powerpoint',
      'meetings_actions', 'formal_correspondence', 'doc_review_crs',
      'data_analysis', 'technical_reporting', 'project_coordination'
    ],
    disciplineSkills: [
      'civil_structural', 'mechanical_equip', 'electrical_power',
      'process_metallurgy', 'piping_stress', 'instrumentation_control',
      'hvac_ventilation', 'construction_erection', 'procurement_tbe',
      'planning_project_controls'
    ],
    detailLevel: ['brief', 'balanced', 'rigorous'],
    unitSystem: ['si_metric', 'imperial', 'project_mixed'],
    outputLanguage: ['match', 'en', 'fa'],
    toggles: [
      'askClarifications', 'stateAssumptions', 'showFormulas',
      'strictStandards', 'engineeringChecklists', 'safetyRisks',
      'disciplineInterfaces', 'tabularFormat', 'factsVsAssumptions'
    ]
  };

  // Default state model
  const DEFAULT_STATE = {
    profileName: '',
    jobTitle: '',
    department: '',
    experienceLevel: 'senior',
    primaryDiscipline: 'mechanical',
    additionalContext: '',
    industries: ['steel_making', 'aluminum_smelting', 'epc_epcm'],
    projectStages: ['detailed_eng'],
    responsibilities: ['calc_notes', 'specs_datasheets', 'vendor_eval', 'interdisciplinary'],
    deliverables: ['design_criteria', 'calc_books', 'tech_specs', 'equipment_datasheets'],
    additionalDisciplines: ['civil', 'electrical', 'piping', 'instrumentation'],
    software: ['autocad', 'navisworks', 'excel', 'word'],
    generalSkills: ['tech_writing', 'ms_excel', 'doc_review_crs', 'project_coordination'],
    disciplineSkills: ['mechanical_equip', 'piping_stress'],
    detailLevel: 'rigorous',
    unitSystem: 'si_metric',
    outputLanguage: 'match',
    toggles: {
      askClarifications: true,
      stateAssumptions: true,
      showFormulas: true,
      strictStandards: true,
      engineeringChecklists: true,
      safetyRisks: true,
      disciplineInterfaces: true,
      tabularFormat: true,
      factsVsAssumptions: true
    },
    customText: ''
  };

  // Runtime context
  let state = JSON.parse(JSON.stringify(DEFAULT_STATE));
  let currentLang = 'en';
  let currentTheme = 'dark';
  const locales = {};
  let localesIndex = [];

  // DOM Elements cache
  const el = {};

  /**
   * Safe URL resolver for GitHub Pages subdirectories
   */
  function getLocaleUrl(relativePath) {
    return new URL(relativePath, document.baseURI).href;
  }

  /**
   * Initialize application
   */
  async function init() {
    cacheDOMElements();
    setupTheme();
    await loadLocalesIndex();
    setupLanguage();
    await loadLocaleData(currentLang);
    loadSavedState();
    renderFormControls();
    syncFormInputsFromState();
    setupEventListeners();
    updateOutput();
  }

  /**
   * Cache references to static UI elements
   */
  function cacheDOMElements() {
    el.html = document.documentElement;
    el.langSelect = document.getElementById('lang-select');
    el.themeToggleBtn = document.getElementById('theme-toggle-btn');
    el.themeIcon = document.getElementById('theme-icon');
    el.toastContainer = document.getElementById('toast-container');
    el.outputText = document.getElementById('output-text');
    el.copyBtn = document.getElementById('copy-btn');
    el.downloadMdBtn = document.getElementById('download-md-btn');
    el.downloadTxtBtn = document.getElementById('download-txt-btn');
    el.exportJsonBtn = document.getElementById('export-json-btn');
    el.importJsonBtn = document.getElementById('import-json-btn');
    el.importFileInput = document.getElementById('import-file-input');
    el.resetBtn = document.getElementById('reset-btn');
    el.resetModal = document.getElementById('reset-modal');
    el.resetConfirmBtn = document.getElementById('reset-confirm-btn');
    el.resetCancelBtn = document.getElementById('reset-cancel-btn');

    // Dynamic containers
    el.experienceLevelSelect = document.getElementById('field-experience');
    el.primaryDisciplineSelect = document.getElementById('field-discipline');
    el.detailLevelSelect = document.getElementById('field-detail-level');
    el.unitSystemSelect = document.getElementById('field-unit-system');
    el.outputLanguageSelect = document.getElementById('field-output-lang');

    el.industriesGrid = document.getElementById('grid-industries');
    el.projectStagesGrid = document.getElementById('grid-stages');
    el.responsibilitiesGrid = document.getElementById('grid-responsibilities');
    el.deliverablesGrid = document.getElementById('grid-deliverables');
    el.additionalDisciplinesGrid = document.getElementById('grid-add-disciplines');
    el.softwareGrid = document.getElementById('grid-software');
    el.generalSkillsGrid = document.getElementById('grid-general-skills');
    el.disciplineSkillsGrid = document.getElementById('grid-discipline-skills');
    el.togglesGrid = document.getElementById('grid-toggles');

    // Text inputs
    el.profileNameInput = document.getElementById('field-profile-name');
    el.jobTitleInput = document.getElementById('field-job-title');
    el.departmentInput = document.getElementById('field-department');
    el.contextInput = document.getElementById('field-context');
    el.customTextInput = document.getElementById('field-custom-text');
    el.customTextCounter = document.getElementById('custom-text-counter');
  }

  /**
   * Theme configuration (dark / light)
   */
  function setupTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      currentTheme = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      currentTheme = 'light';
    } else {
      currentTheme = 'dark';
    }
    applyTheme(currentTheme);
  }

  function applyTheme(theme) {
    currentTheme = theme;
    el.html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    if (el.themeIcon) {
      if (theme === 'light') {
        el.themeIcon.innerHTML = '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
        el.themeToggleBtn.setAttribute('aria-label', getTranslation('nav.themeDark') || 'Switch to Dark Theme');
        el.themeToggleBtn.setAttribute('title', getTranslation('nav.themeDark') || 'Switch to Dark Theme');
      } else {
        el.themeIcon.innerHTML = '<path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        el.themeToggleBtn.setAttribute('aria-label', getTranslation('nav.themeLight') || 'Switch to Light Theme');
        el.themeToggleBtn.setAttribute('title', getTranslation('nav.themeLight') || 'Switch to Light Theme');
      }
    }
  }

  /**
   * Load locales index registry
   */
  async function loadLocalesIndex() {
    try {
      const res = await fetch(getLocaleUrl('locales/index.json'));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      localesIndex = await res.json();
      populateLanguageDropdown();
    } catch (err) {
      console.warn('Fallback: locales/index.json could not be loaded directly.', err);
      localesIndex = [
        { code: 'en', name: 'English', localName: 'English', dir: 'ltr' },
        { code: 'fa', name: 'Persian', localName: 'فارسی', dir: 'rtl' }
      ];
      populateLanguageDropdown();
    }
  }

  function populateLanguageDropdown() {
    if (!el.langSelect) return;
    el.langSelect.innerHTML = '';
    localesIndex.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.code;
      opt.textContent = `${item.localName} (${item.code.toUpperCase()})`;
      el.langSelect.appendChild(opt);
    });
  }

  /**
   * Determine initial language
   */
  function setupLanguage() {
    const savedLang = localStorage.getItem(STORAGE_KEY_LANG);
    if (savedLang && localesIndex.some(l => l.code === savedLang)) {
      currentLang = savedLang;
    } else {
      const navLang = (navigator.language || 'en').split('-')[0].toLowerCase();
      currentLang = localesIndex.some(l => l.code === navLang) ? navLang : 'en';
    }
    if (el.langSelect) {
      el.langSelect.value = currentLang;
    }
  }

  /**
   * Load a specific locale's JSON file
   */
  async function loadLocaleData(langCode) {
    if (locales[langCode]) return locales[langCode];
    try {
      const res = await fetch(getLocaleUrl(`locales/${langCode}.json`));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      locales[langCode] = data;
      return data;
    } catch (err) {
      console.error(`Failed to load locale file for ${langCode}:`, err);
      return null;
    }
  }

  /**
   * Switch language and update interface
   */
  async function switchLanguage(langCode) {
    if (langCode === currentLang && locales[langCode]) return;
    await loadLocaleData(langCode);
    currentLang = langCode;
    localStorage.setItem(STORAGE_KEY_LANG, langCode);

    const langMeta = localesIndex.find(l => l.code === langCode);
    const dir = langMeta ? langMeta.dir : (langCode === 'fa' ? 'rtl' : 'ltr');

    el.html.setAttribute('lang', langCode);
    el.html.setAttribute('dir', dir);

    applyTranslationsToDOM();
    renderFormControls();
    syncFormInputsFromState();
    applyTheme(currentTheme); // refresh tooltip text
    updateOutput();
  }

  /**
   * Retrieve a nested translation string by dot path
   */
  function getTranslation(keyPath, lang = currentLang) {
    const data = locales[lang] || locales['en'];
    if (!data) return keyPath;
    const parts = keyPath.split('.');
    let cur = data;
    for (const part of parts) {
      if (cur && typeof cur === 'object' && part in cur) {
        cur = cur[part];
      } else {
        // Fallback to English if available
        if (lang !== 'en' && locales['en']) {
          return getTranslation(keyPath, 'en');
        }
        return keyPath;
      }
    }
    return typeof cur === 'string' ? cur : keyPath;
  }

  /**
   * Translate static elements in DOM having data-i18n or data-i18n-placeholder
   */
  function applyTranslationsToDOM() {
    document.querySelectorAll('[data-i18n]').forEach(elem => {
      const key = elem.getAttribute('data-i18n');
      const text = getTranslation(key);
      elem.textContent = text;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(elem => {
      const key = elem.getAttribute('data-i18n-placeholder');
      const text = getTranslation(key);
      elem.setAttribute('placeholder', text);
    });

    // Update document title and meta description
    const metaTitle = getTranslation('meta.title');
    const metaDesc = getTranslation('meta.description');
    if (metaTitle) document.title = metaTitle;
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta && metaDesc) descMeta.setAttribute('content', metaDesc);
  }

  /**
   * Render dynamic select options and checkbox groups from current locale
   */
  function renderFormControls() {
    // 1. Experience Levels
    renderSelectOptions(el.experienceLevelSelect, WHITELISTS.experienceLevels, 'experienceLevels');

    // 2. Primary Discipline
    renderSelectOptions(el.primaryDisciplineSelect, WHITELISTS.disciplines, 'disciplines');

    // 3. Detail Level
    renderSelectOptions(el.detailLevelSelect, WHITELISTS.detailLevel, 'preferences.detailLevel');

    // 4. Unit System
    renderSelectOptions(el.unitSystemSelect, WHITELISTS.unitSystem, 'preferences.unitSystem');

    // 5. Output Language
    renderSelectOptions(el.outputLanguageSelect, WHITELISTS.outputLanguage, 'preferences.outputLanguage');

    // 6. Checkbox Grids
    renderCheckboxGrid(el.industriesGrid, WHITELISTS.industries, 'industries', 'industries', true);
    renderCheckboxGrid(el.projectStagesGrid, WHITELISTS.projectStages, 'projectStages', 'projectStages', true);
    renderCheckboxGrid(el.responsibilitiesGrid, WHITELISTS.responsibilities, 'responsibilities', 'responsibilities', true);
    renderCheckboxGrid(el.deliverablesGrid, WHITELISTS.deliverables, 'deliverables', 'deliverables', true);
    renderCheckboxGrid(el.additionalDisciplinesGrid, WHITELISTS.disciplines, 'disciplines', 'additionalDisciplines', true);
    renderCheckboxGrid(el.softwareGrid, WHITELISTS.software, 'software', 'software', true);

    // 7. General Skills (with rich descriptions)
    renderRichSkillGrid(el.generalSkillsGrid, WHITELISTS.generalSkills, 'generalSkills');

    // 8. Discipline Skills (with rich descriptions)
    renderRichSkillGrid(el.disciplineSkillsGrid, WHITELISTS.disciplineSkills, 'disciplineSkills');

    // 9. Toggles
    renderTogglesGrid(el.togglesGrid, WHITELISTS.toggles);
  }

  function renderSelectOptions(selectElem, ids, namespace) {
    if (!selectElem) return;
    const previousVal = selectElem.value;
    selectElem.innerHTML = '';
    ids.forEach(id => {
      const opt = document.createElement('option');
      opt.value = id;
      opt.textContent = getTranslation(`${namespace}.${id}`);
      selectElem.appendChild(opt);
    });
    if (previousVal && ids.includes(previousVal)) {
      selectElem.value = previousVal;
    }
  }

  function renderCheckboxGrid(container, ids, namespace, stateKey, twoCols = false) {
    if (!container) return;
    container.innerHTML = '';
    if (twoCols) {
      container.className = 'checkbox-grid two-cols';
    } else {
      container.className = 'checkbox-grid';
    }

    ids.forEach(id => {
      const labelText = getTranslation(`${namespace}.${id}`);
      const isChecked = Array.isArray(state[stateKey]) && state[stateKey].includes(id);

      const label = document.createElement('label');
      label.className = `checkbox-card ${isChecked ? 'checked' : ''}`;

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.className = 'checkbox-input';
      input.name = stateKey;
      input.value = id;
      input.checked = isChecked;

      const span = document.createElement('span');
      span.className = 'checkbox-label';
      span.textContent = labelText;

      input.addEventListener('change', () => {
        handleMultiCheckboxChange(stateKey, id, input.checked);
        label.classList.toggle('checked', input.checked);
        saveState();
        updateOutput();
      });

      label.appendChild(input);
      label.appendChild(span);
      container.appendChild(label);
    });
  }

  function renderRichSkillGrid(container, ids, categoryKey) {
    if (!container) return;
    container.innerHTML = '';
    container.className = 'checkbox-grid';

    ids.forEach(id => {
      const title = getTranslation(`${categoryKey}.${id}.name`);
      const desc = getTranslation(`${categoryKey}.${id}.desc`);
      const isChecked = Array.isArray(state[categoryKey]) && state[categoryKey].includes(id);

      const label = document.createElement('label');
      label.className = `checkbox-card ${isChecked ? 'checked' : ''}`;

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.className = 'checkbox-input';
      input.name = categoryKey;
      input.value = id;
      input.checked = isChecked;

      const content = document.createElement('div');
      content.className = 'checkbox-content';

      const titleSpan = document.createElement('span');
      titleSpan.className = 'checkbox-label';
      titleSpan.textContent = title;

      const descP = document.createElement('p');
      descP.className = 'checkbox-desc';
      descP.textContent = desc;

      content.appendChild(titleSpan);
      content.appendChild(descP);

      input.addEventListener('change', () => {
        handleMultiCheckboxChange(categoryKey, id, input.checked);
        label.classList.toggle('checked', input.checked);
        saveState();
        updateOutput();
      });

      label.appendChild(input);
      label.appendChild(content);
      container.appendChild(label);
    });
  }

  function renderTogglesGrid(container, ids) {
    if (!container) return;
    container.innerHTML = '';
    container.className = 'checkbox-grid';

    ids.forEach(id => {
      const title = getTranslation(`preferences.toggles.${id}.label`);
      const desc = getTranslation(`preferences.toggles.${id}.desc`);
      const isChecked = Boolean(state.toggles && state.toggles[id]);

      const label = document.createElement('label');
      label.className = `checkbox-card ${isChecked ? 'checked' : ''}`;

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.className = 'checkbox-input';
      input.name = `toggle-${id}`;
      input.value = id;
      input.checked = isChecked;

      const content = document.createElement('div');
      content.className = 'checkbox-content';

      const titleSpan = document.createElement('span');
      titleSpan.className = 'checkbox-label';
      titleSpan.textContent = title;

      const descP = document.createElement('p');
      descP.className = 'checkbox-desc';
      descP.textContent = desc;

      content.appendChild(titleSpan);
      content.appendChild(descP);

      input.addEventListener('change', () => {
        if (!state.toggles) state.toggles = {};
        state.toggles[id] = input.checked;
        label.classList.toggle('checked', input.checked);
        saveState();
        updateOutput();
      });

      label.appendChild(input);
      label.appendChild(content);
      container.appendChild(label);
    });
  }

  function handleMultiCheckboxChange(stateKey, id, checked) {
    if (!Array.isArray(state[stateKey])) {
      state[stateKey] = [];
    }
    if (checked) {
      if (!state[stateKey].includes(id)) {
        state[stateKey].push(id);
      }
    } else {
      state[stateKey] = state[stateKey].filter(item => item !== id);
    }
  }

  /**
   * Sync form input values to match runtime state
   */
  function syncFormInputsFromState() {
    if (el.profileNameInput) el.profileNameInput.value = state.profileName || '';
    if (el.jobTitleInput) el.jobTitleInput.value = state.jobTitle || '';
    if (el.departmentInput) el.departmentInput.value = state.department || '';
    if (el.contextInput) el.contextInput.value = state.additionalContext || '';
    if (el.customTextInput) el.customTextInput.value = state.customText || '';

    if (el.experienceLevelSelect) el.experienceLevelSelect.value = state.experienceLevel;
    if (el.primaryDisciplineSelect) el.primaryDisciplineSelect.value = state.primaryDiscipline;
    if (el.detailLevelSelect) el.detailLevelSelect.value = state.detailLevel;
    if (el.unitSystemSelect) el.unitSystemSelect.value = state.unitSystem;
    if (el.outputLanguageSelect) el.outputLanguageSelect.value = state.outputLanguage;

    updateCharCounter();
  }

  function updateCharCounter() {
    if (!el.customTextCounter || !el.customTextInput) return;
    const len = el.customTextInput.value.length;
    el.customTextCounter.textContent = `${len} / ${LIMITS.customText} ${getTranslation('actions.charCount')}`;
  }

  /**
   * Setup UI Event Listeners
   */
  function setupEventListeners() {
    // Language selection
    if (el.langSelect) {
      el.langSelect.addEventListener('change', e => {
        switchLanguage(e.target.value);
      });
    }

    // Theme toggle
    if (el.themeToggleBtn) {
      el.themeToggleBtn.addEventListener('click', () => {
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
      });
    }

    // Text input bindings with live state updates
    const textBindings = [
      { elem: el.profileNameInput, key: 'profileName', limit: LIMITS.profileName },
      { elem: el.jobTitleInput, key: 'jobTitle', limit: LIMITS.jobTitle },
      { elem: el.departmentInput, key: 'department', limit: LIMITS.department },
      { elem: el.contextInput, key: 'additionalContext', limit: LIMITS.additionalContext },
      { elem: el.customTextInput, key: 'customText', limit: LIMITS.customText }
    ];

    textBindings.forEach(({ elem, key, limit }) => {
      if (!elem) return;
      elem.addEventListener('input', () => {
        if (elem.value.length > limit) {
          elem.value = elem.value.slice(0, limit);
        }
        state[key] = elem.value;
        if (key === 'customText') updateCharCounter();
        saveState();
        updateOutput();
      });
    });

    // Select input bindings
    const selectBindings = [
      { elem: el.experienceLevelSelect, key: 'experienceLevel' },
      { elem: el.primaryDisciplineSelect, key: 'primaryDiscipline' },
      { elem: el.detailLevelSelect, key: 'detailLevel' },
      { elem: el.unitSystemSelect, key: 'unitSystem' },
      { elem: el.outputLanguageSelect, key: 'outputLanguage' }
    ];

    selectBindings.forEach(({ elem, key }) => {
      if (!elem) return;
      elem.addEventListener('change', () => {
        state[key] = elem.value;
        saveState();
        updateOutput();
      });
    });

    // Output Action buttons
    if (el.copyBtn) {
      el.copyBtn.addEventListener('click', handleCopyProfile);
    }
    if (el.downloadMdBtn) {
      el.downloadMdBtn.addEventListener('click', () => downloadFile('md'));
    }
    if (el.downloadTxtBtn) {
      el.downloadTxtBtn.addEventListener('click', () => downloadFile('txt'));
    }
    if (el.exportJsonBtn) {
      el.exportJsonBtn.addEventListener('click', handleExportJson);
    }
    if (el.importJsonBtn && el.importFileInput) {
      el.importJsonBtn.addEventListener('click', () => el.importFileInput.click());
      el.importFileInput.addEventListener('change', handleImportJson);
    }

    // Reset workflow
    if (el.resetBtn && el.resetModal) {
      el.resetBtn.addEventListener('click', () => {
        el.resetModal.classList.remove('hidden');
      });
      el.resetCancelBtn.addEventListener('click', () => {
        el.resetModal.classList.add('hidden');
      });
      el.resetConfirmBtn.addEventListener('click', () => {
        executeReset();
        el.resetModal.classList.add('hidden');
      });
      el.resetModal.addEventListener('click', e => {
        if (e.target === el.resetModal) el.resetModal.classList.add('hidden');
      });
    }
  }

  /**
   * Deterministic Profile Text Generator
   */
  async function updateOutput() {
    if (!el.outputText) return;

    // Determine target language for the generated text
    let outLang = currentLang;
    if (state.outputLanguage === 'en') outLang = 'en';
    else if (state.outputLanguage === 'fa') outLang = 'fa';

    // Ensure target locale data is loaded
    if (!locales[outLang]) {
      await loadLocaleData(outLang);
    }

    const t = (path) => getTranslation(path, outLang);

    let sectionIndex = 1;
    const lines = [];

    // Header banner
    const profileTitle = state.profileName.trim() ||
      `${t(`disciplines.${state.primaryDiscipline}`)} AI Profile`;

    lines.push(`================================================================================`);
    lines.push(`ENGINEERING AI PROFILE: ${profileTitle.toUpperCase()}`);
    lines.push(`================================================================================\n`);

    // 1. Role & Identity
    lines.push(`${sectionIndex++}. ${t('generator.systemRole')}`);
    lines.push(`--------------------------------------------------------------------------------`);
    lines.push(`${t('generator.systemRoleBody')}`);
    if (state.jobTitle.trim()) {
      lines.push(`- Job Title: ${state.jobTitle.trim()}`);
    }
    if (state.department.trim()) {
      lines.push(`- Department / Group: ${state.department.trim()}`);
    }
    lines.push(`- Primary Engineering Discipline: ${t(`disciplines.${state.primaryDiscipline}`)}`);
    lines.push(`- Experience Level: ${t(`experienceLevels.${state.experienceLevel}`)}`);
    if (state.additionalContext.trim()) {
      lines.push(`- Additional Professional Context: ${state.additionalContext.trim()}`);
    }
    lines.push('');

    // 2. Engineering Environment & Context
    lines.push(`${sectionIndex++}. ${t('generator.professionalContext')}`);
    lines.push(`--------------------------------------------------------------------------------`);
    if (state.industries.length > 0) {
      lines.push(`- Target Industries / Plant Types:`);
      state.industries.forEach(ind => {
        lines.push(`  * ${t(`industries.${ind}`)}`);
      });
    }
    if (state.projectStages.length > 0) {
      lines.push(`- Current Project Phases:`);
      state.projectStages.forEach(stg => {
        lines.push(`  * ${t(`projectStages.${stg}`)}`);
      });
    }
    if (state.additionalDisciplines.length > 0) {
      lines.push(`- Key Interfacing Disciplines:`);
      state.additionalDisciplines.forEach(disc => {
        lines.push(`  * ${t(`disciplines.${disc}`)}`);
      });
    }
    lines.push('');

    // 3. Responsibilities & Deliverables
    lines.push(`${sectionIndex++}. ${t('generator.responsibilities')}`);
    lines.push(`--------------------------------------------------------------------------------`);
    if (state.responsibilities.length > 0) {
      lines.push(`- Core Responsibilities:`);
      state.responsibilities.forEach(resp => {
        lines.push(`  * ${t(`responsibilities.${resp}`)}`);
      });
    }
    if (state.deliverables.length > 0) {
      lines.push(`- Expected Engineering Deliverables:`);
      state.deliverables.forEach(deliv => {
        lines.push(`  * ${t(`deliverables.${deliv}`)}`);
      });
    }
    lines.push('');

    // 4. Discipline-Specific Engineering Skills
    if (state.disciplineSkills.length > 0) {
      lines.push(`${sectionIndex++}. ${t('generator.skills')} (DISCIPLINE-SPECIFIC)`);
      lines.push(`--------------------------------------------------------------------------------`);
      state.disciplineSkills.forEach(skillId => {
        const name = t(`disciplineSkills.${skillId}.name`);
        const prompt = t(`disciplineSkills.${skillId}.prompt`);
        lines.push(`[${name}]`);
        lines.push(`${prompt}\n`);
      });
    }

    // 5. General Professional & Communication Skills
    if (state.generalSkills.length > 0) {
      lines.push(`${sectionIndex++}. ${t('generator.skills')} (PROFESSIONAL & DOCUMENTATION)`);
      lines.push(`--------------------------------------------------------------------------------`);
      state.generalSkills.forEach(skillId => {
        const name = t(`generalSkills.${skillId}.name`);
        const prompt = t(`generalSkills.${skillId}.prompt`);
        lines.push(`[${name}]`);
        lines.push(`${prompt}\n`);
      });
    }

    // 6. Software Ecosystem & Boundaries
    lines.push(`${sectionIndex++}. ${t('generator.software')}`);
    lines.push(`--------------------------------------------------------------------------------`);
    lines.push(`${t('generator.softwareNote')}\n`);
    if (state.software.length > 0) {
      lines.push(`- Software Packages Utilized by User:`);
      state.software.forEach(sw => {
        lines.push(`  * ${t(`software.${sw}`)}`);
      });
    }
    lines.push('');

    // 7. Response Preferences & Verification Rules
    lines.push(`${sectionIndex++}. ${t('generator.responseRules')}`);
    lines.push(`--------------------------------------------------------------------------------`);
    lines.push(`- Response Detail Level: ${t(`preferences.detailLevel.${state.detailLevel}`)}`);
    lines.push(`- Standard Unit System: ${t(`preferences.unitSystem.${state.unitSystem}`)}`);
    lines.push(`- Active Anti-Hallucination & Rigor Guardrails:`);

    let ruleNum = 1;
    if (state.toggles.strictStandards) {
      lines.push(`  ${ruleNum++}. [STRICT CODES & STANDARDS] Reference recognized international and national industry standards (ISO, ASME, ASTM, IEEE, API, DIN, EN) accurately. Never invent fictitious clause numbers, revision years, or material grades. If an exact clause number is unconfirmed, state standard name and topic, and advise the engineer to verify the current revision.`);
    }
    if (state.toggles.askClarifications) {
      lines.push(`  ${ruleNum++}. [MISSING INPUTS] When critical design parameters, operating temperatures, pressures, soil conditions, or battery limits are missing or ambiguous, ask clarifying questions instead of inventing arbitrary assumptions.`);
    }
    if (state.toggles.stateAssumptions) {
      lines.push(`  ${ruleNum++}. [EXPLICIT ASSUMPTIONS] Explicitly list all boundary limits, safety factors, ambient design conditions, and design assumptions before presenting conclusions.`);
    }
    if (state.toggles.showFormulas) {
      lines.push(`  ${ruleNum++}. [GOVERNING FORMULAS] Present governing mathematical equations in symbolic form first, followed by numerical substitution and dimensional unit checks.`);
    }
    if (state.toggles.factsVsAssumptions) {
      lines.push(`  ${ruleNum++}. [FACTS VS ASSUMPTIONS] ${t('generator.verifiedFactsNote')}`);
    }
    if (state.toggles.safetyRisks) {
      lines.push(`  ${ruleNum++}. [SAFETY & RISK] Actively highlight process safety implications, hazardous area classifications (ATEX/IECEx/NEC), overpressure scenarios, and constructability hazards.`);
    }
    if (state.toggles.disciplineInterfaces) {
      lines.push(`  ${ruleNum++}. [INTERDISCIPLINARY INTERFACES] Identify interdisciplinary interfaces and battery limits (e.g., dynamic mechanical equipment loads on civil foundations, power requirements for instruments).`);
    }
    if (state.toggles.tabularFormat) {
      lines.push(`  ${ruleNum++}. [STRUCTURED DATA] Present comparative trade-offs, equipment schedules, instrument I/O, and calculation inputs in structured Markdown tables.`);
    }
    if (state.toggles.engineeringChecklists) {
      lines.push(`  ${ruleNum++}. [VERIFICATION CHECKLISTS] Provide actionable engineering review checklists for design reviews, 3D model audits, or document handover.`);
    }
    lines.push('');

    // 8. Custom Directives
    if (state.customText.trim()) {
      lines.push(`${sectionIndex++}. ${t('generator.customInstructions')}`);
      lines.push(`--------------------------------------------------------------------------------`);
      lines.push(state.customText.trim());
      lines.push('');
    }

    // 9. Mandatory Engineering Verification Disclaimer
    lines.push(`${sectionIndex++}. ${t('generator.verificationDisclaimer')}`);
    lines.push(`--------------------------------------------------------------------------------`);
    lines.push(t('generator.disclaimerText'));
    lines.push(`================================================================================`);

    const outputString = lines.join('\n');
    el.outputText.value = outputString;
  }

  /**
   * Copy to clipboard with fallback
   */
  async function handleCopyProfile() {
    if (!el.outputText) return;
    const text = el.outputText.value;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        showToast(getTranslation('actions.copied'), 'success');
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch (err) {
      // Fallback: execCommand copy
      try {
        el.outputText.focus();
        el.outputText.select();
        const successful = document.execCommand('copy');
        if (successful) {
          showToast(getTranslation('actions.copied'), 'success');
        } else {
          showToast(getTranslation('actions.copyFailed'), 'error');
        }
      } catch (fallbackErr) {
        showToast(getTranslation('actions.copyFailed'), 'error');
      }
    }
  }

  /**
   * Generate sanitized, filesystem-safe filename
   */
  function generateSafeFilename(extension) {
    const rawName = state.profileName.trim() || state.jobTitle.trim() || state.primaryDiscipline || 'Engineering_Profile';
    // Replace non-alphanumeric (allowing letters from all scripts via unicode escape or safe substitute)
    const sanitized = rawName
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
      .trim()
      .replace(/\s+/g, '_')
      .slice(0, 48);

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    return `Engineering_AI_Profile_${sanitized || 'Export'}_${dateStr}.${extension}`;
  }

  /**
   * Download text or markdown file
   */
  function downloadFile(ext) {
    if (!el.outputText) return;
    const content = el.outputText.value;
    const mimeType = ext === 'md' ? 'text/markdown;charset=utf-8' : 'text/plain;charset=utf-8';
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = generateSafeFilename(ext);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Export JSON configuration
   */
  function handleExportJson() {
    const exportData = {
      schemaVersion: SCHEMA_VERSION,
      appName: 'Engineering-AI-Profile-Skill-Builder',
      exportTimestamp: new Date().toISOString(),
      author: 'Hossein Golshan',
      state: state
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = generateSafeFilename('json');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Import JSON configuration with strict schema validation
   */
  function handleImportJson(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const validatedState = validateAndSanitizeImport(parsed);
        if (!validatedState) {
          throw new Error('Schema validation failed');
        }

        // Apply new state safely
        state = validatedState;
        saveState();
        renderFormControls();
        syncFormInputsFromState();
        updateOutput();
        showToast(getTranslation('actions.importSuccess'), 'success');
      } catch (err) {
        console.error('Import error:', err);
        showToast(getTranslation('actions.importError'), 'error');
      } finally {
        if (el.importFileInput) el.importFileInput.value = '';
      }
    };

    reader.onerror = () => {
      showToast(getTranslation('actions.importError'), 'error');
      if (el.importFileInput) el.importFileInput.value = '';
    };

    reader.readAsText(file);
  }

  /**
   * Validate imported JSON structure and whitelist option values
   */
  function validateAndSanitizeImport(obj) {
    if (!obj || typeof obj !== 'object') return null;

    // Check schema version
    if (obj.schemaVersion !== SCHEMA_VERSION && obj.schemaVersion !== 1) {
      console.warn('Unsupported schema version');
      return null;
    }

    const s = obj.state;
    if (!s || typeof s !== 'object') return null;

    const sanitized = JSON.parse(JSON.stringify(DEFAULT_STATE));

    // String fields with length bounds
    if (typeof s.profileName === 'string') sanitized.profileName = s.profileName.slice(0, LIMITS.profileName);
    if (typeof s.jobTitle === 'string') sanitized.jobTitle = s.jobTitle.slice(0, LIMITS.jobTitle);
    if (typeof s.department === 'string') sanitized.department = s.department.slice(0, LIMITS.department);
    if (typeof s.additionalContext === 'string') sanitized.additionalContext = s.additionalContext.slice(0, LIMITS.additionalContext);
    if (typeof s.customText === 'string') sanitized.customText = s.customText.slice(0, LIMITS.customText);

    // Enum selects
    if (WHITELISTS.experienceLevels.includes(s.experienceLevel)) sanitized.experienceLevel = s.experienceLevel;
    if (WHITELISTS.disciplines.includes(s.primaryDiscipline)) sanitized.primaryDiscipline = s.primaryDiscipline;
    if (WHITELISTS.detailLevel.includes(s.detailLevel)) sanitized.detailLevel = s.detailLevel;
    if (WHITELISTS.unitSystem.includes(s.unitSystem)) sanitized.unitSystem = s.unitSystem;
    if (WHITELISTS.outputLanguage.includes(s.outputLanguage)) sanitized.outputLanguage = s.outputLanguage;

    // Array fields
    const arrayKeys = [
      { key: 'industries', list: WHITELISTS.industries },
      { key: 'projectStages', list: WHITELISTS.projectStages },
      { key: 'responsibilities', list: WHITELISTS.responsibilities },
      { key: 'deliverables', list: WHITELISTS.deliverables },
      { key: 'additionalDisciplines', list: WHITELISTS.disciplines },
      { key: 'software', list: WHITELISTS.software },
      { key: 'generalSkills', list: WHITELISTS.generalSkills },
      { key: 'disciplineSkills', list: WHITELISTS.disciplineSkills }
    ];

    arrayKeys.forEach(({ key, list }) => {
      if (Array.isArray(s[key])) {
        sanitized[key] = s[key].filter(item => typeof item === 'string' && list.includes(item));
      }
    });

    // Boolean toggles
    if (s.toggles && typeof s.toggles === 'object') {
      sanitized.toggles = {};
      WHITELISTS.toggles.forEach(tId => {
        sanitized.toggles[tId] = Boolean(s.toggles[tId]);
      });
    }

    return sanitized;
  }

  /**
   * Reset form state to defaults
   */
  function executeReset() {
    state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    localStorage.removeItem(STORAGE_KEY_STATE);
    renderFormControls();
    syncFormInputsFromState();
    updateOutput();
    showToast(getTranslation('actions.resetConfirm'), 'success');
  }

  /**
   * LocalStorage state saving & loading
   */
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(state));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  function loadSavedState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATE);
      if (saved) {
        const parsed = JSON.parse(saved);
        const validated = validateAndSanitizeImport({ schemaVersion: 1, state: parsed });
        if (validated) {
          state = validated;
        }
      }
    } catch (e) {
      console.warn('LocalStorage load failed, using defaults:', e);
    }
  }

  /**
   * Toast notification feedback
   */
  function showToast(message, type = 'info') {
    if (!el.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    el.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 200ms ease';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 200);
    }, 3200);
  }

  // Bootstrap when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
