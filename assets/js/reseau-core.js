/* RÉSEAU DIGIY — Com au clic · Club privé visible au public
   Doctrine : la fiche rassure, l'annonce attire, le contact transforme.
   Publication qualifiée : pros DIGIY validés ou Mise en classe FIRST.
   Local robuste d'abord : localStorage. Supabase pourra être branché ensuite sans casser les pages.
*/
(function(){
  'use strict';

  const STORE = {
    profile: 'DIGIY_RESEAU_PROFILE_V1',
    offer: 'DIGIY_RESEAU_OFFER_V1',
    payment: 'DIGIY_RESEAU_PAYMENT_V1',
    adminRequests: 'DIGIY_RESEAU_ADMIN_REQUESTS_V1',
    lastMessage: 'DIGIY_RESEAU_LAST_MESSAGE_V1'
  };

  const ADMIN_WA = '221771342889';
  const DEFAULT_PHONE = '221771342889';

  const plans = {
    week: {
      label: '7 jours',
      price: 15000,
      days: 7,
      badge: 'Pro validé',
      publicLabel: '7 jours · 15 000 FCFA',
      doctrine: 'Annonce qualifiée pour pro DIGIY validé.'
    },
    quinzaine: {
      label: '15 jours',
      price: 25000,
      days: 15,
      badge: 'Pro validé',
      publicLabel: '15 jours · 25 000 FCFA',
      doctrine: 'Visibilité qualifiée qui respire sur quinze jours.'
    },
    month: {
      label: '30 jours',
      price: 45000,
      days: 30,
      badge: 'Pro validé',
      publicLabel: '30 jours · 45 000 FCFA',
      doctrine: 'Présence mensuelle pour une offre posée proprement.'
    },
    first: {
      label: 'Mise en classe FIRST',
      price: 150000,
      days: 30,
      badge: 'Classe FIRST',
      publicLabel: 'Mise en classe FIRST · 150 000 FCFA · 1 mois',
      doctrine: 'Entrée noble pour pro non encore validé : fiche propre, QR, lien, messages prêts et mise en lumière.'
    }
  };

  const métiers = [
    'Chambre / logement',
    'Chauffeur / retour AIBD',
    'Produit maison',
    'Boutique',
    'Restaurant',
    'Artisan / service',
    'Beauté',
    'Activité / guide',
    'Immobilier',
    'Autre'
  ];

  const typesAnnonce = [
    'Offre qualifiée',
    'Disponibilité',
    'Arrivage',
    'Retour disponible',
    'Événement',
    'Service disponible',
    'Produit local',
    'Mise en avant FIRST'
  ];

  const zones = [
    'Saly',
    'Mbour',
    'Ngaparou',
    'Somone',
    'Nianing',
    'Dakar',
    'AIBD',
    'Thiès',
    'Petite Côte',
    'Autre'
  ];

  function $(sel, root = document){
    return root.querySelector(sel);
  }

  function $all(sel, root = document){
    return Array.from(root.querySelectorAll(sel));
  }

  function read(key, fallback){
    try{
      return JSON.parse(localStorage.getItem(key)) || fallback;
    }catch(e){
      return fallback;
    }
  }

  function write(key, value){
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  }

  function clearKey(key){
    localStorage.removeItem(key);
  }

  function safe(s){
    return (s || '').toString().trim();
  }

  function money(n){
    return new Intl.NumberFormat('fr-FR').format(Number(n || 0)) + ' FCFA';
  }

  function planOptionsHtml(selected){
    return Object.entries(plans).map(([code, info]) => {
      return `<option value="${code}" ${code === selected ? 'selected' : ''}>${info.publicLabel}</option>`;
    }).join('');
  }

  function fillPlanSelect(idOrEl, selected){
    const el = typeof idOrEl === 'string' ? document.getElementById(idOrEl) : idOrEl;
    if(!el) return;

    const chosen = selected || el.value || 'week';
    el.innerHTML = planOptionsHtml(chosen);
    el.value = plans[chosen] ? chosen : 'week';
  }

  function currentPlan(code){
    return plans[code] || plans.week;
  }

  function isoDatePlus(days){
    const d = new Date();
    d.setDate(d.getDate() + Number(days || 7));
    return d.toISOString().slice(0, 10);
  }

  function humanDate(iso){
    if(!iso) return '';
    try{
      return new Date(iso + 'T12:00:00').toLocaleDateString('fr-SN', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    }catch(e){
      return iso;
    }
  }

  function phoneClean(v){
    return safe(v).replace(/[^0-9+]/g, '').replace(/^00/, '+');
  }

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
      name: '',
      business: '',
      métier: 'Produit maison',
      phone: '',
      zone: 'Saly',
      city: 'Saly',
      note: '',
      status: 'draft',
      approval_status: 'pending_admin',
      is_validated: false,
      is_published: false,
      submittedAt: null,
      validatedAt: null,
      validatedBy: ''
    };
  }

  function defaultOffer(){
    return {
      title: '',
      type: 'Offre qualifiée',
      métier: 'Produit maison',
      zone: 'Saly',
      priceText: '',
      details: '',
      plan: 'week',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: isoDatePlus(7),
      cta: 'Appeler ou WhatsApp direct',
      photo: '',
      status: 'brouillon_qualifie',
      approval_status: 'pending_admin',
      is_validated: false,
      is_published: false,
      submittedAt: null,
      validatedAt: null,
      validatedBy: ''
    };
  }

  function getProfile(){
    return read(STORE.profile, defaultProfile());
  }

  function getOffer(){
    return read(STORE.offer, defaultOffer());
  }

  function getPayment(){
    return read(STORE.payment, {
      plan: 'week',
      status: 'non_regle',
      method: 'Wave',
      reference: '',
      createdAt: null,
      approval_status: 'pending_admin',
      is_validated: false,
      validatedAt: null,
      validatedBy: '',
      doctrine: 'club_prive_public_visible'
    });
  }

  function getAdminRequests(){
    return read(STORE.adminRequests, []);
  }

  function saveAdminRequests(items){
    return write(STORE.adminRequests, Array.isArray(items) ? items.slice(0, 80) : []);
  }

  function hasAdminApproval(profile, offer, payment){
    const p = profile || getProfile();
    const o = offer || getOffer();
    const pay = payment || getPayment();

    return (
      (p.is_validated === true || o.is_validated === true) &&
      (p.is_published === true || o.is_published === true) &&
      (
        String(o.status || '').toLowerCase() === 'active' ||
        String(o.status || '').toLowerCase() === 'publie_valide' ||
        String(pay.status || '').toLowerCase() === 'valide_admin'
      )
    );
  }

  function adminStageLabel(stage){
    const map = {
      inscription: 'Nouvelle fiche à contrôler',
      annonce: 'Annonce à contrôler',
      paiement: 'Preuve de règlement à vérifier',
      validation: 'Demande de validation complète',
      preview: 'Prévisualisation ADMIN'
    };
    return map[stage] || 'Demande RÉSEAU à contrôler';
  }

  function buildAdminValidationMessage(stage){
    const p = getProfile();
    const o = getOffer();
    const pay = getPayment();
    const plan = currentPlan(pay.plan || o.plan || 'week');

    const lines = [
      '🔐 RÉSEAU DIGIY — VALIDATION ADMIN',
      adminStageLabel(stage),
      '',
      'STATUT : EN ATTENTE — ne pas publier avant validation DIGIY',
      '',
      'PRO / FICHE',
      'Responsable : ' + (p.name || 'à compléter'),
      'Activité : ' + (p.business || 'à compléter'),
      'Métier : ' + (p.métier || o.métier || 'à compléter'),
      'Téléphone : ' + (p.phone || 'à compléter'),
      'Zone : ' + (p.zone || o.zone || 'à compléter'),
      'Ville / repère : ' + (p.city || 'à compléter'),
      '',
      'ANNONCE',
      'Titre : ' + (o.title || 'à compléter'),
      'Type : ' + (o.type || 'à compléter'),
      'Détails : ' + (o.details || 'à compléter'),
      'Prix / remise : ' + (o.priceText || 'à confirmer'),
      'Photo : ' + (o.photo || 'aucune'),
      'CTA : ' + (o.cta || 'Appeler ou WhatsApp direct'),
      'Début : ' + (o.startDate || 'à confirmer'),
      'Fin : ' + (o.endDate || 'à confirmer'),
      '',
      'RÈGLEMENT',
      'Formule : ' + plan.publicLabel,
      'Mode : ' + (pay.method || 'Wave'),
      'Référence : ' + (pay.reference || 'preuve à joindre'),
      'Statut paiement : ' + (pay.status || 'non_regle'),
      '',
      'ACTION ADMIN',
      '1. Vérifier identité + téléphone + offre.',
      '2. Vérifier preuve de paiement.',
      '3. Valider dans ADMIN / Supabase.',
      '4. Publier seulement si is_validated=true et is_published=true.',
      '',
      'Lien fiche local à contrôler : ' + offerLink('admin-validation'),
      'Horodatage : ' + new Date().toLocaleString('fr-SN')
    ];

    return lines.join('\n');
  }

  function queueAdminRequest(stage){
    const req = {
      id: 'reseau-' + Date.now(),
      stage: stage || 'validation',
      label: adminStageLabel(stage),
      status: 'pending_admin',
      createdAt: new Date().toISOString(),
      profile: getProfile(),
      offer: getOffer(),
      payment: getPayment(),
      message: buildAdminValidationMessage(stage || 'validation')
    };

    const items = getAdminRequests();
    items.unshift(req);
    saveAdminRequests(items);

    write(STORE.lastMessage, {
      text: req.message,
      copiedAt: null,
      label: 'validation admin'
    });

    return req;
  }

  function renderAdminBox(stage){
    const form = stage === 'paiement'
      ? $('#paymentForm')
      : stage === 'annonce'
        ? $('#offerForm')
        : $('#profileForm');

    if(!form) return;

    let box = $('#reseauAdminBox');
    if(!box){
      box = document.createElement('div');
      box.id = 'reseauAdminBox';
      box.className = 'field';
      box.style.marginTop = '14px';
      box.innerHTML = `
        <label>Validation DIGIY avant apparition</label>
        <textarea id="adminValidationText" rows="9" readonly></textarea>
        <div class="btnrow" style="margin-top:10px">
          <button class="btn main" type="button" id="adminCopyBtn">📋 Copier demande ADMIN</button>
          <a class="btn green" id="adminWhatsAppBtn" target="_blank" rel="noopener">💬 Envoyer à ADMIN WhatsApp</a>
        </div>
        <div class="noticeMini" style="margin-top:10px">
          Cette fiche reste invisible au public tant que DIGIY n’a pas validé : identité, téléphone, offre, paiement et qualité.
        </div>
      `;
      form.appendChild(box);
    }

    const msg = buildAdminValidationMessage(stage || 'validation');
    const area = $('#adminValidationText');
    const wa = $('#adminWhatsAppBtn');
    const copy = $('#adminCopyBtn');

    if(area) area.value = msg;
    if(wa) wa.href = waHref(msg, ADMIN_WA);
    if(copy && !copy.dataset.boundAdmin){
      copy.dataset.boundAdmin = '1';
      copy.addEventListener('click', () => copyText($('#adminValidationText')?.value || msg, 'demande ADMIN'));
    }
  }

  function saveProfile(data){
    return write(STORE.profile, Object.assign(defaultProfile(), data || {}));
  }

  function saveOffer(data){
    return write(STORE.offer, Object.assign(defaultOffer(), data || {}));
  }

  function savePayment(data){
    return write(STORE.payment, Object.assign(getPayment(), data || {}));
  }

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
    msg += `${until}\nVoir la fiche directe : ${link}\nAnnonce qualifiée RÉSEAU DIGIY. Contact direct, 0% commission.`;

    return msg;
  }

  function buildFamilyMessage(){
    const p = getProfile();
    const o = getOffer();
    const biz = safe(p.business || p.name) || 'mon activité';
    const title = safe(o.title) || 'mon annonce DIGIY';

    return `Bonjour la famille, pouvez-vous faire circuler cette offre qualifiée autour de vous ?\n${title} — ${biz}\nLien direct : ${offerLink('famille')}\nMerci de partager, contact direct avec le pro.`;
  }

  function buildGroupMessage(){
    const o = getOffer();
    const title = safe(o.title) || 'Offre disponible cette semaine';

    return `📢 ${title}\nAnnonce qualifiée posée sur RÉSEAU DIGIY. Cliquez pour voir la fiche, appeler ou écrire directement :\n${offerLink('groupe')}\nMerci de faire circuler autour de vous.`;
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
      write(STORE.lastMessage, {
        text: value,
        copiedAt: new Date().toISOString(),
        label: label || 'message'
      });
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

  function telHref(phone){
    return 'tel:' + phoneClean(phone || getProfile().phone || '');
  }

  function notice(text, type = 'ok'){
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
    el._t = setTimeout(() => el.classList.remove('show'), 2800);
  }

  function fillSelect(id, values, selected){
    const el = typeof id === 'string' ? document.getElementById(id) : id;
    if(!el) return;

    el.innerHTML = values.map(v => {
      return `<option value="${v}" ${v === selected ? 'selected' : ''}>${v}</option>`;
    }).join('');
  }

  function bindChips(root = document){
    $all('[data-chip-target]', root).forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.chipTarget);
        if(!target) return;

        target.value = btn.dataset.value || btn.textContent.trim();

        $all(`[data-chip-target="${btn.dataset.chipTarget}"]`, root).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        target.dispatchEvent(new Event('input', { bubbles: true }));
        target.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  }

  function bindCopyButtons(root = document){
    $all('[data-copy]', root).forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.copy;

        const map = {
          offer: buildOfferMessage('copie'),
          family: buildFamilyMessage(),
          group: buildGroupMessage(),
          sms: buildSmsBridge(),
          link: offerLink('copie-lien'),
          phone: getProfile().phone || '',
          last: (read(STORE.lastMessage, { text: '' }).text || '')
        };

        copyText(map[key] || btn.dataset.copyText || '', btn.dataset.label || key);
      });
    });
  }

  function refreshHeader(){
    const p = getProfile();
    const o = getOffer();
    const pay = getPayment();

    $all('[data-profile-name]').forEach(el => {
      el.textContent = safe(p.business || p.name) || 'Pro DIGIY';
    });

    $all('[data-profile-phone]').forEach(el => {
      el.textContent = safe(p.phone) || 'Téléphone à poser';
    });

    $all('[data-offer-title]').forEach(el => {
      el.textContent = safe(o.title) || 'Annonce à préparer';
    });

    $all('[data-offer-status]').forEach(el => {
      el.textContent = hasAdminApproval(p, o, pay)
        ? 'Validé ADMIN · visible public'
        : 'En attente validation DIGIY';
    });

    $all('[data-offer-link]').forEach(el => {
      el.textContent = offerLink('affichage');
    });
  }

  function initProfilePage(){
    const p = getProfile();

    fillSelect('metier', métiers, p.métier);
    fillSelect('zone', zones, p.zone);

    ['name', 'business', 'phone', 'city', 'note'].forEach(k => {
      const el = document.getElementById(k);
      if(el) el.value = p[k] || '';
    });

    const form = $('#profileForm');
    if(form){
      form.addEventListener('submit', e => {
        e.preventDefault();

        const data = {
          name: safe($('#name')?.value),
          business: safe($('#business')?.value),
          métier: safe($('#metier')?.value),
          phone: safe($('#phone')?.value),
          zone: safe($('#zone')?.value),
          city: safe($('#city')?.value),
          note: safe($('#note')?.value),
          status: 'attente_validation_digiy',
          approval_status: 'pending_admin',
          is_validated: false,
          is_published: false,
          submittedAt: new Date().toISOString(),
          validatedAt: null,
          validatedBy: ''
        };

        saveProfile(data);
        queueAdminRequest('inscription');
        renderAdminBox('inscription');
        refreshHeader();
        notice('Fiche reçue. Elle reste invisible au public jusqu’à validation DIGIY.', 'ok');
      });
    }

    renderAdminBox('inscription');
  }

  function initOfferPage(){
    const o = getOffer();

    fillSelect('type', typesAnnonce, o.type);
    fillSelect('metier', métiers, o.métier);
    fillSelect('zone', zones, o.zone);

    ['title', 'priceText', 'details', 'startDate', 'endDate', 'photo', 'cta'].forEach(k => {
      const el = document.getElementById(k);
      if(el) el.value = o[k] || '';
    });

    const plan = document.getElementById('plan');
    if(plan) fillPlanSelect(plan, o.plan || 'week');

    function readOfferForm(){
      const chosen = safe($('#plan')?.value) || 'week';
      const planInfo = currentPlan(chosen);
      let end = safe($('#endDate')?.value);

      if(!end) end = isoDatePlus(planInfo.days);

      return {
        title: safe($('#title')?.value),
        type: safe($('#type')?.value),
        métier: safe($('#metier')?.value),
        zone: safe($('#zone')?.value),
        priceText: safe($('#priceText')?.value),
        details: safe($('#details')?.value),
        plan: chosen,
        startDate: safe($('#startDate')?.value) || new Date().toISOString().slice(0, 10),
        endDate: end,
        photo: safe($('#photo')?.value),
        cta: safe($('#cta')?.value)
      };
    }

    function updatePreview(){
      const data = readOfferForm();
      saveOffer(Object.assign(data, {
        status: 'brouillon_qualifie',
        approval_status: 'pending_admin',
        is_validated: false,
        is_published: false
      }));
      renderMessageBox();
      refreshHeader();
    }

    $all('input,textarea,select').forEach(el => {
      el.addEventListener('input', updatePreview);
    });

    if(plan){
      plan.addEventListener('change', () => {
        const chosen = plan.value;
        const info = currentPlan(chosen);
        const end = $('#endDate');

        if(end) end.value = isoDatePlus(info.days);
        updatePreview();
      });
    }

    const form = $('#offerForm');
    if(form){
      form.addEventListener('submit', e => {
        e.preventDefault();

        const data = readOfferForm();
        saveOffer(Object.assign(data, {
          status: 'attente_validation_digiy',
          approval_status: 'pending_admin',
          is_validated: false,
          is_published: false,
          submittedAt: new Date().toISOString(),
          validatedAt: null,
          validatedBy: ''
        }));
        savePayment({
          plan: data.plan,
          status: 'non_regle',
          approval_status: 'pending_admin',
          is_validated: false
        });

        queueAdminRequest('annonce');
        renderAdminBox('annonce');
        refreshHeader();
        renderMessageBox();

        notice('Annonce préparée. Elle ne sera publiée qu’après validation ADMIN DIGIY.', 'ok');
      });
    }

    renderMessageBox();
    renderAdminBox('annonce');
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

    if(planEl) fillPlanSelect(planEl, pay.plan || o.plan || 'week');

    function renderPlan(){
      const chosen = safe(planEl?.value) || 'week';
      const info = currentPlan(chosen);

      if($('#planLabel')) $('#planLabel').textContent = info.label;
      if($('#planPrice')) $('#planPrice').textContent = money(info.price);
      if($('#planDays')) $('#planDays').textContent = info.days + ' jours visibles';
      if($('#planBadge')) $('#planBadge').textContent = info.badge;

      const payMsg =
`Bonjour DIGIY, je veux activer une publication RÉSEAU DIGIY.
Formule : ${info.publicLabel}
Montant : ${money(info.price)}
Statut : ${info.badge}
Pro : ${getProfile().business || getProfile().name || 'Pro DIGIY'}
Téléphone : ${getProfile().phone || ''}
Annonce : ${getOffer().title || 'Annonce RÉSEAU DIGIY'}
Lien fiche : ${offerLink('reglement')}
Rappel : publication qualifiée, preuve à vérifier avant activation.`;

      const wa = $('#payWhatsApp');
      if(wa) wa.href = waHref(payMsg, ADMIN_WA);

      const copy = $('#paymentCopyText');
      if(copy) copy.value = payMsg;
    }

    if(planEl){
      planEl.addEventListener('change', () => {
        savePayment({ plan: planEl.value });
        renderPlan();
      });
    }

    const form = $('#paymentForm');
    if(form){
      if($('#paymentRef')) $('#paymentRef').value = pay.reference || '';

      form.addEventListener('submit', e => {
        e.preventDefault();

        savePayment({
          plan: safe(planEl?.value) || 'week',
          method: safe($('#paymentMethod')?.value) || 'Wave',
          reference: safe($('#paymentRef')?.value),
          status: 'preuve_envoyee_attente_admin',
          createdAt: new Date().toISOString(),
          approval_status: 'pending_admin',
          is_validated: false,
          qualification: 'reseau_digiy_club_prive'
        });

        const o2 = getOffer();
        saveOffer(Object.assign(o2, {
          status: 'attente_validation_digiy',
          approval_status: 'pending_admin',
          is_validated: false,
          is_published: false
        }));

        queueAdminRequest('paiement');
        renderAdminBox('paiement');
        refreshHeader();
        renderPlan();

        notice('Preuve notée. Elle remonte à ADMIN et attend validation DIGIY avant apparition.', 'ok');
      });
    }

    renderPlan();
    renderAdminBox('paiement');
  }

  function initAssistantPage(){
    const input = $('#rawIdea');
    const output = $('#assistantText');

    function generate(kind){
      const raw = safe(input?.value);
      const p = getProfile();
      let text = '';

      if(kind === 'retour'){
        text = `Bonjour, je suis disponible pour un retour ${raw || 'AIBD / Dakar vers Saly ou Mbour'} aujourd’hui. Contact direct par appel ou WhatsApp. ${offerLink('assistant-retour')}`;
      }else if(kind === 'promo'){
        text = `Offre spéciale cette semaine : ${raw || 'remise / pack disponible'}. Voir la fiche DIGIY, appeler ou WhatsApp direct : ${offerLink('assistant-promo')}`;
      }else if(kind === 'produit'){
        text = `Produit disponible : ${raw || 'savons maison, beurre de karité, produits bio'}. Commande directe via la fiche DIGIY : ${offerLink('assistant-produit')}`;
      }else if(kind === 'service'){
        text = `Service disponible : ${raw || 'intervention, devis ou rendez-vous'}. Contact direct avec ${p.business || p.name || 'le pro'} : ${offerLink('assistant-service')}`;
      }else{
        text = buildOfferMessage('assistant');
      }

      if(output) output.value = text;
      write(STORE.lastMessage, { text, copiedAt: null, label: 'assistant' });
    }

    $all('[data-assistant]').forEach(btn => {
      btn.addEventListener('click', () => generate(btn.dataset.assistant));
    });

    if(output && !output.value) output.value = buildOfferMessage('assistant');
  }

  function initFichePage(){
    const p = getProfile();
    const o = getOffer();
    const pay = getPayment();
    const approved = hasAdminApproval(p, o, pay);

    if(!approved){
      if($('#ficheStatus')) $('#ficheStatus').textContent = 'Fiche en attente de validation DIGIY';
      if($('#ficheTitle')) $('#ficheTitle').textContent = 'Fiche reçue · contrôle avant apparition';
      if($('#ficheBusiness')) $('#ficheBusiness').textContent = 'RÉSEAU DIGIY';
      if($('#ficheMetier')) $('#ficheMetier').textContent = 'Publication qualifiée';
      if($('#ficheZone')) $('#ficheZone').textContent = 'Validation en cours';
      if($('#fichePhone')) $('#fichePhone').textContent = 'Masqué avant validation';
      if($('#ficheDetails')){
        $('#ficheDetails').textContent =
          'Cette fiche a été reçue par DIGIY, mais elle n’est pas encore visible publiquement. ADMIN doit vérifier le pro, le téléphone, l’offre, le règlement et la qualité avant apparition.';
      }
      if($('#fichePrice')) $('#fichePrice').textContent = 'En attente';
      if($('#ficheDates')) $('#ficheDates').textContent = 'Publication bloquée avant validation';

      const img = $('#fichePhoto');
      if(img) img.hidden = true;

      const row = $('.fiche-hero .btnrow');
      if(row) row.style.display = 'none';

      const sharePanel = $('[data-offer-link]')?.closest('.panel');
      if(sharePanel) sharePanel.style.display = 'none';

      const hero = $('.fiche-hero');
      if(hero && !$('#fichePendingNotice')){
        const pending = document.createElement('div');
        pending.id = 'fichePendingNotice';
        pending.className = 'noticeMini';
        pending.style.marginTop = '14px';
        pending.innerHTML =
          '<strong>🔒 Non publiée.</strong><br>Le public ne voit pas les coordonnées avant validation DIGIY. La fiche apparaîtra seulement après validation ADMIN.';
        hero.appendChild(pending);
      }
      return;
    }

    if($('#ficheBusiness')) $('#ficheBusiness').textContent = safe(p.business || p.name) || 'Pro DIGIY';
    if($('#ficheMetier')) $('#ficheMetier').textContent = safe(o.métier || p.métier) || 'Activité locale';
    if($('#ficheZone')) $('#ficheZone').textContent = safe(o.zone || p.zone) || 'Sénégal';
    if($('#fichePhone')) $('#fichePhone').textContent = safe(p.phone) || 'Téléphone à poser';
    if($('#ficheTitle')) $('#ficheTitle').textContent = safe(o.title) || 'Offre de la semaine';

    if($('#ficheDetails')){
      $('#ficheDetails').textContent = safe(o.details) || 'Annonce validée par RÉSEAU DIGIY. Contact direct, fiche propre, publication qualifiée.';
    }

    if($('#fichePrice')) $('#fichePrice').textContent = safe(o.priceText) || 'Prix / remise à confirmer';
    if($('#ficheDates')) $('#ficheDates').textContent = o.endDate ? 'Valable jusqu’au ' + humanDate(o.endDate) : 'Durée à confirmer';

    if($('#ficheStatus')){
      $('#ficheStatus').textContent = 'Fiche validée DIGIY · visible public';
    }

    const img = $('#fichePhoto');
    if(img && safe(o.photo)){
      img.src = o.photo;
      img.hidden = false;
    }

    const wa = $('#ficheWa');
    if(wa) wa.href = waHref(buildOfferMessage('client-whatsapp'), p.phone || ADMIN_WA);

    const sms = $('#ficheSms');
    if(sms) sms.href = smsHref(buildSmsBridge(), p.phone || '');

    const tel = $('#ficheTel');
    if(tel) tel.href = telHref(p.phone || '');

    const map = $('#ficheMaps');
    if(map) map.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p.city || o.zone || 'Saly Sénégal');
  }

  function initJournalPage(){
    const grid = $('#journalGrid');
    if(!grid) return;

    const p = getProfile();
    const o = getOffer();
    const pay = getPayment();
    const cards = [];

    if(hasAdminApproval(p, o, pay)){
      cards.push({
        title: safe(o.title) || 'Annonce locale validée',
        biz: safe(p.business || p.name) || 'Pro DIGIY',
        zone: safe(o.zone || p.zone) || 'Saly',
        details: safe(o.details) || 'Offre validée par ADMIN DIGIY.',
        href: 'fiche.html?src=journal-valide',
        badge: 'VALIDÉ DIGIY'
      });
    }

    if(!cards.length){
      grid.innerHTML = `
        <div class="card" style="grid-column:1/-1">
          <span class="tag">En attente</span>
          <h3>Aucune publication validée pour le moment</h3>
          <p>Les fiches et annonces déposées restent invisibles ici tant que ADMIN DIGIY n’a pas validé le pro, l’offre et le règlement.</p>
          <a class="btn main" href="inscription.html">👤 Demander une publication</a>
        </div>
      `;
      return;
    }

    grid.innerHTML = cards.map(c => {
      return `<a class="offer-card" href="${c.href}">
        <span>${c.badge}</span>
        <strong>${c.title}</strong>
        <em>${c.biz} · ${c.zone}</em>
        <p>${c.details}</p>
        <b>Voir la fiche →</b>
      </a>`;
    }).join('');
  }

  function initSessionPage(){
    const p = getProfile();
    const o = getOffer();
    const pay = getPayment();

    const box = $('#localState');
    if(box){
      box.value = JSON.stringify({
        profile: p,
        offer: o,
        payment: pay,
        adminRequests: getAdminRequests()
      }, null, 2);
    }

    $('#clearDraft')?.addEventListener('click', () => {
      clearKey(STORE.offer);
      clearKey(STORE.payment);
      notice('Brouillon annonce nettoyé.', 'ok');
      setTimeout(() => location.reload(), 600);
    });

    $('#clearAll')?.addEventListener('click', () => {
      Object.values(STORE).forEach(clearKey);
      notice('Mémoire locale RÉSEAU DIGIY nettoyée.', 'ok');
      setTimeout(() => location.href = 'hub.html', 900);
    });
  }

  function initGlobal(){
    refreshHeader();
    bindChips();
    bindCopyButtons();

    $all('[data-wa-offer]').forEach(a => {
      a.href = waHref(buildOfferMessage('whatsapp'), getProfile().phone || ADMIN_WA);
    });

    $all('[data-sms-bridge]').forEach(a => {
      a.href = smsHref(buildSmsBridge(), getProfile().phone || '');
    });

    $all('[data-link-fiche]').forEach(a => {
      a.href = offerLink(a.dataset.src || 'nav');
    });

    $all('[data-fill-message]').forEach(el => {
      el.value = buildOfferMessage(el.dataset.src || 'fill');
    });
  }

  window.RESEAU = {
    STORE,
    plans,
    currentPlan,
    fillPlanSelect,
    métiers,
    typesAnnonce,
    zones,
    $,
    $all,
    getProfile,
    getOffer,
    getPayment,
    getAdminRequests,
    saveProfile,
    saveOffer,
    savePayment,
    hasAdminApproval,
    buildAdminValidationMessage,
    queueAdminRequest,
    renderAdminBox,
    buildOfferMessage,
    buildFamilyMessage,
    buildGroupMessage,
    buildSmsBridge,
    offerLink,
    copyText,
    waHref,
    smsHref,
    telHref,
    money,
    humanDate,
    notice,
    initGlobal,
    initProfilePage,
    initOfferPage,
    initPaymentPage,
    initAssistantPage,
    initFichePage,
    initJournalPage,
    initSessionPage
  };

  document.addEventListener('DOMContentLoaded', initGlobal);
})();
