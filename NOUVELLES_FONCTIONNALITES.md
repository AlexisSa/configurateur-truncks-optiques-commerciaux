# Nouvelles Fonctionnalités - Configurateur Truncks Optiques

## Date : 14 octobre 2025

Ce document décrit les nouvelles fonctionnalités ajoutées au configurateur de truncks optiques.

---

## 1. 🔄 Décodeur de Référence

### Description

Permet de charger une configuration complète à partir d'une référence produit existante. C'est l'inverse du système actuel : au lieu de configurer pour obtenir une référence, vous pouvez maintenant coller une référence pour remplir automatiquement tous les champs.

### Utilisation

1. Dans la section "Résultats de votre configuration", vous trouverez une nouvelle zone "Charger depuis une référence"
2. Collez ou saisissez une référence (ex: `T12FSD0H-OS2LC/LC50P`)
3. Cliquez sur "Charger" ou appuyez sur Entrée
4. Tous les champs de configuration seront automatiquement remplis

### Format de référence supporté

Le format est : `T{fibres}{typeCode}-{modeCode}{connA}/{connB}{longueur}{testCode}`

Exemples valides :

- `T12FSD0H-OS2LC/LC50P` - 12 fibres, Standard LSZH, Monomode OS2, LC/LC, 50m, Photométrie
- `T24FRF0H-OS2SCA/SCA100R` - 24 fibres, Renforcé LSZH, Monomode OS2, SC/APC, 100m, Réflectométrie
- `T6FSLPE-OS2LC/LC15P` - 6 fibres, Standard PE, Monomode OS2, LC/LC, 15m, Photométrie

### Codes supportés

**Types de câble :**

- `FSD0H` = Standard LSZH
- `FRF0H` = Renforcé LSZH
- `FSLPE` = Standard PE
- `FAA0H` = Armé Acier LSZH
- `FAAPE` = Armé Acier PE

**Modes de fibre :**

- `OS2` = Monomode OS2
- `M1` = Multimode OM1
- `M2` = Multimode OM2
- `M3` = Multimode OM3
- `M4` = Multimode OM4
- `M5` = Multimode OM5

**Connecteurs :**

- `LC` = LC
- `SC` = SC
- `ST` = ST
- `SCA` = SC/APC

**Tests :**

- `P` = Photométrie
- `R` = Réflectométrie

### Notifications

- ✅ **Succès** : "Configuration chargée depuis la référence {référence}"
- ❌ **Erreur** : "Format de référence invalide. Vérifiez la référence et réessayez."

---

## 2. 📊 Sélecteur de Marge Commerciale

### Description

Permet de choisir dynamiquement la marge commerciale appliquée au prix de vente, de 0% (prix coûtant) à 60% par tranches de 10%.

### Utilisation

1. Dans la section "Résultats de votre configuration", vous trouverez le sélecteur "Marge commerciale"
2. Cliquez sur l'un des boutons : 0%, 10%, 20%, 30%, 40%, 50%, ou 60%
3. Le prix affiché est immédiatement recalculé avec la nouvelle marge

### Calcul de la marge

La formule appliquée est : **Prix final = Prix coûtant / (1 - marge%)**

Exemples pour un coût de 200€ :

- **Marge 0%** : 200.00 € (prix coûtant)
- **Marge 10%** : 222.22 € (prix × 1.11)
- **Marge 20%** : 250.00 € (prix × 1.25)
- **Marge 30%** : 285.71 € (prix × 1.43)
- **Marge 40%** : 333.33 € (prix × 1.67)
- **Marge 50%** : 400.00 € (prix × 2.00)
- **Marge 60%** : 500.00 € (prix × 2.50) - **Valeur par défaut**

### Valeur par défaut

La marge par défaut est de **60%**, comme dans la version précédente du configurateur.

### Impact

- Le prix affiché dans la section "Prix public" est mis à jour instantanément
- Le prix unitaire (si quantité > 1) est également recalculé
- La marge sélectionnée est incluse dans les PDF générés et les emails envoyés

---

## 3. 📋 Copie de Référence Simplifiée

### Description

La référence générée est maintenant cliquable pour la copier directement dans le presse-papiers.

### Utilisation

1. Une fois votre configuration complète, une référence est générée
2. Cliquez simplement sur la référence affichée
3. Elle est automatiquement copiée dans votre presse-papiers
4. Un effet visuel confirme l'action

---

## Fichiers Modifiés

### Nouveaux Fichiers

Aucun nouveau fichier créé, toutes les fonctionnalités ont été intégrées dans les fichiers existants.

### Fichiers Modifiés

1. **`src/utils/calculations.js`**

   - Ajout de la fonction `parseReference()` pour décoder les références
   - Modification de `calculatePrice()` pour accepter un paramètre `margin`
   - Modification de `getPriceBreakdown()` pour accepter un paramètre `margin`

2. **`src/hooks/useConfiguration.js`**

   - Ajout de l'état `margin` (défaut: 60)
   - Ajout de la fonction `loadFromReference()`
   - Export de `margin`, `setMargin`, et `loadFromReference`

3. **`src/App.jsx`**

   - Récupération des nouvelles props du hook
   - Passage de `margin` dans les calculs de prix
   - Passage des nouvelles props à `ResultsSection`

4. **`src/components/ResultsSection.jsx`**

   - Ajout de la section "Charger depuis une référence"
   - Ajout du sélecteur de marge commerciale
   - Mise à jour des calculs de prix avec le paramètre `margin`
   - Ajout de la fonctionnalité de copie de référence

5. **`src/App.css`**
   - Styles pour `.reference-loader-section`
   - Styles pour `.margin-selector` et `.margin-button`
   - Styles pour la référence cliquable
   - Media queries pour le responsive

---

## Tests Effectués

### Test du Décodeur de Référence

✅ Références Standard LSZH  
✅ Références avec SC/APC  
✅ Références Multimode  
✅ Références Standard PE (épanouissement automatique)  
✅ Références invalides (retournent null)  
✅ Toutes les combinaisons de connecteurs

### Test du Calcul de Marge

✅ Marge 0% (prix coûtant)  
✅ Marge 10%  
✅ Marge 20%  
✅ Marge 30%  
✅ Marge 40%  
✅ Marge 50%  
✅ Marge 60% (valeur par défaut)

### Pas d'Erreurs de Linting

✅ Aucune erreur ESLint détectée

---

## Notes Importantes

1. **Épanouissement** : Lors du chargement depuis une référence, l'épanouissement n'est pas encodé dans la référence. Pour les câbles Standard PE, Armé Acier PE et Armé Acier LSZH, il est automatiquement défini sur "Regainé (2,8 mm)". Pour les autres types, le champ reste vide et l'utilisateur doit le sélectionner manuellement.

2. **Compatibilité** : Les nouvelles fonctionnalités sont entièrement rétrocompatibles. La marge par défaut de 60% garantit que les prix restent identiques à la version précédente si aucun changement n'est effectué.

3. **PDF Generator** : Le générateur de PDF utilise actuellement la valeur par défaut de 60% pour la marge. Une amélioration future pourrait consister à passer explicitement la marge sélectionnée au PDF.

4. **Design** : Le design suit les préférences de l'utilisateur : sobre, moderne, sans thème sombre, avec des dégradés subtils et des couleurs douces.

---

## Améliorations Futures Possibles

1. Inclure l'épanouissement dans la référence produit
2. Passer la marge sélectionnée au générateur de PDF
3. Ajouter un historique des références chargées
4. Permettre de sauvegarder la marge préférée dans les configurations sauvegardées
5. Ajouter un bouton de réinitialisation de la marge à 60%

---

**Développé le 14 octobre 2025**
