import React, { useState, useEffect } from 'react';
import Button from '../Button';
import XLSX from 'xlsx-js-style';

const OkrAIPage = ({ selectedData, onProcessData }) => {
  const [processedData, setProcessedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('모든 기업');
  const [selectedYear, setSelectedYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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

    worksheet['!cols'] = [
      { wch: 10 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 30 },
      { wch: 30 },
    ];

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
    if (selectedCompany === '모든 기업' && selectedYear === '') {
      setFilteredData(processedData);
    } else {
      handleFilterChange();
    }
  }, [selectedCompany, selectedYear, processedData]);

  const totalPages = filteredData.length;

  return (
    <div className="page-container">
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
      <div style={{ marginTop: '0.8em', textAlign: 'right' }}>
        <Button
          onClick={exportAllToExcel}
          disabled={processedData.length === 0}
          style={{
            backgroundColor: processedData.length === 0 ? '#ccc' : '#007bff',
            padding: '10px 20px',
            color: 'white',
            cursor: processedData.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          전체 export
        </Button>
      </div>
      {filteredData.length === 0 ? (
        <p style={{ margin: '0.8em' }}>AI 처리된 데이터가 없습니다.</p>
      ) : (
        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '10px',
            marginTop: '10px',
          }}
        >
          <p>
            <strong>No.:</strong> {filteredData[currentPage - 1].no}
          </p>
          <p>
            <strong>일자:</strong> {filteredData[currentPage - 1].date}
          </p>
          <p>
            <strong>기업명:</strong> {filteredData[currentPage - 1].company}
          </p>
          <p>
            <strong>업종:</strong> {filteredData[currentPage - 1].industry}
          </p>
          <p>
            <strong>부서명:</strong> {filteredData[currentPage - 1].department}
          </p>
          <p>
            <strong>구분(OKR):</strong> {filteredData[currentPage - 1].type}
          </p>
          <p>
            <strong>상위/해당목표:</strong> {filteredData[currentPage - 1].goal}
          </p>
          <p>
            <strong>작성 OKR:</strong> {filteredData[currentPage - 1].okr}
          </p>
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
          disabled={currentPage === 1 || totalPages === 0}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          style={{
            padding: '5px 10px',
            backgroundColor: currentPage === 1 || totalPages === 0 ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            cursor: currentPage === 1 || totalPages === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          이전
        </button>
        <span
          style={{
            display: 'inline-block',
            fontSize: '1rem',
            lineHeight: '2',
          }}
        >
          {totalPages === 0 ? '0 / 0' : `${currentPage} / ${totalPages}`}
        </span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          style={{
            padding: '5px 10px',
            backgroundColor:
              currentPage === totalPages || totalPages === 0 ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            cursor:
              currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default OkrAIPage;
