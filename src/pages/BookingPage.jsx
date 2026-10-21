import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Sparkles, CalendarClock, FlaskConical, Video } from 'lucide-react';

const SPECIALTIES = [
  { id: 'general', label: 'General Hospital' },
  { id: 'dental', label: 'Dental' },
  { id: 'cardiology', label: 'Cardiology' },
  { id: 'dermatology', label: 'Dermatology' },
  { id: 'pediatrics', label: 'Pediatrics' },
];

const CONDITIONS = [
  { id: 'fever', label: 'Fever & Flu', specialty: 'general' },
  { id: 'diabetes', label: 'Diabetes check-up', specialty: 'general' },
  { id: 'toothPain', label: 'Tooth pain', specialty: 'dental' },
  { id: 'gumBleeding', label: 'Gum bleeding', specialty: 'dental' },
  { id: 'chestPain', label: 'Chest discomfort', specialty: 'cardiology' },
  { id: 'palpitations', label: 'Heart palpitations', specialty: 'cardiology' },
  { id: 'acne', label: 'Acne / skin rash', specialty: 'dermatology' },
  { id: 'allergy', label: 'Skin allergy', specialty: 'dermatology' },
  { id: 'childCold', label: 'Child cold & cough', specialty: 'pediatrics' },
  { id: 'childVaccination', label: 'Child vaccination planning', specialty: 'pediatrics' },
];

const PROVIDERS = [
  {
    id: 'cityCare',
    name: 'CityCare Multispeciality',
    specialties: ['general', 'cardiology', 'dermatology'],
    conditions: ['fever', 'diabetes', 'chestPain', 'palpitations', 'acne', 'allergy'],
    services: ['consultation', 'test'],
    tests: ['Blood test', 'ECG', 'Lipid profile', 'Skin allergy panel'],
    slots: ['09:00 AM', '11:30 AM', '02:00 PM', '05:00 PM'],
    rating: 4.8,
  },
  {
    id: 'smileHub',
    name: 'SmileHub Dental Center',
    specialties: ['dental'],
    conditions: ['toothPain', 'gumBleeding'],
    services: ['consultation', 'test'],
    tests: ['Dental X-ray', 'Root canal assessment'],
    slots: ['10:00 AM', '12:30 PM', '03:30 PM', '06:00 PM'],
    rating: 4.7,
  },
  {
    id: 'heartFirst',
    name: 'HeartFirst Cardiac Clinic',
    specialties: ['cardiology', 'general'],
    conditions: ['chestPain', 'palpitations', 'diabetes'],
    services: ['consultation', 'test'],
    tests: ['ECG', '2D Echo', 'Stress test'],
    slots: ['08:30 AM', '10:30 AM', '01:30 PM', '04:30 PM'],
    rating: 4.9,
  },
  {
    id: 'kidsNest',
    name: 'KidsNest Pediatrics',
    specialties: ['pediatrics', 'general'],
    conditions: ['childCold', 'childVaccination', 'fever'],
    services: ['consultation'],
    tests: [],
    slots: ['09:30 AM', '12:00 PM', '04:00 PM', '07:00 PM'],
    rating: 4.6,
  },
  {
    id: 'skinPure',
    name: 'SkinPure Clinic',
    specialties: ['dermatology'],
    conditions: ['acne', 'allergy'],
    services: ['consultation', 'test'],
    tests: ['Skin patch test', 'Fungal skin screening'],
    slots: ['10:30 AM', '01:00 PM', '03:00 PM', '05:30 PM'],
    rating: 4.5,
  },
];

const STEPS = ['Condition', 'Hospital Type', 'Recommendations', 'Service', 'Date & Time', 'Review'];

const TODAY = new Date().toISOString().split('T')[0];

function getCondition(conditionId) {
  return CONDITIONS.find((item) => item.id === conditionId);
}

function getSpecialty(specialtyId) {
  return SPECIALTIES.find((item) => item.id === specialtyId);
}

export default function BookingPage() {
  const { showToast } = useApp();
  const [step, setStep] = React.useState(0);
  const [conditionQuery, setConditionQuery] = React.useState('');
  const [conditionId, setConditionId] = React.useState('');
  const [specialtyId, setSpecialtyId] = React.useState('');
  const [providerId, setProviderId] = React.useState('');
  const [serviceType, setServiceType] = React.useState('');
  const [date, setDate] = React.useState(TODAY);
  const [timeSlot, setTimeSlot] = React.useState('');
  const [error, setError] = React.useState('');
  const [confirmed, setConfirmed] = React.useState(null);

  const condition = getCondition(conditionId);
  const specialty = getSpecialty(specialtyId);

  const filteredConditions = React.useMemo(() => {
    const q = conditionQuery.trim().toLowerCase();
    if (!q) return CONDITIONS;
    return CONDITIONS.filter((item) => item.label.toLowerCase().includes(q));
  }, [conditionQuery]);

  const rankedProviders = React.useMemo(() => {
    if (!conditionId || !specialtyId) return [];
    return PROVIDERS
      .map((provider) => {
        let score = 0;
        if (provider.specialties.includes(specialtyId)) score += 3;
        if (provider.conditions.includes(conditionId)) score += 4;
        score += provider.rating / 5;
        return { ...provider, score: Number(score.toFixed(2)) };
      })
      .filter((provider) => provider.score > 1)
      .sort((a, b) => b.score - a.score);
  }, [conditionId, specialtyId]);

  const bestMatch = rankedProviders[0] || null;
  const selectedProvider = rankedProviders.find((item) => item.id === providerId) || null;

  const availableServices = selectedProvider?.services || [];
  const availableSlots = selectedProvider?.slots || [];

  const bestMatchReason = bestMatch
    ? `Best match: ${bestMatch.name} is recommended because it specializes in ${specialty?.label} and frequently treats ${condition?.label}.`
    : '';

  const validateStep = () => {
    if (step === 0 && !conditionId) return 'Please select your condition.';
    if (step === 1 && !specialtyId) return 'Please choose a hospital type.';
    if (step === 2 && !providerId) return 'Please choose a provider or use Best match.';
    if (step === 3 && !serviceType) return 'Please choose consultation or test booking.';
    if (step === 4 && (!date || !timeSlot)) return 'Please select date and time.';
    return '';
  };

  const onConditionSelect = (selectedId) => {
    const picked = getCondition(selectedId);
    setConditionId(selectedId);
    setProviderId('');
    setServiceType('');
    setTimeSlot('');
    if (picked?.specialty && !specialtyId) setSpecialtyId(picked.specialty);
  };

  const onSelectProvider = (selectedId) => {
    setProviderId(selectedId);
    setServiceType('');
    setTimeSlot('');
  };

  const onUseBestMatch = () => {
    if (!bestMatch) return;
    onSelectProvider(bestMatch.id);
  };

  const next = () => {
    const message = validateStep();
    if (message) {
      setError(message);
      return;
    }
    setError('');
    setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const back = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const confirmBooking = () => {
    const provider = selectedProvider;
    if (!provider || !condition || !specialty || !serviceType || !date || !timeSlot) {
      setError('Please complete all required booking details.');
      return;
    }
    const confirmation = {
      id: `HC-${Date.now().toString().slice(-6)}`,
      condition: condition.label,
      specialty: specialty.label,
      provider: provider.name,
      serviceType,
      date,
      timeSlot,
      tests: provider.tests,
    };
    setConfirmed(confirmation);
    showToast('Booking confirmed successfully!', 'success');
  };

  const restart = () => {
    setStep(0);
    setConditionQuery('');
    setConditionId('');
    setSpecialtyId('');
    setProviderId('');
    setServiceType('');
    setDate(TODAY);
    setTimeSlot('');
    setError('');
    setConfirmed(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="section-header fade-up">
        <div>
          <div className="section-title">Online Healthcare Booking</div>
          <div className="section-sub">Select condition, get recommendations, and schedule online care.</div>
        </div>
      </div>

      {confirmed ? (
        <div className="card booking-confirmation">
          <div className="booking-confirmed-icon"><CheckCircle2 size={32} /></div>
          <h3>Booking Confirmed</h3>
          <p>Your appointment has been scheduled.</p>
          <div className="booking-summary">
            <div><strong>Booking ID:</strong> {confirmed.id}</div>
            <div><strong>Condition:</strong> {confirmed.condition}</div>
            <div><strong>Hospital Type:</strong> {confirmed.specialty}</div>
            <div><strong>Provider:</strong> {confirmed.provider}</div>
            <div><strong>Service:</strong> {confirmed.serviceType === 'consultation' ? 'Online Doctor Consultation' : 'Online Test Booking'}</div>
            <div><strong>Date & Time:</strong> {confirmed.date} at {confirmed.timeSlot}</div>
          </div>
          <button className="btn btn-primary" onClick={restart}>Book Another</button>
        </div>
      ) : (
        <>
          <div className="card booking-progress">
            {STEPS.map((name, index) => (
              <div key={name} className={`booking-step ${index <= step ? 'active' : ''}`}>
                <span>{index + 1}</span>
                <small>{name}</small>
              </div>
            ))}
          </div>

          <div className="card">
            {step === 0 && (
              <div className="booking-stage">
                <div className="card-title">Select your condition</div>
                <label className="form-label" htmlFor="condition-search">Search condition</label>
                <input
                  id="condition-search"
                  className="form-input"
                  placeholder="Search disease or condition"
                  value={conditionQuery}
                  onChange={(e) => setConditionQuery(e.target.value)}
                />
                <div className="booking-options-grid">
                  {filteredConditions.map((item) => (
                    <button
                      key={item.id}
                      className={`booking-option ${conditionId === item.id ? 'selected' : ''}`}
                      onClick={() => onConditionSelect(item.id)}
                      aria-pressed={conditionId === item.id}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                {filteredConditions.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-title">No conditions found</div>
                    <div className="empty-text">Try another search term.</div>
                  </div>
                )}
              </div>
            )}

            {step === 1 && (
              <div className="booking-stage">
                <div className="card-title">Choose hospital / specialty type</div>
                <div className="booking-options-grid">
                  {SPECIALTIES.map((item) => (
                    <button
                      key={item.id}
                      className={`booking-option ${specialtyId === item.id ? 'selected' : ''}`}
                      onClick={() => {
                        setSpecialtyId(item.id);
                        setProviderId('');
                        setServiceType('');
                        setTimeSlot('');
                      }}
                      aria-pressed={specialtyId === item.id}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="booking-stage">
                <div className="card-title">Recommended providers</div>
                <div className="card-sub" style={{ marginBottom: 12 }}>
                  Based on <strong>{condition?.label || 'your condition'}</strong> and <strong>{specialty?.label || 'hospital type'}</strong>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={onUseBestMatch} disabled={!bestMatch}>
                  <Sparkles size={14} /> I’m not sure which hospital
                </button>
                {bestMatch && (
                  <div className="booking-best-match">
                    <strong>Best match recommendation</strong>
                    <p>{bestMatchReason}</p>
                  </div>
                )}
                <div className="booking-provider-list">
                  {rankedProviders.map((provider) => (
                    <button
                      key={provider.id}
                      className={`booking-provider ${providerId === provider.id ? 'selected' : ''}`}
                      onClick={() => onSelectProvider(provider.id)}
                      aria-pressed={providerId === provider.id}
                    >
                      <div>
                        <div className="booking-provider-name">{provider.name}</div>
                        <div className="booking-provider-sub">Rating {provider.rating} • Match score {provider.score}</div>
                      </div>
                      {provider.id === bestMatch?.id && <span className="booking-badge">Best match</span>}
                    </button>
                  ))}
                </div>
                {!rankedProviders.length && (
                  <div className="empty-state">
                    <div className="empty-title">No matching providers</div>
                    <div className="empty-text">Go back and change condition or hospital type.</div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="booking-stage">
                <div className="card-title">Choose service type</div>
                <div className="booking-service-grid">
                  <button
                    className={`booking-service ${serviceType === 'consultation' ? 'selected' : ''}`}
                    onClick={() => setServiceType('consultation')}
                    disabled={!availableServices.includes('consultation')}
                    aria-pressed={serviceType === 'consultation'}
                  >
                    <Video size={18} />
                    <div>Online Doctor Consultation</div>
                  </button>
                  <button
                    className={`booking-service ${serviceType === 'test' ? 'selected' : ''}`}
                    onClick={() => setServiceType('test')}
                    disabled={!availableServices.includes('test')}
                    aria-pressed={serviceType === 'test'}
                  >
                    <FlaskConical size={18} />
                    <div>Online Test Booking</div>
                  </button>
                </div>
                {serviceType === 'test' && selectedProvider?.tests?.length > 0 && (
                  <div className="booking-best-match">
                    <strong>Available tests</strong>
                    <p>{selectedProvider.tests.join(', ')}</p>
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="booking-stage">
                <div className="card-title"><CalendarClock size={18} /> Select date and time</div>
                <div className="booking-date-row">
                  <label className="form-label" htmlFor="booking-date">Appointment date</label>
                  <input
                    id="booking-date"
                    className="form-input"
                    type="date"
                    min={TODAY}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="booking-slots">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      className={`booking-slot ${timeSlot === slot ? 'selected' : ''}`}
                      onClick={() => setTimeSlot(slot)}
                      aria-pressed={timeSlot === slot}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="booking-stage">
                <div className="card-title">Review & confirm</div>
                <div className="booking-summary">
                  <div><strong>Condition:</strong> {condition?.label}</div>
                  <div><strong>Hospital Type:</strong> {specialty?.label}</div>
                  <div><strong>Provider:</strong> {selectedProvider?.name}</div>
                  <div><strong>Service:</strong> {serviceType === 'consultation' ? 'Online Doctor Consultation' : 'Online Test Booking'}</div>
                  <div><strong>Date:</strong> {date}</div>
                  <div><strong>Time:</strong> {timeSlot}</div>
                </div>
                <button className="btn btn-primary" onClick={confirmBooking}>Confirm & Schedule</button>
              </div>
            )}

            {error && (
              <div className="booking-error" role="alert">
                {error}
              </div>
            )}

            <div className="booking-actions">
              <button className="btn btn-ghost" onClick={back} disabled={step === 0}>Back</button>
              {step < STEPS.length - 1 && (
                <button className="btn btn-primary" onClick={next}>Next</button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
