# Project Proposal: Engineering AI Profile & Skill Builder

**Document Identifier:** PRJ-ENG-AI-2026-001  
**Project Title:** Engineering AI Profile & Skill Builder  
**Project Author & Lead:** Hossein Golshan  
**Target Organization:** Industrial Plants, Metal Production Complexes, Utilities & EPC/EPCM Engineering Enterprises  
**Distribution:** Public / Open-Source (MIT License)  
**Production URL:** https://hgolshan.github.io/Engineering-AI-Profile-Skill-Builder/  
**Source Repository:** https://github.com/hgolshan/Engineering-AI-Profile-Skill-Builder  

---

## 1. Executive Summary

As artificial intelligence systems (large language models, multimodal assistants, and code-generation agents) rapidly enter modern engineering workplaces, enterprise engineering organizations face a dual challenge:

1. **The Productivity Imperative**: General-purpose AI tools offer substantial time savings in drafting technical specifications, synthesizing vendor documents, structuring calculation notes, and managing cross-discipline coordination.
2. **The Integrity & Compliance Risk**: Default, uncalibrated AI prompts produce generic, superficial outputs, frequently fabricate fictitious standard clauses (hallucinated ASME, ASTM, ISO, or API numbers), make unstated assumptions, and obscure critical safety boundaries.

The **Engineering AI Profile & Skill Builder** is an open-source, client-side web application specifically designed to bridge this gap for industrial and EPC/EPCM engineering environments. It provides a structured, bilingual framework (English and Persian) allowing engineers, technical managers, and document controllers to construct deterministic, discipline-grounded AI system prompts and reusable skill instructions.

By embedding verified engineering constraints, explicit calculation methodologies, unit conventions, and anti-hallucination guardrails directly into the AI persona, the application equips technical professionals to leverage AI effectively while maintaining uncompromising adherence to engineering standards and human verification protocols.

---

## 2. Problem Statement in Heavy Industry & EPC Organizations

### 2.1 The Nature of Industrial EPC Projects
Engineering, Procurement, and Construction (EPC) projects in heavy industries—such as steel-making plants (EAF/BOF, continuous casters, rolling mills), aluminum smelters, mineral processing facilities, chemical plants, and utility complexes—operate under stringent quality assurance regimes. Deliverables (e.g., Basis of Design, Calculation Books, Piping Isometrics, Single Line Diagrams, Equipment Datasheets) must withstand multidisciplinary audits, third-party inspection, and rigorous client reviews.

### 2.2 Critical Vulnerabilities of Unstructured AI Usage
When engineering staff utilize commercial AI chatbots without structured system prompts, four systemic problems emerge:

| Failure Mode | Manifestation in Engineering Context | Potential Operational Impact |
| :--- | :--- | :--- |
| **Phantom Standards & Clauses** | AI invents non-existent ASTM specifications, fictitious API 650 appendixes, or incorrect ISO clauses to justify answers. | Invalidation of technical bid evaluations; severe non-compliance during client audits. |
| **Hidden Assumptions** | AI performs calculations assuming standard atmospheric conditions or ambient temperatures without declaring them. | Catastrophic sizing errors for high-altitude plants or extreme desert environments. |
| **Premature Simplification** | AI defaults to conversational, superficial summaries instead of providing mathematical derivations and unit checks. | Engineering deliverables lack necessary verification trails required for PE stamping. |
| **Data Leakage Concerns** | Engineers paste proprietary plant operating data or contractual transmittals into public AI chatbots without organizational guidance. | Breach of client confidentiality agreements and loss of trade secrets. |

---

## 3. Strategic Project Objectives

The project aims to achieve the following concrete outcomes:

1. **Standardize AI Prompt Engineering Across Disciplines**: Provide a common, high-quality template library tailored to Civil/Structural, Mechanical, Electrical, Process, Piping, I&C, HVAC, and Project Controls disciplines.
2. **Zero-Trust Information Verification**: Enforce anti-hallucination directives that compel the AI assistant to ask clarifying questions for missing inputs and explicitly differentiate confirmed project facts from working assumptions.
3. **100% Client-Side Privacy Compliance**: Eliminate external servers, analytics trackers, and third-party API dependencies, ensuring zero user data is transmitted over the network.
4. **Bilingual Equity (EN / FA)**: Provide seamless native support for both English (the lingua franca of international EPC contracts) and Persian (crucial for domestic industrial complexes and regional documentation).
5. **Universal Portability**: Enable instant export of configurations as standard JSON, Markdown (.md), and Plain Text (.txt) compatible with ChatGPT, Claude, Microsoft Copilot, and self-hosted open-source LLMs (e.g., Llama, DeepSeek).

---

## 4. Target Audience & Industrial Scope

### 4.1 Industrial Facilities
- **Steel-Making Plants**: Raw material handling, Electric Arc Furnaces (EAF), Ladle Furnaces, Continuous Casting Machines (CCM), Hot/Cold Rolling Mills.
- **Aluminum & Alumina Production**: Alumina refineries (Bayer process), Reduction potlines, Anode baking plants, Ingot casthouses.
- **Mineral Processing & Beneficiation**: Crushing plants, SAG/ball mills, flotation banks, thickeners, tailing filtration.
- **Utilities & Industrial Offsites**: Water treatment, reverse osmosis, compressed air systems, cooling towers, electrical switchyards.
- **Greenfield & Brownfield EPC Environments**: New facility development, brownfield tie-in scheduling, plant revamps, and turnaround overhauls.

### 4.2 Engineering Disciplines
- **Civil & Structural Engineers**: Foundation design, dynamic equipment loads, heavy industrial steel structures, seismic/wind criteria.
- **Mechanical Engineers**: Rotating machinery (pumps, compressors, fans), static pressure equipment, tanks, heat exchangers, material handling.
- **Electrical & Power Engineers**: Substation design, MV/LV switchgear, Single Line Diagrams, short-circuit studies, cable schedules, earthing systems.
- **Process Engineers & Metallurgists**: Mass and energy balance, PFD/P&ID development, hydraulic calculations, relief valve sizing.
- **Piping Engineers**: Pipe wall thickness, flexibility and stress analysis, tie-in schedules, support standards.
- **Instrumentation & Control Engineers**: DCS/PLC architecture, field instruments, I/O schedules, Cause & Effect matrices, SIL/SIS.
- **HVAC & Ventilation Engineers**: Industrial air change rates, control room positive pressurization, hazardous area exhaust systems.
- **Construction & Rigging Specialists**: Constructability reviews, heavy lift rigging calculations, Inspection and Test Plans (ITP).
- **Technical Procurement Staff**: Technical Bid Evaluations (TBE), vendor data verification, deviation tracking.
- **Planning & Project Controls Staff**: Work Breakdown Structures (WBS), Primavera P6 network logic, Earned Value Management (EVM).

---

## 5. Architectural & Security Framework

### 5.1 Static Architecture on GitHub Pages
To guarantee operational reliability and zero operating cost, the application is deployed entirely as a static web bundle on **GitHub Pages**:
- **Hosting**: Exclusively GitHub Pages via automated GitHub Actions deployment.
- **Core Languages**: Standards-compliant HTML5, Modern Vanilla JavaScript (ES2022), and Pure CSS.
- **No Build Pipeline Dependency**: Can be served directly from any HTTP server or preview environment without requiring a build step.
- **Relative Path Resolution**: All asset links and locale JSON fetches use relative URL resolution (`new URL(path, document.baseURI)`), ensuring compatibility within subfolder hosting environments.

### 5.2 Privacy & Security Model
- **No Production Backend**: Zero application servers, zero databases, and zero cloud storage buckets.
- **Zero Runtime AI API Execution**: Profile generation is deterministic text synthesis. No API keys or tokens are stored or transmitted.
- **Safe DOM APIs**: All user inputs are handled strictly via safe DOM properties (`textContent`, `value`) to eliminate XSS attack vectors.
- **Local Persistence Only**: Saved configurations reside in the browser's `localStorage` and can be wiped with a single click.

---

## 6. Functional Capabilities & Skill Modules

### 6.1 Two-Tier Skill Architecture
The application distinguishes between two foundational categories of engineering skills:

#### A. General Professional Skills
- **Technical Writing & Design Criteria**: Mandates objective, concise prose and standardized requirement levels (shall / should / may).
- **Microsoft Office Engineering Suite**:
  - *Word*: Hierarchical numbered sections, formal table formatting, clean cross-references.
  - *Excel*: Robust formulas (XLOOKUP, INDEX/MATCH, LET), input/output block separation, units in every cell, VBA macros.
  - *PowerPoint*: Executive slide narrative, comparative trade-off matrices, high-density takeaway titles.
- **Meeting Minutes (MoM) & Action Lists**: Numbered action items with accountable disciplines and firm deadlines.
- **Formal Contractual Correspondence**: RFI drafting, transmittal cover letters, and formal variation notifications.
- **Comment Resolution Sheets (CRS)**: Structured review matrices with clause citations, technical justification, and severity ratings.
- **Interdisciplinary EPC Coordination**: Battery limit (B/L) definition, dynamic load coordination, and physical clash management.

#### B. Discipline-Specific Engineering Skills
- **Civil & Structural**: Strict adherence to AISC 360, ACI 318, Eurocodes, ASCE 7; load combinations; serviceability vs ultimate limit states.
- **Mechanical Equipment**: ASME Sec VIII, API 650/620, API 610/ISO 13709; NPSH margins, design pressure/temperature, corrosion allowance.
- **Electrical Power**: IEC 60364/60909, IEEE 141/399; load lists with diversity factors; short circuit breaking capacity; cable derating factors.
- **Process Metallurgy**: Conservation of mass and energy; P&ID conventions; fail-safe positions; overpressure relief per API 520/521.
- **Piping & Stress**: ASME B31.3/B31.1; internal pressure thickness; thermal expansion flexibility; tie-in schedules and hot-tap criteria.
- **Instrumentation & Control**: Hazardous area classification (ATEX/IECEx); I/O classification; Functional Safety per IEC 61508/61511.
- **HVAC & Ventilation**: Sensible/latent loads; pressurization margins; air change rates; filtration and N+1 redundancy.
- **Construction & Rigging**: Crane capacity safety factors; ground bearing pressures; ITP Hold/Witness points; WPS/PQR welding.
- **Procurement & TBE**: Structured compliance matrices; deviation classifications; sub-vendor validation.
- **Planning & Controls**: WBS hierarchical logic; schedule integrity; Total Float and Critical Path; EVM indicators (CPI/SPI).

---

## 7. Human-in-the-Loop Verification & Ethical Governance

### 7.1 Mandatory Verification Clause
Every generated profile automatically injects a non-negotiable legal and professional engineering verification clause:

> *"All outputs, calculations, formulas, and advice produced by this AI assistant constitute preliminary draft recommendations only. They do not constitute approved, certified, or stamped engineering work. All designs, material selections, sizing calculations, and specifications must be independently calculated, audited, and stamped by a qualified, licensed professional engineer before tender, procurement, or construction."*

### 7.2 Clear Software Boundaries
The profile explicitly instructs the AI that it does **not** have direct execution access to proprietary CAD/CAE/BIM files (.dwg, .nwd, .dgn, .edb, .sdb, etc.). The AI is directed to provide exact input values, governing equations, modeling strategies, or validation scripts for the human engineer to execute in their licensed desktop software.

---

## 8. Rollout Plan & Implementation Roadmap

| Phase | Milestone | Deliverables | Timeline |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Baseline Tool Development | Core static web application, bilingual localization (EN/FA), basic skill modules. | Completed |
| **Phase 2** | EPC Pilot Testing | Validation by senior discipline leads in mechanical, electrical, and civil groups. | Month 1 |
| **Phase 3** | Skill Library Expansion | Adding specialized modules (Cathodic protection, fire protection, environmental). | Month 2 |
| **Phase 4** | Enterprise Distribution | Publishing to GitHub Pages, hosting local company workshops, deploying to internal intranets. | Month 3 |

---

## 9. Return on Investment (ROI) & Success Metrics

1. **Efficiency Gains**: An estimated 25–40% reduction in time required to draft first-revision technical specifications, datasheets, and transmittal letters.
2. **First-Time Quality**: Significant reduction in client comment cycles (CRS rounds) due to standardized technical terminology and comprehensive assumption declarations.
3. **Zero Financial Overhead**: Because the application requires no server hosting, database licenses, or paid API credits, total cost of ownership (TCO) is zero.

---

## 10. Conclusion & Contact Information

The **Engineering AI Profile & Skill Builder** transforms generative AI from an unpredictable conversational novelty into a disciplined, structured engineering productivity tool. By placing verification, safety, and domain-specific engineering standards at the core of prompt composition, this project enables engineering teams to innovate with confidence.

**Project Lead:** Hossein Golshan  
**GitHub Repository:** [https://github.com/hgolshan/Engineering-AI-Profile-Skill-Builder](https://github.com/hgolshan/Engineering-AI-Profile-Skill-Builder)  
**Live Application:** [https://hgolshan.github.io/Engineering-AI-Profile-Skill-Builder/](https://hgolshan.github.io/Engineering-AI-Profile-Skill-Builder/)  
