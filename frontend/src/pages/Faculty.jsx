import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // ← Added for navigation
import { motion } from "framer-motion"; // Optional: for smoother card animation (npm install framer-motion)

const TEACHERS = [
  {
    name: "DR.Shatrughan ",
    role: "PHD in True Love",
    image: "public/images/Amar.jpg",
    bio: "PhD in AI from MIT. Pioneered adaptive learning algorithms adopted by 3 Fortune 500 companies.",
    tag: "MBA, PhD",
    courses: 24,
    students: 4800,
    rating: 4.9,
    c1: "#00ffba",
    c2: "#0080ff",
    icon: "⬡",
  },
  {
    name: "Abella Danger",
    role: "Cuddle Expert & JS Wizard",
    image: "public/images/abella.jpg",
    bio: "Full-stack engineer turned educator. Built viral JS courses with 6k+ active learners worldwide.",
    tag: "Full Stack",
    courses: 18,
    students: 6200,
    rating: 4.8,
    c1: "#ff3cac",
    c2: "#ff9a3c",
    icon: "◈",
  },
  {
    name: "Jhony sin",
    role: "SEX Executive & Design Guru",
    image: "public/images/jhony.jpg",
    bio: "Figma Ambassador & award-winning designer. Products she shipped reach 50M+ daily active users.",
    tag: "Design",
    courses: 12,
    students: 3100,
    rating: 5.0,
    c1: "#c77dff",
    c2: "#ff6fcf",
    icon: "✦",
  },
  {
    name: "comatozz",
    role: "Trending sex Educator ",
    image: "public/images/comatozz.jpg",
    bio: "Core React contributor. Maintains 3 open-source packages clocking 500k+ weekly npm downloads.",
    tag: "Frontend",
    courses: 20,
    students: 5500,
    rating: 4.7,
    c1: "#ffd166",
    c2: "#ff6b35",
    icon: "⬢",
  },
  {
    name: "Drake",
    role: "Trending sex Educator ",
    image: "public/images/images.jpg",
    bio: "Core React contributor. Maintains 3 open-source packages clocking 500k+ weekly npm downloads.",
    tag: "Frontend",
    courses: 20,
    students: 5500,
    rating: 4.7,
    c1: "#ffd166",
    c2: "#ff6b35",
    icon: "⬢",
  },
];

/* ── CANVAS MESH GRADIENT ── */
function MeshCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const orbs = [
      { bx: 0.15, by: 0.2, r: 420, col: "0,220,130", sp: 0.00065, ph: 0 },
      { bx: 0.82, by: 0.15, r: 460, col: "90,0,210", sp: 0.00085, ph: 1.6 },
      { bx: 0.48, by: 0.72, r: 510, col: "0,110,255", sp: 0.00055, ph: 3.1 },
      { bx: 0.08, by: 0.82, r: 370, col: "210,0,185", sp: 0.0010, ph: 0.9 },
      { bx: 0.92, by: 0.78, r: 430, col: "255,165,0", sp: 0.00075, ph: 2.3 },
      { bx: 0.5, by: 0.5, r: 550, col: "0,180,255", sp: 0.00035, ph: 4.5 },
    ];

    let raf;
    const draw = (t) => {
      const W = canvas.width,
        H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#03030f";
      ctx.fillRect(0, 0, W, H);
      orbs.forEach((o) => {
        const cx = (o.bx + Math.sin(t * o.sp + o.ph) * 0.13) * W;
        const cy = (o.by + Math.cos(t * o.sp * 0.7 + o.ph) * 0.11) * H;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, o.r);
        g.addColorStop(0, `rgba(${o.col},.17)`);
        g.addColorStop(0.55, `rgba(${o.col},.06)`);
        g.addColorStop(1, `rgba(${o.col},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

/* ── FLOATING ORBS ── */
function FloatOrbs() {
  const orbs = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      sz: 2 + Math.random() * 5,
      sp: 0.012 + Math.random() * 0.022,
      ph: Math.random() * Math.PI * 2,
      op: 0.25 + Math.random() * 0.5,
      col: ["#00ffba", "#8040ff", "#ff3cac", "#ffd166", "#0ea5e9"][i % 5],
    }))
  );
  const [tk, setTk] = useState(0);

  useEffect(() => {
    let r;
    const loop = () => {
      setTk((t) => t + 1);
      r = requestAnimationFrame(loop);
    };
    r = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(r);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
      {orbs.current.map((o, i) => {
        const t = tk * o.sp * 0.055;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${o.x + Math.sin(t + o.ph) * 9}%`,
              top: `${o.y + Math.cos(t * 0.7 + o.ph) * 7}%`,
              width: o.sz,
              height: o.sz,
              borderRadius: "50%",
              background: o.col,
              opacity: o.op,
              boxShadow: `0 0 ${o.sz * 4}px ${o.col}`,
              transform: "translate(-50%,-50%)",
            }}
          />
        );
      })}
    </div>
  );
}

/* ── HOOKS ── */
function useMouse() {
  const [p, setP] = useState({ x: -9999, y: -9999 });
  useEffect(() => {
    const h = (e) => setP({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return p;
}

function useInView(thresh = 0.1) {
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

/* ── ANIMATED COUNTER ── */
function Counter({ to, suf = "" }) {
  const [val, setVal] = useState(0);
  const [ref, iv] = useInView(0.3);

  useEffect(() => {
    if (!iv) return;
    let n = 0;
    const step = to / 40;
    const id = setInterval(() => {
      n += step;
      if (n >= to) {
        setVal(to);
        clearInterval(id);
      } else setVal(Math.floor(n));
    }, 28);
    return () => clearInterval(id);
  }, [iv, to]);

  return <span ref={ref}>{val}{suf}</span>;
}

/* ── CLICKABLE TEACHER CARD ── */
function Card({ t, idx }) {
  const navigate = useNavigate();
  const [hov, setHov] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  const cardRef = useRef(null);
  const [ref, inView] = useInView();

  const grad = `linear-gradient(135deg,${t.c1},${t.c2})`;

  const onMove = useCallback((e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    setTilt({
      x: ((y - r.height / 2) / r.height) * -13,
      y: ((x - r.width / 2) / r.width) * 13,
    });
    setSpot({ x: (x / r.width) * 100, y: (y / r.height) * 100 });
  }, []);

  const handleClick = () => {
    // Navigate to teacher profile/detail page
    navigate(`/faculty/${t.name.toLowerCase().replace(/\s+/g, '-')}`);
    // Or you can open modal, show alert, etc.
    // alert(`Opening profile of ${t.name}`);
  };

  return (
    <div
      ref={(el) => {
        ref.current = el;
        cardRef.current = el;
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => {
        setHov(false);
        setTilt({ x: 0, y: 0 });
      }}
      onMouseMove={onMove}
      onClick={handleClick} // ← Whole card is now clickable!
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(72px)",
        transition: `opacity .9s ease ${idx * 0.13}s, transform .9s cubic-bezier(.22,1,.36,1) ${idx * 0.13}s`,
        cursor: "pointer", // ← Visual feedback
      }}
    >
      <div
        style={{
          transform: hov
            ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-16px) scale(1.025)`
            : "perspective(900px) rotateX(0) rotateY(0) translateY(0) scale(1)",
          transition: hov
            ? "transform .07s linear, box-shadow .3s, border-color .3s"
            : "transform .65s cubic-bezier(.22,1,.36,1), box-shadow .5s, border-color .5s",
          borderRadius: 22,
          overflow: "hidden",
          position: "relative",
          willChange: "transform",
          background: "rgba(5,3,20,.8)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          border: `1px solid ${hov ? t.c1 + "55" : "rgba(255,255,255,.07)"}`,
          boxShadow: hov
            ? `0 55px 110px rgba(0,0,0,.75), 0 0 90px ${t.c1}28, inset 0 1px 0 rgba(255,255,255,.09)`
            : "0 10px 50px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.04)",
        }}
      >
        {/* Spotlight */}
        {hov && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              pointerEvents: "none",
              background: `radial-gradient(circle at ${spot.x}% ${spot.y}%,${t.c1}16 0%,transparent 56%)`,
            }}
          />
        )}

        {/* Top sweep bar */}
        <div
          style={{
            height: 3,
            background: grad,
            transform: `scaleX(${hov ? 1 : 0.28})`,
            transformOrigin: "left",
            transition: "transform .55s cubic-bezier(.22,1,.36,1)",
          }}
        />

        {/* Image */}
        <div style={{ position: "relative", height: 258, overflow: "hidden" }}>
          <img
            src={t.image}
            alt={t.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: hov ? "scale(1.1)" : "scale(1.01)",
              transition: "transform .75s cubic-bezier(.22,1,.36,1)",
              filter: "saturate(.65) brightness(.72)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom,transparent 25%,rgba(5,3,20,1) 100%)",
            }}
          />

          {/* Icon badge */}
          <div
            style={{
              position: "absolute",
              top: 14,
              left: 14,
              width: 48,
              height: 48,
              borderRadius: 15,
              background: "rgba(0,0,0,.65)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              color: t.c1,
              textShadow: `0 0 14px ${t.c1}`,
              transform: hov ? "scale(1.2) rotate(14deg)" : "scale(1) rotate(0deg)",
              transition: "transform .42s cubic-bezier(.22,1,.36,1)",
            }}
          >
            {t.icon}
          </div>

          {/* Tag */}
          <div
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              padding: "4px 14px",
              borderRadius: 100,
              background: `${t.c1}18`,
              border: `1px solid ${t.c1}45`,
              color: t.c1,
              fontSize: 10,
              fontFamily: "'IBM Plex Mono',monospace",
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
            }}
          >
            {t.tag}
          </div>

          {/* Name & Role */}
          <div style={{ position: "absolute", bottom: 14, left: 18, right: 18 }}>
            <h3
              style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: 25,
                fontWeight: 800,
                color: "#fff",
                lineHeight: 1.1,
                letterSpacing: "-.02em",
                margin: "0 0 5px",
                textShadow: "0 2px 22px rgba(0,0,0,.95)",
              }}
            >
              {t.name}
            </h3>
            <div
              style={{
                fontSize: 11,
                fontFamily: "'IBM Plex Mono',monospace",
                fontWeight: 600,
                letterSpacing: ".04em",
                background: grad,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t.role}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 20px 22px" }}>
          <p
            style={{
              color: "rgba(255,255,255,.44)",
              fontSize: 13.5,
              lineHeight: 1.85,
              marginBottom: 18,
              fontFamily: "'Lora',Georgia,serif",
              fontStyle: "italic",
            }}
          >
            {t.bio}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9 }}>
            {[
              { l: "Courses", v: t.courses },
              { l: "Students", v: `${(t.students / 1000).toFixed(1)}k` },
              { l: "Rating", v: `★ ${t.rating}` },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(255,255,255,.07)",
                  borderRadius: 13,
                  padding: "10px 4px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    fontFamily: "'IBM Plex Mono',monospace",
                    background: grad,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {s.v}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    marginTop: 3,
                    color: "rgba(255,255,255,.27)",
                    textTransform: "uppercase",
                    letterSpacing: ".08em",
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>

          {/* Clickable button inside card */}
          <div
            style={{
              maxHeight: hov ? 60 : 0,
              overflow: "hidden",
              marginTop: hov ? 15 : 0,
              transition: "max-height .45s cubic-bezier(.22,1,.36,1), margin-top .4s ease",
            }}
          >
            <button
              onClick={() => navigate(`/faculty/${t.name.toLowerCase().replace(/\s+/g, '-')}`)}
              style={{
                width: "100%",
                padding: "13px 0",
                borderRadius: 13,
                background: grad,
                border: "none",
                color: "#000",
                fontFamily: "'IBM Plex Mono',monospace",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: `0 8px 32px ${t.c1}40`,
              }}
            >
              View Full Profile →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN FACULTY PAGE ── */
export default function Faculty() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#03030f", overflow: "hidden", position: "relative" }}>
      <MeshCanvas />
      <FloatOrbs />

      {/* Grain texture */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          opacity: 0.042,
          mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23f)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Dot grid */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          backgroundImage: "radial-gradient(rgba(255,255,255,.08) 1px,transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse 85% 85% at 50% 50%,black 40%,transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 85% at 50% 50%,black 40%,transparent 100%)",
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 3,
          pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 80% at 50% 50%,transparent 45%,rgba(3,3,15,.9) 100%)",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 5, padding: "96px 24px 120px" }}>
        {/* Header */}
        <header
          style={{
            textAlign: "center",
            marginBottom: 88,
          }}
        >
          {/* Live badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "7px 22px",
              borderRadius: 100,
              marginBottom: 34,
              background: "rgba(0,255,186,.055)",
              border: "1px solid rgba(0,255,186,.2)",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#00ffba",
                boxShadow: "0 0 14px #00ffba",
                display: "inline-block",
                animation: "blink 2s ease infinite",
              }}
            />
            <span
              style={{
                color: "#00ffba",
                fontSize: 11,
                fontFamily: "'IBM Plex Mono',monospace",
                fontWeight: 700,
                letterSpacing: ".14em",
                textTransform: "uppercase",
              }}
            >
              World-Class Instructors
            </span>
          </div>

          {/* Giant title */}
          <div
            style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontWeight: 900,
              lineHeight: 0.9,
              fontSize: "clamp(60px,10.5vw,124px)",
              letterSpacing: "-.04em",
              marginBottom: 30,
            }}
          >
            <div style={{ color: "#fff", marginBottom: 4 }}>Meet Our</div>
            <div
              style={{
                background: "linear-gradient(105deg,#00ffba 0%,#8040ff 38%,#ff3cac 68%,#ffd166 100%)",
                backgroundSize: "200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradMove 5s ease infinite",
              }}
            >
              Faculty
            </div>
          </div>

          <p
            style={{
              color: "rgba(255,255,255,.36)",
              fontSize: 15,
              maxWidth: 510,
              margin: "0 auto 52px",
              lineHeight: 1.95,
              fontFamily: "'Lora',Georgia,serif",
              fontStyle: "italic",
            }}
          >
            Industry veterans who've built real products, led real teams — and are now here to pass everything they know on to you.
          </p>

          {/* Stats bar */}
          <div
            style={{
              display: "inline-grid",
              gridTemplateColumns: "repeat(4,auto)",
              background: "rgba(255,255,255,.035)",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 18,
              overflow: "hidden",
            }}
          >
            {[
              { label: "Experts", to: 4, suf: "" },
              { label: "Courses", to: 74, suf: "+" },
              { label: "Students", to: 19, suf: ".6k" },
              { label: "Avg Rating", to: 4, suf: ".85★" },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "16px 28px",
                  borderRight: i < 3 ? "1px solid rgba(255,255,255,.07)" : "none",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 900,
                    fontFamily: "'IBM Plex Mono',monospace",
                    color: "#fff",
                    letterSpacing: "-.03em",
                  }}
                >
                  <Counter to={s.to} suf={s.suf} />
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "rgba(255,255,255,.27)",
                    textTransform: "uppercase",
                    letterSpacing: ".1em",
                    marginTop: 3,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* Cards Grid – now clickable */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(272px, 1fr))",
            gap: 24,
            maxWidth: 1240,
            margin: "0 auto",
          }}
        >
          {TEACHERS.map((t, i) => (
            <Card key={i} t={t} idx={i} />
          ))}
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 74,
            color: "rgba(255,255,255,.12)",
            fontSize: 11,
            fontFamily: "'IBM Plex Mono',monospace",
            letterSpacing: ".15em",
            textTransform: "uppercase",
          }}
        >
          ✦   Shaping tomorrow's digital leaders — one class at a time   ✦
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Lora:ital@1&family=IBM+Plex+Mono:wght@600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#03030f;cursor:none;}
        @keyframes blink{0%,100%{opacity:1;box-shadow:0 0 14px #00ffba;}50%{opacity:.3;box-shadow:0 0 3px #00ffba;}}
        @keyframes gradMove{0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}
      `}</style>
    </div>
  );
}