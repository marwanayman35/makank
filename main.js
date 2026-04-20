window.AppStorage = window.localStorage;

const STATE = {
  users: JSON.parse(AppStorage.getItem('makank_users')) || [],
  admins: JSON.parse(AppStorage.getItem('makank_admins')) || [],
  events: JSON.parse(AppStorage.getItem('makank_events')) || [],
  matches: JSON.parse(AppStorage.getItem('makank_matches')) || [],
  eventTypes: JSON.parse(AppStorage.getItem('makank_event_types')) || ['football', 'concert'],
};

function saveState() {
  try {
    AppStorage.setItem('makank_users', JSON.stringify(STATE.users));
    AppStorage.setItem('makank_admins', JSON.stringify(STATE.admins));
    AppStorage.setItem('makank_events', JSON.stringify(STATE.events));
    AppStorage.setItem('makank_matches', JSON.stringify(STATE.matches));
    AppStorage.setItem('makank_event_types', JSON.stringify(STATE.eventTypes));
    return true;
  } catch (e) {
    console.error("Local storage limit exceeded:", e);
    return false;
  }
}


if (!AppStorage.getItem('makank_initialized')) {
  if (STATE.events.length === 0) {
    STATE.events = [
      { id: '#EV-001', name: 'Champions Final', date: '2026-10-24', type: 'football', venue: 'Wembley Stadium', status: 'Active', subevents: [] },
      { id: '#EV-002', name: 'Derby Clash', date: '2026-11-02', type: 'football', venue: 'Anfield', status: 'Active', subevents: [] },
      { id: '#EV-003', name: 'Neon Lights Tour', date: '2026-12-15', type: 'concert', venue: 'O2 Arena', status: 'Active', subevents: [] }
    ];
  }
  if (STATE.matches.length === 0) {
    STATE.matches = [
      { id: 'MATCH-001', homeTeam: 'Al Ahly FC', homeTeamLogo: 'egypt_al-ahly.football-logos.cc.svg', awayTeam: 'Pyramids FC', awayTeamLogo: 'egypt_pyramids.football-logos.cc.svg', date: 'Sun 20 Jul 2026', time: '08:00 PM', stadium: 'Cairo Stadium', city: 'Cairo, Egypt', matchNo: 1, status: 'available', featured: false },
      { id: 'MATCH-002', homeTeam: 'Zamalek SC', homeTeamLogo: 'egypt_zamalek.football-logos.cc (2).svg', awayTeam: 'Al Masry SC', awayTeamLogo: 'egypt_al-masry.football-logos.cc.svg', date: 'Mon 21 Jul 2026', time: '09:00 PM', stadium: 'Borg El Arab', city: 'Alexandria, Egypt', matchNo: 2, status: 'available', featured: false },
      { id: 'MATCH-003', homeTeam: 'Al Ittihad Alexandria', homeTeamLogo: 'egypt_al-ittihad-alexandria.football-logos.cc.svg', awayTeam: 'Al Mokawloon Al Arab', awayTeamLogo: 'egypt_al-mokawloon-al-arab.football-logos.cc.svg', date: 'Tue 22 Jul 2026', time: '06:00 PM', stadium: 'Borg El Arab', city: 'Alexandria, Egypt', matchNo: 3, status: 'closed', featured: false },
      { id: 'MATCH-004', homeTeam: 'Ismaily SC', homeTeamLogo: 'egypt_ismaily.football-logos.cc.svg', awayTeam: 'Ceramica Cleopatra', awayTeamLogo: 'egypt_ceramica-cleopatra.football-logos.cc.svg', date: 'Wed 23 Jul 2026', time: '05:00 PM', stadium: 'Ismailia Stadium', city: 'Ismailia, Egypt', matchNo: 4, status: 'available', featured: false },
      { id: 'MATCH-005', homeTeam: 'ENPPI', homeTeamLogo: 'egypt_enppi.football-logos.cc.svg', awayTeam: 'Petrojet FC', awayTeamLogo: 'egypt_petrojet.football-logos.cc.svg', date: 'Thu 24 Jul 2026', time: '07:00 PM', stadium: 'Petro Sport Stadium', city: 'Cairo, Egypt', matchNo: 5, status: 'available', featured: false }
    ];
  }
  if (STATE.admins.length === 0) {
    STATE.admins = [
      { id: 'ADM-001', name: 'Master Admin', email: 'admin@makank.com', password: 'admin' }
    ];
  }
  AppStorage.setItem('makank_initialized', 'true');
  saveState();
}


window.showToast = function(message, type = 'success') {
  const toast = document.createElement('div');
  
  
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
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translate(-50%, 0)';
  });

  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, 20px)';
    setTimeout(() => toast.remove(), 500);
  }, 3500);
}

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
   
    navLinksContainer.querySelectorAll('a').forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href.includes('login.html') || href.includes('register.html'))) {
        link.remove();
      }
    });

    
    if (!navLinksContainer.querySelector('a[href*="user.html"]')) {
      const dbLink = document.createElement('a');
      dbLink.href = 'user.html';
      dbLink.textContent = 'Dashboard';
      if (window.location.href.includes('user.html')) dbLink.classList.add('active');
      navLinksContainer.appendChild(dbLink);
    }
    
   
    const logoutBtn = document.createElement('a');
    logoutBtn.href = '#';
    logoutBtn.textContent = 'Logout';
    logoutBtn.onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem('loggedInUser');
      window.location.href = 'login.html';
    };
    navLinksContainer.appendChild(logoutBtn);
  }



});
