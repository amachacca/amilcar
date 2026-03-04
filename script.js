const navLinks = document.querySelectorAll('.top-nav-menu .nav-link')
const sections = document.querySelectorAll('.section')
const logoLink = document.querySelector('.logo-link[data-section]')

function setActiveNav(sectionId) {
  navLinks.forEach((link) => {
    const isActive = link.dataset.section === sectionId
    link.classList.toggle('active', isActive)
    link.setAttribute('aria-current', isActive ? 'page' : 'false')
  })
}

function scrollToSection(sectionId, { updateHistory = true, behavior = 'smooth' } = {}) {
  const targetSection = document.getElementById(sectionId)
  if (!targetSection) return

  targetSection.scrollIntoView({ behavior, block: 'start' })
  setActiveNav(sectionId)

  if (updateHistory) {
    history.pushState(null, '', `#${sectionId}`)
  }
}

function setupSectionObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

      if (visibleEntries.length > 0) {
        setActiveNav(visibleEntries[0].target.id)
      }
    },
    {
      root: null,
      threshold: [0.25, 0.5, 0.75],
      rootMargin: '-20% 0px -45% 0px',
    },
  )

  sections.forEach((section) => observer.observe(section))
}

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault()
    const sectionId = link.dataset.section
    if (sectionId) scrollToSection(sectionId)
  })
})

if (logoLink) {
  logoLink.addEventListener('click', (event) => {
    event.preventDefault()
    scrollToSection('home')
  })
}

window.addEventListener('popstate', () => {
  const sectionId = window.location.hash.slice(1) || 'home'
  scrollToSection(sectionId, { updateHistory: false, behavior: 'auto' })
})

document.addEventListener('DOMContentLoaded', () => {
  setupSectionObserver()

  const sectionId = window.location.hash.slice(1) || 'home'
  scrollToSection(sectionId, { updateHistory: false, behavior: 'auto' })
})
