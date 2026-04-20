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