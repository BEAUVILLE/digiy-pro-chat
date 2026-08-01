/* RÉSEAU DIGIY — chargeur unique de la surface multilingue complète */
(function(){
  'use strict';
  if(window.__DIGIY_RESEAU_COMPLETE_LOADER__)return;
  window.__DIGIY_RESEAU_COMPLETE_LOADER__=true;
  function load(){
    if(document.getElementById('reseau-langues-complet'))return;
    var s=document.createElement('script');
    s.id='reseau-langues-complet';
    s.src='./assets/js/reseau-langues.js?v=20260801-v3-traduction-complete';
    s.async=false;
    (document.head||document.documentElement).appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});
  else load();
})();