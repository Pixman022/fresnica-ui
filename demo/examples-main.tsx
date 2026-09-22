import React from 'react';
import ReactDOM from 'react-dom/client';
import ExamplesApp from './ExamplesApp';
import { FresnicaThemeProvider, getStoredFresnicaThemeMode } from '../src';
import '../src/styles/index.less';
import './fonts.css';

document.body.style.margin = '0';
document.documentElement.dataset.theme = getStoredFresnicaThemeMode();
document.body.style.background = 'var(--Fresnica-bg-color)';
document.body.style.fontFamily = 'var(--Fresnica-font-family)';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <FresnicaThemeProvider>
            <ExamplesApp />
        </FresnicaThemeProvider>
    </React.StrictMode>
);
