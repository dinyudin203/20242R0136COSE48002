import React from 'react';

const OkrPageHeader = ({ activeTab, setActiveTab }) => {
  return (
    <header>
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
    </header>
  );
};



export default OkrPageHeader;
