import React, { useState , useEffect} from 'react';
import { getTotalAIData } from '../api/api';

const OkrAITotalPage = ({}) => {
    const [localSelectedCompany, setLocalSelectedCompany] = useState(''); // 기업 필터
    const [localSelectedField, setLocalSelectedField] = useState(''); // 분야 필터
    const [selectedRows, setSelectedRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const pageSize = 8;
    const [aiTotalData, setAITotalData] = useState([]);
    const [sorting, setSorting] = useState('true'); // 정렬 필터

    const fetchAITotalData = async (page = 1, company_name = '', field = '') => {
      try {
        setIsLoading(true);
        const response = await getTotalAIData(page, company_name, field, sorting);
        const filteredData = field
          ? response.data.data.filter((item) => item.field === field)
          : response.data.data;
        setAITotalData(filteredData || []); // 데이터를 저장
        setTotalPages(Math.ceil((filteredData || []).length / pageSize)); // 총 페이지 계산
      } catch (error) {
        console.error('데이터를 가져오는데 실패했습니다:', error);
        setAITotalData([])
      } finally {
        setIsLoading(false);
      }
    };
    useEffect(() => {
      fetchAITotalData();
    }, []);
    
    const handleCompanyChange = (value) => {
      setLocalSelectedCompany(value); // 기업 선택 업데이트
      setCurrentPage(1); // 페이지 초기화
    };
  
    const handleFieldChange = (value) => {
      setLocalSelectedField(value); // 분야 선택 업데이트
      setCurrentPage(1); // 페이지 초기화
    };
  
    const handleSortingChange = (value) => {
      setSorting(value); // 정렬 선택 업데이트
      setCurrentPage(1); // 페이지 초기화
    };
    const removeFilters = () => {
      setLocalSelectedCompany('');
      setLocalSelectedField('');
      setSorting('true');
      setCurrentPage(1);
      fetchAITotalData();
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
              value={localSelectedCompany || ''} // 'value'와 'onChange'를 함께 사용
            >
            <option value="">모든 기업</option>
            {uniqueCompanies.map((company, index) => (
              <option key={index} value={company}>
                {company}
              </option>
            ))}
          </select>
          <div>
          <label>분야: </label>
          <select
            onChange={(e) => handleFieldChange(e.target.value)}
            value={localSelectedField || ''} // 'value'와 'onChange' 확인
            >
            <option value="">모든 분야</option>
            {uniqueFields.map((field, index) => (
              <option key={index} value={field}>
                {field}
              </option>
            ))}
            </select>
        </div>
        <label>정렬: </label>
        <select
            onChange={(e) => handleSortingChange(e.target.value)}
            value={sorting} // 'value'와 'onChange' 확인
          >
            <option value="true">최신순</option>
            <option value="false">오래된순</option>
          </select>
        </div>
        
        <button onClick={() => removeFilters()}>필터 초기화</button>
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
          {aiTotalData.length > 0 ? (
            aiTotalData.map((okr, index) => (
            <tr key={okr.okr_id||index}>
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
          ))
        ) : (
          <tr>
            <td colSpan="9">데이터가 없습니다.</td>
          </tr>)
        }
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
}

export default OkrAITotalPage;