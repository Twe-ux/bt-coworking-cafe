#!/usr/bin/env python3

import os
import re
from pathlib import Path

# Find all page.tsx files in dashboard
dashboard_dir = Path('src/app/dashboard')
page_files = list(dashboard_dir.glob('**/page.tsx'))

print(f"Found {len(page_files)} page.tsx files")

for file_path in page_files:
    with open(file_path, 'r') as f:
        content = f.read()

    # Skip if no dynamicImport
    if 'dynamicImport' not in content:
        continue

    print(f"Processing {file_path}...")

    original_content = content

    # Remove the dynamicImport import line
    content = re.sub(r"import dynamicImport from ['\"]next/dynamic['\"];?\n", '', content)

    # Pattern to match: const ComponentName = dynamicImport(() => import('path'), { ... });
    # This needs to handle multi-line
    pattern = r"const (\w+) = dynamicImport\(\(\) => import\(['\"]([^'\"]+)['\"]\),\s*\{[^}]+\}\);?\n?"

    # Find all dynamic imports
    matches = list(re.finditer(pattern, content, re.MULTILINE))

    static_imports = []
    for match in matches:
        component_name = match.group(1)
        import_path = match.group(2)
        static_imports.append(f"import {component_name} from '{import_path}';\n")

        # Remove the dynamic import declaration
        content = content.replace(match.group(0), '')

    # Add static imports after the last import line
    if static_imports:
        # Find position after last existing import
        import_lines = re.findall(r"^import .+;?\n", content, re.MULTILINE)
        if import_lines:
            last_import = import_lines[-1]
            # Insert static imports after last import
            content = content.replace(last_import, last_import + ''.join(static_imports))

    # Clean up extra newlines before "// Force dynamic rendering"
    content = re.sub(r'\n{3,}// Force dynamic rendering', '\n\n// Force dynamic rendering', content)

    # Write back only if changed
    if content != original_content:
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"  ✓ Updated {file_path}")
    else:
        print(f"  - No changes needed for {file_path}")

print("Done!")
