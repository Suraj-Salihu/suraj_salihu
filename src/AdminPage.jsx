import { useState, useRef } from "react";

/* ─── default data mirrors your data.js ───────────────────────────────── */
const DEFAULT_PROJECTS = [
  { id: 1, title: "JK Clothing - WhatsApp Commerce", description: "Lightweight e-commerce site for fashion products with 1-click WhatsApp ordering.", tech: "HTML5, CSS3, JavaScript, WhatsApp API", features: ["WhatsApp order automation", "LocalStorage cart persistence", "Mobile-first responsive design", "No backend required"], demoLink: "https://jk-fashion.netlify.app/", codeLink: "https://github.com/Suraj-Salihu/e-commerce-website-jk-closet/tree/main", image: "/images/jk-fashion.jpg", status: "", backend: "" },
  { id: 2, title: "Sovex Task Master", description: "Progressive Web App for task management with offline capabilities and priority-based sorting.", tech: "HTML5, CSS3, JavaScript, PWA", features: ["Installable PWA with service worker", "Priority-based task organization", "Offline functionality"], demoLink: "https://suraj-salihu.github.io/Task-Manager-PWA/", codeLink: "https://github.com/Suraj-Salihu/Task-Manager-PWA/tree/main", image: "/images/task-Master.png", status: "", backend: "" },
  { id: 3, title: "BL4MELESS Artist Portfolio", description: "Professional music artist website showcasing discography, streaming links, and gallery.", tech: "HTML5, CSS3, JavaScript", features: ["Interactive music player", "Multi-platform streaming links", "Responsive gallery"], demoLink: "https://bl4meless.netlify.app", codeLink: "https://github.com/Suraj-Salihu/singer-website/blob/main/index.html", image: "/images/bl4meless-screenshot.jpg", status: "", backend: "" },
  { id: 4, title: "The Movement (Tafiyar Matasa)", description: "Official website for a Nigerian youth empowerment movement.", tech: "HTML5, CSS3, JavaScript, EmailJS", features: [], demoLink: "#", codeLink: "#", image: "/images/TMLogo.png", status: "", backend: "" },
  { id: 5, title: "VTU Website", description: "Mobile-first virtual top-up platform for airtime, data, and bill payments.", tech: "HTML5, CSS3, JavaScript, FontAwesome", features: [], demoLink: "#", codeLink: "#", image: "/images/vtu-screenshot.jpg", status: "", backend: "" },
  { id: 6, title: "API Service", description: "High-performance REST API for mobile applications with caching and rate limiting.", tech: "Node.js, Redis, MongoDB, Docker", features: [], demoLink: "#", codeLink: "#", image: "/images/carbon.png", status: "in-progress", backend: "JWT authentication, Redis caching, comprehensive API docs" },
];

const DESIGN_CATEGORIES = ["birthday", "advert", "song", "invitation", "logo", "other"];
const CATEGORY_LABELS = { birthday: "Birthday Designs", advert: "Advert Designs", song: "Song Covers", invitation: "Invitation Designs", logo: "Logo Designs", other: "Other Designs" };
const CATEGORY_PATHS = { birthday: "birthday", advert: "advert", song: "song", invitation: "iv", logo: "logos", other: "other" };

const DEFAULT_DESIGNS = Object.fromEntries(
  DESIGN_CATEGORIES.map((cat) => [
    cat,
    Array.from({ length: 6 }, (_, i) => ({
      src: `/images/designs/${CATEGORY_PATHS[cat]}/${cat}${i + 1}.jpg`,
      caption: `${CATEGORY_LABELS[cat]} ${i + 1}`,
    }))
  ])
);

const ADMIN_PASSWORD = "sooraj2025"; // ← Change this to your own password

function loadData(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; }
}
function saveData(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

/* ════════════ ROOT ════════════ */
export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin_auth") === "yes");
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [shake, setShake] = useState(false);

  const login = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { sessionStorage.setItem("admin_auth", "yes"); setAuthed(true); }
    else { setPwErr(true); setShake(true); setTimeout(() => setShake(false), 500); }
  };

  if (!authed) return <Login pw={pw} setPw={setPw} err={pwErr} setErr={setPwErr} shake={shake} onLogin={login} />;
  return <Dashboard onLogout={() => { sessionStorage.removeItem("admin_auth"); setAuthed(false); }} />;
}

/* ════════════ LOGIN ════════════ */
function Login({ pw, setPw, err, setErr, shake, onLogin }) {
  return (
    <div style={s.loginPage}>
      <div style={s.loginGlow} />
      <form style={{ ...s.card, ...(shake ? { animation: "shake .45s" } : {}) }} onSubmit={onLogin}>
        <div style={s.loginIcon}>⚡</div>
        <h1 style={s.loginH1}>Admin Panel</h1>
        <p style={s.loginSub}>Sooraj Portfolio CMS</p>
        <input
          type="password" placeholder="Enter password" autoFocus
          value={pw} onChange={(e) => { setPw(e.target.value); setErr(false); }}
          style={{ ...s.input, ...(err ? { borderColor: "#ef4444" } : {}), marginTop: 20 }}
        />
        {err && <p style={{ color: "#ef4444", fontSize: ".8rem", margin: "6px 0 0" }}>❌ Wrong password</p>}
        <button type="submit" style={{ ...s.btnPrimary, width: "100%", marginTop: 14 }}>Unlock Dashboard →</button>
      </form>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
    </div>
  );
}

/* ════════════ DASHBOARD ════════════ */
function Dashboard({ onLogout }) {
  const [tab, setTab] = useState("projects");
  const [projects, setProjects] = useState(() => loadData("admin_projects", DEFAULT_PROJECTS));
  const [designs, setDesigns] = useState(() => loadData("admin_designs", DEFAULT_DESIGNS));
  const [toast, setToast] = useState(null);

  const flash = (msg, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3200); };

  const saveProjects = (data) => { saveData("admin_projects", data); setProjects(data); flash("Project saved successfully!"); };
  const saveDesigns = (data) => { saveData("admin_designs", data); setDesigns(data); flash("Design updated!"); };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ projects, designs }, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "portfolio-data.json"; a.click();
    flash("portfolio-data.json downloaded! Copy it to your public/ folder.");
  };

  const NAV = [
    { key: "projects", icon: "🗂️", label: "Projects" },
    { key: "designs",  icon: "🎨", label: "Design Works" },
    { key: "export",   icon: "📦", label: "Export" },
  ];

  return (
    <div style={s.shell}>
      {/* ── Sidebar ── */}
      <aside style={s.sidebar}>
        <div>
          <div style={s.brand}>
            <span style={{ fontSize: 26 }}>⚡</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: ".95rem" }}>Sooraj CMS</div>
              <div style={{ color: "rgba(255,255,255,.35)", fontSize: ".72rem" }}>Portfolio Admin</div>
            </div>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 32 }}>
            {NAV.map(({ key, icon, label }) => (
              <button key={key} onClick={() => setTab(key)}
                style={{ ...s.navBtn, ...(tab === key ? s.navBtnActive : {}) }}>
                <span>{icon}</span>{label}
              </button>
            ))}
          </nav>
        </div>
        <button style={s.logoutBtn} onClick={onLogout}>🚪 Logout</button>
      </aside>

      {/* ── Main ── */}
      <main style={s.main}>
        <header style={s.topbar}>
          <div>
            <h2 style={{ color: "#fff", margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>
              {NAV.find(n => n.key === tab)?.icon} {NAV.find(n => n.key === tab)?.label}
            </h2>
            <p style={{ color: "rgba(255,255,255,.4)", margin: "3px 0 0", fontSize: ".82rem" }}>
              { tab === "projects" ? "Edit any of your 6 project slots"
              : tab === "designs"  ? "Swap designs by category and slot"
              : "Download your data file for the live site" }
            </p>
          </div>
          <button style={s.exportTopBtn} onClick={exportJSON}>⬇ Export JSON</button>
        </header>

        <div style={s.content}>
          {tab === "projects" && <ProjectsPanel projects={projects} onSave={saveProjects} />}
          {tab === "designs"  && <DesignsPanel  designs={designs}   onSave={saveDesigns} />}
          {tab === "export"   && <ExportPanel   onExport={exportJSON} />}
        </div>
      </main>

      {/* ── Toast ── */}
      {toast && (
        <div style={{ ...s.toast, ...(toast.type !== "ok" ? { borderColor: "rgba(239,68,68,.4)", color: "#fca5a5", background: "rgba(239,68,68,.12)" } : {}) }}>
          {toast.type === "ok" ? "✅" : "❌"} {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ════════════ PROJECTS PANEL ════════════ */
function ProjectsPanel({ projects, onSave }) {
  const [editing, setEditing] = useState(null);

  const handleSave = (idx, data) => {
    onSave(projects.map((p, i) => (i === idx ? data : p)));
    setEditing(null);
  };

  if (editing !== null)
    return <ProjectEditor project={projects[editing]} slotNum={editing + 1}
              onSave={(d) => handleSave(editing, d)} onCancel={() => setEditing(null)} />;

  return (
    <div style={s.grid6}>
      {projects.map((p, i) => (
        <div key={p.id} style={s.slotCard}>
          <div style={{ position: "relative", height: 140, background: "#111", borderRadius: "10px 10px 0 0", overflow: "hidden" }}>
            <img src={p.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { e.target.style.display = "none"; }} />
            <span style={s.badge}>Slot {i + 1}</span>
            {p.status === "in-progress" && <span style={{ ...s.badge, left: "auto", right: 8, background: "#3b82f6" }}>In Progress</span>}
          </div>
          <div style={{ padding: "0.75rem 1rem", flex: 1 }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: ".88rem", lineHeight: 1.3, marginBottom: 4 }}>{p.title || "Empty Slot"}</div>
            <div style={{ color: "rgba(255,255,255,.35)", fontSize: ".73rem" }}>{p.tech}</div>
          </div>
          <button style={s.editBtn} onClick={() => setEditing(i)}>✏️ Edit Slot {i + 1}</button>
        </div>
      ))}
    </div>
  );
}

function ProjectEditor({ project, slotNum, onSave, onCancel }) {
  const [form, setForm] = useState({ ...project, features: (project.features || []).join("\n") });
  const [preview, setPreview] = useState(project.image);
  const fileRef = useRef();
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const pickFile = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setPreview(ev.target.result); set("image", ev.target.result); };
    reader.readAsDataURL(file);
  };

  const submit = (e) => {
    e.preventDefault();
    onSave({ ...form, features: form.features.split("\n").map(f => f.trim()).filter(Boolean) });
  };

  return (
    <div style={s.editorBox}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <button style={s.backBtn} onClick={onCancel}>← Back</button>
        <h3 style={{ color: "#fff", margin: 0, fontWeight: 800 }}>Editing Project — Slot {slotNum}</h3>
      </div>
      <form onSubmit={submit}>
        <div style={s.twoCol}>
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <F label="Project Title *"><input style={s.input} value={form.title} onChange={e => set("title", e.target.value)} required placeholder="e.g. My Awesome App" /></F>
            <F label="Short Description *"><textarea style={{ ...s.input, minHeight: 80, resize: "vertical" }} value={form.description} onChange={e => set("description", e.target.value)} required placeholder="What does this project do?" /></F>
            <F label="Tech Stack (comma-separated) *"><input style={s.input} value={form.tech} onChange={e => set("tech", e.target.value)} required placeholder="HTML5, CSS3, JavaScript..." /></F>
            <F label="Features (one per line)"><textarea style={{ ...s.input, minHeight: 100, resize: "vertical" }} value={form.features} onChange={e => set("features", e.target.value)} placeholder={"Feature one\nFeature two\nFeature three"} /></F>
            <F label="Backend Highlights (optional)"><input style={s.input} value={form.backend || ""} onChange={e => set("backend", e.target.value)} placeholder="e.g. JWT auth, Redis caching..." /></F>
          </div>
          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <F label="Project Status">
              <select style={s.input} value={form.status || ""} onChange={e => set("status", e.target.value)}>
                <option value="">✅ Live / Completed</option>
                <option value="in-progress">🚧 In Progress</option>
              </select>
            </F>
            <F label="Live Demo Link"><input style={s.input} value={form.demoLink} onChange={e => set("demoLink", e.target.value)} placeholder="https://your-site.com  or  #" /></F>
            <F label="GitHub / Code Link"><input style={s.input} value={form.codeLink} onChange={e => set("codeLink", e.target.value)} placeholder="https://github.com/...  or  #" /></F>
            <F label="Project Image">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {preview && <img src={preview} alt="" style={{ borderRadius: 8, maxHeight: 150, objectFit: "contain", background: "#111" }} onError={e => e.target.style.display = "none"} />}
                <button type="button" style={s.uploadBtn} onClick={() => fileRef.current.click()}>📁 Choose Image File</button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={pickFile} />
                <p style={s.note}>Preview above is local only. Also copy the file to <code>public/images/</code> and set the path:</p>
                <input style={s.input} value={form.image} onChange={e => { set("image", e.target.value); setPreview(e.target.value); }} placeholder="/images/my-project.jpg" />
              </div>
            </F>
          </div>
        </div>
        <div style={s.actions}>
          <button type="button" style={s.btnCancel} onClick={onCancel}>Cancel</button>
          <button type="submit" style={s.btnPrimary}>💾 Save Project</button>
        </div>
      </form>
    </div>
  );
}

/* ════════════ DESIGNS PANEL ════════════ */
function DesignsPanel({ designs, onSave }) {
  const [cat, setCat] = useState("birthday");
  const [editing, setEditing] = useState(null);
  const [catMenuOpen, setCatMenuOpen] = useState(false);

  const handleSave = (idx, data) => {
    onSave({ ...designs, [cat]: designs[cat].map((d, i) => (i === idx ? data : d)) });
    setEditing(null);
  };

  if (editing !== null)
    return <DesignEditor slide={designs[cat][editing]} category={CATEGORY_LABELS[cat]} slotNum={editing + 1}
              catKey={cat} onSave={(d) => handleSave(editing, d)} onCancel={() => setEditing(null)} />;

  return (
    <div>
      {/* Category hamburger menu for admin UI */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <button style={s.catMenuBtn} onClick={() => setCatMenuOpen(o => !o)} aria-expanded={catMenuOpen}>
          ☰ {CATEGORY_LABELS[cat]}
        </button>
        {catMenuOpen && (
          <div style={s.catMenuDropdownInline}>
            {DESIGN_CATEGORIES.map(c => (
              <button key={c} onClick={() => { setCat(c); setEditing(null); setCatMenuOpen(false); }}
                style={{ ...s.catMenuItem, ...(cat === c ? s.catTabActive : {}) }}>
                {CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
        )}
      </div>
      <div style={s.grid6}>
        {(designs[cat] || []).map((slide, i) => (
          <div key={i} style={s.slotCard}>
            <div style={{ position: "relative", height: 160, background: "#111", borderRadius: "10px 10px 0 0", overflow: "hidden" }}>
              <img src={slide.src} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={e => e.target.style.display = "none"} />
              <span style={s.badge}>Slot {i + 1}</span>
            </div>
            <div style={{ padding: "0.6rem 1rem", flex: 1, color: "rgba(255,255,255,.55)", fontSize: ".78rem" }}>{slide.caption}</div>
            <button style={s.editBtn} onClick={() => setEditing(i)}>✏️ Edit Slot {i + 1}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DesignEditor({ slide, category, slotNum, catKey, onSave, onCancel }) {
  const [form, setForm] = useState({ ...slide });
  const [preview, setPreview] = useState(slide.src);
  const fileRef = useRef();
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const pickFile = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setPreview(ev.target.result); set("src", ev.target.result); };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ ...s.editorBox, maxWidth: 560 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <button style={s.backBtn} onClick={onCancel}>← Back to {category}</button>
        <h3 style={{ color: "#fff", margin: 0, fontWeight: 800 }}>Editing {category} — Slot {slotNum}</h3>
      </div>
      <form onSubmit={e => { e.preventDefault(); onSave(form); }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <F label="Caption / Title *">
            <input style={s.input} value={form.caption} onChange={e => set("caption", e.target.value)} required placeholder="e.g. Elegant Birthday Poster" />
          </F>
          <F label="Design Image">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {preview && <img src={preview} alt="" style={{ borderRadius: 8, maxHeight: 220, objectFit: "contain", background: "#111" }} onError={e => e.target.style.display = "none"} />}
              <button type="button" style={s.uploadBtn} onClick={() => fileRef.current.click()}>📁 Choose Image File</button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={pickFile} />
              <p style={s.note}>
                Also copy the file to <code>public/images/designs/{CATEGORY_PATHS[catKey]}/</code> and set the path:
              </p>
              <input style={s.input} value={form.src} onChange={e => { set("src", e.target.value); setPreview(e.target.value); }}
                placeholder={`/images/designs/${CATEGORY_PATHS[catKey]}/${catKey}1.jpg`} />
            </div>
          </F>
        </div>
        <div style={s.actions}>
          <button type="button" style={s.btnCancel} onClick={onCancel}>Cancel</button>
          <button type="submit" style={s.btnPrimary}>💾 Save Design</button>
        </div>
      </form>
    </div>
  );
}

/* ════════════ EXPORT PANEL ════════════ */
function ExportPanel({ onExport }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 440 }}>
      <div style={{ ...s.card, maxWidth: 500, textAlign: "center", gap: 0 }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>📦</div>
        <h3 style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 800, margin: "0 0 10px" }}>Export Portfolio Data</h3>
        <p style={{ color: "rgba(255,255,255,.45)", fontSize: ".88rem", lineHeight: 1.7, marginBottom: 24 }}>
          Your edits are saved in the browser. Export a JSON file and place it in your project to update the live site.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28, textAlign: "left" }}>
          {[
            ["1", <>Click <strong>Export</strong> below → downloads <code>portfolio-data.json</code></>],
            ["2", <>Copy file to <code>suraj-salihu/public/</code></>],
            ["3", <>In <code>data.js</code>, replace the hardcoded arrays with values from the JSON, OR use <code>fetch('/portfolio-data.json')</code></>],
            ["4", <>Run <code>npm run build</code> and deploy 🚀</>],
          ].map(([n, text]) => (
            <div key={n} style={{ display: "flex", gap: 12, alignItems: "flex-start", color: "rgba(255,255,255,.6)", fontSize: ".86rem", lineHeight: 1.6 }}>
              <span style={{ background: "rgba(59,130,246,.2)", color: "#60a5fa", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".73rem", fontWeight: 800, flexShrink: 0 }}>{n}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <button style={{ ...s.btnPrimary, width: "100%", fontSize: "1rem", padding: ".85rem" }} onClick={onExport}>
          ⬇ Download portfolio-data.json
        </button>
      </div>
    </div>
  );
}

/* ── Field wrapper ── */
function F({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ color: "rgba(255,255,255,.5)", fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</label>
      {children}
    </div>
  );
}

/* ════════════ STYLES ════════════ */
const s = {
  /* ── Login ── */
  loginPage: {
    position: "fixed", inset: 0, zIndex: 9999,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "#080810", overflow: "hidden",
  },
  loginGlow: { position: "absolute", inset: 0, background: "radial-gradient(ellipse at 35% 55%, rgba(59,130,246,.18) 0%, transparent 55%), radial-gradient(ellipse at 65% 20%, rgba(99,102,241,.12) 0%, transparent 50%)", pointerEvents: "none" },
  card: { position: "relative", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 20, padding: "2.5rem 2rem", width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, backdropFilter: "blur(20px)" },
  loginIcon: { fontSize: 42, marginBottom: 4 },
  loginH1: { color: "#fff", fontSize: "1.55rem", fontWeight: 800, margin: 0, fontFamily: "Georgia, serif", letterSpacing: "-.02em" },
  loginSub: { color: "rgba(255,255,255,.38)", fontSize: ".82rem", margin: 0 },

  /* ── Dashboard shell: full-screen fixed, completely isolated from portfolio CSS ── */
  shell: {
    position: "fixed", inset: 0, zIndex: 9999,
    display: "flex",
    background: "#0d0d14",
    color: "#fff",
    fontFamily: "'Segoe UI', sans-serif",
    overflow: "hidden", // shell itself never scrolls
  },

  /* ── Sidebar: fixed height, scrolls independently ── */
  sidebar: {
    width: 200,
    flexShrink: 0,
    height: "100%",
    overflowY: "auto",
    background: "rgba(255,255,255,.03)",
    borderRight: "1px solid rgba(255,255,255,.07)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "1.4rem 1rem",
    boxSizing: "border-box",
  },

  brand: { display: "flex", alignItems: "center", gap: 10, marginBottom: 4 },
  navBtn: { display: "flex", alignItems: "center", gap: 10, padding: ".6rem .9rem", borderRadius: 10, border: "none", background: "transparent", color: "rgba(255,255,255,.45)", fontSize: ".88rem", cursor: "pointer", textAlign: "left", width: "100%", transition: "all .15s", boxSizing: "border-box" },
  navBtnActive: { background: "rgba(59,130,246,.14)", color: "#60a5fa", fontWeight: 700 },
  logoutBtn: { padding: ".55rem .9rem", borderRadius: 10, border: "1px solid rgba(255,255,255,.1)", background: "transparent", color: "rgba(255,255,255,.38)", cursor: "pointer", fontSize: ".82rem", textAlign: "left", width: "100%", boxSizing: "border-box" },

  /* ── Main column: fills remaining width, scrolls independently ── */
  main: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  /* ── Topbar: never scrolls away ── */
  topbar: {
    flexShrink: 0,
    padding: "1.1rem 1.6rem",
    borderBottom: "1px solid rgba(255,255,255,.07)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    background: "#0d0d14", // match shell so it looks fixed
  },
  exportTopBtn: { padding: ".5rem 1rem", borderRadius: 8, border: "1px solid rgba(59,130,246,.35)", background: "rgba(59,130,246,.08)", color: "#60a5fa", cursor: "pointer", fontSize: ".8rem", flexShrink: 0 },

  /* ── Scrollable content area ── */
  content: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    padding: "1.4rem 1.6rem",
    boxSizing: "border-box",
  },

  /* ── Cards & grids ── */
  grid6: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 },
  slotCard: { background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" },
  badge: { position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,.7)", color: "#fff", fontSize: ".68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 20 },
  editBtn: { margin: "0 1rem 1rem", padding: ".48rem", borderRadius: 8, border: "1px solid rgba(59,130,246,.3)", background: "rgba(59,130,246,.07)", color: "#60a5fa", cursor: "pointer", fontSize: ".78rem", fontWeight: 600 },

  /* ── Design category tabs ── */
  catTabsWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
    position: "relative",
    zIndex: 100000,
    // no position:sticky — lives inside the scrollable content area, scrolls with it
  },
  catTab: { padding: ".42rem .9rem", borderRadius: 20, border: "1px solid rgba(255,255,255,.1)", background: "transparent", color: "rgba(255,255,255,.42)", cursor: "pointer", fontSize: ".78rem", whiteSpace: "nowrap" },
  catTabActive: { background: "rgba(59,130,246,.14)", borderColor: "rgba(59,130,246,.35)", color: "#60a5fa", fontWeight: 700 },

  /* Hamburger category menu */
  catMenuBtn: { padding: ".42rem .9rem", borderRadius: 10, border: "1px solid rgba(255,255,255,.08)", background: "transparent", color: "rgba(255,255,255,.9)", cursor: "pointer", fontSize: ".86rem" },
  catMenuDropdownInline: { position: "fixed", background: "rgba(13,13,20,.98)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 8, padding: 8, display: "flex", flexDirection: "column", gap: 6, zIndex: 100000, minWidth: 200, top: "210px", left: "240px" },
  catMenuItem: { padding: ".5rem .8rem", borderRadius: 8, border: "none", background: "transparent", color: "rgba(255,255,255,.72)", textAlign: "left", cursor: "pointer", fontSize: ".86rem", whiteSpace: "nowrap" },

  /* ── Editor ── */
  editorBox: { background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, padding: "1.5rem" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },
  backBtn: { padding: ".38rem .85rem", borderRadius: 8, border: "1px solid rgba(255,255,255,.12)", background: "transparent", color: "rgba(255,255,255,.45)", cursor: "pointer", fontSize: ".8rem" },

  input: { padding: ".62rem .9rem", borderRadius: 8, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.05)", color: "#fff", fontSize: ".88rem", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" },
  uploadBtn: { padding: ".5rem .9rem", borderRadius: 8, border: "1px dashed rgba(255,255,255,.2)", background: "transparent", color: "rgba(255,255,255,.55)", cursor: "pointer", fontSize: ".82rem" },
  note: { color: "rgba(255,255,255,.28)", fontSize: ".72rem", lineHeight: 1.55, margin: 0 },

  actions: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,.07)" },
  btnPrimary: { padding: ".65rem 1.5rem", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#3b82f6,#6366f1)", color: "#fff", cursor: "pointer", fontSize: ".9rem", fontWeight: 700 },
  btnCancel: { padding: ".65rem 1.2rem", borderRadius: 10, border: "1px solid rgba(255,255,255,.12)", background: "transparent", color: "rgba(255,255,255,.45)", cursor: "pointer", fontSize: ".9rem" },

  toast: { position: "fixed", bottom: 22, right: 22, background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.3)", color: "#86efac", padding: ".7rem 1.2rem", borderRadius: 12, backdropFilter: "blur(10px)", zIndex: 99999, fontSize: ".86rem", fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,.4)" },
};
