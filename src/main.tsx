import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { GithubProvider } from './lib/githubContext';
import { I18nProvider } from './lib/i18n';
import { MotionProvider } from './lib/motion';
import { SettingsProvider } from './lib/settings';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <I18nProvider>
        <MotionProvider>
          <GithubProvider>
            <App />
          </GithubProvider>
        </MotionProvider>
      </I18nProvider>
    </SettingsProvider>
  </StrictMode>,
);
