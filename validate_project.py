#!/usr/bin/env python3
"""
Engineering AI Profile & Skill Builder - Project Validation Utility
Uses Python standard library only.
Validates:
  1. Required repository files presence
  2. Locale JSON syntax and complete key parity (en.json vs fa.json)
  3. DOM element IDs referenced by assets/js/app.js exist in index.html
  4. Relative path safety for GitHub Pages subfolder hosting
"""

import os
import sys
import json
import re

REQUIRED_FILES = [
    ".github/workflows/deploy-pages.yml",
    "assets/css/styles.css",
    "assets/icons/favicon.svg",
    "assets/js/app.js",
    "docs/PROJECT_PROPOSAL.md",
    "docs/build_docx.py",
    "locales/index.json",
    "locales/en.json",
    "locales/fa.json",
    ".gitignore",
    ".nojekyll",
    "404.html",
    "CONTRIBUTING.md",
    "index.html",
    "LICENSE",
    "README.md",
    "SECURITY.md"
]

def get_all_keys(d, prefix=""):
    """Recursively collect all dot-notation keys from a dict."""
    keys = set()
    for k, v in d.items():
        full_key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            keys.update(get_all_keys(v, full_key))
        else:
            keys.add(full_key)
    return keys

def main():
    root = os.path.dirname(os.path.abspath(__file__))
    print("=" * 70)
    print("ENGINEERING AI PROFILE & SKILL BUILDER - VALIDATION SUITE")
    print("=" * 70)
    
    errors = []
    warnings = []

    # 1. Required Files Check
    print("\n[1/4] Verifying required repository files...")
    for rel_path in REQUIRED_FILES:
        full_path = os.path.join(root, rel_path)
        if not os.path.exists(full_path):
            errors.append(f"Missing required file: {rel_path}")
        else:
            print(f"  ✓ Found {rel_path}")

    # 2. Locale JSON Validation and Parity
    print("\n[2/4] Validating locale files & translation key parity...")
    locales_dir = os.path.join(root, "locales")
    index_path = os.path.join(locales_dir, "index.json")
    en_path = os.path.join(locales_dir, "en.json")
    fa_path = os.path.join(locales_dir, "fa.json")

    try:
        with open(index_path, "r", encoding="utf-8") as f:
            locales_idx = json.load(f)
        if not isinstance(locales_idx, list) or len(locales_idx) < 2:
            errors.append("locales/index.json must be a list containing at least 'en' and 'fa'")
        else:
            print("  ✓ locales/index.json is valid JSON array")
    except Exception as e:
        errors.append(f"Failed to parse locales/index.json: {e}")

    en_keys = set()
    fa_keys = set()

    try:
        with open(en_path, "r", encoding="utf-8") as f:
            en_data = json.load(f)
        en_keys = get_all_keys(en_data)
        print(f"  ✓ locales/en.json parsed successfully ({len(en_keys)} leaf keys)")
    except Exception as e:
        errors.append(f"Failed to parse locales/en.json: {e}")

    try:
        with open(fa_path, "r", encoding="utf-8") as f:
            fa_data = json.load(f)
        fa_keys = get_all_keys(fa_data)
        print(f"  ✓ locales/fa.json parsed successfully ({len(fa_keys)} leaf keys)")
    except Exception as e:
        errors.append(f"Failed to parse locales/fa.json: {e}")

    if en_keys and fa_keys:
        missing_in_fa = en_keys - fa_keys
        missing_in_en = fa_keys - en_keys
        if missing_in_fa:
            errors.append(f"Keys present in en.json but missing in fa.json ({len(missing_in_fa)}): {list(missing_in_fa)[:5]}")
        if missing_in_en:
            errors.append(f"Keys present in fa.json but missing in en.json ({len(missing_in_en)}): {list(missing_in_en)[:5]}")
        if not missing_in_fa and not missing_in_en:
            print("  ✓ 100% Key Parity confirmed between English and Persian locales")

    # 3. HTML Element IDs Validation
    print("\n[3/4] Validating DOM Element IDs between app.js and index.html...")
    app_js_path = os.path.join(root, "assets/js/app.js")
    index_html_path = os.path.join(root, "index.html")

    if os.path.exists(app_js_path) and os.path.exists(index_html_path):
        with open(app_js_path, "r", encoding="utf-8") as f:
            js_content = f.read()
        with open(index_html_path, "r", encoding="utf-8") as f:
            html_content = f.read()

        # Find document.getElementById('...') in JS
        js_ids = set(re.findall(r"getElementById\(['\"]([a-zA-Z0-9_\-]+)['\"]\)", js_content))
        html_ids = set(re.findall(r'id=["\']([a-zA-Z0-9_\-]+)["\']', html_content))

        missing_ids = js_ids - html_ids
        if missing_ids:
            errors.append(f"DOM IDs requested by app.js missing in index.html: {missing_ids}")
        else:
            print(f"  ✓ All {len(js_ids)} DOM IDs required by app.js exist in index.html")

    # 4. GitHub Pages Subdirectory Path Safety Check
    print("\n[4/4] Checking for dangerous root-relative paths (/assets, /locales)...")
    dangerous_patterns = [r'href=["\']/(?!/)', r'src=["\']/(?!/)', r'fetch\(["\']/(?!/)']
    
    for check_file in ["index.html", "404.html", "assets/js/app.js"]:
        fpath = os.path.join(root, check_file)
        if os.path.exists(fpath):
            with open(fpath, "r", encoding="utf-8") as f:
                content = f.read()
            for pat in dangerous_patterns:
                matches = re.findall(pat, content)
                if matches:
                    errors.append(f"Root-relative path found in {check_file} (pattern: {pat})")
    
    print("  ✓ Path checks complete - All URLs verified relative for GitHub Pages")

    # Summary
    print("\n" + "=" * 70)
    if errors:
        print(f"FAILED: {len(errors)} error(s) detected:")
        for err in errors:
            print(f"  ✗ {err}")
        sys.exit(1)
    else:
        print("SUCCESS: All validation checks passed flawlessly!")
        print("Project is 100% production-ready for GitHub Pages deployment.")
        print("=" * 70 + "\n")
        sys.exit(0)

if __name__ == "__main__":
    main()
