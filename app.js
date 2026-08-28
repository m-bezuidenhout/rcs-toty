/* ============================================================
   RCS TOTY 2026 — app.js
   Framer-style motion: staggered entrance, scroll reveals,
   marquees, counters, accordions, ambient canvas glow.
   ============================================================ */

/* ---------- EDIT HERE: team members (initials auto-generated) ---------- */
const TEAM = [
  { name:"Team Member One",   role:"Lead / Frontend Architecture", bio:"Owns the Angular workspace, the shared component library and the front-end architecture decisions.", tags:["Angular","Architecture","DevOps"] },
  { name:"Team Member Two",   role:"Backend Engineer",             bio:"Builds and maintains the .NET services behind the gateway, and the data model they sit on.",        tags:[".NET","APIs","PostgreSQL"] },
  { name:"Team Member Three", role:"Full-Stack Engineer",          bio:"Takes modules end to end — screen, service and migration — from first spec to production.",        tags:["Angular",".NET","Delivery"] },
  { name:"Team Member Four",  role:"DevOps / Platform",            bio:"Runs the pipelines, environments and release automation that get every change out safely.",        tags:["Azure","Octopus","Actions"] },
  { name:"Team Member Five",  role:"QA / Business Analysis",       bio:"Turns how the business actually works into specs the team can build, and checks that it holds.",    tags:["Testing","Process","UAT"] },
  { name:"Team Member Six",   role:"Product / Delivery",           bio:"Keeps priorities honest, the roadmap current and the people who use RCS in the conversation.",      tags:["Roadmap","Stakeholders"] }
];

/* departments shown in the marquee strip */
const DEPTS = ["Projects","Commercial","Finance","Document Control","Site Teams","Procurement","Directors","Admin"];

/* capability pills */
const PILLS_A = ["Progress claims","Variation orders","Timesheets","Retention tracking","Cost to complete","Transmittals","Rate schedules","Purchase orders"];
const PILLS_B = ["Document revisions","Client invoicing","Cost codes","Master data","Role permissions","Audit trail","Live dashboards","Month-end run"];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
const initials = n => n.trim().split(/\s+/).slice(0,2).map(w => w[0]).join("").toUpperCase();

/* ---------- render team ---------- */
document.getElementById("teamGrid").innerHTML = TEAM.map((m,i) => `
  <article class="mem ticks" data-reveal style="transition-delay:${i * 70}ms">
    <div class="mono-i" aria-hidden="true">${esc(initials(m.name))}</div>
    <div>
      <div class="nm">${esc(m.name)}</div>
      <div class="rl">${esc(m.role)}</div>
    </div>
    <p class="bio">${esc(m.bio)}</p>
    <div class="tg">${(m.tags||[]).map(t => `<span>${esc(t)}</span>`).join("")}</div>
  </article>`).join("");

/* ---------- marquees (duplicated track = seamless loop) ---------- */
const mk = document.getElementById("markTrack");
mk.innerHTML = [...DEPTS, ...DEPTS].map(d =>
  `<span class="wordmark"><b>RCS</b>${esc(d)}</span>`).join("");

document.querySelectorAll("[data-pills]").forEach(track => {
  const src = track.dataset.pills === "a" ? PILLS_A : PILLS_B;
  track.innerHTML = [...src, ...src].map(p => `<span class="pill-lite">${esc(p)}</span>`).join("");
});

/* ---------- scroll reveals ---------- */
const revealTargets = () => document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window && !reduceMotion) {
  document.documentElement.classList.add("js-anim");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0 });
  revealTargets().forEach(t => io.observe(t));
  setTimeout(() => revealTargets().forEach(t => t.classList.add("in")), 3000); // safety
} else {
  revealTargets().forEach(t => t.classList.add("in"));
}

/* ---------- hero entrance (staggered, Framer-style) ---------- */
(function heroIn(){
  const lines = document.querySelectorAll("#heroTitle .ln > span");
  const rest  = document.querySelectorAll("[data-hero]");
  if (reduceMotion) return;
  [...lines].forEach(el => { el.style.transform = "translateY(105%)"; el.style.opacity = "0"; });
  [...rest].forEach(el => { el.style.transform = "translateY(20px)"; el.style.opacity = "0"; });
  requestAnimationFrame(() => {
    [...lines].forEach((el,i) => {
      el.style.transition = "transform 1s cubic-bezier(.16,1,.3,1), opacity .8s cubic-bezier(.16,1,.3,1)";
      el.style.transitionDelay = (0.08 + i * 0.09) + "s";
      el.style.transform = "none"; el.style.opacity = "1";
    });
    [...rest].forEach(el => {
      const step = Number(el.dataset.hero);
      el.style.transition = "transform .9s cubic-bezier(.16,1,.3,1), opacity .9s cubic-bezier(.16,1,.3,1)";
      el.style.transitionDelay = (0.34 + step * 0.1) + "s";
      el.style.transform = "none"; el.style.opacity = "1";
    });
  });
})();

/* ---------- typewriter ---------- */
function typewriter(el, text, { start = 600, speed = 32, hold = 2600 } = {}) {
  if (!el) return;
  if (reduceMotion) { el.textContent = text; return; }
  let i = 0, dir = 1;
  const tick = () => {
    el.textContent = text.slice(0, i);
    i += dir;
    if (i > text.length) { dir = -1; i = text.length; return setTimeout(tick, hold); }
    if (i < 0) { dir = 1; i = 0; return setTimeout(tick, 700); }
    setTimeout(tick, dir > 0 ? speed : 16);
  };
  setTimeout(tick, start);
}
typewriter(document.getElementById("typed"),
  "Draft progress claim 14 for Contract 4127 from the latest measured quantities.", { start: 1400 });
typewriter(document.getElementById("typed2"),
  "Show me cost-to-complete across live projects", { start: 900, speed: 40 });

/* ---------- counters ---------- */
const fmt = n => n.toLocaleString("en-ZA");
function runCount(el){
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  if (reduceMotion) { el.textContent = fmt(target) + suffix; return; }
  const dur = 1500, t0 = performance.now();
  const ease = t => 1 - Math.pow(1 - t, 3);
  const step = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = fmt(Math.round(target * ease(p))) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
if ("IntersectionObserver" in window) {
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); } });
  }, { threshold: .4 });
  document.querySelectorAll("[data-count]").forEach(el => cio.observe(el));
} else {
  document.querySelectorAll("[data-count]").forEach(runCount);
}

/* ---------- solutions rail <-> panels ---------- */
const rail = document.getElementById("rail");
if (rail) {
  const buttons = [...rail.querySelectorAll("button")];
  buttons.forEach(b => b.addEventListener("click", () => {
    const target = document.getElementById(b.dataset.goto);
    if (target) target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  }));
  const pio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      buttons.forEach(b => b.classList.toggle("on", b.dataset.goto === e.target.id));
    });
  }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
  document.querySelectorAll(".panel").forEach(p => pio.observe(p));
}

/* ---------- cycling highlight in the projects mock ---------- */
(function cycle(){
  const items = document.querySelectorAll(".mock .cycle li");
  if (!items.length || reduceMotion) { items[0] && items[0].classList.add("hot"); return; }
  let i = 0;
  setInterval(() => {
    items.forEach((li,n) => li.classList.toggle("hot", n === i));
    i = (i + 1) % items.length;
  }, 1600);
})();

/* ---------- process steps (single-open accordion) ---------- */
document.querySelectorAll("#steps .step .head").forEach(head => {
  head.addEventListener("click", () => {
    const step = head.parentElement;
    const open = step.classList.contains("open");
    document.querySelectorAll("#steps .step").forEach(s => s.classList.remove("open"));
    if (!open) step.classList.add("open");
  });
});

/* ---------- faq accordion ---------- */
document.querySelectorAll("#faqList .q").forEach(q => {
  q.addEventListener("click", () => {
    const qa = q.parentElement;
    const open = qa.classList.contains("open");
    document.querySelectorAll("#faqList .qa").forEach(x => x.classList.remove("open"));
    if (!open) qa.classList.add("open");
  });
});

/* ---------- nav background on scroll ---------- */
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("stuck", window.scrollY > 24);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* ---------- mobile nav ---------- */
(function mobileNav(){
  const t = document.getElementById("navToggle");
  if (!t) return;
  t.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    t.setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll("#navDrawer a").forEach(a =>
    a.addEventListener("click", () => { nav.classList.remove("open"); t.setAttribute("aria-expanded","false"); }));
})();

/* ---------- CTA sparks ---------- */
(function sparks(){
  const host = document.getElementById("sparks");
  if (!host) return;
  const n = 26;
  let html = "";
  for (let i = 0; i < n; i++) {
    const x = Math.random() * 100, y = Math.random() * 100;
    const d = (Math.random() * 3.4).toFixed(2), s = (2.6 + Math.random() * 2.4).toFixed(2);
    html += `<i style="left:${x.toFixed(2)}%;top:${y.toFixed(2)}%;animation-delay:${d}s;animation-duration:${s}s"></i>`;
  }
  host.innerHTML = html;
})();

/* ---------- ambient hero glow (canvas) ---------- */
(function glow(){
  const cv = document.getElementById("glow");
  if (!cv) return;
  const ctx = cv.getContext("2d");
  let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), t = 0, raf = 0;

  const resize = () => {
    const r = cv.parentElement.getBoundingClientRect();
    w = Math.max(320, r.width); h = Math.max(320, r.height);
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  // stacked glowing slabs, mirrored on both edges
  const tower = (cx, dir, phase) => {
    const bars = 11;
    for (let i = 0; i < bars; i++) {
      const p = i / (bars - 1);
      const narrow = w < 780 ? 0.42 : 1;
      const bw = (86 + p * 74) * (w / 1600 + .6) * narrow;
      const bh = 15;
      const y = h * 0.95 - i * 31 + Math.sin(t / 1400 + i * 0.5 + phase) * 5;
      const x = cx + dir * (p * 26) - (dir < 0 ? bw : 0);
      const g = ctx.createLinearGradient(x, y, x + bw, y + bh);
      g.addColorStop(0, "rgba(255,255,255,0.10)");
      g.addColorStop(0.30, "rgba(255,139,127,0.98)");
      g.addColorStop(0.62, "rgba(240,68,56,0.92)");
      g.addColorStop(1, "rgba(120,20,14,0.18)");
      ctx.save();
      ctx.shadowColor = "rgba(240,68,56,0.75)";
      ctx.shadowBlur = 32;
      ctx.fillStyle = g;
      ctx.globalAlpha = (0.5 + 0.5 * (1 - p)) * (w < 780 ? 0.6 : 1);
      ctx.beginPath();
      const r = 3;
      ctx.roundRect ? ctx.roundRect(x, y, bw, bh, r) : ctx.rect(x, y, bw, bh);
      ctx.fill();
      ctx.restore();
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    // soft floor wash
    const wash = ctx.createRadialGradient(w / 2, h * 1.05, 0, w / 2, h * 1.05, h * 0.9);
    wash.addColorStop(0, "rgba(240,68,56,0.16)");
    wash.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, w, h);
    tower(w * 0.02, 1, 0);
    tower(w * 0.98, -1, 1.7);
    t += 16;
    raf = requestAnimationFrame(draw);
  };

  resize();
  if (reduceMotion) { draw(); cancelAnimationFrame(raf); }
  else raf = requestAnimationFrame(draw);
  window.addEventListener("resize", () => { resize(); }, { passive: true });
})();
