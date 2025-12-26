
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import DynamicPage from './pages/DynamicPage';
import Dashboard from './pages/admin/Dashboard';
import ArticleList from './pages/admin/ArticleList';
import ArticleEditor from './pages/admin/ArticleEditor';
import PageList from './pages/admin/PageList';
import PageEditor from './pages/admin/PageEditor';
import UsersPage from './pages/admin/Users';
import SettingsPage from './pages/admin/Settings';
import BannerAds from './pages/admin/BannerAds';
import ApiManagement from './pages/admin/ApiManagement';
import ViralGenerator from './pages/admin/ViralGenerator';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/berita/:slug" element={<ArticleDetail />} />
        <Route path="/kategori/:category" element={<Home />} /> 
        <Route path="/page/:slug" element={<DynamicPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/articles" element={<ArticleList />} />
        <Route path="/admin/articles/new" element={<ArticleEditor />} />
        <Route path="/admin/articles/edit/:id" element={<ArticleEditor />} />
        <Route path="/admin/pages" element={<PageList />} />
        <Route path="/admin/pages/new" element={<PageEditor />} />
        <Route path="/admin/pages/edit/:id" element={<PageEditor />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
        <Route path="/admin/banners" element={<BannerAds />} />
        <Route path="/admin/api-management" element={<ApiManagement />} />
        <Route path="/admin/viral-generator" element={<ViralGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;
