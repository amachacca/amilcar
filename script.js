// DOM Elements
const menuToggle = document.querySelector(".menu-toggle")
const sidebar = document.getElementById("sidebar")
const overlay = document.getElementById("overlay")
const navLinks = document.querySelectorAll(".nav-link")
const sections = document.querySelectorAll(".section")

// Toggle mobile menu
function toggleMenu() {
  menuToggle.classList.toggle("active")
  sidebar.classList.toggle("active")
  overlay.classList.toggle("active")
  document.body.style.overflow = sidebar.classList.contains("active") ? "hidden" : ""
}

// Close mobile menu
function closeMenu() {
  menuToggle.classList.remove("active")
  sidebar.classList.remove("active")
  overlay.classList.remove("active")
  document.body.style.overflow = ""
}

// Show section
function showSection(sectionId) {
  // Hide all sections
  sections.forEach((section) => {
    section.classList.remove("active")
  })

  // Show target section
  const targetSection = document.getElementById(sectionId)
  if (targetSection) {
    targetSection.classList.add("active")
  }

  // Update active nav link
  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.dataset.section === sectionId) {
      link.classList.add("active")
    }
  })

  // Close mobile menu after navigation
  closeMenu()

  // Scroll to top of section
  window.scrollTo(0, 0)
}

// Event Listeners
if (menuToggle) {
  menuToggle.addEventListener("click", toggleMenu)
}

if (overlay) {
  overlay.addEventListener("click", closeMenu)
}

// Navigation click handler
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault()
    const sectionId = link.dataset.section
    showSection(sectionId)

    // Update URL hash without scrolling
    history.pushState(null, null, `#${sectionId}`)
  })
})

// Handle browser back/forward buttons
window.addEventListener("popstate", () => {
  const hash = window.location.hash.slice(1) || "home"
  showSection(hash)
})

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  // Check for hash in URL
  const hash = window.location.hash.slice(1)
  if (hash && document.getElementById(hash)) {
    showSection(hash)
  } else if (document.getElementById("home")) {
    showSection("home")
  }
})

// Handle escape key to close menu
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && sidebar && sidebar.classList.contains("active")) {
    closeMenu()
  }
})

// Smooth scroll for anchor links within sections
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  if (!anchor.classList.contains("nav-link")) {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href").slice(1)
      if (document.getElementById(targetId)) {
        e.preventDefault()
        showSection(targetId)
        history.pushState(null, null, `#${targetId}`)
      }
    })
  }
})
