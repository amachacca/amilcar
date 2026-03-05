/* ============================================
   NAVIGATION.JS - Sistema de Navegación
   ============================================

   Este archivo maneja:
   - Menú móvil (hamburguesa)
   - Indicador de página activa
   - Efecto scroll en header
   - Smooth scroll
   ============================================ */

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  initActiveNavLink();
  initScrollHeader();
  initSmoothScroll();
});

// ============================================
// MENÚ MÓVIL
// ============================================

/**
 * Inicializa el menú móvil hamburguesa
 * Añade event listener al botón toggle
 */
function initMobileMenu() {
  const toggle = document.querySelector('.navbar-toggle');
  const menu = document.querySelector('.navbar-menu');

  // Si no existen los elementos, salir
  if (!toggle || !menu) return;

  // Al hacer clic en el botón hamburguesa
  toggle.addEventListener('click', function() {
    // Toggle de clase active en botón y menú
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
  });

  // Cerrar menú al hacer clic en un enlace
  const menuLinks = menu.querySelectorAll('a');
  menuLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      toggle.classList.remove('active');
      menu.classList.remove('active');
    });
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', function(event) {
    const isClickInside = toggle.contains(event.target) || menu.contains(event.target);

    if (!isClickInside && menu.classList.contains('active')) {
      toggle.classList.remove('active');
      menu.classList.remove('active');
    }
  });
}

// ============================================
// INDICADOR DE PÁGINA ACTIVA
// ============================================

/**
 * Marca el enlace de navegación activo según la página actual
 * Compara la URL actual con los hrefs de los enlaces
 */
function initActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.navbar-menu a');

  navLinks.forEach(function(link) {
    const linkPath = new URL(link.href).pathname;

    // Comparar rutas
    // Para index.html o raíz
    if (currentPath === '/' || currentPath === '/index.html') {
      if (linkPath === '/' || linkPath === '/index.html') {
        link.classList.add('active');
      }
    }
    // Para otras páginas
    else if (currentPath.includes(linkPath) && linkPath !== '/' && linkPath !== '/index.html') {
      link.classList.add('active');
    }
  });
}

// ============================================
// EFECTO SCROLL EN HEADER
// ============================================

/**
 * Añade clase 'scrolled' al header cuando se hace scroll
 * Esto permite añadir sombra u otros efectos visuales
 */
function initScrollHeader() {
  const header = document.querySelector('header');

  if (!header) return;

  // Función que verifica el scroll
  function checkScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Verificar al cargar la página
  checkScroll();

  // Verificar al hacer scroll
  window.addEventListener('scroll', checkScroll);
}

// ============================================
// SMOOTH SCROLL
// ============================================

/**
 * Añade smooth scroll a los enlaces ancla (#)
 * Mejora la experiencia al navegar a secciones de la misma página
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      // Si es solo "#", no hacer nada
      if (href === '#') {
        e.preventDefault();
        return;
      }

      // Buscar el elemento objetivo
      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        // Calcular offset (altura del header)
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;

        // Scroll suave al elemento
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ============================================
// EXPORTAR FUNCIONES (opcional para uso modular)
// ============================================

// Si se usa como módulo ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initMobileMenu,
    initActiveNavLink,
    initScrollHeader,
    initSmoothScroll
  };
}
