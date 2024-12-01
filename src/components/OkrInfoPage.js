import React, { useState } from 'react';
import { companyData } from '../data/data';

const OkrInfoPage = () => {
  const [selectedCompanies, setSelectedCompanies] = useState([]); // 선택된 기업
  const [selectedYears, setSelectedYears] = useState([]); // 선택된 연도

  // 고유한 기업명과 연도 추출
  const uniqueCompanies = [...new Set(companyData.map((company) => company.name))];
  const uniqueYears = [...new Set(companyData.map((company) => company.year))];

  // 데이터 필터링
  const filteredData = companyData.filter((company) => {
    const companyMatch =
      selectedCompanies.length === 0 || selectedCompanies.includes(company.name);
    const yearMatch =
      selectedYears.length === 0 || selectedYears.includes(company.year.toString());
    return companyMatch && yearMatch;
  });

  // 필터 추가 (모든 기업/모든 연도는 제외)
  const addFilter = (value, setState, state, excludeValue) => {
    if (value !== excludeValue && !state.includes(value)) {
      setState([...state, value]);
    }
  };

  // 필터 제거
  const removeFilter = (value, setState, state) => {
    setState(state.filter((item) => item !== value));
  };

  return (
    <div className="page-container">
      {/* 제목 */}
      <h1 style={{ textAlign: 'left', marginBottom: '30px' }}>OKR 기업정보</h1>

      {/* 필터 영역 */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {/* 기업 필터 */}
        <div>
          <label>기업명: </label>
          <select
            onChange={(e) =>
              addFilter(e.target.value, setSelectedCompanies, selectedCompanies, '모든 기업')
            }
          >
            <option value="모든 기업">모든 기업</option>
            {uniqueCompanies.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* 연도 필터 */}
        <div>
          <label>연도: </label>
          <select
            onChange={(e) =>
              addFilter(e.target.value, setSelectedYears, selectedYears, '모든 연도')
            }
          >
            <option value="모든 연도">모든 연도</option>
            {uniqueYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 선택된 필터 표시 */}
      <div style={{ marginBottom: '20px' }}>
        {/* 기업 필터 태그 */}
        <div style={{ marginBottom: '10px' }}>
          {selectedCompanies.map((company) => (
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
              onClick={() => removeFilter(company, setSelectedCompanies, selectedCompanies)}
            >
              {company} &times;
            </span>
          ))}
        </div>
        {/* 연도 필터 태그 */}
        <div>
          {selectedYears.map((year) => (
            <span
              key={year}
              style={{
                display: 'inline-block',
                padding: '5px 10px',
                margin: '5px',
                backgroundColor: '#4a4a4a',
                color: 'white',
                borderRadius: '15px',
                cursor: 'pointer',
              }}
              onClick={() => removeFilter(year, setSelectedYears, selectedYears)}
            >
              {year} &times;
            </span>
          ))}
        </div>
      </div>

      {/* 데이터 테이블 */}
      <div>
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
              <th style={{ padding: '10px' }}>No.</th>
              <th style={{ padding: '10px' }}>기업명</th>
              <th style={{ padding: '10px' }}>연도</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((company, index) => (
              <tr key={index} style={{ backgroundColor: 'white' }}>
                <td style={{ padding: '10px' }}>{company.no}</td>
                <td style={{ padding: '10px' }}>{company.name}</td>
                <td style={{ padding: '10px' }}>{company.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OkrInfoPage;
