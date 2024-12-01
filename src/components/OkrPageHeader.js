import React, { useState } from 'react';
import '../styles/OkrPageHeader.css';
import ExcelImportPopup from './ExcelImport';

const OkrPageHeader = ({ activeTab, setActiveTab, onExcelImport }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <header className="header-container">
      <h1>Equalsum</h1>
      <div className="nav-section">
        {/* Active Tab Buttons */}
        <div className="nav-buttons">
          <button
            onClick={() => setActiveTab('OkrInfoPage')}
          >
            OKR 기업정보
          </button>
          <button
            onClick={() => setActiveTab('OkrDataPage')}
          >
            OKR 데이터 목록
          </button>
          <button
            onClick={() => setActiveTab('OkrAIPage')}
          >
            AI 적용
          </button>
        </div>
        {/* Import Button */}
        <div className="import-button">
          <button onClick={handleOpenPopup}>Import</button>
        </div>
      </div>

      {/* 팝업 컴포넌트 */}
      <ExcelImportPopup
        isVisible={isPopupVisible}
        onClose={handleClosePopup}
        onExcelImport={onExcelImport}
      />
    </header>
  );
};

export default OkrPageHeader;
