import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api';
import {
  LayoutDashboard, Users, BookOpen, PlusCircle, TrendingUp,
  LogOut, Menu, X, ChevronRight, Trash2, Edit2, Eye,
  Award, AlertCircle, CheckCircle, Search, Filter,
  BarChart2, Globe, Star, Clock, ShieldCheck
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

/* ─── ADMIN GUARD — sirf tumhara account ──────────────── */
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'vikash@edunova.com';

/* ─── SIDEBAR NAV ITEMS ───────────────────────────────── */
const NAV = [
  { icon: LayoutDashboard, label: 'Overview',    path: '/admin' },
  { icon: BookOpen,        label: 'Courses',     path: '/admin/courses' },
  { icon: Users,           label: 'Users',       path: '/admin/users' },
  { icon: TrendingUp,      label: 'Analytics',   path: '/admin/analytics' },
];

/* ─── SHARED STYLES ───────────────────────────────────── */
const S = {
  card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 },
  chip: (c='#6366f1') => ({ display:'inline-flex', alignItems:'center', gap:6, padding:'3px 10px', borderRadius:100, background:`${c}20`, border:`1px solid ${c}40`, color:c, fontSize:11, fontWeight:700, fontFamily:"'Syne',sans-serif", letterSpacing:'.06em' }),
  btn: { primary: { padding:'10px 20px', borderRadius:10, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', color:'#fff', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:8, transition:'all .25s' },
         ghost:   { padding:'10px 20px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.7)', fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:8, transition:'all .25s' },
         danger:  { padding:'8px 14px', borderRadius:8, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#f87171', fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:6, transition:'all .25s' } },
};

/* ─── STAT CARD ───────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, color = '#6366f1', trend }) {
  return (
    <div style={{ ...S.card, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:`${color}12` }} />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:12, fontFamily:"'Syne',sans-serif", fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:10 }}>{label}</p>
          <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:36, color:'#fff', letterSpacing:'-.03em', lineHeight:1 }}>{value}</p>
          {sub && <p style={{ color:'rgba(255,255,255,0.35)', fontSize:12, marginTop:6, fontFamily:"'DM Sans',sans-serif" }}>{sub}</p>}
        </div>
        <div style={{ width:44, height:44, borderRadius:12, background:`${color}18`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon size={20} color={color} />
        </div>
      </div>
      {trend && (
        <div style={{ marginTop:16, display:'flex', alignItems:'center', gap:4 }}>
          <span style={{ color: trend > 0 ? '#34d399' : '#f87171', fontSize:12, fontWeight:700, fontFamily:"'Syne',sans-serif" }}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span style={{ color:'rgba(255,255,255,0.3)', fontSize:11 }}>vs last month</span>
        </div>
      )}
    </div>
  );
}

/* ─── SIDEBAR ─────────────────────────────────────────── */
function Sidebar({ open, setOpen }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <>
      {/* Overlay for mobile */}
      {open && <div onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:49, backdropFilter:'blur(4px)' }} />}

      <aside style={{
        position:'fixed', top:0, left:0, bottom:0, zIndex:50,
        width:240,
        background:'rgba(6,4,28,0.97)',
        backdropFilter:'blur(24px)',
        borderRight:'1px solid rgba(99,102,241,0.12)',
        display:'flex', flexDirection:'column',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition:'transform .3s cubic-bezier(.22,1,.36,1)',
      }}>
        {/* Logo */}
        <div style={{ padding:'24px 20px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:17, color:'#fff', boxShadow:'0 4px 16px rgba(99,102,241,0.4)' }}>E</div>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:16, color:'#fff', letterSpacing:'-.01em' }}>EduNova</div>
              <div style={{ fontSize:10, color:'#818cf8', fontFamily:"'Syne',sans-serif", fontWeight:700, letterSpacing:'.08em' }}>ADMIN PANEL</div>
            </div>
          </div>
        </div>

        {/* Admin badge */}
        <div style={{ margin:'16px 20px', padding:'10px 14px', borderRadius:10, background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.2)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <ShieldCheck size={14} color='#818cf8' />
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, color:'#fff' }}>{user?.name}</div>
              <div style={{ fontSize:10, color:'#818cf8' }}>Super Admin</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'8px 12px', display:'flex', flexDirection:'column', gap:2 }}>
          {NAV.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/admin'}
              style={({ isActive }) => ({
                display:'flex', alignItems:'center', gap:10,
                padding:'11px 14px', borderRadius:10,
                background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
                color: isActive ? '#a78bfa' : 'rgba(255,255,255,0.45)',
                fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13,
                textDecoration:'none', transition:'all .2s',
              })}
              onClick={() => window.innerWidth < 768 && setOpen(false)}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding:'16px 12px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => { logout(); navigate('/'); }} style={{ ...S.btn.danger, width:'100%', justifyContent:'center' }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

/* ─── TOPBAR ──────────────────────────────────────────── */
function Topbar({ setOpen, title }) {
  return (
    <header style={{ height:60, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(6,4,28,0.7)', backdropFilter:'blur(16px)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={() => setOpen(o => !o)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.6)', padding:6, borderRadius:8 }}>
          <Menu size={20} />
        </button>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:16, color:'#fff' }}>{title}</h1>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ width:8, height:8, borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 8px #22c55e' }} />
        <span style={{ fontFamily:"'Syne',sans-serif", fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:'.06em' }}>LIVE</span>
      </div>
    </header>
  );
}

/* ─── OVERVIEW PAGE ───────────────────────────────────── */
function Overview() {
  const [stats, setStats] = useState({ users:0, courses:0, enrollments:0, revenue:0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const navigate = useNavigate();

  const chartData = [
    { month:'Jan', enrollments:42, revenue:380 },
    { month:'Feb', enrollments:65, revenue:520 },
    { month:'Mar', enrollments:88, revenue:740 },
    { month:'Apr', enrollments:120, revenue:960 },
    { month:'May', enrollments:160, revenue:1280 },
    { month:'Jun', enrollments:210, revenue:1680 },
  ];

  const pieData = [
    { name:'Students', value:72, color:'#6366f1' },
    { name:'Instructors', value:18, color:'#8b5cf6' },
    { name:'Admins', value:10, color:'#a78bfa' },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, coursesRes] = await Promise.all([
          api.get('/auth/users'),
          api.get('/courses'),
        ]);
        const users = usersRes.data;
        const courses = coursesRes.data;
        setStats({
          users: users.length,
          courses: courses.length,
          enrollments: courses.reduce((s, c) => s + (c.students?.length || 0), 0),
          revenue: courses.reduce((s, c) => s + (c.price || 0) * (c.students?.length || 0), 0),
        });
        setRecentUsers(users.slice(-5).reverse());
        setRecentCourses(courses.slice(-4).reverse());
      } catch (e) { console.error(e); }
    };
    load();
  }, []);

  return (
    <div style={{ padding:'24px', display:'flex', flexDirection:'column', gap:24 }}>
      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
        <StatCard icon={Users}     label="Total Users"       value={stats.users}       sub="All registered accounts" color="#6366f1" trend={12} />
        <StatCard icon={BookOpen}  label="Total Courses"     value={stats.courses}     sub="Published on platform"   color="#8b5cf6" trend={8}  />
        <StatCard icon={TrendingUp} label="Enrollments"      value={stats.enrollments} sub="All time enrollments"    color="#a78bfa" trend={24} />
        <StatCard icon={Award}     label="Revenue (₹)"       value={`₹${stats.revenue.toLocaleString()}`} sub="Estimated earnings" color="#c4b5fd" trend={18} />
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:16 }}>
        {/* Line chart */}
        <div style={S.card}>
          <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:'#fff', marginBottom:20 }}>Enrollment & Revenue Trend</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fontSize:11, fontFamily:"'Syne',sans-serif" }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize:11 }} />
              <Tooltip contentStyle={{ background:'rgba(6,4,28,0.95)', border:'1px solid rgba(99,102,241,0.3)', borderRadius:10, color:'#fff' }} />
              <Line type="monotone" dataKey="enrollments" stroke="#6366f1" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="revenue"     stroke="#a78bfa" strokeWidth={2.5} dot={false} strokeDasharray="5 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div style={S.card}>
          <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:'#fff', marginBottom:16 }}>User Roles</p>
          <PieChart width={240} height={160}>
            <Pie data={pieData} cx={115} cy={75} innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
              {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={{ background:'rgba(6,4,28,0.95)', border:'1px solid rgba(99,102,241,0.3)', borderRadius:10, color:'#fff' }} />
          </PieChart>
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:4 }}>
            {pieData.map((d, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:8, height:8, borderRadius:2, background:d.color, flexShrink:0 }} />
                <span style={{ color:'rgba(255,255,255,0.55)', fontSize:12, fontFamily:"'DM Sans',sans-serif", flex:1 }}>{d.name}</span>
                <span style={{ color:'#fff', fontSize:12, fontWeight:700, fontFamily:"'Syne',sans-serif" }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent rows */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {/* Recent users */}
        <div style={S.card}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14, color:'#fff' }}>Recent Users</p>
            <button onClick={() => navigate('/admin/users')} style={{ ...S.btn.ghost, padding:'6px 12px', fontSize:11 }}>View All <ChevronRight size={12} /></button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {recentUsers.map((u, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', borderRadius:10, background:'rgba(255,255,255,0.03)' }}>
                <div style={{ width:34, height:34, borderRadius:'50%', background:`linear-gradient(135deg,#6366f1,#8b5cf6)`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, color:'#fff', flexShrink:0 }}>
                  {u.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{u.name}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{u.email}</div>
                </div>
                <div style={S.chip(u.role === 'admin' ? '#a78bfa' : u.role === 'instructor' ? '#60a5fa' : '#34d399')}>{u.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent courses */}
        <div style={S.card}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14, color:'#fff' }}>Recent Courses</p>
            <button onClick={() => navigate('/admin/courses')} style={{ ...S.btn.ghost, padding:'6px 12px', fontSize:11 }}>View All <ChevronRight size={12} /></button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {recentCourses.map((c, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', borderRadius:10, background:'rgba(255,255,255,0.03)' }}>
                <img src={c.image} alt={c.title} style={{ width:40, height:40, borderRadius:8, objectFit:'cover', flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.title}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>₹{c.price} • {c.students?.length || 0} enrolled</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── COURSES PAGE ────────────────────────────────────── */
function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const deleteCourse = async (id) => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await api.delete(`/courses/${id}`);
      setCourses(c => c.filter(x => x._id !== id));
    } catch(e) {
      alert(e.response?.data?.message || 'Delete failed');
    } finally { setDeleting(null); }
  };

  const filtered = courses.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding:24, display:'flex', flexDirection:'column', gap:20 }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:22, color:'#fff' }}>All Courses</h2>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:13, fontFamily:"'DM Sans',sans-serif", marginTop:2 }}>{courses.length} total courses</p>
        </div>
        <button onClick={() => navigate('/admin/add-course')} style={S.btn.primary}>
          <PlusCircle size={15} /> Add New Course
        </button>
      </div>

      {/* Search */}
      <div style={{ position:'relative', maxWidth:360 }}>
        <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }} />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search courses..."
          style={{ width:'100%', padding:'10px 12px 10px 36px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff', fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:'none' }}
        />
      </div>

      {/* Table */}
      {loading ? <LoadingBlock /> : (
        <div style={{ ...S.card, padding:0, overflow:'hidden' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                  {['Course','Category','Price','Students','Rating','Actions'].map(h => (
                    <th key={h} style={{ padding:'14px 16px', textAlign:'left', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11, color:'rgba(255,255,255,0.4)', letterSpacing:'.08em', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c._id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', background: i%2===0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td style={{ padding:'14px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <img src={c.image} alt={c.title} style={{ width:40, height:32, borderRadius:6, objectFit:'cover', flexShrink:0 }} />
                        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:'#fff', maxWidth:220, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.title}</div>
                      </div>
                    </td>
                    <td style={{ padding:'14px 16px' }}><div style={S.chip()}>{c.category || 'Uncategorized'}</div></td>
                    <td style={{ padding:'14px 16px', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:'#fff' }}>{c.price === 0 ? <span style={{ color:'#34d399' }}>Free</span> : `₹${c.price}`}</td>
                    <td style={{ padding:'14px 16px', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:'#fff' }}>{c.students?.length || 0}</td>
                    <td style={{ padding:'14px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                        <Star size={12} color='#fbbf24' fill='#fbbf24' />
                        <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, color:'#fff' }}>{c.rating || '4.8'}</span>
                      </div>
                    </td>
                    <td style={{ padding:'14px 16px' }}>
                      <div style={{ display:'flex', gap:8 }}>
                        <button onClick={() => navigate(`/course/${c._id}`)} style={{ ...S.btn.ghost, padding:'7px 12px', fontSize:11 }}>
                          <Eye size={12} /> View
                        </button>
                        <button onClick={() => deleteCourse(c._id)} disabled={deleting === c._id} style={{ ...S.btn.danger, opacity: deleting === c._id ? 0.5 : 1 }}>
                          <Trash2 size={12} /> {deleting === c._id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ padding:40, textAlign:'center', color:'rgba(255,255,255,0.3)', fontFamily:"'DM Sans',sans-serif" }}>
                No courses found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── USERS PAGE ──────────────────────────────────────── */
function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);

  const load = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const changeRole = async (id, role) => {
    setUpdating(id);
    try {
      await api.patch(`/auth/users/${id}/role`, { role });
      setUsers(u => u.map(x => x._id === id ? { ...x, role } : x));
    } catch(e) {
      alert(e.response?.data?.message || 'Role update failed');
    } finally { setUpdating(null); }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || u.role === filter;
    return matchSearch && matchFilter;
  });

  const roleCounts = { all: users.length, student: users.filter(u => u.role==='student').length, instructor: users.filter(u => u.role==='instructor').length, admin: users.filter(u => u.role==='admin').length };

  return (
    <div style={{ padding:24, display:'flex', flexDirection:'column', gap:20 }}>
      <div>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:22, color:'#fff' }}>All Users</h2>
        <p style={{ color:'rgba(255,255,255,0.35)', fontSize:13, fontFamily:"'DM Sans',sans-serif", marginTop:2 }}>{users.length} registered accounts</p>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ position:'relative', flex:'1', minWidth:200, maxWidth:320 }}>
          <Search size={13} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }} />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users..."
            style={{ width:'100%', padding:'9px 11px 9px 32px', borderRadius:9, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff', fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:'none' }}
          />
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {Object.entries(roleCounts).map(([role, count]) => (
            <button key={role} onClick={() => setFilter(role)}
              style={{ padding:'8px 14px', borderRadius:8, background: filter===role ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)', border:`1px solid ${filter===role ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`, color: filter===role ? '#a78bfa' : 'rgba(255,255,255,0.45)', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer', transition:'all .2s', textTransform:'capitalize' }}
            >{role} <span style={{ opacity:.6 }}>({count})</span></button>
          ))}
        </div>
      </div>

      {/* User Cards Grid */}
      {loading ? <LoadingBlock /> : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 }}>
          {filtered.map((u) => (
            <div key={u._id} style={{ ...S.card, padding:18 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:`linear-gradient(135deg,#6366f1,#8b5cf6)`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:16, color:'#fff', flexShrink:0 }}>
                  {u.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{u.name}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{u.email}</div>
                </div>
                <div style={S.chip(u.role==='admin'?'#a78bfa':u.role==='instructor'?'#60a5fa':'#34d399')}>{u.role}</div>
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontFamily:"'DM Sans',sans-serif" }}>
                  Joined {new Date(u.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                </span>

                {/* Role changer — disabled for admin accounts */}
                {u.role !== 'admin' && (
                  <select
                    value={u.role}
                    onChange={e => changeRole(u._id, e.target.value)}
                    disabled={updating === u._id}
                    style={{ padding:'4px 8px', borderRadius:7, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', color:'#fff', fontFamily:"'Syne',sans-serif", fontSize:11, cursor:'pointer', outline:'none' }}
                  >
                    <option value="student"    style={{ background:'#1e1b4b' }}>Student</option>
                    <option value="instructor" style={{ background:'#1e1b4b' }}>Instructor</option>
                  </select>
                )}
                {u.role === 'admin' && <span style={{ fontSize:11, color:'#a78bfa', fontFamily:"'Syne',sans-serif", fontWeight:700 }}>⬡ Admin</span>}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn:'1/-1', padding:48, textAlign:'center', color:'rgba(255,255,255,0.3)', fontFamily:"'DM Sans',sans-serif" }}>No users found</div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── ANALYTICS PAGE ──────────────────────────────────── */
function Analytics() {
  const monthlyData = [
    { month:'Jan', students:120, revenue:9600, courses:3 },
    { month:'Feb', students:180, revenue:14400, courses:4 },
    { month:'Mar', students:240, revenue:19200, courses:5 },
    { month:'Apr', students:320, revenue:25600, courses:7 },
    { month:'May', students:410, revenue:32800, courses:9 },
    { month:'Jun', students:530, revenue:42400, courses:12 },
  ];
  const categoryData = [
    { name:'Web Dev',    students:320, color:'#6366f1' },
    { name:'AI & ML',   students:280, color:'#8b5cf6' },
    { name:'Python',    students:240, color:'#a78bfa' },
    { name:'Design',    students:180, color:'#c4b5fd' },
    { name:'DevOps',    students:140, color:'#818cf8' },
    { name:'Others',    students:90,  color:'#4f46e5' },
  ];

  return (
    <div style={{ padding:24, display:'flex', flexDirection:'column', gap:20 }}>
      <div>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:22, color:'#fff' }}>Analytics</h2>
        <p style={{ color:'rgba(255,255,255,0.35)', fontSize:13, fontFamily:"'DM Sans',sans-serif", marginTop:2 }}>Platform performance overview</p>
      </div>

      {/* Growth chart */}
      <div style={S.card}>
        <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14, color:'#fff', marginBottom:20 }}>Monthly Growth</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fontSize:11, fontFamily:"'Syne',sans-serif" }} />
            <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize:11 }} />
            <Tooltip contentStyle={{ background:'rgba(6,4,28,0.95)', border:'1px solid rgba(99,102,241,0.3)', borderRadius:10, color:'#fff' }} />
            <Bar dataKey="students" fill="#6366f1" radius={[6,6,0,0]} />
            <Bar dataKey="courses"  fill="#a78bfa" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category breakdown */}
      <div style={S.card}>
        <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14, color:'#fff', marginBottom:20 }}>Students by Category</p>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {categoryData.map((d, i) => {
            const max = Math.max(...categoryData.map(x=>x.students));
            const pct = Math.round((d.students/max)*100);
            return (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:80, fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, color:'rgba(255,255,255,0.6)', flexShrink:0 }}>{d.name}</div>
                <div style={{ flex:1, height:8, borderRadius:100, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
                  <div style={{ width:`${pct}%`, height:'100%', borderRadius:100, background:`linear-gradient(90deg,${d.color},${d.color}88)`, transition:'width 1s ease' }} />
                </div>
                <div style={{ width:40, textAlign:'right', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:12, color:'#fff', flexShrink:0 }}>{d.students}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key metrics */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:14 }}>
        {[
          { label:'Avg Completion Rate', value:'78%',    icon:TrendingUp, color:'#34d399' },
          { label:'Avg Course Rating',   value:'4.8 ★',  icon:Star,       color:'#fbbf24' },
          { label:'Avg Session Length',  value:'42 min', icon:Clock,      color:'#60a5fa' },
          { label:'Countries Reached',   value:'50+',    icon:Globe,      color:'#f472b6' },
        ].map((m, i) => <StatCard key={i} {...m} />)}
      </div>
    </div>
  );
}

/* ─── LOADING BLOCK ───────────────────────────────────── */
function LoadingBlock() {
  return (
    <div style={{ display:'flex', justifyContent:'center', padding:60 }}>
      <div style={{ width:40, height:40, borderRadius:'50%', border:'3px solid rgba(99,102,241,0.2)', borderTopColor:'#6366f1', animation:'spin .8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ─── ROOT ADMIN PANEL ────────────────────────────────── */
export default function AdminPanel() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const titles = { '/admin':'Overview', '/admin/courses':'Courses', '/admin/users':'Users', '/admin/analytics':'Analytics' };
  const path = window.location.pathname;
  const title = Object.entries(titles).find(([k]) => path === k)?.[1] || 'Admin';

  // Auto-close on mobile
  useEffect(() => {
    const h = () => { if (window.innerWidth < 768) setSidebarOpen(false); else setSidebarOpen(true); };
    h(); window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  if (loading) return <LoadingBlock />;

  // STRICT ADMIN GUARD — sirf tumhara email
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#04031a', fontFamily:"'DM Sans',sans-serif" }}>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main content */}
      <div style={{
        flex:1,
        marginLeft: sidebarOpen && window.innerWidth >= 768 ? 240 : 0,
        transition:'margin-left .3s cubic-bezier(.22,1,.36,1)',
        display:'flex', flexDirection:'column', minHeight:'100vh',
        overflow:'hidden',
      }}>
        <Topbar setOpen={setSidebarOpen} title={title} />
        <main style={{ flex:1, overflowY:'auto', overflowX:'hidden' }}>
          <Routes>
            <Route index          element={<Overview />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="users"   element={<AdminUsers />} />
            <Route path="analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800;900&family=DM+Sans:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(99,102,241,0.3);border-radius:3px;}
        select option{color:#fff;}
        input::placeholder{color:rgba(255,255,255,0.25);}
      `}</style>
    </div>
  );
}
