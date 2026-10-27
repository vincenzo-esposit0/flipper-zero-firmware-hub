import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { GithubProvider } from './lib/githubContext';
import { SettingsProvider } from './lib/settings';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <GithubProvider>
        <App />
      </GithubProvider>
    </SettingsProvider>
  </StrictMode>,
);
