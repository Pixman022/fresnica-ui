import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const run = (command, args, cwd) => {
    execFileSync(command, args, {
        cwd,
        stdio: 'inherit',
        env: process.env,
    });
};

run(npm, ['run', 'build'], root);

const packOutput = execFileSync(npm, ['pack', '--json', '--ignore-scripts'], {
    cwd: root,
    encoding: 'utf8',
    env: process.env,
});
const packResult = JSON.parse(packOutput);
const filename = packResult?.[0]?.filename;
if (!filename) {
    throw new Error('npm pack did not return an archive filename');
}

const tarball = path.join(root, filename);
const consumerRoot = mkdtempSync(path.join(tmpdir(), 'fresnica-react18-consumer-'));

try {
    writeFileSync(
        path.join(consumerRoot, 'package.json'),
        JSON.stringify(
            {
                name: 'fresnica-react18-consumer',
                private: true,
                type: 'module',
                dependencies: {
                    'fresnica-ui': pathToFileURL(tarball).href,
                    react: '18.0.0',
                    'react-dom': '18.0.0',
                    classnames: '2.5.1',
                    'lucide-react': '1.40.0',
                },
                devDependencies: {
                    '@types/react': '18.0.38',
                    '@types/react-dom': '18.0.11',
                    typescript: '5.7.3',
                },
            },
            null,
            2
        ) + '\n'
    );

    writeFileSync(
        path.join(consumerRoot, 'tsconfig.json'),
        JSON.stringify(
            {
                compilerOptions: {
                    target: 'ES2022',
                    module: 'NodeNext',
                    moduleResolution: 'NodeNext',
                    jsx: 'react-jsx',
                    strict: true,
                    skipLibCheck: true,
                    noEmit: true,
                },
                include: ['consumer.tsx'],
            },
            null,
            2
        ) + '\n'
    );

    writeFileSync(
        path.join(consumerRoot, 'consumer.tsx'),
        `import React from 'react';
import { Button, Modal } from 'fresnica-ui';

export const basic = <Button>Save</Button>;
export const overlay = (
    <Modal open={false} title="Compatibility check">
        Body
    </Modal>
);

void React;
`
    );

    writeFileSync(
        path.join(consumerRoot, 'verify.mjs'),
        `import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button, Modal } from 'fresnica-ui';

const buttonHtml = renderToStaticMarkup(React.createElement(Button, null, 'Save'));
if (!buttonHtml.includes('Save')) {
    throw new Error('Packed Button did not render in the React 18.0.0 consumer');
}

const modalHtml = renderToStaticMarkup(
    React.createElement(Modal, { open: false, title: 'Compatibility check' }, 'Body')
);
if (modalHtml !== '') {
    throw new Error('Closed Modal should render no markup');
}

console.log('React 18.0.0 consumer render verification passed');
`
    );

    run(npm, ['install', '--ignore-scripts', '--no-audit', '--no-fund'], consumerRoot);

    const tsc = path.join(consumerRoot, 'node_modules', 'typescript', 'bin', 'tsc');
    run(process.execPath, [tsc, '--project', path.join(consumerRoot, 'tsconfig.json')], consumerRoot);
    run(process.execPath, [path.join(consumerRoot, 'verify.mjs')], consumerRoot);

    const stylePath = path.join(consumerRoot, 'node_modules', 'fresnica-ui', 'dist', 'index.css');
    if (!existsSync(stylePath)) {
        throw new Error('Packed consumer is missing dist/index.css');
    }

    console.log('Packed style export artifact exists');
} finally {
    rmSync(consumerRoot, { recursive: true, force: true });
    rmSync(tarball, { force: true });
}
