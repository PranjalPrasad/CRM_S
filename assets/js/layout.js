/* Shared layout: injects sidebar + top bar. Needs <body data-page="x" data-title="X"> and #app-sidebar / #app-topbar. */
(function(){
  // --- Auth guard: no user -> login ---
  let user=null; try{user=JSON.parse(localStorage.getItem('crmUser'))}catch(e){}
  if(!user){location.replace('login.html');return}

  // --- Restore sidebar state (desktop only; CSS ignores it on mobile) ---
  if(localStorage.getItem('sbCollapsed')==='1')document.body.classList.add('sb-collapsed');

  // --- Navigation config (icon = SVG path inside 24x24 stroke icon) ---
  const NAV=[
   ['dashboard','Dashboard','dashboard.html','M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10'],
   ['customers','Customers','customers.html','M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M10 10a4 4 0 100-8 4 4 0 000 8M21 20v-2a4 4 0 00-3-3.9'],
   ['appointments','Appointments','appointments.html','M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z'],
   ['services','Services & Packages','services.html','M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z'],
   ['billing','Billing & Payments','billing.html','M2 6h20v12H2zM2 10h20M6 15h4'],
   ['memberships','Memberships','memberships.html','M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 100-5C13 2 12 7 12 7z'],
   ['inventory','Inventory','inventory.html','M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v9'],
   ['leads','Leads & Follow-ups','leads.html','M22 12h-4l-3 9L9 3l-3 9H2'],
  //  ['campaigns','Marketing & Campaigns','campaigns.html','M3 11v2a1 1 0 001 1h3l5 4V6L7 10H4a1 1 0 00-1 1zM16 8a5 5 0 010 8'],
   ['feedback','Feedback & Reviews','feedback.html','M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z'],
   ['staff','Staff','staff.html','M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8M22 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8'],
   ['reports','Reports','reports.html','M18 20V10M12 20V4M6 20v-6'],
  //  ['settings','Settings','settings.html','M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 014 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z']
  ];
  // --- Role rules ---
  const HIDE={Receptionist:['reports','settings','staff']};
  const ONLY={Therapist:['dashboard','appointments','customers']};
  const allowed=k=>ONLY[user.role]?ONLY[user.role].includes(k):!(HIDE[user.role]||[]).includes(k);

  const page=document.body.dataset.page;
  const icon=(p,cls='w-5 h-5')=>`<svg class="${cls} shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="${p}"/></svg>`;
  const links=NAV.filter(n=>allowed(n[0])).map(n=>
    `<a href="${n[2]}" title="${n[1]}" class="nav-item flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-teal-50 hover:text-teal-700 ${n[0]===page?'nav-link-active':''}">${icon(n[3])}<span class="sb-label truncate">${n[1]}</span></a>`).join('');

  // --- Sidebar (off-canvas on mobile, fixed + collapsible on lg+) ---
  // The collapse/expand button lives in the sidebar header, to the right of the "Serenity" heading.
  // When the sidebar is collapsed (desktop) the logo is hidden and only the toggle (flipped) stays visible.
  document.getElementById('app-sidebar').innerHTML=`
   <div id="sb-overlay" class="fixed inset-0 bg-slate-900/40 z-30 hidden lg:hidden"></div>
   <aside id="sb" class="fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200 flex flex-col -translate-x-full lg:translate-x-0 overflow-hidden">
     <div class="sb-brand h-14 flex items-center gap-3 px-4 border-b border-slate-100 shrink-0 lg:[.sb-collapsed_&]:justify-center lg:[.sb-collapsed_&]:px-0">
       <div class="w-8 h-8 rounded-lg bg-teal-600 text-white grid place-items-center font-bold shrink-0 lg:[.sb-collapsed_&]:hidden">K</div>
       <div class="sb-label leading-tight whitespace-nowrap"><p class="font-semibold text-slate-800">Kunash</p><p class="text-xs text-slate-400">Spa &amp; Salon CRM</p></div>
       <button id="sbToggle" type="button" class="ml-auto p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 shrink-0 lg:[.sb-collapsed_&]:ml-0" aria-label="Collapse sidebar" title="Collapse / expand sidebar">${icon('M11 17l-5-5 5-5M18 17l-5-5 5-5','w-5 h-5 transition-transform duration-200 lg:[.sb-collapsed_&]:rotate-180')}</button>
     </div>
     <nav class="flex-1 overflow-y-auto overflow-x-hidden p-2.5 space-y-0.5">${links}</nav>
     <div class="p-3 border-t border-slate-100 shrink-0">
       <button id="logoutBtn" title="Logout" class="nav-item w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50">${icon('M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9')}<span class="sb-label">Logout</span></button>
     </div>
   </aside>`;

  // --- Top bar (hamburger only shows on mobile, to open the drawer) ---
  const title=document.body.dataset.title||(NAV.find(n=>n[0]===page)||[0,'Serenity'])[1];
  const initials=user.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  document.getElementById('app-topbar').innerHTML=`
   <header class="h-14 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center gap-3 px-4 lg:px-6 sticky top-0 z-20">
     <button id="menuBtn" class="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100" aria-label="Open menu" title="Open menu">${icon('M4 6h16M4 12h16M4 18h16')}</button>
     <h1 class="text-lg font-semibold text-slate-800 truncate">${title}</h1>
     <div class="flex-1"></div>

     <!-- Notifications -->
     <div class="relative" id="notifWrap">
       <button id="notifBtn" class="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100" aria-label="Notifications" aria-expanded="false">${icon('M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0')}
         <span id="notifBadge" class="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-semibold grid place-items-center"></span>
       </button>
       <div id="notifPanel" class="hidden fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-16 sm:top-full sm:mt-2 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
         <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100">
           <p class="font-semibold text-slate-800 text-sm">Notifications</p>
           <button id="notifMarkAll" class="text-xs text-teal-600 hover:text-teal-700 font-medium">Mark all as read</button>
         </div>
         <div id="notifList" class="max-h-96 overflow-y-auto divide-y divide-slate-100"></div>
         <a href="dashboard.html" class="block text-center text-xs font-medium text-teal-600 hover:bg-teal-50 py-2.5 border-t border-slate-100">View all activity</a>
       </div>
     </div>

     <div class="flex items-center gap-3 pl-3 border-l border-slate-200">
       <div class="w-8 h-8 rounded-full bg-teal-600 text-white grid place-items-center text-sm font-semibold">${initials}</div>
       <div class="hidden md:block leading-tight"><p class="text-sm font-medium text-slate-800">${user.name}</p><p class="text-xs text-slate-500">${user.role}</p></div>
     </div>
   </header>`;

  // --- Behaviour: mobile drawer / desktop collapse + logout ---
  const sb=document.getElementById('sb'),ov=document.getElementById('sb-overlay'),tgl=document.getElementById('sbToggle');
  const isDesk=()=>window.matchMedia('(min-width:1024px)').matches;
  const drawer=o=>{sb.classList.toggle('-translate-x-full',!o);ov.classList.toggle('hidden',!o)};
  const syncTgl=()=>{const c=isDesk()&&document.body.classList.contains('sb-collapsed');
    tgl.setAttribute('aria-label',c?'Expand sidebar':'Collapse sidebar');tgl.setAttribute('aria-expanded',String(!c))};
  // Sidebar header button: collapse/expand on desktop, close the drawer on mobile
  tgl.onclick=()=>{
    if(isDesk()){
      const c=document.body.classList.toggle('sb-collapsed');
      try{localStorage.setItem('sbCollapsed',c?'1':'0')}catch(e){}
      syncTgl();
    }else drawer(false);
  };
  // Top bar hamburger (mobile only): open the drawer
  document.getElementById('menuBtn').onclick=()=>drawer(sb.classList.contains('-translate-x-full'));
  ov.onclick=()=>drawer(false);
  window.matchMedia('(min-width:1024px)').addEventListener('change',()=>{drawer(false);syncTgl()});
  syncTgl();

  // Logout -> index.html
  document.getElementById('logoutBtn').onclick=()=>{
    try{localStorage.removeItem('crmUser')}catch(e){}
    location.href='index.html';
  };

  // --- Notifications dropdown ---
  // Sample data: replace with real data (API / other localStorage keys) when ready.
  const DEFAULT_NOTIFS=[
    {id:1,type:'appointment',title:'New appointment booked',text:'Priya Sharma booked a Facial at 4:30 PM today.',time:'5 min ago',read:false,href:'appointments.html'},
    {id:2,type:'inventory',title:'Low stock alert',text:'Argan Hair Oil is down to 3 units.',time:'1 hr ago',read:false,href:'inventory.html'},
    {id:3,type:'lead',title:'Follow-up due',text:'Call Rahul Mehta about the Bridal Package.',time:'2 hrs ago',read:false,href:'leads.html'},
    {id:4,type:'billing',title:'Payment received',text:'₹2,500 received from Anjali Verma.',time:'Yesterday',read:true,href:'billing.html'},
    {id:5,type:'membership',title:'Membership expiring',text:"Neha Kapoor's Gold plan expires in 3 days.",time:'Yesterday',read:true,href:'memberships.html'}
  ];
  const TYPE_STYLE={
    appointment:['bg-teal-100 text-teal-700','M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z'],
    inventory:['bg-amber-100 text-amber-700','M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v9'],
    lead:['bg-sky-100 text-sky-700','M22 12h-4l-3 9L9 3l-3 9H2'],
    billing:['bg-emerald-100 text-emerald-700','M2 6h20v12H2zM2 10h20M6 15h4'],
    membership:['bg-violet-100 text-violet-700','M20 12v9H4v-9M2 7h20v5H2zM12 22V7']
  };
  let notifs; try{notifs=JSON.parse(localStorage.getItem('crmNotifs'))}catch(e){}
  if(!Array.isArray(notifs))notifs=DEFAULT_NOTIFS;
  const saveNotifs=()=>{try{localStorage.setItem('crmNotifs',JSON.stringify(notifs))}catch(e){}};

  const nBtn=document.getElementById('notifBtn'),
        nPanel=document.getElementById('notifPanel'),
        nList=document.getElementById('notifList'),
        nBadge=document.getElementById('notifBadge');

  function renderNotifs(){
    const unread=notifs.filter(n=>!n.read).length;
    nBadge.textContent=unread>9?'9+':unread;
    nBadge.style.display=unread===0?'none':'';
    nList.innerHTML=notifs.length?notifs.map(n=>{
      const s=TYPE_STYLE[n.type]||TYPE_STYLE.appointment;
      return `<a href="${n.href||'#'}" data-id="${n.id}" class="notif-item flex gap-3 px-4 py-3 hover:bg-slate-50 ${n.read?'':'bg-teal-50/40'}">
        <span class="w-9 h-9 rounded-full grid place-items-center shrink-0 ${s[0]}">${icon(s[1],'w-4 h-4')}</span>
        <span class="min-w-0 flex-1">
          <span class="block text-sm ${n.read?'text-slate-700':'font-semibold text-slate-900'}">${n.title}</span>
          <span class="block text-xs text-slate-500 mt-0.5">${n.text}</span>
          <span class="block text-[11px] text-slate-400 mt-1">${n.time}</span>
        </span>
        ${n.read?'':'<span class="w-2 h-2 rounded-full bg-teal-500 mt-2 shrink-0"></span>'}
      </a>`}).join('')
      :'<p class="text-sm text-slate-400 text-center py-10">You\'re all caught up 🎉</p>';
  }

  const togglePanel=open=>{
    nPanel.classList.toggle('hidden',!open);
    nBtn.setAttribute('aria-expanded',open);
  };

  nBtn.onclick=e=>{e.stopPropagation();togglePanel(nPanel.classList.contains('hidden'))};
  nPanel.onclick=e=>e.stopPropagation();
  document.addEventListener('click',()=>togglePanel(false));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')togglePanel(false)});

  document.getElementById('notifMarkAll').onclick=()=>{
    notifs.forEach(n=>n.read=true);saveNotifs();renderNotifs();
  };
  // Clicking a notification marks it read, then follows its link
  nList.onclick=e=>{
    const a=e.target.closest('.notif-item');if(!a)return;
    const n=notifs.find(x=>String(x.id)===a.dataset.id);
    if(n){n.read=true;saveNotifs()}
  };

  renderNotifs();
})();