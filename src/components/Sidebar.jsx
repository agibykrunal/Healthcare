import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Calendar, Pill, BookOpen, MessageCircle,
  UserPlus, Heart, ChevronRight, Activity, UtensilsCrossed
} from 'lucide-react';

const NAV = [
  { section: 'Main', items: [
    { id: 'dashboard',  label: 'Dashboard',     icon: LayoutDashboard },
    { id: 'schedule',   label: 'Schedule',       icon: Calendar,  badge: '3' },
    { id: 'medicines',  label: 'Medicines',      icon: Pill },
    { id: 'activity',   label: 'Activity',       icon: Activity },
  ]},
  { section: 'Tools', items: [
    { id: 'recipes',    label: 'Recipe Vault',   icon: UtensilsCrossed },
    { id: 'chatbot',    label: 'AI Health Chat', icon: MessageCircle, badge: 'AI' },
    { id: 'register',   label: 'Patient Form',   icon: UserPlus },
  ]},
];

export default function Sidebar() {
  const { activePage, setActivePage, sidebarOpen, setSidebarOpen } = useApp();

  const handleNav = (id) => {
    setActivePage(id);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:99 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Heart size={20} color="white" fill="white" />
          </div>
          <div>
            <div className="logo-text">VitaCare</div>
            <div className="logo-sub">Health Companion</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV.map(group => (
            <div key={group.section}>
              <div className="nav-section-label">{group.section}</div>
              {group.items.map(item => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                    onClick={() => handleNav(item.id)}
                  >
                    <span className="nav-icon"><Icon size={18} /></span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                    {activePage === item.id && (
                      <ChevronRight size={14} style={{ opacity: 0.6 }} />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User card */}
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">A</div>
            <div className="user-info">
              <div className="user-name">Aryan Sharma</div>
              <div className="user-role">Premium Member</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
