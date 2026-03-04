// DOM Elements
const menuToggle = document.querySelector(".menu-toggle")
const sidebar = document.getElementById("sidebar")
const overlay = document.getElementById("overlay")
const navLinks = document.querySelectorAll(".nav-link")
const sections = document.querySelectorAll(".section")

const themeToggle = document.getElementById("themeToggle")
const themeToggleSidebar = document.getElementById("themeToggleSidebar")
const themeStorageKey = "amilcar-theme"

function setTheme(theme) {
  const isDarkMode = theme === "dark"
  document.body.classList.toggle("dark-theme", isDarkMode)

  const label = isDarkMode ? "☀️ Tema claro" : "🌙 Tema oscuro"
  const ariaLabel = isDarkMode ? "Activar tema claro" : "Activar tema oscuro"

  ;[themeToggle, themeToggleSidebar].forEach((button) => {
    if (!button) return

    button.textContent = button.id === "themeToggleSidebar" ? label : isDarkMode ? "☀️" : "🌙"
    button.setAttribute("aria-label", ariaLabel)
  })
}

function getPreferredTheme() {
  const storedTheme = localStorage.getItem(themeStorageKey)
  if (storedTheme === "dark" || storedTheme === "light") return storedTheme

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function toggleTheme() {
  const nextTheme = document.body.classList.contains("dark-theme") ? "light" : "dark"
  setTheme(nextTheme)
  localStorage.setItem(themeStorageKey, nextTheme)
}

function toggleMenu() {
  if (!menuToggle || !sidebar || !overlay) return

  menuToggle.classList.toggle("active")
  sidebar.classList.toggle("active")
  overlay.classList.toggle("active")
  document.body.style.overflow = sidebar.classList.contains("active") ? "hidden" : ""
}

function closeMenu() {
  if (!menuToggle || !sidebar || !overlay) return

  menuToggle.classList.remove("active")
  sidebar.classList.remove("active")
  overlay.classList.remove("active")
  document.body.style.overflow = ""
}

function setActiveNav(sectionId) {
  navLinks.forEach((link) => {
    const isActive = link.dataset.section === sectionId
    link.classList.toggle("active", isActive)
    link.setAttribute("aria-current", isActive ? "page" : "false")
  })
}

function scrollToSection(sectionId, { updateHistory = true, behavior = "smooth" } = {}) {
  const targetSection = document.getElementById(sectionId)
  if (!targetSection) return

  targetSection.scrollIntoView({ behavior, block: "start" })
  setActiveNav(sectionId)

  if (updateHistory) {
    history.pushState(null, "", `#${sectionId}`)
  }

  closeMenu()
}

function setupSectionObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

      if (visibleEntries.length > 0) {
        const activeSectionId = visibleEntries[0].target.id
        setActiveNav(activeSectionId)
      }
    },
    {
      root: null,
      threshold: [0.25, 0.5, 0.75],
      rootMargin: "-20% 0px -45% 0px",
    },
  )

  sections.forEach((section) => observer.observe(section))
}

if (menuToggle) menuToggle.addEventListener("click", toggleMenu)
if (overlay) overlay.addEventListener("click", closeMenu)

;[themeToggle, themeToggleSidebar].forEach((button) => {
  if (button) button.addEventListener("click", toggleTheme)
})

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault()
    const sectionId = link.dataset.section
    if (sectionId) scrollToSection(sectionId)
  })
})

window.addEventListener("popstate", () => {
  const sectionId = window.location.hash.slice(1) || "home"
  scrollToSection(sectionId, { updateHistory: false, behavior: "auto" })
})

document.addEventListener("DOMContentLoaded", () => {
  setTheme(getPreferredTheme())
  setupSectionObserver()

  const sectionId = window.location.hash.slice(1) || "home"
  scrollToSection(sectionId, { updateHistory: false, behavior: "auto" })
})

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && sidebar && sidebar.classList.contains("active")) {
    closeMenu()
  }
})
