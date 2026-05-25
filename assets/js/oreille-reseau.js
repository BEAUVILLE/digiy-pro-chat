/* DIGIYLYFE — OREILLE RÉSEAU DIGIY
   Fichier : assets/js/oreille-reseau.js
   Dépendance : assets/js/oreille-metier-core.js
   Doctrine : l’Oreille prépare, DIGIY formule, le pro valide, RÉSEAU range.
   Rien n’est publié automatiquement : ni annonce, ni prix, ni visibilité, ni promesse client.
*/
(function(){
  "use strict";

  var VERSION = "oreille-reseau-v1-20260525";

  var GUIDE =
    "Bienvenue dans Oreille Réseau DIGIY. Ici, le professionnel parle ou clique pour préparer une offre, une annonce, un message de partage, une fiche à mettre en lumière ou une demande de mise en classe FIRST. RÉSEAU DIGIY ne publie jamais seul. DIGIY prépare le texte, le pro relit, le pro valide, puis l’activation reste contrôlée par DIGIY. Le public peut voir, cliquer, partager et contacter. La publication reste qualifiée. Le terrain garde la main.";

  var TEMPLATES = [
    "📢 Nouvelle offre — titre · métier · zone · durée · prix ou condition · contact · lien fiche.",
    "🌟 Mise en classe FIRST — pro non validé · métier · zone · fiche à créer · QR · message prêt · 1 mois.",
    "🔗 Spotlight fiche — pro déjà validé · fiche existante · annonce semaine · CTA · durée.",
    "📲 Message partage WhatsApp — offre courte · lien · appel à faire circuler · contact direct.",
    "🧼 Produit local — produit · prix · zone · stock · durée · photo/lien · contact.",
    "🏠 Location / dispo — lieu · dates · prix · conditions · lien fiche · contact.",
    "🚕 Retour chauffeur — trajet · date · heure · places · prix indicatif · contact.",
    "🛠️ Service disponible — métier · zone · urgence · tarif indicatif · lien fiche · contact.",
    "🎟️ Événement / activité — activité · date · lieu · places · prix · contact.",
    "⚠️ Brouillon à qualifier — garder la trace, ne pas publier sans validation DIGIY."
  ];

  function ready(fn){ document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", fn) : fn(); }
  function core(){ return window.DigiyOreilleMetier || null; }
  function norm(value){ var c = core(); return c && c.normalizeText ? c.normalizeText(value) : String(value || "").replace(/\s+/g," ").trim(); }
  function low(value){ return norm(value).toLowerCase(); }

  function field(text, labels){
    var clean = norm(text);
    for(var i = 0; i < labels.length; i += 1){
      var label = labels[i];
      var re = new RegExp("(?:^|[\\s;,.|—-])" + label + "\\s*[:\\-]?\\s*([^;|\\n]+?)(?=\\s+(?:titre|offre|métier|metier|zone|durée|duree|prix|condition|contact|tel|tél|telephone|téléphone|lien|fiche|cta|message|date|lieu|stock|statut)\\s*[:\\-]|$)", "i");
      var match = clean.match(re);
      if(match && match[1]) return norm(match[1]);
    }
    return "";
  }

  function phone(text){
    var clean = norm(text);
    var explicit = clean.match(/(?:tel|tél|telephone|téléphone|phone|whatsapp|wa|numéro|numero)\s*[:\-]?\s*((?:\+?\d[\d\s().-]{6,}\d))/i);
    if(explicit && explicit[1]) return norm(explicit[1]);
    var any = clean.match(/(?:\+?\d[\d\s().-]{7,}\d)/);
    return any ? norm(any[0]) : "";
  }

  function link(text){
    var clean = norm(text);
    var explicit = field(clean, ["lien", "fiche", "url"]);
    if(explicit) return explicit;
    var match = clean.match(/https?:\/\/[^\s]+/i);
    return match ? match[0] : "";
  }

  function intent(text){
    var t = low(text);
    if(/first|mise en classe|non validé|non valide/.test(t)) return "mise en classe FIRST";
    if(/fiche|spotlight|mettre en lumière|mettre en lumiere/.test(t)) return "spotlight fiche";
    if(/whatsapp|partage|faire circuler|groupe|famille/.test(t)) return "message partage";
    if(/produit|savon|karité|karite|boutique|stock|arrivage/.test(t)) return "produit local";
    if(/location|chambre|villa|logement|dispo/.test(t)) return "location / disponibilité";
    if(/chauffeur|trajet|retour|aibd|dakar|saly|mbour/.test(t)) return "retour chauffeur";
    if(/service|artisan|coiffure|beauté|beaute|plombier|peintre|réparation|reparation/.test(t)) return "service disponible";
    if(/événement|evenement|activité|activite|sortie|pêche|peche/.test(t)) return "événement / activité";
    return "offre à qualifier";
  }

  function duration(text){
    var explicit = field(text, ["durée", "duree", "temps", "visibilité", "visibilite"]);
    if(explicit) return explicit;
    var t = low(text);
    if(/30\s*j|30 jours|mois|1 mois/.test(t)) return "30 jours";
    if(/15\s*j|15 jours|quinzaine/.test(t)) return "15 jours";
    if(/7\s*j|7 jours|semaine/.test(t)) return "7 jours";
    return "";
  }

  function price(text){
    var explicit = field(text, ["prix", "tarif", "montant", "condition"]);
    if(explicit) return explicit;
    var match = norm(text).match(/\b(\d[\d\s.,]*)\s*(fcfa|f\s*cfa|xof|cfa|€|eur|euro|euros|f)\b/i);
    return match ? norm(match[1] + " " + (match[2] || "")) : "";
  }

  function draft(text){
    var clean = norm(text);
    return {
      module:"RESEAU_DIGIY",
      visible_module:"RÉSEAU DIGIY",
      original:clean,
      intent:intent(clean),
      title:field(clean, ["titre", "offre", "annonce"]),
      job:field(clean, ["métier", "metier", "activité", "activite", "catégorie", "categorie"]),
      zone:field(clean, ["zone", "lieu", "adresse", "quartier"]),
      duration:duration(clean),
      price:price(clean),
      contact:phone(clean),
      link:link(clean),
      cta:field(clean, ["cta", "appel", "action", "message"]),
      status:"draft",
      warning:"Brouillon Réseau : validation DIGIY obligatoire avant publication."
    };
  }

  function missing(d){
    var missing = [];
    if(!d.title) missing.push("titre/offre");
    if(!d.job) missing.push("métier/catégorie");
    if(!d.zone) missing.push("zone/lieu");
    if(!d.duration) missing.push("durée");
    if(!d.contact) missing.push("contact/téléphone");
    if(!d.link && /fiche|spotlight|lien|partage/.test(low(d.original))) missing.push("lien fiche");
    return missing;
  }

  function line(label, value){ return value ? "\n- " + label + " : " + value : ""; }

  function formulate(text){
    var clean = norm(text);
    if(!clean) return "RÉSEAU DIGIY · Brouillon vide : préciser l’offre avant validation.";
    var d = draft(clean);
    var miss = missing(d);
    var output =
      "RÉSEAU DIGIY · " + d.intent.toUpperCase() +
      "\nBrouillon préparé à partir de : " + clean +
      line("Titre / offre", d.title) +
      line("Métier / catégorie", d.job) +
      line("Zone / lieu", d.zone) +
      line("Durée", d.duration) +
      line("Prix / condition", d.price) +
      line("Contact", d.contact) +
      line("Lien fiche", d.link) +
      line("CTA / message", d.cta);
    if(miss.length) output += "\nÀ compléter avant validation : " + miss.join(", ") + ".";
    output += "\nÀ vérifier par le pro et par DIGIY avant publication. Rien n’est publié automatiquement. Le public peut voir, cliquer, partager et contacter seulement après activation.";
    return output;
  }

  function extra(text){
    return {
      reseau_draft:draft(text),
      status:"draft",
      warning:"Brouillon RÉSEAU DIGIY : validation DIGIY obligatoire avant publication, visibilité ou promesse client."
    };
  }

  ready(function(){
    var c = core();
    var target = document.querySelector("#digiy-oreille-reseau") || document.querySelector("#digiy-oreille-metier") || document.querySelector("[data-digiy-oreille]");
    if(!c || !target){ console.warn("[DIGIY RÉSEAU] Core ou cible Oreille manquant."); return; }
    var instance = c.mount({
      module:"RESEAU_DIGIY",
      title:"Oreille Réseau",
      subtitle:"Offre · fiche · lien · message partageable · validation DIGIY.",
      storagePrefix:"DIGIY_OREILLE_METIER",
      target:target,
      guideText:GUIDE,
      templates:TEMPLATES,
      formulate:formulate,
      buildSaveExtra:extra
    });
    window.DIGIY_OREILLE_RESEAU = {version:VERSION, instance:instance, buildDraft:draft, formulate:formulate, missingFields:missing};
  });
})();
