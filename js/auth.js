// auth.js - register/login/logout + toast helper
function showToast(msg, timeout=3000){
  let t = document.getElementById('toast');
  if(!t){ t = document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg; t.style.display='block';
  setTimeout(()=> t.style.display='none', timeout);
}

function register(){
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const pass = document.getElementById('password').value;
  if(!name || !email || !pass){ showToast('Please fill all fields'); return; }
  const user = { name, email, pass };
  localStorage.setItem('user', JSON.stringify(user));
  showToast('Registered. Redirecting to login...');
  setTimeout(()=> window.location.href = 'login.html', 700);
}

function login(){
  const email = document.getElementById('email').value.trim();
  const pass = document.getElementById('password').value;
  const reg = JSON.parse(localStorage.getItem('user') || 'null');
  if(!reg){ showToast('No registered user yet'); return; }
  if(email === reg.email && pass === reg.pass){
    localStorage.setItem('loggedIn','true');
    localStorage.setItem('currentUser', JSON.stringify({ name: reg.name, email: reg.email }));
    showToast('Login success');
    setTimeout(()=> window.location.href = 'dashboard.html', 600);
  } else {
    showToast('Incorrect credentials');
  }
}

function logout(){
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('currentUser');
  showToast('Logged out');
  setTimeout(()=> window.location.href = 'index.html', 600);
}

function requireAuth(){
  const ok = localStorage.getItem('loggedIn');
  if(!ok){ window.location.href = 'login.html'; return false; }
  return true;
}
