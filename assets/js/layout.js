/* Shared layout: injects sidebar + top bar. Needs <body data-page="x" data-title="X"> and #app-sidebar / #app-topbar. */
(function(){
  // --- Auth guard: no user -> login ---
  let user=null; try{user=JSON.parse(localStorage.getItem('crmUser'))}catch(e){}
  if(!user){location.replace('login.html');return}

  // --- Navigation config (icon = SVG path inside 24x24 stroke icon) ---
  // NOTE: Memberships, Inventory and Feedback & Reviews modules are commented out (hidden from sidebar).
  const NAV=[
   ['dashboard','Dashboard','dashboard.html','M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10'],
   ['customers','Customers','customers.html','M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M10 10a4 4 0 100-8 4 4 0 000 8M21 20v-2a4 4 0 00-3-3.9'],
   ['appointments','Appointments','appointments.html','M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z'],
   ['services','Services & Packages','services.html','M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z'],
   ['billing','Billing & Payments','billing.html','M2 6h20v12H2zM2 10h20M6 15h4'],
   // ['memberships','Memberships','memberships.html','M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 100-5C13 2 12 7 12 7z'],
   // ['inventory','Inventory','inventory.html','M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v9'],
   ['leads','Leads & Follow-ups','leads.html','M22 12h-4l-3 9L9 3l-3 9H2'],
   ['campaigns','Marketing & Campaigns','campaigns.html','M3 11v2a1 1 0 001 1h3l5 4V6L7 10H4a1 1 0 00-1 1zM16 8a5 5 0 010 8'],
   // ['feedback','Feedback & Reviews','feedback.html','M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z'],
   ['staff','Staff','staff.html','M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8M22 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8'],
   ['reports','Reports','reports.html','M18 20V10M12 20V4M6 20v-6'],
   ['settings','Settings','settings.html','M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 014 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z']
  ];

  // --- Role rules ---
  const HIDE={Receptionist:['reports','settings','staff']};
  const ONLY={Therapist:['dashboard','appointments','customers']};
  const allowed=k=>ONLY[user.role]?ONLY[user.role].includes(k):!(HIDE[user.role]||[]).includes(k);

  const page=document.body.dataset.page;
  const icon=p=>`<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="${p}"/></svg>`;
  const links=NAV.filter(n=>allowed(n[0])).map(n=>
    `<a href="${n[2]}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-teal-50 hover:text-teal-700 ${n[0]===page?'nav-link-active':''}">${icon(n[3])}<span>${n[1]}</span></a>`).join('');

  // --- Sidebar (off-canvas on mobile, fixed on lg+) ---
  document.getElementById('app-sidebar').innerHTML=`
   <div id="sb-overlay" class="fixed inset-0 bg-slate-900/40 z-30 hidden lg:hidden"></div>
   <aside id="sb" class="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col -translate-x-full lg:translate-x-0 transition-transform">
     <div class="h-16 flex items-center gap-2 px-5 border-b border-slate-100">
       <div class="w-9 h-9 rounded-xl bg-teal-600 text-white grid place-items-center font-bold">K</div>
       <div class="leading-tight"><p class="font-semibold text-slate-800">Kunash</p><p class="text-xs text-slate-400">Spa & Salon CRM</p></div>
     </div>
     <nav class="flex-1 overflow-y-auto p-3 space-y-1">${links}</nav>
     <div class="p-3 border-t border-slate-100">
       <button id="logoutBtn" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50">${icon('M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9')}<span>Logout</span></button>
     </div>
   </aside>`;

  // --- Top bar ---
  const title=document.body.dataset.title||(NAV.find(n=>n[0]===page)||[0,'Kunash'])[1];
  const initials=user.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  document.getElementById('app-topbar').innerHTML=`
   <header class="h-16 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center gap-3 px-4 lg:px-8 sticky top-0 z-20">
     <button id="hamburger" class="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100" aria-label="Open menu">${icon('M4 6h16M4 12h16M4 18h16')}</button>
     <h1 class="text-lg font-semibold text-slate-800 truncate">${title}</h1>
     <div class="ml-auto hidden sm:block relative w-64">
       <input type="search" placeholder="Search customers, bookings…" class="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-100 border border-transparent focus:bg-white focus:border-teal-500 focus:outline-none">
       <span class="absolute left-2.5 top-2.5 text-slate-400">${icon('M21 21l-4.3-4.3M11 19a8 8 0 100-16 8 8 0 000 16z').replace('w-5 h-5','w-4 h-4')}</span>
     </div>
     <button class="relative p-2 rounded-lg hover:bg-slate-100 ml-auto sm:ml-0" aria-label="Notifications">${icon('M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0')}
       <span class="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] grid place-items-center">3</span></button>
     <div class="flex items-center gap-3 pl-3 border-l border-slate-200">
       <div class="w-9 h-9 rounded-full bg-teal-600 text-white grid place-items-center text-sm font-semibold">${initials}</div>
       <div class="hidden md:block leading-tight"><p class="text-sm font-medium text-slate-800">${user.name}</p><p class="text-xs text-slate-500">${user.role}</p></div>
     </div>
   </header>`;

  // --- Behaviour: mobile toggle + logout ---
  const sb=document.getElementById('sb'),ov=document.getElementById('sb-overlay');
  const toggle=o=>{sb.classList.toggle('-translate-x-full',!o);ov.classList.toggle('hidden',!o)};
  document.getElementById('hamburger').onclick=()=>toggle(true);
  ov.onclick=()=>toggle(false);
  document.getElementById('logoutBtn').onclick=()=>{
    localStorage.removeItem('crmUser'); // sirf login hatao, remembered email rehne do
    location.href='login.html';
  };
})();