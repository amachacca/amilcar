;(() => {
  const themeStorageKey = "amilcar-theme"
  const DARK_CLASS = "dark-theme"

  function getPreferredTheme() {
    const storedTheme = localStorage.getItem(themeStorageKey)
    if (storedTheme === "dark" || storedTheme === "light") return storedTheme

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }

  function applyTheme(theme) {
    const isDark = theme === "dark"

    document.documentElement.classList.toggle(DARK_CLASS, isDark)
    if (document.body) {
      document.body.classList.toggle(DARK_CLASS, isDark)
    }

    const label = isDark ? "☀️ Tema claro" : "🌙 Tema oscuro"
    const icon = isDark ? "☀️" : "🌙"
    const ariaLabel = isDark ? "Activar tema claro" : "Activar tema oscuro"

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const style = button.dataset.themeToggleStyle || "text"
      button.textContent = style === "icon" ? icon : label
      button.setAttribute("aria-label", ariaLabel)
    })
  }

  function toggleTheme() {
    const nextTheme = document.documentElement.classList.contains(DARK_CLASS) ? "light" : "dark"
    localStorage.setItem(themeStorageKey, nextTheme)
    applyTheme(nextTheme)
  }

  // Apply ASAP to avoid flash of wrong theme.
  document.documentElement.classList.toggle(DARK_CLASS, getPreferredTheme() === "dark")

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(getPreferredTheme())

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", toggleTheme)
    })
  })
})()
