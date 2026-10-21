import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, ChevronLeft, ChevronRight, FlaskConical, Stethoscope } from 'lucide-react';

const STEPS = ['Condition', 'Hospital Type', 'Recommendation', 'Service', 'Date & Time', 'Review'];

const HOSPITAL_TYPES = [
  { id: 'general', label: 'General Hospital', hint: 'For broad diagnosis and multi-specialty care' },
  { id: 'dental', label: 'Dental Clinic', hint: 'Oral pain, gum issues, and dental procedures' },
  { id: 'cardiology', label: 'Cardiology Center', hint: 'Heart health, blood pressure, and chest symptoms' },
  { id: 'dermatology', label: 'Dermatology Clinic', hint: 'Skin, hair, and allergy related concerns' },
  { id: 'pediatrics', label: 'Pediatrics Hospital', hint: 'Child and adolescent healthcare' },
];

const CONDITIONS = [
  { id: 'fever', name: 'Fever & Viral Infection', specialty: 'general' },
  { id: 'diabetes', name: 'Diabetes Follow-up', specialty: 'general' },
  { id: 'toothache', name: 'Toothache / Cavity', specialty: 'dental' },
  { id: 'gum', name: 'Bleeding Gums', specialty: 'dental' },
  { id: 'chest', name: 'Chest Pain Assessment', specialty: 'cardiology' },
  { id: 'bp', name: 'High Blood Pressure', specialty: 'cardiology' },
  { id: 'acne', name: 'Acne / Skin Breakout', specialty: 'dermatology' },
  { id: 'rash', name: 'Skin Rash / Allergy', specialty: 'dermatology' },
  { id: 'child-fever', name: 'Child Fever & Cold', specialty: 'pediatrics' },
  { id: 'vaccination', name: 'Child Vaccination', specialty: 'pediatrics' },
];

const PROVIDERS = [
  {
    id: 'sunrise',
    name: 'Sunrise Multi-Specialty Hospital',
    type: 'general',
    specialties: ['general', 'cardiology', 'dermatology'],
    doctor: 'Dr. Neha Mehta',
    rating: 4.8,
    eta: '15 mins avg wait',
    services: ['consultation', 'test'],
    tests: ['CBC Blood Test', 'Blood Sugar Test', 'ECG', 'Lipid Profile'],
    slots: {
      consultation: ['09:00 AM', '11:30 AM', '04:00 PM', '06:30 PM'],
      test: ['08:30 AM', '10:00 AM', '02:00 PM'],
    },
  },
  {
    id: 'smilecare',
    name: 'SmileCare Dental Center',
    type: 'dental',
    specialties: ['dental'],
    doctor: 'Dr. Rohan Kapoor',
    rating: 4.7,
    eta: '20 mins avg wait',
    services: ['consultation', 'test'],
    tests: ['Dental X-Ray', 'Oral Screening'],
    slots: {
      consultation: ['10:00 AM', '12:00 PM', '03:30 PM', '05:30 PM'],
      test: ['10:30 AM', '01:00 PM', '04:30 PM'],
    },
  },
  {
    id: 'heartline',
    name: 'HeartLine Cardiac Institute',
    type: 'cardiology',
    specialties: ['cardiology'],
    doctor: 'Dr. Aarav Iyer',
    rating: 4.9,
    eta: '10 mins avg wait',
    services: ['consultation', 'test'],
    tests: ['ECG', 'Echo Test', 'Holter Monitoring'],
    slots: {
      consultation: ['09:30 AM', '01:30 PM', '05:00 PM'],
      test: ['08:00 AM', '11:00 AM', '03:00 PM'],
    },
  },
  {
    id: 'dermalife',
    name: 'DermaLife Skin Clinic',
    type: 'dermatology',
    specialties: ['dermatology'],
    doctor: 'Dr. Priya Sethi',
    rating: 4.6,
    eta: '18 mins avg wait',
    services: ['consultation'],
    tests: [],
    slots: {
      consultation: ['09:15 AM', '12:45 PM', '04:15 PM'],
      test: [],
    },
  },
  {
    id: 'littlecare',
    name: 'LittleCare Children Hospital',
    type: 'pediatrics',
    specialties: ['pediatrics', 'general'],
    doctor: 'Dr. Kavya Nair',
    rating: 4.8,
    eta: '12 mins avg wait',
    services: ['consultation', 'test'],
    tests: ['Pediatric CBC', 'Vaccination Slot'],
    slots: {
      consultation: ['09:45 AM', '12:15 PM', '03:45 PM', '06:00 PM'],
      test: ['09:00 AM', '11:00 AM', '02:30 PM'],
    },
  },
];

const toDateOptions = () => {
  const fmt = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });
  return Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const value = date.toISOString().split('T')[0];
    return { value, label: i === 0 ? `Today · ${fmt.format(date)}` : fmt.format(date) };
  });
};

export default function BookingPage() {
  const { showToast, setActivePage } = useApp();
  const [step, setStep] = useState(0);
  const [conditionSearch, setConditionSearch] = useState('');
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [selectedHospitalType, setSelectedHospitalType] = useState('');
  const [unsureHospital, setUnsureHospital] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedTest, setSelectedTest] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(false);

  const dateOptions = useMemo(() => toDateOptions(), []);

  const filteredConditions = useMemo(() => {
    const term = conditionSearch.trim().toLowerCase();
    if (!term) return CONDITIONS;
    return CONDITIONS.filter((item) => item.name.toLowerCase().includes(term));
  }, [conditionSearch]);

  const rankedProviders = useMemo(() => {
    if (!selectedCondition) return [];
    return PROVIDERS
      .map((provider) => {
        let score = 0;
        const reasons = [];

        if (provider.specialties.includes(selectedCondition.specialty)) {
          score += 70;
          reasons.push(`Specialized care for ${selectedCondition.name.toLowerCase()}`);
        }
        if (!unsureHospital && selectedHospitalType && provider.type === selectedHospitalType) {
          score += 25;
          reasons.push(`Matches selected hospital type (${HOSPITAL_TYPES.find((type) => type.id === selectedHospitalType)?.label})`);
        }
        if (unsureHospital) {
          score += 10;
          reasons.push('Optimized as best overall fit for your condition');
        }
        score += Math.round(provider.rating * 2);

        return { ...provider, score, reasons };
      })
      .sort((a, b) => (b.score - a.score) || a.name.localeCompare(b.name));
  }, [selectedCondition, selectedHospitalType, unsureHospital]);

  const selectedProvider = useMemo(
    () => rankedProviders.find((provider) => provider.id === selectedProviderId) || null,
    [rankedProviders, selectedProviderId]
  );

  const bestMatchProvider = rankedProviders[0] || null;

  const availableServices = selectedProvider?.services || [];
  const availableTimes = selectedProvider?.slots?.[selectedService] || [];

  const resetFlow = () => {
    setStep(0);
    setConditionSearch('');
    setSelectedCondition(null);
    setSelectedHospitalType('');
    setUnsureHospital(false);
    setSelectedProviderId('');
    setSelectedService('');
    setSelectedTest('');
    setSelectedDate('');
    setSelectedTime('');
    setErrorMessage('');
    setConfirmedBooking(false);
  };

  const nextStep = () => {
    if (step === 0 && !selectedCondition) {
      setErrorMessage('Please select your condition to continue.');
      return;
    }
    if (step === 1 && !unsureHospital && !selectedHospitalType) {
      setErrorMessage('Select a hospital type or choose the "I am not sure" option.');
      return;
    }
    if (step === 2 && !selectedProviderId) {
      setErrorMessage('Choose one recommended hospital/doctor option.');
      return;
    }
    if (step === 3 && !selectedService) {
      setErrorMessage('Please choose consultation or test booking.');
      return;
    }
    if (step === 3 && selectedService === 'test' && !selectedTest) {
      setErrorMessage('Please choose a test before continuing.');
      return;
    }
    if (step === 4 && (!selectedDate || !selectedTime)) {
      setErrorMessage('Pick an appointment date and time slot to continue.');
      return;
    }

    setErrorMessage('');
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const previousStep = () => {
    setErrorMessage('');
    setStep((current) => Math.max(current - 1, 0));
  };

  const onConfirmBooking = () => {
    setConfirmedBooking(true);
    showToast('Booking confirmed successfully!', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="section-header fade-up">
        <div>
          <div className="section-title">Online Healthcare Booking</div>
          <div className="section-sub">Choose condition, find best provider match, and schedule consultation or tests</div>
        </div>
      </div>

      {confirmedBooking ? (
        <div className="card fade-up booking-confirmation">
          <div className="booking-confirmation-icon"><CheckCircle2 size={36} color="var(--green-mid)" /></div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800 }}>Booking Confirmed 🎉</div>
          <div style={{ color: 'var(--slate-light)', maxWidth: 520 }}>
            {selectedService === 'consultation' ? 'Online consultation' : `${selectedTest} booking`} scheduled with <strong>{selectedProvider?.doctor}</strong> at <strong>{selectedProvider?.name}</strong> on <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong>.
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={resetFlow}>Book Another Appointment</button>
            <button className="btn btn-ghost" onClick={() => setActivePage('dashboard')}>Back to Dashboard</button>
          </div>
        </div>
      ) : (
        <div className="card fade-up">
          <div className="booking-steps" role="list" aria-label="Booking steps">
            {STEPS.map((label, index) => {
              const done = index < step;
              const active = index === step;
              return (
                <div key={label} className={`booking-step ${done ? 'done' : ''} ${active ? 'active' : ''}`} role="listitem">
                  <div className="booking-step-index">{done ? <CheckCircle2 size={16} /> : index + 1}</div>
                  <div className="booking-step-label">{label}</div>
                </div>
              );
            })}
          </div>

          {step === 0 && (
            <div className="booking-step-panel">
              <label htmlFor="condition-search" className="form-label">Search disease or condition</label>
              <input
                id="condition-search"
                className="form-input"
                placeholder="Type e.g. fever, chest pain, rash..."
                value={conditionSearch}
                onChange={(event) => setConditionSearch(event.target.value)}
              />
              <div className="booking-option-grid">
                {filteredConditions.map((condition) => (
                  <button
                    key={condition.id}
                    className={`booking-option ${selectedCondition?.id === condition.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedCondition(condition);
                      setSelectedProviderId('');
                      setSelectedService('');
                      setSelectedTest('');
                      setSelectedDate('');
                      setSelectedTime('');
                    }}
                  >
                    <strong>{condition.name}</strong>
                    <span>Suggested specialty: {HOSPITAL_TYPES.find((type) => type.id === condition.specialty)?.label}</span>
                  </button>
                ))}
              </div>
              {filteredConditions.length === 0 && (
                <div className="empty-state" style={{ padding: '24px 10px' }}>
                  <div className="empty-title">No condition matched</div>
                  <div className="empty-text">Try another keyword or select from the suggested conditions.</div>
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="booking-step-panel">
              <div className="card-sub">Select a hospital/specialty type, or use best-match recommendation if you are unsure.</div>
              <div className="booking-option-grid">
                {HOSPITAL_TYPES.map((type) => (
                  <button
                    key={type.id}
                    className={`booking-option ${selectedHospitalType === type.id && !unsureHospital ? 'selected' : ''}`}
                    onClick={() => {
                      setUnsureHospital(false);
                      setSelectedHospitalType(type.id);
                      setSelectedProviderId('');
                    }}
                  >
                    <strong>{type.label}</strong>
                    <span>{type.hint}</span>
                  </button>
                ))}
              </div>
              <button
                className={`booking-best-match-cta ${unsureHospital ? 'selected' : ''}`}
                onClick={() => {
                  setUnsureHospital((current) => !current);
                  setSelectedHospitalType('');
                  setSelectedProviderId('');
                }}
              >
                <strong>I am not sure which hospital to choose</strong>
                <span>Use the deterministic “Best match” recommendation based on your selected condition.</span>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="booking-step-panel">
              {rankedProviders.length ? (
                <>
                  <div className="card-sub">
                    Recommendations are ranked by specialty fit, hospital type match, and provider rating.
                  </div>
                  <div className="booking-provider-list">
                    {rankedProviders.map((provider) => {
                      const isBestMatch = provider.id === bestMatchProvider?.id;
                      const selected = selectedProviderId === provider.id;
                      return (
                        <button
                          key={provider.id}
                          className={`booking-provider-card ${selected ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedProviderId(provider.id);
                            setSelectedService('');
                            setSelectedTest('');
                            setSelectedDate('');
                            setSelectedTime('');
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 15 }}>{provider.name}</div>
                              <div style={{ fontSize: 12, color: 'var(--slate-light)' }}>Doctor: {provider.doctor}</div>
                            </div>
                            {isBestMatch && <span className="booking-best-match-tag">Best match</span>}
                          </div>
                          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 12, color: 'var(--slate-mid)' }}>
                            <span>⭐ {provider.rating.toFixed(1)}</span>
                            <span>{provider.eta}</span>
                            <span>{HOSPITAL_TYPES.find((type) => type.id === provider.type)?.label}</span>
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--green-deep)', lineHeight: 1.5 }}>
                            <strong>Why recommended:</strong> {provider.reasons.join(' · ')}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-title">No providers available</div>
                  <div className="empty-text">Go back and update your condition or hospital type.</div>
                </div>
              )}
            </div>
          )}

          {step === 3 && selectedProvider && (
            <div className="booking-step-panel">
              <div className="card-sub">Choose the service type for {selectedProvider.name}</div>
              <div className="booking-service-grid">
                <button
                  className={`booking-option ${selectedService === 'consultation' ? 'selected' : ''} ${!availableServices.includes('consultation') ? 'disabled' : ''}`}
                  disabled={!availableServices.includes('consultation')}
                  onClick={() => {
                    setSelectedService('consultation');
                    setSelectedTest('');
                    setSelectedTime('');
                  }}
                >
                  <strong><Stethoscope size={16} /> Online Consultation</strong>
                  <span>Video consultation with doctor and treatment guidance.</span>
                </button>
                <button
                  className={`booking-option ${selectedService === 'test' ? 'selected' : ''} ${!availableServices.includes('test') ? 'disabled' : ''}`}
                  disabled={!availableServices.includes('test')}
                  onClick={() => {
                    setSelectedService('test');
                    setSelectedTime('');
                  }}
                >
                  <strong><FlaskConical size={16} /> Online Test Booking</strong>
                  <span>Book tests online and visit during your selected slot.</span>
                </button>
              </div>

              {selectedService === 'test' && (
                <div className="form-group">
                  <label className="form-label">Select test</label>
                  <div className="booking-option-grid">
                    {selectedProvider.tests.map((testName) => (
                      <button
                        key={testName}
                        className={`booking-option ${selectedTest === testName ? 'selected' : ''}`}
                        onClick={() => setSelectedTest(testName)}
                      >
                        <strong>{testName}</strong>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 4 && selectedProvider && (
            <div className="booking-step-panel">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label htmlFor="booking-date" className="form-label">Select date</label>
                  <select
                    id="booking-date"
                    className="form-select"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                  >
                    <option value="">Choose date</option>
                    {dateOptions.map((dateOption) => (
                      <option key={dateOption.value} value={dateOption.value}>{dateOption.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Available time slots</label>
                  <div className="booking-time-grid">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        className={`booking-time-slot ${selectedTime === time ? 'selected' : ''}`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && selectedProvider && (
            <div className="booking-step-panel">
              <div className="card-sub">Review your booking details before confirming.</div>
              <div className="booking-review-list">
                <div><span>Condition</span><strong>{selectedCondition?.name}</strong></div>
                <div><span>Hospital Type</span><strong>{unsureHospital ? 'Best match recommendation' : HOSPITAL_TYPES.find((type) => type.id === selectedHospitalType)?.label}</strong></div>
                <div><span>Provider</span><strong>{selectedProvider.name}</strong></div>
                <div><span>Doctor</span><strong>{selectedProvider.doctor}</strong></div>
                <div><span>Service</span><strong>{selectedService === 'consultation' ? 'Online Consultation' : 'Online Test Booking'}</strong></div>
                {selectedService === 'test' && <div><span>Test</span><strong>{selectedTest}</strong></div>}
                <div><span>Appointment</span><strong>{selectedDate} · {selectedTime}</strong></div>
              </div>
              <button className="btn btn-primary btn-lg" onClick={onConfirmBooking}>
                Confirm & Schedule
              </button>
            </div>
          )}

          {errorMessage && (
            <div style={{ marginTop: 16, color: 'var(--accent-coral)', fontSize: 13, fontWeight: 600 }}>
              {errorMessage}
            </div>
          )}

          <div className="booking-nav">
            <button className="btn btn-ghost" onClick={previousStep} disabled={step === 0}>
              <ChevronLeft size={16} /> Back
            </button>
            {step < STEPS.length - 1 ? (
              <button className="btn btn-primary" onClick={nextStep}>
                Next <ChevronRight size={16} />
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
