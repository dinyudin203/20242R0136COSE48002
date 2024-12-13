import React, { useState, useEffect } from 'react';
import { getTotalAIData } from '../api/api';

const OkrAITotalPage = () => {
  const [localSelectedCompany, setLocalSelectedCompany] = useState(''); // 기업 필터
  const [localSelectedField, setLocalSelectedField] = useState(''); // 분야 필터
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [aiTotalData, setAITotalData] = useState([]);
  const [sorting, setSorting] = useState('true'); // 정렬 필터
  const pageSize = 4;

  // API 데이터 가져오기
  const fetchAITotalData = async (page = 1, company_name = '', field = '') => {
    try {
      setIsLoading(true);
      const response = await getTotalAIData(page, company_name, field, sorting);
      const filteredData = response.data.data || []; // 데이터가 없는 경우 빈 배열 반환
      setAITotalData(filteredData);
      setTotalPages(Math.ceil(filteredData.length / pageSize)); // 총 페이지 계산
    } catch (error) {
      console.error('데이터를 가져오는데 실패했습니다:', error);
      setAITotalData([]);
      setTotalPages(1); // 에러 시 총 페이지를 1로 설정
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 및 페이지 상태에 따라 데이터 가져오기
  useEffect(() => {
    fetchAITotalData(currentPage, localSelectedCompany, localSelectedField);
  }, [currentPage, localSelectedCompany, localSelectedField, sorting]);

  // 필터링 동작
  const handleCompanyChange = (value) => {
    setLocalSelectedCompany(value);
    setCurrentPage(1);
  };

  const handleFieldChange = (value) => {
    setLocalSelectedField(value);
    setCurrentPage(1);
  };

  const handleSortingChange = (value) => {
    setSorting(value);
    setCurrentPage(1);
  };

  const removeFilters = () => {
    setLocalSelectedCompany('');
    setLocalSelectedField('');
    setSorting('true');
    setCurrentPage(1);
  };

  const handleCheckboxChange = (okr) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(okr)
        ? prevSelected.filter((row) => row !== okr)
        : [...prevSelected, okr]
    );
  };

  const uniqueCompanies = Array.from(new Set(aiTotalData.map((okr) => okr.company_name)));
  const uniqueFields = Array.from(new Set(aiTotalData.map((okr) => okr.company_field)));

  return (
    <div className="page-container">
      <h1>저장된 AI 결과</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        <button onClick={removeFilters}>필터 초기화</button>
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
            <th>수정 OKR</th>
            <th>수정 이유</th>
            <th>가이드라인</th>
            <th>평가</th>
            <th>선택</th>
          </tr>
        </thead>
        <tbody>
          {aiTotalData.length > 0 ? (
            aiTotalData.map((okr, index) => (
              <tr key={okr.okr_id || index}>
                <td>{(currentPage - 1) * pageSize + index + 1}</td>
                <td>{okr.created_at ? okr.created_at.slice(0, 10) : '-'}</td>
                <td>{okr.company_name}</td>
                <td>{okr.company_field}</td>
                <td>{okr.team || '-'}</td>
                <td>{okr.is_objective ? 'o' : 'kr'}</td>
                <td>{okr.upper_objective || '-'}</td>
                <td style={{ fontSize: '12px' }}>{okr.input_sentence || '-'}</td>
                <td style={{ fontSize: '12px' }}>{okr.revision || '-'}</td>
                <td style={{ fontSize: '12px' }}>{okr.revision_description || '-'}</td>
                <td style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>{okr.guideline || '-'}</td>
                <td style={{ fontSize: '12px' }}>
                  {Array.isArray(okr.predictions) && okr.predictions.length > 0
                    ? okr.predictions.map((prediction, idx) => (
                        <span key={idx}>
                          {prediction.type}: {prediction.score}
                          {idx < okr.predictions.length - 1 ? ', ' : ''}
                        </span>
                      ))
                    : '-'}
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(okr)}
                    onChange={() => handleCheckboxChange(okr)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="13">데이터가 없습니다.</td>
            </tr>
          )}
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

export default OkrAITotalPage;
