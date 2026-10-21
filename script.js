:root {
  --bg: #eef5fb;
  --bg-accent: #dfeaf7;
  --surface: #ffffff;
  --surface-soft: #f6faff;
  --card-border: rgba(17, 24, 39, 0.08);
  --text: #102033;
  --text-soft: #4d647d;
  --primary: #3b82f6;
  --primary-soft: rgba(59, 130, 246, 0.1);
  --success: #0f766e;
  --warning: #b45309;
  --danger: #b91c1c;
  --sent: #4f46e5;
  --sent-soft: rgba(79, 70, 229, 0.12);
  --process: #d97706;
  --process-soft: rgba(217, 119, 6, 0.12);
  --reject: #dc2626;
  --reject-soft: rgba(220, 38, 38, 0.12);
  --offer: #059669;
  --offer-soft: rgba(5, 150, 105, 0.12);
  --shadow: 0 14px 32px rgba(15, 23, 42, 0.08);
}

body[data-theme="dark"] {
  --bg: #0f172a;
  --bg-accent: #111c2f;
  --surface: #122033;
  --surface-soft: #15263f;
  --card-border: rgba(148, 163, 184, 0.14);
  --text: #e5edf8;
  --text-soft: #a8bbd3;
  --primary: #7aa9ff;
  --primary-soft: rgba(122, 169, 255, 0.14);
  --success: #5eead4;
  --warning: #fdba74;
  --danger: #fca5a5;
  --sent: #a5b4fc;
  --sent-soft: rgba(165, 180, 252, 0.12);
  --process: #fbbf24;
  --process-soft: rgba(251, 191, 36, 0.12);
  --reject: #fca5a5;
  --reject-soft: rgba(252, 165, 165, 0.12);
  --offer: #6ee7b7;
  --offer-soft: rgba(110, 231, 183, 0.12);
  --shadow: 0 18px 38px rgba(2, 6, 23, 0.48);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  color: var(--text);
  background: linear-gradient(180deg, var(--bg) 0%, var(--bg-accent) 100%);
  font-family: "Inter", sans-serif;
  transition: background 0.25s ease, color 0.25s ease;
}

button,
input,
select,
textarea {
  font: inherit;
}

.app-shell {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 16px 48px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.brand-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.eyebrow {
  margin: 0;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-soft);
}

h1 {
  margin: 0;
  font-size: clamp(1.8rem, 5vw, 2.7rem);
  line-height: 1.1;
}

.owner-tag {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  padding: 5px 10px;
  border-radius: 999px;
  background: var(--primary-soft);
  color: var(--primary);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid var(--card-border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.theme-toggle:hover {
  transform: translateY(-1px);
}

.content {
  display: grid;
  gap: 20px;
}

.panel {
  background: var(--surface);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  box-shadow: var(--shadow);
  padding: 20px;
}

h2 {
  margin: 0 0 18px;
  font-size: 1.2rem;
}

#applicationForm {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-soft);
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid var(--card-border);
  border-radius: 12px;
  background: var(--surface-soft);
  color: var(--text);
  padding: 12px 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

textarea {
  resize: vertical;
  min-height: 90px;
}

.primary-btn {
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary) 0%, #5b9af8 100%);
  color: white;
  font-weight: 700;
  padding: 13px 16px;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.primary-btn:hover {
  transform: translateY(-1px);
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 34px;
  padding: 0 10px;
  border-radius: 999px;
  background: var(--primary-soft);
  color: var(--primary);
  font-weight: 700;
}

.list-toolbar {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-bottom: 14px;
}

.applications-list {
  display: grid;
  gap: 14px;
}

.application-card {
  border: 1px solid var(--card-border);
  background: linear-gradient(180deg, var(--surface-soft) 0%, var(--surface) 100%);
  border-radius: 16px;
  padding: 16px;
}

.card-top {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-main {
  display: grid;
  gap: 10px;
}

.editable-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 0.75rem;
  color: var(--text-soft);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.card-input {
  background: var(--surface);
  border: 1px solid var(--card-border);
  border-radius: 10px;
  padding: 10px 12px;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.status-select {
  flex: 1 1 160px;
  min-height: 42px;
  border: 1px solid var(--card-border);
  background: var(--surface-soft);
  color: var(--text);
  border-radius: 10px;
  padding: 10px 12px;
}

.tiny-btn {
  border: 1px solid var(--card-border);
  background: var(--surface);
  color: var(--text);
  border-radius: 10px;
  padding: 9px 10px;
  cursor: pointer;
  font-size: 0.76rem;
  font-weight: 600;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  min-height: 36px;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  border: 1px solid transparent;
  line-height: 1;
}

.status-Enviado,
.status-select option[value="Enviado"] {
  background: var(--sent-soft);
  border-color: rgba(79, 70, 229, 0.22);
  color: var(--sent);
}

.status-En\ proceso,
.status-select option[value="En proceso"] {
  background: var(--process-soft);
  border-color: rgba(217, 119, 6, 0.22);
  color: var(--process);
}

.status-Rechazado,
.status-select option[value="Rechazado"] {
  background: var(--reject-soft);
  border-color: rgba(220, 38, 38, 0.22);
  color: var(--reject);
}

.status-Oferta,
.status-select option[value="Oferta"] {
  background: var(--offer-soft);
  border-color: rgba(5, 150, 105, 0.2);
  color: var(--offer);
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: var(--text-soft);
  font-size: 0.85rem;
  margin: 8px 0;
}

.meta-row span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.notes {
  margin: 10px 0 0;
  color: var(--text-soft);
  line-height: 1.55;
  font-size: 0.92rem;
}

.empty-state {
  display: none;
  margin: 0;
  padding: 18px 8px 4px;
  color: var(--text-soft);
  text-align: center;
}

.empty-state.visible {
  display: block;
}

@media (min-width: 700px) {
  .app-shell {
    padding-top: 30px;
  }

  .content {
    grid-template-columns: minmax(300px, 420px) minmax(0, 1fr);
    align-items: start;
  }

  .field-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .card-top {
    flex-direction: row;
    justify-content: space-between;
  }

  .card-main {
    flex: 1;
  }

  .card-actions {
    align-items: flex-start;
    justify-content: flex-end;
  }

  .list-toolbar {
    grid-template-columns: 1.5fr 0.8fr;
  }
}

@media (max-width: 420px) {
  .tiny-btn,
  .status-select {
    width: 100%;
  }
}
