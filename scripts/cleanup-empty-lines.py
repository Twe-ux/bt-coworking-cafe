#!/usr/bin/env python3

import re
from pathlib import Path

# Find all page.tsx files in dashboard
dashboard_dir = Path('src/app/dashboard')
page_files = list(dashboard_dir.glob('**/page.tsx'))

print(f"Found {len(page_files)} page.tsx files")

for file_path in page_files:
    with open(file_path, 'r') as f:
        content = f.read()

    original_content = content

    # Replace multiple empty lines with just one empty line
    content = re.sub(r'\n{3,}', '\n\n', content)

    # Write back only if changed
    if content != original_content:
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"  ✓ Cleaned {file_path}")

print("Done!")
