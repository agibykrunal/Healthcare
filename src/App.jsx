import React from 'react';
import './index.css';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import SchedulePage from './pages/SchedulePage';
import MedicinesPage from './pages/MedicinesPage';
import ActivityPage from './pages/ActivityPage';
import RecipesPage from './pages/RecipesPage';
import ChatbotPage from './pages/ChatbotPage';
import RegisterPage from './pages/RegisterPage';
import { CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

const PAGES = {
  dashboard: Dashboard,
  schedule:  SchedulePage,
  medicines: MedicinesPage,
  activity:  ActivityPage,
  recipes:   RecipesPage,
  chatbot:   ChatbotPage,
  register:  RegisterPage,
};

function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  const icons = { success: CheckCircle2, error: AlertCircle, warning: AlertTriangle };
  const Icon = icons[toast.type] || CheckCircle2;
  return (
    <div className={`toast ${toast.type}`}>
      <Icon size={18} />
      {toast.message}
    </div>
  );
}

function AppShell() {
  const { activePage } = useApp();
  const Page = PAGES[activePage] || Dashboard;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <Topbar />
        <main className="page-content">
          <Page />
        </main>
      </div>
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
