import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Plus, CheckCircle2, Circle, Footprints, Timer, Moon, Pill, Trash2, Calendar
} from 'lucide-react';

const TYPE_CONFIG = {
  walk: { label:'Walk', icon: Footprints, bg:'var(--green-pale)', color:'var(--green-mid)', dot:'#2da67d' },
  run:  { label:'Run',  icon: Timer,      bg:'#fff3e0', color:'#e65100', dot:'#ff8c00' },
  nap:  { label:'Nap',  icon: Moon,       bg:'#f3e5f5', color:'#6a1b9a', dot:'#8b5cf6' },
  med:  { label:'Med',  icon: Pill,       bg:'#e3f2fd', color:'#0d47a1', dot:'#3b82f6' },
};

function AddModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ type:'walk', name:'', time:'08:00', duration:'30', dose:'' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onAdd({
      type: form.type,
      name: form.name,
      time: form.time,
      duration: form.type !== 'med' ? Number(form.duration) : undefined,
      dose: form.type === 'med' ? form.dose : undefined,
    });
    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ position:'relative' }}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-title">Add Schedule Item</div>
        <div className="modal-sub">Plan your activity or medicine reminder</div>

        <div className="form-group">
          <label className="form-label">Type</label>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
              const Icon = cfg.icon;
              return (
                <button
                  key={key}
                  onClick={() => set('type', key)}
                  className="btn btn-ghost btn-sm"
                  style={form.type === key ? { background: cfg.bg, color: cfg.color, borderColor: cfg.color } : {}}
                >
                  <Icon size={14} /> {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            className="form-input"
            placeholder={form.type === 'med' ? 'e.g. Vitamin C' : 'e.g. Evening Walk'}
            value={form.name}
            onChange={e => set('name', e.target.value)}
          />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div className="form-group">
            <label className="form-label">Time</label>
            <input type="time" className="form-input" value={form.time} onChange={e => set('time', e.target.value)} />
          </div>
          {form.type !== 'med' ? (
            <div className="form-group">
              <label className="form-label">Duration (min)</label>
              <input type="number" className="form-input" value={form.duration} onChange={e => set('duration', e.target.value)} min={1} max={180} />
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Dose</label>
              <input className="form-input" placeholder="e.g. 1 tablet" value={form.dose} onChange={e => set('dose', e.target.value)} />
            </div>
          )}
        </div>

        <div style={{ display:'flex', gap:12, marginTop:8 }}>
          <button className="btn btn-ghost" style={{ flex:1 }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex:1 }} onClick={handleSubmit}>
            <Plus size={16} /> Add to Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SchedulePage() {
  const { schedules, toggleSchedule, addSchedule } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  const filters = ['all', 'walk', 'run', 'nap', 'med'];
  const filtered = filter === 'all' ? schedules : schedules.filter(s => s.type === filter);
  const sorted = [...filtered].sort((a, b) => a.time.localeCompare(b.time));

  const done = schedules.filter(s => s.done).length;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {showModal && <AddModal onClose={() => setShowModal(false)} onAdd={addSchedule} />}

      <div className="section-header fade-up">
        <div>
          <div className="section-title">Schedule <Calendar size={22} style={{ verticalAlign:'middle', marginLeft:6 }} /></div>
          <div className="section-sub">{done} of {schedules.length} completed today</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Item
        </button>
      </div>

      {/* Progress bar */}
      <div className="card fade-up">
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10, fontSize:13 }}>
          <span style={{ fontWeight:600 }}>Today's Progress</span>
          <span style={{ color:'var(--green-mid)', fontWeight:700 }}>{Math.round((done/schedules.length)*100)}%</span>
        </div>
        <div style={{ height:10, background:'var(--slate-pale)', borderRadius:99, overflow:'hidden' }}>
          <div style={{
            height:'100%', width:`${(done/schedules.length)*100}%`,
            background: 'linear-gradient(90deg, var(--green-soft), var(--green-light))',
            borderRadius:99, transition:'width 0.5s ease'
          }} />
        </div>
      </div>

      {/* Filter */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        {filters.map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(f)}
            style={{ textTransform:'capitalize' }}
          >
            {f === 'all' ? 'All' : TYPE_CONFIG[f]?.label}
          </button>
        ))}
      </div>

      {/* Items */}
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {sorted.map((s, i) => {
          const cfg = TYPE_CONFIG[s.type];
          const Icon = cfg.icon;
          return (
            <div
              key={s.id}
              className="card fade-up"
              style={{
                display:'flex', alignItems:'center', gap:16,
                animationDelay: `${i * 0.04}s`,
                opacity: s.done ? 0.65 : 1,
                cursor:'pointer',
                border: s.done ? '1.5px solid var(--green-pale)' : '1.5px solid transparent',
              }}
              onClick={() => toggleSchedule(s.id)}
            >
              <div style={{ width:44, height:44, borderRadius:12, background:cfg.bg, display:'flex', alignItems:'center', justifyContent:'center', color:cfg.color, flexShrink:0 }}>
                <Icon size={20} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:15, textDecoration: s.done ? 'line-through' : 'none', color:'var(--slate)' }}>
                  {s.name}
                </div>
                <div style={{ fontSize:12, color:'var(--slate-light)', marginTop:2 }}>
                  {s.time} · {s.duration ? `${s.duration} min` : s.dose}
                </div>
              </div>
              <span style={{ background:cfg.bg, color:cfg.color, fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99 }}>
                {cfg.label}
              </span>
              {s.done
                ? <CheckCircle2 size={22} color="var(--green-mid)" />
                : <Circle size={22} color="var(--slate-pale)" />
              }
            </div>
          );
        })}
      </div>

      {sorted.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon"><Calendar size={28} /></div>
          <div className="empty-title">No items found</div>
          <div className="empty-text">Add your first schedule item to get started!</div>
        </div>
      )}
    </div>
  );
}
