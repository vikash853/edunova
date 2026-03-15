import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Camera, Loader2, Save, Eye, EyeOff, Check, X, Shield, User, Mail, Lock, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

/* ── tiny helpers ─────────────────────────────────── */
const Field = ({ label, icon: Icon, error, children, hint }) => (
  <div className="pf-field">
    <div className="pf-field-label">
      <Icon size={13} className="pf-field-icon" />
      <span>{label}</span>
      {hint && <span className="pf-field-hint">{hint}</span>}
    </div>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p className="pf-field-error" initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}}>
          <X size={11}/>{error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const StrengthBar = ({ password }) => {
  const score = !password ? 0
    : [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(password)).length;
  const labels = ['','Weak','Fair','Good','Strong'];
  const colors = ['','#ef4444','#f59e0b','#3b82f6','#22c55e'];
  if (!password) return null;
  return (
    <div className="pf-strength">
      <div className="pf-strength-bars">
        {[1,2,3,4].map(i => (
          <div key={i} className="pf-strength-bar" style={{background: i <= score ? colors[score] : 'rgba(255,255,255,0.08)', transition:'background .3s'}}/>
        ))}
      </div>
      <span style={{color: colors[score], fontSize: 11, fontWeight: 600}}>{labels[score]}</span>
    </div>
  );
};

/* ── avatar ring animation ────────────────────────── */
const AvatarRing = ({ preview, onChange, uploading }) => {
  const [hov, setHov] = useState(false);
  return (
    <div className="pf-avatar-wrap" onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      {/* spinning gradient ring */}
      <div className="pf-ring" style={{opacity: hov ? 1 : 0.5}}/>
      <div className="pf-ring pf-ring-2"/>

      <div className="pf-avatar">
        <img src={preview} alt="avatar" className="pf-avatar-img" style={{transform: hov ? 'scale(1.06)' : 'scale(1)'}}/>

        {/* overlay */}
        <label className="pf-avatar-overlay" style={{opacity: hov ? 1 : 0}}>
          {uploading
            ? <Loader2 size={24} className="pf-spin" style={{color:'#fff'}}/>
            : <><Camera size={20} style={{color:'#fff'}}/><span>Change</span></>
          }
          <input type="file" accept="image/*" onChange={onChange} className="pf-hidden"/>
        </label>
      </div>

      {/* sparkle badge */}
      <motion.div className="pf-avatar-badge" animate={{rotate:[0,10,-10,0]}} transition={{repeat:Infinity,duration:4,ease:'easeInOut'}}>
        <Sparkles size={11}/>
      </motion.div>
    </div>
  );
};

/* ── stats row ────────────────────────────────────── */
const StatPill = ({ value, label }) => (
  <div className="pf-stat">
    <span className="pf-stat-value">{value}</span>
    <span className="pf-stat-label">{label}</span>
  </div>
);

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
export default function Profile() {
  const { user, updateUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name:     user?.name  || '',
    email:    user?.email || '',
    password: '',
    bio:      user?.bio   || '',
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preview,      setPreview]      = useState(user?.photo || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400');
  const [loading,      setLoading]      = useState(false);
  const [imgLoading,   setImgLoading]   = useState(false);
  const [errors,       setErrors]       = useState({});
  const [showPass,     setShowPass]     = useState(false);
  const [saved,        setSaved]        = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name||'', email: user.email||'', password: '', bio: user.bio||'' });
      if (user.photo) setPreview(user.photo);
    }
  }, [user]);

  const handleInput = e => {
    const { name, value } = e.target;
    setFormData(p => ({...p, [name]: value}));
    if (errors[name]) setErrors(p => ({...p, [name]: ''}));
  };

  const handlePhoto = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2*1024*1024) { toast.error('Max 2 MB'); return; }
    if (!file.type.startsWith('image/')) { toast.error('Images only'); return; }
    setImgLoading(true);
    setProfilePhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => { setPreview(reader.result); setImgLoading(false); };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim())        e.name     = 'Name is required';
    if (!formData.email.includes('@')) e.email    = 'Enter a valid email';
    if (formData.password && formData.password.length < 6) e.password = 'Minimum 6 characters';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async ev => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name',  formData.name);
      data.append('email', formData.email);
      data.append('bio',   formData.bio);
      if (formData.password)  data.append('password', formData.password);
      if (profilePhoto)       data.append('photo',    profilePhoto);
      await updateUser(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      toast.success('Profile updated!');
      setProfilePhoto(null);
      setFormData(p => ({...p, password: ''}));
    } catch(err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="pf-page">
        {/* background mesh */}
        <div className="pf-bg">
          <div className="pf-blob pf-blob-1"/>
          <div className="pf-blob pf-blob-2"/>
          <div className="pf-blob pf-blob-3"/>
        </div>

        <motion.div className="pf-container"
          initial={{opacity:0,y:32}} animate={{opacity:1,y:0}} transition={{duration:.6,ease:[.22,1,.36,1]}}>

          {/* ── LEFT PANEL ─────────────────────────────── */}
          <div className="pf-left">
            <AvatarRing preview={preview} onChange={handlePhoto} uploading={imgLoading}/>

            <motion.div className="pf-identity" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.3}}>
              <h2 className="pf-name">{formData.name || 'Your Name'}</h2>
              <p className="pf-email">{formData.email || 'your@email.com'}</p>
              {formData.bio && <p className="pf-bio">"{formData.bio}"</p>}
            </motion.div>

            {/* Stats */}
            <div className="pf-stats">
              <StatPill value={user?.coursesCompleted ?? 0} label="Completed"/>
              <div className="pf-stats-divider"/>
              <StatPill value={user?.coursesEnrolled  ?? 0} label="Enrolled"/>
              <div className="pf-stats-divider"/>
              <StatPill value={user?.certificates     ?? 0} label="Certs"/>
            </div>

            {/* Member since */}
            <div className="pf-member-badge">
              <Shield size={12}/>
              <span>Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}</span>
            </div>
          </div>

          {/* ── RIGHT PANEL ────────────────────────────── */}
          <motion.form className="pf-form" onSubmit={handleSubmit}
            initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:.15,duration:.55,ease:[.22,1,.36,1]}}>

            <div className="pf-form-header">
              <h3 className="pf-form-title">Edit Profile</h3>
              <p className="pf-form-sub">Update your personal information</p>
            </div>

            <div className="pf-fields">
              {/* Name */}
              <Field label="Full Name" icon={User} error={errors.name}>
                <input name="name" value={formData.name} onChange={handleInput} placeholder="Jane Doe" className={`pf-input ${errors.name?'pf-input-err':''}`}/>
              </Field>

              {/* Email */}
              <Field label="Email Address" icon={Mail} error={errors.email}>
                <input name="email" type="email" value={formData.email} onChange={handleInput} placeholder="jane@example.com" className={`pf-input ${errors.email?'pf-input-err':''}`}/>
              </Field>

              {/* Bio */}
              <Field label="Bio" icon={Sparkles} hint="optional">
                <textarea name="bio" value={formData.bio} onChange={handleInput} placeholder="Tell the world a little about yourself…" rows={3} className="pf-input pf-textarea"/>
              </Field>

              {/* Password */}
              <Field label="New Password" icon={Lock} error={errors.password} hint="leave blank to keep current">
                <div className="pf-pass-wrap">
                  <input name="password" type={showPass?'text':'password'} value={formData.password} onChange={handleInput} placeholder="••••••••" className={`pf-input pf-input-pass ${errors.password?'pf-input-err':''}`}/>
                  <button type="button" className="pf-eye" onClick={()=>setShowPass(v=>!v)}>
                    {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
                <StrengthBar password={formData.password}/>
              </Field>
            </div>

            {/* Submit */}
            <motion.button type="submit" className="pf-btn" disabled={loading}
              whileTap={{scale:.97}} whileHover={{scale:1.01}}>
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.span key="loading" className="pf-btn-inner" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                    <Loader2 size={17} className="pf-spin"/>Saving…
                  </motion.span>
                ) : saved ? (
                  <motion.span key="saved" className="pf-btn-inner" initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} exit={{opacity:0}}>
                    <Check size={17}/>Saved!
                  </motion.span>
                ) : (
                  <motion.span key="idle" className="pf-btn-inner" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                    <Save size={17}/>Save Changes
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════
   CSS
══════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

.pf-page {
  min-height: 100vh;
  background: #080612;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px 40px;
  position: relative;
  overflow: hidden;
  font-family: 'DM Sans', sans-serif;
}

/* ── background ── */
.pf-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.pf-blob {
  position: absolute; border-radius: 50%;
  filter: blur(90px); opacity: .18;
  animation: blobDrift 18s ease-in-out infinite alternate;
}
.pf-blob-1 { width:520px;height:520px;top:-15%;left:-12%;background:#6366f1; animation-delay:0s; }
.pf-blob-2 { width:400px;height:400px;top:45%;right:-10%;background:#a855f7; animation-delay:-6s; }
.pf-blob-3 { width:340px;height:340px;bottom:-10%;left:38%;background:#3b82f6; animation-delay:-12s; }
@keyframes blobDrift { to { transform: translate(5%,8%) scale(1.08); } }

/* ── layout ── */
.pf-container {
  position: relative; z-index: 1;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  width: 100%; max-width: 860px;
  align-items: start;
}

/* ── LEFT ── */
.pf-left {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 28px;
  padding: 36px 28px;
  display: flex; flex-direction: column; align-items: center; gap: 20px;
  backdrop-filter: blur(20px);
  position: sticky; top: 88px;
}

/* ── avatar ── */
.pf-avatar-wrap {
  position: relative; width: 130px; height: 130px;
  display: flex; align-items: center; justify-content: center;
}
.pf-ring {
  position: absolute; inset: -6px; border-radius: 50%;
  background: conic-gradient(from 0deg, #6366f1, #a855f7, #ec4899, #6366f1);
  animation: spin 4s linear infinite;
  transition: opacity .4s;
}
.pf-ring-2 {
  inset: -4px; opacity: .4;
  background: conic-gradient(from 180deg, #3b82f6, #6366f1, #8b5cf6, #3b82f6);
  animation: spin 7s linear infinite reverse;
}
@keyframes spin { to { transform: rotate(360deg); } }

.pf-avatar {
  position: relative; width: 120px; height: 120px; border-radius: 50%;
  overflow: hidden; z-index: 2;
  box-shadow: 0 0 0 3px #080612;
}
.pf-avatar-img { width:100%;height:100%;object-fit:cover;transition:transform .4s; }
.pf-avatar-overlay {
  position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 5px; background: rgba(6,5,18,.72); border-radius: 50%;
  cursor: pointer; transition: opacity .3s;
  font-size: 11px; font-weight: 600; color: #fff; letter-spacing: .04em;
}
.pf-hidden { display: none; }
.pf-avatar-badge {
  position: absolute; bottom: 4px; right: 4px; z-index: 3;
  width: 26px; height: 26px; border-radius: 50%;
  background: linear-gradient(135deg,#6366f1,#a855f7);
  display: flex; align-items: center; justify-content: center;
  color: #fff; box-shadow: 0 2px 12px rgba(99,102,241,.5);
  border: 2px solid #080612;
}

/* ── identity ── */
.pf-name {
  font-family: 'Syne', sans-serif; font-weight: 800;
  font-size: clamp(18px,4vw,22px); color: #fff; text-align: center;
  background: linear-gradient(120deg,#fff 30%,#a78bfa);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.pf-email { font-size: 12px; color: rgba(255,255,255,.38); text-align: center; }
.pf-bio { font-size: 12px; color: rgba(255,255,255,.5); text-align: center; font-style: italic; line-height: 1.6; }

/* ── stats ── */
.pf-stats {
  display: flex; align-items: center; gap: 0;
  background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07);
  border-radius: 16px; width: 100%; overflow: hidden;
}
.pf-stat { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 14px 8px; }
.pf-stat-value { font-family: 'Syne',sans-serif; font-weight: 800; font-size: 20px; color: #fff; }
.pf-stat-label { font-size: 10px; color: rgba(255,255,255,.35); text-transform: uppercase; letter-spacing: .08em; margin-top: 2px; }
.pf-stats-divider { width: 1px; height: 36px; background: rgba(255,255,255,.08); }

.pf-member-badge {
  display: flex; align-items: center; gap: 6px;
  background: rgba(99,102,241,.12); border: 1px solid rgba(99,102,241,.25);
  border-radius: 100px; padding: 6px 14px;
  font-size: 11px; color: #a78bfa; font-weight: 600; letter-spacing: .04em;
}

/* ── FORM ── */
.pf-form {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 28px; padding: 36px 32px;
  backdrop-filter: blur(20px);
  display: flex; flex-direction: column; gap: 28px;
}
.pf-form-header { display: flex; flex-direction: column; gap: 4px; }
.pf-form-title { font-family: 'Syne',sans-serif; font-weight: 800; font-size: 22px; color: #fff; }
.pf-form-sub { font-size: 13px; color: rgba(255,255,255,.38); }

.pf-fields { display: flex; flex-direction: column; gap: 20px; }

/* ── field ── */
.pf-field { display: flex; flex-direction: column; gap: 7px; }
.pf-field-label {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 600; color: rgba(255,255,255,.55);
  text-transform: uppercase; letter-spacing: .07em;
}
.pf-field-icon { color: #6366f1; }
.pf-field-hint { margin-left: auto; font-size: 10px; color: rgba(255,255,255,.2); font-weight: 400; text-transform: none; letter-spacing: 0; }
.pf-field-error {
  display: flex; align-items: center; gap: 4px;
  font-size: 11px; color: #f87171; font-weight: 500;
}

/* ── inputs ── */
.pf-input {
  width: 100%; padding: 13px 16px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 14px;
  color: #fff; font-family: 'DM Sans',sans-serif; font-size: 14px;
  outline: none; transition: border-color .25s, box-shadow .25s, background .25s;
  resize: none;
}
.pf-input::placeholder { color: rgba(255,255,255,.2); }
.pf-input:focus {
  border-color: rgba(99,102,241,.6);
  box-shadow: 0 0 0 3px rgba(99,102,241,.15);
  background: rgba(255,255,255,.09);
}
.pf-input-err { border-color: rgba(248,113,113,.6) !important; }
.pf-textarea { min-height: 80px; }

.pf-pass-wrap { position: relative; }
.pf-input-pass { padding-right: 44px; }
.pf-eye {
  position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer;
  color: rgba(255,255,255,.3); transition: color .2s;
  display: flex; align-items: center;
}
.pf-eye:hover { color: rgba(255,255,255,.7); }

/* ── strength ── */
.pf-strength {
  display: flex; align-items: center; gap: 10px; margin-top: 8px;
}
.pf-strength-bars { display: flex; gap: 4px; flex: 1; }
.pf-strength-bar { flex: 1; height: 3px; border-radius: 99px; background: rgba(255,255,255,.08); }

/* ── button ── */
.pf-btn {
  width: 100%; padding: 15px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none; border-radius: 16px; cursor: pointer;
  font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: #fff;
  box-shadow: 0 8px 32px rgba(99,102,241,.4);
  transition: box-shadow .3s, opacity .2s;
}
.pf-btn:hover:not(:disabled) { box-shadow: 0 12px 44px rgba(99,102,241,.55); }
.pf-btn:disabled { opacity: .7; cursor: not-allowed; }
.pf-btn-inner { display: flex; align-items: center; justify-content: center; gap: 8px; }

/* ── util ── */
.pf-spin { animation: spin .8s linear infinite; }

/* ══════════════════════════════
   RESPONSIVE
══════════════════════════════ */
@media (max-width: 700px) {
  .pf-container {
    grid-template-columns: 1fr;
    max-width: 480px;
  }
  .pf-left { position: static; padding: 28px 20px; }
  .pf-form { padding: 28px 20px; gap: 22px; }
  .pf-avatar-wrap { width: 110px; height: 110px; }
  .pf-avatar { width: 100px; height: 100px; }
  .pf-ring { inset: -5px; }
  .pf-ring-2 { inset: -3px; }
}

@media (max-width: 400px) {
  .pf-page { padding: 70px 12px 32px; }
  .pf-form { padding: 22px 16px; border-radius: 20px; }
  .pf-left { border-radius: 20px; padding: 24px 16px; }
  .pf-btn { font-size: 14px; }
}
`;