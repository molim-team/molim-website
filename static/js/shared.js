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
  btn.style.display = window.scrollY > 300 ? 'block' : 'none';

  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});