
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
import ExpenseReport from './pages/ExpenseReport';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);

  const { user, hasPermission } = useBudget(); // Get user from context

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case Page.DASHBOARD:
        return <Dashboard />;
      case Page.BUDGET:
        // Budget page might need generic 'view_budget' or just be open
        return hasPermission('view_budget') ? <Budget /> : <Dashboard />;
      case Page.CREATE_REQUEST:
        return <CreateRequest onNavigate={setCurrentPage} />;
      case Page.MANAGEMENT:
        return (hasPermission('manage_budget') || hasPermission('manage_departments'))
          ? <BudgetCategories />
          : <Dashboard />;
      case Page.ANALYTICS:
        return hasPermission('view_analytics') ? <Analytics /> : <Dashboard />;
      case Page.SETTINGS:
        return <Settings />;
      case Page.NOTIFICATIONS:
        return <Notifications onNavigate={setCurrentPage} />;
      case Page.EXPENSE_REPORT:
        return <ExpenseReport />;
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
