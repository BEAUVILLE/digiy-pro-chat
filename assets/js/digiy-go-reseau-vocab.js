/* DIGIY GO RÉSEAU — vocabulaire visibilité qualifiée FR WO AR */
(function(){"use strict";
var vocab={
  module:"RESEAU_DIGIY",
  label:"RÉSEAU DIGIY",
  version:"reseau-vocab-fr-wo-ar-20260528",
  languages:["fr","wo","ar"],
  doctrine:"RÉSEAU prépare fiche, annonce, durée et message de partage en français, wolof ou arabe. La publication reste qualifiée. PAY garde seulement le règlement réel.",
  intents:{
    announcement:["annonce","offre","promotion","promo","retour","disponibilité","disponibilite","arrivage","mise en lumière","yégle","xibaar","offre","wone","إعلان","عرض","تخفيض","عودة","توفر"],
    profile:["fiche","pro","professionnel","métier","metier","zone","contact","lien","QR","fich","liggéeykat","tur","barab","اتصال","رابط","بطاقة","مهني","مهنة"],
    duration:["7 jours","sept jours","15 jours","quinze jours","30 jours","mois","semaine","quinzaine","FIRST","mise en classe","ayu-bés","weer","أيام","أسبوع","شهر","خمسة عشر","ثلاثون"],
    payment:["règlement","reglement","payer","paiement","wave","cash","orange money","fay","xaalis","دفع","تسديد","وايف","كاش"]
  },
  fields:{
    pro:["pro","nom","boutique","professionnel","tur","boutique","liggéeykat","اسم","محل","مهني"],
    offer:["annonce","offre","promotion","promo","yégle","xibaar","إعلان","عرض","تخفيض"],
    duration:["durée","duree","visible","jours","mois","diir","bés","weer","مدة","أيام","شهر"],
    zone:["zone","ville","quartier","barab","dëkk","goox","منطقة","مدينة","حي"],
    price:["prix","tarif","montant","règlement","reglement","njëg","fay","سعر","مبلغ","دفع"],
    payment:["cash","wave","orange money","carte","xaalis","kesh","كاش","وايف","بطاقة"]
  },
  examples:["annonce boutique Astou promotion linge maison visible 7 jours zone Saly prix visibilité 15000 Wave","Yégle boutique Astou promo linge maison 7 jours Saly 15000 Wave","إعلان محل أستو عرض مفروشات منزلية لمدة 7 أيام في سالي، 15000 وايف"],
  payBridge:{allowed:true,phrasePrefix:"visibilité RÉSEAU",onlyRealMoney:true},
  safety:["aucune publication automatique","aucune fiche validée sans contrôle","aucun paiement validé sans pro ou admin"]
};
window.DIGIY_GO_VOCABS=window.DIGIY_GO_VOCABS||{};
window.DIGIY_GO_VOCABS.RESEAU_DIGIY=vocab;
window.DIGIY_GO_RESEAU_VOCAB=vocab;
})();