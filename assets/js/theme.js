/* ============================================
   THEME.JS - Sistema de Tema Claro/Oscuro
   ============================================

   Este archivo maneja:
   - Cambio entre tema claro y oscuro
   - Guardado de preferencia en localStorage
   - Detección de preferencia del sistema
   - Inicialización del tema al cargar
   ============================================ */

// ============================================
// CONSTANTES
// ============================================

const THEME_KEY = 'preferred-theme';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  initThemeToggle();
});

// ============================================
// OBTENER TEMA PREFERIDO
// ============================================

/**
 * Obtiene el tema preferido del usuario
 * Prioridad: 1. localStorage, 2. preferencia del sistema, 3. light (default)
 * @returns {string} 'light' o 'dark'
 */
function getPreferredTheme() {
  // 1. Verificar si hay tema guardado en localStorage
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    return savedTheme;
  }

  // 2. Verificar preferencia del sistema
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return THEME_DARK;
  }

  // 3. Default: light
  return THEME_LIGHT;
}

// ============================================
// APLICAR TEMA
// ============================================

/**
 * Aplica el tema al documento
 * @param {string} theme - 'light' o 'dark'
 */
function applyTheme(theme) {
  // Aplicar atributo data-theme al documento
  document.documentElement.setAttribute('data-theme', theme);

  // Guardar en localStorage
  localStorage.setItem(THEME_KEY, theme);

  // Actualizar icono del botón si existe
  updateThemeToggleIcon(theme);
}

// ============================================
// CAMBIAR TEMA
// ============================================

/**
 * Cambia entre tema claro y oscuro
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || THEME_LIGHT;
  const newTheme = currentTheme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
  applyTheme(newTheme);
}

// ============================================
// ACTUALIZAR ICONO DEL BOTÓN
// ============================================

/**
 * Actualiza el icono del botón de tema
 * @param {string} theme - 'light' o 'dark'
 */
function updateThemeToggleIcon(theme) {
  const themeToggle = document.querySelector('.theme-toggle');

  if (!themeToggle) return;

  // Iconos SVG simples
  const sunIcon = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zm6.364 1.636a1 1 0 00-1.414 0l-.707.707a1 1 0 001.414 1.414l.707-.707a1 1 0 000-1.414zM17 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-2.05 5.364l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zM10 17a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-5.364-.636a1 1 0 001.414 0l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 000 1.414zM4 10a1 1 0 01-1 1H2a1 1 0 110-2h1a1 1 0 011 1zm.636-5.364l.707.707a1 1 0 001.414-1.414l-.707-.707A1 1 0 004.636 4.636zM10 7a3 3 0 100 6 3 3 0 000-6z"/>
    </svg>
  `;

  const moonIcon = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
    </svg>
  `;

  // Actualizar icono según el tema
  if (theme === THEME_DARK) {
    themeToggle.innerHTML = sunIcon;
    themeToggle.setAttribute('aria-label', 'Cambiar a tema claro');
  } else {
    themeToggle.innerHTML = moonIcon;
    themeToggle.setAttribute('aria-label', 'Cambiar a tema oscuro');
  }
}

// ============================================
// INICIALIZAR TEMA
// ============================================

/**
 * Inicializa el tema al cargar la página
 * Aplica el tema guardado o preferido
 */
function initTheme() {
  const preferredTheme = getPreferredTheme();
  applyTheme(preferredTheme);
}

// ============================================
// INICIALIZAR BOTÓN DE TEMA
// ============================================

/**
 * Inicializa el botón de cambio de tema
 * Añade event listener
 */
function initThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');

  if (!themeToggle) return;

  // Añadir event listener
  themeToggle.addEventListener('click', toggleTheme);

  // Actualizar icono inicial
  const currentTheme = document.documentElement.getAttribute('data-theme') || THEME_LIGHT;
  updateThemeToggleIcon(currentTheme);
}

// ============================================
// ESCUCHAR CAMBIOS EN PREFERENCIA DEL SISTEMA
// ============================================

/**
 * Escucha cambios en la preferencia de color del sistema
 * Solo aplica si no hay tema guardado por el usuario
 */
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    // Solo aplicar si no hay preferencia guardada
    if (!localStorage.getItem(THEME_KEY)) {
      const newTheme = e.matches ? THEME_DARK : THEME_LIGHT;
      applyTheme(newTheme);
    }
  });
}

// ============================================
// EXPORTAR FUNCIONES (opcional para uso modular)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getPreferredTheme,
    applyTheme,
    toggleTheme,
    initTheme,
    initThemeToggle
  };
}
