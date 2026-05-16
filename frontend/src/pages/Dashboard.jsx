import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Award, TrendingUp, Zap, Star, Clock,
  ChevronRight, Play, CheckCircle, Lock, BarChart2,
  Target, Flame, Gift, User
} from 'lucide-react';
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

/* ─── LEVEL SYSTEM ─────────────────────────────────── */
function getLevel(points) {
  if (points >= 500) return { level: 5, title: 'Expert',     color: '#fbbf24', next: null };
  if (points >= 250) return { level: 4, title: 'Advanced',   color: '#f472b6', next: 500 };
  if (points >= 100) return { level: 3, title: 'Intermediate',color: '#a78bfa', next: 250 };
  if (points >= 40)  return { level: 2, title: 'Learner',    color: '#60a5fa', next: 100 };
  return              { level: 1, title: 'Beginner',          color: '#34d399', next: 40  };
}

/* ─── STREAK FIRE ──────────────────────────────────── */
function StreakBadge({ streak = 0 }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:100, background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.25)' }}>
      <Flame size={14} color='#fbbf24' />
      <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, color:'#fbbf24' }}>{streak} day streak</span>
    </div>
  );
}

/* ─── COURSE PROGRESS CARD ─────────────────────────── */
function CourseCard({ enroll, onContinue, onTest }) {
  const course = enroll.course;
  const progress = enroll.progress || 0;
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      whileHover={{ y:-4 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border:`1px solid ${hov ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius:20, overflow:'hidden',
        boxShadow: hov ? '0 20px 60px rgba(99,102,241,0.15)' : 'none',
        transition:'all .3s',
      }}
    >
      {/* Thumbnail */}
      <div style={{ position:'relative', height:140, overflow:'hidden' }}>
        <img
          src={course?.image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800'}
          alt={course?.title}
          style={{ width:'100%', height:'100%', objectFit:'cover', transform: hov ? 'scale(1.06)' : 'scale(1)', transition:'transform .5s' }}
        />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(4,3,26,0.85),rgba(4,3,26,0.1))' }} />

        {/* Progress ring */}
        <div style={{ position:'absolute', top:10, right:10 }}>
          <svg width={44} height={44}>
            <circle cx={22} cy={22} r={18} fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.1)" strokeWidth={3} />
            <circle cx={22} cy={22} r={18} fill="none" stroke={progress===100?'#34d399':'#6366f1'} strokeWidth={3}
              strokeDasharray={`${(progress/100)*113} 113`} strokeLinecap="round"
              style={{ transform:'rotate(-90deg)', transformOrigin:'22px 22px', transition:'stroke-dasharray 1s ease' }} />
            <text x={22} y={26} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={700} fontFamily="'Syne',sans-serif">{progress}%</text>
          </svg>
        </div>

        {progress === 100 && (
          <div style={{ position:'absolute', bottom:10, left:10, display:'flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:100, background:'rgba(52,211,153,0.2)', border:'1px solid rgba(52,211,153,0.4)' }}>
            <CheckCircle size={11} color='#34d399' />
            <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:10, color:'#34d399' }}>COMPLETED</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding:'16px 18px' }}>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14, color:'#fff', marginBottom:6, lineHeight:1.4,
          display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
          {course?.title}
        </h3>

        {/* Progress bar */}
        <div style={{ marginBottom:14 }}>
          <div style={{ height:4, borderRadius:100, background:'rgba(255,255,255,0.08)', overflow:'hidden' }}>
            <motion.div initial={{ width:0 }} animate={{ width:`${progress}%` }} transition={{ duration:1.2, ease:'easeOut' }}
              style={{ height:'100%', borderRadius:100, background: progress===100 ? 'linear-gradient(90deg,#34d399,#10b981)' : 'linear-gradient(90deg,#6366f1,#8b5cf6)' }} />
          </div>
        </div>

        {/* Points badge */}
        {enroll.points > 0 && (
          <div style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 8px', borderRadius:100, background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.2)', marginBottom:12 }}>
            <Star size={10} color='#fbbf24' fill='#fbbf24' />
            <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:10, color:'#fbbf24' }}>{enroll.points} pts</span>
          </div>
        )}

        {/* Actions */}
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => onContinue(course._id)}
            style={{ flex:1, padding:'9px 0', borderRadius:9, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', color:'#fff', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
            <Play size={11} fill="#fff" /> {progress > 0 ? 'Continue' : 'Start'}
          </button>
          {progress > 0 && (
            <button onClick={() => onTest(course._id)}
              style={{ padding:'9px 12px', borderRadius:9, background:'rgba(167,139,250,0.1)', border:'1px solid rgba(167,139,250,0.25)', color:'#a78bfa', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer', display:'flex', alignItems:'center', gap:5, whiteSpace:'nowrap' }}>
              <Zap size={11} /> AI Test
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── CERTIFICATE CARD ─────────────────────────────── */
function CertCard({ course }) {
  return (
    <motion.div initial={{ opacity:0, scale:.95 }} animate={{ opacity:1, scale:1 }}
      style={{ padding:'16px 18px', borderRadius:14, background:'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.07))', border:'1px solid rgba(99,102,241,0.2)', display:'flex', alignItems:'center', gap:12 }}>
      <div style={{ width:40, height:40, borderRadius:10, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <Award size={20} color='#fff' />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{course?.title}</div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:2 }}>Certificate Earned ✓</div>
      </div>
      <button style={{ padding:'7px 12px', borderRadius:8, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', color:'#fff', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer', whiteSpace:'nowrap' }}>
        Download
      </button>
    </motion.div>
  );
}

/* ─── MAIN DASHBOARD ───────────────────────────────── */
export default function StudentDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');
  const [testLoading, setTestLoading] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/enrollments/my')
      .then(r => setEnrollments(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  /* Computed stats */
  const completed   = enrollments.filter(e => (e.progress||0) >= 100);
  const inProgress  = enrollments.filter(e => (e.progress||0) > 0 && (e.progress||0) < 100);
  const totalPoints = enrollments.reduce((s, e) => s + (e.points||0), 0);
  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((s,e) => s+(e.progress||0),0) / enrollments.length)
    : 0;
  const lvl = getLevel(totalPoints);

  const weeklyData = [
    { day:'Mon', hrs:1.5 },{ day:'Tue', hrs:2 },{ day:'Wed', hrs:0.5 },
    { day:'Thu', hrs:3 },{ day:'Fri', hrs:2.5 },{ day:'Sat', hrs:4 },{ day:'Sun', hrs:2 },
  ];

  const handleTest = async (courseId) => {
    setTestLoading(courseId);
    try {
      const res = await api.post(`/tests/generate/${courseId}`);
      // Navigate to test page or show modal — store in sessionStorage for now
      sessionStorage.setItem('aiTest', JSON.stringify(res.data));
      navigate(`/course/${courseId}/test`);
    } catch(e) {
      alert(e.response?.data?.message || 'Could not generate test right now');
    } finally { setTestLoading(null); }
  };

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#04031a', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:44, height:44, borderRadius:'50%', border:'3px solid rgba(99,102,241,0.2)', borderTopColor:'#6366f1', animation:'spin .8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#04031a', fontFamily:"'DM Sans',sans-serif", overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:rgba(99,102,241,.3);border-radius:3px;}
        @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);}}
      `}</style>

      {/* Ambient background */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }}>
        <div style={{ position:'absolute', top:'-20%', left:'-10%', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.08),transparent 70%)' }} />
        <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,0.07),transparent 70%)' }} />
      </div>

      <div style={{ position:'relative', zIndex:1, maxWidth:1200, margin:'0 auto', padding:'32px 20px' }}>

        {/* ── HEADER ── */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:32, flexWrap:'wrap', gap:16 }}>
          <div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:'clamp(24px,5vw,38px)', color:'#fff', letterSpacing:'-.03em', lineHeight:1.1 }}>
              Hey, {user?.name?.split(' ')[0] || 'Learner'} 👋
            </h1>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, marginTop:6 }}>
              {inProgress.length > 0 ? `${inProgress.length} course${inProgress.length>1?'s':''} in progress — keep going!` : 'Start a course to begin your journey!'}
            </p>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
            <StreakBadge streak={7} />
            <button onClick={() => navigate('/courses')}
              style={{ padding:'10px 20px', borderRadius:10, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', color:'#fff', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer', boxShadow:'0 4px 20px rgba(99,102,241,0.35)' }}>
              + Enroll Course
            </button>
          </div>
        </div>

        {/* ── LEVEL + STATS BANNER ── */}
        <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:16, marginBottom:24 }}>
          {/* Level card */}
          <div style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08))', border:'1px solid rgba(99,102,241,0.2)', borderRadius:20, padding:'20px 28px', display:'flex', alignItems:'center', gap:20, minWidth:260 }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:36, color:lvl.color, lineHeight:1 }}>Lv.{lvl.level}</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, color:lvl.color, marginTop:2 }}>{lvl.title}</div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, color:'rgba(255,255,255,0.5)' }}>XP Points</span>
                <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:12, color:'#fff' }}>{totalPoints} / {lvl.next || '∞'}</span>
              </div>
              <div style={{ height:6, borderRadius:100, background:'rgba(255,255,255,0.08)', overflow:'hidden' }}>
                <div style={{ width:`${lvl.next ? Math.min((totalPoints/lvl.next)*100,100) : 100}%`, height:'100%', borderRadius:100, background:`linear-gradient(90deg,${lvl.color},${lvl.color}88)`, transition:'width 1s ease' }} />
              </div>
              {lvl.next && <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:5 }}>{lvl.next - totalPoints} pts to next level</div>}
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
            {[
              { icon:BookOpen,   label:'Enrolled',   value:enrollments.length, color:'#818cf8' },
              { icon:CheckCircle,label:'Completed',  value:completed.length,   color:'#34d399' },
              { icon:TrendingUp, label:'Avg Progress',value:`${avgProgress}%`, color:'#f472b6' },
              { icon:Star,       label:'Points',     value:totalPoints,         color:'#fbbf24' },
            ].map(({ icon:Icon, label, value, color }, i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'16px', textAlign:'center' }}>
                <Icon size={20} color={color} style={{ margin:'0 auto 8px' }} />
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:24, color:'#fff', letterSpacing:'-.02em' }}>{value}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:4, textTransform:'uppercase', letterSpacing:'.06em', fontFamily:"'Syne',sans-serif" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{ display:'flex', gap:4, marginBottom:24, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:4, width:'fit-content' }}>
          {[
            { id:'courses',  label:'My Courses',    icon:BookOpen },
            { id:'certs',    label:'Certificates',  icon:Award    },
            { id:'progress', label:'Progress',      icon:BarChart2 },
          ].map(({ id, label, icon:Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              style={{ padding:'9px 18px', borderRadius:9, background: activeTab===id ? 'rgba(99,102,241,0.2)' : 'transparent', border:`1px solid ${activeTab===id ? 'rgba(99,102,241,0.35)' : 'transparent'}`, color: activeTab===id ? '#a78bfa' : 'rgba(255,255,255,0.4)', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:6, transition:'all .2s' }}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}
        <AnimatePresence mode="wait">

          {/* MY COURSES TAB */}
          {activeTab === 'courses' && (
            <motion.div key="courses" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}>
              {enrollments.length === 0 ? (
                <div style={{ textAlign:'center', padding:'80px 20px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:20 }}>
                  <BookOpen size={52} color='rgba(255,255,255,0.15)' style={{ margin:'0 auto 16px' }} />
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:'rgba(255,255,255,0.6)', marginBottom:8 }}>No courses yet</h3>
                  <p style={{ color:'rgba(255,255,255,0.3)', fontSize:14, marginBottom:24 }}>Enroll in your first course to start earning XP!</p>
                  <button onClick={() => navigate('/courses')}
                    style={{ padding:'12px 28px', borderRadius:10, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', color:'#fff', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, cursor:'pointer' }}>
                    Browse Courses →
                  </button>
                </div>
              ) : (
                <>
                  {inProgress.length > 0 && (
                    <div style={{ marginBottom:28 }}>
                      <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:'rgba(255,255,255,0.5)', letterSpacing:'.06em', textTransform:'uppercase', marginBottom:14 }}>▸ In Progress</h2>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
                        {inProgress.map(e => (
                          <CourseCard key={e._id} enroll={e}
                            onContinue={id => navigate(`/course/${id}`)}
                            onTest={handleTest}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {completed.length > 0 && (
                    <div style={{ marginBottom:28 }}>
                      <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:'rgba(255,255,255,0.5)', letterSpacing:'.06em', textTransform:'uppercase', marginBottom:14 }}>▸ Completed</h2>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
                        {completed.map(e => (
                          <CourseCard key={e._id} enroll={e}
                            onContinue={id => navigate(`/course/${id}`)}
                            onTest={handleTest}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {enrollments.filter(e=>!(e.progress>0)).length > 0 && (
                    <div>
                      <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:'rgba(255,255,255,0.5)', letterSpacing:'.06em', textTransform:'uppercase', marginBottom:14 }}>▸ Not Started</h2>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
                        {enrollments.filter(e=>!(e.progress>0)).map(e => (
                          <CourseCard key={e._id} enroll={e}
                            onContinue={id => navigate(`/course/${id}`)}
                            onTest={handleTest}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* CERTIFICATES TAB */}
          {activeTab === 'certs' && (
            <motion.div key="certs" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}>
              {completed.length === 0 ? (
                <div style={{ textAlign:'center', padding:'80px 20px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:20 }}>
                  <Award size={52} color='rgba(255,255,255,0.15)' style={{ margin:'0 auto 16px' }} />
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:'rgba(255,255,255,0.6)', marginBottom:8 }}>No certificates yet</h3>
                  <p style={{ color:'rgba(255,255,255,0.3)', fontSize:14 }}>Complete a course to earn your first certificate!</p>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>{completed.length} certificate{completed.length>1?'s':''} earned</p>
                  {completed.map(e => <CertCard key={e._id} course={e.course} />)}
                </div>
              )}
            </motion.div>
          )}

          {/* PROGRESS TAB */}
          {activeTab === 'progress' && (
            <motion.div key="progress" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {/* Weekly chart */}
              <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:18, padding:24 }}>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:'#fff', marginBottom:20 }}>Weekly Learning Hours</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tick={{ fontSize:11, fontFamily:"'Syne',sans-serif" }} />
                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize:11 }} />
                    <Tooltip contentStyle={{ background:'rgba(6,4,28,0.95)', border:'1px solid rgba(99,102,241,0.3)', borderRadius:10, color:'#fff' }} />
                    <Line type="monotone" dataKey="hrs" stroke="#6366f1" strokeWidth={2.5} dot={{ fill:'#6366f1', r:4 }} activeDot={{ r:6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Per course progress */}
              <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:18, padding:24 }}>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:'#fff', marginBottom:20 }}>Course Progress</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  {enrollments.length === 0 && (
                    <p style={{ color:'rgba(255,255,255,0.3)', fontFamily:"'DM Sans',sans-serif", textAlign:'center', padding:24 }}>No enrollments yet</p>
                  )}
                  {enrollments.map((e, i) => {
                    const prog = e.progress || 0;
                    return (
                      <div key={i}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:'#fff', flex:1, paddingRight:12,
                            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                            {e.course?.title}
                          </span>
                          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:12, color: prog===100?'#34d399':'#a78bfa', flexShrink:0 }}>{prog}%</span>
                        </div>
                        <div style={{ height:6, borderRadius:100, background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
                          <motion.div initial={{ width:0 }} animate={{ width:`${prog}%` }} transition={{ duration:1, delay:i*0.1 }}
                            style={{ height:'100%', borderRadius:100, background: prog===100?'linear-gradient(90deg,#34d399,#10b981)':'linear-gradient(90deg,#6366f1,#8b5cf6)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
