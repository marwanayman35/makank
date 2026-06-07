// ==========================================
// main.js - Site-wide interactions, state management, and validation
// ==========================================

// --- State Management & Initialization (MongoDB Sync) ---
window.AppStorage = window.localStorage;

const STATE = {
  users: [],
  admins: [],
  events: [],
  matches: [],
  eventTypes: ['football', 'concert']
};

// Sync app state asynchronously from MongoDB Atlas
window.loadAppState = async () => {
  try {
    const res = await fetch('/api/events');
    const data = await res.json();
    if (data.success) {
      STATE.events = data.events;
      STATE.matches = data.matches;
    }

    const typeRes = await fetch('/api/event-types');
    const typeData = await typeRes.json();
    if (typeData.success) {
      STATE.eventTypes = typeData.eventTypes;
    }

    // Sync active users & admins for UI compatibility
    const usersRes = await fetch('/api/auth/users');
    const usersData = await usersRes.json();
    if (usersData.success) {
      STATE.users = usersData.users;
      AppStorage.setItem('makank_users', JSON.stringify(STATE.users));
    }

    const adminsRes = await fetch('/api/auth/admins');
    const adminsData = await adminsRes.json();
    if (adminsData.success) {
      STATE.admins = adminsData.admins;
      AppStorage.setItem('makank_admins', JSON.stringify(STATE.admins));
    }
  } catch (err) {
    console.error('Error synchronizing database state:', err);
  }
};

// Immediately execute state loading
window.loadAppState();

// --- Localization Translation Dictionary & Helpers ---
const TRANSLATIONS = {
  en: {
    nav_home: "Home",
    nav_browse: "Browse Events",
    nav_login: "Login",
    nav_register: "Register",
    nav_dashboard: "Dashboard",
    nav_logout: "Logout",
    nav_view_site: "View Site",
    nav_logout_admin: "Logout Admin",
    nav_secure_checkout: "Secure Checkout",
    nav_cancel: "Cancel",
    nav_back: "Back",
    // index.ejs
    hero_title: "Find Your Next Ticket.",
    hero_subtitle: "Your exclusive pass to the best live events in Egypt. Book tickets for top local football matches and legendary concerts today.",
    search_placeholder: "Search events, artists...",
    search_btn: "Search",
    browse_categories: "Browse Categories",
    upcoming_events: "Upcoming Events",
    view_all: "View All →",
    no_featured_title: "No Featured Events Yet",
    no_featured_desc: "Check back soon for upcoming highlighted events!",
    view_match: "View Match",
    view_details: "View Details",
    footer_text: "© 2026 Makank. All rights reserved.",
    // events.ejs
    discover_title: "Discover Entertainment",
    filter_header: "Filters",
    filter_search: "Search Query",
    filter_search_placeholder: "Search names...",
    filter_type: "Event Type",
    filter_location: "Location / Venue",
    filter_location_placeholder: "City or stadium...",
    filter_sort: "Sort By",
    filter_apply: "Apply Filters",
    sort_date_asc: "Date (Earliest First)",
    sort_date_desc: "Date (Latest First)",
    sort_name_asc: "Name (A-Z)",
    label_date: "Date",
    label_city: "City/Venue",
    no_events_found: "No events found",
    no_events_found_sub: "Try adjusting your search filters.",
    // sports.ejs
    sports_title: "Football Matches",
    sports_subtitle: "Secure your spot at the biggest Nile League clashes.",
    btn_book_ticket: "Book Ticket",
    btn_booking_closed: "Booking Closed",
    label_tournament: "Tournament: Nile League 2025/2026",
    label_match_no: "Match No",
    label_final_stage: "Final Stage",
    status_available: "Available",
    status_closed: "Booking Closed",
    no_matches_found: "No matches scheduled yet",
    no_matches_found_sub: "Check back later for the latest fixtures."
  },
  ar: {
    nav_home: "الرئيسية",
    nav_browse: "تصفح الفعاليات",
    nav_login: "تسجيل الدخول",
    nav_register: "إنشاء حساب",
    nav_dashboard: "لوحة التحكم",
    nav_logout: "تسجيل الخروج",
    nav_view_site: "عرض الموقع",
    nav_logout_admin: "خروج المشرف",
    nav_secure_checkout: "دفع آمن",
    nav_cancel: "إلغاء",
    nav_back: "رجوع",
    // index.ejs
    hero_title: "جد تذكرتك القادمة.",
    hero_subtitle: "بوابتك الحصرية لأفضل الفعاليات الحية في مصر. احجز تذاكر لأهم مباريات كرة القدم والحفلات الموسيقية اليوم.",
    search_placeholder: "ابحث عن الفعاليات، الفنانين...",
    search_btn: "بحث",
    browse_categories: "تصفح الفئات",
    upcoming_events: "الفعاليات القادمة",
    view_all: "عرض الكل ←",
    no_featured_title: "لا توجد فعاليات مميزة حالياً",
    no_featured_desc: "تصفح الموقع لاحقاً لمتابعة أحدث الفعاليات المميزة!",
    view_match: "عرض المباراة",
    view_details: "عرض التفاصيل",
    footer_text: "© 2026 مكانك. جميع الحقوق محفوظة.",
    // events.ejs
    discover_title: "اكتشف الترفيه",
    filter_header: "الفلاتر",
    filter_search: "البحث",
    filter_search_placeholder: "البحث بالاسم...",
    filter_type: "نوع الفعالية",
    filter_location: "الموقع / الملعب",
    filter_location_placeholder: "المدينة أو الملعب...",
    filter_sort: "ترتيب حسب",
    filter_apply: "تطبيق الفلاتر",
    sort_date_asc: "التاريخ (الأقدم أولاً)",
    sort_date_desc: "التاريخ (الأحدث أولاً)",
    sort_name_asc: "الاسم (أ-ي)",
    label_date: "التاريخ",
    label_city: "المدينة/الملعب",
    no_events_found: "لم يتم العثور على فعاليات",
    no_events_found_sub: "جرّب تعديل فلاتر البحث.",
    // sports.ejs
    sports_title: "مباريات كرة القدم",
    sports_subtitle: "احجز مكانك في أكبر مواجهات الدوري المصري.",
    btn_book_ticket: "احجز تذكرة",
    btn_booking_closed: "الحجز مغلق",
    label_tournament: "البطولة: الدوري المصري 2025/2026",
    label_match_no: "رقم المباراة",
    label_final_stage: "المرحلة النهائية",
    status_available: "متاح",
    status_closed: "مغلق",
    no_matches_found: "لا توجد مباريات مجدولة حالياً",
    no_matches_found_sub: "تصفح الموقع لاحقاً لمتابعة أحدث المباريات."
  }
};

window.getCurrentLanguage = () => {
  return localStorage.getItem('makank_lang') || 'en';
};

window.setCurrentLanguage = (lang) => {
  localStorage.setItem('makank_lang', lang);
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  window.translatePage();
  window.dispatchEvent(new Event('languagechange'));
};

window.translatePage = () => {
  const lang = window.getCurrentLanguage();
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;

  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.setAttribute('placeholder', dict[key]);
    }
  });

  const langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.textContent = lang === 'en' ? 'AR' : 'EN';
  }
};

// Global translation initiation on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.translatePage();
});

// --- Reusable Client-Side Pagination Renderer ---
window.renderPaginationControl = (containerId, totalItems, currentPage, itemsPerPage, onPageChange) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const container = document.getElementById(containerId);
  if (!container) return;

  if (totalPages <= 1) {
    container.style.display = 'none';
    container.innerHTML = '';
    return;
  }

  container.style.display = 'flex';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'center';
  container.style.gap = '0.5rem';
  container.style.marginTop = '2rem';
  container.innerHTML = '';

  const isAr = window.getCurrentLanguage() === 'ar';

  // Prev Button
  const prevBtn = document.createElement('button');
  prevBtn.className = 'btn btn-secondary';
  prevBtn.style.padding = '0.5rem 1rem';
  prevBtn.style.borderRadius = '50px';
  prevBtn.style.cursor = 'pointer';
  prevBtn.textContent = isAr ? 'السابق' : 'Prev';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => onPageChange(currentPage - 1);
  container.appendChild(prevBtn);

  // Page Numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = i === currentPage ? 'btn btn-primary' : 'btn btn-secondary';
    pageBtn.style.padding = '0.5rem 1.1rem';
    pageBtn.style.borderRadius = '50px';
    pageBtn.style.minWidth = '40px';
    pageBtn.style.cursor = 'pointer';
    pageBtn.textContent = i;
    pageBtn.onclick = () => onPageChange(i);
    container.appendChild(pageBtn);
  }

  // Next Button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn btn-secondary';
  nextBtn.style.padding = '0.5rem 1rem';
  nextBtn.style.borderRadius = '50px';
  nextBtn.style.cursor = 'pointer';
  nextBtn.textContent = isAr ? 'التالي' : 'Next';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => onPageChange(currentPage + 1);
  container.appendChild(nextBtn);
};



// Helper for UI notifications
window.showToast = function(message, type = 'success') {
  const toast = document.createElement('div');
  
  // Icon setup based on type
  const iconSpan = document.createElement('span');
  if (type === 'error') {
    iconSpan.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    iconSpan.style.color = 'var(--error)';
  } else {
    iconSpan.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    iconSpan.style.color = 'var(--accent-cyan)';
  }
  iconSpan.style.display = 'flex';
  iconSpan.style.alignItems = 'center';

  const textSpan = document.createElement('span');
  textSpan.textContent = message;

  toast.appendChild(iconSpan);
  toast.appendChild(textSpan);

  // Modern pill styles
  toast.style.position = 'fixed';
  toast.style.bottom = '30px';
  toast.style.left = '50%';
  toast.style.transform = 'translate(-50%, 40px)';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.gap = '12px';
  toast.style.padding = '1rem 1.5rem 1rem 1.25rem';
  toast.style.background = 'rgba(255, 255, 255, 0.95)';
  toast.style.backdropFilter = 'blur(16px)';
  toast.style.webkitBackdropFilter = 'blur(16px)';
  toast.style.border = '1px solid var(--border-glass)';
  toast.style.boxShadow = '0 12px 36px rgba(0, 0, 0, 0.1)';
  toast.style.borderRadius = '50px';
  toast.style.zIndex = '99999';
  toast.style.color = 'var(--text-primary)';
  toast.style.fontWeight = '700';
  toast.style.fontSize = '0.95rem';
  toast.style.opacity = '0';
  toast.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';

  document.body.appendChild(toast);

  // Entrance animation
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translate(-50%, 0)';
  });

  // Exit animation
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, 20px)';
    setTimeout(() => toast.remove(), 500);
  }, 3500);
}

// --- DOM Ready Interactions ---
document.addEventListener('DOMContentLoaded', () => {
  // Sticky Nav on Scroll
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }
  
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    if (link.getAttribute('href') && currentPath.endsWith(link.getAttribute('href'))) {
      link.classList.add('active');
    }
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    el.style.opacity = '0'; 
    observer.observe(el);
  });
});

// --- Form Validation Logic ---
window.showError = function(inputElement, message) {
  const formGroup = inputElement.closest('.form-group');
  let errorElement = formGroup ? formGroup.querySelector('.error-message') : inputElement.nextElementSibling;
  
  if (!errorElement || !errorElement.classList.contains('error-message')) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    if (formGroup) {
      formGroup.appendChild(errorElement);
    } else {
      inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
    }
  }
  errorElement.textContent = message;
  errorElement.style.display = '';
  inputElement.classList.add('is-invalid');
}

window.clearError = function(inputElement) {
  inputElement.classList.remove('is-invalid');
  const formGroup = inputElement.closest('.form-group');
  const errorElement = formGroup ? formGroup.querySelector('.error-message') : inputElement.nextElementSibling;
  if (errorElement && errorElement.classList.contains('error-message')) {
    errorElement.remove();
  }
}

function isValidEmail(email) {
  return /^[a-zA-Z0-9]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidName(name) {
  return /^[a-zA-Z\s]+$/.test(name);
}

function isNumeric(val) {
  return /^\d+$/.test(val);
}

function isValidExpiry(val) {
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(val)) return false;
  const mm = parseInt(val.substring(0, 2), 10);
  const yy = parseInt(val.substring(3, 5), 10);
  const now = new Date();
  const exp = new Date(2000 + yy, mm - 1);
  return exp >= new Date(now.getFullYear(), now.getMonth(), 1);
}

function isValidFutureDate(val) {
  if (!val) return false;
  const target = new Date(val);
  const now = new Date();
  now.setHours(0,0,0,0);
  return target >= now;
}

function isValidTime(val) {
  return /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM|am|pm)$|^([01]?[0-9]|2[0-3]):[0-5][0-9]((:[0-5][0-9])?)$/.test(val);
}

window.setupFormValidation = (formId, rules, onSuccess) => {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    Object.keys(rules).forEach(fieldId => {
      const input = document.getElementById(fieldId);
      if (!input) return;

      const value = input.value.trim();
      const rule = rules[fieldId];

      clearError(input);

      if (rule.required && !value) {
        window.showError(input, rule.customMessage || 'This field is absolutely required and cannot be left empty.');
        isValid = false;
      } else if (rule.type === 'email' && !isValidEmail(value)) {
        window.showError(input, rule.customMessage || 'Please enter a properly formatted email. Only letters and numbers are allowed before the "@".');
        isValid = false;
      } else if (rule.type === 'name' && !isValidName(value)) {
        window.showError(input, rule.customMessage || 'Only alphabetic characters and spaces are allowed.');
        isValid = false;
      } else if (rule.type === 'numeric' && !isNumeric(value)) {
        window.showError(input, rule.customMessage || 'Please enter only numbers.');
        isValid = false;
      } else if (rule.type === 'expiry' && !isValidExpiry(value)) {
        window.showError(input, rule.customMessage || 'Please enter a valid future expiry date in MM/YY format.');
        isValid = false;
      } else if (rule.type === 'time' && !isValidTime(value)) {
        window.showError(input, rule.customMessage || 'Please enter a valid time (e.g. 08:00 PM or 20:00).');
        isValid = false;
      } else if (rule.type === 'futureDate' && !isValidFutureDate(value)) {
        window.showError(input, rule.customMessage || 'Please enter a valid date in the future.');
        isValid = false;
      } else if (rule.type === 'url' && value) {
        let isUrl = false;
        try {
          const u = new URL(value);
          isUrl = (u.protocol === 'http:' || u.protocol === 'https:');
        } catch (e) {
          isUrl = false;
        }
        if (!isUrl) {
          window.showError(input, rule.customMessage || 'Please enter a valid URL starting with http:// or https://');
          isValid = false;
        }
      } else if (rule.minVal !== undefined && parseInt(value, 10) < rule.minVal) {
        window.showError(input, rule.customMessage || `Value must be at least ${rule.minVal}.`);
        isValid = false;
      } else if (rule.minLength && value.length < rule.minLength) {
        window.showError(input, rule.customMessage || `Input is too short. It must be at least ${rule.minLength} characters long.`);
        isValid = false;
      } else if (rule.match) {
        const matchInput = document.getElementById(rule.match);
        if (matchInput && value !== matchInput.value) {
           window.showError(input, rule.customMessage || 'The passwords do not match. Please ensure both fields are exactly identical.');
           isValid = false;
        }
      }
    });

    if (isValid) onSuccess(form);
  });

  Object.keys(rules).forEach(fieldId => {
     const input = document.getElementById(fieldId);
     if (input) {
       input.addEventListener('input', () => clearError(input));
     }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const loggedInUserStr = localStorage.getItem('loggedInUser');
  const navLinksContainer = document.querySelector('.nav-links');
  
  if (loggedInUserStr && navLinksContainer) {
    // Remove login/register
    navLinksContainer.querySelectorAll('a').forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href.includes('/login') || href.includes('/register'))) {
        link.remove();
      }
    });

    // Add Dashboard if missing
    if (!navLinksContainer.querySelector('a[href*="/user"]')) {
      const dbLink = document.createElement('a');
      dbLink.href = '/user';
      dbLink.textContent = 'Dashboard';
      dbLink.setAttribute('data-i18n', 'nav_dashboard');
      if (window.location.href.includes('/user')) dbLink.classList.add('active');
      navLinksContainer.appendChild(dbLink);
    }
    
    // Add Logout Button
    const logoutBtn = document.createElement('a');
    logoutBtn.href = '#';
    logoutBtn.textContent = 'Logout';
    logoutBtn.setAttribute('data-i18n', 'nav_logout');
    logoutBtn.onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem('loggedInUser');
      window.location.href = '/login';
    };
    navLinksContainer.appendChild(logoutBtn);

    // Re-translate to apply to dynamic links
    window.translatePage();
  }



});
