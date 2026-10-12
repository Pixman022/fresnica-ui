import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const run = (command, args) =>
    execFileSync(command, args, {
        cwd: root,
        encoding: 'utf8',
        env: process.env,
        stdio: ['ignore', 'pipe', 'inherit'],
    });

const packageJson = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const sourceSha = process.env.FRESNICA_SOURCE_SHA?.trim() || run('git', ['rev-parse', 'HEAD']).trim();

execFileSync(npm, ['run', 'build'], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
});

const packOutput = run(npm, ['pack', '--json', '--ignore-scripts']);
const packResult = JSON.parse(packOutput)?.[0];
if (!packResult?.filename) {
    throw new Error('npm pack did not return an archive filename');
}

const packedPaths = new Set((packResult.files ?? []).map((file) => file.path));
const requiredPaths = [
    'package.json',
    'README.md',
    'LICENSE',
    'THIRD_PARTY_NOTICES.md',
    'dist/index.css',
    'dist/es/index.js',
    'dist/cjs/index.cjs',
    'dist/types/index.d.ts',
    'dist/types/locales.d.ts',
    'dist/types/ui-context.d.ts',
];
const missingPaths = requiredPaths.filter((file) => !packedPaths.has(file));
if (missingPaths.length > 0) {
    throw new Error(`Packed artifact is missing required files: ${missingPaths.join(', ')}`);
}

const deliveryDir = path.join(root, 'delivery');
mkdirSync(deliveryDir, { recursive: true });

const sourceTarball = path.join(root, packResult.filename);
const targetTarball = path.join(deliveryDir, packResult.filename);
renameSync(sourceTarball, targetTarball);

const sha256 = createHash('sha256').update(readFileSync(targetTarball)).digest('hex');
const record = {
    package: packageJson.name,
    version: packageJson.version,
    sourceSha,
    tarball: packResult.filename,
    sha256,
    nodeBaseline: packageJson.engines?.node ?? null,
    reactPeer: packageJson.peerDependencies?.react ?? null,
    reactDomPeer: packageJson.peerDependencies?.['react-dom'] ?? null,
    verification: {
        build: 'passed',
        pack: 'passed',
        requiredPackageFiles: requiredPaths,
    },
    knownLimits: [
        'Package is not published to npm by this workflow.',
        'Native TalkBack/device acceptance, iOS support, and Native reduced-motion decisions are outside this Web delivery.',
        'Existing documented brand-color contrast limitations are unchanged.',
    ],
};

const recordName = `fresnica-ui-${packageJson.version}-delivery.json`;
const recordPath = path.join(deliveryDir, recordName);
writeFileSync(recordPath, JSON.stringify(record, null, 2) + '\n');

console.log(`Delivery tarball: delivery/${packResult.filename}`);
console.log(`Delivery record: delivery/${recordName}`);
console.log(`FRESNICA_DELIVERY_RECORD=${JSON.stringify(record)}`);
