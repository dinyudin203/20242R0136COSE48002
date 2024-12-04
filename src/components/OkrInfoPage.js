import React, { useState, useEffect } from 'react';
import { getCompanyData } from '../api/api';

const OkrInfoPage = ({ setActiveTab, setSelectedCompanies }) => {
  const [localSelectedCompanies, setLocalSelectedCompanies] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;

  const fetchCompanyData = async (page = 1, company = '') => {
    try {
      const response = await getCompanyData(page, company, pageSize);
      setCompanyData(response.data.results); // 데이터를 업데이트
      setTotalPages(response.data.total_pages); // 전체 페이지 수 업데이트
    } catch (error) {
      console.error('데이터를 가져오는데 실패했습니다:', error);
    }
  };

  useEffect(() => {
    fetchCompanyData(currentPage, localSelectedCompanies[0] || ''); // 첫 로드 시 데이터 가져오기
  }, [currentPage, localSelectedCompanies]);

  const addFilter = (value) => {
    if (!localSelectedCompanies.includes(value)) {
      setLocalSelectedCompanies([value]); // 한 번에 하나의 기업만 필터
    }
  };

  const removeFilter = (value) => {
    setLocalSelectedCompanies([]);
  };

  const handleViewOkr = () => {
    setSelectedCompanies(localSelectedCompanies); // 선택된 기업 전달
    setActiveTab('OkrDataPage'); // OkrDataPage로 이동
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
            value={localSelectedCompanies[0] || ''}
          >
            <option value="">모든 기업</option>
            {companyData.map((company) => (
              <option key={company.name} value={company.name}>
                {company.name}
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
            {companyData.map((company) => (
              <tr key={company.no} style={{ backgroundColor: 'white' }}>
                <td>{company.no}</td>
                <td>{company.name}</td>
                <td>{company.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
            backgroundColor: currentPage === 1 ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
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
          {`${currentPage} / ${totalPages}`}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          style={{
            padding: '5px 10px',
            backgroundColor: currentPage === totalPages ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          }}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default OkrInfoPage;
