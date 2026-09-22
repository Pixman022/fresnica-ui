import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { FresnicaThemeProvider } from '../src';

document.body.style.margin = '0';
document.getElementById('file-fallback')?.remove();

const globalStyle = document.createElement('style');
globalStyle.textContent = `
  html, body, #root { color: var(--Fresnica-text-color); }
  body { background: var(--Fresnica-bg-color); font-family: var(--Fresnica-font-family); }
  strong, code { color: inherit; }
  /* Keep horizontal overflow discoverable for API tables and data tables. */
  .demo-overflow-x::-webkit-scrollbar { display: block; height: 8px; }
  .demo-overflow-x::-webkit-scrollbar-thumb {
    background: var(--Fresnica-border-color);
    border-radius: var(--Fresnica-border-radius-pill);
  }
  .demo-overflow-x { scrollbar-width: thin; }
`;
document.head.appendChild(globalStyle);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <FresnicaThemeProvider>
            <App />
        </FresnicaThemeProvider>
    </React.StrictMode>
);
