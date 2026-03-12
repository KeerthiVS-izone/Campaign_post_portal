import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitDetails } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formStyles as s } from './styles';

const DISTRICTS = [
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli',
  'Erode', 'Vellore', 'Thoothukudi', 'Dindigul', 'Thanjavur', 'Tiruppur',
  'Kancheepuram', 'Cuddalore', 'Kanyakumari', 'Nagapattinam', 'Nilgiris',
  'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Sivaganga', 'Tiruvannamalai',
  'Tiruvarur', 'Villupuram', 'Virudhunagar', 'Ariyalur', 'Karur', 'Krishnagiri',
  'Namakkal', 'Theni', 'Dharmapuri', 'Kallakurichi', 'Ranipet', 'Tenkasi',
  'Tirupathur', 'Chengalpattu', 'Mayiladuthurai'
];

export default function SubmitDetails() {
  const [form, setForm] = useState({
    name: '', phone_number: '', district: '', constituency: '', responsibility: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setHasDetails } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^\d{10}$/.test(form.phone_number)) {
      return setError('Phone number must be 10 digits');
    }
    setLoading(true);
    try {
      await submitDetails(form);
      setHasDetails(true);
      navigate('/posts');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={{ ...s.card, maxWidth: '500px' }}>
        <h2 style={s.title}>Your Details</h2>
        <p style={s.subtitle}>Please fill in your information to continue</p>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {[
            { name: 'name', label: 'Full Name', placeholder: 'Enter your full name' },
            { name: 'phone_number', label: 'Phone Number', placeholder: '10-digit mobile number' },
            { name: 'constituency', label: 'Constituency', placeholder: 'Your constituency' },
            { name: 'responsibility', label: 'Responsibility', placeholder: 'Your role/position' },
          ].map(f => (
            <div style={s.field} key={f.name}>
              <label style={s.label}>{f.label}</label>
              <input style={s.input} name={f.name} value={(form as any)[f.name]}
                onChange={handleChange} placeholder={f.placeholder} required />
            </div>
          ))}
          <div style={s.field}>
            <label style={s.label}>District</label>
            <select style={s.input} name="district" value={form.district} onChange={handleChange} required>
              <option value="">Select District</option>
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <button style={s.button} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
