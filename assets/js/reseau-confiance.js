/* RÉSEAU DIGIY — post-rendu : vitrine + accès PRO */
(function(){
'use strict';
if(window.__DIGIY_RESEAU_POST_RENDER__)return;
window.__DIGIY_RESEAU_POST_RENDER__=true;
var P=[
['🏡','Chez Baptiste','DIGIY LOC · Saly','https://part-chez-baptiste.digiylyfe.com/'],
['🔧','Helage plombier','DIGIY BUILD · Saly','https://beauville.github.io/helage-plombier/'],
['🛍️','Astou Boutique','MON COMMERCE / MARKET · Saly','https://astou-boutique.digiylyfe.com/'],
['🚕','Galerie chauffeurs','DIGIY DRIVER · Sénégal','https://galerie-chauffeurs.digiylyfe.com/catalogue.html']
];
var L={fr:['Je suis déjà abonné','Accès PRO abonnés','Des pros déjà visibles dès l’entrée.','La vitrine ne démarre jamais vide.','Voir la vitrine RÉSEAU','Vitrine'],en:['I am already subscribed','PRO subscriber access','Professionals visible from the start.','The showcase never starts empty.','View the RÉSEAU showcase','Showcase'],es:['Ya estoy abonado','Acceso PRO abonados','Profesionales visibles desde el inicio.','La vitrina nunca empieza vacía.','Ver la vitrina RÉSEAU','Vitrina'],de:['Ich bin bereits Abonnent','PRO-Zugang für Abonnenten','Profis direkt sichtbar.','Die Vitrine startet nie leer.','RÉSEAU-Schaufenster ansehen','Schaufenster'],it:['Sono già abbonato','Accesso PRO abbonati','Professionisti visibili dall’inizio.','La vetrina non parte mai vuota.','Vedi la vetrina RÉSEAU','Vetrina'],nl:['Ik ben al abonnee','PRO-toegang abonnees','Professionals meteen zichtbaar.','De etalage begint nooit leeg.','Bekijk de RÉSEAU-vitrine','Vitrine'],ar:['أنا مشترك بالفعل','دخول المحترفين المشتركين','محترفون ظاهرون منذ البداية.','لا تبدأ الواجهة فارغة.','عرض واجهة RÉSEAU','الواجهة']};
function txt(){try{var q=new URLSearchParams(location.search).get('lang'),s=localStorage.getItem('digiy_reseau_lang'),x=String(q||s||'fr').slice(0,2).toLowerCase();return L[x]||L.fr}catch(_){return L.fr}}
function inject(){
var t=txt(),a=document.querySelector('.rHero .rActions')||document.querySelector('.heroActions');
if(a){
var v=a.querySelector('[data-reseau-vitrine]');
if(!v){v=document.createElement('a');v.href='./journal.html';v.className=a.classList.contains('rActions')?'rBtn':'btn gold';v.setAttribute('data-reseau-vitrine','1');a.insertBefore(v,a.firstChild)}
v.textContent='📰 '+t[4];
if(a.classList.contains('rActions')){
v.className='rBtn';
v.style.background='linear-gradient(135deg,#f6c453,#d9a72f)';
v.style.color='#06130d';
v.style.borderColor='rgba(246,196,83,.78)';
v.style.boxShadow='0 10px 26px rgba(246,196,83,.18)';
var r=a.querySelector('a[href*="recommander.html"]');
if(r){r.style.background='rgba(0,166,81,.22)';r.style.color='#dcffe9';r.style.borderColor='rgba(0,166,81,.58)';r.style.boxShadow='0 10px 24px rgba(0,166,81,.12)'}
}
if(!a.querySelector('[data-reseau-abonne]')){var x=document.createElement('a');x.href='./acces-pro.html';x.className=a.classList.contains('rActions')?'rBtn':'btn';x.setAttribute('data-reseau-abonne','1');x.textContent='🔐 '+t[0];a.appendChild(x)}
}
var dock=document.querySelector('.dock');
if(dock){var dl=dock.querySelector('[data-reseau-vitrine-dock]');if(!dl){var target=dock.querySelector('a[href*="question.html"]');dl=document.createElement('a');dl.href='./journal.html';dl.setAttribute('data-reseau-vitrine-dock','1');if(target)target.replaceWith(dl);else dock.appendChild(dl)}dl.innerHTML='<i>📰</i><small>'+t[5]+'</small>'}
var d=document.querySelector('.rDoors');if(d&&!d.querySelector('[data-reseau-acces-pro]')){var z=document.createElement('a');z.href='./acces-pro.html';z.className='rDoor';z.setAttribute('data-reseau-acces-pro','1');z.innerHTML='<i>🔐</i><strong>'+t[1]+'</strong><p>'+t[0]+'</p><b>PRO →</b>';d.insertBefore(z,d.firstChild)}var g=document.querySelector('[data-panel="pro"] .doorGrid');if(g&&!g.querySelector('[data-reseau-acces-pro]')){var y=document.createElement('a');y.href='./acces-pro.html';y.className='door';y.setAttribute('data-reseau-acces-pro','1');y.innerHTML='<span class="doorIcon">🔐</span><span><strong>'+t[1]+'</strong><small>'+t[0]+'</small></span>';g.insertBefore(y,g.firstChild)}if(document.getElementById('reseau-vitrine-depart'))return;var h=document.querySelector('.rHero');if(h&&h.parentNode){var s=document.createElement('section');s.id='reseau-vitrine-depart';s.className='rPanel';s.innerHTML='<span class="rTag">RÉSEAU DIGIY</span><h2>'+t[2]+'</h2><p class="rLead">'+t[3]+'</p><div class="rGrid">'+P.map(function(p){return '<a class="rCard" href="'+p[3]+'" target="_blank" rel="noopener noreferrer"><i>'+p[0]+'</i><strong>'+p[1]+'</strong><p>'+p[2]+'</p><b>Voir →</b></a>'}).join('')+'</div>';h.insertAdjacentElement('afterend',s)}}
var busy=false;function schedule(){if(busy)return;busy=true;setTimeout(function(){busy=false;inject()},0)}
function boot(){if(!document.getElementById('reseau-langues-complet')){var s=document.createElement('script');s.id='reseau-langues-complet';s.src='./assets/js/reseau-langues.js?v=20260801-v3-traduction-complete';s.async=false;s.onload=schedule;(document.head||document.documentElement).appendChild(s)}schedule();try{new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true})}catch(_){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
