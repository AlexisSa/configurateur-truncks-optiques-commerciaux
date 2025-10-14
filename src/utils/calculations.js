import { TARIFS } from "./tarifs.js";

// Fonction pour vérifier si la configuration est complète
export const isConfigurationComplete = (selectedOptions) => {
  const requiredFields = [
    "connecteurA",
    "connecteurB",
    "nombreFibres",
    "modeFibre",
    "typeCable",
    "longueur",
    "epanouissement",
    "typeTest",
  ];

  // Vérifier les champs obligatoires
  const basicFieldsComplete = requiredFields.every(
    (field) => selectedOptions[field] !== ""
  );

  // Pour la quantité, considérer vide comme valide (équivalent à 1)
  const quantityValid =
    !selectedOptions.quantite ||
    selectedOptions.quantite === "" ||
    parseInt(selectedOptions.quantite) >= 1;

  return basicFieldsComplete && quantityValid;
};

// Fonction pour obtenir les modes de fibre disponibles
export const getAvailableFiberModes = (selectedOptions) => {
  const allModes = [
    "Monomode OS2",
    "Multimode OM1",
    "Multimode OM2",
    "Multimode OM3",
    "Multimode OM4",
    "Multimode OM5",
  ];

  // Si SC/APC est sélectionné, seul Monomode OS2 est disponible
  if (
    selectedOptions.connecteurA === "SCA" ||
    selectedOptions.connecteurB === "SCA"
  ) {
    return ["Monomode OS2"];
  }

  return allModes;
};

// Fonction pour vérifier la disponibilité de la configuration
export const isConfigurationAvailable = (selectedOptions) => {
  if (!isConfigurationComplete(selectedOptions))
    return { available: false, reason: "Configuration incomplète" };

  // Vérifier si SC/APC est sélectionné
  if (
    selectedOptions.connecteurA === "SCA" ||
    selectedOptions.connecteurB === "SCA"
  ) {
    if (selectedOptions.modeFibre !== "Monomode OS2") {
      return {
        available: false,
        reason: "SC/APC n'est disponible qu'avec Monomode OS2",
      };
    }
  }

  // Tarifs des câbles par mètre linéaire selon la grille tarifaire
  const cablePrices = TARIFS.cablePrices;

  // Vérifier si le câble est disponible
  const cablePrice =
    cablePrices[selectedOptions.typeCable]?.[selectedOptions.modeFibre]?.[
      selectedOptions.nombreFibres
    ];
  if (cablePrice === null || cablePrice === undefined) {
    return {
      available: false,
      reason: `Configuration non disponible : ${selectedOptions.typeCable} ${selectedOptions.modeFibre} ${selectedOptions.nombreFibres} fibres`,
    };
  }

  // Les connecteurs sont maintenant inclus dans la main d'œuvre
  // Plus besoin de vérifier leur disponibilité

  return { available: true, reason: null };
};

// Fonction pour calculer le détail des prix
export const getPriceBreakdown = (selectedOptions, margin = 60) => {
  if (!isConfigurationComplete(selectedOptions)) return null;

  // Tarifs des câbles par mètre linéaire selon la grille tarifaire
  const cablePrices = TARIFS.cablePrices;

  // Main d'œuvre selon le type de câble et le nombre de fibres
  const laborCosts = TARIFS.laborCosts;

  // Déterminer le type de tarif de main d'œuvre
  const isStandardCable =
    selectedOptions.typeCable === "Standard LSZH" ||
    selectedOptions.typeCable === "Renforcé LSZH";
  const laborType = isStandardCable ? "standard" : "other";

  // Coût de regainage selon le nombre de fibres
  const resheathingCosts = TARIFS.resheathingCosts;

  // Coût des tests
  const testCosts = TARIFS.testCosts;

  // Frais de port
  const shippingCost = TARIFS.shippingCost;

  // Tarifs des connecteurs SC/APC
  const scapcConnectorPrices = TARIFS.scapcConnectorPrices;

  try {
    // 1. Prix du câble par mètre linéaire
    const nombreFibres = parseInt(selectedOptions.nombreFibres);
    const cablePricePerMeter =
      cablePrices[selectedOptions.typeCable]?.[selectedOptions.modeFibre]?.[
        nombreFibres
      ];
    const cableTotal =
      cablePricePerMeter * parseFloat(selectedOptions.longueur);

    // 2. Main d'œuvre (inclut les connecteurs)
    const laborTotal = laborCosts[laborType][nombreFibres];

    // 3. Coût de regainage
    // Pour Standard PE, Armé Acier PE et Armé Acier LSZH : toujours appliquer le tarif de regainage
    const forceResheathing =
      selectedOptions.typeCable === "Standard PE" ||
      selectedOptions.typeCable === "Armé Acier PE" ||
      selectedOptions.typeCable === "Armé Acier LSZH";

    const resheathingTotal =
      selectedOptions.epanouissement === "Regainé (2,8 mm)" || forceResheathing
        ? resheathingCosts[nombreFibres]
        : 0;

    // 4. Coût des tests
    const testTotal =
      selectedOptions.typeTest === "Réflectométrie"
        ? testCosts[selectedOptions.typeTest][nombreFibres]
        : testCosts[selectedOptions.typeTest];

    // 5. Frais de port
    const shippingTotal = shippingCost;

    // 6. Coût des connecteurs SC/APC
    let scapcConnectorTotal = 0;
    let scapcConnectorCount = 0;
    if (
      selectedOptions.connecteurA === "SCA" ||
      selectedOptions.connecteurB === "SCA"
    ) {
      const connectorPrice = scapcConnectorPrices[nombreFibres];
      if (connectorPrice) {
        // Compter le nombre de connecteurs SC/APC pour l'affichage
        scapcConnectorCount =
          (selectedOptions.connecteurA === "SCA" ? 1 : 0) +
          (selectedOptions.connecteurB === "SCA" ? 1 : 0);
        // Prix fixe qu'il y ait un ou deux connecteurs SC/APC
        scapcConnectorTotal = connectorPrice;
      }
    }

    return {
      cable: {
        pricePerMeter: cablePricePerMeter,
        total: cableTotal,
        description: `Câble ${selectedOptions.typeCable} ${selectedOptions.modeFibre}`,
      },
      labor: {
        total: laborTotal,
        description: `Main d'œuvre (${
          laborType === "standard" ? "Standard/Renforcé LSZH" : "Autres types"
        })`,
      },
      resheathing: {
        total: resheathingTotal,
        description: "Regainage",
      },
      test: {
        total: testTotal,
        description: `Test ${selectedOptions.typeTest}`,
      },
      shipping: {
        total: shippingTotal,
        description: "Frais de port",
      },
      scapcConnectors: {
        total: scapcConnectorTotal,
        count: scapcConnectorCount,
        description: `Connecteurs SC/APC (prix fixe: ${
          scapcConnectorPrices[nombreFibres] || 0
        }€)`,
      },
      subtotal:
        cableTotal +
        laborTotal +
        resheathingTotal +
        testTotal +
        shippingTotal +
        scapcConnectorTotal,
      margin: {
        percentage: margin,
        amount:
          ((cableTotal +
            laborTotal +
            resheathingTotal +
            testTotal +
            shippingTotal +
            scapcConnectorTotal) *
            (margin / 100)) /
          (1 - margin / 100), // Calcul de la marge : coût * (marge% / (100% - marge%))
        description: `Marge commerciale (${margin}%)`,
      },
      quantity: {
        value: parseInt(selectedOptions.quantite) || 1,
        description: "Quantité",
      },
      total:
        ((cableTotal +
          laborTotal +
          resheathingTotal +
          testTotal +
          shippingTotal +
          scapcConnectorTotal) /
          (1 - margin / 100)) *
        (parseInt(selectedOptions.quantite) || 1),
    };
  } catch (error) {
    console.error("Erreur dans le calcul du détail des prix:", error);
    return null;
  }
};

// Fonction pour calculer le prix total
export const calculatePrice = (selectedOptions, margin = 60) => {
  if (!isConfigurationComplete(selectedOptions)) return null;

  // Tarifs des câbles par mètre linéaire selon la grille tarifaire
  const cablePrices = TARIFS.cablePrices;

  // Main d'œuvre selon le type de câble et le nombre de fibres
  const laborCosts = TARIFS.laborCosts;

  // Déterminer le type de tarif de main d'œuvre
  const isStandardCable =
    selectedOptions.typeCable === "Standard LSZH" ||
    selectedOptions.typeCable === "Renforcé LSZH";
  const laborType = isStandardCable ? "standard" : "other";

  // Coût de regainage selon le nombre de fibres
  const resheathingCosts = TARIFS.resheathingCosts;

  // Coût des tests
  const testCosts = TARIFS.testCosts;

  // Frais de port
  const shippingCost = TARIFS.shippingCost;

  // Tarifs des connecteurs SC/APC
  const scapcConnectorPrices = TARIFS.scapcConnectorPrices;

  try {
    // 1. Prix du câble par mètre linéaire
    const nombreFibres = parseInt(selectedOptions.nombreFibres);
    const cablePricePerMeter =
      cablePrices[selectedOptions.typeCable]?.[selectedOptions.modeFibre]?.[
        nombreFibres
      ];

    if (cablePricePerMeter === null || cablePricePerMeter === undefined) {
      return null; // Configuration non disponible
    }

    const cableTotal =
      cablePricePerMeter * parseFloat(selectedOptions.longueur);

    // 2. Main d'œuvre (inclut les connecteurs)
    const laborTotal = laborCosts[laborType][nombreFibres];

    // 3. Coût de regainage
    // Pour Standard PE, Armé Acier PE et Armé Acier LSZH : toujours appliquer le tarif de regainage
    const forceResheathing =
      selectedOptions.typeCable === "Standard PE" ||
      selectedOptions.typeCable === "Armé Acier PE" ||
      selectedOptions.typeCable === "Armé Acier LSZH";

    const resheathingTotal =
      selectedOptions.epanouissement === "Regainé (2,8 mm)" || forceResheathing
        ? resheathingCosts[nombreFibres]
        : 0;

    // 4. Coût des tests
    const testTotal =
      selectedOptions.typeTest === "Réflectométrie"
        ? testCosts[selectedOptions.typeTest][nombreFibres]
        : testCosts[selectedOptions.typeTest];

    // 5. Frais de port
    const shippingTotal = shippingCost;

    // 6. Coût des connecteurs SC/APC
    let scapcConnectorTotal = 0;
    if (
      selectedOptions.connecteurA === "SCA" ||
      selectedOptions.connecteurB === "SCA"
    ) {
      const connectorPrice = scapcConnectorPrices[nombreFibres];
      if (connectorPrice) {
        // Prix fixe qu'il y ait un ou deux connecteurs SC/APC
        scapcConnectorTotal = connectorPrice;
      }
    }

    // Calcul du prix total
    const totalPrice =
      cableTotal +
      laborTotal +
      resheathingTotal +
      testTotal +
      shippingTotal +
      scapcConnectorTotal;

    // Application de la marge dynamique
    // Formule : prix_final = coût / (1 - marge%)
    // Exemple : marge 60% -> prix = coût / 0.4 = coût * 2.5
    // Exemple : marge 10% -> prix = coût / 0.9 = coût * 1.11
    const priceWithMargin = totalPrice / (1 - margin / 100);

    // Application de la quantité
    const quantity = parseInt(selectedOptions.quantite) || 1;
    const finalPrice = priceWithMargin * quantity;

    return Math.round(finalPrice * 100) / 100;
  } catch (error) {
    console.error("Erreur dans le calcul du prix:", error);
    return null;
  }
};

// Fonction pour générer la référence
export const generateReference = (selectedOptions) => {
  if (!isConfigurationComplete(selectedOptions)) return null;

  const refParts = [];
  const cableStructure = [];
  cableStructure.push("T");
  const fiberCount = selectedOptions.nombreFibres;
  cableStructure.push(fiberCount);
  const cableCode = {
    "Standard LSZH": "FSD0H",
    "Renforcé LSZH": "FRF0H",
    "Standard PE": "FSLPE",
    "Armé Acier LSZH": "FAA0H",
    "Armé Acier PE": "FAAPE",
  };
  cableStructure.push(cableCode[selectedOptions.typeCable]);
  refParts.push(cableStructure.join(""));

  const testConnectors = [];
  const modeCodeMap = {
    "Monomode OS2": "OS2",
    "Multimode OM1": "M1",
    "Multimode OM2": "M2",
    "Multimode OM3": "M3",
    "Multimode OM4": "M4",
    "Multimode OM5": "M5",
  };
  const modeCode = modeCodeMap[selectedOptions.modeFibre];
  testConnectors.push(modeCode);

  const connectorA = selectedOptions.connecteurA;
  const connectorB = selectedOptions.connecteurB;
  testConnectors.push(`${connectorA}/${connectorB}`);

  testConnectors.push(selectedOptions.longueur);

  const testCode = selectedOptions.typeTest === "Photométrie" ? "P" : "R";
  testConnectors.push(testCode);

  refParts.push(testConnectors.join(""));

  return refParts.join("-");
};

// Fonction pour décoder une référence et retourner les options
export const parseReference = (reference) => {
  if (!reference || typeof reference !== "string") {
    return null;
  }

  try {
    // Nettoyer la référence (retirer les espaces)
    const cleanRef = reference.trim().toUpperCase();

    // Vérifier le format de base (doit contenir un tiret)
    if (!cleanRef.includes("-")) {
      return null;
    }

    // Séparer en deux parties : câble et config
    const [cablePart, configPart] = cleanRef.split("-");

    // Mappings inversés
    const cableCodeReverse = {
      FSD0H: "Standard LSZH",
      FRF0H: "Renforcé LSZH",
      FSLPE: "Standard PE",
      FAA0H: "Armé Acier LSZH",
      FAAPE: "Armé Acier PE",
    };

    const modeCodeReverse = {
      OS2: "Monomode OS2",
      M1: "Multimode OM1",
      M2: "Multimode OM2",
      M3: "Multimode OM3",
      M4: "Multimode OM4",
      M5: "Multimode OM5",
    };

    const testCodeReverse = {
      P: "Photométrie",
      R: "Réflectométrie",
    };

    // Parser la partie câble (ex: T12FSD0H)
    if (!cablePart.startsWith("T")) {
      return null;
    }

    // Extraire le nombre de fibres (après le T, avant le code câble)
    // Les codes câbles sont : FSD0H, FRF0H, FSLPE, FAA0H, FAAPE
    let nombreFibres = null;
    let typeCable = null;

    // Essayer chaque code de câble pour trouver le bon
    for (const [code, type] of Object.entries(cableCodeReverse)) {
      if (cablePart.endsWith(code)) {
        typeCable = type;
        // Extraire les chiffres entre T et le code
        const fiberStr = cablePart.slice(1, cablePart.length - code.length);
        nombreFibres = fiberStr;
        break;
      }
    }

    if (!nombreFibres || !typeCable) {
      return null;
    }

    // Parser la partie config (ex: OS2LC/LC50P)
    // Format: {mode}{connA}/{connB}{longueur}{test}

    // Extraire le mode (OS2, M1, M2, etc.)
    let modeFibre = null;
    let restOfConfig = configPart;

    for (const [code, mode] of Object.entries(modeCodeReverse)) {
      if (configPart.startsWith(code)) {
        modeFibre = mode;
        restOfConfig = configPart.slice(code.length);
        break;
      }
    }

    if (!modeFibre) {
      return null;
    }

    // Extraire les connecteurs (format: XX/YY ou XXX/YYY pour SC/APC)
    // Les connecteurs possibles : LC, SC, ST, SCA (SC/APC)
    // IMPORTANT : SCA doit être avant SC pour éviter les matchs partiels
    const connectorMatch = restOfConfig.match(
      /^(SCA|LC|SC|ST)\/(SCA|LC|SC|ST)/
    );
    if (!connectorMatch) {
      return null;
    }

    const connecteurA = connectorMatch[1];
    const connecteurB = connectorMatch[2];

    // Extraire la longueur et le test (ex: 50P)
    const afterConnectors = restOfConfig.slice(connectorMatch[0].length);

    // Le test est le dernier caractère (P ou R)
    const testCode = afterConnectors.slice(-1);
    const typeTest = testCodeReverse[testCode];

    if (!typeTest) {
      return null;
    }

    // La longueur est tout ce qui est entre les connecteurs et le test
    const longueur = afterConnectors.slice(0, -1);

    if (!longueur || isNaN(longueur)) {
      return null;
    }

    // Déterminer l'épanouissement par défaut
    // Pour Standard PE, Armé Acier PE et Armé Acier LSZH : toujours Regainé
    let epanouissement = "";
    if (
      typeCable === "Standard PE" ||
      typeCable === "Armé Acier PE" ||
      typeCable === "Armé Acier LSZH"
    ) {
      epanouissement = "Regainé (2,8 mm)";
    }

    // Retourner les options
    return {
      connecteurA,
      connecteurB,
      nombreFibres,
      modeFibre,
      typeCable,
      longueur,
      epanouissement,
      typeTest,
      quantite: "1",
    };
  } catch (error) {
    console.error("Erreur lors du parsing de la référence:", error);
    return null;
  }
};
