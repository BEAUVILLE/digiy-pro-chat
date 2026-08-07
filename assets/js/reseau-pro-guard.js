/* RÉSEAU DIGIY — garde strict des outils PRO.
   Autorise uniquement une session créée après validation ABOS RESEAU_DIGIY.
   Aucun téléphone n'est placé dans l'URL. */
(function(){
  'use strict';
  var KEY='DIGIY_RESEAU_PRO_SESSION';
  var PHONE_KEY='DIGIY_RESEAU_PRO_PHONE';
  var MAX_AGE=8*60*60*1000;
  var ACCESS='./acces-pro.html';

  function read(){
    try{
      var raw=localStorage.getItem(KEY)||sessionStorage.getItem(KEY);
      return raw?JSON.parse(raw):null;
    }catch(_){return null;}
  }

  function time(v){
    if(!v)return 0;
    if(typeof v==='number')return v;
    var n=Date.parse(v);
    return Number.isFinite(n)?n:0;
  }

  function valid(s){
    if(!s||s.access_ok!==true)return false;
    var module=String(s.module||'').toUpperCase();
    if(module!=='RESEAU_DIGIY'&&module!=='RESEAU'&&module!=='RÉSEAU')return false;
    if(!String(s.phone||'').replace(/\D/g,''))return false;
    var verified=time(s.verified_at||s.ts||s.at);
    if(!verified||Date.now()-verified>MAX_AGE||verified>Date.now()+5*60*1000)return false;
    var expires=time(s.expires_at);
    if(expires&&expires<=Date.now())return false;
    return true;
  }

  function clear(){
    try{localStorage.removeItem(KEY);localStorage.removeItem(PHONE_KEY);}catch(_){}
    try{sessionStorage.removeItem(KEY);sessionStorage.removeItem(PHONE_KEY);}catch(_){}
  }

  function requireAccess(){
    var s=read();
    if(valid(s)){
      document.documentElement.style.visibility='';
      return s;
    }
    clear();
    document.documentElement.style.visibility='hidden';
    try{
      var u=new URL(ACCESS,location.href);
      u.searchParams.set('reason','pro_required');
      location.replace(u.pathname+u.search);
    }catch(_){location.replace(ACCESS);}
    return null;
  }

  window.DIGIY_RESEAU_PRO_GUARD={read:read,valid:valid,requireAccess:requireAccess,clear:clear,maxAgeMs:MAX_AGE};
  requireAccess();
})();
