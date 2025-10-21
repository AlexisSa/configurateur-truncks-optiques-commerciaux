import jsPDF from "jspdf";
import {
  generateReference,
  calculatePrice,
  getPriceBreakdown,
} from "./calculations.js";

// Fonction pour générer un PDF natif de haute qualité
export const generateNativePdf = async (selectedOptions, margin = 60) => {
  if (!selectedOptions) {
    throw new Error("Configuration manquante");
  }

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;
  const pageHeight = 297;
  
  const date = new Date().toLocaleDateString("fr-FR");
  const reference = generateReference(selectedOptions);
  const price = calculatePrice(selectedOptions, margin);
  const priceBreakdown = getPriceBreakdown(selectedOptions, margin);
  const quantity = parseInt(selectedOptions.quantite) || 1;
  const unitPrice = price && quantity > 1 ? price / quantity : null;

  // Couleurs
  const primaryColor = [54, 59, 199]; // #363bc7
  const textColor = [51, 51, 51]; // #333
  const lightGray = [102, 102, 102]; // #666
  const bgGray = [248, 249, 250]; // #f8f9fa

  let yPos = 20;

  // ===== EN-TÊTE =====
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, pageWidth, 35, "F");

  // Titre
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text("Configurateur de Truncks Optiques", pageWidth / 2, 15, {
    align: "center",
  });

  // Sous-titre
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    `Devis technique généré le ${date} | Référence: ${reference}`,
    pageWidth / 2,
    22,
    { align: "center" }
  );
  pdf.text(
    "Spécialiste en solutions optiques professionnelles",
    pageWidth / 2,
    27,
    { align: "center" }
  );

  yPos = 45;

  // ===== SECTION RÉSULTATS =====
  pdf.setTextColor(...primaryColor);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Résultats de la configuration", 20, yPos);

  yPos += 10;

  // Boîtes avec bordures
  const boxWidth = (pageWidth - 50) / 2;
  const boxHeight = 20;

  // Référence
  pdf.setFillColor(...bgGray);
  pdf.rect(20, yPos - 5, boxWidth, boxHeight, "F");
  pdf.setDrawColor(200, 200, 200);
  pdf.rect(20, yPos - 5, boxWidth, boxHeight);

  pdf.setTextColor(...textColor);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text("📋 Référence à commander", 25, yPos);
  
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...primaryColor);
  pdf.text(reference, 25, yPos + 8);

  // Prix
  pdf.setFillColor(...bgGray);
  pdf.rect(25 + boxWidth, yPos - 5, boxWidth, boxHeight, "F");
  pdf.setDrawColor(200, 200, 200);
  pdf.rect(25 + boxWidth, yPos - 5, boxWidth, boxHeight);

  pdf.setTextColor(...textColor);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text("💰 Prix HT", 30 + boxWidth, yPos);
  
  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...primaryColor);
  pdf.text(`${price} €`, 30 + boxWidth, yPos + 8);

  yPos += 30;

  // Prix à l'unité si quantité > 1
  if (unitPrice) {
    pdf.setFillColor(248, 250, 252);
    pdf.rect(20, yPos - 5, pageWidth - 40, 15, "F");
    pdf.setDrawColor(203, 213, 225);
    pdf.rect(20, yPos - 5, pageWidth - 40, 15);

    pdf.setTextColor(...textColor);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `📦 Prix à l'unité (${quantity} produits)`,
      25,
      yPos + 2
    );
    
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${unitPrice.toFixed(2)} €`, 25, yPos + 8);

    yPos += 20;
  }

  // Délai de fabrication
  pdf.setFillColor(...bgGray);
  pdf.rect(20, yPos - 5, pageWidth - 40, 12, "F");
  pdf.setDrawColor(200, 200, 200);
  pdf.rect(20, yPos - 5, pageWidth - 40, 12);

  pdf.setTextColor(...textColor);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text("📦 Délai de fabrication", 25, yPos);
  
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(5, 150, 105);
  pdf.text("Environ 1 semaine", 80, yPos);

  yPos += 20;

  // ===== RÉSUMÉ CONFIGURATION =====
  pdf.setTextColor(...primaryColor);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Résumé de la configuration", 20, yPos);

  yPos += 8;

  pdf.setFillColor(...bgGray);
  pdf.rect(20, yPos - 3, pageWidth - 40, 18, "F");
  pdf.setDrawColor(200, 200, 200);
  pdf.rect(20, yPos - 3, pageWidth - 40, 18);

  pdf.setTextColor(...textColor);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  
  const summary = `Trunck : ${selectedOptions.connecteurA}/${selectedOptions.connecteurB} ${selectedOptions.nombreFibres} Fibres ${selectedOptions.modeFibre} ${selectedOptions.typeCable} de ${selectedOptions.longueur}m avec test de ${selectedOptions.typeTest}`;
  
  const lines = pdf.splitTextToSize(summary, pageWidth - 50);
  lines.forEach((line, index) => {
    pdf.text(line, 25, yPos + 4 + index * 5);
  });

  yPos += 25;

  // ===== SPÉCIFICATIONS TECHNIQUES =====
  pdf.setTextColor(...primaryColor);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Spécifications techniques détaillées", 20, yPos);

  yPos += 10;

  const specs = [
    { icon: "🔌", title: "Connecteurs", color: [54, 59, 199] },
    { icon: "📡", title: "Fibres optiques", color: [5, 150, 105] },
    { icon: "🔗", title: "Câble", color: [220, 38, 38] },
    { icon: "🧪", title: "Tests & Qualité", color: [234, 88, 12] },
  ];

  const boxW = (pageWidth - 50) / 2;
  const boxH = 30;

  specs.forEach((spec, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 20 + col * (boxW + 5);
    const y = yPos + row * (boxH + 5);

    // Fond
    pdf.setFillColor(...bgGray);
    pdf.rect(x, y - 3, boxW, boxH, "F");
    
    // Bordure gauche colorée
    pdf.setFillColor(...spec.color);
    pdf.rect(x, y - 3, 3, boxH, "F");
    
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(x, y - 3, boxW, boxH);

    // Titre
    pdf.setTextColor(...spec.color);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${spec.icon} ${spec.title}`, x + 8, y + 3);

    // Contenu
    pdf.setTextColor(...textColor);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");

    if (index === 0) {
      pdf.text(`Connecteur A : ${selectedOptions.connecteurA}`, x + 8, y + 10);
      pdf.text(`Connecteur B : ${selectedOptions.connecteurB}`, x + 8, y + 15);
    } else if (index === 1) {
      pdf.text(`Nombre : ${selectedOptions.nombreFibres} fibres`, x + 8, y + 10);
      pdf.text(`Mode : ${selectedOptions.modeFibre}`, x + 8, y + 15);
    } else if (index === 2) {
      pdf.text(`Type : ${selectedOptions.typeCable}`, x + 8, y + 10);
      pdf.text(`Longueur : ${selectedOptions.longueur}m`, x + 8, y + 15);
    } else if (index === 3) {
      pdf.text(`Test : ${selectedOptions.typeTest}`, x + 8, y + 10);
      pdf.text(`Épanouissement : ${selectedOptions.epanouissement}`, x + 8, y + 15);
    }
  });

  yPos += 75;

  // ===== INFORMATIONS COMPLÉMENTAIRES =====
  pdf.setTextColor(...primaryColor);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Informations complémentaires", 20, yPos);

  yPos += 10;

  // Performance
  pdf.setFillColor(240, 249, 255);
  pdf.rect(20, yPos - 3, pageWidth - 40, 25, "F");
  pdf.setFillColor(2, 132, 199);
  pdf.rect(20, yPos - 3, 3, 25, "F");
  pdf.setDrawColor(186, 230, 253);
  pdf.rect(20, yPos - 3, pageWidth - 40, 25);

  pdf.setTextColor(2, 132, 199);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("⚡ Performance", 28, yPos + 3);

  pdf.setTextColor(...textColor);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text("• Bande passante optimisée", 28, yPos + 9);
  pdf.text("• Faibles pertes d'insertion", 28, yPos + 14);
  pdf.text("• Compatible normes internationales", 28, yPos + 19);

  yPos += 35;

  // ===== CONTACT =====
  pdf.setTextColor(...primaryColor);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("Nous contacter", pageWidth / 2, yPos, { align: "center" });

  yPos += 8;

  const contactBoxW = (pageWidth - 50) / 3;
  const contacts = [
    { icon: "📞", title: "Téléphone", info: "03.65.61.04.20" },
    { icon: "✉️", title: "Email", info: "info.xeilom@xeilom.fr" },
    { icon: "🌐", title: "Site web", info: "xeilom.fr" },
  ];

  contacts.forEach((contact, index) => {
    const x = 20 + index * (contactBoxW + 5);
    
    pdf.setFillColor(...bgGray);
    pdf.rect(x, yPos - 3, contactBoxW, 18, "F");
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(x, yPos - 3, contactBoxW, 18);

    pdf.setTextColor(...textColor);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${contact.icon} ${contact.title}`, x + contactBoxW / 2, yPos + 3, {
      align: "center",
    });

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...lightGray);
    pdf.text(contact.info, x + contactBoxW / 2, yPos + 10, {
      align: "center",
    });
  });

  yPos += 25;

  // ===== PIED DE PAGE =====
  pdf.setDrawColor(221, 221, 221);
  pdf.line(20, yPos, pageWidth - 20, yPos);

  yPos += 5;

  pdf.setTextColor(153, 153, 153);
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    "Ce devis est valable 30 jours à compter de sa date de génération",
    pageWidth / 2,
    yPos,
    { align: "center" }
  );
  pdf.text(
    "Tous nos produits sont conformes aux normes CE et aux standards internationaux",
    pageWidth / 2,
    yPos + 4,
    { align: "center" }
  );
  pdf.text(
    "Conditions de vente disponibles sur demande | SIRET: 521 756 502 00030",
    pageWidth / 2,
    yPos + 8,
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
    
    // Convertir le PDF en data URL pour l'affichage
    const pdfDataUri = pdf.output("dataurlstring");
    
    return pdfDataUri;
  } catch (error) {
    console.error("Erreur lors de la génération de la prévisualisation:", error);
    throw error;
  }
};

