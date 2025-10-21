import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  generateReference,
  calculatePrice,
  getPriceBreakdown,
} from "./calculations.js";

// Fonction pour générer la prévisualisation PDF
export const generatePdfPreview = async (selectedOptions, margin = 60) => {
  if (!selectedOptions) {
    alert("Veuillez compléter la configuration avant de prévisualiser");
    return null;
  }

  const pdfContent = document.createElement("div");
  pdfContent.style.position = "absolute";
  pdfContent.style.left = "-9999px";
  pdfContent.style.top = "0";
  pdfContent.style.width = "595px";
  pdfContent.style.height = "842px";
  pdfContent.style.padding = "40px";
  pdfContent.style.fontFamily = "Arial, sans-serif";
  pdfContent.style.backgroundColor = "white";
  pdfContent.style.color = "black";
  pdfContent.style.fontSize = "13px";
  pdfContent.style.lineHeight = "1.4";
  pdfContent.style.boxSizing = "border-box";
  pdfContent.style.overflow = "hidden";

  const date = new Date().toLocaleDateString("fr-FR");

  pdfContent.innerHTML = `
    <div style="text-align: center; margin-bottom: 15px; border-bottom: 2px solid #363bc7; padding-bottom: 8px;">
      <div style="margin-bottom: 10px;">
        <img src="/logo.png" alt="XEILOM Logo" style="height: 40px; object-fit: contain;" />
      </div>
      <div style="margin-bottom: 5px;">
        <h1 style="color: #363bc7; margin: 0; font-size: 18px;">Configurateur de Truncks Optiques</h1>
      </div>
      <p style="color: #666; margin: 3px 0 0 0; font-size: 11px;">Devis technique généré le ${date} | Référence: ${generateReference(
    selectedOptions
  )}</p>
      <p style="color: #999; margin: 2px 0 0 0; font-size: 10px;">Spécialiste en solutions optiques professionnelles</p>
    </div>

    <div style="margin-bottom: 15px;">
      <h2 style="color: #363bc7; border-bottom: 1px solid #ddd; padding-bottom: 3px; margin-bottom: 8px; font-size: 12px;">Résultats de la configuration</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
        <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; border-left: 2px solid #363bc7;">
          <h3 style="margin: 0 0 3px 0; color: #333; font-size: 9px;">📋 Référence à commander</h3>
          <p style="margin: 0; font-size: 11px; font-weight: bold; color: #363bc7; font-family: monospace;">${generateReference(
            selectedOptions
          )}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; border-left: 2px solid #363bc7;">
          <h3 style="margin: 0 0 3px 0; color: #333; font-size: 9px;">💰 Prix HT</h3>
          <p style="margin: 0; font-size: 13px; font-weight: bold; color: #363bc7;">${
            calculatePrice(selectedOptions, margin)
              ? `${calculatePrice(selectedOptions, margin)} €`
              : "Configuration incomplète"
          }</p>
        </div>
      </div>

      ${(() => {
        const priceBreakdown = getPriceBreakdown(selectedOptions, margin);
        const quantity = priceBreakdown?.quantity?.value || 1;
        const totalPrice = calculatePrice(selectedOptions, margin);
        const unitPrice =
          totalPrice && quantity > 1 ? totalPrice / quantity : null;

        if (unitPrice) {
          return `
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 8px; border-radius: 4px; border: 1px solid #cbd5e1; margin-bottom: 10px;">
              <h3 style="margin: 0 0 3px 0; color: #666; font-size: 9px;">📦 Prix à l'unité (${quantity} produits)</h3>
              <p style="margin: 0; font-size: 11px; font-weight: 600; color: #333;">${unitPrice.toFixed(
                2
              )} €</p>
            </div>
          `;
        }
        return "";
      })()}

      <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; border-left: 2px solid #059669;">
        <h3 style="margin: 0 0 3px 0; color: #333; font-size: 9px;">📦 Délai de fabrication</h3>
        <p style="margin: 0; font-size: 11px; font-weight: bold; color: #059669;">Environ 1 semaine</p>
      </div>
    </div>

    <div style="margin-bottom: 15px;">
      <h2 style="color: #363bc7; border-bottom: 1px solid #ddd; padding-bottom: 3px; margin-bottom: 8px; font-size: 12px;">Résumé de la configuration</h2>
      <div style="background: #f8f9fa; padding: 8px; border-radius: 4px;">
        <p style="margin: 0; font-size: 10px; line-height: 1.3;">
          <strong>Trunck :</strong> ${selectedOptions.connecteurA}/${
    selectedOptions.connecteurB
  } ${selectedOptions.nombreFibres} Fibres ${selectedOptions.modeFibre} ${
    selectedOptions.typeCable
  } de ${selectedOptions.longueur}m avec test de ${selectedOptions.typeTest}
        </p>
      </div>
    </div>

    <div style="margin-bottom: 15px;">
      <h2 style="color: #363bc7; border-bottom: 1px solid #ddd; padding-bottom: 3px; margin-bottom: 8px; font-size: 12px;">Spécifications techniques détaillées</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; border-left: 3px solid #363bc7;">
          <h4 style="margin: 0 0 6px 0; color: #363bc7; font-size: 10px;">🔌 Connecteurs</h4>
          <div style="font-size: 9px; line-height: 1.3;">
            <div style="margin-bottom: 3px;"><strong>Connecteur A :</strong> ${
              selectedOptions.connecteurA
            }</div>
            <div style="margin-bottom: 3px;"><strong>Connecteur B :</strong> ${
              selectedOptions.connecteurB
            }</div>
            <div style="color: #666; font-size: 8px;">Type standardisé pour compatibilité maximale</div>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; border-left: 3px solid #059669;">
          <h4 style="margin: 0 0 6px 0; color: #059669; font-size: 10px;">📡 Fibres optiques</h4>
          <div style="font-size: 9px; line-height: 1.3;">
            <div style="margin-bottom: 3px;"><strong>Nombre :</strong> ${
              selectedOptions.nombreFibres
            } fibres</div>
            <div style="margin-bottom: 3px;"><strong>Mode :</strong> ${
              selectedOptions.modeFibre
            }</div>
            <div style="color: #666; font-size: 8px;">Performance optimisée selon l'application</div>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; border-left: 3px solid #dc2626;">
          <h4 style="margin: 0 0 6px 0; color: #dc2626; font-size: 10px;">🔗 Câble</h4>
          <div style="font-size: 9px; line-height: 1.3;">
            <div style="margin-bottom: 3px;"><strong>Type :</strong> ${
              selectedOptions.typeCable
            }</div>
            <div style="margin-bottom: 3px;"><strong>Longueur :</strong> ${
              selectedOptions.longueur
            }m</div>
            <div style="color: #666; font-size: 8px;">Résistance mécanique et environnementale</div>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; border-left: 3px solid #ea580c;">
          <h4 style="margin: 0 0 6px 0; color: #ea580c; font-size: 10px;">🧪 Tests & Qualité</h4>
          <div style="font-size: 9px; line-height: 1.3;">
            <div style="margin-bottom: 3px;"><strong>Test :</strong> ${
              selectedOptions.typeTest
            }</div>
            <div style="margin-bottom: 3px;"><strong>Épanouissement :</strong> ${
              selectedOptions.epanouissement
            }</div>
            <div style="color: #666; font-size: 8px;">Contrôle qualité rigoureux</div>
          </div>
        </div>
      </div>
    </div>

    <div style="margin-bottom: 15px;">
      <h2 style="color: #363bc7; border-bottom: 1px solid #ddd; padding-bottom: 3px; margin-bottom: 8px; font-size: 12px;">Informations complémentaires</h2>
      
      <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
        <div style="background: #f0f9ff; padding: 8px; border-radius: 4px; border-left: 3px solid #0284c7;">
          <h4 style="margin: 0 0 6px 0; color: #0284c7; font-size: 10px;">⚡ Performance</h4>
          <div style="font-size: 9px; line-height: 1.3;">
            <div style="margin-bottom: 3px;">• Bande passante optimisée</div>
            <div style="margin-bottom: 3px;">• Faibles pertes d'insertion</div>
            <div style="margin-bottom: 3px;">• Compatible normes internationales</div>
          </div>
        </div>
      </div>
    </div>

    <div style="margin-top: 15px; padding-top: 8px; border-top: 2px solid #ddd; text-align: center;">
      <h3 style="color: #363bc7; margin-bottom: 8px; font-size: 11px;">Nous contacter</h3>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; max-width: 400px; margin: 0 auto;">
        <div style="text-align: center; padding: 6px; background: #f8f9fa; border-radius: 4px;">
          <p style="margin: 0 0 3px 0; font-weight: bold; color: #333; font-size: 9px;">📞 Téléphone</p>
          <p style="margin: 0; color: #666; font-size: 8px;">03.65.61.04.20</p>
        </div>
        <div style="text-align: center; padding: 6px; background: #f8f9fa; border-radius: 4px;">
          <p style="margin: 0 0 3px 0; font-weight: bold; color: #333; font-size: 9px;">✉️ Email</p>
          <p style="margin: 0; color: #666; font-size: 8px;">info.xeilom@xeilom.fr</p>
        </div>
        <div style="text-align: center; padding: 6px; background: #f8f9fa; border-radius: 4px;">
          <p style="margin: 0 0 3px 0; font-weight: bold; color: #333; font-size: 9px;">🌐 Site web</p>
          <p style="margin: 0; color: #666; font-size: 8px;">xeilom.fr</p>
        </div>
      </div>
    </div>
    
    <div style="margin-top: 15px; padding-top: 8px; border-top: 1px solid #ddd; font-size: 7px; color: #999; text-align: center;">
      <p style="margin: 0 0 3px 0;">Ce devis est valable 30 jours à compter de sa date de génération</p>
      <p style="margin: 0 0 3px 0;">Tous nos produits sont conformes aux normes CE et aux standards internationaux</p>
      <p style="margin: 0;">Conditions de vente disponibles sur demande | SIRET: 12345678901234</p>
    </div>
  `;

  document.body.appendChild(pdfContent);

  await new Promise((resolve) => setTimeout(resolve, 100));

  try {
    const canvas = await html2canvas(pdfContent, {
      scale: 2.3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: 595,
      height: 842,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 595,
      windowHeight: 842,
      logging: false,
      removeContainer: true,
    });

    const imgData = canvas.toDataURL("image/png");
    document.body.removeChild(pdfContent);
    return imgData;
  } catch (error) {
    console.error(
      "Erreur lors de la génération de la prévisualisation:",
      error
    );
    document.body.removeChild(pdfContent);
    throw error;
  }
};

// Fonction pour exporter en PDF
// Fonction pour générer un PDF et le retourner (pour l'envoi par email)
export const generatePdfBlob = async (selectedOptions, margin = 60) => {
  if (!selectedOptions) {
    throw new Error("Configuration manquante");
  }

  // Créer un conteneur avec des dimensions fixes pour tous les appareils
  const pdfContent = document.createElement("div");
  pdfContent.style.position = "absolute";
  pdfContent.style.left = "-9999px";
  pdfContent.style.top = "0";
  pdfContent.style.width = "595px"; // Largeur A4 en points
  pdfContent.style.height = "842px"; // Hauteur A4 en points
  pdfContent.style.padding = "40px";
  pdfContent.style.fontFamily = "Arial, sans-serif";
  pdfContent.style.backgroundColor = "white";
  pdfContent.style.color = "black";
  pdfContent.style.fontSize = "10px";
  pdfContent.style.lineHeight = "1.3";
  pdfContent.style.boxSizing = "border-box";
  pdfContent.style.overflow = "hidden";

  const date = new Date().toLocaleDateString("fr-FR");

  pdfContent.innerHTML = `
    <div style="text-align: center; margin-bottom: 15px; border-bottom: 2px solid #363bc7; padding-bottom: 8px;">
      <div style="margin-bottom: 8px;">
        <img src="/logo.png" alt="XEILOM Logo" style="height: 35px; object-fit: contain;" />
      </div>
      <div style="margin-bottom: 5px;">
        <h1 style="color: #363bc7; margin: 0; font-size: 16px;">Configurateur de truncks optiques</h1>
      </div>
      <p style="color: #666; margin: 3px 0 0 0; font-size: 9px;">Devis technique généré le ${date} | Référence: ${generateReference(
    selectedOptions
  )}</p>
      <p style="color: #999; margin: 2px 0 0 0; font-size: 8px;">Spécialiste en solutions optiques professionnelles</p>
    </div>

    <div style="margin-bottom: 15px;">
      <h2 style="color: #363bc7; border-bottom: 1px solid #ddd; padding-bottom: 3px; margin-bottom: 8px; font-size: 12px;">Résultats de la configuration</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
        <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; border-left: 2px solid #363bc7;">
          <h3 style="margin: 0 0 3px 0; color: #333; font-size: 9px;">📋 Référence à commander</h3>
          <p style="margin: 0; font-size: 11px; font-weight: bold; color: #363bc7; font-family: monospace;">${generateReference(
            selectedOptions
          )}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; border-left: 2px solid #363bc7;">
          <h3 style="margin: 0 0 3px 0; color: #333; font-size: 9px;">💰 Prix HT</h3>
          <p style="margin: 0; font-size: 13px; font-weight: bold; color: #363bc7;">${
            calculatePrice(selectedOptions, margin)
              ? `${calculatePrice(selectedOptions, margin)} €`
              : "Configuration incomplète"
          }</p>
        </div>
      </div>

      ${(() => {
        const priceBreakdown = getPriceBreakdown(selectedOptions, margin);
        const quantity = priceBreakdown?.quantity?.value || 1;
        const totalPrice = calculatePrice(selectedOptions, margin);
        const unitPrice =
          totalPrice && quantity > 1 ? totalPrice / quantity : null;

        if (unitPrice) {
          return `
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 8px; border-radius: 4px; border: 1px solid #cbd5e1; margin-bottom: 10px;">
              <h3 style="margin: 0 0 3px 0; color: #666; font-size: 9px;">📦 Prix à l'unité (${quantity} produits)</h3>
              <p style="margin: 0; font-size: 11px; font-weight: 600; color: #333;">${unitPrice.toFixed(
                2
              )} €</p>
            </div>
          `;
        }
        return "";
      })()}

      <div style="margin-bottom: 15px;">
        <h2 style="color: #363bc7; border-bottom: 1px solid #ddd; padding-bottom: 3px; margin-bottom: 8px; font-size: 12px;">Résumé de la configuration</h2>
        <div style="background: #f8f9fa; padding: 8px; border-radius: 4px;">
          <p style="margin: 0; font-size: 10px; line-height: 1.3;">
            <strong>Trunck :</strong> ${selectedOptions.connecteurA}/${
    selectedOptions.connecteurB
  } ${selectedOptions.nombreFibres} Fibres ${selectedOptions.modeFibre} ${
    selectedOptions.typeCable
  } de ${selectedOptions.longueur}m avec test de ${selectedOptions.typeTest}
          </p>
        </div>
      </div>

      <div style="margin-bottom: 15px;">
        <h2 style="color: #363bc7; border-bottom: 1px solid #ddd; padding-bottom: 3px; margin-bottom: 8px; font-size: 12px;">Spécifications techniques détaillées</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; border-left: 3px solid #363bc7;">
            <h4 style="margin: 0 0 6px 0; color: #363bc7; font-size: 10px;">🔌 Connecteurs</h4>
            <div style="font-size: 9px; line-height: 1.3;">
              <div style="margin-bottom: 3px;"><strong>Connecteur A :</strong> ${
                selectedOptions.connecteurA
              }</div>
              <div style="margin-bottom: 3px;"><strong>Connecteur B :</strong> ${
                selectedOptions.connecteurB
              }</div>
              <div style="color: #666; font-size: 8px;">Type standardisé pour compatibilité maximale</div>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; border-left: 3px solid #059669;">
            <h4 style="margin: 0 0 6px 0; color: #059669; font-size: 10px;">📡 Fibres optiques</h4>
            <div style="font-size: 9px; line-height: 1.3;">
              <div style="margin-bottom: 3px;"><strong>Nombre :</strong> ${
                selectedOptions.nombreFibres
              } fibres</div>
              <div style="margin-bottom: 3px;"><strong>Mode :</strong> ${
                selectedOptions.modeFibre
              }</div>
              <div style="color: #666; font-size: 8px;">Performance optimisée selon l'application</div>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; border-left: 3px solid #dc2626;">
            <h4 style="margin: 0 0 6px 0; color: #dc2626; font-size: 10px;">🔗 Câble</h4>
            <div style="font-size: 9px; line-height: 1.3;">
              <div style="margin-bottom: 3px;"><strong>Type :</strong> ${
                selectedOptions.typeCable
              }</div>
              <div style="margin-bottom: 3px;"><strong>Longueur :</strong> ${
                selectedOptions.longueur
              }m</div>
              <div style="color: #666; font-size: 8px;">Résistance mécanique et environnementale</div>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; border-left: 3px solid #ea580c;">
            <h4 style="margin: 0 0 6px 0; color: #ea580c; font-size: 10px;">🧪 Tests & Qualité</h4>
            <div style="font-size: 9px; line-height: 1.3;">
              <div style="margin-bottom: 3px;"><strong>Test :</strong> ${
                selectedOptions.typeTest
              }</div>
              <div style="margin-bottom: 3px;"><strong>Épanouissement :</strong> ${
                selectedOptions.epanouissement
              }</div>
              <div style="color: #666; font-size: 8px;">Contrôle qualité rigoureux</div>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 15px;">
        <h2 style="color: #363bc7; border-bottom: 1px solid #ddd; padding-bottom: 3px; margin-bottom: 8px; font-size: 12px;">Informations complémentaires</h2>
        
        <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
          <div style="background: #f0f9ff; padding: 8px; border-radius: 4px; border-left: 3px solid #0284c7;">
            <h4 style="margin: 0 0 6px 0; color: #0284c7; font-size: 10px;">⚡ Performance</h4>
            <div style="font-size: 9px; line-height: 1.3;">
              <div style="margin-bottom: 3px;">• Bande passante optimisée</div>
              <div style="margin-bottom: 3px;">• Faibles pertes d'insertion</div>
              <div style="margin-bottom: 3px;">• Compatible normes internationales</div>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top: 15px; padding-top: 8px; border-top: 2px solid #ddd; text-align: center;">
        <h3 style="color: #363bc7; margin-bottom: 8px; font-size: 11px;">Nous contacter</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; max-width: 400px; margin: 0 auto;">
          <div style="text-align: center; padding: 6px; background: #f8f9fa; border-radius: 4px;">
            <p style="margin: 0 0 3px 0; font-weight: bold; color: #333; font-size: 9px;">📞 Téléphone</p>
            <p style="margin: 0; color: #666; font-size: 8px;">03.65.61.04.20</p>
          </div>
          <div style="text-align: center; padding: 6px; background: #f8f9fa; border-radius: 4px;">
            <p style="margin: 0 0 3px 0; font-weight: bold; color: #333; font-size: 9px;">✉️ Email</p>
            <p style="margin: 0; color: #666; font-size: 8px;">info.xeilom@xeilom.fr</p>
          </div>
          <div style="text-align: center; padding: 6px; background: #f8f9fa; border-radius: 4px;">
            <p style="margin: 0 0 3px 0; font-weight: bold; color: #333; font-size: 9px;">🌐 Site web</p>
            <p style="margin: 0; color: #666; font-size: 8px;">xeilom.fr</p>
          </div>
        </div>
      </div>
      
      <div style="margin-top: 15px; padding-top: 8px; border-top: 1px solid #ddd; font-size: 7px; color: #999; text-align: center;">
        <p style="margin: 0 0 3px 0;">Ce devis est valable 30 jours à compter de sa date de génération</p>
        <p style="margin: 0 0 3px 0;">Tous nos produits sont conformes aux normes CE et aux standards internationaux</p>
        <p style="margin: 0;">Conditions de vente disponibles sur demande | SIRET: 521 756 502 00030</p>
      </div>
    </div>
  `;

  document.body.appendChild(pdfContent);

  // Attendre que le contenu soit rendu
  await new Promise((resolve) => setTimeout(resolve, 100));

  try {
    const canvas = await html2canvas(pdfContent, {
      scale: 2.3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: 595,
      height: 842,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 595,
      windowHeight: 842,
      logging: false,
      removeContainer: true,
    });

    // Utiliser PNG pour une qualité maximale sans perte
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    // Ajouter l'image sur une seule page A4
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297);

    // Retourner le PDF en base64
    const pdfOutput = pdf.output("datauristring");
    const base64 = pdfOutput.split(",")[1];
    const size = base64.length * 0.75; // Approximation de la taille en bytes

    console.log(
      `Taille du PDF: ${Math.round((size / 1024 / 1024) * 100) / 100}MB`
    );

    return {
      base64,
      size,
      fileName: `trunck-optique-${generateReference(
        selectedOptions
      )}-${date.replace(/\//g, "-")}.pdf`,
    };
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    throw error;
  } finally {
    document.body.removeChild(pdfContent);
  }
};

// Fonction pour exporter en PDF (téléchargement)
export const exportToPDF = async (selectedOptions, margin = 60) => {
  if (!selectedOptions) {
    alert("Veuillez compléter la configuration avant d'exporter");
    return;
  }

  try {
    const pdfData = await generatePdfBlob(selectedOptions, margin);
    const pdf = new jsPDF("p", "mm", "a4");
    const base64 = pdfData.base64;

    // Reconstituer le PDF pour le téléchargement
    const pdfOutput = `data:application/pdf;base64,${base64}`;
    const link = document.createElement("a");
    link.href = pdfOutput;
    link.download = pdfData.fileName;
    link.click();
  } catch (error) {
    console.error("Erreur lors de l'export PDF:", error);
    alert("Erreur lors de l'export PDF. Veuillez réessayer.");
  }
};

// Fonction pour générer un vrai PDF pour l'envoi par email
export const generatePdfForEmail = async (selectedOptions, margin = 60) => {
  if (!selectedOptions) {
    throw new Error("Configuration manquante");
  }

  const date = new Date().toLocaleDateString("fr-FR");
  const reference = generateReference(selectedOptions);
  const price = calculatePrice(selectedOptions, margin);
  const quantity = parseInt(selectedOptions.quantite) || 1;
  const unitPrice = price && quantity > 1 ? price / quantity : null;

  const pdf = new jsPDF("p", "mm", "a4");

  // Configuration des polices
  pdf.setFont("helvetica", "normal");

  // En-tête
  pdf.setFillColor(54, 59, 199); // #363bc7
  pdf.rect(0, 0, 210, 30, "F");

  // Logo X
  pdf.setFillColor(255, 255, 255);
  pdf.circle(15, 15, 8, "F");
  pdf.setTextColor(54, 59, 199);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("X", 15, 19);

  // Titre
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("XEILOM - Configurateur de Truncks Optiques", 30, 20);

  // Sous-titre
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    `Devis technique généré le ${date} | Référence: ${reference}`,
    30,
    25
  );
  pdf.text("Spécialiste en solutions optiques professionnelles", 30, 28);

  // Réinitialiser la couleur
  pdf.setTextColor(0, 0, 0);

  let yPosition = 45;

  // Section Résultats
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(54, 59, 199);
  pdf.text("Résultats de la configuration", 20, yPosition);

  yPosition += 10;

  // Référence et Prix
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0, 0, 0);

  pdf.text("Référence à commander:", 20, yPosition);
  pdf.setFont("helvetica", "bold");
  pdf.text(reference, 80, yPosition);

  yPosition += 8;

  pdf.setFont("helvetica", "normal");
  pdf.text("Prix public HT:", 20, yPosition);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(54, 59, 199);
  pdf.text(`${price} €`, 80, yPosition);

  yPosition += 8;

  // Prix à l'unité et quantité si applicable
  if (unitPrice) {
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Prix à l'unité (${quantity} produits):`, 20, yPosition);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${unitPrice.toFixed(2)} €`, 80, yPosition);

    yPosition += 8;

    pdf.setFont("helvetica", "normal");
    pdf.text("Quantité:", 20, yPosition);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${quantity} produits`, 80, yPosition);

    yPosition += 8;
  }

  // Délai de fabrication
  pdf.setFont("helvetica", "normal");
  pdf.text("Délai de fabrication:", 20, yPosition);
  pdf.setFont("helvetica", "bold");
  pdf.text("Environ 1 semaine", 80, yPosition);

  yPosition += 15;

  // Section Détails
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(54, 59, 199);
  pdf.text("Détails de la configuration", 20, yPosition);

  yPosition += 10;

  // Détails en deux colonnes
  const details = [
    ["Connecteur A", selectedOptions.connecteurA],
    ["Connecteur B", selectedOptions.connecteurB],
    ["Nombre de fibres", selectedOptions.nombreFibres],
    ["Mode fibre", selectedOptions.modeFibre],
    ["Type de câble", selectedOptions.typeCable],
    ["Longueur", `${selectedOptions.longueur} m`],
    ["Épanouissement", selectedOptions.epanouissement],
    ["Type de test", selectedOptions.typeTest],
  ];

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0, 0, 0);

  details.forEach(([label, value], index) => {
    const x = index % 2 === 0 ? 20 : 110;
    const y = yPosition + Math.floor(index / 2) * 8;

    pdf.text(`${label}:`, x, y);
    pdf.setFont("helvetica", "bold");
    pdf.text(value, x + 40, y);
    pdf.setFont("helvetica", "normal");
  });

  yPosition += Math.ceil(details.length / 2) * 8 + 15;

  // Section Résumé
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(54, 59, 199);
  pdf.text("Résumé de la configuration", 20, yPosition);

  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0, 0, 0);

  const summary = `Trunck : ${selectedOptions.connecteurA}/${selectedOptions.connecteurB} ${selectedOptions.nombreFibres} Fibres ${selectedOptions.modeFibre} ${selectedOptions.typeCable} de ${selectedOptions.longueur}m avec test de ${selectedOptions.typeTest}`;

  // Diviser le texte en lignes si trop long
  const lines = pdf.splitTextToSize(summary, 170);
  lines.forEach((line) => {
    pdf.text(line, 20, yPosition);
    yPosition += 5;
  });

  // Pied de page
  yPosition = 280;
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text(
    "Conditions de vente disponibles sur demande | SIRET: 521 756 502 00030",
    20,
    yPosition
  );

  return pdf;
};
