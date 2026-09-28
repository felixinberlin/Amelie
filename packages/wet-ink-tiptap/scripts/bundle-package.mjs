import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packagesDir = path.resolve(__dirname, '../..');
const distZip = path.resolve(packagesDir, 'wet-ink-pro-modular-sdk-v1.0.0.zip');
const legacyDistZip = path.resolve(packagesDir, 'wet-ink-tiptap/wet-ink-pro-editor-plugin-v1.0.0.zip');

console.log('📦 Bundling Wet Ink Pro Modular Multi-Plugin SDK...');
console.log(`Packages root: ${packagesDir}`);

// Modular package files
const coreFiles = [
  'packages/wet-ink-core/package.json',
  'packages/wet-ink-core/README.md',
  'packages/wet-ink-core/src/index.ts',
  'packages/wet-ink-core/src/types.ts',
  'packages/wet-ink-core/src/events.ts',
  'packages/wet-ink-core/src/audio.ts',
  'packages/wet-ink-core/src/svgExport.ts',
  'packages/wet-ink-core/src/serialization.ts',
  'packages/wet-ink-core/src/WetInkController.ts',
  'packages/wet-ink-core/src/WetInkController.test.ts',
  'packages/wet-ink-core/src/webComponent.ts'
];

const tiptapFiles = [
  'packages/wet-ink-tiptap/package.json',
  'packages/wet-ink-tiptap/tsconfig.json',
  'packages/wet-ink-tiptap/README.md',
  'packages/wet-ink-tiptap/demo/index.html',
  'packages/wet-ink-tiptap/docs/OBSIDIAN_INTEGRATION.md',
  'packages/wet-ink-tiptap/src/index.ts',
  'packages/wet-ink-tiptap/src/types.ts',
  'packages/wet-ink-tiptap/src/audio.ts',
  'packages/wet-ink-tiptap/src/svgExport.ts',
  'packages/wet-ink-tiptap/src/serialization.ts',
  'packages/wet-ink-tiptap/src/WetInkNodeView.ts',
  'packages/wet-ink-tiptap/src/WetInkExtension.ts',
  'packages/wet-ink-tiptap/src/WetInkExtension.test.ts',
  'packages/wet-ink-tiptap/src/react/index.ts',
  'packages/wet-ink-tiptap/src/react/WetInkSignature.tsx',
  'packages/wet-ink-tiptap/src/obsidian/index.ts'
];

const reactFiles = [
  'packages/wet-ink-react/package.json',
  'packages/wet-ink-react/src/index.ts',
  'packages/wet-ink-react/src/useWetInk.ts',
  'packages/wet-ink-react/src/WetInkSignature.tsx',
  'packages/wet-ink-react/src/WetInkReact.test.ts'
];

const obsidianFiles = [
  'packages/wet-ink-obsidian/package.json',
  'packages/wet-ink-obsidian/src/index.ts',
  'packages/wet-ink-obsidian/src/WetInkObsidian.test.ts'
];

const allFiles = [...coreFiles, ...tiptapFiles, ...reactFiles, ...obsidianFiles];

// Verify all files exist
for (const relPath of allFiles) {
  const fullPath = path.resolve(packagesDir, '..', relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing file: ${relPath} (checked at ${fullPath})`);
    process.exit(1);
  }
}

// Bundle using python zipfile module (cross-platform, zero extra npm deps)
const repoRoot = path.resolve(packagesDir, '..');
const manifestJson = JSON.stringify(allFiles);

const pythonScript = `
import zipfile, os, json

root = r"${repoRoot}"
out_zip = r"${distZip}"
legacy_zip = r"${legacyDistZip}"
files = json.loads(r'''${manifestJson}''')

# 1. Modular Master Zip
with zipfile.ZipFile(out_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
    for f in files:
        full_path = os.path.join(root, f)
        zf.write(full_path, arcname=os.path.join('wet-ink-pro-sdk', f.replace('packages/', '')))

# 2. Legacy / Dedicated TipTap Zip
with zipfile.ZipFile(legacy_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
    for f in files:
        full_path = os.path.join(root, f)
        zf.write(full_path, arcname=os.path.join('wet-ink-pro', f))

print(f"Master SDK Zip created: {os.path.getsize(out_zip)} bytes")
print(f"Editor Plugin Zip created: {os.path.getsize(legacy_zip)} bytes")
`;

try {
  execSync(`python3 -c '${pythonScript.replace(/'/g, "'\\''")}'`, { stdio: 'inherit' });
  console.log(`\n✅ Modular Wet Ink Pro SDK bundle created successfully!`);
  console.log(`📍 Master Archive: ${distZip}`);
  console.log(`📍 Legacy Archive: ${legacyDistZip}`);
} catch (err) {
  console.error('Failed to create zip archive:', err);
  process.exit(1);
}
