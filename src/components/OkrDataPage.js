import React, { useState } from 'react';
import { okrData } from '../data/data';
import { postAIData } from '../api/api';

const OkrDataPage = ({ selectedCompanies, onApply }) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const filteredData = okrData.filter((okr) =>
    selectedCompanies.length === 0 || selectedCompanies.includes(okr.company)
  );

  const handleCheckboxChange = (okr) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(okr)
        ? prevSelected.filter((row) => row !== okr)
        : [...prevSelected, okr]
    );
  };

  const handleApplyAI = async () => {
    if (selectedRows.length === 0) {
      console.error('선택된 OKR이 없습니다.');
      return;
    }

    const okrIds = selectedRows.map((okr) => okr.no);

    try {
      const response = await postAIData(okrIds); // OKR ID 배열 전송
      console.log('AI 적용 성공:', response.data);
      setSelectedRows([]);
    } catch (e) {
      console.error('AI 적용 실패:', e);
    }
  };

  return (
    <div className="page-container">
      <h1>OKR 데이터 목록</h1>
      <div>
        <button
          onClick={() => handleApplyAI()}
          disabled={selectedRows.length === 0}
          style={{
            backgroundColor: selectedRows.length > 0 ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            cursor: selectedRows.length > 0 ? 'pointer' : 'not-allowed',
          }}
        >
          AI 적용
        </button>
      </div>

      <table border="1" style={{ marginTop: '10px' }}>
        <thead>
          <tr>
            <th>No.</th>
            <th>일자</th>
            <th>기업명</th>
            <th>업종</th>
            <th>부서명</th>
            <th>구분(OKR)</th>
            <th>상위/해당목표</th>
            <th>작성 OKR</th>
            <th>선택</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((okr) => (
            <tr key={okr.no}>
              <td>{okr.no}</td>
              <td>{okr.date}</td>
              <td>{okr.company}</td>
              <td>{okr.industry}</td>
              <td>{okr.department}</td>
              <td>{okr.type}</td>
              <td>{okr.goal}</td>
              <td>{okr.okr}</td>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(okr)}
                  onChange={() => handleCheckboxChange(okr)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OkrDataPage;
