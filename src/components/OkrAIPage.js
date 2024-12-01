import React, { useState, useEffect } from 'react';
import Button from '../Button';
import XLSX from 'xlsx-js-style';

const OkrAIPage = ({ selectedData, onProcessData }) => {
  const [processedData, setProcessedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('모든 기업');
  const [selectedYear, setSelectedYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setProcessedData(selectedData);
    setFilteredData(selectedData);
  }, [selectedData]);

  const getUniqueValues = (key) => {
    return Array.from(new Set(processedData.map((okr) => okr[key]))).filter(Boolean);
  };

  const exportAllToExcel = () => {
    if (processedData.length === 0) {
      alert('내보낼 데이터가 없습니다.');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(processedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'OKR AI 결과');
    // 엑셀 스타일 설정 (선택 사항)
    worksheet['!cols'] = [
      { wch: 10 }, // No.
      { wch: 15 }, // 일자
      { wch: 20 }, // 기업명
      { wch: 15 }, // 업종
      { wch: 15 }, // 부서명
      { wch: 15 }, // 구분(OKR)
      { wch: 30 }, // 상위/해당목표
      { wch: 30 }, // 작성 OKR
    ];

    // 엑셀 파일 다운로드
    XLSX.writeFile(workbook, 'okr_data.xlsx');
  };

  const handleFilterChange = () => {
    let filtered = processedData;
    if (selectedCompany !== '모든 기업') {
      filtered = filtered.filter((okr) => okr.company === selectedCompany);
    }
    if (selectedYear) {
      filtered = filtered.filter((okr) => okr.date === selectedYear);
    }
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedCompany, selectedYear]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div>
      <h1>AI 적용 결과 페이지</h1>
      <div>
        <label>기업명: </label>
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option>모든 기업</option>
          {getUniqueValues('company').map((company, index) => (
            <option key={index} value={company}>
              {company}
            </option>
          ))}
        </select>
        <label>연도: </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">모든 연도</option>
          {getUniqueValues('date').map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {filteredData.length === 0 ? (
        <p>AI 처리된 데이터가 없습니다.</p>
      ) : (
        <div style={{ marginTop: '10px' }}>
          {paginatedData.map((okr, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                marginBottom: '10px',
              }}
            >
              <p>
                <strong>No.:</strong> {okr.no}
              </p>
              <p>
                <strong>일자:</strong> {okr.date}
              </p>
              <p>
                <strong>기업명:</strong> {okr.company}
              </p>
              <p>
                <strong>업종:</strong> {okr.industry}
              </p>
              <p>
                <strong>부서명:</strong> {okr.department}
              </p>
              <p>
                <strong>구분(OKR):</strong> {okr.type}
              </p>
              <p>
                <strong>상위/해당목표:</strong> {okr.goal}
              </p>
              <p>
                <strong>작성 OKR:</strong> {okr.okr}
              </p>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
          gap: '10px',
        }}
      >
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
        <span>
          {currentPage} / {totalPages}
        </span>
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
        <Button onClick={exportAllToExcel} style={{ padding: '10px 20px', borderRadius: '8px' }}>
          전체 export
        </Button>
      </div>
    </div>
  );
};

export default OkrAIPage;
