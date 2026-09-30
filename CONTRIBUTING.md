# Contributing to Engineering AI Profile & Skill Builder

Thank you for your interest in contributing to **Engineering AI Profile & Skill Builder**! This project is an open-source, client-side web application dedicated to helping engineering and technical office professionals craft verified, discipline-grounded AI system instructions.

---

## 1. Core Architectural Principles

When contributing code or technical content, you must adhere strictly to these non-negotiable principles:

1. **Zero Runtime Dependencies**: The website is hosted exclusively on GitHub Pages. No external CDNs, web fonts, tracking scripts, or analytics are permitted.
2. **Zero Runtime AI APIs**: The application performs deterministic, client-side prompt synthesis. It does not call Gemini, OpenAI, Claude, or any third-party AI API at runtime.
3. **No Build Step Required for Production**: GitHub Pages serves the raw repository files (`index.html`, `assets/`, `locales/`). All file references must remain relative.
4. **Engineering Rigor**: Guidance texts must reflect authentic EPC/EPCM industrial practices (e.g., steelmaking, smelters, petrochemicals, mineral processing). Avoid generic AI buzzwords or fictional standard clauses.
5. **Full Bilingual Parity**: Any new feature or label must be translated completely and accurately into both English (`locales/en.json`) and Persian (`locales/fa.json`).

---

## 2. Local Development and Testing

Because modern browsers enforce CORS restrictions when fetching JSON files over the `file://` protocol, you should run a local HTTP server for testing:

```bash
# Using Python 3 built-in HTTP server:
python3 -m http.server 8000

# Open in your web browser:
# http://localhost:8000
```

To run project validation checks:

```bash
python3 validate_project.py
```

---

## 3. How to Add a New Language

Adding a new language is straightforward and requires no changes to the core layout:

1. Register your language in `locales/index.json`:
   ```json
   {
     "code": "de",
     "name": "German",
     "localName": "Deutsch",
     "dir": "ltr",
     "default": false
   }
   ```
2. Create a new locale file `locales/de.json` by copying `locales/en.json`.
3. Translate all keys accurately. Keep key names identical to `locales/en.json`.
4. Run `python3 validate_project.py` to ensure complete key parity.

---

## 4. How to Add or Edit Skill Modules

Skill modules are defined in `assets/js/app.js` and localized in `locales/en.json` and `locales/fa.json`:

1. In `assets/js/app.js`, add the unique module ID to `WHITELISTS.generalSkills` or `WHITELISTS.disciplineSkills`.
2. In `locales/en.json` and `locales/fa.json`:
   - Under `generalSkills` or `disciplineSkills`, add the object with `name`, `desc`, and `prompt`.
3. Keep prompts concrete, specifying relevant international codes (ASME, ISO, API, IEC, AISC) without inventing fake clause numbers.

---

## 5. Submitting Pull Requests

1. Fork the repository at [github.com/hgolshan/Engineering-AI-Profile-Skill-Builder](https://github.com/hgolshan/Engineering-AI-Profile-Skill-Builder).
2. Create a descriptive feature branch:
   ```bash
   git checkout -b feature/add-metallurgy-module
   ```
3. Commit your changes with clear, professional messages.
4. Ensure `python3 validate_project.py` passes without errors or warnings.
5. Push to your branch and open a Pull Request against the `main` branch.

---

## 6. Code of Conduct & Standards

- Respect contributors and maintain an objective, technical tone.
- Avoid proprietary, classified, or client-sensitive engineering data in any sample texts or documentation.
- All contributions are licensed under the [MIT License](LICENSE).
