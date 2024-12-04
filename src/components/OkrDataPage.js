import React, { useState, useEffect } from 'react';
import { getOkrData , postAIData } from '../api/api';
import { set } from 'date-fns';

const OkrDataPage = ({ selectedCompanies, onApply }) => {
  const [okrData, setOkrData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [localSelectedCompanies, setLocalSelectedCompanies] = useState([]);
  const [sorting, setSorting] = useState('true');

  const rowsPerPage = 15;

  const fetchOkrData = async () => {
    try {
      const company_name = selectedCompanies.length > 0 ? selectedCompanies[0] : ''; // 첫 번째 선택된 기업 사용
      const response = await getOkrData(currentPage, company_name, sorting);
      setOkrData(response.data.data||[]);
      setTotalPages(response.data.total_page);
    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
      setOkrData([]);
    }
  };

  useEffect(() => {
    fetchOkrData();
  }, [currentPage, selectedCompanies, sorting]);

  const addFilter = (value) => {
    if (!localSelectedCompanies.includes(value)) {
      setLocalSelectedCompanies([value]);
    }
    if (sorting !== '') {
      setSorting('');
    }
  };
  
  const removeFilter = (value) => {
    setLocalSelectedCompanies([]);
    setSorting('');
  }
  const handleCheckboxChange = (okr) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(okr)
        ? prevSelected.filter((row) => row !== okr)
        : [...prevSelected, okr]
    );
  };

  const handleSelectAll = () => {
    const isAllSelected = okrData.every((okr) => selectedRows.includes(okr));

    if (isAllSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(okrData);
    }
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <label>기업명: </label>
        <select
            onChange={(e) => addFilter(e.target.value)}
            value={localSelectedCompanies[0] || ''}
          >
            <option value="">모든 기업</option>
            {okrData.map((okr) => (
              <option key={okr.company_name} value={okr.company_name}>
                {okr.company_name}
              </option>
            ))}
          </select>
        <label>시간순: </label>
          <select>
            <option value="">최신순</option>
            <option value="">오래된순</option>
          </select>
        <div>
          <button
            onClick={handleSelectAll}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              cursor: 'pointer',
              marginRight: '10px',
            }}
          >
            전체 선택
          </button>
          <button
            onClick={handleApplyAI}
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
      </div>

      <table border="1" style={{ marginTop: '10px', width: '100%' }}>
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
            <tr key={okr}>
              <td>{okr.okr_id}</td>
              <td>{okr.created_at.slice(0, 10)}</td>
              <td>{okr.company_name}</td>
              <td>{okr.company_field}</td>
              <td>{okr.team}</td>
              <td>{okr.is_objectvie ? 'o': 'kr'}</td>
              <td>{okr.upper_objective}</td>
              <td>{okr.input_sentence}</td>
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

export default OkrDataPage;
