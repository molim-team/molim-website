import { auth, db } from '/static/js/firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ===== الحالة الداخلية =====
let currentUser = null;
let favoritesCache = new Set();
let onChangeCallbacks = [];

// استمع لحالة تسجيل الدخول
onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  if (user) {
    // جلب المفضلة من Firestore
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    if (snap.exists() && snap.data().favorites) {
      favoritesCache = new Set(snap.data().favorites.map(String));
    } else {
      favoritesCache = new Set();
    }
  } else {
    favoritesCache = new Set();
  }
  // أبلغ كل المستمعين بتحديث المفضلة
  onChangeCallbacks.forEach(cb => cb());
});

// ===== API عام =====

export function isFavorite(id) {
  return favoritesCache.has(String(id));
}

export async function toggleFavorite(id) {
  // غير مسجّل → أوجّهه لصفحة تسجيل الدخول
  if (!currentUser) {
    showLoginPrompt();
    return false;
  }

  id = String(id);
  const wasLiked = favoritesCache.has(id);

  if (wasLiked) {
    favoritesCache.delete(id);
  } else {
    favoritesCache.add(id);
  }

  if (currentUser) {
    // حفظ في Firestore
    const ref = doc(db, 'users', currentUser.uid);
    try {
      await updateDoc(ref, {
        favorites: wasLiked ? arrayRemove(id) : arrayUnion(id)
      });
    } catch {
      // لو الـ document ما موجود بعد، أنشئه
      await setDoc(ref, { favorites: [...favoritesCache] }, { merge: true });
    }
  } else {
    // حفظ في localStorage
    localStorage.setItem('molim_favorites', JSON.stringify([...favoritesCache]));
  }

  onChangeCallbacks.forEach(cb => cb());
  return !wasLiked; // true = أضيفت، false = أُزيلت
}

export function getFavoriteIds() {
  return [...favoritesCache];
}

// سجّل callback يُستدعى كلما تغيّرت المفضلة أو تغيّر المستخدم
export function onFavoritesChange(cb) {
  onChangeCallbacks.push(cb);
}

// ===== نافذة تسجيل الدخول =====
function showLoginPrompt() {
  // لو الـ popup موجود بالفعل، ما نضيف ثاني
  if (document.getElementById('login-prompt-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'login-prompt-overlay';
  overlay.innerHTML = `
    <div id="login-prompt-box">
      <p>💛 سجّل دخولك أولاً لحفظ المنح المفضلة!</p>
      <div id="login-prompt-btns">
        <a href="/login.html" id="login-prompt-go">تسجيل الدخول</a>
        <button id="login-prompt-close">لاحقاً</button>
      </div>
    </div>
  `;

  // ستايل الـ overlay
  Object.assign(overlay.style, {
    position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: '9999', fontFamily: 'inherit'
  });

  const box = overlay.querySelector('#login-prompt-box');
  Object.assign(box.style, {
    background: 'var(--card-bg, #1e2a3a)', color: 'var(--text, #fff)',
    borderRadius: '16px', padding: '32px 28px', textAlign: 'center',
    maxWidth: '320px', width: '90%', boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
  });

  overlay.querySelector('p').style.cssText = 'font-size:18px; margin-bottom:20px; line-height:1.6';

  const btnsDiv = overlay.querySelector('#login-prompt-btns');
  btnsDiv.style.cssText = 'display:flex; gap:12px; justify-content:center; flex-wrap:wrap';

  const goBtn = overlay.querySelector('#login-prompt-go');
  Object.assign(goBtn.style, {
    background: '#e84545', color: '#fff', padding: '10px 24px',
    borderRadius: '30px', textDecoration: 'none', fontWeight: '700', fontSize: '15px'
  });

  const closeBtn = overlay.querySelector('#login-prompt-close');
  Object.assign(closeBtn.style, {
    background: 'transparent', border: '2px solid #aaa', color: '#aaa',
    padding: '10px 20px', borderRadius: '30px', cursor: 'pointer',
    fontFamily: 'inherit', fontSize: '15px'
  });

  closeBtn.addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  document.body.appendChild(overlay);
}