# RÉSEAU DIGIY — COM AU CLIC · Oreille Métier

Module transversal DIGIYLYFE pour les offres qualifiées, fiches pro, annonces datées, messages partageables, liens cliquables et activation de visibilité.

RÉSEAU DIGIY n’est pas un tableau d’annonces open-bar. C’est une implantation noble : le public peut voir, cliquer, partager et contacter ; la publication reste qualifiée.

---

## Doctrine du jour

### Une page = un sujet

Chaque page garde son rôle. On ne mélange pas navigation, dépôt, paiement, session locale et travail vocal.

- `index.html` : porte courte vers le hub.
- `hub.html` : navigation principale en pavés terrain.
- `inscription.html` : profil pro / qualification.
- `annonce.html` : dépôt ou préparation de l’annonce.
- `paiement.html` : durée, règlement, preuve.
- `journal.html` : offres visibles / circulation publique.
- `fiche.html` : fiche ou offre partageable.
- `assistant.html` : textes prêts et modifiables.
- `session.html` : coffre local / nettoyage.
- `oreille.html` : seule vraie page de travail vocal.

Le hub oriente. La page agit.

---

## Règle Oreille Métier RÉSEAU

L’Oreille Réseau ne doit pas être chargée partout.

### Autorisé

`oreille.html` charge les scripts Oreille :

```html
<script src="./assets/js/oreille-metier-core.js" defer></script>
<script src="./assets/js/oreille-reseau.js" defer></script>
```

### Interdit

Ne jamais charger les scripts Oreille dans :

- `hub.html`
- `session.html`
- `index.html`
- `inscription.html`
- `annonce.html`
- `paiement.html`
- `journal.html`
- `fiche.html`
- `assistant.html`

Ces pages peuvent seulement ouvrir l’Oreille avec un lien clair :

```html
<a href="./oreille.html">🎙️ Oreille Réseau</a>
```

---

## Moule technique validé

Chaque module DIGIYLYFE suit ce moule :

```txt
assets/js/oreille-metier-core.js
assets/js/oreille-[module].js
oreille.html
hub.html
session.html
```

Pour RÉSEAU DIGIY :

```txt
assets/js/oreille-metier-core.js
assets/js/oreille-reseau.js
oreille.html
hub.html
session.html
```

---

## Doctrine visuelle téléphone

Oreille Réseau doit être visible, grande et grasse.

Sur téléphone :

- le titre Oreille doit être très lisible ;
- les boutons doivent être grands ;
- les suggestions doivent être en pavés, idéalement 2 par 2 ;
- le pro doit pouvoir taper avec le pouce ;
- éviter les longues colonnes qui fatiguent ;
- moins d’écriture, plus de clics.

---

## Ce que fait l’Oreille Réseau

Elle peut aider à préparer :

- une nouvelle offre ;
- une mise en classe FIRST ;
- un spotlight sur une fiche existante ;
- un message WhatsApp partageable ;
- une offre produit local ;
- une disponibilité location ;
- un retour chauffeur ;
- un service disponible ;
- un événement ou une activité ;
- un brouillon à qualifier.

Le pro parle ou clique. DIGIY met en forme. Le pro valide. DIGIY active si les conditions sont remplies.

---

## Limites protégées

Rien n’est confirmé automatiquement :

- pas d’annonce publiée automatiquement ;
- pas de durée activée automatiquement ;
- pas de prix confirmé automatiquement ;
- pas de mise en avant validée sans contrôle DIGIY ;
- pas de promesse client envoyée sans validation ;
- pas de paiement considéré comme reçu sans preuve vérifiée ;
- pas de fiche créée automatiquement sans accord.

RÉSEAU prépare. DIGIY qualifie. Le terrain garde la main.

---

## Positionnement

Le public peut :

- voir les offres ;
- cliquer ;
- partager ;
- contacter directement ;
- faire circuler une fiche ou une offre.

Le pro peut préparer une annonce, mais la publication reste qualifiée.

Pour un pro déjà validé : visibilité 7j / 15j / 30j selon le modèle actif.

Pour un pro non encore validé : entrée par **Mise en classe FIRST**, avec fiche propre, QR, lien partageable, messages prêts et mise en lumière.

---

## Routes importantes

```txt
./index.html
./hub.html
./oreille.html
./inscription.html
./annonce.html
./paiement.html
./journal.html
./fiche.html
./assistant.html
./session.html
```

---

## Test de fermeture terrain

Après chaque correction, tester sur téléphone :

1. ouvrir `index.html` ;
2. arriver sur `hub.html` ;
3. vérifier que le hub propose une porte vers `oreille.html` ;
4. ouvrir `oreille.html` ;
5. vérifier le grand titre **Oreille Réseau** ;
6. vérifier les suggestions en pavés téléphone ;
7. vérifier que rien ne publie automatiquement ;
8. vérifier que `hub.html` et `session.html` ne chargent pas les scripts Oreille ;
9. tester `annonce.html`, `paiement.html`, `fiche.html`, `journal.html` ;
10. vérifier que les brouillons restent locaux tant que DIGIY n’active pas.

---

## Signature DIGIYLYFE

RÉSEAU DIGIY transforme le bouche-à-oreille en lien propre, cliquable et visible.

La fiche rassure. L’annonce attire. Le contact transforme.

**Le terrain garde sa fiche, son client, son argent et sa relation.**
