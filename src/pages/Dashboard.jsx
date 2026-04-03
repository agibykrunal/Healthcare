import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Footprints, Flame, Droplets, Heart, TrendingUp, TrendingDown,
  Clock, Pill, CheckCircle2, Circle, Sun, Moon, Activity
} from 'lucide-react';

function StatCard({ icon: Icon, iconClass, value, label, change, changeDir, color }) {
  return (
    <div className={`stat-card ${color} fade-up`}>
      <div className={`stat-icon ${iconClass}`}><Icon size={20} /></div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {change && (
        <div className={`stat-change ${changeDir}`} style={{ display:'flex', alignItems:'center', gap:4, marginTop:10, fontSize:11, fontWeight:600 }}>
          {changeDir === 'up'
            ? <TrendingUp size={11} />
            : <TrendingDown size={11} />}
          <span>{change}</span>
        </div>
      )}
    </div>
  );
}

function MiniSchedule({ schedules }) {
  const today = schedules.slice(0, 5);
  const typeColors = { walk:'#2da67d', run:'#e65100', nap:'#8b5cf6', med:'#3b82f6' };
  const typeBadge = {
    walk: { bg:'var(--green-pale)', color:'var(--green-mid)', label:'Walk' },
    run:  { bg:'#fff3e0', color:'#e65100', label:'Run' },
    nap:  { bg:'#f3e5f5', color:'#6a1b9a', label:'Nap' },
    med:  { bg:'#e3f2fd', color:'#0d47a1', label:'Med' },
  };
  return (
    <div>
      {today.map(s => {
        const badge = typeBadge[s.type];
        return (
          <div key={s.id} className="schedule-item">
            <div className="schedule-dot" style={{ background: typeColors[s.type], opacity: s.done ? 0.4 : 1 }} />
            <div className="schedule-time">{s.time}</div>
            <div className="schedule-info">
              <div className="schedule-name" style={{ textDecoration: s.done ? 'line-through' : 'none', opacity: s.done ? 0.5 : 1 }}>
                {s.name}
              </div>
              <div className="schedule-detail">
                {s.duration ? `${s.duration} min` : s.dose}
              </div>
            </div>
            <span className="schedule-badge" style={{ background: badge.bg, color: badge.color }}>
              {badge.label}
            </span>
            {s.done
              ? <CheckCircle2 size={16} color="var(--green-mid)" />
              : <Circle size={16} color="var(--slate-light)" />
            }
          </div>
        );
      })}
    </div>
  );
}

function WaterTracker() {
  const [glasses, setGlasses] = React.useState(5);
  const goal = 8;
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:32, color:'#3b82f6' }}>{glasses}</span>
          <span style={{ color:'var(--slate-light)', marginLeft:6 }}>/ {goal} glasses</span>
        </div>
        <div style={{ display:'flex', gap:6 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setGlasses(g => Math.max(0,g-1))}>−</button>
          <button className="btn btn-primary btn-sm" onClick={() => setGlasses(g => Math.min(goal,g+1))}>+ Glass</button>
        </div>
      </div>
      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
        {Array.from({ length: goal }).map((_, i) => (
          <div
            key={i}
            onClick={() => setGlasses(i < glasses ? i : i + 1)}
            style={{
              width: 36, height: 48,
              borderRadius: 8,
              background: i < glasses ? '#3b82f6' : 'var(--slate-pale)',
              cursor:'pointer',
              transition:'all 0.2s',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize: 18,
              transform: i < glasses ? 'none' : 'scale(0.9)',
            }}
          >
            {i < glasses ? '💧' : '○'}
          </div>
        ))}
      </div>
      <div style={{ background:'#eff6ff', borderRadius:8, padding:'8px 12px', fontSize:12, color:'#1e40af' }}>
        💡 You're {Math.round((glasses/goal)*100)}% to your daily hydration goal!
      </div>
    </div>
  );
}

function HealthRing({ value, max, label, color }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const filled = (value / max) * circ;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
      <svg width={120} height={120} viewBox="0 0 120 120">
        <circle cx={60} cy={60} r={r} fill="none" stroke="var(--slate-pale)" strokeWidth={10} />
        <circle
          cx={60} cy={60} r={r} fill="none"
          stroke={color} strokeWidth={10}
          strokeDasharray={`${filled} ${circ - filled}`}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{ transition:'stroke-dasharray 0.6s ease' }}
        />
        <text x={60} y={56} textAnchor="middle" fontFamily="Syne" fontWeight="800" fontSize={18} fill="var(--slate)">{value}</text>
        <text x={60} y={70} textAnchor="middle" fontFamily="DM Sans" fontSize={10} fill="var(--slate-light)">/{max}</text>
      </svg>
      <div style={{ fontSize:12, fontWeight:600, color:'var(--slate-mid)' }}>{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const { schedules, steps, runTime, formatTime } = useApp();
  const doneMeds = schedules.filter(s => s.type === 'med' && s.done).length;
  const totalMeds = schedules.filter(s => s.type === 'med').length;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {/* Section header */}
      <div className="section-header fade-up">
        <div>
          <div className="section-title">Health Dashboard 🌿</div>
          <div className="section-sub">Today's overview — stay consistent, stay healthy</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <div style={{ background:'var(--green-pale)', borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:600, color:'var(--green-deep)' }}>
            <Sun size={12} style={{ marginRight:4, verticalAlign:'middle' }} />
            Day 12 Streak 🔥
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4">
        <StatCard icon={Footprints} iconClass="green" color="green" value={steps.toLocaleString()} label="Steps Today" change="+14% vs yesterday" changeDir="up" />
        <StatCard icon={Flame} iconClass="amber" color="amber" value="387" label="Calories Burned" change="+8% vs goal" changeDir="up" />
        <StatCard icon={Heart} iconClass="coral" color="coral" value="72" label="Heart Rate (bpm)" change="-3 vs morning" changeDir="down" />
        <StatCard icon={Activity} iconClass="blue" color="blue" value={formatTime(runTime) || '00:00'} label="Active Time" change="Goal: 30 min" changeDir="up" />
      </div>

      {/* Middle row */}
      <div className="grid-2">
        {/* Today's schedule */}
        <div className="card fade-up animate-delay-1">
          <div className="card-title"><Clock size={18} color="var(--green-mid)" /> Today's Schedule</div>
          <div className="card-sub">Tap items in Schedule tab to mark done</div>
          <MiniSchedule schedules={schedules} />
        </div>

        {/* Water + Rings */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div className="card fade-up animate-delay-2">
            <div className="card-title"><Droplets size={18} color="#3b82f6" /> Hydration</div>
            <div className="card-sub">Track your water intake</div>
            <WaterTracker />
          </div>
        </div>
      </div>

      {/* Goals rings */}
      <div className="card fade-up animate-delay-3">
        <div className="card-title" style={{ marginBottom:20 }}>📊 Daily Goals</div>
        <div style={{ display:'flex', justifyContent:'space-around', flexWrap:'wrap', gap:16 }}>
          <HealthRing value={steps > 10000 ? 10000 : steps} max={10000} label="Steps" color="var(--green-soft)" />
          <HealthRing value={doneMeds} max={totalMeds} label="Medicines" color="#3b82f6" />
          <HealthRing value={Math.min(Math.round(runTime/60), 30)} max={30} label="Active Min" color="#f59e0b" />
          <HealthRing value={7} max={8} label="Sleep (hrs)" color="#8b5cf6" />
        </div>
      </div>

      {/* Tips */}
      <div className="card fade-up animate-delay-4" style={{ background: 'linear-gradient(135deg, var(--green-deep), var(--green-mid))', color:'white' }}>
        <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
          <div style={{ fontSize:32 }}>💡</div>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, marginBottom:6 }}>
              Today's Health Tip
            </div>
            <div style={{ fontSize:13, opacity:0.85, lineHeight:1.7 }}>
              A 20-minute afternoon nap can improve alertness by up to 40%. Your nap is scheduled for 2 PM — make sure you don't skip it! Also, try to reach 10,000 steps today — you're already at {Math.round((steps/10000)*100)}% of your goal.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
