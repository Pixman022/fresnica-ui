import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const roots = ['src', 'demo'];
const sourceExtensions = new Set(['.less', '.css', '.html', '.ts', '.tsx']);
const styleExtensions = new Set(['.less', '.css', '.html']);
const excludedStyleFiles = new Set([
    path.normalize('src/styles/variables.less'),
    path.normalize('src/styles/themes/default.less'),
    path.normalize('src/styles/fonts.less'),
]);

function walk(directory) {
    const entries = fs.readdirSync(path.join(root, directory), { withFileTypes: true });
    return entries.flatMap((entry) => {
        const relative = path.join(directory, entry.name);
        if (entry.isDirectory()) return walk(relative);
        return sourceExtensions.has(path.extname(entry.name)) ? [relative] : [];
    });
}

const files = [...roots.flatMap(walk), 'index.html'];
const contents = new Map(files.map((file) => [file, fs.readFileSync(path.join(root, file), 'utf8')]));
const theme = fs.readFileSync(path.join(root, 'src/styles/themes/default.less'), 'utf8');
const layeredTokensPath = path.join(root, 'design-system/tokens.css');
const layeredTokens = fs.existsSync(layeredTokensPath) ? fs.readFileSync(layeredTokensPath, 'utf8') : '';
const definedTokens = [
    ...new Set(
        [theme, layeredTokens].flatMap((content) =>
            [...content.matchAll(/--Fresnica-[a-z0-9-]+(?=\s*:)/g)].map((match) => match[0])
        )
    ),
].sort();
const referencedTokens = new Set();
for (const content of contents.values()) {
    for (const match of content.matchAll(/var\((--Fresnica-[a-z0-9-]+)/g)) referencedTokens.add(match[1]);
}

const undeclared = [...referencedTokens].filter((token) => !definedTokens.includes(token)).sort();
const unused = definedTokens.filter((token) => !referencedTokens.has(token));
const explicitlyReservedUnused = unused.filter(
    (token) => /-(hover|active)$/.test(token) || token === '--Fresnica-surface-lowest'
);
const reviewedUnused = unused.filter((token) => !explicitlyReservedUnused.includes(token));
const compatibilityUnused = reviewedUnused.filter(
    (token) => !/--Fresnica-(?:primitive|semantic|component)-/.test(token)
);
const primitiveBridgeUnused = reviewedUnused.filter((token) => token.startsWith('--Fresnica-primitive-'));
const semanticReservedUnused = reviewedUnused.filter((token) => token.startsWith('--Fresnica-semantic-'));
const componentReservedUnused = reviewedUnused.filter((token) => token.startsWith('--Fresnica-component-'));
const unclassifiedUnused = reviewedUnused.filter(
    (token) =>
        !compatibilityUnused.includes(token) &&
        !primitiveBridgeUnused.includes(token) &&
        !semanticReservedUnused.includes(token) &&
        !componentReservedUnused.includes(token)
);
const styleFindings = [];
const rawTypographyFindings = [];
const rawMetricFindings = [];
const legacyFindings = [];
for (const [file, content] of contents) {
    const normalized = path.normalize(file);
    if (/(animal-island|--animal-|动物|植物|云朵|飘带)/i.test(content)) legacyFindings.push(file);
    if (!styleExtensions.has(path.extname(file)) || excludedStyleFiles.has(normalized)) continue;
    if (/(^|[;{\s])#[0-9a-f]{3,8}\b|rgba?\(/i.test(content)) styleFindings.push(`${file}: raw color`);
    const shadowDeclarations = [...content.matchAll(/box-shadow\s*:\s*([^;]+);/gi)];
    if (
        shadowDeclarations.some(
            (match) => !/var\(--Fresnica-(?:shadow|primitive-shadow|component-.*-shadow)/.test(match[1].trim())
        )
    ) {
        styleFindings.push(`${file}: raw shadow`);
    }

    const declarations = [...content.matchAll(/([a-z-]+)\s*:\s*([^;{}]+);/gi)];
    for (const [, property, value] of declarations) {
        const normalizedProperty = property.toLowerCase();
        const normalizedValue = value.trim();

        if (/^(font-family|font-size|font-weight|line-height|letter-spacing)$/.test(normalizedProperty)) {
            if (!/^(var\(|inherit$|initial$|unset$|normal$)/i.test(normalizedValue)) {
                rawTypographyFindings.push(`${file}: ${normalizedProperty}: ${normalizedValue}`);
            }
        }

        if (/^(margin|padding|gap|row-gap|column-gap|border-radius)(?:-[a-z]+)?$/.test(normalizedProperty)) {
            if (/\b\d+(?:\.\d+)?px\b/.test(normalizedValue) && !/var\(--Fresnica-/.test(normalizedValue)) {
                rawMetricFindings.push(`${file}: ${normalizedProperty}: ${normalizedValue}`);
            }
        }
    }
}

const coverage = ((definedTokens.length - unused.length) / definedTokens.length) * 100;
console.log(
    `Token coverage: ${definedTokens.length - unused.length}/${definedTokens.length} (${coverage.toFixed(1)}%)`
);
console.log(`Undeclared references: ${undeclared.length}`);
if (undeclared.length) console.log(undeclared.map((token) => `  - ${token}`).join('\n'));
console.log(`Unused public contracts: ${unused.length}`);
if (unused.length) console.log(unused.map((token) => `  - ${token}`).join('\n'));
console.log(`Explicitly reserved state contracts (reviewed): ${explicitlyReservedUnused.length}`);
if (explicitlyReservedUnused.length) console.log(explicitlyReservedUnused.map((token) => `  - ${token}`).join('\n'));
console.log(`Compatibility contracts retained (reviewed): ${compatibilityUnused.length}`);
if (compatibilityUnused.length) console.log(compatibilityUnused.map((token) => `  - ${token}`).join('\n'));
console.log(`Primitive bridge contracts retained (reviewed): ${primitiveBridgeUnused.length}`);
if (primitiveBridgeUnused.length) console.log(primitiveBridgeUnused.map((token) => `  - ${token}`).join('\n'));
console.log(`Semantic contracts reserved (reviewed): ${semanticReservedUnused.length}`);
if (semanticReservedUnused.length) console.log(semanticReservedUnused.map((token) => `  - ${token}`).join('\n'));
console.log(`Component contracts reserved (reviewed): ${componentReservedUnused.length}`);
if (componentReservedUnused.length) console.log(componentReservedUnused.map((token) => `  - ${token}`).join('\n'));
console.log(`Unclassified unused contracts (needs review): ${unclassifiedUnused.length}`);
if (unclassifiedUnused.length) console.log(unclassifiedUnused.map((token) => `  - ${token}`).join('\n'));
console.log(`Style findings: ${styleFindings.length}`);
if (styleFindings.length) console.log(styleFindings.map((finding) => `  - ${finding}`).join('\n'));
console.log(`Raw typography declarations (review): ${rawTypographyFindings.length}`);
if (rawTypographyFindings.length) {
    console.log(rawTypographyFindings.map((finding) => `  - ${finding}`).join('\n'));
}
console.log(`Raw spacing/radius declarations (review): ${rawMetricFindings.length}`);
if (rawMetricFindings.length) console.log(rawMetricFindings.map((finding) => `  - ${finding}`).join('\n'));
console.log(`Legacy theme findings: ${legacyFindings.length}`);
if (legacyFindings.length) console.log(legacyFindings.map((file) => `  - ${file}`).join('\n'));

if (undeclared.length || styleFindings.length || legacyFindings.length) process.exitCode = 1;
