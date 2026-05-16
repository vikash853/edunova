import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api';
import { ArrowLeft, Upload, BookOpen, Tag, DollarSign, Clock, BarChart2, Star, Image, AlignLeft, CheckCircle } from 'lucide-react';

const CATEGORIES = ["Web Development","AI & Machine Learning","UI/UX Design","Python","Data Science","Mobile Development","DevOps & Cloud","Cybersecurity","Blockchain","Others"];
const LEVELS = ["Beginner","Intermediate","Advanced"];

const S = {
  label: { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, color:'rgba(255,255,255,0.55)', letterSpacing:'.06em', textTransform:'uppercase', marginBottom:8, display:'block' },
  input: { width:'100%', padding:'12px 14px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff', fontFamily:"'DM Sans',sans-serif", fontSize:14, outline:'none', transition:'border .2s' },
  card: { background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:24 },
};

export default function AddCourse() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title:'', description:'', price:0, image:'', category:'Web Development',
    level:'Beginner', duration:'', lessons:0, featured:false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!user || user.role !== 'admin') {
    navigate('/dashboard'); return null;
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.post('/courses', form);
      setSuccess(true);
      setTimeout(() => navigate('/admin/courses'), 2000);
    } catch(err) {
      setError(err.response?.data?.message || 'Failed to create course');
    } finally { setLoading(false); }
  };

  const focusStyle = (e) => e.target.style.borderColor = 'rgba(99,102,241,0.5)';
  const blurStyle  = (e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)';

  if (success) return (
    <div style={{ minHeight:'100vh', background:'#04031a', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center', padding:48 }}>
        <CheckCircle size={64} color='#34d399' style={{ margin:'0 auto 20px' }} />
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:28, color:'#fff', marginBottom:8 }}>Course Created!</h2>
        <p style={{ color:'rgba(255,255,255,0.4)', fontFamily:"'DM Sans',sans-serif" }}>Redirecting to courses list...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#04031a', fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.2);} select option{background:#1e1b4b;color:#fff;}`}</style>

      {/* Topbar */}
      <header style={{ height:60, display:'flex', alignItems:'center', gap:16, padding:'0 24px', borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(6,4,28,0.8)', backdropFilter:'blur(16px)', position:'sticky', top:0, zIndex:50 }}>
        <button onClick={() => navigate('/admin/courses')} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, color:'rgba(255,255,255,0.6)', cursor:'pointer', padding:'7px 12px', display:'flex', alignItems:'center', gap:6, fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:700, transition:'all .2s' }}>
          <ArrowLeft size={14} /> Back
        </button>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:16, color:'#fff' }}>Add New Course</h1>
      </header>

      <div style={{ maxWidth:860, margin:'0 auto', padding:'32px 24px' }}>
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:20 }}>

          {/* Title + Category */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div style={S.card}>
              <label style={S.label}><BookOpen size={11} style={{ display:'inline', marginRight:5 }} />Course Title *</label>
              <input required value={form.title} onChange={e=>set('title',e.target.value)}
                placeholder="e.g. Complete React Developer 2025"
                style={S.input} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div style={S.card}>
              <label style={S.label}><Tag size={11} style={{ display:'inline', marginRight:5 }} />Category *</label>
              <select value={form.category} onChange={e=>set('category',e.target.value)}
                style={{ ...S.input, cursor:'pointer' }} onFocus={focusStyle} onBlur={blurStyle}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div style={S.card}>
            <label style={S.label}><AlignLeft size={11} style={{ display:'inline', marginRight:5 }} />Description *</label>
            <textarea required value={form.description} onChange={e=>set('description',e.target.value)}
              placeholder="Describe what students will learn in this course..."
              rows={5}
              style={{ ...S.input, resize:'vertical', lineHeight:1.7 }}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </div>

          {/* Price + Level + Duration + Lessons */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
            {[
              { key:'price', label:'Price (₹)', icon:DollarSign, type:'number', placeholder:'0 for free', min:0 },
              { key:'duration', label:'Duration', icon:Clock, type:'text', placeholder:'e.g. 24h or 6 weeks' },
              { key:'lessons', label:'No. of Lessons', icon:BarChart2, type:'number', placeholder:'45', min:0 },
            ].map(({ key, label, icon:Icon, type, placeholder, min }) => (
              <div key={key} style={S.card}>
                <label style={S.label}><Icon size={11} style={{ display:'inline', marginRight:5 }} />{label}</label>
                <input type={type} value={form[key]} onChange={e => set(key, type==='number' ? Number(e.target.value) : e.target.value)}
                  placeholder={placeholder} min={min}
                  style={S.input} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            ))}

            <div style={S.card}>
              <label style={S.label}><Star size={11} style={{ display:'inline', marginRight:5 }} />Level</label>
              <select value={form.level} onChange={e=>set('level',e.target.value)}
                style={{ ...S.input, cursor:'pointer' }} onFocus={focusStyle} onBlur={blurStyle}>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Image URL + Featured */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:14, alignItems:'start' }}>
            <div style={S.card}>
              <label style={S.label}><Image size={11} style={{ display:'inline', marginRight:5 }} />Cover Image URL</label>
              <input value={form.image} onChange={e=>set('image',e.target.value)}
                placeholder="https://images.unsplash.com/... (leave blank for default)"
                style={S.input} onFocus={focusStyle} onBlur={blurStyle} />
              {form.image && (
                <img src={form.image} alt="preview" onError={e=>e.target.style.display='none'}
                  style={{ width:'100%', height:120, objectFit:'cover', borderRadius:8, marginTop:12, border:'1px solid rgba(255,255,255,0.08)' }} />
              )}
            </div>

            <div style={{ ...S.card, display:'flex', flexDirection:'column', gap:10, minWidth:160 }}>
              <label style={S.label}>Options</label>
              <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
                <div onClick={() => set('featured', !form.featured)}
                  style={{ width:40, height:22, borderRadius:100, background: form.featured ? '#6366f1' : 'rgba(255,255,255,0.12)', position:'relative', transition:'background .3s', cursor:'pointer', flexShrink:0 }}>
                  <div style={{ position:'absolute', top:3, left: form.featured ? 20 : 3, width:16, height:16, borderRadius:'50%', background:'#fff', transition:'left .3s' }} />
                </div>
                <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, color:'rgba(255,255,255,0.6)' }}>Featured Course</span>
              </label>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontFamily:"'DM Sans',sans-serif", lineHeight:1.5 }}>Featured courses appear on the homepage</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding:'12px 16px', borderRadius:10, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#f87171', fontFamily:"'DM Sans',sans-serif", fontSize:13 }}>
              ⚠ {error}
            </div>
          )}

          {/* Submit */}
          <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
            <button type="button" onClick={() => navigate('/admin/courses')}
              style={{ padding:'12px 24px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.6)', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, cursor:'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              style={{ padding:'12px 32px', borderRadius:10, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', color:'#fff', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow:'0 6px 28px rgba(99,102,241,0.4)', display:'flex', alignItems:'center', gap:8 }}>
              {loading ? '⏳ Creating...' : '✦ Publish Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
