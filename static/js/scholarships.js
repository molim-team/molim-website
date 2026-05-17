import { isFavorite, toggleFavorite, getFavoriteIds, onFavoritesChange } from '/static/js/favorites.js';

let allScholarships = [];

fetch('data/scholarships.json?v=' + Date.now())
  .then(res => res.json())
  .then(data => {
    allScholarships = data;
    renderCards(allScholarships);
  })
  .catch(err => console.error('خطأ:', err));

// كلما تغيّرت المفضلة (دخول/خروج/ضغط قلب)، حدّث أيقونات القلب في الصفحة
onFavoritesChange(() => {
  document.querySelectorAll('.fav-btn').forEach(btn => {
    const id = btn.dataset.id;
    const active = isFavorite(id);
    btn.classList.toggle('active', active);
    const icon = btn.querySelector('i');
    if (icon) icon.className = active ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
  });
  const favSection = document.getElementById('favorites-section');
  if (favSection && favSection.style.display !== 'none') {
    renderFavorites();
  }
});

// ===== بناء الكارد =====
function buildCard(s) {
  const flagHtml = s.flag && s.flag.startsWith('http')
    ? `<img class="card-flag" src="${s.flag}" alt="flag"/>`
    : `<span class="card-flag" style="font-size:40px; line-height:1; display:block; margin-bottom:10px;">${s.flag || ''}</span>`;

  const active = isFavorite(s.id);

  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <button class="fav-btn ${active ? 'active' : ''}" data-id="${s.id}"
      aria-label="${active ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}">
      <i class="${active ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
    </button>
    ${flagHtml}
    <h3>${s.name}</h3>
    <p class="country">📍 ${s.country}</p>
    <p class="degree">🎓 ${s.degree}</p>
    <span class="status ${s.open ? 'open' : 'closed'}">
      ${s.open ? '✅ التقديم مفتوح' : '🔴 التقديم مغلق'}
    </span>
    <p class="desc">${s.description || ''}</p>
    ${s.open_date ? `<p class="deadline">📅 موعد فتح التقديم: ${s.open_date}</p>` : ''}
    <p class="deadline">📅 آخر موعد للتقديم: ${s.deadline}</p>
    <a href="scholarship.html?id=${s.id}" class="btn-details">تفاصيل المنحة كاملة ←</a>
    <a href="${s.link}" target="_blank">زيارة الموقع الرسمي ↗</a>
    <a class="btn-details" onclick="shareScholarship('${s.id}', '${s.name}', '${s.country}')" style="cursor:pointer;">
      📤 شارك المنحة
    </a>
  `;

  card.querySelector('.fav-btn').addEventListener('click', async function (e) {
    e.stopPropagation();
    const nowActive = await toggleFavorite(this.dataset.id);
    this.classList.toggle('active', nowActive);
    const icon = this.querySelector('i');
    if (icon) icon.className = nowActive ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
  });

  return card;
}

// ===== عرض جميع المنح =====
function renderCards(list) {
  const grid = document.getElementById('scholarships-grid');
  const noResults = document.getElementById('no-results');
  if (!grid) return;
  grid.innerHTML = '';
  if (list.length === 0) { noResults.style.display = 'block'; return; }
  noResults.style.display = 'none';
  list.forEach(s => grid.appendChild(buildCard(s)));
  observeCards();
}

// ===== عرض المفضلة =====
function renderFavorites() {
  const favGrid  = document.getElementById('favorites-grid');
  const noFavMsg = document.getElementById('no-favorites');
  if (!favGrid) return;
  const favIds  = getFavoriteIds();
  const favList = allScholarships.filter(s => favIds.includes(String(s.id)));
  favGrid.innerHTML = '';
  if (favList.length === 0) { noFavMsg.style.display = 'block'; return; }
  noFavMsg.style.display = 'none';
  favList.forEach(s => favGrid.appendChild(buildCard(s)));
  observeCards();
}

// ===== تبديل التابات =====
window.showAllScholarships = function () {
  document.getElementById('all-section').style.display = 'block';
  document.getElementById('favorites-section').style.display = 'none';
  document.getElementById('tab-all').classList.add('tab-active');
  document.getElementById('tab-fav').classList.remove('tab-active');
};

window.showFavorites = function () {
  document.getElementById('all-section').style.display = 'none';
  document.getElementById('favorites-section').style.display = 'block';
  document.getElementById('tab-all').classList.remove('tab-active');
  document.getElementById('tab-fav').classList.add('tab-active');
  renderFavorites();
};

// ===== فلتر =====
function filterCards() {
  const search = document.getElementById('search').value.toLowerCase();
  const status = document.getElementById('filter-status').value;
  const degree = document.getElementById('filter-degree').value;
  const filtered = allScholarships.filter(s => {
    const matchSearch = s.name.includes(search) || s.country.includes(search);
    const matchStatus = status === 'all' || (status === 'open' ? s.open : !s.open);
    const matchDegree = degree === 'all' || s.degree.includes(degree);
    return matchSearch && matchStatus && matchDegree;
  });
  renderCards(filtered);
}

document.getElementById('search').addEventListener('input', filterCards);
document.getElementById('filter-status').addEventListener('change', filterCards);
document.getElementById('filter-degree').addEventListener('change', filterCards);

// ===== مشاركة =====
window.shareScholarship = function (id, name, country) {
  const url = `${window.location.origin}/scholarship/${id}`;
  if (navigator.share) {
    navigator.share({ title: `منحة ${name}`, text: `🎓 اكتشف منحة ${name} في ${country} على منصة مُلم!`, url });
  } else {
    navigator.clipboard.writeText(url);
    alert('✅ تم نسخ رابط المنحة!');
  }
};

// ===== انيميشن الكروت =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1 });

function observeCards() {
  document.querySelectorAll('.card').forEach(card => observer.observe(card));
}

// ===== زر العودة للأعلى =====
const btn = document.createElement('button');
btn.id = 'back-to-top';
btn.innerHTML = '↑';
document.body.appendChild(btn);
btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
window.addEventListener('scroll', () => { btn.style.display = window.scrollY > 300 ? 'block' : 'none'; });

// ===== هيدر =====
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 50);
  header.style.transform = window.scrollY > 80 ? 'translateY(-100%)' : 'translateY(0)';
});