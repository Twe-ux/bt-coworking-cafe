#!/usr/bin/env node

/**
 * Script to convert static imports of local components to dynamic imports
 * in Next.js page.tsx files to fix webpack build errors
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all page.tsx files that import local components
function findPagesToConvert() {
  try {
    const output = execSync(
      `find src/app/dashboard -name "page.tsx" -exec grep -l "from.*\\./[Cc]omponents\\|from.*\\./Components" {} \\;`,
      { encoding: 'utf-8' }
    );
    return output.trim().split('\n').filter(Boolean);
  } catch (error) {
    return [];
  }
}

// Check if file already has dynamic rendering
function isAlreadyConverted(content) {
  return content.includes("export const dynamic = 'force-dynamic'");
}

// Extract local component imports
function extractLocalImports(content) {
  const imports = [];
  const importRegex = /import\s+(\w+)\s+from\s+['"](\.\/(components|Components)\/[^'"]+)['"]/g;
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    imports.push({
      componentName: match[1],
      importPath: match[2],
      fullMatch: match[0]
    });
  }

  return imports;
}

// Convert a page file
function convertPage(filePath) {
  console.log(`\n📝 Converting: ${filePath}`);

  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if already converted
  if (isAlreadyConverted(content)) {
    console.log(`  ⏭️  Already converted, skipping`);
    return false;
  }

  // Extract local imports
  const localImports = extractLocalImports(content);

  if (localImports.length === 0) {
    console.log(`  ⏭️  No local component imports found, skipping`);
    return false;
  }

  console.log(`  🔍 Found ${localImports.length} local component import(s)`);

  // Remove static metadata export (conflicts with dynamic)
  content = content.replace(/export const metadata[^;]*;?\n?/g, '');

  // Remove original static imports
  localImports.forEach(imp => {
    content = content.replace(imp.fullMatch + ';\n', '');
    content = content.replace(imp.fullMatch + ';', '');
  });

  // Add dynamic import if not present
  if (!content.includes("import dynamic from 'next/dynamic'")) {
    // Find the last import statement
    const lastImportMatch = content.match(/import[^;]+;(?=\s*\n(?!import))/);
    if (lastImportMatch) {
      const insertPos = content.indexOf(lastImportMatch[0]) + lastImportMatch[0].length;
      content = content.slice(0, insertPos) + "\nimport dynamic from 'next/dynamic';" + content.slice(insertPos);
    }
  }

  // Add force-dynamic export and dynamic imports after all imports
  const lastImportIndex = content.lastIndexOf('import ');
  const nextLineAfterImports = content.indexOf('\n', lastImportIndex);
  const semicolonAfterImport = content.indexOf(';', lastImportIndex);
  const insertPosition = Math.max(nextLineAfterImports, semicolonAfterImport) + 1;

  let dynamicCode = '\n// Force dynamic rendering\nexport const dynamic = \'force-dynamic\';\n\n';
  dynamicCode += '// Dynamically import Client Components to avoid build-time bundling issues\n';

  localImports.forEach(imp => {
    dynamicCode += `const ${imp.componentName} = dynamic(() => import('${imp.importPath}'), {\n`;
    dynamicCode += `  ssr: false,\n`;
    dynamicCode += `  loading: () => <div className="text-center p-4">Loading...</div>\n`;
    dynamicCode += `});\n\n`;
  });

  content = content.slice(0, insertPosition) + dynamicCode + content.slice(insertPosition);

  // Clean up multiple blank lines
  content = content.replace(/\n\n\n+/g, '\n\n');

  // Write the modified content
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  ✅ Converted successfully`);

  return true;
}

// Main execution
function main() {
  console.log('🚀 Starting automatic conversion to dynamic imports...\n');

  const pages = findPagesToConvert();
  console.log(`📋 Found ${pages.length} page(s) with local component imports\n`);

  let convertedCount = 0;
  let skippedCount = 0;

  pages.forEach(page => {
    const converted = convertPage(page);
    if (converted) {
      convertedCount++;
    } else {
      skippedCount++;
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log(`\n✨ Conversion complete!`);
  console.log(`   ✅ Converted: ${convertedCount} page(s)`);
  console.log(`   ⏭️  Skipped: ${skippedCount} page(s)`);
  console.log('\n' + '='.repeat(60));

  if (convertedCount > 0) {
    console.log('\n💡 Next steps:');
    console.log('   1. Review the changes: git diff');
    console.log('   2. Commit: git add -A && git commit -m "Auto-convert pages to dynamic imports"');
    console.log('   3. Push: git push');
  }
}

main();
