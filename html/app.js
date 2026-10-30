const apps=[['Launchpad','Project workspace','purple','▦'],['Finances','Personal finance tracker','blue','◒'],['Brand board','Creative moodboard','orange','✦'],['Pulse CRM','Customer dashboard','green','◌']];
const grid=document.querySelector('#appGrid'); const toast=document.querySelector('#toast');
function renderApps(){grid.innerHTML=apps.map(([name,desc,cover,icon])=>`<button class="app-card" aria-label="Open ${name}"><div class="app-cover cover-${cover}">${icon}</div><strong>${name}</strong><small>${desc}</small></button>`).join('')}
function notify(message){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2600)}
renderApps();
document.querySelector('#buildBtn').addEventListener('click',()=>{const value=document.querySelector('#prompt').value.trim();notify(value?`Starting your app: ${value}`:'Tell us what you want to build first.')});
document.querySelector('#newApp').addEventListener('click',()=>document.querySelector('#prompt').focus());
document.querySelector('#themeToggle').addEventListener('click',()=>{document.body.classList.toggle('light');notify(document.body.classList.contains('light')?'Light appearance enabled':'Dark appearance enabled')});
document.querySelector('.mobile-menu').addEventListener('click',()=>document.querySelector('.sidebar').classList.toggle('open'));
document.querySelectorAll('[data-view]').forEach(item=>item.addEventListener('click',()=>notify(`Opening ${item.dataset.view}`)));
document.querySelectorAll('.template-card').forEach(item=>item.addEventListener('click',()=>{document.querySelector('#prompt').value='Build an app for '+item.querySelector('strong').textContent.toLowerCase();document.querySelector('#prompt').focus()}));
document.querySelector('#prompt').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing&&e.keyCode!==229){e.preventDefault();document.querySelector('#buildBtn').click()}});
