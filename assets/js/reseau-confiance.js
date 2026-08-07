/* RÉSEAU DIGIY — surface d’entrée + chargeur multilingue complet */
(function(){
  'use strict';
  if(window.__DIGIY_RESEAU_COMPLETE_LOADER__)return;
  window.__DIGIY_RESEAU_COMPLETE_LOADER__=true;

  var SHOWCASE=[
    {icon:'🏡',name:'Chez Baptiste',meta:'DIGIY LOC · Saly',desc:'Logement réel et contact direct propriétaire.',url:'https://part-chez-baptiste.digiylyfe.com/'},
    {icon:'🔧',name:'Helage plombier',meta:'DIGIY BUILD · Saly',desc:'Plomberie, dépannage et installation.',url:'https://beauville.github.io/helage-plombier/'},
    {icon:'🛍️',name:'Astou Boutique',meta:'MON COMMERCE / MARKET · Saly',desc:'Commerce réel, produits et contact direct.',url:'https://astou-boutique.digiylyfe.com/'},
    {icon:'🚕',name:'Galerie chauffeurs',meta:'DIGIY DRIVER · Sénégal',desc:'Chauffeurs visibles, réservation et contact direct.',url:'https://galerie-chauffeurs.digiylyfe.com/catalogue.html'}
  ];

  function addStyle(){
    if(document.getElementById('reseau-entry-vitrine-style'))return;
    var style=document.createElement('style');
    style.id='reseau-entry-vitrine-style';
    style.textContent='\
      .reseauEntryShowcase{margin-top:14px;padding:18px;border-radius:26px;border:1px solid rgba(246,196,83,.34);background:linear-gradient(135deg,rgba(246,196,83,.10),rgba(0,166,81,.08));box-shadow:0 16px 40px rgba(0,0,0,.18)}\
      .reseauEntryHead{display:flex;justify-content:space-between;gap:12px;align-items:flex-end;flex-wrap:wrap}.reseauEntryHead h2{margin:0;font-size:clamp(28px,6vw,44px);line-height:.95;letter-spacing:-.05em;font-weight:1000}.reseauEntryHead h2 span{color:#f6c453}.reseauEntryHead p{margin:7px 0 0;max-width:720px;color:rgba(248,250,252,.76);font-size:13px;line-height:1.4;font-weight:850}\
      .reseauEntryGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin-top:14px}.reseauEntryCard{min-height:150px;padding:14px;border-radius:20px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.065);display:flex;flex-direction:column;gap:7px;color:inherit;text-decoration:none}.reseauEntryCard i{font-style:normal;font-size:28px}.reseauEntryCard strong{font-size:18px;line-height:1.02;font-weight:1000}.reseauEntryCard span{color:#dfffe9;font-size:11px;font-weight:1000}.reseauEntryCard small{color:rgba(248,250,252,.76);font-size:11px;line-height:1.35;font-weight:820}.reseauEntryCard b{margin-top:auto;color:#fff3cf;font-size:9.5px;text-transform:uppercase;letter-spacing:.05em;font-weight:1000}.reseauEntryNote{margin-top:11px;color:rgba(248,250,252,.62);font-size:10.5px;line-height:1.4;font-weight:800}\
      @media(max-width:760px){.reseauEntryGrid{grid-template-columns:1fr 1fr}}@media(max-width:430px){.reseauEntryGrid{grid-template-columns:1fr}}';
    document.head.appendChild(style);
  }

  function addSubscriberDoors(){
    var heroActions=document.querySelector('.heroActions');
    if(heroActions && !heroActions.querySelector('[data-reseau-abonne]')){
      var a=document.createElement('a');
      a.className='btn';
      a.href='./acces-pro.html';
      a.setAttribute('data-reseau-abonne','1');
      a.textContent='🔐 Je suis déjà abonné';
      heroActions.appendChild(a);
    }

    var proGrid=document.querySelector('[data-panel="pro"] .doorGrid');
    if(proGrid && !proGrid.querySelector('[data-reseau-acces-pro]')){
      var door=document.createElement('a');
      door.className='door';
      door.href='./acces-pro.html';
      door.setAttribute('data-reseau-acces-pro','1');
      door.innerHTML='<span class="doorIcon">🔐</span><span><strong>Accès PRO abonnés</strong><small>Vérifier mon accès RÉSEAU et ouvrir mon espace professionnel.</small></span>';
      proGrid.insertBefore(door,proGrid.firstChild);
    }
  }

  function addShowcase(){
    if(document.getElementById('reseau-vitrine-depart'))return;
    var hero=document.querySelector('.hero');
    if(!hero || !hero.parentNode)return;
    addStyle();
    var section=document.createElement('section');
    section.className='reseauEntryShowcase';
    section.id='reseau-vitrine-depart';
    section.setAttribute('aria-label','Vitrine de départ des professionnels DIGIY');
    section.innerHTML='<div class="reseauEntryHead"><div><h2>Des pros déjà <span>visibles dès l’entrée.</span></h2><p>La vitrine ne démarre jamais vide : voici des références réelles de l’écosystème DIGIY. Les publications RÉSEAU actives restent validées par DIGIY avant mise en lumière.</p></div><a class="btn green" href="./hub.html">Voir toute la vitrine →</a></div><div class="reseauEntryGrid">'+SHOWCASE.map(function(p){return '<a class="reseauEntryCard" href="'+p.url+'" target="_blank" rel="noopener noreferrer"><i>'+p.icon+'</i><strong>'+p.name+'</strong><span>'+p.meta+'</span><small>'+p.desc+'</small><b>Voir →</b></a>';}).join('')+'</div><div class="reseauEntryNote">Références de vitrine DIGIY : elles ne sont pas présentées ici comme des activations RÉSEAU payantes en cours.</div>';
    hero.insertAdjacentElement('afterend',section);
  }

  function loadLanguages(){
    if(document.getElementById('reseau-langues-complet'))return;
    var s=document.createElement('script');
    s.id='reseau-langues-complet';
    s.src='./assets/js/reseau-langues.js?v=20260801-v3-traduction-complete';
    s.async=false;
    (document.head||document.documentElement).appendChild(s);
  }

  function boot(){
    addSubscriberDoors();
    addShowcase();
    loadLanguages();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();