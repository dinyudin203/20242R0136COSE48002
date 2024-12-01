import React, { useState, useEffect } from 'react';
import Button from '../Button';

const OkrAIPage = ({ selectedData, onProcessData }) => {
  const [processedData, setProcessedData] = useState([]); // 처리된 데이터를 저장
  const [currentPage, setCurrentPage] = useState(1); // 페이지네이션 상태
  const itemsPerPage = 5; // 한 페이지당 표시할 항목 수

  useEffect(() => {
    setProcessedData(selectedData); // 초기 데이터 설정
  }, [selectedData]);

  const handleProcessAll = () => {
    if (onProcessData) {
      onProcessData(selectedData);
    }
    setProcessedData(selectedData);
  };

  const handleProcessItem = (okr) => {
    if (onProcessData) {
      onProcessData([okr]);
    }
    setProcessedData((prev) => [...prev, okr]);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = processedData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(processedData.length / itemsPerPage);

  return (
    <div>
      <h1>AI 적용 결과 페이지</h1>
      {processedData.length === 0 ? (
        <p>AI 처리된 데이터가 없습니다.</p>
      ) : (
        <div style={{ marginTop: '10px' }}>
          {paginatedData.map((okr, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <p><strong>No.:</strong> {okr.no}</p>
              <p><strong>일자:</strong> {okr.date}</p>
              <p><strong>기업명:</strong> {okr.company}</p>
              <p><strong>업종:</strong> {okr.industry}</p>
              <p><strong>부서명:</strong> {okr.department}</p>
              <p><strong>구분(OKR):</strong> {okr.type}</p>
              <p><strong>상위/해당목표:</strong> {okr.goal}</p>
              <p><strong>작성 OKR:</strong> {okr.okr}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          style={{
            padding: '5px 10px',
            borderRadius: '4px',
            backgroundColor: currentPage === 1 ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          }}
        >
          이전
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          style={{
            padding: '5px 10px',
            borderRadius: '4px',
            backgroundColor: currentPage === totalPages ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          }}
        >
          다음
        </button>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button onClick={handleProcessAll} style={{ padding: '10px 20px', borderRadius: '8px' }}>
          전체 AI 적용
        </Button>
      </div>
    </div>
  );
};

export default OkrAIPage;
