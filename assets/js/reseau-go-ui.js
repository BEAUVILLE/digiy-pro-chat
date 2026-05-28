/* RÉSEAU DIGIY — GO/PAY UI léger
   Injecte les deux portes pro sans toucher au diaporama premium.
   Doctrine : RÉSEAU garde fiche, annonce, durée, visibilité. PAY garde seulement l'argent réel.
*/
(function(){
  "use strict";

  function ready(fn){
    if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  function isHub(){
    var path = String(location.pathname || "").toLowerCase();
    return path.endsWith("/hub.html") || path.endsWith("/hub") || path.endsWith("/") || path === "";
  }

  function injectNav(){
    var nav = document.querySelector(".nav");
    if(!nav) return;

    if(!document.getElementById("navDigiyGoReseau")){
      var go = document.createElement("a");
      go.id = "navDigiyGoReseau";
      go.className = "gold";
      go.href = "action.html";
      go.textContent = "🎙️ GO RÉSEAU";
      var dep = nav.querySelector('a[href="annonce.html"]');
      if(dep) nav.insertBefore(go, dep);
      else nav.appendChild(go);
    }

    if(!document.getElementById("navReseauPayTransition")){
      var pay = document.createElement("a");
      pay.id = "navReseauPayTransition";
      pay.href = "pay-transition.html";
      pay.textContent = "💳 Visibilité PAY";
      var reg = nav.querySelector('a[href="paiement.html"]');
      if(reg) nav.insertBefore(pay, reg);
      else nav.appendChild(pay);
    }
  }

  function makeTile(id, href, cls, icon, title, text){
    var a = document.createElement("a");
    a.id = id;
    a.className = "tile " + cls;
    a.href = href;
    a.innerHTML = '<span class="icon">' + icon + '</span><strong>' + title + '</strong><p>' + text + '</p>';
    return a;
  }

  function injectProTiles(){
    var labels = Array.prototype.slice.call(document.querySelectorAll(".sectionLabel"));
    var proLabel = labels.find(function(el){
      return /côté pro|cote pro/i.test(String(el.textContent || ""));
    });
    if(!proLabel) return;

    var grid = proLabel.nextElementSibling;
    if(!grid || !grid.classList || !grid.classList.contains("grid")) return;

    if(!document.getElementById("tileDigiyGoReseau")){
      var go = makeTile(
        "tileDigiyGoReseau",
        "action.html",
        "gold",
        "🎙️",
        "DIGIY GO RÉSEAU",
        "Le pro parle. RÉSEAU prépare annonce, fiche, durée et message de partage."
      );
      grid.insertBefore(go, grid.firstElementChild);
    }

    if(!document.getElementById("tileReseauPayTransition")){
      var pay = makeTile(
        "tileReseauPayTransition",
        "pay-transition.html",
        "green",
        "💳",
        "Visibilité vers PAY",
        "Argent réel seulement : 7 jours, 15 jours, 30 jours ou mise en classe FIRST."
      );
      var reglement = grid.querySelector('a[href="paiement.html"]');
      if(reglement) grid.insertBefore(pay, reglement);
      else grid.appendChild(pay);
    }
  }

  function boot(){
    if(!isHub()) return;
    injectNav();
    injectProTiles();
  }

  ready(function(){
    window.DIGIY_RESEAU_GO_UI = {
      version:"reseau-go-ui-20260528",
      boot:boot,
      injectNav:injectNav,
      injectProTiles:injectProTiles
    };
    boot();
    setTimeout(boot, 500);
  });
})();
