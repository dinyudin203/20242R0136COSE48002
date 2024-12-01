import React, { useState } from 'react';
import OkrPageHeader from './components/OkrPageHeader';
import OkrInfoPage from './components/OkrInfoPage';
import OkrDataPage from './components/OkrDataPage';
import OkrAIPage from './components/OkrAIPage';
import OkrPageFooter from './components/OkrPageFooter'
import './styles/global.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('OkrInfoPage'); // Default: OKR 기업정보 페이지
  const [selectedData, setSelectedData] = useState([]); // 선택된 OKR 데이터 상태

  // OKR 데이터에서 선택된 데이터 처리
  const handleApplyData = (selected) => {
    setSelectedData(selected); // 선택된 데이터를 상태로 저장
    setActiveTab('OkrAIPage'); // AI 적용 페이지로 이동
  };

  return (
    <div>
      {/* Header Component */}
      <OkrPageHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main style={{ padding: '20px' }}>
        {activeTab === 'OkrInfoPage' && <OkrInfoPage />}
        {activeTab === 'OkrDataPage' && (
          <OkrDataPage onApply={handleApplyData} /> // AI 적용 버튼은 여기만 존재
        )}
        {activeTab === 'OkrAIPage' && <OkrAIPage selectedData={selectedData} />}
      </main>
      {/* Footer Componet */}
      <OkrPageFooter />
    </div>
  );
};

export default App;