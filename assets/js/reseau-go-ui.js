/* RÉSEAU DIGIY — GO/ACTION vers inscription
   Aucun lien vers /abos/. ACTION et GO ouvrent l’entrée qualifiée.
*/
(function(){
  "use strict";

  const ENTRY_URL = "inscription.html?cat=reseau";
  const PAY_URL = "paiement.html?cat=R7";

  function ready(fn){
    if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  function isHub(){
    var path = String(location.pathname || "").toLowerCase();
    return path.endsWith("/hub.html") || path.endsWith("/hub") || path.endsWith("/") || path === "";
  }

  function txt(el){
    return String(el && el.textContent || "");
  }

  function cleanLinks(){
    document.querySelectorAll("a").forEach(function(a){
      var text = txt(a);
      var href = String(a.getAttribute("href") || "");
      var full = String(a.href || "");

      // Ancien serpent : aucun lien ABOS dans RÉSEAU.
      if(/beauville\.github\.io\/abos|\/abos\//i.test(full)){
        a.setAttribute("href", ENTRY_URL);
      }

      // Sur le HUB, GO / ACTION ouvrent l’inscription qualifiée.
      if(
        /GO RÉSEAU|GO RESEAU|ACTION RÉSEAU|ACTION RESEAU|🎙️ ACTION/i.test(text) ||
        href === "action.html" ||
        href === "./action.html"
      ){
        if(isHub()){
          a.setAttribute("href", ENTRY_URL);
        }

        a.innerHTML = a.innerHTML
          .replace(/DIGIY GO RÉSEAU|DIGIY GO RESEAU|GO RÉSEAU|GO RESEAU/g, "ACTION RÉSEAU");
      }

      // La visibilité PAY reste dans RÉSEAU, pas dans ABOS.
      if(/Visibilité PAY/i.test(text) && (href === "pay-transition.html" || href === "./pay-transition.html")){
        a.setAttribute("href", PAY_URL);
      }
    });
  }

  function hasHref(container, href){
    return !!container.querySelector('a[href="' + href + '"], a[href="./' + href + '"]');
  }

  function injectNav(){
    var nav = document.querySelector(".nav");
    if(!nav) return;

    // Retire l’ancien GO injecté si présent.
    var oldGo = document.getElementById("navDigiyGoReseau");
    if(oldGo) oldGo.remove();

    // Ajoute une entrée propre si elle n’existe pas déjà.
    if(!document.getElementById("navReseauInscription") && !hasHref(nav, "inscription.html?cat=reseau")){
      var entry = document.createElement("a");
      entry.id = "navReseauInscription";
      entry.className = "gold";
      entry.href = ENTRY_URL;
      entry.textContent = "👤 Entrée RÉSEAU";

      var dep = nav.querySelector('a[href="annonce.html"], a[href="./annonce.html"]');
      if(dep) nav.insertBefore(entry, dep);
      else nav.appendChild(entry);
    }
  }

  function boot(){
    if(!isHub()) return;

    cleanLinks();
    injectNav();
  }

  ready(function(){
    window.DIGIY_RESEAU_GO_UI = {
      version: "reseau-go-action-to-inscription-20260603",
      boot: boot,
      cleanLinks: cleanLinks,
      injectNav: injectNav
    };

    window.DIGIY_RESEAU_ACTION_UI = window.DIGIY_RESEAU_GO_UI;

    boot();
    setTimeout(boot, 500);
    setTimeout(boot, 1200);
  });
})();
