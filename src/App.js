import React, { useState } from 'react';
import OkrPageHeader from './components/OkrPageHeader';
import OkrInfoPage from './components/OkrInfoPage';
import OkrDataPage from './components/OkrDataPage';
import OkrAIPage from './components/OkrAIPage';
import OkrPageFooter from './components/OkrPageFooter';
import OkrAITotalPage from './components/OkrAITotalPage';
import './styles/global.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('OkrInfoPage'); // Default: OKR 기업정보 페이지
  const [selectedData, setSelectedData] = useState([]); // 선택된 OKR 데이터 상태
  const [selectedCompanies, setSelectedCompanies] = useState([]); // 선택된 기업 데이터

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
        {activeTab === 'OkrInfoPage' && (
          <OkrInfoPage
            setActiveTab={setActiveTab} // ActiveTab 변경 함수 전달
            setSelectedCompanies={setSelectedCompanies} // 선택된 기업 설정 함수 전달
          />
        )}
        {activeTab === 'OkrDataPage' && (
          <OkrDataPage
            selectedCompanies={selectedCompanies} // OkrInfoPage에서 전달받은 기업 데이터
            onApply={handleApplyData} // AI 적용 버튼 클릭 시 데이터 전달
          />
        )}
        {activeTab === 'OkrAIPage' && <OkrAIPage selectedData={selectedData} />}
        {activeTab === 'OkrAITotalPage' && <OkrAITotalPage selectedData={selectedData} onProcessData={handleApplyData} />}
      </main>

      {/* Footer Component */}
      <OkrPageFooter />
    </div>
  );
};

export default App;
