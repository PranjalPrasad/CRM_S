/* Login logic (demo only: any credentials work) */
(function(){
  // Already logged in? Go straight to the dashboard.
  try{if(JSON.parse(localStorage.getItem('crmUser')))return location.replace('dashboard.html')}catch(e){}

  const $=id=>document.getElementById(id);
  const form=$('loginForm'),email=$('email'),pass=$('password');
  const remember=$('remember'); // null hai kyunki HTML mein checkbox commented hai

  // Prefill remembered email (checkbox ho tabhi tick karo)
  const saved=localStorage.getItem('crmRememberEmail');
  if(saved){
    email.value=saved;
    if(remember) remember.checked=true;
  }

  // Show/Hide password login.html ke inline script se handle hota hai

  // Inline error helper: error na ho to true return karta hai
  function setError(input,msg){
    const el=$(input.id+'Error');
    if(el){
      el.textContent=msg||'';
      el.classList.toggle('show',!!msg);
    }
    input.classList.toggle('input-invalid',!!msg);
    return !msg;
  }

  // Type karte waqt errors hatao
  [email,pass].forEach(i=>i.addEventListener('input',()=>setError(i,'')));

  form.addEventListener('submit',e=>{
    e.preventDefault();
    const ev=email.value.trim();
    let ok=true;
    if(!ev) ok=setError(email,'Enter your email address.')&&ok;
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ev)) ok=setError(email,'Enter a valid email, like name@kunash.in.')&&ok;
    if(!pass.value) ok=setError(pass,'Enter your password.')&&ok;
    if(!ok)return;

    // Email se display name banao (demo only)
    const name=ev.split('@')[0].replace(/[._-]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase());

    // Abhi sab Admin ki tarah login hote hain
    localStorage.setItem('crmUser',JSON.stringify({name,email:ev,role:'Admin'}));

    if(remember && remember.checked) localStorage.setItem('crmRememberEmail',ev);
    else localStorage.removeItem('crmRememberEmail');

    location.href='dashboard.html';
  });
})();