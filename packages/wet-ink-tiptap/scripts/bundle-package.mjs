import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, '..');
const distZip = path.resolve(packageRoot, 'wet-ink-pro-editor-plugin-v1.0.0.zip');

console.log('📦 Bundling Wet Ink Pro Editor Plugin...');
console.log(`Source directory: ${packageRoot}`);

const filesToInclude = [
  'package.json',
  'tsconfig.json',
  'README.md',
  'demo/index.html',
  'docs/OBSIDIAN_INTEGRATION.md',
  'src/index.ts',
  'src/types.ts',
  'src/audio.ts',
  'src/svgExport.ts',
  'src/serialization.ts',
  'src/WetInkNodeView.ts',
  'src/WetInkExtension.ts',
  'src/WetInkExtension.test.ts',
  'src/react/index.ts',
  'src/react/WetInkSignature.tsx',
  'src/obsidian/index.ts'
];

// Verify all files exist
for (const relPath of filesToInclude) {
  const fullPath = path.join(packageRoot, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing file: ${relPath}`);
    process.exit(1);
  }
}

// Bundle using python zipfile module (cross-platform, zero extra npm deps)
const manifestJson = JSON.stringify(filesToInclude);
const pythonScript = `
import zipfile, os, json

root = r"${packageRoot}"
out_zip = r"${distZip}"
files = json.loads(r'''${manifestJson}''')

with zipfile.ZipFile(out_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
    for f in files:
        full_path = os.path.join(root, f)
        zf.write(full_path, arcname=os.path.join('wet-ink-pro', f))

print(f"Zip created successfully: {os.path.getsize(out_zip)} bytes")
`;

try {
  execSync(`python3 -c '${pythonScript.replace(/'/g, "'\\''")}'`, { stdio: 'inherit' });
  console.log(`\n✅ Wet Ink Pro bundle created successfully!`);
  console.log(`📍 Archive: ${distZip}`);
} catch (err) {
  console.error('Failed to create zip archive:', err);
  process.exit(1);
}
