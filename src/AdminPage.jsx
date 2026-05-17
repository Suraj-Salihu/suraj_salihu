/**
 * AdminPage.jsx — Cloudinary + Firestore Portfolio CMS
 *
 * HOW IT WORKS:
 * ─────────────────────────────────────────────────────────────────────────────
 * IMAGES  → Cloudinary at a FIXED PATH per slot (unsigned uploads).
 *           Uploading a new image performs an unsigned Cloudinary upload to the same public_id,
 *           which OVERWRITES the old file. No accumulation, no old copies.
 *
 *           Project image paths:  portfolio/projects/slot-1.jpg  … slot-6.jpg
 *           Design image paths:   portfolio/designs/birthday/slot-1.jpg … etc.
 *
 * METADATA → Firestore documents (title, description, links, caption, etc.)
 *            Doc IDs are fixed: "project-1" … "project-6"
 *                               "design-birthday-1" … "design-other-6"
 *
 * READING  → Your portfolio (Projects.jsx, DesignWorks.jsx) reads from
 *            Firestore + uses Cloudinary URLs stored there.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { db } from "./firebase";
import {
  doc, getDoc, setDoc, collection, getDocs,
} from "firebase/firestore";

/* ════════════════════════════════════════════════════════════════════════════
   CONSTANTS
════════════════════════════════════════════════════════════════════════════ */
const ADMIN_PASSWORD    = "sooraj2025"; // ← change to your own password
const DESIGN_CATEGORIES = ["birthday", "advert", "song", "invitation", "logo", "other"];
const CATEGORY_LABELS   = {
  birthday:   "Birthday Designs",
  advert:     "Advert Designs",
  song:       "Song Covers",
  invitation: "Invitation Designs",
  logo:       "Logo Designs",
  other:      "Other Designs",
};

// Fixed Cloudinary public_id paths — uploading to the same path OVERWRITES the old file
const projectStoragePath = (slotNum) =>
  `portfolio/projects/slot-${slotNum}.jpg`;

const designStoragePath = (category, slotNum) =>
  `portfolio/designs/${category}/slot-${slotNum}.jpg`;

// Fixed Firestore doc IDs
const projectDocId = (slotNum)           => `project-${slotNum}`;
const designDocId  = (category, slotNum) => `design-${category}-${slotNum}`;

/* ════════════════════════════════════════════════════════════════════════════
   FIREBASE HELPERS
════════════════════════════════════════════════════════════════════════════ */

/** Upload file to Cloudinary (unsigned preset) using the fixed path as public_id.
    This overwrites the previous file at the same path and returns the secure URL. */
async function uploadToFixed(storagePath, file) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !preset) {
    throw new Error("Missing Cloudinary configuration in .env");
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  // remove extension for overwrite path
  const publicId = storagePath.replace(/\.[^/.]+$/, "");

  const form = new FormData();

  form.append("file", file);
  form.append("upload_preset", preset);
  form.append("public_id", publicId);
  // `invalidate` is not allowed for unsigned uploads; Cloudinary rejects it.
  // Leave it out for unsigned presets.

  const res = await fetch(url, {
    method: "POST",
    body: form,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }

  return data.secure_url;
}

/** Save metadata to Firestore (merge keeps existing fields if partial update) */
async function saveMeta(docId, data) {
  await setDoc(doc(db, "portfolio", docId), data, { merge: true });
}

/** Load one Firestore doc → returns data or null */
async function loadMeta(docId) {
  const snap = await getDoc(doc(db, "portfolio", docId));
  return snap.exists() ? snap.data() : null;
}

/** Load all portfolio docs into a map { docId: data } */
async function loadAllMeta() {
  const snap = await getDocs(collection(db, "portfolio"));
  const out  = {};
  snap.forEach((d) => { out[d.id] = d.data(); });
  return out;
}

/* ════════════════════════════════════════════════════════════════════════════
   ROOT
════════════════════════════════════════════════════════════════════════════ */
export default function AdminPage() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("admin_auth") === "yes"
  );
  const [pw, setPw]     = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [shake, setShake] = useState(false);

  const login = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "yes");
      setAuthed(true);
    } else {
      setPwErr(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  if (!authed)
    return (
      <Login
        pw={pw} setPw={setPw}
        err={pwErr} setErr={setPwErr}
        shake={shake} onLogin={login}
      />
    );

  return (
    <Dashboard
      onLogout={() => {
        sessionStorage.removeItem("admin_auth");
        setAuthed(false);
      }}
    />
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   LOGIN
════════════════════════════════════════════════════════════════════════════ */
function Login({ pw, setPw, err, setErr, shake, onLogin }) {
  return (
    <div style={s.loginPage}>
      <div style={s.loginGlow} />
      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%,60%{transform:translateX(-8px)}
          40%,80%{transform:translateX(8px)}
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <form
        style={{ ...s.card, ...(shake ? { animation: "shake .45s" } : {}) }}
        onSubmit={onLogin}
      >
        <div style={{ fontSize: 46, marginBottom: 4 }}>⚡</div>
        <h1 style={s.loginH1}>Admin Panel</h1>
        <p style={s.loginSub}>Sooraj Portfolio CMS</p>
        <input
          type="password" placeholder="Enter password" autoFocus
          value={pw}
          onChange={(e) => { setPw(e.target.value); setErr(false); }}
          style={{ ...s.input, ...(err ? { borderColor: "#ef4444" } : {}), marginTop: 20, width: "100%" }}
        />
        {err && <p style={{ color: "#ef4444", fontSize: ".8rem", margin: "6px 0 0", alignSelf: "flex-start" }}>❌ Wrong password</p>}
        <button type="submit" style={{ ...s.btnPrimary, width: "100%", marginTop: 14 }}>
          Unlock Dashboard →
        </button>
      </form>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   DASHBOARD SHELL
════════════════════════════════════════════════════════════════════════════ */
function Dashboard({ onLogout }) {
  const [tab, setTab]     = useState("projects");
  const [toast, setToast] = useState(null);

  const flash = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const NAV = [
    { key: "projects", icon: "🗂️", label: "Projects" },
    { key: "designs",  icon: "🎨", label: "Design Works" },
  ];

  return (
    <div style={s.shell}>
      {/* ── Sidebar ── */}
      <aside style={s.sidebar}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 26 }}>⚡</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: ".95rem" }}>Sooraj CMS</div>
              <div style={{ color: "rgba(255,255,255,.3)", fontSize: ".7rem" }}>Cloudinary + Firestore Admin</div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV.map(({ key, icon, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{ ...s.navBtn, ...(tab === key ? s.navBtnActive : {}) }}
              >
                <span>{icon}</span> {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <button style={s.logoutBtn} onClick={onLogout}>🚪 Logout</button>
      </aside>

      {/* ── Main ── */}
      <div style={s.mainWrap}>
        {/* Topbar */}
        <header style={s.topbar}>
          <div>
            <h2 style={{ color: "#fff", margin: 0, fontSize: "1.15rem", fontWeight: 800 }}>
              {NAV.find((n) => n.key === tab)?.icon}{" "}
              {tab === "projects" ? "Manage Projects" : "Manage Design Works"}
            </h2>
            <p style={{ color: "rgba(255,255,255,.35)", margin: "3px 0 0", fontSize: ".8rem" }}>
              {tab === "projects"
                ? "6 fixed slots · uploading a new image overwrites the old one permanently"
                : "6 slots per category · overwrite anytime, old file is deleted automatically"}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={s.firebasePill}>🔶 Firestore Live</div>
          </div>
        </header>

        {/* Content */}
        <div style={s.content}>
          {tab === "projects" && <ProjectsPanel flash={flash} />}
          {tab === "designs"  && <DesignsPanel  flash={flash} />}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          ...s.toast,
          ...(toast.type === "err"
            ? { background: "rgba(239,68,68,.13)", borderColor: "rgba(239,68,68,.35)", color: "#fca5a5" }
            : {}),
        }}>
          {toast.type === "ok" ? "✅" : "❌"} {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PROJECTS PANEL
════════════════════════════════════════════════════════════════════════════ */
function ProjectsPanel({ flash }) {
  const [slots, setSlots]     = useState(Array(6).fill(null)); // null = loading
  const [editing, setEditing] = useState(null); // 0-based index or null

  // Load all 6 project slots from Firestore on mount
  useEffect(() => {
    (async () => {
      const all = await loadAllMeta();
      setSlots(
        Array.from({ length: 6 }, (_, i) => {
          const id   = projectDocId(i + 1);
          const data = all[id] ?? {};
          return { slotNum: i + 1, ...data };
        })
      );
    })();
  }, []);

  const handleSaved = (slotNum, updated) => {
    setSlots((prev) =>
      prev.map((s) => (s?.slotNum === slotNum ? { ...s, ...updated } : s))
    );
    setEditing(null);
    flash(`Slot ${slotNum} saved to Firestore!`);
  };

  if (editing !== null)
    return (
      <ProjectEditor
        slot={slots[editing]}
        onSaved={handleSaved}
        onCancel={() => setEditing(null)}
        flash={flash}
      />
    );

  return (
    <div style={s.grid}>
      {slots.map((slot, i) =>
        slot === null ? (
          <SkeletonCard key={i} />
        ) : (
          <SlotCard
            key={i}
            label={`Slot ${i + 1}`}
            title={slot.title || "Empty — click to set up"}
            subtitle={slot.tech || ""}
            imageUrl={slot.imageUrl || ""}
            badge={slot.status === "in-progress" ? "In Progress" : ""}
            onEdit={() => setEditing(i)}
          />
        )
      )}
    </div>
  );
}

/* ── Project Editor ─────────────────────────────────────────────────────── */
function ProjectEditor({ slot, onSaved, onCancel, flash }) {
  const emptyForm = {
    title: "", description: "", tech: "",
    features: "", backend: "",
    demoLink: "", codeLink: "", status: "",
  };
  const [form, setForm]       = useState({ ...emptyForm, ...slot, features: (slot?.features || []).join("\n") });
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState(slot?.imageUrl || "");
  const [saving, setSaving]   = useState(false);
  const fileRef               = useRef();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const pickFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = slot?.imageUrl || "";

      // If a new file was chosen → overwrite the fixed Cloudinary public_id path
      if (file) {
        imageUrl = await uploadToFixed(projectStoragePath(slot.slotNum), file);
      }

      const data = {
        slotNum:     slot.slotNum,
        title:       form.title.trim(),
        description: form.description.trim(),
        tech:        form.tech.trim(),
        features:    form.features.split("\n").map((f) => f.trim()).filter(Boolean),
        backend:     form.backend.trim(),
        demoLink:    form.demoLink.trim(),
        codeLink:    form.codeLink.trim(),
        status:      form.status,
        imageUrl,
        updatedAt:   new Date().toISOString(),
      };

      await saveMeta(projectDocId(slot.slotNum), data);
      onSaved(slot.slotNum, data);
    } catch (err) {
      console.error(err);
      flash("❌ Save failed: " + err.message, "err");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={s.editorWrap}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <button style={s.backBtn} onClick={onCancel}>← Back</button>
        <h3 style={{ color: "#fff", margin: 0, fontWeight: 800, fontSize: "1.05rem" }}>
          Editing Project — Slot {slot.slotNum}
        </h3>
      </div>

      <form onSubmit={submit}>
        <div style={s.twoCol}>
          {/* ── LEFT ── */}
          <div style={s.col}>
            <F label="Project Title *">
              <input style={s.input} value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="e.g. JK Clothing Commerce" />
            </F>
            <F label="Short Description *">
              <textarea style={{ ...s.input, minHeight: 80, resize: "vertical" }} value={form.description} onChange={(e) => set("description", e.target.value)} required placeholder="What does this project do?" />
            </F>
            <F label="Tech Stack *">
              <input style={s.input} value={form.tech} onChange={(e) => set("tech", e.target.value)} required placeholder="HTML5, CSS3, JavaScript, React..." />
            </F>
            <F label="Key Features — one per line">
              <textarea style={{ ...s.input, minHeight: 110, resize: "vertical" }} value={form.features} onChange={(e) => set("features", e.target.value)} placeholder={"WhatsApp order automation\nMobile-first design\nOffline support"} />
            </F>
            <F label="Backend Highlights (optional)">
              <input style={s.input} value={form.backend} onChange={(e) => set("backend", e.target.value)} placeholder="e.g. JWT auth, Redis caching..." />
            </F>
          </div>

          {/* ── RIGHT ── */}
          <div style={s.col}>
            <F label="Project Status">
              <select style={s.input} value={form.status} onChange={(e) => set("status", e.target.value)}>
                <option value="">✅ Live / Completed</option>
                <option value="in-progress">🚧 In Progress</option>
              </select>
            </F>
            <F label="Live Demo Link">
              <input style={s.input} value={form.demoLink} onChange={(e) => set("demoLink", e.target.value)} placeholder="https://your-demo.com  or  #" />
            </F>
            <F label="GitHub / Code Link">
              <input style={s.input} value={form.codeLink} onChange={(e) => set("codeLink", e.target.value)} placeholder="https://github.com/...  or  #" />
            </F>

            {/* Image Upload */}
            <F label="Project Image">
              <div style={s.uploadBox} onClick={() => fileRef.current.click()}>
                {preview ? (
                  <img src={preview} alt="" style={s.uploadPreview} />
                ) : (
                  <div style={s.uploadPlaceholder}>
                    <span style={{ fontSize: 32 }}>🖼️</span>
                    <span style={{ color: "rgba(255,255,255,.4)", fontSize: ".82rem" }}>Click to choose image</span>
                  </div>
                )}
                <div style={s.uploadOverlay}>
                  📁 {preview ? "Replace Image" : "Choose Image"}
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={pickFile} />

              {file && (
                <div style={s.fileChosen}>
                  ✅ New image chosen: <strong>{file.name}</strong>
                  <br />
                  <span style={{ fontSize: ".72rem", opacity: .6 }}>
                    Will overwrite slot-{slot.slotNum}.jpg in Cloudinary (same path)
                  </span>
                </div>
              )}
              {!file && slot?.imageUrl && (
                <div style={s.fileChosen}>
                  Current image loaded from Cloudinary.
                  <br />
                  <span style={{ fontSize: ".72rem", opacity: .6 }}>Choose a new file above to replace it.</span>
                </div>
              )}
            </F>
          </div>
        </div>

        {/* Actions */}
        <div style={s.actions}>
          <button type="button" style={s.btnCancel} onClick={onCancel} disabled={saving}>Cancel</button>
          <button type="submit" style={{ ...s.btnPrimary, opacity: saving ? .7 : 1 }} disabled={saving}>
            {saving ? <Spinner /> : "💾 Save to Firestore"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   DESIGNS PANEL
════════════════════════════════════════════════════════════════════════════ */
function DesignsPanel({ flash }) {
  const [cat, setCat]         = useState("birthday");
  const [slots, setSlots]     = useState({});     // { "birthday-1": {...}, ... }
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);   // { category, slotNum }

  // Load all design metadata once
  useEffect(() => {
    (async () => {
      setLoading(true);
      const all = await loadAllMeta();
      setSlots(all);
      setLoading(false);
    })();
  }, []);

  const getSlot = (category, num) => {
    const id = designDocId(category, num);
    return slots[id] ?? { slotNum: num, category };
  };

  const handleSaved = (category, slotNum, updated) => {
    const id = designDocId(category, slotNum);
    setSlots((prev) => ({ ...prev, [id]: updated }));
    setEditing(null);
    flash(`${CATEGORY_LABELS[category]} Slot ${slotNum} saved!`);
  };

  if (editing)
    return (
      <DesignEditor
        slot={getSlot(editing.category, editing.slotNum)}
        category={editing.category}
        onSaved={handleSaved}
        onCancel={() => setEditing(null)}
        flash={flash}
      />
    );

  return (
    <div>
      {/* Category tabs */}
      <div style={s.catTabs}>
        {DESIGN_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            style={{ ...s.catTab, ...(cat === c ? s.catTabActive : {}) }}
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      {/* Slots grid */}
      {loading ? (
        <div style={s.grid}>
          {Array(6).fill(null).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div style={s.grid}>
          {Array.from({ length: 6 }, (_, i) => {
            const slot = getSlot(cat, i + 1);
            return (
              <SlotCard
                key={i}
                label={`Slot ${i + 1}`}
                title={slot.caption || "Empty — click to set up"}
                subtitle={CATEGORY_LABELS[cat]}
                imageUrl={slot.imageUrl || ""}
                onEdit={() => setEditing({ category: cat, slotNum: i + 1 })}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Design Editor ──────────────────────────────────────────────────────── */
function DesignEditor({ slot, category, onSaved, onCancel, flash }) {
  const [caption, setCaption] = useState(slot?.caption || "");
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState(slot?.imageUrl || "");
  const [saving, setSaving]   = useState(false);
  const fileRef               = useRef();

  const pickFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = slot?.imageUrl || "";

      if (file) {
        imageUrl = await uploadToFixed(
          designStoragePath(category, slot.slotNum),
          file
        );
      }

      const data = {
        slotNum:   slot.slotNum,
        category,
        caption:   caption.trim(),
        imageUrl,
        updatedAt: new Date().toISOString(),
      };

      await saveMeta(designDocId(category, slot.slotNum), data);
      onSaved(category, slot.slotNum, data);
    } catch (err) {
      console.error(err);
      flash("❌ Save failed: " + err.message, "err");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ ...s.editorWrap, maxWidth: 540 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <button style={s.backBtn} onClick={onCancel}>← Back to {CATEGORY_LABELS[category]}</button>
        <h3 style={{ color: "#fff", margin: 0, fontWeight: 800, fontSize: "1rem" }}>
          {CATEGORY_LABELS[category]} — Slot {slot.slotNum}
        </h3>
      </div>

      <form onSubmit={submit}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <F label="Caption / Title *">
            <input
              style={s.input}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
              placeholder="e.g. Elegant Birthday Poster"
            />
          </F>

          <F label="Design Image">
            <div style={s.uploadBox} onClick={() => fileRef.current.click()}>
              {preview ? (
                <img src={preview} alt="" style={s.uploadPreview} />
              ) : (
                <div style={s.uploadPlaceholder}>
                  <span style={{ fontSize: 36 }}>🎨</span>
                  <span style={{ color: "rgba(255,255,255,.4)", fontSize: ".82rem" }}>Click to choose design image</span>
                </div>
              )}
              <div style={s.uploadOverlay}>
                📁 {preview ? "Replace Image" : "Choose Image"}
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={pickFile} />

            {file && (
              <div style={s.fileChosen}>
                ✅ New image ready: <strong>{file.name}</strong>
                <br />
                <span style={{ fontSize: ".72rem", opacity: .6 }}>
                  Will overwrite portfolio/designs/{category}/slot-{slot.slotNum}.jpg in Cloudinary (same path)
                </span>
              </div>
            )}
            {!file && slot?.imageUrl && (
              <div style={s.fileChosen}>
                Current image loaded from Cloudinary.
                <br />
                <span style={{ fontSize: ".72rem", opacity: .6 }}>Choose a new file above to replace it permanently.</span>
              </div>
            )}
          </F>
        </div>

        <div style={s.actions}>
          <button type="button" style={s.btnCancel} onClick={onCancel} disabled={saving}>Cancel</button>
          <button type="submit" style={{ ...s.btnPrimary, opacity: saving ? .7 : 1 }} disabled={saving}>
            {saving ? <Spinner /> : "💾 Save to Firestore"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SHARED UI ATOMS
════════════════════════════════════════════════════════════════════════════ */

/** The card shown in the slot grid */
function SlotCard({ label, title, subtitle, imageUrl, badge, onEdit }) {
  return (
    <div style={s.slotCard}>
      <div style={{ position: "relative", height: 150, background: "#111", borderRadius: "10px 10px 0 0", overflow: "hidden" }}>
        {imageUrl ? (
          <img src={imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { e.target.style.display = "none"; }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,.15)", fontSize: "2.5rem" }}>
            📂
          </div>
        )}
        <span style={s.slotBadge}>{label}</span>
        {badge && (
          <span style={{ ...s.slotBadge, left: "auto", right: 8, background: "#3b82f6" }}>{badge}</span>
        )}
      </div>
      <div style={{ padding: "0.7rem 1rem", flex: 1 }}>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: ".88rem", lineHeight: 1.3, marginBottom: 3 }}>{title}</div>
        <div style={{ color: "rgba(255,255,255,.35)", fontSize: ".73rem" }}>{subtitle}</div>
      </div>
      <button style={s.editBtn} onClick={onEdit}>✏️ Edit Slot</button>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ ...s.slotCard, opacity: .4 }}>
      <div style={{ height: 150, background: "rgba(255,255,255,.05)", borderRadius: "10px 10px 0 0", animation: "pulse 1.5s infinite" }} />
      <div style={{ padding: "0.7rem 1rem" }}>
        <div style={{ height: 14, background: "rgba(255,255,255,.08)", borderRadius: 4, marginBottom: 8 }} />
        <div style={{ height: 10, background: "rgba(255,255,255,.05)", borderRadius: 4, width: "60%" }} />
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite", verticalAlign: "middle" }} />
  );
}

function F({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ color: "rgba(255,255,255,.45)", fontSize: ".73rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   STYLES
════════════════════════════════════════════════════════════════════════════ */
const s = {
  /* Login */
  loginPage: { position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "#080810", overflow: "hidden" },
  loginGlow:  { position: "absolute", inset: 0, background: "radial-gradient(ellipse at 35% 55%, rgba(59,130,246,.18) 0%, transparent 55%), radial-gradient(ellipse at 65% 20%, rgba(99,102,241,.12) 0%, transparent 50%)", pointerEvents: "none" },
  loginH1:    { color: "#fff", fontSize: "1.55rem", fontWeight: 800, margin: 0, fontFamily: "Georgia, serif", letterSpacing: "-.02em" },
  loginSub:   { color: "rgba(255,255,255,.38)", fontSize: ".82rem", margin: 0 },
  card:       { position: "relative", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 20, padding: "2.5rem 2rem", width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, backdropFilter: "blur(20px)" },

  /* Dashboard */
  shell:    { position: "fixed", inset: 0, zIndex: 9999, display: "flex", background: "#0d0d14", color: "#fff", fontFamily: "'Segoe UI', sans-serif", overflow: "hidden" },
  sidebar:  { width: 220, flexShrink: 0, height: "100%", overflowY: "auto", background: "rgba(255,255,255,.03)", borderRight: "1px solid rgba(255,255,255,.07)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "1.4rem 1rem", boxSizing: "border-box" },
  navBtn:   { display: "flex", alignItems: "center", gap: 10, padding: ".6rem .9rem", borderRadius: 10, border: "none", background: "transparent", color: "rgba(255,255,255,.45)", fontSize: ".88rem", cursor: "pointer", textAlign: "left", width: "100%", boxSizing: "border-box" },
  navBtnActive: { background: "rgba(59,130,246,.15)", color: "#60a5fa", fontWeight: 700 },
  logoutBtn: { padding: ".55rem .9rem", borderRadius: 10, border: "1px solid rgba(255,255,255,.1)", background: "transparent", color: "rgba(255,255,255,.35)", cursor: "pointer", fontSize: ".82rem", textAlign: "left", width: "100%", boxSizing: "border-box" },
  firebasePill: { padding: ".35rem .8rem", borderRadius: 20, background: "rgba(255,160,0,.1)", border: "1px solid rgba(255,160,0,.3)", color: "#fbbf24", fontSize: ".75rem", fontWeight: 700 },

  mainWrap: { flex: 1, minWidth: 0, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" },
  topbar:   { flexShrink: 0, padding: "1rem 1.6rem", borderBottom: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "#0d0d14" },
  content:  { flex: 1, overflowY: "auto", overflowX: "hidden", padding: "1.4rem 1.6rem", boxSizing: "border-box" },

  /* Grids */
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 },

  /* Category tabs */
  catTabs:    { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 },
  catTab:     { padding: ".42rem .9rem", borderRadius: 20, border: "1px solid rgba(255,255,255,.1)", background: "transparent", color: "rgba(255,255,255,.42)", cursor: "pointer", fontSize: ".78rem", whiteSpace: "nowrap" },
  catTabActive: { background: "rgba(59,130,246,.14)", borderColor: "rgba(59,130,246,.35)", color: "#60a5fa", fontWeight: 700 },

  /* Slot card */
  slotCard:  { background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" },
  slotBadge: { position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,.7)", color: "#fff", fontSize: ".65rem", fontWeight: 700, padding: "2px 8px", borderRadius: 20 },
  editBtn:   { margin: "0 1rem 1rem", padding: ".48rem", borderRadius: 8, border: "1px solid rgba(59,130,246,.3)", background: "rgba(59,130,246,.07)", color: "#60a5fa", cursor: "pointer", fontSize: ".78rem", fontWeight: 600 },

  /* Editor */
  editorWrap: { background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16, padding: "1.5rem" },
  twoCol:     { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },
  col:        { display: "flex", flexDirection: "column", gap: 16 },
  backBtn:    { padding: ".38rem .85rem", borderRadius: 8, border: "1px solid rgba(255,255,255,.12)", background: "transparent", color: "rgba(255,255,255,.45)", cursor: "pointer", fontSize: ".8rem", whiteSpace: "nowrap" },

  /* Inputs */
  input: { padding: ".62rem .9rem", borderRadius: 8, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.05)", color: "#fff", fontSize: ".88rem", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" },

  /* Image upload box */
  uploadBox: { position: "relative", width: "100%", minHeight: 160, borderRadius: 10, border: "2px dashed rgba(255,255,255,.15)", background: "rgba(255,255,255,.03)", cursor: "pointer", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" },
  uploadPreview:    { width: "100%", height: "100%", objectFit: "contain", maxHeight: 200, display: "block" },
  uploadPlaceholder: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
  uploadOverlay:    { position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,.65)", color: "#fff", fontSize: ".78rem", fontWeight: 600, padding: ".45rem", textAlign: "center" },
  fileChosen:       { background: "rgba(59,130,246,.08)", border: "1px solid rgba(59,130,246,.2)", borderRadius: 8, padding: ".6rem .9rem", color: "rgba(255,255,255,.7)", fontSize: ".8rem", lineHeight: 1.5 },

  /* Form actions */
  actions:   { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,.07)" },
  btnPrimary: { display: "flex", alignItems: "center", gap: 8, padding: ".65rem 1.5rem", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#3b82f6,#6366f1)", color: "#fff", cursor: "pointer", fontSize: ".9rem", fontWeight: 700 },
  btnCancel:  { padding: ".65rem 1.2rem", borderRadius: 10, border: "1px solid rgba(255,255,255,.12)", background: "transparent", color: "rgba(255,255,255,.45)", cursor: "pointer", fontSize: ".9rem" },

  /* Toast */
  toast: { position: "fixed", bottom: 22, right: 22, background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.3)", color: "#86efac", padding: ".7rem 1.2rem", borderRadius: 12, backdropFilter: "blur(10px)", zIndex: 99999, fontSize: ".86rem", fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,.4)" },
};
