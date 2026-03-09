// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { submitCampaignData, CampaignFormData } from '../api';

// interface FormErrors {
//   name?: string;
//   phone_number?: string;
//   kalaga_maavatam?: string;
//   thogudhi?: string;
//   porupu?: string;
// }

// const KALAGA_MAAVATAM_OPTIONS = [
//   'சென்னை', 'கோயம்புத்தூர்', 'மதுரை', 'திருச்சிராப்பள்ளி', 'சேலம்',
//   'திருநெல்வேலி', 'திருப்பூர்', 'ஈரோடு', 'வேலூர்', 'தூத்துக்குடி',
//   'தஞ்சாவூர்', 'விருதுநகர்', 'கடலூர்', 'நாகப்பட்டினம்', 'புதுக்கோட்டை',
//   'டிண்டுக்கல்', 'நீலகிரி', 'கரூர்', 'பெரம்பலூர்', 'அரியலூர்',
//   'விழுப்புரம்', 'வில்லுபுரம்', 'கன்னியாகுமரி', 'ராமநாதபுரம்', 'சிவகங்கை',
//   'தர்மபுரி', 'கிருஷ்ணகிரி', 'நாமக்கல்', 'திண்டிவனம்', 'செங்கல்பட்டு',
//   'திருவள்ளூர்', 'காஞ்சிபுரம்', 'தேனி', 'திருவாரூர்', 'குடியாத்தம்',
//   'வண்ணாரப்பேட்டை', 'பொள்ளாச்சி'
// ];

// const PORUPU_OPTIONS = [
//   'மாவட்ட செயலர்',
//   'நகர செயலர்',
//   'தொகுதி செயலர்',
//   'கிளை செயலர்',
//   'அணி தலைவர்',
//   'தன்னார்வலர்',
//   'பொதுத் தொண்டர்',
// ];

// export default function FormPage() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState<CampaignFormData>({
//     name: '',
//     phone_number: '',
//     kalaga_maavatam: '',
//     thogudhi: '',
//     porupu: '',
//   });

//   const [errors, setErrors] = useState<FormErrors>({});
//   const [loading, setLoading] = useState(false);
//   const [serverError, setServerError] = useState('');

//   const validate = (): boolean => {
//     const newErrors: FormErrors = {};
//     if (!form.name.trim()) newErrors.name = 'பெயர் கட்டாயம் தேவை';
//     if (!form.phone_number.trim()) {
//       newErrors.phone_number = 'தொலைபேசி எண் கட்டாயம் தேவை';
//     } else if (!/^\d{10}$/.test(form.phone_number.replace(/\s/g, ''))) {
//       newErrors.phone_number = 'சரியான 10 இலக்க எண் உள்ளிடவும்';
//     }
//     if (!form.kalaga_maavatam) newErrors.kalaga_maavatam = 'மாவட்டம் தேர்ந்தெடுக்கவும்';
//     if (!form.thogudhi.trim()) newErrors.thogudhi = 'தொகுதி பெயர் தேவை';
//     if (!form.porupu) newErrors.porupu = 'பொறுப்பு தேர்ந்தெடுக்கவும்';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//     if (errors[name as keyof FormErrors]) {
//       setErrors(prev => ({ ...prev, [name]: undefined }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setServerError('');
//     if (!validate()) return;

//     setLoading(true);
//     try {
//       await submitCampaignData(form);
//       navigate('/posts', { state: { name: form.name } });
//     } catch (err: unknown) {
//       const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
//       setServerError(msg || 'சர்வர் பிழை. மீண்டும் முயற்சிக்கவும்.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       {/* Step indicator */}
//       <div className="step-indicator">
//         <div className="step active">
//           <div className="step-num">1</div>
//           <span>பதிவு படிவம்</span>
//         </div>
//         <div className="step-line" />
//         <div className="step inactive">
//           <div className="step-num">2</div>
//           <span>பிரச்சார இடுகைகள்</span>
//         </div>
//       </div>

//       {/* Info */}
//       <div className="info-box">
//         <span>ℹ️</span>
//         <span>உங்கள் தகவல்கள் பாதுகாப்பாக சேமிக்கப்படும். படிவம் நிரப்பிய பிறகு பிரச்சார இடுகைகளை Twitter/X-ல் பகிர்ந்து கொள்ளலாம்.</span>
//       </div>

//       <form className="form-card" onSubmit={handleSubmit} noValidate>
//         {serverError && (
//           <div className="alert alert-error">
//             <span className="alert-icon">⚠️</span>
//             <span>{serverError}</span>
//           </div>
//         )}

//         <div className="form-grid">
//           {/* Name */}
//           <div className="form-group">
//             <label className="form-label" htmlFor="name">
//               <span className="label-icon">👤</span>
//               பெயர் <span className="required">*</span>
//             </label>
//             <input
//               id="name"
//               name="name"
//               type="text"
//               className={`form-input ${errors.name ? 'error' : ''}`}
//               placeholder="உங்கள் முழு பெயர்"
//               value={form.name}
//               onChange={handleChange}
//               autoComplete="name"
//             />
//             {errors.name && <span className="error-text">⚠ {errors.name}</span>}
//           </div>

//           {/* Phone */}
//           <div className="form-group">
//             <label className="form-label" htmlFor="phone_number">
//               <span className="label-icon">📱</span>
//               தொலைபேசி எண் <span className="required">*</span>
//             </label>
//             <input
//               id="phone_number"
//               name="phone_number"
//               type="tel"
//               className={`form-input ${errors.phone_number ? 'error' : ''}`}
//               placeholder="10 இலக்க எண்"
//               value={form.phone_number}
//               onChange={handleChange}
//               maxLength={10}
//               autoComplete="tel"
//             />
//             {errors.phone_number && <span className="error-text">⚠ {errors.phone_number}</span>}
//           </div>

//           {/* Kalaga Maavatam */}
//           <div className="form-group">
//             <label className="form-label" htmlFor="kalaga_maavatam">
//               <span className="label-icon">🗺️</span>
//               கழக மாவட்டம் <span className="required">*</span>
//             </label>
//             <select
//               id="kalaga_maavatam"
//               name="kalaga_maavatam"
//               className={`form-input ${errors.kalaga_maavatam ? 'error' : ''}`}
//               value={form.kalaga_maavatam}
//               onChange={handleChange}
//             >
//               <option value="">-- மாவட்டம் தேர்ந்தெடுக்கவும் --</option>
//               {KALAGA_MAAVATAM_OPTIONS.map(opt => (
//                 <option key={opt} value={opt}>{opt}</option>
//               ))}
//             </select>
//             {errors.kalaga_maavatam && <span className="error-text">⚠ {errors.kalaga_maavatam}</span>}
//           </div>

//           {/* Thogudhi */}
//           <div className="form-group">
//             <label className="form-label" htmlFor="thogudhi">
//               <span className="label-icon">📍</span>
//               தொகுதி <span className="required">*</span>
//             </label>
//             <input
//               id="thogudhi"
//               name="thogudhi"
//               type="text"
//               className={`form-input ${errors.thogudhi ? 'error' : ''}`}
//               placeholder="உங்கள் சட்டமன்ற தொகுதி"
//               value={form.thogudhi}
//               onChange={handleChange}
//             />
//             {errors.thogudhi && <span className="error-text">⚠ {errors.thogudhi}</span>}
//           </div>

//           {/* Porupu */}
//           <div className="form-group full-width">
//             <label className="form-label" htmlFor="porupu">
//               <span className="label-icon">🎖️</span>
//               பொறுப்பு <span className="required">*</span>
//             </label>
//             <select
//               id="porupu"
//               name="porupu"
//               className={`form-input ${errors.porupu ? 'error' : ''}`}
//               value={form.porupu}
//               onChange={handleChange}
//             >
//               <option value="">-- பொறுப்பு தேர்ந்தெடுக்கவும் --</option>
//               {PORUPU_OPTIONS.map(opt => (
//                 <option key={opt} value={opt}>{opt}</option>
//               ))}
//             </select>
//             {errors.porupu && <span className="error-text">⚠ {errors.porupu}</span>}
//           </div>
//         </div>

//         <hr className="form-divider" />

//         <button
//           type="submit"
//           className={`btn-submit ${loading ? 'loading' : ''}`}
//           disabled={loading}
//         >
//           {loading ? (
//             <>
//               <div className="spinner" />
//               சமர்ப்பிக்கிறது...
//             </>
//           ) : (
//             <>
//               ✅ பதிவு செய்து தொடரவும்
//               <span>→</span>
//             </>
//           )}
//         </button>
//       </form>
//     </div>
//   );
// }



import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitCampaignData, CampaignFormData } from '../api';

interface FormErrors {
  name?: string;
  phone_number?: string;
  kalaga_maavatam?: string;
  thogudhi?: string;
  porupu?: string;
}

export default function FormPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<CampaignFormData>({
    name: '',
    phone_number: '',
    kalaga_maavatam: '',
    thogudhi: '',
    porupu: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) newErrors.name = 'பெயர் கட்டாயம் தேவை';

    if (!form.phone_number.trim()) {
      newErrors.phone_number = 'தொலைபேசி எண் கட்டாயம் தேவை';
    } else if (!/^\d{10}$/.test(form.phone_number.replace(/\s/g, ''))) {
      newErrors.phone_number = 'சரியான 10 இலக்க எண் உள்ளிடவும்';
    }

    if (!form.kalaga_maavatam.trim())
      newErrors.kalaga_maavatam = 'மாவட்டம் கட்டாயம் தேவை';

    if (!form.thogudhi.trim())
      newErrors.thogudhi = 'தொகுதி பெயர் தேவை';

    if (!form.porupu.trim())
      newErrors.porupu = 'பொறுப்பு தேவை';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    console.log("Input Changed:", name, value); // ADD HERE
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    console.log("Form Data Before Validation:", form); // ADD HERE

    if (!validate()) {
      console.log("Validation Failed:", errors); // ADD HERE
      return;
    }

    setLoading(true);

    try {
      console.log("Sending Data To API:", form); // ADD HERE
      await submitCampaignData(form);
      console.log("API Success"); // ADD HERE
      navigate('/posts', { state: { name: form.name } });
    } catch (err: unknown) {
      console.error("API ERROR:", err); // ADD HERE
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      console.log("Server Response:", msg); // ADD HERE
      setServerError(msg || 'சர்வர் பிழை. மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      {/* Step Indicator */}
      <div className="step-indicator">
        <div className="step active">
          <div className="step-num">1</div>
          <span>பதிவு படிவம்</span>
        </div>

        <div className="step-line" />

        <div className="step inactive">
          <div className="step-num">2</div>
          <span>பிரச்சார இடுகைகள்</span>
        </div>
      </div>

      Info Box
      {/* <div className="info-box">
        <span>ℹ️</span>
        <span>
          உங்கள் தகவல்கள் பாதுகாப்பாக சேமிக்கப்படும். படிவம் நிரப்பிய பிறகு
          பிரச்சார இடுகைகளை Twitter/X-ல் பகிர்ந்து கொள்ளலாம்.
        </span>
      </div> */}

      <form className="form-card" onSubmit={handleSubmit} noValidate>

        {serverError && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{serverError}</span>
          </div>
        )}

        <div className="form-grid">

          {/* Name */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">👤</span>
              பெயர் <span className="required">*</span>
            </label>

            <input
              name="name"
              type="text"
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="உங்கள் முழு பெயர்"
              value={form.name}
              onChange={handleChange}
            />

            {errors.name && (
              <span className="error-text">⚠ {errors.name}</span>
            )}
          </div>


          {/* Phone */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📱</span>
              தொலைபேசி எண் <span className="required">*</span>
            </label>

            <input
              name="phone_number"
              type="tel"
              maxLength={10}
              className={`form-input ${errors.phone_number ? 'error' : ''}`}
              placeholder="10 இலக்க எண்"
              value={form.phone_number}
              onChange={handleChange}
            />

            {errors.phone_number && (
              <span className="error-text">⚠ {errors.phone_number}</span>
            )}
          </div>


          {/* Kalaga Maavatam */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🗺️</span>
              கழக மாவட்டம் <span className="required">*</span>
            </label>

            <input
              name="kalaga_maavatam"
              type="text"
              className={`form-input ${errors.kalaga_maavatam ? 'error' : ''}`}
              placeholder="உங்கள் கழக மாவட்டம்"
              value={form.kalaga_maavatam}
              onChange={handleChange}
            />

            {errors.kalaga_maavatam && (
              <span className="error-text">⚠ {errors.kalaga_maavatam}</span>
            )}
          </div>


          {/* Thogudhi */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📍</span>
              தொகுதி <span className="required">*</span>
            </label>

            <input
              name="thogudhi"
              type="text"
              className={`form-input ${errors.thogudhi ? 'error' : ''}`}
              placeholder="உங்கள் சட்டமன்ற தொகுதி"
              value={form.thogudhi}
              onChange={handleChange}
            />

            {errors.thogudhi && (
              <span className="error-text">⚠ {errors.thogudhi}</span>
            )}
          </div>


          {/* Porupu */}
          <div className="form-group full-width">
            <label className="form-label">
              <span className="label-icon">🎖️</span>
              பொறுப்பு <span className="required">*</span>
            </label>

            <input
              name="porupu"
              type="text"
              className={`form-input ${errors.porupu ? 'error' : ''}`}
              placeholder="உங்கள் பொறுப்பு"
              value={form.porupu}
              onChange={handleChange}
            />

            {errors.porupu && (
              <span className="error-text">⚠ {errors.porupu}</span>
            )}
          </div>

        </div>

        <hr className="form-divider" />

        <button
          type="submit"
          className={`btn-submit ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner" />
              சமர்ப்பிக்கிறது...
            </>
          ) : (
            <>
              பதிவு செய்து தொடரவும்
              <span>→</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
}