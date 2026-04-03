import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Menu, Footprints, Timer, Moon, Pill, Square, Bell } from 'lucide-react';

export default function Topbar() {
  const {
    setSidebarOpen, tracking, startTracking, stopTracking,
    steps, runTime, walkTime, napTime, formatTime,
    setActivePage,
  } = useApp();

  const [showTracker, setShowTracker] = useState(false);

  const pills = [
    {
      type: 'walk',
      label: 'Walk',
      icon: <Footprints size={14} />,
      value: steps.toLocaleString(),
      unit: 'steps',
      color: 'walk',
    },
    {
      type: 'run',
      label: 'Run',
      icon: <Timer size={14} />,
      value: formatTime(runTime),
      unit: '',
      color: 'run',
    },
    {
      type: 'nap',
      label: 'Nap',
      icon: <Moon size={14} />,
      value: formatTime(napTime),
      unit: '',
      color: 'nap',
    },
    {
      type: 'med',
      label: 'Med',
      icon: <Pill size={14} />,
      value: '2/6',
      unit: 'done',
      color: 'med',
      onClick: () => setActivePage('medicines'),
    },
  ];

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { weekday:'long', month:'short', day:'numeric' });
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="hamburger" onClick={() => setSidebarOpen(o => !o)}>
          <Menu size={20} />
        </button>
        <div>
          <div className="topbar-greeting">👋 {greeting}, Aryan!</div>
          <div className="topbar-date">{dateStr}</div>
        </div>
      </div>

      {/* Activity pills */}
      <div className="activity-bar">
        {pills.map(pill => {
          const isActive = tracking.type === pill.type;
          return (
            <button
              key={pill.type}
              className={`activity-pill ${pill.color} ${isActive ? 'active-tracking' : ''}`}
              onClick={pill.onClick || (() => {
                if (isActive) stopTracking();
                else if (pill.type !== 'med') startTracking(pill.type);
              })}
              title={isActive ? `Stop ${pill.label}` : `Start ${pill.label} tracking`}
            >
              {isActive ? <Square size={12} /> : pill.icon}
              <span className="activity-value">{pill.value}</span>
              <span>{pill.unit || pill.label}</span>
              {isActive && <span style={{ fontSize: 9, opacity: 0.7 }}>●</span>}
            </button>
          );
        })}
      </div>

      <div className="topbar-right">
        <button
          className="btn btn-ghost btn-sm"
          style={{ borderRadius: '50%', width: 36, height: 36, padding: 0, position: 'relative' }}
          title="Notifications"
        >
          <Bell size={18} />
          <span style={{
            position:'absolute', top: 6, right: 6,
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--accent-coral)',
            border: '2px solid white'
          }} />
        </button>
      </div>
    </header>
  );
}
