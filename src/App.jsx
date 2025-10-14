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
              loadFromReference={loadFromReference}
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
  );
}

export default App;
