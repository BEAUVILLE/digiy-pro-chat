/* RÉSEAU DIGIY — confiance locale, recommandation humaine et contact direct */
(function(){
  'use strict';
  if(window.__DIGIY_RESEAU_CONFIANCE__)return;
  window.__DIGIY_RESEAU_CONFIANCE__=true;

  function style(){
    if(document.getElementById('reseau-confiance-style'))return;
    var css=document.createElement('style');
    css.id='reseau-confiance-style';
    css.textContent='\
.reseauFlow,.reseauCircle{margin-top:14px;padding:18px;border-radius:27px;border:2px solid rgba(246,196,83,.48);background:radial-gradient(520px 220px at 100% 0,rgba(246,196,83,.20),transparent 64%),radial-gradient(440px 220px at 0 100%,rgba(45,212,191,.16),transparent 66%),linear-gradient(145deg,rgba(9,72,49,.96),rgba(4,25,18,.99));box-shadow:0 18px 48px rgba(0,0,0,.28)}\
.reseauFlowHead,.reseauCircleHead{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}\
.reseauFlowTag,.reseauCircleTag{display:inline-flex;min-height:34px;align-items:center;padding:7px 11px;border-radius:999px;border:1px solid rgba(246,196,83,.48);background:rgba(246,196,83,.11);color:#fff3cf;font-size:10px;font-weight:1000;letter-spacing:.10em;text-transform:uppercase}\
.reseauFlow h2,.reseauCircle h2{margin:9px 0 0;max-width:820px;color:#fff;font-size:clamp(28px,6vw,48px);line-height:.94;letter-spacing:-.055em;font-weight:1000}\
.reseauFlow h2 span,.reseauCircle h2 span{color:#f6c453}\
.reseauFlowLead,.reseauCircleLead{margin:10px 0 0;max-width:860px;color:rgba(248,250,252,.80);font-size:14px;line-height:1.42;font-weight:900}\
.reseauFlowGrid,.reseauCircleGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:14px}\
.reseauFlowCard,.reseauCircleCard{min-height:124px;padding:13px;border-radius:19px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.065);display:flex;flex-direction:column;gap:7px}\
.reseauFlowCard i,.reseauCircleCard i{font-style:normal;font-size:29px;line-height:1}\
.reseauFlowCard strong,.reseauCircleCard strong{color:#fff;font-size:16px;line-height:1.05;font-weight:1000}\
.reseauFlowCard small,.reseauCircleCard small{color:rgba(248,250,252,.72);font-size:11px;line-height:1.34;font-weight:850}\
.reseauFlowActions,.reseauCircleActions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}\
.reseauFlowBtn,.reseauCircleBtn{min-height:50px;padding:10px 15px;border-radius:999px;border:1px solid rgba(246,196,83,.50);display:inline-flex;align-items:center;justify-content:center;text-align:center;background:rgba(255,255,255,.075);color:#fff3cf;font-size:12.5px;line-height:1.16;font-weight:1000;text-decoration:none}\
.reseauFlowBtn.main,.reseauCircleBtn.main{background:linear-gradient(135deg,#f6c453,#00a651);color:#06130d;border-color:rgba(246,196,83,.68)}\
.reseauSignature{margin-top:12px;padding:11px 13px;border-radius:17px;border:1px dashed rgba(246,196,83,.52);background:rgba(246,196,83,.08);color:#fff3cf;text-align:center;font-size:13px;line-height:1.4;font-weight:1000}\
@media(max-width:760px){.reseauFlowGrid,.reseauCircleGrid{grid-template-columns:repeat(2,minmax(0,1fr))}}\
@media(max-width:430px){.reseauFlow,.reseauCircle{padding:14px 12px;border-radius:23px}.reseauFlowGrid,.reseauCircleGrid{grid-template-columns:1fr}.reseauFlowActions,.reseauCircleActions{display:grid}.reseauFlowBtn,.reseauCircleBtn{width:100%}}';
    document.head.appendChild(css);
  }

  function indexPage(){
    var hero=document.querySelector('.hero');
    if(!hero)return;
    var brandSmall=document.querySelector('.brand small');
    if(brandSmall)brandSmall.textContent='Professionnels · recommandations · contact direct';
    var kicker=hero.querySelector('.kicker');
    var title=hero.querySelector('h1');
    var lead=hero.querySelector('.lead');
    var actions=hero.querySelector('.heroActions');
    var trust=hero.querySelector('.trust');
    if(kicker)kicker.textContent='RÉSEAU DE CONFIANCE · RECOMMANDATION DIRECTE';
    if(title)title.innerHTML='La confiance circule. <span>Le professionnel reste au centre.</span>';
    if(lead)lead.textContent='Un client satisfait ou un professionnel peut retrouver, recommander et orienter vers une personne fiable du terrain. Le contact et le paiement restent directs. DIGIY ne prend aucune commission.';
    if(actions)actions.innerHTML='<a class="btn gold" href="./hub.html">🌍 Voir les professionnels</a><a class="btn green" href="./recommander.html">🤝 Recommander un professionnel</a><a class="btn" href="./inscription.html">🏢 Rejoindre le réseau</a><a class="btn" href="https://digiylyfe.net/" target="_blank" rel="noopener noreferrer">🎧 Lire et écouter</a>';
    if(trust)trust.innerHTML='<span>🇸🇳 Sénégal</span><span>🇪🇺 Europe</span><span>🤝 Recommandation humaine</span><span>📲 Contact direct</span><span>0 % commission</span><span>🔒 Validation DIGIY</span>';

    if(!document.getElementById('reseau-flow')){
      var flow=document.createElement('section');
      flow.id='reseau-flow';
      flow.className='reseauFlow';
      flow.setAttribute('aria-label','Fonctionnement circulaire de RÉSEAU DIGIY');
      flow.innerHTML='<div class="reseauFlowHead"><div><span class="reseauFlowTag">LE CERCLE DE CONFIANCE DIGIY</span><h2>Une bonne expérience peut ouvrir <span>la prochaine bonne porte.</span></h2><p class="reseauFlowLead">RÉSEAU DIGIY ne cherche pas à enfermer les personnes dans une plateforme. Il permet de conserver une fiche fiable, de la partager et de transmettre une recommandation humaine.</p></div></div><div class="reseauFlowGrid"><div class="reseauFlowCard"><i>✅</i><strong>Une prestation réussie</strong><small>Le client ou le partenaire connaît réellement le professionnel.</small></div><div class="reseauFlowCard"><i>🤝</i><strong>Une recommandation honnête</strong><small>Quelques faits simples sont transmis à DIGIY pour vérification.</small></div><div class="reseauFlowCard"><i>📲</i><strong>Une fiche facile à partager</strong><small>Le lien et le QR rendent le professionnel retrouvable directement.</small></div><div class="reseauFlowCard"><i>🔄</i><strong>La confiance circule</strong><small>Un chauffeur, un hébergeur, un restaurant ou un artisan peut ouvrir une autre bonne porte.</small></div></div><div class="reseauSignature">La fiche rend visible. Le QR fidélise. Le réseau fait circuler la confiance.</div><div class="reseauFlowActions"><a class="reseauFlowBtn main" href="./recommander.html">🤝 Recommander un professionnel</a><a class="reseauFlowBtn" href="./hub.html">🌍 Découvrir le réseau</a></div>';
      hero.insertAdjacentElement('afterend',flow);
    }

    var doctrine=document.querySelector('.doctrine');
    if(doctrine){
      var dh=doctrine.querySelector('h2');
      var dp=doctrine.querySelector('p');
      var dq=doctrine.querySelector('.quote');
      if(dh)dh.innerHTML='La fiche rend visible. <span>Le réseau prolonge la confiance.</span>';
      if(dp)dp.textContent='Chaque professionnel garde son contact, son paiement et sa relation client. RÉSEAU DIGIY ajoute une passerelle simple pour recommander, orienter et faire circuler les bonnes expériences du terrain.';
      if(dq)dq.textContent='« Une plateforme garde souvent le client. RÉSEAU DIGIY aide le professionnel à garder la relation. »';
    }

    var quick=document.querySelector('.quickDoors');
    if(quick)quick.innerHTML='<a class="quickDoor" href="./hub.html"><i>🌍</i><strong>Trouver un professionnel</strong><small>Voir les personnes, les métiers, les fiches et les contacts directs.</small><b>Découvrir le réseau →</b></a><a class="quickDoor" href="./recommander.html"><i>🤝</i><strong>Recommander un professionnel</strong><small>Transmettre une expérience réelle pour validation humaine DIGIY.</small><b>Préparer une recommandation →</b></a><a class="quickDoor" href="./inscription.html"><i>🏢</i><strong>Rejoindre le réseau</strong><small>Présenter son activité et demander une activation RÉSEAU.</small><b>Ouvrir l’inscription →</b></a>';
  }

  function hubPage(){
    var anchor=document.querySelector('.diapo-shell')||document.querySelector('.hubDoctrine');
    if(!anchor)return;
    var brandText=document.querySelector('.brand p');
    if(brandText)brandText.textContent='Trouver · recommander · contacter directement';
    var diapoSub=document.querySelector('.diapo-sub');
    if(diapoSub)diapoSub.textContent='Professionnels · recommandations · QR · contact direct · 0% commission';
    var nav=document.querySelector('.nav');
    if(nav && !nav.querySelector('[href="./recommander.html"]'))nav.insertAdjacentHTML('afterbegin','<a class="gold" href="./recommander.html">🤝 Recommander</a>');
    var chips=document.querySelectorAll('.chips .chip-mini');
    chips.forEach(function(chip){if(chip.textContent.indexOf('France')!==-1)chip.textContent=chip.textContent.replace('France','Europe');});

    var doctrine=document.querySelector('.hubDoctrine');
    if(doctrine){
      var title=doctrine.querySelector('h3');
      var quote=doctrine.querySelector('.hubDoctrineQuote');
      if(title)title.innerHTML='Le public voit. <span>La confiance circule après validation.</span>';
      if(quote)quote.textContent='RÉSEAU DIGIY organise la visibilité et la recommandation qualifiée. Le professionnel garde son client, son argent et sa relation.';
    }

    if(!document.getElementById('reseau-circle')){
      var circle=document.createElement('section');
      circle.id='reseau-circle';
      circle.className='reseauCircle';
      circle.setAttribute('aria-label','Exemples de recommandations entre professionnels');
      circle.innerHTML='<div class="reseauCircleHead"><div><span class="reseauCircleTag">RÉSEAU CIRCULAIRE · TERRAIN</span><h2>Les professionnels peuvent se transmettre <span>de bonnes portes.</span></h2><p class="reseauCircleLead">La recommandation reste humaine et modérée. DIGIY ne prélève rien sur la prestation et ne remplace jamais le choix du client.</p></div></div><div class="reseauCircleGrid"><div class="reseauCircleCard"><i>🚗 → 🏠</i><strong>Chauffeur vers logement</strong><small>Après un trajet, le chauffeur peut transmettre une adresse fiable.</small></div><div class="reseauCircleCard"><i>🏠 → 🍽️</i><strong>Hébergeur vers restaurant</strong><small>Le visiteur découvre une bonne table par une recommandation locale.</small></div><div class="reseauCircleCard"><i>🏗️ → ⚡</i><strong>Maçon vers électricien</strong><small>Les artisans complètent un chantier sans plateforme intermédiaire.</small></div><div class="reseauCircleCard"><i>🛍️ → 🚚</i><strong>Boutique vers service</strong><small>Un commerce peut orienter vers un livreur, un réparateur ou un imprimeur.</small></div></div><div class="reseauSignature">La fiche rend visible. Le QR fidélise. Le réseau fait circuler la confiance.</div><div class="reseauCircleActions"><a class="reseauCircleBtn main" href="./recommander.html">🤝 Transmettre une recommandation</a><a class="reseauCircleBtn" href="./inscription.html">🏢 Rejoindre RÉSEAU DIGIY</a></div>';
      anchor.insertAdjacentElement('afterend',circle);
    }
  }

  function init(){style();var path=(location.pathname||'').toLowerCase();if(path.endsWith('/hub.html')||path.endsWith('hub.html'))hubPage();else indexPage();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
