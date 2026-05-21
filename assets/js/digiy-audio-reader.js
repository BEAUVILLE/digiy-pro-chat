/* DIGIY AUDIO — lecteur vocal terrain
   Lit la page avec speechSynthesis. Aucune dépendance, local robuste.
*/
(function(){
  'use strict';

  const state = {
    speaking:false,
    paused:false,
    utterance:null,
    lastText:''
  };

  function $(sel, root=document){ return root.querySelector(sel); }
  function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  function clean(text){
    return (text || '')
      .replace(/\s+/g, ' ')
      .replace(/FCFA/g, ' francs CFA')
      .replace(/AIBD/g, 'A I B D')
      .replace(/DIGIYLYFE/g, 'DIGIY life')
      .replace(/DIGIY/g, 'DIGIY')
      .replace(/WhatsApp/g, 'Watsap')
      .trim();
  }

  function status(msg){
    $all('[data-audio-status]').forEach(el => { el.textContent = msg; });
  }

  function getBestVoice(){
    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    if(!voices || !voices.length) return null;
    return voices.find(v => /fr[-_]/i.test(v.lang) && /Google|Microsoft|Thomas|Denise|Audrey|Amelie|Hortense|Henri/i.test(v.name))
      || voices.find(v => /fr[-_]/i.test(v.lang))
      || voices[0];
  }

  function buildTextFromPage(){
    const custom = document.body.getAttribute('data-audio-text');
    if(custom) return clean(custom);

    const source = $('[data-audio-source]') || $('.shell') || document.body;
    const selectors = [
      '.brand h1','.brand p','.hero .kicker','.hero h2','.hero .lead',
      '.panel h3','.panel p','.tile strong','.tile p','.price-card span','.price-card b',
      'label','.small','.footer'
    ];
    const pieces = [];
    selectors.forEach(sel => {
      $all(sel, source).forEach(el => {
        if(el.closest('.nav') || el.closest('.digiy-reader') || el.hidden) return;
        const t = clean(el.innerText || el.textContent || '');
        if(t && !pieces.includes(t)) pieces.push(t);
      });
    });
    return clean(pieces.join('. '));
  }

  function stop(){
    if(!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    state.speaking = false;
    state.paused = false;
    state.utterance = null;
    status('Lecture arrêtée.');
    document.body.classList.remove('audio-playing','audio-paused');
  }

  function pause(){
    if(!('speechSynthesis' in window)) return;
    if(window.speechSynthesis.speaking && !window.speechSynthesis.paused){
      window.speechSynthesis.pause();
      state.paused = true;
      status('Lecture en pause.');
      document.body.classList.add('audio-paused');
    }
  }

  function resume(){
    if(!('speechSynthesis' in window)) return;
    if(window.speechSynthesis.paused){
      window.speechSynthesis.resume();
      state.paused = false;
      status('Lecture reprise.');
      document.body.classList.remove('audio-paused');
      document.body.classList.add('audio-playing');
      return true;
    }
    return false;
  }

  function play(){
    if(!('speechSynthesis' in window)){
      status('Audio non disponible sur ce navigateur. Copie le texte ou réessaie avec Chrome/Safari.');
      return;
    }
    if(resume()) return;
    stop();
    const text = buildTextFromPage();
    if(!text){ status('Aucun texte à lire.'); return; }
    state.lastText = text;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR';
    u.rate = 0.86;
    u.pitch = 1.02;
    u.volume = 1;
    const voice = getBestVoice();
    if(voice) u.voice = voice;
    u.onstart = () => {
      state.speaking = true;
      state.paused = false;
      status('DIGIY parle. Écoute, puis clique pour agir.');
      document.body.classList.add('audio-playing');
      document.body.classList.remove('audio-paused');
    };
    u.onend = () => {
      state.speaking = false;
      state.paused = false;
      status('Lecture terminée. Le terrain peut agir.');
      document.body.classList.remove('audio-playing','audio-paused');
    };
    u.onerror = () => {
      state.speaking = false;
      state.paused = false;
      status('Lecture interrompue. Relance si besoin.');
      document.body.classList.remove('audio-playing','audio-paused');
    };
    state.utterance = u;
    window.speechSynthesis.speak(u);
  }

  function bind(){
    $all('[data-audio-play]').forEach(btn => btn.addEventListener('click', play));
    $all('[data-audio-pause]').forEach(btn => btn.addEventListener('click', pause));
    $all('[data-audio-stop]').forEach(btn => btn.addEventListener('click', stop));
    if('speechSynthesis' in window){
      window.speechSynthesis.onvoiceschanged = () => getBestVoice();
    }
    status('Prêt à écouter. Les gens lisent moins : DIGIY parle.');
  }

  document.addEventListener('DOMContentLoaded', bind);
  window.DIGIY_AUDIO = { play, pause, stop, buildTextFromPage };
})();
