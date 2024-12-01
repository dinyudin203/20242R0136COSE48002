import React from 'react';
import '../styles/OkrPageHeader.css';
const OkrPageHeader = ({ activeTab, setActiveTab }) => {
  return (
    <header>
        <h1>Equalsum</h1>
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
    </header>
    
  );
};



export default OkrPageHeader;
