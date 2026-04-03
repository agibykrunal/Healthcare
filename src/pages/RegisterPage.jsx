import React, { useState } from 'react';
import { UserPlus, CheckCircle2, ChevronRight, ChevronLeft, Heart, Shield, Bell } from 'lucide-react';

const STEPS = ['Personal Info', 'Health Details', 'Preferences', 'Review'];

const BLOOD_GROUPS = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
const CONDITIONS = ['Diabetes','Hypertension','Asthma','Heart Disease','Thyroid','Arthritis','None'];
const GOALS = ['Lose Weight','Build Muscle','Improve Stamina','Better Sleep','Stress Management','General Fitness'];

function StepIndicator({ current }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:0, marginBottom:32 }}>
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
            <div style={{
              width:36, height:36, borderRadius:'50%',
              background: i < current ? 'var(--green-soft)' : i === current ? 'var(--green-deep)' : 'var(--slate-pale)',
              color: i <= current ? 'white' : 'var(--slate-light)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'var(--font-display)', fontWeight:800, fontSize:14,
              transition:'all 0.3s',
              boxShadow: i === current ? '0 0 0 4px rgba(10,79,60,0.15)' : 'none',
            }}>
              {i < current ? <CheckCircle2 size={18} /> : i + 1}
            </div>
            <div style={{
              fontSize:10, fontWeight:600,
              color: i === current ? 'var(--green-deep)' : 'var(--slate-light)',
              whiteSpace:'nowrap'
            }}>{s}</div>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{
              height:2, flex:1, minWidth:20,
              background: i < current ? 'var(--green-soft)' : 'var(--slate-pale)',
              margin:'0 4px', marginBottom:20, transition:'background 0.3s'
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName:'', lastName:'', dob:'', gender:'', phone:'', email:'',
    height:'', weight:'', blood:'', conditions:[], allergies:'',
    goals:[], notifications: true, shareData: false, doctorName:'', doctorPhone:'',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleArr = (k, v) => setForm(f => ({
    ...f, [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v]
  }));

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  if (submitted) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:400, gap:20, textAlign:'center' }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:'var(--green-pale)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <CheckCircle2 size={40} color="var(--green-mid)" />
        </div>
        <div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:800, color:'var(--slate)' }}>
            Welcome, {form.firstName}! 🎉
          </div>
          <div style={{ fontSize:14, color:'var(--slate-light)', marginTop:8 }}>
            Your health profile has been created successfully.<br/>
            You're all set to start your wellness journey!
          </div>
        </div>
        <button className="btn btn-primary btn-lg" onClick={() => { setSubmitted(false); setStep(0); }}>
          <Heart size={18} /> Start My Journey
        </button>
      </div>
    );
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:0, maxWidth:680, margin:'0 auto' }}>
      <div className="section-header fade-up">
        <div>
          <div className="section-title">Patient Registration <UserPlus size={22} style={{ verticalAlign:'middle' }} /></div>
          <div className="section-sub">Create your health profile in a few easy steps</div>
        </div>
      </div>

      <div className="card fade-up" style={{ marginTop:8 }}>
        <StepIndicator current={step} />

        {/* Step 0: Personal Info */}
        {step === 0 && (
          <div style={{ animation:'fadeUp 0.3s ease' }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, marginBottom:20, color:'var(--slate)' }}>
              👤 Personal Information
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input className="form-input" placeholder="Aryan" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input className="form-input" placeholder="Sharma" value={form.lastName} onChange={e => set('lastName', e.target.value)} />
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input type="date" className="form-input" value={form.dob} onChange={e => set('dob', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-select" value={form.gender} onChange={e => set('gender', e.target.value)}>
                  <option value="">Select</option>
                  <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
                </select>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="you@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Health Details */}
        {step === 1 && (
          <div style={{ animation:'fadeUp 0.3s ease' }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, marginBottom:20, color:'var(--slate)' }}>
              🏥 Health Details
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }}>
              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input type="number" className="form-input" placeholder="170" value={form.height} onChange={e => set('height', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input type="number" className="form-input" placeholder="65" value={form.weight} onChange={e => set('weight', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select className="form-select" value={form.blood} onChange={e => set('blood', e.target.value)}>
                  <option value="">Select</option>
                  {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>

            {form.height && form.weight && (
              <div style={{ background:'var(--green-pale)', borderRadius:12, padding:'12px 16px', marginBottom:16, fontSize:13 }}>
                💚 BMI: <strong>{(form.weight / ((form.height/100)**2)).toFixed(1)}</strong>
                {' — '}{(form.weight / ((form.height/100)**2)) < 18.5 ? 'Underweight' : (form.weight / ((form.height/100)**2)) < 25 ? 'Normal weight ✅' : (form.weight / ((form.height/100)**2)) < 30 ? 'Overweight' : 'Obese'}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Existing Conditions</label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {CONDITIONS.map(c => (
                  <button
                    key={c}
                    onClick={() => toggleArr('conditions', c)}
                    className="btn btn-sm"
                    style={form.conditions.includes(c) ? { background:'var(--green-pale)', color:'var(--green-deep)', borderColor:'var(--green-soft)', border:'1.5px solid' } : { background:'white', border:'1.5px solid var(--slate-pale)', color:'var(--slate-mid)' }}
                  >{c}</button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Allergies</label>
              <input className="form-input" placeholder="e.g. Penicillin, Peanuts (leave blank if none)" value={form.allergies} onChange={e => set('allergies', e.target.value)} />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div className="form-group">
                <label className="form-label">Doctor's Name</label>
                <input className="form-input" placeholder="Dr. Mehta" value={form.doctorName} onChange={e => set('doctorName', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Doctor's Phone</label>
                <input className="form-input" placeholder="+91 ..." value={form.doctorPhone} onChange={e => set('doctorPhone', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Preferences */}
        {step === 2 && (
          <div style={{ animation:'fadeUp 0.3s ease' }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, marginBottom:20, color:'var(--slate)' }}>
              🎯 Health Goals & Preferences
            </div>

            <div className="form-group">
              <label className="form-label">Your Health Goals (select all that apply)</label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:4 }}>
                {GOALS.map(g => (
                  <button
                    key={g}
                    onClick={() => toggleArr('goals', g)}
                    className="btn btn-sm"
                    style={form.goals.includes(g) ? { background:'var(--green-pale)', color:'var(--green-deep)', border:'1.5px solid var(--green-soft)' } : { background:'white', border:'1.5px solid var(--slate-pale)', color:'var(--slate-mid)' }}
                  >{g}</button>
                ))}
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:16, marginTop:8 }}>
              {[
                { key:'notifications', icon:Bell, label:'Medication & Activity Reminders', sub:'Get notified when it\'s time for meds or activities' },
                { key:'shareData', icon:Shield, label:'Share Anonymous Data', sub:'Help improve health insights (optional)' },
              ].map(({ key, icon:Icon, label, sub }) => (
                <div key={key} style={{
                  display:'flex', alignItems:'center', gap:16, padding:'16px',
                  border:'1.5px solid var(--slate-pale)', borderRadius:12, cursor:'pointer',
                  background: form[key] ? 'var(--green-pale)' : 'white',
                  borderColor: form[key] ? 'var(--green-soft)' : 'var(--slate-pale)',
                  transition:'all 0.2s',
                }} onClick={() => set(key, !form[key])}>
                  <div style={{ width:40, height:40, borderRadius:10, background: form[key] ? 'var(--green-soft)' : 'var(--slate-pale)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon size={18} color={form[key] ? 'white' : 'var(--slate-light)'} />
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:14 }}>{label}</div>
                    <div style={{ fontSize:11, color:'var(--slate-light)' }}>{sub}</div>
                  </div>
                  <div style={{ width:24, height:24, borderRadius:99, background: form[key] ? 'var(--green-soft)' : 'var(--slate-pale)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {form[key] && <CheckCircle2 size={16} color="white" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div style={{ animation:'fadeUp 0.3s ease' }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, marginBottom:20, color:'var(--slate)' }}>
              ✅ Review Your Profile
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {[
                { label:'Name', value: `${form.firstName} ${form.lastName}` || 'Not set' },
                { label:'Date of Birth', value: form.dob || 'Not set' },
                { label:'Blood Group', value: form.blood || 'Not set' },
                { label:'Height / Weight', value: form.height && form.weight ? `${form.height}cm / ${form.weight}kg` : 'Not set' },
                { label:'Conditions', value: form.conditions.length ? form.conditions.join(', ') : 'None' },
                { label:'Goals', value: form.goals.length ? form.goals.join(', ') : 'Not set' },
                { label:'Doctor', value: form.doctorName || 'Not set' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--slate-pale)', fontSize:13 }}>
                  <span style={{ fontWeight:600, color:'var(--slate-light)' }}>{label}</span>
                  <span style={{ fontWeight:500, color:'var(--slate)', textAlign:'right', maxWidth:'60%' }}>{value}</span>
                </div>
              ))}
            </div>

            <div style={{ background:'var(--green-pale)', borderRadius:12, padding:'14px 16px', marginTop:20, fontSize:13, color:'var(--green-deep)' }}>
              <Shield size={14} style={{ verticalAlign:'middle', marginRight:6 }} />
              Your data is encrypted and stored securely. We never share personal info with third parties.
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:32, gap:12 }}>
          <button className="btn btn-ghost" onClick={prev} disabled={step === 0} style={{ flex:1 }}>
            <ChevronLeft size={16} /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button className="btn btn-primary" onClick={next} style={{ flex:1 }}>
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button className="btn btn-primary" style={{ flex:1 }} onClick={() => setSubmitted(true)}>
              <Heart size={16} /> Complete Registration
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
