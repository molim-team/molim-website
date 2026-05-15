import { auth } from '/static/js/firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  const btn = document.getElementById('auth-btn');
  if (!btn) return;

  if (user) {
    const name = user.displayName ? user.displayName.split(' ')[0] : 'حسابي';
    btn.textContent = `👤 ${name}`;
    btn.href = '/profile.html'
    btn.onclick = null;
  } else {
    btn.textContent = 'تسجيل الدخول';
    btn.href = '/login.html';
    btn.onclick = null;
  }
});