import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // ← Added this
import Button from "../components/common/Button"; // Make sure this path is correct

/* ═══════════════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════════════ */
function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", move);

    let raf;
    const lerp = (a, b, t) => a + (b - a) * t;
    const loop = () => {
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.12);
      if (dot.current) {
        dot.current.style.left = `${pos.current.x}px`;
        dot.current.style.top = `${pos.current.y}px`;
      }
      if (ring.current) {
        ring.current.style.left = `${ringPos.current.x}px`;
        ring.current.style.top = `${ringPos.current.y}px`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dot}
        style={{
          position: "fixed",
          zIndex: 99999,
          pointerEvents: "none",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#818cf8",
          transform: "translate(-50%,-50%)",
          mixBlendMode: "difference",
        }}
      />
      <div
        ref={ring}
        style={{
          position: "fixed",
          zIndex: 99998,
          pointerEvents: "none",
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1.5px solid rgba(129,140,248,0.6)",
          transform: "translate(-50%,-50%)",
          transition: "width .2s, height .2s",
        }}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   PARTICLE CANVAS
═══════════════════════════════════════════════════ */
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let W, H, pts = [], mouse = { x: -9999, y: -9999 }, raf;

    const resize = () => {
      W = c.width = window.innerWidth;
      H = c.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const N = Math.min(90, Math.floor(W / 15));
    const COLS = ["#6366f1","#8b5cf6","#a78bfa","#c4b5fd","#4f46e5"];
    for (let i = 0; i < N; i++) {
      pts.push({
        x: Math.random()*W,
        y: Math.random()*H,
        vx: (Math.random()-.5)*.35,
        vy: (Math.random()-.5)*.35,
        r: 1+Math.random()*2,
        col: COLS[i%COLS.length],
        a: .2+Math.random()*.5
      });
    }

    const tick = () => {
      ctx.clearRect(0,0,W,H);
      for (let i=0;i<pts.length;i++) {
        for (let j=i+1;j<pts.length;j++) {
          const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.hypot(dx,dy);
          if(d<120) {
            ctx.beginPath();
            ctx.strokeStyle=`rgba(99,102,241,${.10*(1-d/120)})`;
            ctx.lineWidth=.5;
            ctx.moveTo(pts[i].x,pts[i].y);
            ctx.lineTo(pts[j].x,pts[j].y);
            ctx.stroke();
          }
        }
        const mdx=mouse.x-pts[i].x, mdy=mouse.y-pts[i].y, md=Math.hypot(mdx,mdy);
        if(md<180){
          pts[i].vx+=mdx*.00012;
          pts[i].vy+=mdy*.00012;
        }
        ctx.beginPath();
        ctx.arc(pts[i].x,pts[i].y,pts[i].r,0,Math.PI*2);
        ctx.fillStyle=pts[i].col;
        ctx.globalAlpha=pts[i].a;
        ctx.fill();
        ctx.globalAlpha=1;
        pts[i].x+=pts[i].vx;
        pts[i].y+=pts[i].vy;
        pts[i].vx*=.99;
        pts[i].vy*=.99;
        if(pts[i].x<0)pts[i].x=W;
        if(pts[i].x>W)pts[i].x=0;
        if(pts[i].y<0)pts[i].y=H;
        if(pts[i].y>H)pts[i].y=0;
      }
      raf=requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize",resize);
    };
  },[]);

  return <canvas ref={ref} style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none",width:"100%",height:"100%" }} />;
}

/* ═══════════════════════════════════════════════════
   3D ROTATING ORB (CSS)
═══════════════════════════════════════════════════ */
function Orb3D() {
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      setRot({ x: (e.clientY - cy) * 0.015, y: (e.clientX - cx) * 0.015 });
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  return (
    <div ref={ref} style={{ position:"relative", width:320, height:320, margin:"0 auto", perspective:800 }}>
      {/* Glow beneath */}
      <div style={{ position:"absolute", bottom:-40, left:"50%", transform:"translateX(-50%)", width:200, height:40, background:"radial-gradient(ellipse,rgba(99,102,241,0.4),transparent 70%)", borderRadius:"50%", filter:"blur(10px)" }} />
      <div style={{
        width:"100%", height:"100%", borderRadius:"50%",
        background: "radial-gradient(circle at 38% 35%, #a78bfa 0%, #6366f1 40%, #312e81 75%, #1e1b4b 100%)",
        boxShadow: "inset -30px -20px 60px rgba(0,0,0,0.5), inset 20px 15px 40px rgba(167,139,250,0.3), 0 0 80px rgba(99,102,241,0.35), 0 0 160px rgba(99,102,241,0.15)",
        transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
        transition: "transform .08s ease",
        animation: "orbFloat 6s ease-in-out infinite",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Shimmer ring */}
        <div style={{ position:"absolute", top:"10%", left:"10%", width:"40%", height:"40%", borderRadius:"50%", background:"rgba(255,255,255,0.12)", filter:"blur(8px)" }} />
        {/* Grid lines on orb */}
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"repeating-linear-gradient(0deg,transparent,transparent 28px,rgba(255,255,255,0.04) 28px,rgba(255,255,255,0.04) 29px), repeating-linear-gradient(90deg,transparent,transparent 28px,rgba(255,255,255,0.04) 28px,rgba(255,255,255,0.04) 29px)" }} />
      </div>
      {/* Orbiting ring */}
      <div style={{ position:"absolute", inset:-20, borderRadius:"50%", border:"1px solid rgba(129,140,248,0.2)", animation:"orbRing 8s linear infinite" }} />
      <div style={{ position:"absolute", inset:-40, borderRadius:"50%", border:"1px dashed rgba(129,140,248,0.1)", animation:"orbRing 14s linear infinite reverse" }} />
      {/* Floating badges */}
      {[
        { label:"AI-Powered", top:"5%", right:"-5%", delay:"0s" },
        { label:"500+ Courses", bottom:"15%", left:"-10%", delay:".5s" },
        { label:"10k+ Learners", top:"40%", right:"-15%", delay:"1s" },
      ].map((b,i)=>(
        <div key={i} style={{
          position:"absolute", top:b.top, bottom:b.bottom, left:b.left, right:b.right,
          padding:"7px 14px", borderRadius:100,
          background:"rgba(15,10,40,0.85)", backdropFilter:"blur(12px)",
          border:"1px solid rgba(129,140,248,0.3)",
          color:"#c4b5fd", fontSize:12, fontFamily:"'Syne',sans-serif", fontWeight:700,
          whiteSpace:"nowrap", boxShadow:"0 4px 20px rgba(99,102,241,0.2)",
          animation:`badgeFloat 4s ease-in-out ${b.delay} infinite`,
        }}>{b.label}</div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════ */
function useInView(thresh=0.1) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setV(true);
    }, { threshold: thresh });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, v];
}

function useCounter(to, dur=1600) {
  const [v, setV] = useState(0);
  const [ref, iv] = useInView(0.3);
  useEffect(() => {
    if (!iv) return;
    let s = Date.now();
    const t = () => {
      const p = Math.min((Date.now() - s) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.floor(e * to));
      if (p < 1) requestAnimationFrame(t);
      else setV(to);
    };
    requestAnimationFrame(t);
  }, [iv, to]);
  return [ref, v];
}

function useTyping(words, speed=75, pause=2000) {
  const [txt, setTxt] = useState("");
  const [wi, setWi] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const w = words[wi % words.length];
    const id = setTimeout(() => {
      if (!del) {
        setTxt(w.slice(0, txt.length + 1));
        if (txt.length + 1 === w.length) setTimeout(() => setDel(true), pause);
      } else {
        setTxt(w.slice(0, txt.length - 1));
        if (txt.length === 0) {
          setDel(false);
          setWi(i => i + 1);
        }
      }
    }, del ? speed / 2 : speed);

    return () => clearTimeout(id);
  }, [txt, del, wi, words]);

  return txt;
}

/* ═══════════════════════════════════════════════════
   NAVBAR – now fully clickable
═══════════════════════════════════════════════════ */
function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 40px",
      background: scrolled ? "rgba(4,3,20,0.88)" : "transparent",
      backdropFilter: scrolled ? "blur(24px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(99,102,241,0.12)" : "none",
      transition: "all .4s ease"
    }}>
      {/* Logo – clickable */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer"
        }}
        onClick={() => navigate("/")}
      >
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 11,
          background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Syne',sans-serif",
          fontWeight: 900,
          fontSize: 20,
          color: "#fff",
          boxShadow: "0 4px 20px rgba(99,102,241,0.45)"
        }}>E</div>
        <span style={{
          fontFamily: "'Syne',sans-serif",
          fontWeight: 800,
          fontSize: 20,
          color: "#fff",
          letterSpacing: "-.02em"
        }}>
          Edu<span style={{ color: "#818cf8" }}>Nova</span>
        </span>
      </div>

      {/* Links & Buttons – all clickable */}
      <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
        {["Courses", "Faculty", "Pricing", "Blog"].map(l => (
          <button
            key={l}
            onClick={() => navigate(`/${l.toLowerCase()}`)}
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: 14,
              fontFamily: "'Syne',sans-serif",
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: ".01em",
              transition: "color .2s",
              background: "none",
              border: "none",
              cursor: "pointer"
            }}
            onMouseEnter={e => e.target.style.color = "#a78bfa"}
            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.55)"}
          >
            {l}
          </button>
        ))}

        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "8px 20px",
            borderRadius: 9,
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            fontFamily: "'Syne',sans-serif",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            transition: "all .25s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "rgba(129,140,248,0.6)";
            e.currentTarget.style.color = "#a78bfa";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            e.currentTarget.style.color = "#fff";
          }}
        >
          Log In
        </button>

        <button
          onClick={() => navigate("/register")}
          style={{
            padding: "9px 22px",
            borderRadius: 10,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            border: "none",
            color: "#fff",
            fontFamily: "'Syne',sans-serif",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
            transition: "all .3s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 30px rgba(99,102,241,0.55)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(99,102,241,0.4)";
          }}
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════
   HERO – now clickable
═══════════════════════════════════════════════════ */
function Hero() {
  const navigate = useNavigate();
  const typed = useTyping(["with AI Guidance","at Your Own Pace","from Real Experts","for Real Careers"]);
  const [on, setOn] = useState(false);

  useEffect(() => {
    setTimeout(() => setOn(true), 80);
  }, []);

  const reveal = (d) => ({
    opacity: on ? 1 : 0,
    transform: on ? "translateY(0)" : "translateY(32px)",
    transition: `opacity .9s ease ${d}s, transform .9s cubic-bezier(.22,1,.36,1) ${d}s`
  });

  return (
    <section style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      position: "relative",
      zIndex: 1,
      padding: "80px 40px 60px"
    }}>
      {/* Centre glow */}
      <div style={{
        position: "absolute",
        top: "35%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        width: 700,
        height: 400,
        background: "radial-gradient(ellipse,rgba(99,102,241,0.15) 0%,transparent 70%)",
        pointerEvents: "none"
      }} />

      <div style={{
        maxWidth: 1300,
        margin: "0 auto",
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 80,
        alignItems: "center"
      }}>
        {/* Left */}
        <div>
          {/* Badge */}
          <div style={{ ...reveal(0), display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, marginBottom: 32, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.28)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", boxShadow: "0 0 10px #6366f1", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ color: "#a78bfa", fontSize: 12, fontFamily: "'Syne',sans-serif", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>
              AI-Powered Learning Platform
            </span>
          </div>

          {/* Headline */}
          <div style={reveal(0.15)}>
            <h1 style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: "-.04em",
              color: "#fff",
              margin: "0 0 20px",
              fontSize: "clamp(48px,5.5vw,80px)"
            }}>
              Unlock Your<br/>
              <span style={{
                background: "linear-gradient(120deg,#818cf8 0%,#c4b5fd 45%,#e879f9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                Potential.
              </span>
            </h1>
          </div>

          {/* Typed line */}
          <div style={{
            ...reveal(0.3),
            fontFamily: "'Syne',sans-serif",
            fontWeight: 700,
            fontSize: "clamp(18px,2vw,26px)",
            color: "rgba(255,255,255,0.45)",
            marginBottom: 24,
            minHeight: 40,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            Learn <span style={{ color: "#a78bfa" }}>{typed}</span>
            <span style={{ display: "inline-block", width: 2, height: "1em", background: "#6366f1", borderRadius: 2, animation: "blink .75s step-end infinite" }} />
          </div>

          <p style={{
            ...reveal(0.42),
            color: "rgba(255,255,255,0.4)",
            fontSize: 17,
            lineHeight: 1.85,
            maxWidth: 480,
            marginBottom: 44,
            fontFamily: "'DM Sans',sans-serif"
          }}>
            EduNova is the next-generation LMS — video lectures, AI-personalised paths, live progress tracking, and verified certificates. Everything you need to go from beginner to career-ready.
          </p>

          {/* CTAs – clickable */}
          <div style={{ ...reveal(0.54), display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 52 }}>
            <button
              onClick={() => navigate("/courses")}
              style={{
                padding: "15px 34px",
                borderRadius: 13,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                border: "none",
                color: "#fff",
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 8px 40px rgba(99,102,241,0.45)",
                transition: "all .3s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 14px 50px rgba(99,102,241,0.6)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 40px rgba(99,102,241,0.45)";
              }}
            >
              Explore Courses <span>→</span>
            </button>

            <button
              onClick={() => navigate("/register")}
              style={{
                padding: "15px 34px",
                borderRadius: 13,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.13)",
                color: "#fff",
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                transition: "all .3s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(99,102,241,0.12)";
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.13)";
              }}
            >
              Start Free ✦
            </button>
          </div>

          {/* Mini stats */}
          <div style={{ ...reveal(0.65), display: "flex", gap: 28, flexWrap: "wrap" }}>
            {[
              { v: "500+", l: "Courses" },
              { v: "10k+", l: "Learners" },
              { v: "4.9★", l: "Rating" },
              { v: "98%", l: "Completion" }
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 900,
                  fontSize: 22,
                  color: "#fff",
                  letterSpacing: "-.02em"
                }}>{s.v}</div>
                <div style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                  letterSpacing: ".08em"
                }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — 3D Orb */}
        <div style={{ ...reveal(0.3), display: "flex", justifyContent: "center" }}>
          <Orb3D />
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: "absolute",
        bottom: 36,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        opacity: 0.35,
        animation: "fadeFloat 2.5s ease-in-out infinite"
      }}>
        <span style={{
          fontSize: 10,
          fontFamily: "'Syne',sans-serif",
          letterSpacing: ".14em",
          color: "#fff"
        }}>SCROLL</span>
        <div style={{
          width: 1,
          height: 38,
          background: "linear-gradient(to bottom,rgba(129,140,248,0.7),transparent)"
        }} />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   INFINITE MARQUEE TRUST BAR – clickable items if needed
═══════════════════════════════════════════════════ */
function Marquee() {
  const items = [
    "🎓 MIT OpenCourseWare Partner",
    "⚡ Powered by GPT-4o",
    "🏆 Awwwards Honorable Mention",
    "🔐 SOC 2 Certified",
    "🌍 50+ Countries",
    "📜 Verified Certificates",
    "🚀 Ship Real Projects",
    "✦ Expert Instructors",
    "💼 Career-Ready Skills",
    "📈 98% Completion Rate"
  ];
  const doubled = [...items, ...items];

  return (
    <div style={{
      position: "relative",
      zIndex: 1,
      overflow: "hidden",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(255,255,255,0.02)",
      padding: "18px 0"
    }}>
      <div style={{
        display: "flex",
        animation: "marquee 30s linear infinite",
        width: "max-content"
      }}>
        {doubled.map((t, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            padding: "0 32px",
            whiteSpace: "nowrap",
            fontFamily: "'Syne',sans-serif",
            fontWeight: 600,
            fontSize: 13,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: ".04em"
          }}>
            <span style={{ color: "rgba(99,102,241,0.5)" }}>✦</span>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   BENTO FEATURES GRID (Apple-style) – clickable "Learn more"
═══════════════════════════════════════════════════ */
function BentoFeatures() {
  const navigate = useNavigate();
  const [ref, iv] = useInView(0.05);
  const cells = [
    { title: "AI-Personalised Paths", desc: "Our engine maps your goals and adapts every lesson in real time. No two students get the same curriculum.", icon: "🧠", span: "col-span-2", bg: "linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.08))", accent: "#818cf8", big: true },
    { title: "HD Video Lectures", desc: "Studio-quality lessons with playback control and auto-captions.", icon: "🎬", span: "", bg: "rgba(255,255,255,0.03)", accent: "#a78bfa" },
    { title: "Live Progress", desc: "Watch your dashboard update in real time as you learn.", icon: "📈", span: "", bg: "rgba(255,255,255,0.03)", accent: "#c4b5fd" },
    { title: "Verified Certificates", desc: "Instant PDF certs the moment you hit 100%. LinkedIn-ready.", icon: "🏆", span: "", bg: "rgba(255,255,255,0.03)", accent: "#818cf8" },
    { title: "Expert Instructors", desc: "Vetted professionals with real-world experience, not just theory.", icon: "👨‍🏫", span: "col-span-2", bg: "linear-gradient(135deg,rgba(139,92,246,0.12),rgba(99,102,241,0.06))", accent: "#a78bfa", big: true },
    { title: "Learn Anywhere", desc: "Seamless across every device. Pick up exactly where you left off.", icon: "🌍", span: "", bg: "rgba(255,255,255,0.03)", accent: "#6366f1" },
  ];

  return (
    <section style={{ position: "relative", zIndex: 1, padding: "100px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={ref} style={{
          textAlign: "center",
          marginBottom: 60,
          opacity: iv ? 1 : 0,
          transform: iv ? "translateY(0)" : "translateY(36px)",
          transition: "opacity .8s,transform .8s"
        }}>
          <Chip>Everything You Need</Chip>
          <h2 style={{
            fontFamily: "'Syne',sans-serif",
            fontWeight: 900,
            fontSize: "clamp(34px,4.5vw,58px)",
            color: "#fff",
            letterSpacing: "-.03em",
            marginTop: 16
          }}>
            Built for <GradText>Real Learners</GradText>
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.38)",
            fontSize: 17,
            maxWidth: 500,
            margin: "16px auto 0",
            fontFamily: "'DM Sans',sans-serif",
            lineHeight: 1.85
          }}>
            Every feature was designed with one mission: get you from zero to career-ready, fast.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {cells.map((c, i) => {
            const [cr, civ] = useInView(0.08);
            const [hov, setHov] = useState(false);
            return (
              <div
                key={i}
                ref={cr}
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                style={{
                  gridColumn: c.span || "span 1",
                  background: hov ? c.bg.replace("0.15","0.22").replace("0.12","0.18") : c.bg,
                  border: `1px solid ${hov ? c.accent + "40" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 20,
                  padding: c.big ? "36px" : "28px",
                  opacity: civ ? 1 : 0,
                  transform: civ ? "translateY(0)" : "translateY(44px)",
                  transition: `opacity .7s ease ${i * 0.08}s, transform .7s cubic-bezier(.22,1,.36,1) ${i * 0.08}s, border-color .3s, background .3s`,
                  backdropFilter: "blur(10px)",
                  cursor: "default",
                  boxShadow: hov ? `0 20px 60px rgba(0,0,0,0.25),0 0 40px ${c.accent}15` : "none",
                }}
              >
                <div style={{
                  fontSize: c.big ? 44 : 36,
                  marginBottom: 18,
                  display: "inline-block",
                  transform: hov ? "scale(1.15) rotate(5deg)" : "scale(1)",
                  transition: "transform .4s cubic-bezier(.22,1,.36,1)",
                  filter: `drop-shadow(0 0 10px ${c.accent}50)`
                }}>{c.icon}</div>

                <h3 style={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 800,
                  fontSize: c.big ? 22 : 18,
                  color: "#fff",
                  marginBottom: 10
                }}>{c.title}</h3>

                <p style={{
                  color: "rgba(255,255,255,0.42)",
                  fontSize: 14,
                  lineHeight: 1.75,
                  fontFamily: "'DM Sans',sans-serif"
                }}>{c.desc}</p>

                {c.big && (
                  <div style={{
                    marginTop: 20,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    color: c.accent,
                    fontSize: 13,
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                  onClick={() => navigate('/features')} // ← Made clickable
                  >
                    Learn more <span>→</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   STATS COUNTER SECTION – clickable if needed
═══════════════════════════════════════════════════ */
function Stats() {
  const navigate = useNavigate();
  const [r, iv] = useInView(0.05);
  const [r1, v1] = useCounter(500);
  const [r2, v2] = useCounter(10000);
  const [r3, v3] = useCounter(98);
  const [r4, v4] = useCounter(74);

  return (
    <section style={{ position: "relative", zIndex: 1, padding: "80px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <GlowDivider />
        <div ref={r} style={{
          textAlign: "center",
          marginBottom: 64,
          opacity: iv ? 1 : 0,
          transform: iv ? "translateY(0)" : "translateY(30px)",
          transition: "opacity .8s,transform .8s",
          paddingTop: 80
        }}>
          <Chip>By The Numbers</Chip>
          <h2 style={{
            fontFamily: "'Syne',sans-serif",
            fontWeight: 900,
            fontSize: "clamp(32px,4.5vw,56px)",
            color: "#fff",
            letterSpacing: "-.03em",
            marginTop: 16
          }}>
            Numbers That <GradText>Speak</GradText>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2 }}>
          {[
            { ref: r1, v: v1, suf: "+", l: "Courses", icon: "📚" },
            { ref: r2, v: v2, suf: "+", l: "Learners", icon: "👩‍💻" },
            { ref: r3, v: v3, suf: "%", l: "Completion", icon: "🎯" },
            { ref: r4, v: v4, suf: "+", l: "Instructors", icon: "🏆" }
          ].map((s, i) => (
            <div key={i} ref={s.ref} style={{
              textAlign: "center",
              padding: "52px 20px",
              background: i % 2 === 0 ? "rgba(99,102,241,0.05)" : "transparent",
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.04)"
            }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{s.icon}</div>
              <div style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 900,
                fontSize: "clamp(44px,5vw,70px)",
                letterSpacing: "-.04em",
                lineHeight: 1,
                background: "linear-gradient(135deg,#fff,#a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                {s.v.toLocaleString()}{s.suf}
              </div>
              <div style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: 12,
                marginTop: 10,
                textTransform: "uppercase",
                letterSpacing: ".1em",
                fontFamily: "'Syne',sans-serif"
              }}>{s.l}</div>
            </div>
          ))}
        </div>
        <GlowDivider style={{ marginTop: 80 }} />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   HOW IT WORKS – steps clickable if needed
═══════════════════════════════════════════════════ */
function HowItWorks() {
  const navigate = useNavigate();
  const [ref, iv] = useInView(0.05);
  const steps = [
    { n: "01", title: "Create Your Account", desc: "30-second signup. Choose student or instructor. No credit card required.", icon: "✦", c: "#6366f1" },
    { n: "02", title: "Pick Your Path", desc: "Browse 500+ courses or let our AI build your perfect curriculum.", icon: "◈", c: "#8b5cf6" },
    { n: "03", title: "Learn & Track", desc: "Watch HD videos, complete projects, and watch your progress update live.", icon: "⬡", c: "#a78bfa" },
    { n: "04", title: "Earn Certificate", desc: "Hit 100% → download your verified cert and share it everywhere.", icon: "⬢", c: "#c4b5fd" },
  ];

  return (
    <section style={{ position: "relative", zIndex: 1, padding: "100px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div ref={ref} style={{
          textAlign: "center",
          marginBottom: 72,
          opacity: iv ? 1 : 0,
          transform: iv ? "translateY(0)" : "translateY(30px)",
          transition: "opacity .8s,transform .8s"
        }}>
          <Chip>How It Works</Chip>
          <h2 style={{
            fontFamily: "'Syne',sans-serif",
            fontWeight: 900,
            fontSize: "clamp(34px,4.5vw,58px)",
            color: "#fff",
            letterSpacing: "-.03em",
            marginTop: 16
          }}>
            Four Steps to <GradText>Mastery</GradText>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, position: "relative" }}>
          <div style={{
            position: "absolute",
            top: 52,
            left: "8%",
            right: "8%",
            height: 1,
            background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.25),rgba(139,92,246,0.25),transparent)",
            zIndex: 0
          }} />

          {steps.map((s, i) => {
            const [sr, siv] = useInView(0.1);
            const [hov, setHov] = useState(false);
            return (
              <div
                key={i}
                ref={sr}
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                style={{
                  textAlign: "center",
                  position: "relative",
                  zIndex: 1,
                  opacity: siv ? 1 : 0,
                  transform: siv ? "translateY(0)" : "translateY(44px)",
                  transition: `opacity .7s ease ${i * 0.13}s,transform .7s cubic-bezier(.22,1,.36,1) ${i * 0.13}s`
                }}
              >
                <div style={{
                  width: 76,
                  height: 76,
                  borderRadius: "50%",
                  margin: "0 auto 24px",
                  background: hov ? `linear-gradient(135deg,${s.c}30,${s.c}10)` : "rgba(255,255,255,0.04)",
                  border: `2px solid ${hov ? s.c + "80" : "rgba(255,255,255,0.08)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 30,
                  color: s.c,
                  boxShadow: hov ? `0 0 30px ${s.c}30` : "none",
                  transition: "all .35s cubic-bezier(.22,1,.36,1)"
                }}>{s.icon}</div>

                <div style={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 900,
                  fontSize: 11,
                  color: `${s.c}88`,
                  letterSpacing: ".15em",
                  marginBottom: 10
                }}>{s.n}</div>

                <h3 style={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 800,
                  fontSize: 17,
                  color: "#fff",
                  marginBottom: 10
                }}>{s.title}</h3>

                <p style={{
                  color: "rgba(255,255,255,0.38)",
                  fontSize: 13.5,
                  lineHeight: 1.75,
                  fontFamily: "'DM Sans',sans-serif"
                }}>{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PRICING – all plans clickable
═══════════════════════════════════════════════════ */
function Pricing() {
  const navigate = useNavigate();
  const [ref, iv] = useInView(0.05);
  const [annual, setAnnual] = useState(true);

  const plans = [
    { name: "Free", price: 0, desc: "Perfect to explore EduNova", features: ["3 free courses", "Basic progress tracking", "Community access", "Mobile access"], cta: "Start Free", ghost: true, c: "#6366f1", path: "/register" },
    { name: "Pro", price: annual ? 9 : 12, desc: "For serious learners", features: ["Unlimited courses", "AI learning path", "Priority support", "Verified certificates", "Offline downloads", "1-on-1 mentoring sessions"], cta: "Start Pro Trial", hot: true, c: "#8b5cf6", path: "/register" },
    { name: "Team", price: annual ? 29 : 38, desc: "For organizations & cohorts", features: ["Everything in Pro", "Team dashboard", "Custom branding", "Admin analytics", "SSO & LMS integrations", "Dedicated account manager"], cta: "Contact Sales", ghost: true, c: "#a78bfa", path: "/contact" },
  ];

  return (
    <section style={{ position: "relative", zIndex: 1, padding: "100px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div ref={ref} style={{
          textAlign: "center",
          marginBottom: 56,
          opacity: iv ? 1 : 0,
          transform: iv ? "translateY(0)" : "translateY(30px)",
          transition: "opacity .8s,transform .8s"
        }}>
          <Chip>Pricing</Chip>
          <h2 style={{
            fontFamily: "'Syne',sans-serif",
            fontWeight: 900,
            fontSize: "clamp(34px,4.5vw,58px)",
            color: "#fff",
            letterSpacing: "-.03em",
            marginTop: 16
          }}>
            Simple, <GradText>Transparent</GradText> Pricing
          </h2>

          {/* Toggle */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            marginTop: 28,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 100,
            padding: "6px 6px 6px 16px"
          }}>
            <span style={{ fontSize: 13, fontFamily: "'Syne',sans-serif", fontWeight: 600, color: !annual ? "#fff" : "rgba(255,255,255,0.4)" }}>
              Monthly
            </span>
            <div
              onClick={() => setAnnual(a => !a)}
              style={{
                width: 44,
                height: 26,
                borderRadius: 100,
                background: annual ? "#6366f1" : "rgba(255,255,255,0.12)",
                cursor: "pointer",
                position: "relative",
                transition: "background .3s"
              }}
            >
              <div style={{
                position: "absolute",
                top: 3,
                left: annual ? 20 : 3,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#fff",
                transition: "left .3s",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
              }} />
            </div>
            <span style={{ fontSize: 13, fontFamily: "'Syne',sans-serif", fontWeight: 600, color: annual ? "#fff" : "rgba(255,255,255,0.4)" }}>
              Annual
            </span>
            <div style={{
              background: "rgba(99,102,241,0.2)",
              border: "1px solid rgba(99,102,241,0.35)",
              borderRadius: 100,
              padding: "3px 10px",
              color: "#a78bfa",
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "'Syne',sans-serif"
            }}>
              Save 25%
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {plans.map((p, i) => {
            const [pr, piv] = useInView(0.1);
            const [hov, setHov] = useState(false);
            return (
              <div
                key={i}
                ref={pr}
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                style={{
                  opacity: piv ? 1 : 0,
                  transform: piv ? "translateY(0) scale(1)" : "translateY(50px) scale(.97)",
                  transition: `opacity .7s ease ${i * 0.12}s,transform .7s cubic-bezier(.22,1,.36,1) ${i * 0.12}s`,
                  borderRadius: 22,
                  background: p.hot ? "linear-gradient(160deg,rgba(99,102,241,0.18),rgba(139,92,246,0.12))" : "rgba(255,255,255,0.03)",
                  border: p.hot ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.07)",
                  padding: "36px 28px",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: p.hot ? "0 24px 60px rgba(99,102,241,0.2)" : hov ? "0 16px 40px rgba(0,0,0,0.2)" : "none",
                  transform: piv ? (p.hot ? "translateY(0) scale(1.03)" : "translateY(0) scale(1)") : "translateY(50px) scale(.97)",
                }}
              >
                {p.hot && (
                  <div style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    padding: "4px 12px",
                    borderRadius: 100,
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    color: "#fff",
                    fontSize: 10,
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 800,
                    letterSpacing: ".1em",
                    textTransform: "uppercase"
                  }}>
                    Most Popular
                  </div>
                )}

                <div style={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 800,
                  fontSize: 17,
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: 8
                }}>{p.name}</div>

                <div style={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 900,
                  fontSize: 52,
                  color: "#fff",
                  letterSpacing: "-.04em",
                  lineHeight: 1,
                  marginBottom: 6
                }}>
                  {p.price === 0 ? "Free" : (
                    <>
                      <span style={{ fontSize: 22, verticalAlign: "top", marginTop: 14, display: "inline-block" }}>$</span>
                      {p.price}
                    </>
                  )}
                  {p.price > 0 && <span style={{ fontSize: 16, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>/mo</span>}
                </div>

                <p style={{
                  color: "rgba(255,255,255,0.38)",
                  fontSize: 13.5,
                  fontFamily: "'DM Sans',sans-serif",
                  marginBottom: 28
                }}>{p.desc}</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                  {p.features.map((f, j) => (
                    <div key={j} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: "rgba(255,255,255,0.7)",
                      fontSize: 14,
                      fontFamily: "'DM Sans',sans-serif"
                    }}>
                      <span style={{ color: p.c, fontSize: 16 }}>✓</span>{f}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate(p.path)}
                  style={{
                    width: "100%",
                    padding: "13px 0",
                    borderRadius: 13,
                    cursor: "pointer",
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    letterSpacing: ".04em",
                    transition: "all .3s",
                    background: p.hot ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "transparent",
                    border: p.hot ? "none" : "1px solid rgba(255,255,255,0.18)",
                    color: p.hot ? "#fff" : "rgba(255,255,255,0.8)",
                    boxShadow: p.hot ? "0 6px 28px rgba(99,102,241,0.4)" : "none"
                  }}
                  onMouseEnter={e => {
                    if (!p.hot) {
                      e.currentTarget.style.borderColor = "rgba(129,140,248,0.5)";
                      e.currentTarget.style.color = "#a78bfa";
                    } else {
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!p.hot) {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                    } else {
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {p.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   TESTIMONIALS CAROUSEL
═══════════════════════════════════════════════════ */
const REVIEWS = [
  { name: "Priya Sharma", role: "Frontend Dev @ Google", av: "PS", text: "EduNova's React course got me interview-ready in 6 weeks. The live progress bar kept me accountable every day. Worth every rupee.", stars: 5, c: "#6366f1" },
  { name: "James Okafor", role: "ML Engineer @ Stripe", av: "JO", text: "The AI course is world-class. Concepts I'd struggled with for years suddenly clicked. The certificate helped land my dream role.", stars: 5, c: "#8b5cf6" },
  { name: "Linh Nguyen", role: "UX Designer @ Figma", av: "LN", text: "Emily's design course is the best UI/UX content I've found anywhere online. Practical, current, and beautifully structured.", stars: 5, c: "#a78bfa" },
  { name: "Arjun Mehta", role: "Backend Dev @ Amazon", av: "AM", text: "Went from zero Node.js knowledge to building production APIs in 8 weeks. The certificate opened doors I didn't expect.", stars: 5, c: "#6366f1" },
  { name: "Sofia Rossi", role: "Product Manager @ Notion", av: "SR", text: "The PM course changed how I think about building products. Dense with insight, none of the fluff you find elsewhere.", stars: 5, c: "#8b5cf6" },
];

function Testimonials() {
  const [ref, iv] = useInView(0.05);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 2) % REVIEWS.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={{ position: "relative", zIndex: 1, padding: "100px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={ref} style={{
          textAlign: "center",
          marginBottom: 60,
          opacity: iv ? 1 : 0,
          transform: iv ? "translateY(0)" : "translateY(30px)",
          transition: "opacity .8s,transform .8s"
        }}>
          <Chip>Student Stories</Chip>
          <h2 style={{
            fontFamily: "'Syne',sans-serif",
            fontWeight: 900,
            fontSize: "clamp(34px,4.5vw,58px)",
            color: "#fff",
            letterSpacing: "-.03em",
            marginTop: 16
          }}>
            Loved by <GradText>10,000+ Learners</GradText>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {REVIEWS.slice(0, 3).map((t, i) => {
            const [tr, tiv] = useInView(0.1);
            return (
              <div
                key={i}
                ref={tr}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 20,
                  padding: "28px",
                  opacity: tiv ? 1 : 0,
                  transform: tiv ? "translateY(0)" : "translateY(40px)",
                  transition: `opacity .7s ease ${i * 0.1}s,transform .7s cubic-bezier(.22,1,.36,1) ${i * 0.1}s`,
                  backdropFilter: "blur(10px)"
                }}
              >
                <div style={{ display: "flex", gap: 3, marginBottom: 18 }}>
                  {"★★★★★".split("").map((s, j) => <span key={j} style={{ color: "#fbbf24", fontSize: 16 }}>{s}</span>)}
                </div>
                <p style={{
                  color: "rgba(255,255,255,0.65)",
                  fontSize: 15,
                  lineHeight: 1.82,
                  fontFamily: "'DM Sans',sans-serif",
                  fontStyle: "italic",
                  marginBottom: 26
                }}>
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg,${t.c},${t.c}88)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 800,
                    color: "#fff",
                    fontSize: 13
                  }}>{t.av}</div>
                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#fff", fontSize: 14 }}>{t.name}</div>
                    <div style={{ color: "rgba(255,255,255,0.32)", fontSize: 12, marginTop: 1 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   CTA BANNER – clickable buttons
═══════════════════════════════════════════════════ */
function CTABanner() {
  const navigate = useNavigate();
  const [ref, iv] = useInView(0.1);

  return (
    <section style={{ position: "relative", zIndex: 1, padding: "80px 40px" }}>
      <div ref={ref} style={{
        maxWidth: 960,
        margin: "0 auto",
        textAlign: "center",
        background: "linear-gradient(135deg,rgba(99,102,241,0.14),rgba(139,92,246,0.12))",
        border: "1px solid rgba(99,102,241,0.28)",
        borderRadius: 28,
        padding: "88px 48px",
        backdropFilter: "blur(20px)",
        position: "relative",
        overflow: "hidden",
        opacity: iv ? 1 : 0,
        transform: iv ? "translateY(0) scale(1)" : "translateY(40px) scale(.97)",
        transition: "opacity .9s ease,transform .9s cubic-bezier(.22,1,.36,1)",
        boxShadow: "0 40px 100px rgba(99,102,241,0.12)"
      }}>
        <div style={{
          position: "absolute",
          top: "-40%",
          left: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(99,102,241,0.18),transparent 70%)",
          pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute",
          bottom: "-40%",
          right: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(139,92,246,0.15),transparent 70%)",
          pointerEvents: "none"
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{
            fontFamily: "'Syne',sans-serif",
            fontWeight: 900,
            fontSize: "clamp(36px,5vw,66px)",
            color: "#fff",
            letterSpacing: "-.035em",
            marginBottom: 18,
            lineHeight: 1
          }}>
            Start Learning<br/><GradText>Today. Free.</GradText>
          </h2>

          <p style={{
            color: "rgba(255,255,255,0.42)",
            fontSize: 17,
            maxWidth: 460,
            margin: "0 auto 44px",
            fontFamily: "'DM Sans',sans-serif",
            lineHeight: 1.85
          }}>
            Join 10,000+ learners building real careers with EduNova. No risk — your first 3 courses are completely free.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/register")}
              style={{
                padding: "16px 44px",
                borderRadius: 14,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                border: "none",
                color: "#fff",
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: 17,
                cursor: "pointer",
                boxShadow: "0 8px 40px rgba(99,102,241,0.5)",
                transition: "all .3s"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              Get Started Free →
            </button>

            <button
              onClick={() => navigate("/courses")}
              style={{
                padding: "16px 44px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: 17,
                cursor: "pointer",
                transition: "all .3s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.11)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
            >
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   FOOTER – links clickable
═══════════════════════════════════════════════════ */
function Footer() {
  const navigate = useNavigate();

  return (
    <footer style={{
      position: "relative",
      zIndex: 1,
      borderTop: "1px solid rgba(99,102,241,0.12)",
      background: "rgba(4,3,20,0.7)",
      backdropFilter: "blur(20px)",
      padding: "72px 40px 36px"
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "2.2fr 1fr 1fr 1fr",
          gap: 52,
          marginBottom: 64
        }}>
          {/* Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
                cursor: "pointer"
              }}
              onClick={() => navigate("/")}
            >
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 900,
                color: "#fff",
                fontFamily: "'Syne',sans-serif",
                boxShadow: "0 4px 20px rgba(99,102,241,0.4)"
              }}>E</div>
              <span style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 800,
                fontSize: 20,
                color: "#fff",
                letterSpacing: "-.02em"
              }}>
                Edu<span style={{ color: "#818cf8" }}>Nova</span>
              </span>
            </div>

            <p style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 14,
              lineHeight: 1.85,
              fontFamily: "'DM Sans',sans-serif",
              maxWidth: 280,
              marginBottom: 28
            }}>
              The next-generation learning platform powered by AI. Build real skills, earn real certificates, land real jobs.
            </p>

            <div style={{ display: "flex", gap: 10 }}>
              {[{ l: "𝕏", u: "#" }, { l: "in", u: "#" }, { l: "gh", u: "#" }, { l: "▶", u: "#" }].map((s, i) => (
                <a
                  key={i}
                  href={s.u}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 700,
                    textDecoration: "none",
                    transition: "all .25s"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(99,102,241,0.18)";
                    e.currentTarget.style.color = "#a78bfa";
                    e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                  }}
                >
                  {s.l}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            { t: "Platform", links: ["Browse Courses", "My Dashboard", "Progress Tracker", "Certificates", "Mobile App"] },
            { t: "Company", links: ["About EduNova", "Our Faculty", "Blog", "Careers", "Press Kit"] },
            { t: "Support", links: ["Help Center", "Contact Us", "Privacy Policy", "Terms of Service", "Accessibility"] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 800,
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                marginBottom: 22
              }}>{col.t}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                {col.links.map((l, j) => (
                  <button
                    key={j}
                    onClick={() => navigate(`/${l.toLowerCase().replace(/\s+/g, '-')}`)}
                    style={{
                      color: "rgba(255,255,255,0.33)",
                      fontSize: 14,
                      textDecoration: "none",
                      fontFamily: "'DM Sans',sans-serif",
                      transition: "color .2s",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                    onMouseEnter={e => e.target.style.color = "#a78bfa"}
                    onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.33)"}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          paddingTop: 28,
          borderTop: "1px solid rgba(255,255,255,0.05)"
        }}>
          <p style={{ color: "rgba(255,255,255,0.18)", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>
            © {new Date().getFullYear()} EduNova LMS. All rights reserved. Built with ♥ for learners worldwide.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", animation: "pulse 2s infinite" }} />
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, fontFamily: "'Syne',sans-serif", letterSpacing: ".1em" }}>
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════
   SHARED MICRO-COMPONENTS
═══════════════════════════════════════════════════ */
function Chip({ children }) {
  return (
    <div style={{
      display: "inline-block",
      padding: "5px 16px",
      borderRadius: 100,
      background: "rgba(99,102,241,0.1)",
      border: "1px solid rgba(99,102,241,0.24)",
      color: "#a78bfa",
      fontSize: 11,
      fontFamily: "'Syne',sans-serif",
      fontWeight: 700,
      letterSpacing: ".1em",
      textTransform: "uppercase"
    }}>
      {children}
    </div>
  );
}

function GradText({ children }) {
  return (
    <span style={{
      background: "linear-gradient(120deg,#818cf8 0%,#c4b5fd 50%,#e879f9 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text"
    }}>
      {children}
    </span>
  );
}

function GlowDivider() {
  return (
    <div style={{
      width: "100%",
      height: 1,
      background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.45),rgba(139,92,246,0.45),transparent)"
    }} />
  );
}

/* ═══════════════════════════════════════════════════
   ROOT – everything now clickable
═══════════════════════════════════════════════════ */
export default function Landing() {
  return (
    <div style={{ background: "#04031a", minHeight: "100vh", overflowX: "hidden" }}>
      <ParticleCanvas />
      {/* Ambient mesh blobs */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: 750, height: 750, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.11) 0%,transparent 70%)", animation: "blob1 20s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: "25%", right: "-15%", width: 650, height: 650, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.09) 0%,transparent 70%)", animation: "blob2 25s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "-15%", left: "35%", width: 900, height: 550, borderRadius: "50%", background: "radial-gradient(circle,rgba(79,70,229,0.07) 0%,transparent 70%)", animation: "blob3 30s ease-in-out infinite" }} />
      </div>
      {/* Grain */}
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.028,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`
      }} />
      <Cursor />
      <Navbar />
      <Hero />
      <Marquee />
      <BentoFeatures />
      <Stats />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <CTABanner />
      <Footer />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800;900&family=DM+Sans:ital,wght@0,400;0,500;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#04031a;cursor:none;}
        html{scroll-behavior:smooth;}
        ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:#04031a;} ::-webkit-scrollbar-thumb{background:rgba(99,102,241,.4);border-radius:3px;}
        @keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 10px currentColor;}50%{opacity:.3;box-shadow:none;}}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
        @keyframes marquee{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
        @keyframes orbFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-18px);}}
        @keyframes orbRing{0%{transform:rotateX(75deg) rotateZ(0deg);}100%{transform:rotateX(75deg) rotateZ(360deg);}}
        @keyframes badgeFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
        @keyframes fadeFloat{0%,100%{opacity:.3;transform:translateY(0);}50%{opacity:.7;transform:translateY(-8px);}}
        @keyframes blob1{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(5%,8%) scale(1.08);}66%{transform:translate(-5%,3%) scale(.95);}}
        @keyframes blob2{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(-6%,-5%) scale(1.1);}66%{transform:translate(4%,9%) scale(.92);}}
        @keyframes blob3{0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(5%,-6%) scale(1.12);}}
        .animate-pulse-slow{animation:pulse 8s infinite;}
      `}</style>
    </div>
  );
}