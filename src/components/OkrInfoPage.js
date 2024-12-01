import React, { useState } from 'react';
import { companyData } from '../data/data';

const OkrInfoPage = ({ setActiveTab, setSelectedCompanies }) => {
  const [localSelectedCompanies, setLocalSelectedCompanies] = useState([]);

  // 유일한 기업명 추출
  const uniqueCompanies = [...new Set(companyData.map((company) => company.name))];

  // 필터링된 데이터
  const filteredData = companyData.filter(
    (company) =>
      localSelectedCompanies.length === 0 || localSelectedCompanies.includes(company.name)
  );

  const handleViewOkr = () => {
    setSelectedCompanies(localSelectedCompanies); // 선택된 기업 전달
    setActiveTab('OkrDataPage'); // OkrDataPage로 이동
  };

  const addFilter = (value) => {
    if (!localSelectedCompanies.includes(value)) {
      setLocalSelectedCompanies([...localSelectedCompanies, value]);
    }
  };

  const removeFilter = (value) => {
    setLocalSelectedCompanies(
      localSelectedCompanies.filter((company) => company !== value)
    );
  };

  return (
    <div className="page-container">
      <h1>OKR 기업정보</h1>

      {/* 필터와 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <label>기업명: </label>
          <select
            onChange={(e) => addFilter(e.target.value)}
          >
            <option value="">모든 기업</option>
            {uniqueCompanies.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleViewOkr}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
          }}
        >
          OKR 보기
        </button>
      </div>

      {/* 선택된 필터 표시 */}
      <div style={{ marginTop: '20px' }}>
        {localSelectedCompanies.map((company) => (
          <span
            key={company}
            style={{
              display: 'inline-block',
              padding: '5px 10px',
              margin: '5px',
              backgroundColor: '#4a4a4a',
              color: 'white',
              borderRadius: '15px',
              cursor: 'pointer',
            }}
            onClick={() => removeFilter(company)}
          >
            {company} &times;
          </span>
        ))}
      </div>

      {/* 데이터 테이블 */}
      <div style={{ marginTop: '20px' }}>
        <table
          border="1"
          style={{
            width: '100%',
            textAlign: 'center',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
              <th>No.</th>
              <th>기업명</th>
              <th>연도</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((company) => (
              <tr key={company.no} style={{ backgroundColor: 'white' }}>
                <td>{company.no}</td>
                <td>{company.name}</td>
                <td>{company.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OkrInfoPage;
