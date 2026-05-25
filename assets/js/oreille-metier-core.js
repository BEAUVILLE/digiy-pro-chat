/* DIGIYLYFE — OREILLE MÉTIER CORE · RÉSEAU DIGIY
   Le pro parle ou clique. DIGIY formule. Le pro valide. Le logiciel range.
   Rien n’est publié automatiquement.
   Doctrine mobile : suggestions en pavés grands, gras, 2 par 2 sur téléphone.
*/
(function(){
  "use strict";

  var VERSION = "oreille-metier-core-reseau-paves-tel-20260525";

  function norm(value){
    return String(value || "")
      .replace(/\s+/g, " ")
      .replace(/\s+([,.!?;:])/g, "$1")
      .trim();
  }

  function esc(value){
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function assign(target){
    target = target || {};
    for(var i = 1; i < arguments.length; i += 1){
      var source = arguments[i] || {};
      Object.keys(source).forEach(function(key){ target[key] = source[key]; });
    }
    return target;
  }

  function storeKey(config){
    return String((config && config.storagePrefix) || "DIGIY_OREILLE_METIER") +
      "_" + String((config && config.module) || "RESEAU_DIGIY").toUpperCase().replace(/[^A-Z0-9]+/g,"_") +
      "_NOTES_V1";
  }

  function nowLabel(){
    try{
      return new Date().toLocaleString("fr-FR", {year:"numeric", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit"});
    }catch(_){ return String(new Date()); }
  }

  function getNotes(config){
    try{
      var parsed = JSON.parse(localStorage.getItem(storeKey(config)) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    }catch(_){ return []; }
  }

  function setNotes(config, notes){
    try{ localStorage.setItem(storeKey(config), JSON.stringify((notes || []).slice(0,80))); }catch(_){}
  }

  function clearNotes(config){
    try{ localStorage.removeItem(storeKey(config)); }catch(_){}
  }

  function saveNote(config, text, extra){
    var clean = norm(text);
    if(!clean) return null;
    var notes = getNotes(config);
    var note = assign({
      id:"note_" + Date.now(),
      module:String((config && config.module) || "RESEAU_DIGIY").toUpperCase(),
      text:clean,
      date:nowLabel(),
      source:"oreille-metier",
      status:"draft"
    }, extra || {});
    notes.unshift(note);
    setNotes(config, notes);
    return note;
  }

  function toast(message){
    var t = document.getElementById("digiyOreilleToast");
    if(!t){
      t = document.createElement("div");
      t.id = "digiyOreilleToast";
      t.setAttribute("role", "status");
      t.setAttribute("aria-live", "polite");
      t.style.cssText = "position:fixed;left:50%;bottom:20px;transform:translateX(-50%) translateY(20px);background:#06130d;color:#fff;padding:12px 16px;border-radius:999px;box-shadow:0 16px 36px rgba(0,0,0,.25);font:900 14px system-ui;opacity:0;pointer-events:none;transition:.2s ease;z-index:99999;max-width:min(92vw,620px);text-align:center;border:1px solid rgba(246,196,83,.35)";
      document.body.appendChild(t);
    }
    t.textContent = message;
    t.style.opacity = "1";
    t.style.transform = "translateX(-50%) translateY(0)";
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function(){
      t.style.opacity = "0";
      t.style.transform = "translateX(-50%) translateY(20px)";
    }, 2200);
  }

  function loadVoices(callback){
    if(!("speechSynthesis" in window)){ callback([]); return; }
    var voices = window.speechSynthesis.getVoices() || [];
    if(voices.length){ callback(voices); return; }
    var tries = 0;
    var timer = setInterval(function(){
      tries += 1;
      voices = window.speechSynthesis.getVoices() || [];
      if(voices.length || tries > 12){ clearInterval(timer); callback(voices); }
    }, 120);
  }

  function speak(text, options){
    if(!("speechSynthesis" in window)){ toast("Lecture vocale non disponible ici"); return false; }
    var clean = norm(text);
    if(!clean){ toast("Rien à lire"); return false; }
    window.speechSynthesis.cancel();
    loadVoices(function(voices){
      var u = new SpeechSynthesisUtterance(clean);
      u.lang = (options && options.lang) || "fr-FR";
      u.rate = (options && options.rate) || 0.86;
      u.pitch = (options && options.pitch) || 1.02;
      u.volume = 1;
      var preferred = voices.find(function(v){ return /fr/i.test(v.lang || "") && /Google|Thomas|Daniel|Amelie|Audrey|Pauline/i.test(v.name || ""); }) || voices.find(function(v){ return /fr/i.test(v.lang || ""); }) || voices[0];
      if(preferred) u.voice = preferred;
      u.onstart = function(){ toast("DIGIY parle"); };
      u.onend = function(){ toast("Lecture terminée"); };
      u.onerror = function(){ toast("Lecture interrompue"); };
      window.speechSynthesis.speak(u);
    });
    return true;
  }

  function stopVoice(){
    if("speechSynthesis" in window){ window.speechSynthesis.cancel(); toast("Lecture arrêtée"); return true; }
    return false;
  }

  function canListen(){ return !!(window.SpeechRecognition || window.webkitSpeechRecognition); }

  function listen(options){
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR){
      toast("Micro non supporté ici");
      if(options && options.onError) options.onError(new Error("SpeechRecognition not supported"));
      return null;
    }
    stopVoice();
    var recognition = new SR();
    recognition.lang = (options && options.lang) || "fr-FR";
    recognition.interimResults = true;
    recognition.continuous = false;
    var finalText = "";
    recognition.onstart = function(){ toast("Oreille ouverte"); if(options && options.onStart) options.onStart(); };
    recognition.onresult = function(event){
      var interim = "";
      for(var i = event.resultIndex; i < event.results.length; i += 1){
        var transcript = event.results[i][0].transcript;
        if(event.results[i].isFinal) finalText += transcript + " ";
        else interim += transcript;
      }
      if(options && options.onText) options.onText(norm(finalText + interim));
    };
    recognition.onerror = function(event){ toast("Micro interrompu"); if(options && options.onError) options.onError(event); };
    recognition.onend = function(){ if(options && options.onEnd) options.onEnd(norm(finalText)); };
    recognition.start();
    return recognition;
  }

  async function copy(text){
    var clean = norm(text);
    if(!clean){ toast("Rien à copier"); return false; }
    try{
      await navigator.clipboard.writeText(clean);
      toast("Copié");
      return true;
    }catch(_){
      var area = document.createElement("textarea");
      area.value = clean;
      area.setAttribute("readonly", "readonly");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.focus();
      area.select();
      var ok = false;
      try{ ok = document.execCommand("copy"); }catch(e){ ok = false; }
      document.body.removeChild(area);
      toast(ok ? "Copie tentée" : "Copie impossible ici");
      return ok;
    }
  }

  function injectStyles(){
    if(document.getElementById("digiyOreilleStyles")) return;
    var style = document.createElement("style");
    style.id = "digiyOreilleStyles";
    style.textContent = `
      .digiy-oreille-box{border:1px solid rgba(255,255,255,.16)!important;border-radius:28px!important;padding:16px!important;background:linear-gradient(180deg,rgba(255,255,255,.12),rgba(255,255,255,.07))!important;box-shadow:0 18px 42px rgba(0,0,0,.22)!important;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif!important;color:#fff!important}
      .digiy-oreille-box *{box-sizing:border-box!important}
      .digiy-oreille-head{display:block!important;margin-bottom:12px!important}
      .digiy-oreille-head strong{display:block!important;font-size:clamp(2rem,8vw,3.3rem)!important;line-height:.92!important;letter-spacing:-.06em!important;font-weight:1000!important;color:#fff3cf!important;text-transform:uppercase!important}
      .digiy-oreille-head span{display:block!important;margin-top:8px!important;color:rgba(248,250,252,.86)!important;font-size:clamp(1.05rem,4.4vw,1.35rem)!important;font-weight:1000!important;line-height:1.22!important}
      .digiy-oreille-actions{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:9px!important;margin:14px 0!important}
      .digiy-oreille-actions button{width:100%!important;min-height:66px!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:20px!important;padding:12px 10px!important;font-size:1.05rem!important;font-weight:1000!important;cursor:pointer!important;background:rgba(255,255,255,.10)!important;color:#fff!important;box-shadow:0 8px 20px rgba(0,0,0,.12)!important;text-align:center!important;line-height:1.12!important}
      .digiy-oreille-actions .primary{background:linear-gradient(135deg,#00a651,#006b3a)!important;color:#fff!important}
      .digiy-oreille-actions .gold{background:linear-gradient(135deg,#f6c453,#00a651)!important;color:#06130d!important}
      .digiy-oreille-actions .dark{background:#06130d!important;color:#fff!important}
      .digiy-oreille-status{border-radius:18px!important;background:rgba(6,19,13,.78)!important;color:#d8ffe8!important;padding:13px 14px!important;font-size:1.05rem!important;font-weight:1000!important;line-height:1.34!important;margin:10px 0!important;border:1px solid rgba(246,196,83,.24)!important}
      .digiy-oreille-text{width:100%!important;min-height:132px!important;resize:vertical!important;border-radius:20px!important;border:1px solid rgba(255,255,255,.16)!important;padding:14px!important;font:inherit!important;font-size:1.08rem!important;font-weight:1000!important;line-height:1.42!important;background:rgba(255,255,255,.92)!important;color:#06130d!important;outline:none!important}
      .digiy-oreille-suggestions-title{margin:16px 0 9px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;color:#fff3cf!important;font-size:clamp(1.35rem,6vw,2.3rem)!important;line-height:.95!important;letter-spacing:-.055em!important;font-weight:1000!important;text-transform:uppercase!important}
      .digiy-oreille-suggestions-title small{color:rgba(248,250,252,.76)!important;font-size:.78rem!important;font-weight:1000!important;letter-spacing:0!important;text-transform:none!important;white-space:nowrap!important}
      .digiy-oreille-templates{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;margin-top:0!important;max-height:none!important;overflow:visible!important;padding:0!important;border:0!important;background:transparent!important}
      .digiy-oreille-template{width:100%!important;min-height:92px!important;border:2px solid rgba(246,196,83,.25)!important;border-radius:22px!important;text-align:left!important;display:flex!important;align-items:center!important;justify-content:flex-start!important;background:linear-gradient(160deg,rgba(246,196,83,.24),rgba(0,166,81,.16))!important;color:#fff!important;padding:14px 15px!important;font-size:1.06rem!important;font-weight:1000!important;line-height:1.16!important;letter-spacing:-.02em!important;box-shadow:0 12px 26px rgba(0,0,0,.16)!important;cursor:pointer!important;white-space:normal!important;-webkit-tap-highlight-color:transparent!important}
      .digiy-oreille-template:active{transform:scale(.985)!important}
      .digiy-oreille-notes{display:grid!important;gap:10px!important;margin-top:12px!important}
      .digiy-oreille-note{min-height:88px!important;border-radius:22px!important;padding:14px 15px!important;background:rgba(255,255,255,.09)!important;border:2px solid rgba(255,255,255,.13)!important;font-size:1.02rem!important;font-weight:950!important;line-height:1.36!important;color:#fff!important;box-shadow:0 12px 26px rgba(0,0,0,.12)!important}
      .digiy-oreille-note b{display:block!important;margin-bottom:6px!important;font-size:1.18rem!important;font-weight:1000!important;color:#fff3cf!important;letter-spacing:-.03em!important}
      .digiy-oreille-note div{font-size:1rem!important;font-weight:950!important;line-height:1.34!important;color:rgba(248,250,252,.88)!important}
      .digiy-oreille-note small{display:block!important;color:rgba(248,250,252,.62)!important;font-size:.94rem!important;font-weight:950!important;margin-top:8px!important}
      @media(max-width:760px){.digiy-oreille-actions{grid-template-columns:repeat(2,minmax(0,1fr))!important}.digiy-oreille-templates{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}.digiy-oreille-template{min-height:82px!important;border-radius:19px!important;padding:11px 10px!important;font-size:.98rem!important;line-height:1.10!important}}
      @media(max-width:560px){.digiy-oreille-box{padding:13px!important;border-radius:24px!important}.digiy-oreille-actions{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}.digiy-oreille-actions button{min-height:60px!important;font-size:1rem!important;border-radius:18px!important}.digiy-oreille-text{min-height:120px!important;font-size:1.02rem!important}.digiy-oreille-suggestions-title{font-size:1.55rem!important;margin-top:14px!important}.digiy-oreille-suggestions-title small{font-size:.72rem!important}.digiy-oreille-templates{grid-template-columns:repeat(2,minmax(0,1fr))!important;max-height:360px!important;overflow-y:auto!important;padding-right:2px!important;-webkit-overflow-scrolling:touch!important}.digiy-oreille-template{min-height:78px!important;font-size:.94rem!important;padding:10px!important;border-radius:18px!important}.digiy-oreille-note b{font-size:1.12rem!important}}
      @media(max-width:340px){.digiy-oreille-template{font-size:.88rem!important;min-height:74px!important;padding:9px!important}}
    `;
    document.head.appendChild(style);
  }

  function renderNotes(container, config){
    if(!container) return;
    var notes = getNotes(config);
    container.innerHTML = "";
    if(!notes.length){
      container.innerHTML = "<div class=\"digiy-oreille-note\"><b>Aucun brouillon rangé</b><div>Teste une suggestion, puis clique sur Ranger.</div></div>";
      return;
    }
    notes.forEach(function(note){
      var div = document.createElement("div");
      div.className = "digiy-oreille-note";
      div.innerHTML = "<b>" + esc(note.module || config.module || "RESEAU_DIGIY") + "</b><div>" + esc(note.text) + "</div><small>" + esc(note.date || "") + "</small>";
      container.appendChild(div);
    });
  }

  function defaultFormulate(text, config){
    var clean = norm(text);
    var moduleName = String((config && config.module) || "RESEAU_DIGIY").toUpperCase();
    return clean ? moduleName + " · Brouillon : " + clean + " À relire, modifier et valider avant publication ou partage." : moduleName + " · Brouillon vide : préciser l’offre avant validation.";
  }

  function mount(userConfig){
    var config = assign({
      module:"RESEAU_DIGIY",
      title:"Oreille Réseau",
      subtitle:"Offre · fiche · lien · message partageable · validation DIGIY.",
      storagePrefix:"DIGIY_OREILLE_METIER",
      templates:[],
      guideText:"Oreille Réseau DIGIY. Rien n’est publié automatiquement.",
      target:"#digiy-oreille-reseau",
      formulate:null,
      buildSaveExtra:null
    }, userConfig || {});
    var target = typeof config.target === "string" ? document.querySelector(config.target) : config.target;
    if(!target) target = document.querySelector("#digiy-oreille-reseau,#digiy-oreille-metier,[data-digiy-oreille]");
    if(!target) return null;
    injectStyles();
    target.innerHTML =
      "<section class=\"digiy-oreille-box\" aria-label=\"" + esc(config.title) + "\">" +
        "<div class=\"digiy-oreille-head\"><strong>🎙️ " + esc(config.title) + "</strong><span>" + esc(config.subtitle) + "</span></div>" +
        "<div class=\"digiy-oreille-actions\">" +
          "<button type=\"button\" class=\"primary\" data-action=\"listen\">🎙️ Parler</button>" +
          "<button type=\"button\" class=\"gold\" data-action=\"formulate\">✨ Formuler</button>" +
          "<button type=\"button\" data-action=\"copy\">📋 Copier</button>" +
          "<button type=\"button\" data-action=\"save\">🗂️ Ranger</button>" +
          "<button type=\"button\" data-action=\"guide\">🎧 Guide</button>" +
          "<button type=\"button\" class=\"dark\" data-action=\"stop\">⏹ Stop</button>" +
        "</div>" +
        "<div class=\"digiy-oreille-status\" data-role=\"status\">Oreille prête. Le pro parle ou clique, DIGIY formule.</div>" +
        "<textarea class=\"digiy-oreille-text\" data-role=\"text\" aria-label=\"Texte Oreille Réseau\">" + esc((config.templates && config.templates[0]) || "") + "</textarea>" +
        "<div class=\"digiy-oreille-suggestions-title\">Suggestions <small>tap rapide</small></div>" +
        "<div class=\"digiy-oreille-templates\" data-role=\"templates\"></div>" +
        "<div class=\"digiy-oreille-notes\" data-role=\"notes\"></div>" +
      "</section>";
    var status = target.querySelector("[data-role='status']");
    var textArea = target.querySelector("[data-role='text']");
    var templates = target.querySelector("[data-role='templates']");
    var notes = target.querySelector("[data-role='notes']");
    function setStatus(message){ if(status) status.textContent = message; }
    function refreshNotes(){ renderNotes(notes, config); }
    (config.templates || []).forEach(function(templateText){
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "digiy-oreille-template";
      btn.textContent = templateText;
      btn.onclick = function(){
        textArea.value = templateText;
        setStatus("Suggestion chargée. Le pro peut modifier avant de copier ou ranger.");
      };
      templates.appendChild(btn);
    });
    target.addEventListener("click", function(event){
      var actionButton = event.target.closest("[data-action]");
      if(!actionButton) return;
      var action = actionButton.getAttribute("data-action");
      if(action === "listen") listen({onStart:function(){setStatus("Oreille ouverte. Parle naturellement, puis vérifie le texte.");},onText:function(value){textArea.value = value;},onEnd:function(){setStatus("Parole captée. Clique sur Formuler pour préparer un brouillon.");},onError:function(){setStatus("Micro indisponible. Utilise les suggestions prêtes.");}});
      if(action === "formulate"){
        textArea.value = typeof config.formulate === "function" ? config.formulate(textArea.value, config) : defaultFormulate(textArea.value, config);
        setStatus("Texte formulé. Le pro doit relire, modifier et valider.");
        toast("Formulé");
      }
      if(action === "copy") copy(textArea.value).then(function(){ setStatus("Texte copié. Tu peux le coller dans WhatsApp, SMS ou l’annonce."); });
      if(action === "save"){
        var extra = typeof config.buildSaveExtra === "function" ? config.buildSaveExtra(textArea.value, config) : {};
        var saved = saveNote(config, textArea.value, extra);
        if(saved){ refreshNotes(); setStatus("Brouillon rangé localement. Le terrain garde la main."); toast("Brouillon rangé"); }
        else toast("Rien à ranger");
      }
      if(action === "guide") speak(config.guideText);
      if(action === "stop") stopVoice();
    });
    refreshNotes();
    return {config:config,target:target,refreshNotes:refreshNotes,getText:function(){return textArea.value;},setText:function(value){textArea.value = norm(value);}};
  }

  window.DigiyOreilleMetier = {version:VERSION,mount:mount,init:mount,speak:speak,stopVoice:stopVoice,listen:listen,canListen:canListen,copy:copy,normalizeText:norm,escapeHtml:esc,formulate:defaultFormulate,saveNote:saveNote,getNotes:getNotes,setNotes:setNotes,clearNotes:clearNotes,showToast:toast};
})();
