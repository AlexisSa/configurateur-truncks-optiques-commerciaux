import { useState } from "react";
import "./App.css";
import { useConfiguration } from "./hooks/useConfiguration.js";
import {
  Header,
  ConfigurationGrid,
  ResultsSection,
  PresetModal,
  ToastContainer,
  SaveModal,
} from "./components/index.js";
import AuthGuard from "./components/AuthGuard.jsx";
import AutoAuthGuard from "./components/AutoAuthGuard.jsx";

function App() {
  const [showPresetModal, setShowPresetModal] = useState(false);

  const {
    selectedOptions,
    handleOptionChange,
    loadPresetConfiguration,
    getAvailableFiberModesForCurrentConfig,
    // Nouvelles fonctionnalités
    savedConfigs,
    showSaveModal,
    setShowSaveModal,
    saveConfiguration,
    loadConfiguration,
    deleteConfiguration,
    renameConfiguration,
    clearAllConfigurations,
    getFieldState,
    toasts,
    removeToast,
    // Marge
    margin,
    setMargin,
    // Chargement depuis référence
    loadFromReference,
  } = useConfiguration();

  return (
    <AutoAuthGuard fallbackToManualAuth={true}>
      <div className="app">
        <Header />

        <div className="preset-button-container">
          <button
            onClick={() => setShowPresetModal(true)}
            className="preset-modal-button"
          >
            ⚡ Configurations pré-faites
          </button>
        </div>

        <main className="app-main">
          <div className="configuration-layout">
            <div className="configuration-left">
              {/* Section pour charger depuis une référence */}
              <div className="reference-loader-section-top">
                <h3>🔄 Charger depuis une référence</h3>
                <div className="reference-input-group">
                  <input
                    type="text"
                    placeholder="Ex: T12FSD0H-OS2LC/LC50P"
                    className="reference-input"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        const value = e.target.value.trim();
                        if (value) {
                          const success = loadFromReference(value);
                          if (success) {
                            e.target.value = "";
                          }
                        }
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      const value = input.value.trim();
                      if (value) {
                        const success = loadFromReference(value);
                        if (success) {
                          input.value = "";
                        }
                      }
                    }}
                    className="load-reference-button"
                  >
                    Charger
                  </button>
                </div>
              </div>

              <ConfigurationGrid
                selectedOptions={selectedOptions}
                handleOptionChange={handleOptionChange}
                getAvailableFiberModesForCurrentConfig={
                  getAvailableFiberModesForCurrentConfig
                }
                getFieldState={getFieldState}
              />
            </div>

            <div className="configuration-right">
              <ResultsSection
                selectedOptions={selectedOptions}
                onSaveClick={() => setShowSaveModal(true)}
                savedConfigsCount={savedConfigs.length}
                margin={margin}
                setMargin={setMargin}
              />
            </div>
          </div>
        </main>

        {/* Modals */}
        <PresetModal
          showPresetModal={showPresetModal}
          setShowPresetModal={setShowPresetModal}
          loadPresetConfiguration={loadPresetConfiguration}
        />

        <SaveModal
          showSaveModal={showSaveModal}
          setShowSaveModal={setShowSaveModal}
          selectedOptions={selectedOptions}
          savedConfigs={savedConfigs}
          saveConfiguration={saveConfiguration}
          loadConfiguration={loadConfiguration}
          deleteConfiguration={deleteConfiguration}
          renameConfiguration={renameConfiguration}
          clearAllConfigurations={clearAllConfigurations}
        />

        {/* Notifications toast */}
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </AutoAuthGuard>
  );
}

export default App;
