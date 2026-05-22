import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Award, TrendingUp, Zap, Star,
  Play, CheckCircle, BarChart2, Flame,
  Home, User, LogOut, ChevronRight
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

/* ─── Level system ─────────────────────────────── */
function getLevel(points) {
  if (points >= 500) return { level:5, title:'Expert',       color:'#fbbf24', next:null };
  if (points >= 250) return { level:4, title:'Advanced',     color:'#f472b6', next:500  };
  if (points >= 100) return { level:3, title:'Intermediate', color:'#a78bfa', next:250  };
  if (points >= 40)  return { level:2, title:'Learner',      color:'#60a5fa', next:100  };
  return               { level:1, title:'Beginner',          color:'#34d399', next:40   };
}

/* ─── Navbar for dashboard ─────────────────────── */
function DashNav({ user, logout }) {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav style={{
      position:'sticky', top:0, zIndex:100,
      height:60, display:'flex', alignItems:'center',
      justifyContent:'space-between', padding:'0 24px',
      background:'rgba(4,3,26,0.85)', backdropFilter:'blur(20px)',
      borderBottom:'1px solid rgba(99,102,241,0.12)',
    }}>
      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }} onClick={()=>navigate('/')}>
        <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:16, color:'#fff' }}>E</div>
        <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:17, color:'#fff', letterSpacing:'-.02em' }}>
          Edu<span style={{ color:'#818cf8' }}>Nova</span>
        </span>
      </div>

      {/* Nav links */}
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
        <NavBtn onClick={()=>navigate('/')} icon={<Home size={14}/>} label="Home" />
        <NavBtn onClick={()=>navigate('/courses')} icon={<BookOpen size={14}/>} label="Courses" />
        <NavBtn onClick={()=>navigate('/enrolled')} icon={<Star size={14}/>} label="Enrolled" />

        {/* Profile dropdown */}
        <div style={{ position:'relative', marginLeft:8 }}>
          <button onClick={()=>setProfileOpen(o=>!o)}
            style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 12px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer' }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:12, color:'#fff' }}>
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, color:'rgba(255,255,255,0.7)' }}>{user?.name?.split(' ')[0]}</span>
            <ChevronRight size={12} color='rgba(255,255,255,0.4)' style={{ transform: profileOpen ? 'rotate(90deg)' : 'none', transition:'transform .2s' }} />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div initial={{opacity:0,y:8,scale:.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:8,scale:.95}}
                style={{ position:'absolute', right:0, top:'calc(100% + 8px)', width:180, background:'rgba(6,4,28,0.98)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:12, overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}>
                <button onClick={()=>{navigate('/profile');setProfileOpen(false);}} style={ddBtn}>
                  <User size={13}/> Profile
                </button>
                <button onClick={()=>{logout();setProfileOpen(false);}} style={{...ddBtn, color:'#f87171', borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                  <LogOut size={13}/> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}

const ddBtn = { display:'flex', alignItems:'center', gap:8, width:'100%', padding:'11px 16px', background:'none', border:'none', color:'rgba(255,255,255,0.7)', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer', textAlign:'left' };

function NavBtn({ onClick, icon, label }) {
  return (
    <button onClick={onClick} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 12px', borderRadius:9, background:'transparent', border:'1px solid transparent', color:'rgba(255,255,255,0.45)', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer', transition:'all .2s' }}
      onMouseEnter={e=>{e.currentTarget.style.background='rgba(99,102,241,0.1)';e.currentTarget.style.color='#a78bfa';}}
      onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='rgba(255,255,255,0.45)';}}>
      {icon} {label}
    </button>
  );
}

/* ─── Streak badge ─────────────────────────────── */
function StreakBadge({ streak=0 }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:100, background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.25)' }}>
      <Flame size={14} color='#fbbf24'/>
      <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, color:'#fbbf24' }}>{streak} day streak</span>
    </div>
  );
}

/* ─── Course card ──────────────────────────────── */
function CourseCard({ enroll, onContinue, onTest, testLoading }) {
  const course = enroll.course;
  const progress = enroll.progress || 0;
  const [hov, setHov] = useState(false);
  if (!course) return null;

  return (
    <motion.div
      initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} whileHover={{y:-4}}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:hov?'rgba(255,255,255,0.06)':'rgba(255,255,255,0.03)', border:`1px solid ${hov?'rgba(99,102,241,0.3)':'rgba(255,255,255,0.07)'}`, borderRadius:20, overflow:'hidden', boxShadow:hov?'0 20px 60px rgba(99,102,241,0.15)':'none', transition:'all .3s' }}
    >
      {/* Thumbnail */}
      <div style={{ position:'relative', height:140, overflow:'hidden' }}>
        <img src={course.image||'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800'} alt={course.title}
          style={{ width:'100%', height:'100%', objectFit:'cover', transform:hov?'scale(1.06)':'scale(1)', transition:'transform .5s' }}/>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(4,3,26,0.85),rgba(4,3,26,0.1))' }}/>
        {/* Progress ring */}
        <div style={{ position:'absolute', top:10, right:10 }}>
          <svg width={44} height={44}>
            <circle cx={22} cy={22} r={18} fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.1)" strokeWidth={3}/>
            <circle cx={22} cy={22} r={18} fill="none" stroke={progress===100?'#34d399':'#6366f1'} strokeWidth={3}
              strokeDasharray={`${(progress/100)*113} 113`} strokeLinecap="round"
              style={{ transform:'rotate(-90deg)', transformOrigin:'22px 22px' }}/>
            <text x={22} y={26} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={700}>{progress}%</text>
          </svg>
        </div>
        {progress===100 && (
          <div style={{ position:'absolute', bottom:10, left:10, display:'flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:100, background:'rgba(52,211,153,0.2)', border:'1px solid rgba(52,211,153,0.4)' }}>
            <CheckCircle size={11} color='#34d399'/>
            <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:10, color:'#34d399' }}>COMPLETED</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding:'16px 18px' }}>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14, color:'#fff', marginBottom:8, lineHeight:1.4, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{course.title}</h3>
        <div style={{ marginBottom:12 }}>
          <div style={{ height:4, borderRadius:100, background:'rgba(255,255,255,0.08)', overflow:'hidden' }}>
            <motion.div initial={{width:0}} animate={{width:`${progress}%`}} transition={{duration:1.2}}
              style={{ height:'100%', borderRadius:100, background:progress===100?'linear-gradient(90deg,#34d399,#10b981)':'linear-gradient(90deg,#6366f1,#8b5cf6)' }}/>
          </div>
        </div>
        {enroll.points>0 && (
          <div style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 8px', borderRadius:100, background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.2)', marginBottom:10 }}>
            <Star size={10} color='#fbbf24' fill='#fbbf24'/>
            <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:10, color:'#fbbf24' }}>{enroll.points} pts</span>
          </div>
        )}
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={()=>onContinue(course._id)}
            style={{ flex:1, padding:'9px 0', borderRadius:9, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', color:'#fff', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
            <Play size={11} fill="#fff"/> {progress>0?'Continue':'Start'}
          </button>
          {progress>0 && (
            <button onClick={()=>onTest(course._id)} disabled={testLoading===course._id}
              style={{ padding:'9px 12px', borderRadius:9, background:'rgba(167,139,250,0.1)', border:'1px solid rgba(167,139,250,0.25)', color:'#a78bfa', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11, cursor:testLoading===course._id?'wait':'pointer', opacity:testLoading===course._id?0.6:1, display:'flex', alignItems:'center', gap:5, whiteSpace:'nowrap' }}>
              <Zap size={11}/> {testLoading===course._id?'Loading...':'AI Test'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Cert card ────────────────────────────────── */
function CertCard({ course }) {
  if (!course) return null;
  return (
    <motion.div initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}}
      style={{ padding:'16px 18px', borderRadius:14, background:'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.07))', border:'1px solid rgba(99,102,241,0.2)', display:'flex', alignItems:'center', gap:12 }}>
      <div style={{ width:40, height:40, borderRadius:10, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <Award size={20} color='#fff'/>
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{course.title}</div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:2 }}>Certificate Earned ✓</div>
      </div>
      <button style={{ padding:'7px 14px', borderRadius:8, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', color:'#fff', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer', whiteSpace:'nowrap' }}>
        Download
      </button>
    </motion.div>
  );
}

/* ─── Stat card ────────────────────────────────── */
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:16, textAlign:'center' }}>
      <Icon size={20} color={color} style={{ margin:'0 auto 8px', display:'block' }}/>
      {/* value 0 bhi dikhega, undefined/null nahi */}
      <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:26, color:'#fff', letterSpacing:'-.02em', lineHeight:1 }}>
        {value ?? 0}
      </div>
      <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:6, textTransform:'uppercase', letterSpacing:'.06em', fontFamily:"'Syne',sans-serif" }}>{label}</div>
    </div>
  );
}

/* ─── Spinner ──────────────────────────────────── */
function Spinner({ text }) {
  return (
    <div style={{ minHeight:'100vh', background:'#04031a', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
      <div style={{ width:44, height:44, borderRadius:'50%', border:'3px solid rgba(99,102,241,0.15)', borderTopColor:'#6366f1', animation:'spin .8s linear infinite' }}/>
      {text && <p style={{ fontFamily:"'Syne',sans-serif", color:'rgba(255,255,255,0.3)', fontSize:13 }}>{text}</p>}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════════ */
export default function Dashboard() {
  const { user, loading: authLoading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab]     = useState('courses');
  const [testLoading, setTestLoading] = useState(null);

  useEffect(() => {
    if (authLoading) return; // auth pending hai, wait karo
    if (!user) { navigate('/login', { replace:true }); return; }

    // Non-student roles admin panel pe
    if (user.role === 'admin' || user.role === 'instructor') {
      navigate('/admin', { replace:true });
      return;
    }

    // Student — enrollments fetch karo
    setDataLoading(true);
    api.get('/enrollments/my')
      .then(r => setEnrollments(r.data || []))
      .catch(err => console.error('Enrollment fetch error:', err))
      .finally(() => setDataLoading(false));

  }, [user, authLoading]);

  /* Computed stats — sirf jab data ready ho */
  const completed   = enrollments.filter(e => (e.progress||0) >= 100);
  const inProgress  = enrollments.filter(e => (e.progress||0) > 0 && (e.progress||0) < 100);
  const notStarted  = enrollments.filter(e => !(e.progress > 0));
  const totalPoints = enrollments.reduce((s,e) => s+(e.points||0), 0);
  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((s,e)=>s+(e.progress||0),0)/enrollments.length) : 0;
  const lvl = getLevel(totalPoints);

  const weeklyData = [
    {day:'Mon',hrs:1.5},{day:'Tue',hrs:2},{day:'Wed',hrs:0.5},
    {day:'Thu',hrs:3},{day:'Fri',hrs:2.5},{day:'Sat',hrs:4},{day:'Sun',hrs:2},
  ];

  const handleTest = async (courseId) => {
    setTestLoading(courseId);
    try {
      const res = await api.post(`/tests/generate/${courseId}`);
      sessionStorage.setItem('aiTest', JSON.stringify(res.data));
      navigate(`/course/${courseId}/test`);
    } catch(e) {
      alert(e.response?.data?.message || 'Could not generate test. Please try again.');
    } finally { setTestLoading(null); }
  };

  // Loading states
  if (authLoading) return <Spinner text="Verifying session..." />;
  if (user?.role === 'admin' || user?.role === 'instructor') return <Spinner />;
  if (dataLoading) return <Spinner text="Loading your dashboard..." />;

  return (
    <div style={{ minHeight:'100vh', background:'#04031a', fontFamily:"'DM Sans',sans-serif", overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:rgba(99,102,241,.3);border-radius:3px;}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      {/* Ambient bg */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }}>
        <div style={{ position:'absolute', top:'-20%', left:'-10%', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.08),transparent 70%)' }}/>
        <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,0.07),transparent 70%)' }}/>
      </div>

      {/* ── Navbar ── */}
      <DashNav user={user} logout={logout} />

      {/* ── Content ── */}
      <div style={{ position:'relative', zIndex:1, maxWidth:1200, margin:'0 auto', padding:'32px 20px' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:32, flexWrap:'wrap', gap:16 }}>
          <div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:'clamp(22px,5vw,36px)', color:'#fff', letterSpacing:'-.03em', lineHeight:1.1 }}>
              Hey, {user?.name?.split(' ')[0] || 'Learner'} 👋
            </h1>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, marginTop:6 }}>
              {inProgress.length>0
                ? `${inProgress.length} course${inProgress.length>1?'s':''} in progress — keep going!`
                : enrollments.length>0 ? `${enrollments.length} course${enrollments.length>1?'s':''} enrolled` : 'Start a course to begin your journey!'}
            </p>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
            <StreakBadge streak={7}/>
            <button onClick={()=>navigate('/courses')}
              style={{ padding:'10px 20px', borderRadius:10, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', color:'#fff', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer', boxShadow:'0 4px 20px rgba(99,102,241,0.35)' }}>
              + Enroll Course
            </button>
          </div>
        </div>

        {/* Level + Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'minmax(220px,auto) 1fr', gap:16, marginBottom:24 }}>
          {/* Level card */}
          <div style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08))', border:'1px solid rgba(99,102,241,0.2)', borderRadius:20, padding:'20px 24px', display:'flex', alignItems:'center', gap:20 }}>
            <div style={{ textAlign:'center', flexShrink:0 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:34, color:lvl.color, lineHeight:1 }}>Lv.{lvl.level}</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11, color:lvl.color, marginTop:3 }}>{lvl.title}</div>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11, color:'rgba(255,255,255,0.5)' }}>XP Points</span>
                <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:11, color:'#fff' }}>{totalPoints} / {lvl.next||'∞'}</span>
              </div>
              <div style={{ height:5, borderRadius:100, background:'rgba(255,255,255,0.08)', overflow:'hidden' }}>
                <div style={{ width:`${lvl.next?Math.min((totalPoints/lvl.next)*100,100):100}%`, height:'100%', borderRadius:100, background:`linear-gradient(90deg,${lvl.color},${lvl.color}88)`, transition:'width 1s ease' }}/>
              </div>
              {lvl.next && <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:5 }}>{lvl.next-totalPoints} pts to next level</div>}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
            <StatCard icon={BookOpen}    label="Enrolled"     value={enrollments.length} color='#818cf8'/>
            <StatCard icon={CheckCircle} label="Completed"    value={completed.length}   color='#34d399'/>
            <StatCard icon={TrendingUp}  label="Avg Progress" value={`${avgProgress}%`}  color='#f472b6'/>
            <StatCard icon={Star}        label="Points"       value={totalPoints}         color='#fbbf24'/>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:4, marginBottom:24, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:4, width:'fit-content' }}>
          {[
            {id:'courses',  label:'My Courses',   icon:BookOpen  },
            {id:'certs',    label:'Certificates', icon:Award     },
            {id:'progress', label:'Progress',     icon:BarChart2 },
          ].map(({id,label,icon:Icon})=>(
            <button key={id} onClick={()=>setActiveTab(id)}
              style={{ padding:'9px 16px', borderRadius:9, background:activeTab===id?'rgba(99,102,241,0.2)':'transparent', border:`1px solid ${activeTab===id?'rgba(99,102,241,0.35)':'transparent'}`, color:activeTab===id?'#a78bfa':'rgba(255,255,255,0.4)', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:6, transition:'all .2s' }}>
              <Icon size={13}/> {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">

          {/* MY COURSES */}
          {activeTab==='courses' && (
            <motion.div key="courses" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}>
              {enrollments.length===0 ? (
                <div style={{ textAlign:'center', padding:'72px 20px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:20 }}>
                  <BookOpen size={48} color='rgba(255,255,255,0.12)' style={{ margin:'0 auto 14px', display:'block' }}/>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, color:'rgba(255,255,255,0.5)', marginBottom:8 }}>No courses yet</h3>
                  <p style={{ color:'rgba(255,255,255,0.25)', fontSize:14, marginBottom:22 }}>Enroll in your first course to start earning XP!</p>
                  <button onClick={()=>navigate('/courses')} style={{ padding:'12px 28px', borderRadius:10, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', color:'#fff', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, cursor:'pointer' }}>
                    Browse Courses →
                  </button>
                </div>
              ) : (
                <>
                  {inProgress.length>0 && (
                    <Section label="In Progress">
                      {inProgress.map(e=><CourseCard key={e._id} enroll={e} onContinue={id=>navigate(`/course/${id}`)} onTest={handleTest} testLoading={testLoading}/>)}
                    </Section>
                  )}
                  {completed.length>0 && (
                    <Section label="Completed">
                      {completed.map(e=><CourseCard key={e._id} enroll={e} onContinue={id=>navigate(`/course/${id}`)} onTest={handleTest} testLoading={testLoading}/>)}
                    </Section>
                  )}
                  {notStarted.length>0 && (
                    <Section label="Not Started">
                      {notStarted.map(e=><CourseCard key={e._id} enroll={e} onContinue={id=>navigate(`/course/${id}`)} onTest={handleTest} testLoading={testLoading}/>)}
                    </Section>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* CERTIFICATES */}
          {activeTab==='certs' && (
            <motion.div key="certs" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}>
              {completed.length===0 ? (
                <div style={{ textAlign:'center', padding:'72px 20px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:20 }}>
                  <Award size={48} color='rgba(255,255,255,0.12)' style={{ margin:'0 auto 14px', display:'block' }}/>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, color:'rgba(255,255,255,0.5)', marginBottom:8 }}>No certificates yet</h3>
                  <p style={{ color:'rgba(255,255,255,0.25)', fontSize:14 }}>Complete a course to earn your first certificate!</p>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:'rgba(255,255,255,0.35)', marginBottom:4 }}>
                    {completed.length} certificate{completed.length>1?'s':''} earned
                  </p>
                  {completed.map(e=><CertCard key={e._id} course={e.course}/>)}
                </div>
              )}
            </motion.div>
          )}

          {/* PROGRESS */}
          {activeTab==='progress' && (
            <motion.div key="progress" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:18, padding:24 }}>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:'#fff', marginBottom:20 }}>Weekly Learning Hours</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tick={{fontSize:11}}/>
                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{fontSize:11}}/>
                    <Tooltip contentStyle={{ background:'rgba(6,4,28,0.95)', border:'1px solid rgba(99,102,241,0.3)', borderRadius:10, color:'#fff' }}/>
                    <Line type="monotone" dataKey="hrs" stroke="#6366f1" strokeWidth={2.5} dot={{fill:'#6366f1',r:4}}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:18, padding:24 }}>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:'#fff', marginBottom:20 }}>Course Progress</h3>
                {enrollments.length===0
                  ? <p style={{ color:'rgba(255,255,255,0.3)', textAlign:'center', padding:24 }}>No enrollments yet</p>
                  : <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                      {enrollments.map((e,i)=>{
                        const prog=e.progress||0;
                        return (
                          <div key={i}>
                            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                              <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:'#fff', flex:1, paddingRight:12, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{e.course?.title}</span>
                              <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:12, color:prog===100?'#34d399':'#a78bfa', flexShrink:0 }}>{prog}%</span>
                            </div>
                            <div style={{ height:5, borderRadius:100, background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
                              <motion.div initial={{width:0}} animate={{width:`${prog}%`}} transition={{duration:1,delay:i*0.1}}
                                style={{ height:'100%', borderRadius:100, background:prog===100?'linear-gradient(90deg,#34d399,#10b981)':'linear-gradient(90deg,#6366f1,#8b5cf6)' }}/>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                }
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Section wrapper ──────────────────────────── */
function Section({ label, children }) {
  return (
    <div style={{ marginBottom:28 }}>
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:12, color:'rgba(255,255,255,0.35)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:14 }}>▸ {label}</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
        {children}
      </div>
    </div>
  );
}
