import React, { useState } from 'react';
import { okrData } from '../data/data';

const OkrDataPage = ({ onApply }) => {
  const [selectedRows, setSelectedRows] = useState([]); // 체크박스 선택 상태

  // 체크박스 선택/해제 처리
  const handleCheckboxChange = (okr) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(okr)
        ? prevSelected.filter((row) => row !== okr) // 선택 해제
        : [...prevSelected, okr] // 선택 추가
    );
  };

  return (
    <div>
      <h1>OKR 데이터 목록</h1>
      <button
        onClick={() => onApply(selectedRows)} // 선택된 데이터 전달
        disabled={selectedRows.length === 0} // 데이터 없으면 버튼 비활성화
      >
        AI 적용
      </button>
      <table border="1" style={{ width: '100%', marginTop: '10px' }}>
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
          {okrData.map((okr) => (
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
