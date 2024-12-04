import React, { useState , useEffect} from 'react';

const OkrAITotalPage = ({selectedData, onProcessDat}) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [processedData, setProcessedData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 15;


    const handleCheckboxChange = (okr) => {
      setSelectedRows((prevSelected) =>
        prevSelected.includes(okr)
          ? prevSelected.filter((row) => row !== okr)
          : [...prevSelected, okr]
      );
    };

    return (
        <div className="page-container">
          <h1>저장된 AI 결과</h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <label>기업명: </label>
          <select>
            <option value="">모든 기업</option>
            {selectedData.map((okr) => (
              <option key={okr.company} value={okr.company}>
                {okr.name}
              </option>
            ))}
          </select>
          <label>시간순: </label>
          <select>
            <option value="">최신순</option>
            <option value="">오래된순</option>
          </select>
        </div>
        
        <button
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
          {selectedData.map((okr) => (
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