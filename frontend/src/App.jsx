import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import SourcesPage from './pages/SourcesPage';
import DatasetPage from './pages/DatasetPage';
import RelationshipsPage from './pages/RelationshipsPage';
import AIPage from './pages/AIPage';
import SettingsPage from './pages/SettingsPage';

import LandingPage from './pages/LandingPage';

const qc = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/sources" element={<SourcesPage />} />
            <Route path="/sources/:id" element={<DatasetPage />} />
            <Route path="/relationships" element={<RelationshipsPage />} />
            <Route path="/ai" element={<AIPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
