/* Login logic (demo only: any credentials work) */
(function(){
  // Already logged in? Go straight to the dashboard.
  try{if(JSON.parse(localStorage.getItem('crmUser')))return location.replace('dashboard.html')}catch(e){}

  const $=id=>document.getElementById(id);
  const form=$('loginForm'),email=$('email'),pass=$('password');

  // Prefill remembered email
  const saved=localStorage.getItem('crmRememberEmail');
  if(saved){email.value=saved;$('remember').checked=true}

  // Show / hide password
  $('togglePw').onclick=()=>{
    const show=pass.type==='password';
    pass.type=show?'text':'password';
    $('togglePw').textContent=show?'Hide':'Show';
  };

  // Inline error helper: returns true when there is no error
  function setError(input,msg){
    const el=$(input.id+'Error');
    el.textContent=msg||'';
    el.classList.toggle('show',!!msg);
    input.classList.toggle('input-invalid',!!msg);
    return !msg;
  }
  // Clear errors while typing
  [email,pass].forEach(i=>i.addEventListener('input',()=>setError(i,'')));

  form.addEventListener('submit',e=>{
    e.preventDefault();
    const ev=email.value.trim();
    let ok=true;
    if(!ev) ok=setError(email,'Enter your email address.')&&ok;
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ev)) ok=setError(email,'Enter a valid email, like name@serenity.in.')&&ok;
    if(!pass.value) ok=setError(pass,'Enter your password.')&&ok;
    if(!ok)return;

    // Build a display name from the email (demo only)
    const name=ev.split('@')[0].replace(/[._-]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
    // Role field removed from the form: everyone logs in as Admin for now.
    // (layout.js reads user.role for sidebar permissions and the top bar label.)
    localStorage.setItem('crmUser',JSON.stringify({name,email:ev,role:'Admin'}));
    if($('remember').checked) localStorage.setItem('crmRememberEmail',ev); else localStorage.removeItem('crmRememberEmail');
    location.href='dashboard.html';
  });
})();