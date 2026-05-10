

// --- إضافة منطق الوضع الليلي ---
const darkModeToggle = document.getElementById('darkModeToggle');

// 1. دالة التبديل
function toggleDarkMode() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme); // حفظ الاختيار
  updateToggleIcon(newTheme);
}

// 2. تحديث الأيقونة
function updateToggleIcon(theme) {
  if (darkModeToggle) {
    darkModeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  }
}

// 3. التحقق من التفضيلات المحفوظة عند تحميل الصفحة
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateToggleIcon(savedTheme);

// 4. ربط الزر بالدالة
if (darkModeToggle) {
  darkModeToggle.addEventListener('click', toggleDarkMode);
}

