import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Pill, Plus, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
//ssjjdjfjjfjjfffffffffddjdjjsjsjjajj
const MEDICINES = [
  { id: 1, name: 'Vitamin D3',         dose: '1000 IU', times: ['08:00'],          color: '#f59e0b', taken: [true],         notes: 'Take with breakfast' },
  { id: 2, name: 'Blood Pressure Med', dose: '5mg',     times: ['08:00','20:00'],   color: '#3b82f6', taken: [true, false],  notes: 'Do not skip' },
  { id: 3, name: 'Omega-3',            dose: '2 caps',  times: ['18:00'],           color: '#2da67d', taken: [false],        notes: 'Take with meal' },
  { id: 4, name: 'Metformin',          dose: '500mg',   times: ['07:00','13:00','19:00'], color: '#8b5cf6', taken: [true,false,false], notes: 'Take with food' },
  { id: 5, name: 'Vitamin C',          dose: '500mg',   times: ['09:00'],           color: '#ff6b6b', taken: [false],        notes: 'Boosts immunity' },
];

function MedCard({ med }) {
  const [taken, setTaken] = useState(med.taken);
  const allTaken = taken.every(Boolean);
  const anyTaken = taken.some(Boolean);

  const toggle = (i) => {
    setTaken(t => t.map((v, idx) => idx === i ? !v : v));
  };

  return (
    <div className="card fade-up" style={{ borderLeft: `4px solid ${med.color}` }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:44, height:44, borderRadius:12, background: med.color+'20', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Pill size={20} color={med.color} />
          </div>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16 }}>{med.name}</div>
            <div style={{ fontSize:12, color:'var(--slate-light)' }}>{med.dose} · {med.notes}</div>
          </div>
        </div>
        <div style={{
          padding:'4px 10px', borderRadius:99,
          background: allTaken ? 'var(--green-pale)' : anyTaken ? '#fff8e1' : '#fff1f0',
          color: allTaken ? 'var(--green-mid)' : anyTaken ? '#e65100' : 'var(--accent-coral)',
          fontSize:11, fontWeight:700, display:'flex', alignItems:'center', gap:4
        }}>
          {allTaken ? <CheckCircle2 size={12} /> : anyTaken ? <AlertCircle size={12} /> : <XCircle size={12} />}
          {allTaken ? 'Complete' : anyTaken ? 'Partial' : 'Pending'}
        </div>
      </div>

      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
        {med.times.map((time, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            style={{
              display:'flex', alignItems:'center', gap:6,
              padding:'8px 14px', borderRadius:99,
              border: `1.5px solid ${taken[i] ? med.color : 'var(--slate-pale)'}`,
              background: taken[i] ? med.color + '18' : 'white',
              cursor:'pointer', transition:'all 0.2s',
              fontSize:12, fontWeight:600,
              color: taken[i] ? med.color : 'var(--slate-light)',
            }}
          >
            <Clock size={13} />
            {time}
            {taken[i] && <CheckCircle2 size={13} />}
          </button>
        ))}
      </div>
    </div>
  );
}

function AddMedModal({ onClose }) {
  const { showToast } = useApp();
  const [form, setForm] = useState({ name:'', dose:'', times:'08:00', notes:'' });
  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  const submit = () => {
    if (!form.name) return;
    showToast('Medicine added!', 'success');
    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ position:'relative' }}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-title">Add Medicine</div>
        <div className="modal-sub">Set up your medication reminder</div>
        <div className="form-group">
          <label className="form-label">Medicine Name</label>
          <input className="form-input" placeholder="e.g. Aspirin" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div className="form-group">
            <label className="form-label">Dose</label>
            <input className="form-input" placeholder="e.g. 500mg" value={form.dose} onChange={e => set('dose', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Time</label>
            <input type="time" className="form-input" value={form.times} onChange={e => set('times', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Notes</label>
          <input className="form-input" placeholder="e.g. Take with food" value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <button className="btn btn-ghost" style={{ flex:1 }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex:1 }} onClick={submit}><Plus size={16} /> Add Medicine</button>
        </div>
      </div>
    </div>
  );
}

export default function MedicinesPage() {
  const [showModal, setShowModal] = useState(false);
  const total = MEDICINES.reduce((a,m) => a + m.times.length, 0);
  const taken = MEDICINES.reduce((a,m) => a + m.taken.filter(Boolean).length, 0);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {showModal && <AddMedModal onClose={() => setShowModal(false)} />}

      <div className="section-header fade-up">
        <div>
          <div className="section-title">Medicines 💊</div>
          <div className="section-sub">{taken} of {total} doses taken today</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Medicine
        </button>
      </div>

      {/* Summary */}
      <div className="grid-3 fade-up">
        <div className="card" style={{ textAlign:'center' }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:36, fontWeight:800, color:'var(--green-mid)' }}>{taken}</div>
          <div style={{ fontSize:12, color:'var(--slate-light)', fontWeight:600 }}>Doses Taken</div>
        </div>
        <div className="card" style={{ textAlign:'center' }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:36, fontWeight:800, color:'var(--accent-amber)' }}>{total - taken}</div>
          <div style={{ fontSize:12, color:'var(--slate-light)', fontWeight:600 }}>Pending</div>
        </div>
        <div className="card" style={{ textAlign:'center' }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:36, fontWeight:800, color:'var(--accent-blue)' }}>{MEDICINES.length}</div>
          <div style={{ fontSize:12, color:'var(--slate-light)', fontWeight:600 }}>Total Meds</div>
        </div>
      </div>

      {/* Adherence bar */}
      <div className="card fade-up">
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:13 }}>
          <span style={{ fontWeight:600 }}>Adherence Today</span>
          <span style={{ color:'var(--green-mid)', fontWeight:700 }}>{Math.round((taken/total)*100)}%</span>
        </div>
        <div style={{ height:10, background:'var(--slate-pale)', borderRadius:99, overflow:'hidden' }}>
          <div style={{
            height:'100%', width:`${(taken/total)*100}%`,
            background:'linear-gradient(90deg, #3b82f6, #2da67d)',
            borderRadius:99, transition:'width 0.5s ease'
          }} />
        </div>
        <div style={{ fontSize:11, color:'var(--slate-light)', marginTop:8 }}>
          Tap a time slot to mark a dose as taken or pending
        </div>
      </div>

      {/* Medicine list */}
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {MEDICINES.map(m => <MedCard key={m.id} med={m} />)}
      </div>
    </div>
  );
}
