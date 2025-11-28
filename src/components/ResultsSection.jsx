import { useState } from "react";
import { Copy } from "lucide-react";
import {
  calculatePrice,
  generateReference,
  isConfigurationAvailable,
  isConfigurationComplete,
  getPriceBreakdown,
} from "../utils/calculations.js";
import { generatePdfPreview, exportToPDF } from "../utils/pdfGenerator.js";

const ResultsSection = ({
  selectedOptions,
  onSaveClick,
  savedConfigsCount = 0,
  margin = 60,
  setMargin,
  addToast,
}) => {
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [customMarginValue, setCustomMarginValue] = useState("");

  const price = calculatePrice(selectedOptions, margin);
  const reference = generateReference(selectedOptions);
  const availability = isConfigurationAvailable(selectedOptions);
  const priceBreakdown = getPriceBreakdown(selectedOptions, margin);

  // Calcul du prix à l'unité et de la quantité
  const quantity = parseInt(selectedOptions.quantite) || 1;
  const unitPrice = price && quantity > 1 ? price / quantity : null;

  const handleGeneratePdfPreview = async () => {
    try {
      const imgData = await generatePdfPreview(selectedOptions, margin);
      setPdfPreviewUrl(imgData);
      setShowPdfPreview(true);
    } catch (error) {
      console.error(
        "Erreur lors de la génération de la prévisualisation:",
        error
      );
      alert("Erreur lors de la génération de la prévisualisation");
    }
  };

  const handleExportToPDF = async () => {
    try {
      await exportToPDF(selectedOptions, margin);
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
    }
  };

  const handleCopyReference = async () => {
    if (!reference) return;

    try {
      await navigator.clipboard.writeText(reference);
      if (addToast) {
        addToast("success", "Copié", "Référence copiée dans le presse-papiers");
      }
    } catch (error) {
      console.error("Erreur lors de la copie:", error);
      if (addToast) {
        addToast("error", "Erreur", "Impossible de copier la référence");
      }
    }
  };

  return (
    <div className="price-reference-card">
      <div className="card-header">
        <h2>Résultats de votre configuration</h2>
      </div>

      <div className="card-content">
        {/* Sélecteur de marge */}
        <div className="result-item margin-selector-container">
          <div className="result-label">
            <span className="label-icon">📊</span>
            <span>Marge commerciale</span>
          </div>
          <div className="margin-selector">
            {[0, 25, 30, 40, 50, 60].map((marginValue) => (
              <button
                key={marginValue}
                onClick={() => setMargin(marginValue)}
                className={`margin-button ${
                  margin === marginValue ? "active" : ""
                }`}
              >
                {marginValue === 0 ? "PR" : `${marginValue}%`}
              </button>
            ))}
          </div>
          <div className="custom-margin-input-container">
            <label htmlFor="custom-margin-input">ou</label>
            <div className="custom-margin-input-wrapper">
              <input
                id="custom-margin-input"
                type="number"
                min="25"
                max="100"
                step="0.1"
                value={customMarginValue}
                onChange={(e) => {
                  const value = e.target.value;
                  setCustomMarginValue(value);
                  const numValue = parseFloat(value);
                  if (!isNaN(numValue) && numValue >= 25 && numValue <= 100) {
                    setMargin(numValue);
                  }
                }}
                onFocus={(e) => e.target.select()}
                className="custom-margin-input"
                placeholder="Min 25%"
              />
            </div>
          </div>
        </div>

        <div className="result-item">
          <div className="result-label">
            <span className="label-icon">📋</span>
            <span>Référence à commander</span>
          </div>
          <div className="reference-with-copy">
            <div
              className={`result-value ${reference ? "reference" : "incomplete"}`}
            >
              {reference || "Complétez la configuration"}
            </div>
            {reference && (
              <button
                className="copy-reference-button"
                onClick={handleCopyReference}
                title="Copier la référence"
                aria-label="Copier la référence"
              >
                <Copy size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="result-item">
          <div className="result-label">
            <span className="label-icon">💰</span>
            <span>Prix HT</span>
          </div>
          <div className="price-with-toggle">
            <div
              className={`result-value ${
                price
                  ? "price"
                  : availability?.available === false
                  ? "error"
                  : "incomplete"
              }`}
            >
              {price
                ? `${price} €`
                : availability?.available === false
                ? availability.reason
                : "Complétez la configuration"}
            </div>
            {price && (
              <button
                className="price-detail-toggle"
                onClick={() => setShowPriceDetails(!showPriceDetails)}
                title={
                  showPriceDetails ? "Masquer le détail" : "Voir le détail"
                }
              >
                {showPriceDetails ? "−" : "+"}
              </button>
            )}
          </div>
        </div>

        {/* Détail du prix */}
        {showPriceDetails && priceBreakdown && (
          <div className="price-breakdown">
            <h4>Détail du calcul</h4>
            <div className="breakdown-items">
              <div className="breakdown-item">
                <span className="breakdown-label">
                  Câble ({priceBreakdown.cable.description})
                </span>
                <span className="breakdown-value">
                  {selectedOptions.longueur}m ×{" "}
                  {priceBreakdown.cable.pricePerMeter.toFixed(2)}€/m ={" "}
                  {priceBreakdown.cable.total.toFixed(2)} €
                </span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">
                  {priceBreakdown.labor.description}
                </span>
                <span className="breakdown-value">
                  {priceBreakdown.labor.total.toFixed(2)} €
                </span>
              </div>
              {priceBreakdown.resheathing.total > 0 && (
                <div className="breakdown-item">
                  <span className="breakdown-label">
                    {priceBreakdown.resheathing.description}
                  </span>
                  <span className="breakdown-value">
                    {priceBreakdown.resheathing.total.toFixed(2)} €
                  </span>
                </div>
              )}
              <div className="breakdown-item">
                <span className="breakdown-label">
                  {priceBreakdown.test.description}
                </span>
                <span className="breakdown-value">
                  {priceBreakdown.test.total.toFixed(2)} €
                </span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">
                  {priceBreakdown.shipping.description}
                </span>
                <span className="breakdown-value">
                  {priceBreakdown.shipping.total.toFixed(2)} €
                </span>
              </div>
              {priceBreakdown.scapcConnectors.total > 0 && (
                <div className="breakdown-item">
                  <span className="breakdown-label">
                    {priceBreakdown.scapcConnectors.description}
                  </span>
                  <span className="breakdown-value">
                    {priceBreakdown.scapcConnectors.total.toFixed(2)} €
                  </span>
                </div>
              )}
              <div className="breakdown-separator"></div>
              <div className="breakdown-item subtotal">
                <span className="breakdown-label">Sous-total (coût)</span>
                <span className="breakdown-value">
                  {priceBreakdown.subtotal.toFixed(2)} €
                </span>
              </div>
              <div className="breakdown-item margin">
                <span className="breakdown-label">
                  {priceBreakdown.margin.description}
                </span>
                <span className="breakdown-value">
                  +{priceBreakdown.margin.amount.toFixed(2)} €
                </span>
              </div>
              <div className="breakdown-separator"></div>
              {priceBreakdown.quantity.value > 1 ? (
                <>
                  <div className="breakdown-item">
                    <span className="breakdown-label">Prix unitaire</span>
                    <span className="breakdown-value">
                      {(
                        priceBreakdown.total / priceBreakdown.quantity.value
                      ).toFixed(2)}{" "}
                      €
                    </span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">Quantité</span>
                    <span className="breakdown-value">
                      × {priceBreakdown.quantity.value}
                    </span>
                  </div>
                  <div className="breakdown-separator"></div>
                </>
              ) : null}
              <div className="breakdown-item total">
                <span className="breakdown-label">Total HT</span>
                <span className="breakdown-value">
                  {priceBreakdown.total.toFixed(2)} €
                </span>
              </div>
            </div>
          </div>
        )}

        {price && unitPrice && quantity > 1 && (
          <div className="unit-price-quantity-row">
            <div className="result-item">
              <div className="result-label">
                <span className="label-icon">💰</span>
                <span>Prix à l'unité HT</span>
              </div>
              <div className="result-value">{unitPrice.toFixed(2)} €</div>
            </div>

            <div className="result-item">
              <div className="result-label">
                <span className="label-icon">📦</span>
                <span>Quantité</span>
              </div>
              <div className="result-value">{quantity} produits</div>
            </div>
          </div>
        )}

        <div className="result-item">
          <div className="result-label">
            <span className="label-icon">📦</span>
            <span>Délai de fabrication</span>
          </div>
          <div className="result-value delivery">Environ 1 semaine</div>
        </div>
      </div>

      {isConfigurationComplete(selectedOptions) && (
        <div className="summary-section">
          <h3>Résumé de votre configuration</h3>
          <p>
            Trunck : {selectedOptions.connecteurA}/{selectedOptions.connecteurB}{" "}
            {selectedOptions.nombreFibres} Fibres {selectedOptions.modeFibre}{" "}
            {selectedOptions.typeCable} de {selectedOptions.longueur}m avec
            épanouissement {selectedOptions.epanouissement} et test de{" "}
            {selectedOptions.typeTest}
          </p>

          <div className="export-buttons">
            <button
              onClick={onSaveClick}
              className="save-config-button"
              title="Sauvegarder cette configuration"
              disabled={
                !isConfigurationComplete(selectedOptions) ||
                availability?.available === false
              }
            >
              💾 Sauvegarder
              {savedConfigsCount > 0 && (
                <span className="save-count">({savedConfigsCount})</span>
              )}
            </button>
            <button
              onClick={handleGeneratePdfPreview}
              className="preview-button"
              title="Prévisualiser le PDF"
              disabled={
                !isConfigurationComplete(selectedOptions) ||
                availability?.available === false
              }
            >
              👁️ Prévisualiser
            </button>
            <button
              onClick={handleExportToPDF}
              className="export-button"
              title="Exporter en PDF"
              disabled={
                !isConfigurationComplete(selectedOptions) ||
                availability?.available === false
              }
            >
              📄 Exporter en PDF
            </button>
          </div>
        </div>
      )}

      {/* Modal de prévisualisation PDF */}
      {showPdfPreview && (
        <div className="modal-overlay" onClick={() => setShowPdfPreview(false)}>
          <div
            className="modal-content pdf-preview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Prévisualisation du PDF</h3>
              <button
                className="modal-close"
                onClick={() => setShowPdfPreview(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body pdf-preview-body">
              {pdfPreviewUrl && (
                <div className="pdf-preview-container">
                  <img
                    src={pdfPreviewUrl}
                    alt="Prévisualisation PDF"
                    className="pdf-preview-image"
                  />
                  <div className="pdf-preview-actions">
                    <button
                      onClick={handleExportToPDF}
                      className="export-button"
                      title="Télécharger le PDF"
                    >
                      📄 Télécharger le PDF
                    </button>
                    <button
                      onClick={() => setShowPdfPreview(false)}
                      className="close-button"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsSection;
