// قائمة الهامبرغر
function toggleMenu() {
  const nav = document.getElementById('main-nav');
  nav.classList.toggle('open');
}

// زر العودة للأعلى
const btn = document.createElement('button');
btn.id = 'back-to-top';
btn.innerHTML = '↑';
document.body.appendChild(btn);

btn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (header) {
    if (window.scrollY > 80) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
  }
});