import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
                    vite: '7.3.2',
                    rollup: '4.64.5',
                    '@vitejs/plugin-react': '5.2.0',
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
                include: ['src'],
            },
            null,
            2
        ) + '\n'
    );

    writeFileSync(
        path.join(consumerRoot, 'index.html'),
        '<!doctype html><html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n'
    );

    const sourceDir = path.join(consumerRoot, 'src');
    mkdirSync(sourceDir, { recursive: true });

    writeFileSync(
        path.join(sourceDir, 'main.tsx'),
        `import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    Button,
    FresnicaThemeProvider,
    FresnicaUiProvider,
    Input,
    Modal,
    useUiLocale,
} from 'fresnica-ui';
import { enUS, zhCN, type UiLocale } from 'fresnica-ui/locales';
import 'fresnica-ui/style';

const locale: UiLocale = { ...enUS, close: zhCN.close };

function LocaleProbe() {
    const copy = useUiLocale();
    return <span>{copy.close}</span>;
}

function App() {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
        inputRef.current?.focus();
        buttonRef.current?.focus();
    }, []);

    return (
        <FresnicaThemeProvider persist={false} syncTabs={false}>
            <FresnicaUiProvider locale={locale}>
                <Input ref={inputRef} allowClear defaultValue="React 18 consumer" />
                <Button ref={buttonRef}>Save</Button>
                <LocaleProbe />
                <Modal open={false} title="Compatibility check">
                    Body
                </Modal>
            </FresnicaUiProvider>
        </FresnicaThemeProvider>
    );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
`
    );

    writeFileSync(
        path.join(consumerRoot, 'vite.config.ts'),
        `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
});
`
    );

    run(npm, ['install', '--ignore-scripts', '--no-audit', '--no-fund'], consumerRoot);

    const tsc = path.join(consumerRoot, 'node_modules', 'typescript', 'bin', 'tsc');
    run(process.execPath, [tsc, '--project', path.join(consumerRoot, 'tsconfig.json')], consumerRoot);

    const vite = path.join(consumerRoot, 'node_modules', 'vite', 'bin', 'vite.js');
    run(process.execPath, [vite, 'build'], consumerRoot);

    if (!existsSync(path.join(consumerRoot, 'dist', 'index.html'))) {
        throw new Error('React 18.0.0 consumer production build did not emit dist/index.html');
    }

    const packageRoot = path.join(consumerRoot, 'node_modules', 'fresnica-ui');
    const stylePath = path.join(packageRoot, 'dist', 'index.css');
    if (!existsSync(stylePath)) {
        throw new Error('Packed consumer is missing dist/index.css');
    }

    const localeTypesPath = path.join(packageRoot, 'dist', 'types', 'locales.d.ts');
    const contextTypesPath = path.join(packageRoot, 'dist', 'types', 'ui-context.d.ts');
    if (!existsSync(localeTypesPath) || !existsSync(contextTypesPath)) {
        throw new Error('Packed consumer is missing public Locale/Provider declarations');
    }

    const packedPackage = JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
    if (!packedPackage.exports?.['./locales']) {
        throw new Error('Packed consumer is missing the fresnica-ui/locales export');
    }

    console.log('React 18.0.0 packed consumer typecheck and Vite build passed');
    console.log('Provider, Locale subpath, DOM refs, public declarations and style export are consumable');
} finally {
    rmSync(consumerRoot, { recursive: true, force: true });
    rmSync(tarball, { force: true });
}
