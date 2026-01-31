
import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Budget from './pages/Budget';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import BudgetCategories from './pages/BudgetCategories';
import { Page } from './types';
import { useBudget } from './context/BudgetContext'; // Changed import
import Login from './pages/Login';
import CreateRequest from './pages/CreateRequest';
import Notifications from './pages/Notifications';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);

  const { user } = useBudget(); // Get user from context

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case Page.DASHBOARD:
        return <Dashboard />;
      case Page.BUDGET:
        return <Budget />;
      case Page.CREATE_REQUEST:
        return <CreateRequest onNavigate={setCurrentPage} />;
      case Page.MANAGEMENT:
        return <BudgetCategories />;
      case Page.ANALYTICS:
        return <Analytics />;
      case Page.SETTINGS:
        return <Settings />;
      case Page.NOTIFICATIONS:
        return <Notifications onNavigate={setCurrentPage} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </Layout>
    </>
  );
};

export default App;
