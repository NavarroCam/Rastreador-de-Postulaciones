const STORAGE_KEY = "job-applications";
const DEFAULT_APPLICATIONS = [
  {
    id: 1,
    company: "Northwind Studio",
    role: "Frontend Developer",
    date: "2026-10-12",
    status: "En proceso",
    notes: "Entrevista técnica agendada para el viernes. Revisar portafolio y preparar ejemplos.",
  },
  {
    id: 2,
    company: "BluePeak",
    role: "Product Designer",
    date: "2026-10-04",
    status: "Enviado",
    notes: "CV enviado con portfolio actualizado. Seguir seguimiento en 7 días.",
  },
  {
    id: 3,
    company: "Verde Systems",
    role: "QA Analyst",
    date: "2026-09-27",
    status: "Rechazado",
    notes: "Respuesta negativa. Solicitar feedback para mejorar perfil y aplicaciones futuras.",
  },
];

const STATUS_OPTIONS = ["Enviado", "En proceso", "Rechazado", "Oferta"];

let applications = loadApplications();

const form = document.querySelector("#applicationForm");
const applicationsList = document.querySelector("#applicationsList");
const emptyState = document.querySelector("#emptyState");
const countBadge = document.querySelector("#countBadge");
const themeToggle = document.querySelector("#themeToggle");

function loadApplications() {
  try {
    const savedApplications = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (Array.isArray(savedApplications) && savedApplications.length > 0) {
      return savedApplications;
    }
  } catch (error) {
    console.warn("No se pudieron leer las postulaciones guardadas.", error);
  }

  return DEFAULT_APPLICATIONS;
}

function saveApplications() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  } catch (error) {
    console.warn("No se pudieron guardar las postulaciones.", error);
  }
}

function formatDate(dateString) {
  const date = new Date(dateString + "T12:00:00");
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function renderApplications() {
  applicationsList.innerHTML = "";

  const sortedApplications = [...applications].sort((a, b) => new Date(b.date) - new Date(a.date));

  sortedApplications.forEach((item) => {
    const card = document.createElement("article");
    card.className = "application-card";

    const formatStatusClass = item.status.replace(/\s+/g, "-");

    card.innerHTML = `
      <div class="card-top">
        <div>
          <h3 class="company-name">${item.company}</h3>
          <p class="role-name">${item.role}</p>
        </div>
        <span class="status-badge status-${formatStatusClass}">${item.status}</span>
      </div>
      <div class="meta-row">
        <span>📅 ${formatDate(item.date)}</span>
      </div>
      ${item.notes ? `<p class="notes">${item.notes}</p>` : ""}
    `;

    applicationsList.appendChild(card);
  });

  countBadge.textContent = String(applications.length);
  emptyState.classList.toggle("visible", applications.length === 0);
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

form.addEventListener("submit", (event) => {
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
  });

  saveApplications();

  form.reset();
  document.querySelector("#status").value = "Enviado";
  renderApplications();
});

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  saveTheme(nextTheme);
});

initializeTheme();
renderApplications();
