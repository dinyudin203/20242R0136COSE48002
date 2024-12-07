import React, { useState, useEffect } from 'react';
import { getOkrData, postAIData, getTaskStatus } from '../api/api';

const OkrDataPage = ({ setAITaskStatus , setAIOkrId}) => {
  const [okrData, setOkrData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [localSelectedCompany, setLocalSelectedCompany] = useState(''); // 기업 필터
  const [localSelectedField, setLocalSelectedField] = useState(''); // 분야 필터
  const [sorting, setSorting] = useState('true'); // 정렬 필터

  const rowsPerPage = 15;

  const task_id = 0;
  const fetchOkrData = async () => {
    try {
      const company_name = localSelectedCompany ||'';
      const field = localSelectedField || '';
      const response = await getOkrData(currentPage, company_name, field,sorting);

      fetchTaskStatus();
      // 분야 필터 적용
      const filteredData = field
        ? response.data.data.filter((okr) => okr.company_field === field)
        : response.data.data;

      setOkrData(filteredData || []);
      setTotalPages(response.data.total_page || 1);
    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
      setOkrData([]);
    }
  };

  useEffect(() => {
    fetchOkrData();
  }, [currentPage, localSelectedCompany, localSelectedField, sorting]);

  const handleCompanyChange = (value) => {
    setLocalSelectedCompany(value); // 기업 선택 업데이트
    setCurrentPage(1); // 페이지 초기화
  };

  const fetchTaskStatus = async () => {
    try {
      const response = await getTaskStatus(task_id);
      console.log('태스크 상태:', response.data);
  
      // 태스크 상태가 성공("success")이면 다음 페이지로 이동
      if (response.data === 'success') {
        setAITaskStatus('success');
      }
    } catch (e) {
      console.error('태스크 상태 가져오기 실패:', e);
    }
  };
  
  const handleFieldChange = (value) => {
    setLocalSelectedField(value); // 분야 선택 업데이트
    setCurrentPage(1); // 페이지 초기화
  };

  const handleSortingChange = (value) => {
    setSorting(value); // 정렬 선택 업데이트
    setCurrentPage(1); // 페이지 초기화
  };

  const handleCheckboxChange = (okr) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(okr)
        ? prevSelected.filter((row) => row !== okr)
        : [...prevSelected, okr]
    );
  };

  
  const handleSelectAll = () => {
    const isAllSelected = okrData.every((okr) => selectedRows.includes(okr));
    setSelectedRows(isAllSelected ? [] : okrData);
  };

  const handleApplyAI = async () => {
    if (selectedRows.length === 0) {
      console.error('선택된 OKR이 없습니다.');
      return;
    }

    const okrIds = selectedRows.map((okr) => okr.okr_id);

    try {
      const response = await postAIData(okrIds); // OKR ID 배열 전송
      console.log('AI 적용 성공:', response.data);
      task_id = response.data.task_id;
      setAIOkrId(okrIds);
      setSelectedRows([]);
    } catch (e) {
      console.error('AI 적용 실패:', e);
    }
  };

  const removeFilters = () => {
    setLocalSelectedCompany('');
    setLocalSelectedField('');
    setSorting('true');
    setCurrentPage(1);
    fetchOkrData();
  };
  // 고유한 기업명 및 분야 추출
  const uniqueCompanies = Array.from(new Set(okrData.map((okr) => okr.company_name)));
  const uniqueFields = Array.from(new Set(okrData.map((okr) => okr.company_field)));

  return (
    <div className="page-container">
      <h1>OKR 데이터 목록</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        {/* 기업 필터 */}
        <div>
          <label>기업명: </label>
          <select
            onChange={(e) => handleCompanyChange(e.target.value)}
            value={localSelectedCompany || ''}
          >
            <option value="">모든 기업</option>
            {uniqueCompanies.map((company, index) => (
              <option key={index} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>

        {/* 분야 필터 */}
        <div>
          <label>분야: </label>
          <select
            onChange={(e) => handleFieldChange(e.target.value)}
            value={localSelectedField || ''}
          >
            <option value="">모든 분야</option>
            {uniqueFields.map((field, index) => (
              <option key={index} value={field}>
                {field}
              </option>
            ))}
          </select>
        </div>

        {/* 시간순 정렬 */}
        <div>
          <label>시간순: </label>
          <select
            onChange={(e) => handleSortingChange(e.target.value)}
            value={sorting}
          >
            <option value="true">최신순</option>
            <option value="false">오래된순</option>
          </select>
        </div>
      </div>

      {/* 버튼 */}
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleSelectAll} style={{ marginRight: '10px' }}>
          전체 선택
        </button>
        <button
          onClick={handleApplyAI}
          disabled={selectedRows.length === 0}
          style={{ marginRight: '10px' }}
        >
          AI 적용
        </button>
        <button onClick={() => removeFilters()}>필터 초기화</button>
      </div>

      {/* 데이터 테이블 */}
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
          {okrData.map((okr, index) => (
            <tr key={okr.okr_id || index}>
              <td>{okr.okr_id}</td>
              <td>{okr.created_at ? okr.created_at.slice(0, 10) : '-'}</td>
              <td>{okr.company_name}</td>
              <td>{okr.company_field}</td>
              <td>{okr.team || '-'}</td>
              <td>{okr.is_objective ? 'o' : 'kr'}</td>
              <td>{okr.upper_objective || '-'}</td>
              <td>{okr.input_sentence || '-'}</td>
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

      {/* 페이지네이션 */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          이전
        </button>
        <span>{`${currentPage} / ${totalPages}`}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default OkrDataPage;
