/* ============================================
   MAIN.JS - Funcionalidades Generales
   ============================================

   Este archivo maneja:
   - Animaciones de scroll
   - Lazy loading de imágenes
   - Formularios
   - Utilidades generales
   ============================================ */

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  initScrollAnimations();
  initLazyLoading();
  initForms();
});

// ============================================
// ANIMACIONES DE SCROLL
// ============================================

/**
 * Añade animaciones cuando los elementos entran en el viewport
 * Usa Intersection Observer para mejor performance
 */
function initScrollAnimations() {
  // Verificar si el navegador soporta Intersection Observer
  if (!('IntersectionObserver' in window)) {
    return;
  }

  // Configuración del observer
  const observerOptions = {
    threshold: 0.1, // 10% del elemento debe ser visible
    rootMargin: '0px 0px -50px 0px' // Trigger un poco antes
  };

  // Callback cuando un elemento entra en el viewport
  const observerCallback = function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        // Añadir clase para animación
        entry.target.classList.add('animate-in');

        // Dejar de observar el elemento
        observer.unobserve(entry.target);
      }
    });
  };

  // Crear observer
  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Observar elementos con clase .animate-on-scroll
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach(function(element) {
    observer.observe(element);
  });
}

// ============================================
// LAZY LOADING DE IMÁGENES
// ============================================

/**
 * Implementa lazy loading para imágenes
 * Las imágenes se cargan cuando están cerca del viewport
 */
function initLazyLoading() {
  // Verificar si el navegador soporta lazy loading nativo
  if ('loading' in HTMLImageElement.prototype) {
    // El navegador soporta lazy loading nativo
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(function(img) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  } else {
    // Fallback usando Intersection Observer
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      const images = document.querySelectorAll('img[data-src]');
      images.forEach(function(img) {
        imageObserver.observe(img);
      });
    }
  }
}

// ============================================
// MANEJO DE FORMULARIOS
// ============================================

/**
 * Inicializa la validación y manejo de formularios
 */
function initForms() {
  const forms = document.querySelectorAll('form[data-form]');

  forms.forEach(function(form) {
    form.addEventListener('submit', handleFormSubmit);

    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(function(input) {
      input.addEventListener('blur', function() {
        validateInput(this);
      });
    });
  });
}

/**
 * Maneja el envío del formulario
 * @param {Event} e - Evento de submit
 */
function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // Validar todos los campos
  let isValid = true;
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(function(input) {
    if (!validateInput(input)) {
      isValid = false;
    }
  });

  if (!isValid) {
    showFormMessage(form, 'Por favor, corrige los errores antes de enviar.', 'error');
    return;
  }

  // Deshabilitar botón de envío
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
  }

  // Aquí iría la lógica para enviar el formulario
  // Por ejemplo, usando fetch a un servicio como Formspree

  // Simulación de envío (eliminar en producción)
  setTimeout(function() {
    showFormMessage(form, 'Mensaje enviado correctamente. Te contactaré pronto.', 'success');
    form.reset();

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Enviar Mensaje';
    }
  }, 1500);
}

/**
 * Valida un campo de formulario
 * @param {HTMLElement} input - Input a validar
 * @returns {boolean} - true si es válido
 */
function validateInput(input) {
  const value = input.value.trim();
  const type = input.type;
  let isValid = true;
  let errorMessage = '';

  // Verificar si es requerido
  if (input.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = 'Este campo es obligatorio.';
  }

  // Validar email
  if (type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = 'Por favor, introduce un email válido.';
    }
  }

  // Validar longitud mínima
  if (input.hasAttribute('minlength')) {
    const minLength = parseInt(input.getAttribute('minlength'));
    if (value.length < minLength) {
      isValid = false;
      errorMessage = `Mínimo ${minLength} caracteres.`;
    }
  }

  // Mostrar/ocultar error
  showInputError(input, isValid, errorMessage);

  return isValid;
}

/**
 * Muestra u oculta el error de un input
 * @param {HTMLElement} input - Input
 * @param {boolean} isValid - Si es válido
 * @param {string} message - Mensaje de error
 */
function showInputError(input, isValid, message) {
  const formGroup = input.closest('.form-group');
  if (!formGroup) return;

  // Buscar o crear elemento de error
  let errorElement = formGroup.querySelector('.form-error');
  if (!errorElement) {
    errorElement = document.createElement('span');
    errorElement.className = 'form-error';
    formGroup.appendChild(errorElement);
  }

  if (!isValid) {
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  } else {
    input.classList.remove('error');
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
}

/**
 * Muestra un mensaje general en el formulario
 * @param {HTMLElement} form - Formulario
 * @param {string} message - Mensaje
 * @param {string} type - Tipo: 'success', 'error', 'info'
 */
function showFormMessage(form, message, type) {
  // Buscar o crear elemento de mensaje
  let messageElement = form.querySelector('.form-message');
  if (!messageElement) {
    messageElement = document.createElement('div');
    messageElement.className = 'form-message';
    form.insertBefore(messageElement, form.firstChild);
  }

  // Aplicar estilos según tipo
  messageElement.className = `form-message alert alert-${type}`;
  messageElement.textContent = message;
  messageElement.style.display = 'block';

  // Hacer scroll al mensaje
  messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Ocultar después de 5 segundos si es success
  if (type === 'success') {
    setTimeout(function() {
      messageElement.style.display = 'none';
    }, 5000);
  }
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Scroll suave a un elemento
 * @param {string} selector - Selector del elemento
 */
function scrollToElement(selector) {
  const element = document.querySelector(selector);
  if (!element) return;

  const headerHeight = document.querySelector('header').offsetHeight || 0;
  const targetPosition = element.offsetTop - headerHeight;

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
}

/**
 * Debounce function para optimizar eventos
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function}
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = function() {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ============================================
// EXPORTAR FUNCIONES (opcional)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    scrollToElement,
    debounce,
    showFormMessage
  };
}
