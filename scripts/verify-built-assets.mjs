import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.resolve(root, 'dist');

if (!existsSync(dist)) {
    throw new Error('dist/ does not exist; run the library build before verifying assets');
}

const cssFiles = [];
const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
        const full = path.join(dir, entry);
        const stat = statSync(full);
        if (stat.isDirectory()) walk(full);
        else if (full.endsWith('.css')) cssFiles.push(full);
    }
};
walk(dist);

const isExternal = (value) =>
    /^(?:data:|https?:|\/\/|#)/i.test(value) || value.startsWith('var(');

const references = [];
const missing = [];

const checkReference = (cssFile, rawValue) => {
    const value = rawValue.trim();
    if (!value || isExternal(value)) return;

    const clean = value.split(/[?#]/, 1)[0];
    if (!clean) return;

    let decoded = clean;
    try {
        decoded = decodeURIComponent(clean);
    } catch {
        // Keep the original path; malformed escaping will be reported as a missing reference.
    }

    const resolved = path.resolve(path.dirname(cssFile), decoded);
    const relToDist = path.relative(dist, resolved);
    const record = {
        css: path.relative(root, cssFile).replaceAll('\\', '/'),
        reference: value,
        target: path.relative(root, resolved).replaceAll('\\', '/'),
    };

    if (relToDist.startsWith('..') || path.isAbsolute(relToDist) || !existsSync(resolved)) {
        missing.push(record);
        return;
    }
    references.push(record);
};

for (const cssFile of cssFiles) {
    const css = readFileSync(cssFile, 'utf8');

    const urlRe = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g;
    let match;
    while ((match = urlRe.exec(css)) !== null) {
        checkReference(cssFile, match[2]);
    }

    const importRe = /@import\s+(?:url\(\s*)?['"]([^'"]+)['"]\s*\)?/g;
    while ((match = importRe.exec(css)) !== null) {
        checkReference(cssFile, match[1]);
    }
}

if (missing.length > 0) {
    const detail = missing
        .map((item) => `${item.css}: ${item.reference} -> ${item.target}`)
        .join('\n');
    throw new Error(`Built CSS contains missing or escaping asset references:\n${detail}`);
}

console.log(
    `Built asset references verified: ${references.length} local references across ${cssFiles.length} CSS files`
);
