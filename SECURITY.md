# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

---

## 1. Architecture & Threat Model

**Engineering AI Profile & Skill Builder** is architected to eliminate entire classes of web security vulnerabilities:

- **100% Client-Side Execution**: All prompt composition, form rendering, and state management happen entirely inside the user's browser.
- **No Production Backend or Database**: There are no application servers, databases, or API backends to compromise.
- **Zero Runtime AI API Calls**: The application does not require, store, or transmit API keys (OpenAI, Anthropic, Gemini, etc.).
- **Zero Third-Party CDNs or External Scripts**: All stylesheets, scripts, icons, and locales are hosted directly within the repository.
- **No innerHTML for User Inputs**: User-supplied values (e.g., custom directives, job titles, profile names) are handled strictly through safe DOM properties (`value`, `textContent`, `setAttribute`), eliminating Cross-Site Scripting (XSS) risks.

---

## 2. Important Confidentiality Warnings for Engineers

While this tool is safe, engineers must exercise caution with their resulting prompts:

1. **Unencrypted Browser Storage**: Saved profiles in your browser's `localStorage` are stored as unencrypted text. If you use a shared or public computer, use the "Reset Form" button to clear cached data after export.
2. **Proprietary Plant Data**: Never include classified project parameters, confidential patent formulations, unannounced contract terms, or proprietary corporate data in custom directives if you intend to paste the resulting prompt into an unapproved commercial cloud AI system.
3. **Approved Enterprise AI Systems**: Always verify with your company's IT or Information Security Department whether an AI chatbot is approved for corporate engineering workflows.

---

## 3. Reporting a Vulnerability

If you discover a security concern or vulnerability in this repository, please report it responsibly:

- **Primary Contact**: Hossein Golshan
- **Email**: Reach out via GitHub profile contact: [https://github.com/hgolshan](https://github.com/hgolshan)
- Please include a detailed description of the issue and reproduction steps.
- Security reports will be reviewed promptly.
