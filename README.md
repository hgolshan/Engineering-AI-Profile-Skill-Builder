# Engineering AI Profile & Skill Builder

> **Live Website:** [https://hgolshan.github.io/Engineering-AI-Profile-Skill-Builder/](https://hgolshan.github.io/Engineering-AI-Profile-Skill-Builder/)

An open-source, bilingual (English & Persian) web application engineered for industrial plants, metal facilities, and EPC/EPCM engineering teams. It enables professionals to generate structured, verified, ready-to-paste AI profiles and discipline-specific instructions without hallucinated standards or security risks.

Developed by **Hossein Golshan** ([github.com/hgolshan](https://github.com/hgolshan)).

---

## Table of Contents

1. [What This Tool Does](#what-this-tool-does)
2. [Target Industries & Engineering Disciplines](#target-industries--engineering-disciplines)
3. [Key Features](#key-features)
4. [Architecture & Zero-Risk Privacy](#architecture--zero-risk-privacy)
5. [GitHub Pages Deployment Instructions](#github-pages-deployment-instructions)
6. [Updating the Website](#updating-the-website)
7. [Local Development & Testing](#local-development--testing)
8. [Adding a New Language](#adding-a-new-language)
9. [Adding or Editing Skill Modules](#adding-or-editing-skill-modules)
10. [Generating the Optional Word Proposal (.docx)](#generating-the-optional-word-proposal-docx)
11. [Project Validation](#project-validation)
12. [Professional Engineering Disclaimer](#professional-engineering-disclaimer)
13. [License](#license)

---

## 1. What This Tool Does

When engineers interact with general-purpose AI assistants (ChatGPT, Claude, Microsoft Copilot, Gemini, DeepSeek, or local LLMs), default responses often suffer from three major pitfalls:
1. **Generic Tone**: Superficial high-level summaries unsuitable for formal engineering deliverables.
2. **Hallucinated Standards**: Fabricating nonexistent ASTM, ASME, or ISO clause numbers, invalid ASTM grades, or phantom formulas.
3. **Hidden Assumptions**: Generating numbers without declaring boundary limits, design temperatures, or unit conventions.

**Engineering AI Profile & Skill Builder** solves this by generating deterministic, modular system instructions that enforce:
- Authentic engineering vocabulary and role-appropriate technical depth.
- Explicit declaration of all assumptions and boundary conditions.
- Step-by-step formula derivations and dimensional unit checks (SI or Imperial).
- Actionable checklists and interdisciplinary battery limit (B/L) tracking.
- Strict anti-hallucination rules that prevent fabricating standard clauses.

---

## 2. Target Industries & Engineering Disciplines

### Target Industries
- **Steel-Making Plants**: Electric Arc Furnaces (EAF), Basic Oxygen Furnaces (BOF), Continuous Casters, Rolling Mills.
- **Aluminum & Alumina**: Reduction potlines, anode plants, casthouses, and alumina refineries.
- **Metal Production & Mineral Processing**: Copper, zinc, and lead smelters; concentrators, ball mills, and beneficiation plants.
- **Heavy Industrial & Petrochemical**: Industrial utility complexes, water treatment, air separation units (ASU), and offsites.
- **Greenfield & Brownfield EPC/EPCM**: New facility development, brownfield tie-ins, revamping, and shutdown debottlenecking.

### Supported Disciplines
- Civil & Structural Engineering (Concrete foundations, structural steel, seismic/wind analysis)
- Mechanical Equipment (Static pressure vessels, storage tanks, rotating machinery, pumps, compressors)
- Electrical Systems (Substations, MV/LV power distribution, SLD, short circuit, protection)
- Process Engineering & Metallurgy (PFD, P&ID, mass & heat balances, hydraulics, relief valves)
- Piping Engineering (Pipe specs, wall thickness, flexibility analysis, tie-in schedules)
- Instrumentation & Control (DCS, PLC, loop diagrams, I/O lists, Cause & Effect, SIS)
- HVAC & Industrial Ventilation (Control room pressurization, hazardous area air changes, cooling loads)
- Construction & Erection (Heavy lift rigging, constructability reviews, ITP plans)
- Procurement & Vendor Engineering (Technical Bid Evaluations [TBE], deviation matrices)
- Planning & Project Controls (Work Breakdown Structure [WBS], Primavera P6 logic, Critical Path [CPM])
- Technical Office & Document Control (DCC transmittals, Comment Resolution Sheets [CRS], QA/QC)

---

## 3. Key Features

- **Instant Live Composition**: See the generated system prompt update synchronously with every checkbox or field change.
- **Full Bilingual Localization**: Complete parity across English (LTR) and Persian (RTL) for all UI elements, explanations, and generated texts.
- **Flexible Output Language Selector**: Choose to generate prompts matching the UI language, or strictly lock prompt generation to English or Persian.
- **One-Click Actions**:
  - Copy prompt directly to clipboard (with robust fallback).
  - Download as Markdown (`.md`) or Plain Text (`.txt`).
  - Export configuration as schema-validated JSON.
  - Import previous JSON configurations with validation and error handling.
  - Reset form to defaults with confirmation modal.
- **Dark & Light Industrial Themes**: Carefully calibrated WCAG AA contrast palettes with persistent preference storage.
- **Zero External Dependencies**: Uses native browser technologies, standard system font stacks, and zero external trackers or CDNs.

---

## 4. Architecture & Zero-Risk Privacy

This project is built as a **pure static client-side web application**:
- **Hosted Exclusively on GitHub Pages**: No Node.js server, Python backend, or database.
- **Zero Runtime AI API Calls**: Text generation is deterministic template composition performed in JavaScript.
- **Zero Network Data Leakage**: Your profile configuration, job titles, and custom instructions never leave your browser.
- **Safe DOM APIs**: User inputs are treated strictly as data (via `textContent` and `value`)—never injected as raw HTML.

---

## 5. GitHub Pages Deployment Instructions

The production site is published exclusively through **GitHub Actions**. Follow these steps to configure your repository:

### Step 1: Push Code to GitHub
Ensure all repository files are pushed to the `main` branch of your GitHub repository:
```bash
git remote add origin https://github.com/hgolshan/Engineering-AI-Profile-Skill-Builder.git
git branch -M main
git push -u origin main
```

### Step 2: Configure Repository Settings
1. Navigate to your repository on GitHub: `https://github.com/hgolshan/Engineering-AI-Profile-Skill-Builder`
2. Click on the **Settings** tab.
3. In the left navigation sidebar, click on **Pages** (under the "Code and automation" section).
4. Under **Build and deployment** → **Source**, change the dropdown from **"Deploy from a branch"** to **"GitHub Actions"**.
5. Save the setting.

### Step 3: Automated Deployment
- GitHub Actions will automatically detect `.github/workflows/deploy-pages.yml` and trigger a deployment whenever commits are pushed to `main`.
- You can monitor the deployment progress under the **Actions** tab of your repository.
- Once completed, your live site will be accessible at:
  **`https://hgolshan.github.io/Engineering-AI-Profile-Skill-Builder/`**

---

## 6. Updating the Website

To update the website in the future:
1. Make your changes locally.
2. Commit and push your changes to `main`:
   ```bash
   git add .
   git commit -m "Update engineering skills and documentation"
   git push origin main
   ```
3. GitHub Actions will automatically build the artifact and deploy the latest version to GitHub Pages within 1–2 minutes.

---

## 7. Local Development & Testing

Modern browsers block `fetch()` requests to local JSON files when opened directly via the `file://` protocol. To test the site locally, launch a lightweight HTTP server:

### Option A: Python 3 (Built-in, Recommended)
```bash
# Navigate to the repository root directory
python3 -m http.server 8000
```
Open your browser and navigate to: `http://localhost:8000`

### Option B: Node.js (npx serve)
```bash
npx serve .
```

---

## 8. Adding a New Language

The application is engineered for easy localization:
1. Open `locales/index.json` and register your new language entry:
   ```json
   {
     "code": "es",
     "name": "Spanish",
     "localName": "Español",
     "dir": "ltr",
     "default": false
   }
   ```
2. Duplicate `locales/en.json` to `locales/es.json`.
3. Translate all values in `locales/es.json` while keeping key names identical.
4. Run `python3 validate_project.py` to verify key parity.
5. The language selector will automatically include the new language on page reload.

---

## 9. Adding or Editing Skill Modules

To introduce a new engineering or general skill:
1. In `assets/js/app.js`:
   Add your new module ID to `WHITELISTS.generalSkills` or `WHITELISTS.disciplineSkills`.
2. In `locales/en.json` and `locales/fa.json`:
   Add the corresponding module definition with `name`, `desc`, and `prompt`:
   ```json
   "corrosion_control": {
     "name": "Cathodic Protection & Corrosion Control",
     "desc": "Cathodic protection criteria, coating specs, and corrosion monitoring in industrial plants.",
     "prompt": "For Corrosion & Cathodic Protection tasks: comply with NACE/AMPP and ISO 15589 standards..."
   }
   ```
3. The new module will automatically render as a selectable card in the form and integrate into generated outputs.

---

## 10. Generating the Optional Word Proposal (.docx)

A complete project proposal is provided in Markdown format at `docs/PROJECT_PROPOSAL.md`.

An optional Python development script is included to convert this proposal into a professionally formatted Microsoft Word document:

```bash
# 1. Install python-docx (only required for this local developer utility)
pip install python-docx

# 2. Run the script to generate the .docx file
python3 docs/build_docx.py
```

The output file will be created at:
`docs/Engineering_AI_Profile_Skill_Builder_Proposal.docx`

---

## 11. Project Validation

A Python standard-library validation script is included in the root directory to verify project integrity:

```bash
python3 validate_project.py
```

The script verifies:
- JSON syntax of all files in `locales/`.
- 100% key parity between `en.json` and `fa.json`.
- Existence of all HTML element IDs referenced by `assets/js/app.js`.
- Correct relative asset paths suitable for GitHub Pages subfolder hosting.

---

## 12. Professional Engineering Disclaimer

> **CRITICAL NOTICE**: **Engineering AI Profile & Skill Builder** generates instructions and system prompts for third-party AI assistants. It does **NOT** perform engineering calculations, finite element simulations, or structural code checks.
>
> All calculations, sizing evaluations, equipment datasheets, single-line diagrams, and material recommendations produced by any AI assistant must be independently reviewed, verified, calculated, and stamped by licensed, qualified professional engineers prior to being utilized in tender, design, procurement, or construction activities.

---

## 13. License

This project is licensed under the [MIT License](LICENSE).

Copyright (c) 2026 **Hossein Golshan**.
