import React from 'react';
import { Home, Wallet, Settings, BarChart3, LayoutGrid, Bell, User, LogOut, FileText, Menu, ChevronLeft, CheckCircle, LayoutDashboard } from 'lucide-react';
import { Page } from '../../types';
import { useBudget } from '../../context/BudgetContext';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

import { BottomNav } from './BottomNav';

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const { settings, user, logout, hasPermission } = useBudget();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);

  // Mock Notifications
  const notifications = [
    { id: 1, title: 'อนุมัติงบประมาณ', message: 'คำขอ #REQ-2024-001 ได้รับการอนุมัติแล้ว', time: '5 นาทีที่แล้ว', unread: true, type: 'success', targetPage: Page.BUDGET },
    { id: 2, title: 'แจ้งเตือนงบประมาณ', message: 'หมวด "ค่าเดินทาง" ใกล้เต็มวงเงินแล้ว', time: '1 ชั่วโมงที่แล้ว', unread: true, type: 'warning', targetPage: Page.DASHBOARD },
    { id: 3, title: 'คำขอใหม่', message: 'มีคำขอเบิกจ่ายใหม่รอการตรวจสอบ', time: '2 ชั่วโมงที่แล้ว', unread: false, type: 'info', targetPage: Page.BUDGET },
  ];

  // Define navigation items with permission checks
  const navItems = [
    { id: Page.DASHBOARD, label: 'ภาพรวม', icon: LayoutDashboard }, // Dashboard is usually open to all, or check 'view_dashboard'
    ...(hasPermission('view_budget') ? [{ id: Page.BUDGET, label: 'งบประมาณ', icon: Wallet }] : []),
    { id: Page.CREATE_REQUEST, label: 'ขอใช้งบประมาณ', icon: FileText }, // Assuming all can create
    { id: Page.EXPENSE_REPORT, label: 'รายงานผล', icon: CheckCircle }, // Assuming all can report

    // Management: 'manage_settings' or specific 'manage_departments' etc.
    // For simplicity, let's use a specific permission for this menu
    ...(hasPermission('manage_budget') || hasPermission('manage_departments') ? [{ id: Page.MANAGEMENT, label: 'การจัดการ', icon: Settings }] : []),

    ...(hasPermission('view_analytics') ? [{ id: Page.ANALYTICS, label: 'วิเคราะห์', icon: BarChart3 }] : []),
    { id: Page.SETTINGS, label: 'ตั้งค่า', icon: LayoutGrid },
  ];

  const SidebarContent = ({ isCollapsed = false }: { isCollapsed?: boolean }) => (
    <>
      <div className="p-6">
        <div className={`flex items-center gap-3 mb-8 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className={`bg-gradient-to-br from-white/80 to-white/40 border border-white/60 text-primary-600 rounded-xl shadow-lg shadow-black/5 backdrop-blur-md ${isCollapsed ? 'p-2.5' : 'p-2'}`}>
            <Wallet className={isCollapsed ? 'w-6 h-6' : 'w-6 h-6'} />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">{settings.orgName}</h1>
              <p className="text-xs text-gray-500">Budget Manager</p>
            </div>
          )}
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
              }}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0 py-4' : 'px-4 py-3.5'} rounded-2xl transition-all duration-300 group relative overflow-hidden ${currentPage === item.id
                ? 'text-white shadow-lg shadow-primary-500/30 bg-gradient-primary'
                : 'text-gray-600 hover:bg-white/50 hover:shadow-sm hover:text-primary-600'
                }`}
            >
              {currentPage === item.id && (
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
              )}
              <item.icon className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} ${!isCollapsed ? 'mr-3' : ''} relative z-10 transition-transform group-hover:scale-110 ${currentPage === item.id ? 'text-white' : 'text-gray-400 group-hover:text-primary-500'}`} />
              {!isCollapsed && <span className="relative z-10 font-medium tracking-wide">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-100/50">
        <button
          onClick={logout}
          title={isCollapsed ? 'ออกจากระบบ' : undefined}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0 py-4' : 'px-4 py-3'} rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors`}
        >
          <LogOut className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} ${!isCollapsed ? 'mr-3' : ''}`} />
          {!isCollapsed && <span className="font-medium">ออกจากระบบ</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-50/50 overflow-hidden relative selection:bg-primary-200">
      {/* Global Background Decor (Glass Effect Base) */}
      <div className="fixed top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary-200/40 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-multiply animate-pulse-slow"></div>
      <div className="fixed bottom-[-20%] right-[-5%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-multiply"></div>
      <div className="fixed top-[20%] right-[10%] w-[400px] h-[400px] bg-teal-200/30 rounded-full blur-[90px] pointer-events-none z-0 mix-blend-multiply"></div>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col ${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-white/40 backdrop-blur-2xl border-r border-white/40 shadow-2xl shadow-gray-200/10 z-20 h-screen fixed top-0 left-0 transition-all duration-300`}>
        <SidebarContent isCollapsed={isSidebarCollapsed} />
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-8 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:shadow-lg hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all text-gray-500 z-30"
          title={isSidebarCollapsed ? 'ขยาย' : 'ย่อ'}
        >
          {isSidebarCollapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72'} transition-all duration-300 min-h-screen relative`}>

        {/* Mobile Header (Brand Only) */}
        <header className="md:hidden bg-white/60 backdrop-blur-xl sticky top-0 z-40 border-b border-white/40 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-primary text-white p-1.5 rounded-lg">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="font-bold text-gray-800">{settings.orgName}</span>
          </div>
          {/* Mobile Profile/Notif could go here if needed */}
        </header>

        {/* Top Bar (Desktop) */}
        <header className="hidden md:flex h-20 items-center justify-between px-8 py-4 z-40 sticky top-0">
          <div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
              {navItems.find(i => i.id === currentPage)?.label}
            </h2>
            <p className="text-sm text-gray-500">
              ยินดีต้อนรับ, {user?.name}
            </p>
          </div>

          <div className="flex items-center gap-4 relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`relative p-2.5 rounded-full shadow-soft hover:shadow-lg transition-all ${isNotificationsOpen ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-500 hover:text-primary-500'}`}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
            </button>

            {/* Notification Dropdown */}
            {isNotificationsOpen && (
              <>
                <div className="fixed inset-0 z-[90]" onClick={() => setIsNotificationsOpen(false)}></div>
                <div className="absolute top-full right-0 mt-1 w-64 sm:w-72 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 ring-1 ring-black/5 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-white/40 flex justify-between items-center bg-white/40 backdrop-blur-sm">
                    <h3 className="font-bold text-gray-800">การแจ้งเตือน</h3>
                    <button
                      onClick={() => {
                        onNavigate(Page.NOTIFICATIONS);
                        setIsNotificationsOpen(false);
                      }}
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                      อ่านทั้งหมด
                    </button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          onNavigate(notif.targetPage);
                          setIsNotificationsOpen(false);
                        }}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group relative ${notif.unread ? 'bg-primary-50/30' : ''}`}
                      >
                        {notif.unread && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        )}
                        <div className="flex gap-3">
                          <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${notif.unread ? 'bg-primary-500' : 'bg-gray-300'}`}></div>
                          <div>
                            <h4 className={`text-sm font-bold mb-0.5 ${notif.unread ? 'text-gray-900' : 'text-gray-600'}`}>{notif.title}</h4>
                            <p className="text-xs text-gray-500 mb-1.5 leading-relaxed">{notif.message}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                    <button
                      onClick={() => {
                        onNavigate(Page.NOTIFICATIONS);
                        setIsNotificationsOpen(false);
                      }}
                      className="text-xs font-medium text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      ดูประวัติทั้งหมด
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">{user?.name}</p>
                <p className="text-xs text-primary-500 font-medium">{user?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'พนักงาน'}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-primary text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-primary-500/20 ring-2 ring-white cursor-pointer hover:scale-105 transition-transform">
                {(() => {
                  const cleanAvatar = user?.avatar ? String(user.avatar).trim() : '';
                  const isImage = cleanAvatar.startsWith('http') || cleanAvatar.startsWith('data:');

                  if (isImage) {
                    return <img src={cleanAvatar} alt={user?.name} className="w-full h-full object-cover rounded-full" />;
                  }
                  return cleanAvatar && cleanAvatar.length <= 3 ? cleanAvatar : (user?.name?.substring(0, 2) || 'US');
                })()}
              </div>
            </div>
          </div>
        </header>

        {/* Content Scrollable Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>

        {/* Bottom Navigation for Mobile */}
        <BottomNav currentPage={currentPage} onNavigate={onNavigate} navItems={navItems} />

      </div>
    </div>
  );
};

export default Layout;