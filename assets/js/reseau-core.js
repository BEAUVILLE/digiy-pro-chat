/* RÉSEAU DIGIY — Com au clic, paiement à la durée
   Doctrine : la fiche est la maison du pro, l'annonce est le projecteur de la semaine.
   Local robuste d'abord : localStorage. Supabase pourra être branché ensuite sans casser les pages.
*/
(function(){
  'use strict';

  const STORE = {
    profile: 'DIGIY_RESEAU_PROFILE_V1',
    offer: 'DIGIY_RESEAU_OFFER_V1',
    payment: 'DIGIY_RESEAU_PAYMENT_V1',
    lastMessage: 'DIGIY_RESEAU_LAST_MESSAGE_V1'
  };

  const ADMIN_WA = '221771342889';
  const DEFAULT_PHONE = '221771342889';

  const plans = {
    week: { label:'7 jours', price:3500, days:7, badge:'Semaine terrain' },
    quinzaine: { label:'15 jours', price:6500, days:15, badge:'Quinzaine fluide' },
    month: { label:'30 jours', price:12000, days:30, badge:'Mois posé' }
  };

  const métiers = [
    'Chambre / logement','Chauffeur / retour AIBD','Produit maison','Boutique','Restaurant','Artisan / service','Beauté','Activité / guide','Immobilier','Autre'
  ];
  const typesAnnonce = ['Promo','Disponibilité','Arrivage','Retour disponible','Événement','Urgence service','Offre famille','Nouveau produit'];
  const zones = ['Saly','Mbour','Ngaparou','Somone','Nianing','Dakar','AIBD','Thiès','Petite Côte','Autre'];

  function $(sel, root=document){ return root.querySelector(sel); }
  function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  function read(key, fallback){
    try{ return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch(e){ return fallback; }
  }
  function write(key, value){ localStorage.setItem(key, JSON.stringify(value)); return value; }
  function clearKey(key){ localStorage.removeItem(key); }
  function safe(s){ return (s || '').toString().trim(); }
  function money(n){ return new Intl.NumberFormat('fr-FR').format(Number(n||0)) + ' FCFA'; }
  function isoDatePlus(days){
    const d = new Date();
    d.setDate(d.getDate() + Number(days || 7));
    return d.toISOString().slice(0,10);
  }
  function humanDate(iso){
    if(!iso) return '';
    try{ return new Date(iso + 'T12:00:00').toLocaleDateString('fr-SN', {weekday:'long', day:'2-digit', month:'long', year:'numeric'}); }
    catch(e){ return iso; }
  }
  function phoneClean(v){ return safe(v).replace(/[^0-9+]/g,'').replace(/^00/,'+'); }
  function phoneWa(v){
    let p = phoneClean(v || DEFAULT_PHONE);
    if(p.startsWith('+')) p = p.slice(1);
    if(p.startsWith('00')) p = p.slice(2);
    return p || DEFAULT_PHONE;
  }
  function currentUrl(file){
    const url = new URL(window.location.href);
    const parts = url.pathname.split('/');
    parts[parts.length - 1] = file || 'fiche.html';
    url.pathname = parts.join('/');
    url.search = '';
    url.hash = '';
    return url.toString();
  }

  function defaultProfile(){
    return {
      name:'', business:'', métier:'Produit maison', phone:'', zone:'Saly', city:'Saly', note:''
    };
  }
  function defaultOffer(){
    return {
      title:'', type:'Promo', métier:'Produit maison', zone:'Saly', priceText:'', details:'', plan:'week', startDate:new Date().toISOString().slice(0,10), endDate:isoDatePlus(7), cta:'Appeler ou WhatsApp direct', photo:'', status:'brouillon'
    };
  }
  function getProfile(){ return read(STORE.profile, defaultProfile()); }
  function getOffer(){ return read(STORE.offer, defaultOffer()); }
  function getPayment(){ return read(STORE.payment, { plan:'week', status:'non_regle', method:'Wave', reference:'', createdAt:null }); }
  function saveProfile(data){ return write(STORE.profile, Object.assign(defaultProfile(), data || {})); }
  function saveOffer(data){ return write(STORE.offer, Object.assign(defaultOffer(), data || {})); }
  function savePayment(data){ return write(STORE.payment, Object.assign(getPayment(), data || {})); }

  function offerLink(src){
    const url = new URL(currentUrl('fiche.html'));
    if(src) url.searchParams.set('src', src);
    return url.toString();
  }

  function buildOfferMessage(src){
    const p = getProfile();
    const o = getOffer();
    const title = safe(o.title) || 'Offre disponible cette semaine';
    const place = safe(o.zone || p.zone) || 'Sénégal';
    const biz = safe(p.business || p.name) || 'un pro DIGIY';
    const detail = safe(o.details);
    const price = safe(o.priceText);
    const until = o.endDate ? 'Valable jusqu’au ' + humanDate(o.endDate) + '.' : 'Valable cette semaine.';
    const link = offerLink(src || 'partage');
    let msg = `🔥 ${title}\n${biz} · ${place}\n`;
    if(price) msg += `Prix / offre : ${price}\n`;
    if(detail) msg += `${detail}\n`;
    msg += `${until}\nVoir la fiche directe : ${link}\nContact direct, 0% commission.`;
    return msg;
  }

  function buildFamilyMessage(){
    const p = getProfile();
    const o = getOffer();
    const biz = safe(p.business || p.name) || 'mon activité';
    const title = safe(o.title) || 'mon annonce DIGIY';
    return `Bonjour la famille, pouvez-vous faire circuler cette offre autour de vous ?\n${title} — ${biz}\nLien direct : ${offerLink('famille')}\nMerci de partager, contact direct avec le pro.`;
  }

  function buildGroupMessage(){
    const o = getOffer();
    const title = safe(o.title) || 'Offre disponible cette semaine';
    return `📢 ${title}\nAnnonce posée sur DIGIY pendant quelques jours. Cliquez pour voir la fiche, appeler ou écrire directement :\n${offerLink('groupe')}\nMerci de faire circuler autour de vous.`;
  }

  function buildSmsBridge(){
    const p = getProfile();
    const biz = safe(p.business || p.name) || 'DIGIY';
    return `Bonjour, c’est ${biz}. Merci d’enregistrer ce numéro dans votre répertoire. Ensuite nous pourrons échanger plus facilement sur WhatsApp.`;
  }

  async function copyText(text, label){
    const value = safe(text);
    if(!value) return notice('Rien à copier pour le moment.', 'warn');
    try{
      await navigator.clipboard.writeText(value);
      write(STORE.lastMessage, { text:value, copiedAt:new Date().toISOString(), label:label || 'message' });
      notice('Copié : ' + (label || 'message prêt'), 'ok');
    }catch(e){
      const area = document.createElement('textarea');
      area.value = value;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
      notice('Copié : ' + (label || 'message prêt'), 'ok');
    }
  }

  function waHref(text, phone){
    return 'https://wa.me/' + phoneWa(phone || getProfile().phone || ADMIN_WA) + '?text=' + encodeURIComponent(text || '');
  }
  function smsHref(text, phone){
    const p = phoneClean(phone || getProfile().phone || '');
    return 'sms:' + p + '?&body=' + encodeURIComponent(text || '');
  }
  function telHref(phone){ return 'tel:' + phoneClean(phone || getProfile().phone || ''); }

  function notice(text, type='ok'){
    let el = $('#reseauNotice');
    if(!el){
      el = document.createElement('div');
      el.id = 'reseauNotice';
      el.className = 'notice';
      document.body.appendChild(el);
    }
    el.textContent = text;
    el.dataset.type = type;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(()=> el.classList.remove('show'), 2800);
  }

  function fillSelect(id, values, selected){
    const el = typeof id === 'string' ? document.getElementById(id) : id;
    if(!el) return;
    el.innerHTML = values.map(v => `<option value="${v}" ${v===selected?'selected':''}>${v}</option>`).join('');
  }

  function bindChips(root=document){
    $all('[data-chip-target]', root).forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const target = document.getElementById(btn.dataset.chipTarget);
        if(!target) return;
        target.value = btn.dataset.value || btn.textContent.trim();
        $all(`[data-chip-target="${btn.dataset.chipTarget}"]`, root).forEach(b=> b.classList.remove('active'));
        btn.classList.add('active');
        target.dispatchEvent(new Event('input', { bubbles:true }));
        target.dispatchEvent(new Event('change', { bubbles:true }));
      });
    });
  }

  function bindCopyButtons(root=document){
    $all('[data-copy]', root).forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const key = btn.dataset.copy;
        const map = {
          offer: buildOfferMessage('copie'),
          family: buildFamilyMessage(),
          group: buildGroupMessage(),
          sms: buildSmsBridge(),
          link: offerLink('copie-lien'),
          phone: getProfile().phone || '',
          last: (read(STORE.lastMessage,{text:''}).text || '')
        };
        copyText(map[key] || btn.dataset.copyText || '', btn.dataset.label || key);
      });
    });
  }

  function refreshHeader(){
    const p = getProfile();
    const o = getOffer();
    const pay = getPayment();
    $all('[data-profile-name]').forEach(el=> el.textContent = safe(p.business || p.name) || 'Pro DIGIY');
    $all('[data-profile-phone]').forEach(el=> el.textContent = safe(p.phone) || 'Téléphone à poser');
    $all('[data-offer-title]').forEach(el=> el.textContent = safe(o.title) || 'Annonce à préparer');
    $all('[data-offer-status]').forEach(el=> el.textContent = pay.status === 'regle' ? 'Réglé / prêt activation' : 'En attente règlement');
    $all('[data-offer-link]').forEach(el=> el.textContent = offerLink('affichage'));
  }

  function initProfilePage(){
    const p = getProfile();
    fillSelect('metier', métiers, p.métier);
    fillSelect('zone', zones, p.zone);
    ['name','business','phone','city','note'].forEach(k=>{ const el = document.getElementById(k); if(el) el.value = p[k] || ''; });
    const form = $('#profileForm');
    if(form){
      form.addEventListener('submit', e=>{
        e.preventDefault();
        const data = {
          name:safe($('#name')?.value), business:safe($('#business')?.value), métier:safe($('#metier')?.value), phone:safe($('#phone')?.value), zone:safe($('#zone')?.value), city:safe($('#city')?.value), note:safe($('#note')?.value)
        };
        saveProfile(data); refreshHeader(); notice('Inscription locale enregistrée. Tu peux poser l’annonce.', 'ok');
      });
    }
  }

  function initOfferPage(){
    const o = getOffer();
    fillSelect('type', typesAnnonce, o.type);
    fillSelect('metier', métiers, o.métier);
    fillSelect('zone', zones, o.zone);
    ['title','priceText','details','startDate','endDate','photo','cta'].forEach(k=>{ const el = document.getElementById(k); if(el) el.value = o[k] || ''; });
    const plan = document.getElementById('plan');
    if(plan) plan.value = o.plan || 'week';

    function updatePreview(){
      const data = readOfferForm();
      saveOffer(Object.assign(data, { status:'brouillon' }));
      renderMessageBox();
      refreshHeader();
    }
    function readOfferForm(){
      const chosen = safe($('#plan')?.value) || 'week';
      const planInfo = plans[chosen] || plans.week;
      let end = safe($('#endDate')?.value);
      if(!end) end = isoDatePlus(planInfo.days);
      return {
        title:safe($('#title')?.value), type:safe($('#type')?.value), métier:safe($('#metier')?.value), zone:safe($('#zone')?.value), priceText:safe($('#priceText')?.value), details:safe($('#details')?.value), plan:chosen, startDate:safe($('#startDate')?.value) || new Date().toISOString().slice(0,10), endDate:end, photo:safe($('#photo')?.value), cta:safe($('#cta')?.value)
      };
    }
    $all('input,textarea,select').forEach(el=> el.addEventListener('input', updatePreview));
    if(plan){
      plan.addEventListener('change', ()=>{
        const chosen = plan.value;
        const info = plans[chosen] || plans.week;
        const end = $('#endDate');
        if(end) end.value = isoDatePlus(info.days);
        updatePreview();
      });
    }
    const form = $('#offerForm');
    if(form){
      form.addEventListener('submit', e=>{
        e.preventDefault();
        const data = readOfferForm();
        saveOffer(Object.assign(data, { status:'pret_reglement' }));
        savePayment({ plan:data.plan, status:'non_regle' });
        refreshHeader(); renderMessageBox();
        notice('Annonce préparée. Étape suivante : règlement durée choisie.', 'ok');
      });
    }
    renderMessageBox();
  }

  function renderMessageBox(){
    const box = $('#messagePreview');
    if(box) box.value = buildOfferMessage('preview');
    const fam = $('#familyPreview');
    if(fam) fam.value = buildFamilyMessage();
  }

  function initPaymentPage(){
    const o = getOffer();
    const pay = getPayment();
    const planEl = $('#paymentPlan');
    if(planEl) planEl.value = pay.plan || o.plan || 'week';
    function renderPlan(){
      const chosen = safe(planEl?.value) || 'week';
      const info = plans[chosen] || plans.week;
      $('#planLabel') && ($('#planLabel').textContent = info.label);
      $('#planPrice') && ($('#planPrice').textContent = money(info.price));
      $('#planDays') && ($('#planDays').textContent = info.days + ' jours visibles');
      $('#planBadge') && ($('#planBadge').textContent = info.badge);
      const payMsg = `Bonjour DIGIY, je veux activer mon annonce RÉSEAU DIGIY.\nDurée : ${info.label}\nMontant : ${money(info.price)}\nPro : ${(getProfile().business || getProfile().name || 'Pro DIGIY')}\nTéléphone : ${(getProfile().phone || '')}\nAnnonce : ${(getOffer().title || 'Annonce RÉSEAU DIGIY')}\nLien fiche : ${offerLink('reglement')}`;
      const wa = $('#payWhatsApp');
      if(wa) wa.href = waHref(payMsg, ADMIN_WA);
      const copy = $('#paymentCopyText');
      if(copy) copy.value = payMsg;
    }
    if(planEl) planEl.addEventListener('change', ()=>{ savePayment({ plan:planEl.value }); renderPlan(); });
    const form = $('#paymentForm');
    if(form){
      $('#paymentRef') && ($('#paymentRef').value = pay.reference || '');
      form.addEventListener('submit', e=>{
        e.preventDefault();
        savePayment({ plan:safe(planEl?.value)||'week', method:safe($('#paymentMethod')?.value)||'Wave', reference:safe($('#paymentRef')?.value), status:'regle', createdAt:new Date().toISOString() });
        const o2 = getOffer();
        saveOffer(Object.assign(o2, { status:'attente_activation' }));
        refreshHeader(); renderPlan(); notice('Règlement noté localement. Envoie la preuve à DIGIY pour activation.', 'ok');
      });
    }
    renderPlan();
  }

  function initAssistantPage(){
    const input = $('#rawIdea');
    const output = $('#assistantText');
    function generate(kind){
      const raw = safe(input?.value);
      const p = getProfile();
      let text = '';
      if(kind === 'retour') text = `Bonjour, je suis disponible pour un retour ${raw || 'AIBD / Dakar vers Saly ou Mbour'} aujourd’hui. Contact direct par appel ou WhatsApp. ${offerLink('assistant-retour')}`;
      else if(kind === 'promo') text = `Offre spéciale cette semaine : ${raw || 'remise / pack disponible'}. Voir la fiche DIGIY, appeler ou WhatsApp direct : ${offerLink('assistant-promo')}`;
      else if(kind === 'produit') text = `Produit disponible : ${raw || 'savons maison, beurre de karité, produits bio'}. Commande directe via la fiche DIGIY : ${offerLink('assistant-produit')}`;
      else if(kind === 'service') text = `Service disponible : ${raw || 'intervention, devis ou rendez-vous'}. Contact direct avec ${(p.business || p.name || 'le pro')} : ${offerLink('assistant-service')}`;
      else text = buildOfferMessage('assistant');
      if(output) output.value = text;
      write(STORE.lastMessage, { text, copiedAt:null, label:'assistant' });
    }
    $all('[data-assistant]').forEach(btn=> btn.addEventListener('click', ()=> generate(btn.dataset.assistant)));
    if(output && !output.value) output.value = buildOfferMessage('assistant');
  }

  function initFichePage(){
    const p = getProfile();
    const o = getOffer();
    const pay = getPayment();
    $('#ficheBusiness') && ($('#ficheBusiness').textContent = safe(p.business || p.name) || 'Pro DIGIY');
    $('#ficheMetier') && ($('#ficheMetier').textContent = safe(o.métier || p.métier) || 'Activité locale');
    $('#ficheZone') && ($('#ficheZone').textContent = safe(o.zone || p.zone) || 'Sénégal');
    $('#fichePhone') && ($('#fichePhone').textContent = safe(p.phone) || 'Téléphone à poser');
    $('#ficheTitle') && ($('#ficheTitle').textContent = safe(o.title) || 'Offre de la semaine');
    $('#ficheDetails') && ($('#ficheDetails').textContent = safe(o.details) || 'Annonce préparée par RÉSEAU DIGIY. Le pro peut modifier les détails, prix, horaires et durée.');
    $('#fichePrice') && ($('#fichePrice').textContent = safe(o.priceText) || 'Prix / remise à confirmer');
    $('#ficheDates') && ($('#ficheDates').textContent = o.endDate ? 'Valable jusqu’au ' + humanDate(o.endDate) : 'Durée à confirmer');
    $('#ficheStatus') && ($('#ficheStatus').textContent = pay.status === 'regle' ? 'Annonce prête activation DIGIY' : 'Annonce en préparation');
    const img = $('#fichePhoto');
    if(img && safe(o.photo)){ img.src = o.photo; img.hidden = false; }
    const wa = $('#ficheWa'); if(wa) wa.href = waHref(buildOfferMessage('client-whatsapp'), p.phone || ADMIN_WA);
    const sms = $('#ficheSms'); if(sms) sms.href = smsHref(buildSmsBridge(), p.phone || '');
    const tel = $('#ficheTel'); if(tel) tel.href = telHref(p.phone || '');
    const map = $('#ficheMaps'); if(map) map.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent((p.city || o.zone || 'Saly Sénégal'));
  }

  function initJournalPage(){
    const grid = $('#journalGrid');
    if(!grid) return;
    const p = getProfile(); const o = getOffer();
    const cards = [];
    if(safe(o.title) || safe(p.business)){
      cards.push({ title:safe(o.title)||'Annonce locale', biz:safe(p.business||p.name)||'Pro DIGIY', zone:safe(o.zone||p.zone)||'Saly', details:safe(o.details)||'Offre préparée localement.', href:'fiche.html?src=journal-local', badge:'Votre annonce' });
    }
    cards.push(
      { title:'Retour AIBD vers Saly', biz:'Chauffeur DIGIY', zone:'AIBD → Petite Côte', details:'Retour disponible, places à confirmer. Contact direct.', href:'fiche.html?src=demo-aibd', badge:'DRIVER' },
      { title:'Savons maison & beurre de karité', biz:'Produit bio maison', zone:'Saly / Mbour', details:'Commande directe, partage famille/groupe.', href:'fiche.html?src=demo-produit', badge:'Produit maison' },
      { title:'Chambre : 2 nuits payées, 3e offerte', biz:'Hébergement local', zone:'Saly', details:'Offre semaine, visible sur fiche pro.', href:'fiche.html?src=demo-loc', badge:'LOC / RESA' }
    );
    grid.innerHTML = cards.map(c=>`<a class="offer-card" href="${c.href}"><span>${c.badge}</span><strong>${c.title}</strong><em>${c.biz} · ${c.zone}</em><p>${c.details}</p><b>Voir la fiche →</b></a>`).join('');
  }

  function initSessionPage(){
    const p = getProfile(); const o = getOffer(); const pay = getPayment();
    const box = $('#localState');
    if(box) box.value = JSON.stringify({ profile:p, offer:o, payment:pay }, null, 2);
    $('#clearDraft')?.addEventListener('click', ()=>{ clearKey(STORE.offer); clearKey(STORE.payment); notice('Brouillon annonce nettoyé.', 'ok'); setTimeout(()=>location.reload(),600); });
    $('#clearAll')?.addEventListener('click', ()=>{ Object.values(STORE).forEach(clearKey); notice('Mémoire locale RÉSEAU DIGIY nettoyée.', 'ok'); setTimeout(()=>location.href='hub.html',900); });
  }

  function initGlobal(){
    refreshHeader(); bindChips(); bindCopyButtons();
    $all('[data-wa-offer]').forEach(a=> a.href = waHref(buildOfferMessage('whatsapp'), getProfile().phone || ADMIN_WA));
    $all('[data-sms-bridge]').forEach(a=> a.href = smsHref(buildSmsBridge(), getProfile().phone || ''));
    $all('[data-link-fiche]').forEach(a=> a.href = offerLink(a.dataset.src || 'nav'));
    $all('[data-fill-message]').forEach(el=> el.value = buildOfferMessage(el.dataset.src || 'fill'));
  }

  window.RESEAU = {
    STORE, plans, métiers, typesAnnonce, zones, $, $all,
    getProfile, getOffer, getPayment, saveProfile, saveOffer, savePayment,
    buildOfferMessage, buildFamilyMessage, buildGroupMessage, buildSmsBridge,
    offerLink, copyText, waHref, smsHref, telHref, money, humanDate, notice,
    initGlobal, initProfilePage, initOfferPage, initPaymentPage, initAssistantPage, initFichePage, initJournalPage, initSessionPage
  };

  document.addEventListener('DOMContentLoaded', initGlobal);
})();
