/* ============================================================
   app.js — team data + scroll reveal
   RCS TOTY 2026 — COMPRSA / Alpha Advisors
   ============================================================ */

/* ============================================================
   EDIT HERE — team members. Initials are generated from name.
   ============================================================ */
const TEAM = [
  { name:"Team Member One",   role:"Lead / Frontend Architecture", bio:"Owns the Angular workspace, the shared component library and the front-end architecture decisions.", tags:["Angular","Architecture","DevOps"] },
  { name:"Team Member Two",   role:"Backend Engineer",             bio:"Builds and maintains the .NET services behind the gateway, and the data model they sit on.",        tags:[".NET","APIs","PostgreSQL"] },
  { name:"Team Member Three", role:"Full-Stack Engineer",          bio:"Takes modules end to end — screen, service and migration — from first spec to production.",        tags:["Angular",".NET","Delivery"] },
  { name:"Team Member Four",  role:"DevOps / Platform",            bio:"Runs the pipelines, environments and release automation that get every change out safely.",        tags:["Azure","Octopus","Actions"] },
  { name:"Team Member Five",  role:"QA / Business Analysis",       bio:"Turns how the business actually works into specs the team can build, and checks that it holds.",    tags:["Testing","Process","UAT"] },
  { name:"Team Member Six",   role:"Product / Delivery",           bio:"Keeps priorities honest, the roadmap current and the people who use RCS in the conversation.",      tags:["Roadmap","Stakeholders"] }
];

const initials = n => n.trim().split(/\s+/).slice(0,2).map(w => w[0]).join("").toUpperCase();
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

document.getElementById("team-grid").innerHTML = TEAM.map(m => `
  <article class="member">
    <div class="avatar" aria-hidden="true">${esc(initials(m.name))}</div>
    <div>
      <div class="nm">${esc(m.name)}</div>
      <div class="rl">${esc(m.role)}</div>
    </div>
    <p class="bio">${esc(m.bio)}</p>
    <div class="tags">${(m.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>
  </article>`).join("");

/* scroll reveal — only hides content once we know we can reveal it again */
const targets = document.querySelectorAll(".rise");
const revealAll = () => targets.forEach(t => t.classList.add("in"));
if (window.IntersectionObserver && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("js-anim");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0 });
  targets.forEach(t => io.observe(t));
  setTimeout(revealAll, 2500);
} else {
  revealAll();
}
