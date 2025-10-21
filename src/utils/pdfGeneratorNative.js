import jsPDF from "jspdf";
import {
  generateReference,
  calculatePrice,
  getPriceBreakdown,
} from "./calculations.js";

// Fonction pour dessiner une boîte arrondie
const drawRoundedRect = (pdf, x, y, w, h, r) => {
  pdf.roundedRect(x, y, w, h, r, r, "S");
};

// Fonction pour dessiner une boîte arrondie remplie
const drawFilledRoundedRect = (pdf, x, y, w, h, r, fillColor) => {
  pdf.setFillColor(...fillColor);
  pdf.roundedRect(x, y, w, h, r, r, "F");
};

// Fonction pour générer un PDF natif identique au design HTML
export const generateNativePdf = async (selectedOptions, margin = 60) => {
  if (!selectedOptions) {
    throw new Error("Configuration manquante");
  }

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;
  
  const date = new Date().toLocaleDateString("fr-FR");
  const reference = generateReference(selectedOptions);
  const price = calculatePrice(selectedOptions, margin);
  const priceBreakdown = getPriceBreakdown(selectedOptions, margin);
  const quantity = parseInt(selectedOptions.quantite) || 1;
  const unitPrice = price && quantity > 1 ? price / quantity : null;

  // Couleurs exactes du design
  const colors = {
    primary: [54, 59, 199], // #363bc7
    text: [51, 51, 51], // #333
    textGray: [102, 102, 102], // #666
    textLightGray: [153, 153, 153], // #999
    bgGray: [248, 249, 250], // #f8f9fa
    border: [221, 221, 221], // #ddd
    green: [5, 150, 105], // #059669
    red: [220, 38, 38], // #dc2626
    orange: [234, 88, 12], // #ea580c
    blue: [2, 132, 199], // #0284c7
    lightBlue: [240, 249, 255], // #f0f9ff
    gradientGray1: [248, 250, 252], // #f8fafc
    gradientGray2: [226, 232, 240], // #e2e8f0
    borderLight: [203, 213, 225], // #cbd5e1
  };

  let y = 15;
  const leftMargin = 20;
  const rightMargin = 20;
  const contentWidth = pageWidth - leftMargin - rightMargin;

  // ===== EN-TÊTE =====
  // Logo (si disponible)
  try {
    const logoImg = new Image();
    logoImg.src = '/logo.png';
    await new Promise((resolve) => {
      logoImg.onload = () => {
        pdf.addImage(logoImg, 'PNG', pageWidth / 2 - 10, y, 20, 8);
        resolve();
      };
      logoImg.onerror = () => resolve(); // Continue sans logo si erreur
      setTimeout(resolve, 100); // Timeout après 100ms
    });
    y += 10;
  } catch (error) {
    // Continue sans logo
    y += 2;
  }

  // Titre principal
  pdf.setTextColor(...colors.primary);
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text("Configurateur de Truncks Optiques", pageWidth / 2, y, {
    align: "center",
  });

  y += 5;

  // Sous-titre 1
  pdf.setTextColor(...colors.textGray);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    `Devis technique genere le ${date} | Reference: ${reference}`,
    pageWidth / 2,
    y,
    { align: "center" }
  );

  y += 3.5;

  // Sous-titre 2
  pdf.setTextColor(...colors.textLightGray);
  pdf.setFontSize(10);
  pdf.text(
    "Specialiste en solutions optiques professionnelles",
    pageWidth / 2,
    y,
    { align: "center" }
  );

  y += 3;

  // Bordure en bas
  pdf.setDrawColor(...colors.primary);
  pdf.setLineWidth(0.5);
  pdf.line(leftMargin, y, pageWidth - rightMargin, y);

  y += 10;

  // ===== SECTION: RÉSULTATS DE LA CONFIGURATION =====
  pdf.setTextColor(...colors.primary);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Résultats de la configuration", leftMargin, y);

  // Ligne sous le titre
  pdf.setDrawColor(...colors.border);
  pdf.setLineWidth(0.3);
  pdf.line(leftMargin, y + 1, pageWidth - rightMargin, y + 1);

  y += 9;

  // Boîte Référence et Prix (2 colonnes)
  const boxWidth = (contentWidth - 3) / 2;
  const boxHeight = 13;

  // Boîte Référence (gauche)
  pdf.setFillColor(...colors.bgGray);
  pdf.roundedRect(leftMargin, y, boxWidth, boxHeight, 1.5, 1.5, "F");
  
  // Bordure gauche colorée
  pdf.setFillColor(...colors.primary);
  pdf.roundedRect(leftMargin, y, 0.6, boxHeight, 0, 0, "F");
  
  pdf.setDrawColor(230, 230, 230);
  pdf.setLineWidth(0.1);
  pdf.roundedRect(leftMargin, y, boxWidth, boxHeight, 1.5, 1.5, "S");

  pdf.setTextColor(...colors.text);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text("Reference a commander", leftMargin + 3, y + 4);

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...colors.primary);
  pdf.setFont("courier", "bold"); // Monospace
  pdf.text(reference, leftMargin + 3, y + 9.5);

  // Boîte Prix (droite)
  pdf.setFont("helvetica", "normal");
  const rightBoxX = leftMargin + boxWidth + 3;
  
  pdf.setFillColor(...colors.bgGray);
  pdf.roundedRect(rightBoxX, y, boxWidth, boxHeight, 1.5, 1.5, "F");
  
  pdf.setFillColor(...colors.primary);
  pdf.roundedRect(rightBoxX, y, 0.6, boxHeight, 0, 0, "F");
  
  pdf.setDrawColor(230, 230, 230);
  pdf.roundedRect(rightBoxX, y, boxWidth, boxHeight, 1.5, 1.5, "S");

  pdf.setTextColor(...colors.text);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text("Prix HT", rightBoxX + 3, y + 4);

  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...colors.primary);
  pdf.text(`${price} €`, rightBoxX + 3, y + 9.5);

  y += boxHeight + 5;

  // Prix à l'unité (si quantité > 1)
  if (unitPrice) {
    const unitBoxHeight = 13;
    
    // Fond avec gradient simulé
    pdf.setFillColor(...colors.gradientGray1);
    pdf.roundedRect(leftMargin, y, contentWidth, unitBoxHeight, 1.5, 1.5, "F");
    
    pdf.setDrawColor(...colors.borderLight);
    pdf.setLineWidth(0.3);
    pdf.roundedRect(leftMargin, y, contentWidth, unitBoxHeight, 1.5, 1.5, "S");

    pdf.setTextColor(...colors.textGray);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `Prix a l'unite (${quantity} produits)`,
      leftMargin + 3,
      y + 4
    );

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...colors.text);
    pdf.text(`${unitPrice.toFixed(2)} €`, leftMargin + 3, y + 9.5);

    y += unitBoxHeight + 5;
  }

  // Boîte Délai de fabrication
  const delaiBoxHeight = 13;
  
  pdf.setFillColor(...colors.bgGray);
  pdf.roundedRect(leftMargin, y, contentWidth, delaiBoxHeight, 1.5, 1.5, "F");
  
  pdf.setFillColor(...colors.green);
  pdf.roundedRect(leftMargin, y, 0.6, delaiBoxHeight, 0, 0, "F");
  
  pdf.setDrawColor(230, 230, 230);
  pdf.setLineWidth(0.1);
  pdf.roundedRect(leftMargin, y, contentWidth, delaiBoxHeight, 1.5, 1.5, "S");

  pdf.setTextColor(...colors.text);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text("Delai de fabrication", leftMargin + 3, y + 4);

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...colors.green);
  pdf.text("Environ 1 semaine", leftMargin + 3, y + 9.5);

  y += delaiBoxHeight + 10;

  // ===== SECTION: RÉSUMÉ DE LA CONFIGURATION =====
  pdf.setTextColor(...colors.primary);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Résumé de la configuration", leftMargin, y);

  pdf.setDrawColor(...colors.border);
  pdf.setLineWidth(0.3);
  pdf.line(leftMargin, y + 1, pageWidth - rightMargin, y + 1);

  y += 9;

  // Boîte résumé
  const summaryHeight = 13;
  
  pdf.setFillColor(...colors.bgGray);
  pdf.roundedRect(leftMargin, y, contentWidth, summaryHeight, 1.5, 1.5, "F");
  
  pdf.setDrawColor(230, 230, 230);
  pdf.setLineWidth(0.1);
  pdf.roundedRect(leftMargin, y, contentWidth, summaryHeight, 1.5, 1.5, "S");

  pdf.setTextColor(...colors.text);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  
  const summary = `Trunck : ${selectedOptions.connecteurA}/${selectedOptions.connecteurB} ${selectedOptions.nombreFibres} Fibres ${selectedOptions.modeFibre} ${selectedOptions.typeCable} de ${selectedOptions.longueur}m avec test de ${selectedOptions.typeTest}`;
  
  const summaryLines = pdf.splitTextToSize(summary, contentWidth - 6);
  let summaryY = y + 5;
  summaryLines.forEach((line) => {
    pdf.text(line, leftMargin + 3, summaryY);
    summaryY += 4;
  });

  y += summaryHeight + 10;

  // ===== SECTION: SPÉCIFICATIONS TECHNIQUES =====
  pdf.setTextColor(...colors.primary);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Spécifications techniques détaillées", leftMargin, y);

  pdf.setDrawColor(...colors.border);
  pdf.setLineWidth(0.3);
  pdf.line(leftMargin, y + 1, pageWidth - rightMargin, y + 1);

  y += 9;

  // 4 boîtes en grille 2x2
  const specBoxWidth = (contentWidth - 4) / 2;
  const specBoxHeight = 22;
  const specGap = 4;

  const specs = [
    {
      title: "Connecteurs",
      color: colors.primary,
      items: [
        `Connecteur A : ${selectedOptions.connecteurA}`,
        `Connecteur B : ${selectedOptions.connecteurB}`,
      ],
      note: "Type standardise pour compatibilite maximale",
    },
    {
      title: "Fibres optiques",
      color: colors.green,
      items: [
        `Nombre : ${selectedOptions.nombreFibres} fibres`,
        `Mode : ${selectedOptions.modeFibre}`,
      ],
      note: "Performance optimisee selon l'application",
    },
    {
      title: "Cable",
      color: colors.red,
      items: [
        `Type : ${selectedOptions.typeCable}`,
        `Longueur : ${selectedOptions.longueur}m`,
      ],
      note: "Resistance mecanique et environnementale",
    },
    {
      title: "Tests & Qualite",
      color: colors.orange,
      items: [
        `Test : ${selectedOptions.typeTest}`,
        `Epanouissement : ${selectedOptions.epanouissement}`,
      ],
      note: "Controle qualite rigoureux",
    },
  ];

  specs.forEach((spec, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const specX = leftMargin + col * (specBoxWidth + specGap);
    const specY = y + row * (specBoxHeight + specGap);

    // Fond
    pdf.setFillColor(...colors.bgGray);
    pdf.roundedRect(specX, specY, specBoxWidth, specBoxHeight, 1.5, 1.5, "F");

    // Bordure gauche colorée
    pdf.setFillColor(...spec.color);
    pdf.roundedRect(specX, specY, 0.8, specBoxHeight, 0, 0, "F");

    pdf.setDrawColor(230, 230, 230);
    pdf.setLineWidth(0.1);
    pdf.roundedRect(specX, specY, specBoxWidth, specBoxHeight, 1.5, 1.5, "S");

    // Titre
    pdf.setTextColor(...spec.color);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(spec.title, specX + 3, specY + 5);

    // Items
    pdf.setTextColor(...colors.text);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    
    let itemY = specY + 10;
    spec.items.forEach((item) => {
      const parts = item.split(" : ");
      if (parts.length === 2) {
        pdf.setFont("helvetica", "bold");
        const labelWidth = pdf.getTextWidth(parts[0] + " : ");
        pdf.text(parts[0] + " : ", specX + 3, itemY);
        pdf.setFont("helvetica", "normal");
        pdf.text(parts[1], specX + 3 + labelWidth, itemY);
      } else {
        pdf.text(item, specX + 3, itemY);
      }
      itemY += 3.5;
    });

    // Note
    pdf.setTextColor(...colors.textGray);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text(spec.note, specX + 3, specY + specBoxHeight - 3);
  });

  y += (specBoxHeight + specGap) * 2 + 5;

  // ===== SECTION: INFORMATIONS COMPLÉMENTAIRES =====
  pdf.setTextColor(...colors.primary);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Informations complémentaires", leftMargin, y);

  pdf.setDrawColor(...colors.border);
  pdf.setLineWidth(0.3);
  pdf.line(leftMargin, y + 1, pageWidth - rightMargin, y + 1);

  y += 9;

  // Boîte Performance
  const perfBoxHeight = 20;
  
  pdf.setFillColor(...colors.lightBlue);
  pdf.roundedRect(leftMargin, y, contentWidth, perfBoxHeight, 1.5, 1.5, "F");

  pdf.setFillColor(...colors.blue);
  pdf.roundedRect(leftMargin, y, 0.8, perfBoxHeight, 0, 0, "F");

  pdf.setDrawColor(186, 230, 253);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(leftMargin, y, contentWidth, perfBoxHeight, 1.5, 1.5, "S");

  pdf.setTextColor(...colors.blue);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("Performance", leftMargin + 3, y + 5);

  pdf.setTextColor(...colors.text);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text("- Bande passante optimisee", leftMargin + 3, y + 10);
  pdf.text("- Faibles pertes d'insertion", leftMargin + 3, y + 14);
  pdf.text("- Compatible normes internationales", leftMargin + 3, y + 18);

  y += perfBoxHeight + 10;

  // ===== SECTION: CONTACT =====
  pdf.setDrawColor(...colors.border);
  pdf.setLineWidth(0.5);
  pdf.line(leftMargin, y, pageWidth - rightMargin, y);

  y += 6;

  pdf.setTextColor(...colors.primary);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("Nous contacter", pageWidth / 2, y, { align: "center" });

  y += 7;

  // 3 boîtes de contact
  const contactBoxWidth = (contentWidth - 20) / 3;
  const contactBoxHeight = 14;
  const maxContactWidth = 130;
  const startX = leftMargin + (contentWidth - maxContactWidth) / 2;

  const contacts = [
    { title: "Telephone", info: "03.65.61.04.20" },
    { title: "Email", info: "info.xeilom@xeilom.fr" },
    { title: "Site web", info: "xeilom.fr" },
  ];

  contacts.forEach((contact, index) => {
    const contactX = startX + index * (contactBoxWidth + 4);

    pdf.setFillColor(...colors.bgGray);
    pdf.roundedRect(contactX, y, contactBoxWidth, contactBoxHeight, 1.5, 1.5, "F");

    pdf.setDrawColor(230, 230, 230);
    pdf.setLineWidth(0.1);
    pdf.roundedRect(contactX, y, contactBoxWidth, contactBoxHeight, 1.5, 1.5, "S");

    pdf.setTextColor(...colors.text);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text(
      contact.title,
      contactX + contactBoxWidth / 2,
      y + 5,
      { align: "center" }
    );

    pdf.setTextColor(...colors.textGray);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text(contact.info, contactX + contactBoxWidth / 2, y + 10, {
      align: "center",
    });
  });

  y += contactBoxHeight + 10;

  // ===== FOOTER =====
  pdf.setDrawColor(...colors.border);
  pdf.setLineWidth(0.3);
  pdf.line(leftMargin, y, pageWidth - rightMargin, y);

  y += 5;

  pdf.setTextColor(...colors.textLightGray);
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  
  pdf.text(
    "Ce devis est valable 30 jours à compter de sa date de génération",
    pageWidth / 2,
    y,
    { align: "center" }
  );
  
  pdf.text(
    "Tous nos produits sont conformes aux normes CE et aux standards internationaux",
    pageWidth / 2,
    y + 3,
    { align: "center" }
  );
  
  pdf.text(
    "Conditions de vente disponibles sur demande | SIRET: 521 756 502 00030",
    pageWidth / 2,
    y + 6,
    { align: "center" }
  );

  return pdf;
};

// Fonction pour exporter en PDF natif (téléchargement)
export const exportToNativePDF = async (selectedOptions, margin = 60) => {
  if (!selectedOptions) {
    alert("Veuillez compléter la configuration avant d'exporter");
    return;
  }

  try {
    const pdf = await generateNativePdf(selectedOptions, margin);
    const date = new Date().toLocaleDateString("fr-FR").replace(/\//g, "-");
    const reference = generateReference(selectedOptions);
    const fileName = `trunck-optique-${reference}-${date}.pdf`;
    
    pdf.save(fileName);
  } catch (error) {
    console.error("Erreur lors de l'export PDF natif:", error);
    alert("Erreur lors de l'export PDF. Veuillez réessayer.");
  }
};

// Fonction pour générer une prévisualisation du PDF natif
export const generateNativePdfPreview = async (selectedOptions, margin = 60) => {
  try {
    const pdf = await generateNativePdf(selectedOptions, margin);
    const pdfDataUri = pdf.output("dataurlstring");
    return pdfDataUri;
  } catch (error) {
    console.error("Erreur lors de la génération de la prévisualisation:", error);
    throw error;
  }
};
