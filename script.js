// ---------- Configuración ----------
const STORAGE_KEY = "job-applications";
const THEME_KEY = "application-theme";

const STATUSES = [
  { value: "Enviado", key: "sent" },
  { value: "En proceso", key: "process" },
  { value: "Rechazado", key: "reject" },
  { value: "Oferta", key: "offer" },
];
const STATUS_VALUES = STATUSES.map((s) => s.value);

const DEFAULT_APPLICATIONS = [
  {
    id: 1,
    company: "Northwind Studio",
    role: "Frontend Developer",
    date: "2026-10-12",
    status: "En proceso",
    notes: "Entrevista técnica agendada para el viernes. Revisar portafolio y preparar ejemplos.",
    link: "",
    cv: "",
    reminder: "",
  },
  {
    id: 2,
    company: "BluePeak",
    role: "Product Designer",
    date: "2026-10-04",
    status: "Enviado",
    notes: "CV enviado con portfolio actualizado. Hacer seguimiento en 7 días.",
    link: "",
    cv: "",
    reminder: "",
  },
  {
    id: 3,
    company: "Verde Systems",
    role: "QA Analyst",
    date: "2026-09-27",
    status: "Rechazado",
    notes: "Respuesta negativa. Pedir feedback para mejorar el perfil.",
    link: "",
    cv: "",
    reminder: "",
  },
];

// ---------- Estado ----------
let applications = loadApplications();
let searchTerm = "";
let statusFilter = "all";
let editingId = null;

// ---------- Elementos ----------
const form = document.querySelector("#applicationForm");
const list = document.querySelector("#applicationsList");
const pipelineBar = document.querySelector("#pipelineBar");
const statusFilters = document.querySelector("#statusFilters");
const countText = document.querySelector("#countText");
const searchInput = document.querySelector("#searchInput");
const emptyState = document.querySelector("#emptyState");
const emptyTitle = document.querySelector("#emptyTitle");
const emptyText = document.querySelector("#emptyText");
const emptyAction = document.querySelector("#emptyAction");
const themeToggle = document.querySelector("#themeToggle");
const toast = document.querySelector("#toast");

// ---------- Datos ----------
function normalize(item) {
  // Acepta datos guardados por la versión anterior (attachment, attachmentData).
  return {
    id: Number(item.id) || Date.now() + Math.random(),
    company: String(item.company || "").trim(),
    role: String(item.role || "").trim(),
    date: String(item.date || ""),
    status: STATUS_VALUES.includes(item.status) ? item.status : "Enviado",
    notes: String(item.notes || ""),
    link: String(item.link || ""),
    cv: String(item.cv || item.attachment || ""),
    reminder: String(item.reminder || ""),
  };
}

function loadApplications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // Solo la primera vez (nunca se guardó nada) se cargan los ejemplos.
    if (raw === null) return structuredClone(DEFAULT_APPLICATIONS);
    const saved = JSON.parse(raw);
    if (Array.isArray(saved)) return saved.map(normalize);
  } catch (error) {
    console.warn("No se pudieron leer las postulaciones guardadas.", error);
  }
  return structuredClone(DEFAULT_APPLICATIONS);
}

function saveApplications() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  } catch (error) {
    console.warn("No se pudieron guardar las postulaciones.", error);
    showToast("No se pudo guardar. Revisá el espacio del navegador.");
  }
}

function findApplication(id) {
  return applications.find((app) => app.id === Number(id));
}

// ---------- Utilidades ----------
function todayString() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().slice(0, 10);
}

function formatDate(dateString) {
  if (!dateString) return "Sin fecha";
  const date = new Date(dateString + "T12:00:00");
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function safeUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

function statusKey(value) {
  return STATUSES.find((s) => s.value === value)?.key || "sent";
}

function plural(count, one, many) {
  return `${count} ${count === 1 ? one : many}`;
}

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2600);
}

const ICONS = {
  calendar:
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
  bell:
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15Z"/><path d="M10 20.5a2 2 0 0 0 4 0"/></svg>',
  link:
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
  file:
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/></svg>',
};

// ---------- Render ----------
function getVisibleApplications() {
  return applications
    .filter((item) => {
      const text = `${item.company} ${item.role}`.toLowerCase();
      const matchesSearch = !searchTerm || text.includes(searchTerm);
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => (b.date || "").localeCompare(a.date || "") || b.id - a.id);
}

function renderPipeline() {
  const counts = Object.fromEntries(STATUS_VALUES.map((v) => [v, 0]));
  applications.forEach((item) => counts[item.status]++);

  pipelineBar.innerHTML = STATUSES.filter((s) => counts[s.value] > 0)
    .map(
      (s) =>
        `<span class="pipeline-segment" data-status="${s.key}" style="flex-grow:${counts[s.value]}"></span>`
    )
    .join("");

  const chips = [
    { value: "all", label: "Todas", count: applications.length, key: "" },
    ...STATUSES.map((s) => ({ value: s.value, label: s.value, count: counts[s.value], key: s.key })),
  ];

  statusFilters.innerHTML = chips
    .map(
      (chip) => `
        <button class="filter-chip" type="button" data-filter="${chip.value}"
          aria-pressed="${statusFilter === chip.value}">
          ${chip.key ? `<span class="chip-dot" data-status="${chip.key}"></span>` : ""}
          ${chip.label}
          <span class="chip-count">${chip.count}</span>
        </button>`
    )
    .join("");
}

function renderCard(item) {
  const key = statusKey(item.status);

  if (item.id === editingId) return renderEditCard(item, key);

  const url = safeUrl(item.link);
  const today = todayString();
  const isDue = item.reminder && item.reminder <= today && item.status !== "Rechazado";

  const meta = [`<li>${ICONS.calendar}<span>Aplicaste el ${formatDate(item.date)}</span></li>`];
  if (item.reminder) {
    meta.push(
      `<li class="${isDue ? "is-due" : ""}">${ICONS.bell}<span>${
        isDue ? "Seguimiento pendiente desde el" : "Seguimiento el"
      } ${formatDate(item.reminder)}</span></li>`
    );
  }
  if (url) {
    meta.push(
      `<li>${ICONS.link}<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Ver vacante</a></li>`
    );
  }
  if (item.cv) {
    meta.push(`<li>${ICONS.file}<span>${escapeHtml(item.cv)}</span></li>`);
  }

  return `
    <article class="app" data-status="${key}" data-id="${item.id}">
      <div class="app-head">
        <div class="app-title">
          <h3 class="app-company">${escapeHtml(item.company)}</h3>
          <p class="app-role">${escapeHtml(item.role)}</p>
        </div>
        <select class="status-select" data-id="${item.id}"
          aria-label="Estado de la postulación a ${escapeHtml(item.company)}">
          ${STATUS_VALUES.map(
            (v) => `<option value="${v}" ${v === item.status ? "selected" : ""}>${v}</option>`
          ).join("")}
        </select>
      </div>
      <ul class="app-meta">${meta.join("")}</ul>
      ${item.notes ? `<p class="app-notes">${escapeHtml(item.notes)}</p>` : ""}
      <div class="app-actions">
        <button class="btn-text" type="button" data-action="edit" data-id="${item.id}">Editar</button>
        <button class="btn-text danger" type="button" data-action="delete" data-id="${item.id}">Eliminar</button>
      </div>
    </article>`;
}

function renderEditCard(item, key) {
  const id = item.id;
  return `
    <article class="app" data-status="${key}" data-id="${id}">
      <form class="app-edit" data-id="${id}" novalidate>
        <h3 class="edit-heading">Editar postulación</h3>
        <div class="field">
          <label for="edit-company-${id}">Empresa</label>
          <input id="edit-company-${id}" name="company" type="text" value="${escapeHtml(item.company)}" required />
        </div>
        <div class="field">
          <label for="edit-role-${id}">Rol</label>
          <input id="edit-role-${id}" name="role" type="text" value="${escapeHtml(item.role)}" required />
        </div>
        <div class="field-row">
          <div class="field">
            <label for="edit-date-${id}">Fecha</label>
            <input id="edit-date-${id}" name="date" type="date" value="${escapeHtml(item.date)}" required />
          </div>
          <div class="field">
            <label for="edit-reminder-${id}">Seguimiento <span class="optional">(opcional)</span></label>
            <input id="edit-reminder-${id}" name="reminder" type="date" value="${escapeHtml(item.reminder)}" />
          </div>
        </div>
        <div class="field">
          <label for="edit-link-${id}">Link de la vacante <span class="optional">(opcional)</span></label>
          <input id="edit-link-${id}" name="link" type="url" inputmode="url"
            placeholder="https://www.linkedin.com/jobs/view/…" value="${escapeHtml(item.link)}" />
        </div>
        <div class="field">
          <label for="edit-cv-${id}">CV enviado <span class="optional">(opcional, se guarda solo el nombre)</span></label>
          ${
            item.cv
              ? `<div class="cv-current"><span>${escapeHtml(item.cv)}</span>
                   <button class="btn-text danger" type="button" data-action="remove-cv" data-id="${id}">Quitar</button>
                 </div>`
              : ""
          }
          <input id="edit-cv-${id}" name="cv" type="file" accept=".pdf,.doc,.docx" />
        </div>
        <div class="field">
          <label for="edit-notes-${id}">Notas de seguimiento</label>
          <textarea id="edit-notes-${id}" name="notes" rows="3">${escapeHtml(item.notes)}</textarea>
        </div>
        <div class="edit-actions">
          <button class="btn btn-primary" type="submit">Guardar cambios</button>
          <button class="btn btn-quiet" type="button" data-action="cancel-edit">Cancelar</button>
        </div>
      </form>
    </article>`;
}

function renderList() {
  const visible = getVisibleApplications();
  list.innerHTML = visible.map(renderCard).join("");

  const total = applications.length;
  countText.textContent =
    visible.length === total
      ? plural(total, "postulación", "postulaciones")
      : `${visible.length} de ${total}`;

  if (total === 0) {
    showEmpty(
      "Todavía no cargaste postulaciones",
      "Agregá la primera con el formulario y vas a poder seguir su estado desde acá.",
      "Agregar la primera",
      "focus-form"
    );
  } else if (visible.length === 0) {
    showEmpty(
      "Ninguna postulación coincide",
      "Probá con otra búsqueda o mostrá todas las postulaciones.",
      "Ver todas",
      "clear-filters"
    );
  } else {
    emptyState.hidden = true;
  }
}

function showEmpty(title, text, actionLabel, action) {
  emptyTitle.textContent = title;
  emptyText.textContent = text;
  emptyAction.textContent = actionLabel;
  emptyAction.dataset.action = action;
  emptyAction.hidden = false;
  emptyState.hidden = false;
}

function render() {
  renderPipeline();
  renderList();
}

// ---------- Formulario principal ----------
function setFieldError(input, errorEl, hasError) {
  input.setAttribute("aria-invalid", hasError ? "true" : "false");
  if (errorEl) errorEl.hidden = !hasError;
  if (hasError) input.setAttribute("aria-describedby", errorEl.id);
  else input.removeAttribute("aria-describedby");
}

function resetForm() {
  form.reset();
  form.elements.date.value = todayString();
  form.elements.status.value = "Enviado";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const company = form.elements.company.value.trim();
  const role = form.elements.role.value.trim();
  const date = form.elements.date.value;

  setFieldError(form.elements.company, document.querySelector("#companyError"), !company);
  setFieldError(form.elements.role, document.querySelector("#roleError"), !role);
  setFieldError(form.elements.date, document.querySelector("#dateError"), !date);

  if (!company || !role || !date) {
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  applications.push({
    id: Date.now(),
    company,
    role,
    date,
    status: STATUS_VALUES.includes(form.elements.status.value) ? form.elements.status.value : "Enviado",
    notes: form.elements.notes.value.trim(),
    link: "",
    cv: "",
    reminder: "",
  });

  saveApplications();
  resetForm();
  render();
  showToast(`Postulación a ${company} agregada`);
});

form.addEventListener("input", (event) => {
  const input = event.target;
  if (input.getAttribute("aria-invalid") === "true" && input.value.trim()) {
    setFieldError(input, document.querySelector(`#${input.id}Error`), false);
  }
});

// ---------- Lista: acciones ----------
list.addEventListener("change", (event) => {
  const select = event.target.closest(".status-select");
  if (!select) return;

  const item = findApplication(select.dataset.id);
  if (!item) return;

  item.status = select.value;
  saveApplications();
  render();
  showToast(`${item.company}: ${item.status}`);
});

list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const item = findApplication(button.dataset.id);

  if (action === "edit" && item) {
    editingId = item.id;
    renderList();
    document.querySelector(`#edit-company-${item.id}`)?.focus();
  }

  if (action === "cancel-edit") {
    const id = editingId;
    editingId = null;
    renderList();
    document.querySelector(`.app[data-id="${id}"] [data-action="edit"]`)?.focus();
  }

  if (action === "remove-cv" && item) {
    // Se aplica al guardar; mientras tanto se oculta del formulario.
    button.closest(".cv-current").remove();
    list.querySelector(`.app-edit[data-id="${item.id}"]`).dataset.removeCv = "true";
  }

  if (action === "delete" && item) {
    if (!window.confirm(`¿Eliminar la postulación a ${item.company}?`)) return;
    applications = applications.filter((app) => app.id !== item.id);
    saveApplications();
    render();
    showToast(`Postulación a ${item.company} eliminada`);
  }
});

list.addEventListener("submit", (event) => {
  const editForm = event.target.closest(".app-edit");
  if (!editForm) return;
  event.preventDefault();

  const item = findApplication(editForm.dataset.id);
  if (!item) return;

  const company = editForm.elements.company.value.trim();
  const role = editForm.elements.role.value.trim();
  const date = editForm.elements.date.value;

  [editForm.elements.company, editForm.elements.role, editForm.elements.date].forEach((input) =>
    input.setAttribute("aria-invalid", input.value.trim() ? "false" : "true")
  );
  if (!company || !role || !date) {
    editForm.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  const file = editForm.elements.cv.files[0];

  item.company = company;
  item.role = role;
  item.date = date;
  item.reminder = editForm.elements.reminder.value;
  item.link = editForm.elements.link.value.trim();
  item.notes = editForm.elements.notes.value.trim();
  if (file) item.cv = file.name;
  else if (editForm.dataset.removeCv === "true") item.cv = "";

  editingId = null;
  saveApplications();
  render();
  document.querySelector(`.app[data-id="${item.id}"] [data-action="edit"]`)?.focus();
  showToast("Cambios guardados");
});

// ---------- Filtros y búsqueda ----------
statusFilters.addEventListener("click", (event) => {
  const chip = event.target.closest("[data-filter]");
  if (!chip) return;
  statusFilter = chip.dataset.filter;
  render();
});

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value.trim().toLowerCase();
  renderList();
});

emptyAction.addEventListener("click", () => {
  if (emptyAction.dataset.action === "clear-filters") {
    statusFilter = "all";
    searchTerm = "";
    searchInput.value = "";
    render();
  } else {
    form.elements.company.focus();
  }
});

// ---------- Tema ----------
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"
  );
}

themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    /* sin almacenamiento: el tema dura hasta recargar */
  }
});

// ---------- Sincronización entre pestañas ----------
window.addEventListener("storage", (event) => {
  if (event.key !== STORAGE_KEY) return;
  try {
    const next = JSON.parse(event.newValue || "[]");
    if (Array.isArray(next)) {
      applications = next.map(normalize);
      editingId = null;
      render();
    }
  } catch (error) {
    console.warn("No se pudo sincronizar con otra pestaña.", error);
  }
});

// ---------- Inicio ----------
applyTheme(document.documentElement.dataset.theme || "light");
resetForm();
render();

