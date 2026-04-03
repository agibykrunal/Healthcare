import React from 'react';
import { useApp } from '../context/AppContext';
import { Footprints, Timer, Moon, Play, Square, TrendingUp, Zap } from 'lucide-react';

function TrackerCard({ type, title, icon: Icon, value, unit, subValue, color, bgColor, isActive, onToggle }) {
  return (
    <div
      className="card"
      style={{
        borderTop: `4px solid ${color}`,
        display:'flex', flexDirection:'column', gap:16,
        position:'relative', overflow:'hidden'
      }}
    >
      {isActive && (
        <div style={{
          position:'absolute', top:12, right:12,
          width:10, height:10, borderRadius:'50%',
          background: color, animation:'blink 1s ease infinite'
        }} />
      )}
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:48, height:48, borderRadius:14, background:bgColor, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon size={24} color={color} />
        </div>
        <div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16 }}>{title}</div>
          {isActive && <div style={{ fontSize:11, color, fontWeight:700 }}>● TRACKING LIVE</div>}
        </div>
      </div>

      <div>
        <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:42, color, lineHeight:1 }}>
          {value}
        </div>
        <div style={{ fontSize:13, color:'var(--slate-light)', marginTop:4 }}>{unit}</div>
        {subValue && <div style={{ fontSize:11, color:'var(--slate-light)', marginTop:2 }}>{subValue}</div>}
      </div>

      <button
        className="btn"
        style={{
          background: isActive ? '#fff1f0' : bgColor,
          color: isActive ? 'var(--accent-coral)' : color,
          border: `1.5px solid ${isActive ? 'var(--accent-coral)' : color}`,
          width:'100%'
        }}
        onClick={onToggle}
      >
        {isActive ? <><Square size={16} /> Stop</> : <><Play size={16} /> Start</>}
      </button>
    </div>
  );
}

const WEEK_DATA = [
  { day:'Mon', steps:8200, run:18, walk:40 },
  { day:'Tue', steps:6800, run:0,  walk:55 },
  { day:'Wed', steps:11200,run:25, walk:60 },
  { day:'Thu', steps:9100, run:15, walk:35 },
  { day:'Fri', steps:7600, run:10, walk:50 },
  { day:'Sat', steps:12300,run:30, walk:70 },
  { day:'Sun', steps:5400, run:0,  walk:30 },
];

function WeekChart() {
  const maxSteps = Math.max(...WEEK_DATA.map(d => d.steps));
  const today = new Date().getDay();
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const todayLabel = days[today];

  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:120 }}>
      {WEEK_DATA.map((d, i) => {
        const h = (d.steps / maxSteps) * 100;
        const isToday = d.day === todayLabel;
        return (
          <div key={d.day} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
            <div style={{ fontSize:10, color:'var(--slate-light)', fontWeight:600 }}>
              {Math.round(d.steps/1000)}k
            </div>
            <div style={{
              width:'100%', height: `${h}%`,
              background: isToday
                ? 'linear-gradient(180deg, var(--green-light), var(--green-soft))'
                : 'var(--green-pale)',
              borderRadius: '6px 6px 0 0',
              transition:'height 0.6s ease',
              minHeight:4,
            }} />
            <div style={{
              fontSize:10, fontWeight: isToday ? 800 : 500,
              color: isToday ? 'var(--green-mid)' : 'var(--slate-light)'
            }}>{d.day}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function ActivityPage() {
  const { tracking, startTracking, stopTracking, steps, runTime, walkTime, napTime, formatTime } = useApp();

  const trackers = [
    {
      type:'walk', title:'Walking', icon: Footprints,
      value: steps.toLocaleString(), unit:'steps today',
      subValue: `≈ ${(steps * 0.000762).toFixed(2)} km`,
      color:'var(--green-mid)', bgColor:'var(--green-pale)',
    },
    {
      type:'run', title:'Running', icon: Timer,
      value: formatTime(runTime), unit:'active time',
      subValue: `≈ ${(runTime/60 * 0.15).toFixed(2)} km`,
      color:'#e65100', bgColor:'#fff3e0',
    },
    {
      type:'nap', title:'Nap Timer', icon: Moon,
      value: formatTime(napTime), unit:'rest time',
      subValue: napTime > 1200 ? '😴 Great nap!' : 'Ideal: 20 min',
      color:'#8b5cf6', bgColor:'#f3e5f5',
    },
  ];

  const weeklySteps = WEEK_DATA.reduce((a,d) => a + d.steps, 0);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div className="section-header fade-up">
        <div>
          <div className="section-title">Activity Tracker 🏃</div>
          <div className="section-sub">Track walking, running and rest in real-time</div>
        </div>
        {tracking.type && (
          <div style={{ background:'#fff1f0', color:'var(--accent-coral)', padding:'8px 14px', borderRadius:99, fontSize:13, fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--accent-coral)', display:'inline-block', animation:'blink 1s ease infinite' }} />
            {tracking.type.toUpperCase()} LIVE
          </div>
        )}
      </div>

      {/* Tracker cards */}
      <div className="grid-3">
        {trackers.map(t => (
          <TrackerCard
            key={t.type}
            {...t}
            isActive={tracking.type === t.type}
            onToggle={() => tracking.type === t.type ? stopTracking() : startTracking(t.type)}
          />
        ))}
      </div>

      {/* Week chart */}
      <div className="card fade-up">
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
          <div>
            <div className="card-title"><TrendingUp size={18} color="var(--green-mid)" /> Weekly Steps</div>
            <div className="card-sub">Your 7-day activity overview</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, color:'var(--green-mid)' }}>
              {weeklySteps.toLocaleString()}
            </div>
            <div style={{ fontSize:11, color:'var(--slate-light)' }}>total this week</div>
          </div>
        </div>
        <WeekChart />
      </div>

      {/* Calories & energy */}
      <div className="grid-2">
        <div className="card fade-up" style={{ background:'linear-gradient(135deg,#fff8e1,#fffbf0)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
            <Zap size={20} color="#f59e0b" />
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700 }}>Calories Burned</div>
          </div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:40, color:'#f59e0b' }}>387</div>
          <div style={{ fontSize:12, color:'var(--slate-light)', marginTop:4 }}>Goal: 500 kcal</div>
          <div style={{ marginTop:12, height:8, background:'#fff3cd', borderRadius:99, overflow:'hidden' }}>
            <div style={{ height:'100%', width:'77%', background:'#f59e0b', borderRadius:99 }} />
          </div>
        </div>
        <div className="card fade-up" style={{ background:'linear-gradient(135deg,#e3f2fd,#f0f8ff)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
            <Timer size={20} color="#3b82f6" />
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700 }}>Active Minutes</div>
          </div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:40, color:'#3b82f6' }}>
            {Math.round((walkTime + runTime) / 60)}
          </div>
          <div style={{ fontSize:12, color:'var(--slate-light)', marginTop:4 }}>Goal: 30 min</div>
          <div style={{ marginTop:12, height:8, background:'#dbeafe', borderRadius:99, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${Math.min(100, Math.round((walkTime+runTime)/60/30*100))}%`, background:'#3b82f6', borderRadius:99 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
