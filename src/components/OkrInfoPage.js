import React, { useState, useEffect } from 'react';
import { getCompanyData } from '../api/api';
import { set } from 'date-fns';

const OkrInfoPage = ({ setActiveTab, setSelectedCompanies }) => {
  const [localSelectedCompanies, setLocalSelectedCompanies] = useState([]);
  const [companyData, setCompanyData] = useState([]); // 전체 데이터
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const pageSize = 8;

  const fetchCompanyData = async (page = 1, company_name = '') => {
    try {
      setIsLoading(true);
      const response = await getCompanyData(page, company_name, pageSize);
      setCompanyData(response.data.data || []); // 전체 데이터를 저장
      setTotalPages(Math.ceil((response.data.data || []).length / pageSize)); // 총 페이지 계산
    } catch (error) {
      console.error('데이터를 가져오는데 실패했습니다:', error);
      setCompanyData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const addFilter = (value) => {
    if (!localSelectedCompanies.includes(value)) {
      setLocalSelectedCompanies([value]);
      fetchCompanyData(1, value);
      setCurrentPage(1);
    }
  };

  const removeFilter = (value) => {
    setLocalSelectedCompanies([]);
    fetchCompanyData(1);
    setCurrentPage(1);
  };

  const handleViewOkr = () => {
    setSelectedCompanies(localSelectedCompanies);
    setActiveTab('OkrDataPage');
  };

  // 현재 페이지의 데이터만 추출
  const itemsToDisplay = companyData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const uniqueCompanies = Array.from(new Set(companyData.map((company) => company.name)));

  return (
    <div className="page-container">
      <h1>OKR 기업정보</h1>

      {isLoading ? (
        <p>데이터를 불러오는 중...</p>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <label>기업명: </label>
              <select
                onChange={(e) => addFilter(e.target.value)}
                value={localSelectedCompanies[0] || ''}
              >
                <option value="">모든 기업</option>
                {uniqueCompanies.map((company, index) => (
                  <option key={index} value={company}>
                    {company}
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
          <div style={{ marginTop: '20px' }}>
            <table border="1" style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                  <th>No.</th>
                  <th>기업명</th>
                  <th>분야</th>
                  <th>설명</th>
                </tr>
              </thead>
              <tbody>
                {itemsToDisplay.length > 0 ? (
                  itemsToDisplay.map((company, index) => (
                    <tr key={index} style={{ backgroundColor: 'white' }}>
                      <td>{(currentPage - 1) * pageSize + index + 1}</td>
                      <td>{company.name}</td>
                      <td>{company.field}</td>
                      <td>{company.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">데이터가 없습니다</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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
        </>
      )}
    </div>
  );
};

export default OkrInfoPage;
