import React, { useState } from 'react';
import { okrData } from '../data/data';

const OkrAITotalPage = ({selectedData, onProcessDat}) => {
    const filteredData = okrData.filter((okr) =>
        selectedCompanies.length === 0 || selectedCompanies.includes(okr.company)
      );
    
    return (
        <div className="page-container">
          <h1>저장된 AI 결과</h1>
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
}

export default OkrAITotalPage;