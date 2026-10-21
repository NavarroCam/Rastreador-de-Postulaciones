const STORAGE_KEY = "job-applications";
const STATUS_OPTIONS = ["Enviado", "En proceso", "Rechazado", "Oferta"];
const DEFAULT_APPLICATIONS = [
  {
    id: 1,
    company: "Northwind Studio",
    role: "Frontend Developer",
    date: "2026-10-12",
    status: "En proceso",
    notes: "Entrevista técnica agendada para el viernes. Revisar portafolio y preparar ejemplos.",
    attachment: "",
    reminder: "",
  },
  {
    id: 2,
    company: "BluePeak",
    role: "Product Designer",
    date: "2026-10-04",
    status: "Enviado",
    notes: "CV enviado con portfolio actualizado. Seguir seguimiento en 7 días.",
    attachment: "",
    reminder: "",
  },
  {
    id: 3,
    company: "Verde Systems",
    role: "QA Analyst",
    date: "2026-09-27",
    status: "Rechazado",
    notes: "Respuesta negativa. Solicitar feedback para mejorar perfil y aplicaciones futuras.",
    attachment: "",
    reminder: "",
  },
];

let applications = loadApplications();

const form = document.querySelector("#applicationForm");
const listPanel = document.querySelector(".list-panel");
const applicationsList = document.querySelector("#applicationsList");
const emptyState = document.querySelector("#emptyState");
const countBadge = document.querySelector("#countBadge");
const themeToggle = document.querySelector("#themeToggle");
let searchTerm = "";
let statusFilter = "all";

function loadApplications() {
  try {
    const savedApplications = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(savedApplications) && savedApplications.length > 0) {
      return savedApplications;
    }
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
  }
}

function formatDate(dateString) {
  if (!dateString) return "Sin fecha";
  const date = new Date(dateString + "T12:00:00");
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function ensureListControls() {
  const toolbar = document.createElement("div");
  toolbar.className = "list-toolbar";
  toolbar.innerHTML = `
    <input
      id="searchInput"
      type="search"
      placeholder="Buscar empresa o rol"
      aria-label="Buscar postulaciones"
    />
    <select id="statusFilter" aria-label="Filtrar por estado">
      <option value="all">Todos</option>
      ${STATUS_OPTIONS.map(
        (status) => `<option value="${status}">${status}</option>`
      ).join("")}
    </select>
  `;

  const currentToolbar = listPanel.querySelector(".list-toolbar");
  if (!currentToolbar) {
    listPanel.insertBefore(toolbar, applicationsList);
  }

  const searchInput = document.querySelector("#searchInput");
  const statusSelect = document.querySelector("#statusFilter");

  if (searchInput) {
    searchInput.value = searchTerm;
    searchInput.addEventListener("input", (event) => {
      searchTerm = event.target.value.trim().toLowerCase();
      renderApplications();
    });
  }

  if (statusSelect) {
    statusSelect.value = statusFilter;
    statusSelect.addEventListener("change", (event) => {
      statusFilter = event.target.value;
      renderApplications();
    });
  }
}

function getVisibleApplications() {
  return applications.filter((item) => {
    const matchesSearch = !searchTerm || `${item.company} ${item.role}`.toLowerCase().includes(searchTerm);
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
}

function renderApplications() {
  applicationsList.innerHTML = "";

  const sortedApplications = [...getVisibleApplications()].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  sortedApplications.forEach((item) => {
    const card = document.createElement("article");
    card.className = "application-card";
    card.dataset.status = item.status;

    card.innerHTML = `
      <div class="card-top">
        <div class="card-main">
          <div class="editable-field">
            <label class="field-label">Empresa</label>
            <input
              class="card-input company-input"
              data-field="company"
              data-id="${item.id}"
              value="${escapeHtml(item.company)}"
            />
          </div>
          <div class="editable-field">
            <label class="field-label">Rol</label>
            <input
              class="card-input role-input"
              data-field="role"
              data-id="${item.id}"
              value="${escapeHtml(item.role)}"
            />
          </div>
        </div>
        <div class="card-actions">
          <select class="status-select" data-id="${item.id}" aria-label="Cambiar estado de postulación">
            ${STATUS_OPTIONS.map(
              (status) => `<option value="${status}" ${status === item.status ? "selected" : ""}>${status}</option>`
            ).join("")}
          </select>
          <button class="tiny-btn import-linkedin" data-action="import-linkedin" data-id="${item.id}" type="button">LinkedIn</button>
          <button class="tiny-btn reminder-btn" data-action="reminder" data-id="${item.id}" type="button">Recordatorio</button>
          <button class="tiny-btn attachment-btn" data-action="attachment" data-id="${item.id}" type="button">Adjuntar CV</button>
          <button class="tiny-btn delete-btn" data-action="delete" data-id="${item.id}" type="button">Eliminar</button>
        </div>
      </div>
      <div class="meta-row">
        <span>📅 ${formatDate(item.date)}</span>
        ${item.attachment ? `<span>📎 ${item.attachment}</span>` : ""}
        ${item.reminder ? `<span>⏰ ${formatDate(item.reminder)}</span>` : ""}
      </div>
      ${item.notes ? `<p class="notes">${escapeHtml(item.notes)}</p>` : ""}
    `;

    applicationsList.appendChild(card);
  });

  countBadge.textContent = String(sortedApplications.length);
  emptyState.classList.toggle("visible", sortedApplications.length === 0);
}

function saveTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("application-theme", theme);

  const isDark = theme === "dark";
  themeToggle.querySelector(".toggle-icon").textContent = isDark ? "☀️" : "🌙";
  themeToggle.querySelector(".toggle-text").textContent = isDark ? "Claro" : "Oscuro";
}

function initializeTheme() {
  const savedTheme = localStorage.getItem("application-theme");
  const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  saveTheme(savedTheme || (preferredDark ? "dark" : "light"));
}

function updateApplicationField(id, field, value) {
  const item = applications.find((app) => app.id === Number(id));
  if (!item) return;

  item[field] = value;
  saveApplications();
  renderApplications();
}

function handleStatusChange(event) {
  const select = event.target.closest(".status-select");
  if (!select) return;

  const appId = Number(select.dataset.id);
  const newStatus = select.value;
  const item = applications.find((app) => app.id === appId);

  if (!item) return;

  item.status = newStatus;
  saveApplications();
  renderApplications();
}

function handleCardInput(event) {
  const input = event.target.closest(".card-input");
  if (!input) return;

  const field = input.dataset.field;
  const id = Number(input.dataset.id);
  const value = input.value.trim();

  if (!field || !id) return;

  updateApplicationField(id, field, value);
}

function handleAttachment(event) {
  const button = event.target.closest(".attachment-btn");
  if (!button) return;

  const id = Number(button.dataset.id);
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".pdf,.doc,.docx";

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const item = applications.find((app) => app.id === id);
      if (!item) return;

      item.attachment = file.name;
      item.attachmentData = reader.result;
      saveApplications();
      renderApplications();
    };

    reader.readAsDataURL(file);
  });

  fileInput.click();
}

function handleReminder(event) {
  const button = event.target.closest(".reminder-btn");
  if (!button) return;

  const id = Number(button.dataset.id);
  const item = applications.find((app) => app.id === id);
  if (!item) return;

  const reminderDate = prompt(
    "Ingresá la fecha del recordatorio (YYYY-MM-DD):",
    item.reminder || new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  );

  if (!reminderDate) return;

  item.reminder = reminderDate;
  saveApplications();
  renderApplications();

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Recordatorio de postulación", {
      body: `${item.company} - ${item.role}`,
    });
  }
}

function handleLinkedInImport(event) {
  const button = event.target.closest(".import-linkedin");
  if (!button) return;

  const id = Number(button.dataset.id);
  const url = prompt(
    "Pegá la URL de LinkedIn que quieras importar:",
    "https://www.linkedin.com/jobs/view/1234567890"
  );

  if (!url) return;

  try {
    const parsed = new URL(url);
    const item = applications.find((app) => app.id === id);
    if (!item) return;

    const companyMatch = parsed.pathname.match(/\/company\/([^/]+)/i);
    const titleMatch = parsed.pathname.match(/\/jobs\/view\//i);

    item.company = companyMatch ? decodeURIComponent(companyMatch[1]).replace(/-/g, " ") : "LinkedIn";
    item.role = titleMatch ? "Vacante importada desde LinkedIn" : "Cargo importado";
    item.notes = item.notes ? `${item.notes} | Importado desde LinkedIn.` : "Importado desde LinkedIn.";

    saveApplications();
    renderApplications();
  } catch (error) {
    console.warn("URL de LinkedIn inválida.", error);
  }
}

function handleDeleteApplication(event) {
  const button = event.target.closest(".delete-btn");
  if (!button) return;

  const id = Number(button.dataset.id);
  const item = applications.find((app) => app.id === id);

  if (!item) return;

  const confirmed = window.confirm(`¿Eliminar la postulación de ${item.company}?`);
  if (!confirmed) return;

  applications = applications.filter((app) => app.id !== id);
  saveApplications();
  renderApplications();
}

applicationsList.addEventListener("change", (event) => {
  handleStatusChange(event);
  handleAttachment(event);
});

applicationsList.addEventListener("input", (event) => {
  handleCardInput(event);
});

applicationsList.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]");
  if (!action) return;

  const actionName = action.dataset.action;

  if (actionName === "delete") {
    handleDeleteApplication(event);
    return;
  }

  if (actionName === "reminder") {
    handleReminder(event);
  }

  if (actionName === "attachment") {
    handleAttachment(event);
  }

  if (actionName === "import-linkedin") {
    handleLinkedInImport(event);
  }
});

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  saveTheme(nextTheme);
});

ensureListControls();
initializeTheme();
renderApplications();

if ("Notification" in window && Notification.permission === "default") {
  Notification.requestPermission().catch(() => {});
}

if (!form) {
  console.warn("No se encontró el formulario principal. La lógica sigue funcionando en la lista.");
}

window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEY) {
    try {
      const nextApplications = JSON.parse(event.newValue || "[]");
      if (Array.isArray(nextApplications)) {
        applications = nextApplications;
        renderApplications();
      }
    } catch (error) {
      console.warn("No se pudo sincronizar el almacenamiento local.", error);
    }
  }
});

window.addEventListener("beforeunload", () => {
  saveApplications();
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const company = formData.get("company").toString().trim();
  const role = formData.get("role").toString().trim();
  const date = formData.get("date").toString();
  const status = formData.get("status").toString();
  const notes = formData.get("notes").toString().trim();

  if (!company || !role || !date) {
    return;
  }

  applications.push({
    id: Date.now(),
    company,
    role,
    date,
    status: STATUS_OPTIONS.includes(status) ? status : "Enviado",
    notes,
    attachment: "",
    reminder: "",
  });

  saveApplications();
  form.reset();
  document.querySelector("#status").value = "Enviado";
  renderApplications();
});

renderApplications();
