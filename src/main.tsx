import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LocalStorageProvider } from './contexts/LocalStorageContext';
import { UserPreferencesProvider } from './contexts/UserPreferencesContext';
import { SearchProvider } from './contexts/SearchContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserPreferencesProvider>
      <LocalStorageProvider>
        <SearchProvider>
          <NotificationsProvider>
            <App />
          </NotificationsProvider>
        </SearchProvider>
      </LocalStorageProvider>
    </UserPreferencesProvider>
  </StrictMode>
);